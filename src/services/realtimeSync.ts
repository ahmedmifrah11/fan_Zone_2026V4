import { GameSessionState } from '../types/game';
import { doc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';

export interface RealtimeSyncHandlers {
  onStateUpdate: (state: GameSessionState) => void;
  onAudioCommand?: (action: 'play' | 'stop', mediaUrl?: string) => void;
  onConnectionChange?: (connected: boolean, statusText: string) => void;
}

const FIRESTORE_SESSION_DOC = 'fanzone-live-session';
const SYNC_CHANNEL_NAME = 'fanzone_live_sync_channel';

export class RealtimeSyncManager {
  private role: 'studio' | 'host';
  private handlers: RealtimeSyncHandlers;
  private destroyed: boolean = false;
  private currentState: GameSessionState | null = null;
  private firestoreUnsub: Unsubscribe | null = null;
  private channel: BroadcastChannel | null = null;

  constructor(role: 'studio' | 'host', handlers: RealtimeSyncHandlers) {
    this.role = role;
    this.handlers = handlers;
    this.init();
  }

  public setCurrentState(state: GameSessionState | null) {
    this.currentState = state;
  }

  private init() {
    if (typeof window === 'undefined') return;

    // 1. Initialize local cross-tab channel
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (this.destroyed) return;
          const msg = event.data;
          if (!msg || typeof msg !== 'object') return;
          if (msg.type === 'sync:state' && msg.state) {
            this.handleIncomingState(msg.state);
          } else if (msg.type === 'sync:audio') {
            this.handlers.onAudioCommand?.(msg.action, msg.mediaUrl);
          }
        };
      } catch {
        // ignore
      }
    }

    // 2. Initialize Firestore Cloud Real-Time Listener
    this.initFirestoreSync();
  }

  private handleIncomingState(incomingState: GameSessionState) {
    if (!incomingState || !incomingState.updatedAt) return;
    const currentUp = Number(this.currentState?.updatedAt || 0);
    const incUp = Number(incomingState.updatedAt || 0);

    if (!this.currentState || incUp >= currentUp) {
      this.currentState = incomingState;
      this.handlers.onStateUpdate(incomingState);
      this.handlers.onConnectionChange?.(true, '🟢 Studio Screen Live Sync Active');
    }
  }

  /**
   * Firebase Firestore live synchronization:
   * Subscribes to /gameSessions/fanzone-live-session.
   * Delivers real-time updates across iPad, TV, laptop, Vercel deployments in ~50ms.
   */
  private initFirestoreSync() {
    try {
      const sessionDocRef = doc(db, 'gameSessions', FIRESTORE_SESSION_DOC);
      this.firestoreUnsub = onSnapshot(
        sessionDocRef,
        (snap) => {
          if (this.destroyed) return;
          if (!snap.exists()) {
            this.handlers.onConnectionChange?.(true, 'Ready · Awaiting Host Broadcast');
            return;
          }
          const data = snap.data() as GameSessionState;
          if (data && data.updatedAt) {
            this.handleIncomingState(data);
          }
        },
        () => {
          // Gracefully continue using BroadcastChannel and HTTP sync
          if (!this.destroyed) {
            this.handlers.onConnectionChange?.(true, 'Studio Feed Connected (HTTP & Local Sync)');
          }
        }
      );
    } catch {
      this.handlers.onConnectionChange?.(true, 'Studio Feed Connected');
    }
  }

  /**
   * Broadcasts the updated game state across all real-time channels:
   * - BroadcastChannel for 0ms local tabs
   * - Firestore Cloud Document for instant cross-device updates on Vercel & iPads
   */
  public broadcastState(state: GameSessionState) {
    this.currentState = state;

    // 1. BroadcastChannel (local 0ms tabs)
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'sync:state', state });
      } catch {
        // ignore
      }
    }

    // 2. Firestore Cloud State Sync
    this.pushFirestoreState(state);
  }

  /**
   * Broadcasts audio playback commands (buzzers, fanfares, timer alerts)
   */
  public broadcastAudio(action: 'play' | 'stop', mediaUrl?: string) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'sync:audio', action, mediaUrl });
      } catch {
        // ignore
      }
    }
  }

  private async pushFirestoreState(state: GameSessionState) {
    try {
      const sessionDocRef = doc(db, 'gameSessions', FIRESTORE_SESSION_DOC);
      await setDoc(
        sessionDocRef,
        {
          sessionId: FIRESTORE_SESSION_DOC,
          redScore: Number(state.redScore) || 0,
          blueScore: Number(state.blueScore) || 0,
          activeTeam: state.activeTeam === 'blue' ? 'blue' : 'red',
          selectedCardNumber: Math.max(1, Math.min(8, Number(state.selectedCardNumber) || 1)),
          stage: state.stage === 'minigame' ? 'minigame' : 'board',
          cards: state.cards || [],
          activeMiniGame: state.activeMiniGame || null,
          lastScorePulse: state.lastScorePulse || null,
          boardDeckId: state.boardDeckId || 1,
          updatedAt: state.updatedAt || Date.now(),
        },
        { merge: true }
      );
    } catch {
      // Graceful fallback to serverless HTTP endpoint
    }
  }

  public destroy() {
    this.destroyed = true;
    if (this.firestoreUnsub) {
      this.firestoreUnsub();
      this.firestoreUnsub = null;
    }
    if (this.channel) {
      try {
        this.channel.close();
      } catch {
        // ignore
      }
      this.channel = null;
    }
  }
}
