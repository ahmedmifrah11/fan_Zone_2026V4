import React from 'react';
import { GameSyncProvider, useGameSync } from '../context/GameSyncContext';
import { StudioStageView } from '../components/StudioStageView';

const StudioScreenContent: React.FC = () => {
  const { state, p2pConnected, p2pStatus } = useGameSync();

  if (!state) {
    return (
      <div className="w-screen h-screen bg-[#030914] text-white flex flex-col items-center justify-center cursor-none select-none font-['Outfit'] gap-3">
        <div className="text-3xl font-extrabold tracking-wide text-amber-400">
          FANZONE LIVE · CONNECTING STUDIO FEED...
        </div>
        <div className="text-sm font-['Plus_Jakarta_Sans'] text-slate-400 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${p2pConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          <span>{p2pStatus || 'Waiting for Host Controls to transmit initial stage...'}</span>
        </div>
      </div>
    );
  }

  return <StudioStageView state={state} isPreview={false} />;
};

export const StudioPage: React.FC = () => {
  return (
    <GameSyncProvider role="studio">
      <StudioScreenContent />
    </GameSyncProvider>
  );
};
