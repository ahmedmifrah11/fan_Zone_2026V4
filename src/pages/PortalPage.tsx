import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { Tv, Tablet, Database, QrCode, Copy, Check, ArrowRight, ShieldCheck, Radio } from 'lucide-react';
import { GameSyncProvider, useGameSync } from '../context/GameSyncContext';

const PortalBody: React.FC = () => {
  const { state } = useGameSync();
  const [activeQrTab, setActiveQrTab] = useState<'studio' | 'host'>('studio');
  const [copied, setCopied] = useState(false);
  const [studioQr, setStudioQr] = useState<string>('');
  const [hostQr, setHostQr] = useState<string>('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const studioUrl = `${baseUrl}/studio`;
  const hostUrl = `${baseUrl}/host`;

  useEffect(() => {
    QRCode.toDataURL(studioUrl, {
      width: 260,
      margin: 1.5,
      color: { dark: '#030914', light: '#FFFFFF' },
    }).then(setStudioQr).catch(() => {});

    QRCode.toDataURL(hostUrl, {
      width: 260,
      margin: 1.5,
      color: { dark: '#030914', light: '#FFFFFF' },
    }).then(setHostQr).catch(() => {});
  }, [studioUrl, hostUrl]);

  const currentUrl = activeQrTab === 'studio' ? studioUrl : hostUrl;
  const currentQr = activeQrTab === 'studio' ? studioQr : hostQr;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const redScore = state?.redScore ?? 0;
  const blueScore = state?.blueScore ?? 0;
  const stageName = state?.stage === 'board' ? 'Main 2×4 Board' : state?.activeMiniGame?.categoryTitle || 'Mini-Game';

  return (
    <div className="min-h-screen bg-[#030914] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Broadcast Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#081326] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Outfit'] text-white tracking-tight">
              FanZone Live Broadcast Portal
            </h1>
            <p className="text-xs text-slate-400">
              Universal Single Shared Instance for All Devices
            </p>
          </div>
        </div>

        {/* Live Score Pill */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-['JetBrains_Mono'] font-bold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>RED {redScore} · BLUE {blueScore}</span>
            <span className="text-slate-500 font-normal">({stageName})</span>
          </div>
        </div>
      </header>

      {/* Hero Intro */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Cloud Real-Time Sync Active (Instance: fanzone-live-session)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight text-white mb-3">
            Select Your Device Role
          </h2>
          <p className="text-sm text-slate-400">
            All devices connect automatically to the exact same live game session in real-time. Open the TV screen on your monitor and control it from your iPad or phone.
          </p>
        </div>

        {/* 3 Core Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Studio Display */}
          <Link
            to="/studio"
            className="group relative bg-[#081326] border border-slate-800 hover:border-amber-500/60 rounded-3xl p-6 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Tv className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-sky-400 tracking-wider uppercase font-['JetBrains_Mono']">
                16:9 Broadcast Display
              </span>
              <h3 className="text-xl font-bold font-['Outfit'] text-white mt-1 mb-2">
                Studio Screen View
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For smart TVs, projectors, venue monitors, or external displays. Fullscreen clean spectator view with sound effects and dynamic board reveals.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
              <span>Launch Studio Display</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* iPad Host Console */}
          <Link
            to="/host"
            className="group relative bg-[#0E2240] border-2 border-amber-500/50 hover:border-amber-400 rounded-3xl p-6 transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] flex flex-col justify-between"
          >
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] tracking-wide uppercase">
              Operator Cockpit
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Tablet className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase font-['JetBrains_Mono']">
                Remote Control Cockpit
              </span>
              <h3 className="text-xl font-bold font-['Outfit'] text-white mt-1 mb-2">
                iPad Host Console
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                For iPad, tablet, or laptop operator. Complete control over score increments, card reveals, image unblur slider, timer, and Tic-Tac-Toe referee moves.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
              <span>Launch Host Controls</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Content Bank Manager */}
          <Link
            to="/content"
            className="group relative bg-[#081326] border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-purple-400 tracking-wider uppercase font-['JetBrains_Mono']">
                Trivia Bank
              </span>
              <h3 className="text-xl font-bold font-['Outfit'] text-white mt-1 mb-2">
                Content Manager
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add, edit, and organize kits, stadium photos, superstar action shots, and football quiz questions with blur adjustments.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white">
              <span>Manage Questions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* QR Code Quick-Pair Section for TV & Mobile */}
        <div className="bg-[#081326] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="p-4 bg-white rounded-2xl shadow-2xl shrink-0">
            {currentQr ? (
              <img
                src={currentQr}
                alt="QR Code"
                className="w-44 h-44 object-contain rounded-lg"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <QrCode className="w-4 h-4 text-amber-400" />
                <h4 className="text-base font-bold font-['Outfit'] text-white">
                  Instant Device Pairing QR Code
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                Scan this QR code with your iPad or TV browser camera to instantly join the exact same live instance without typing URLs.
              </p>
            </div>

            {/* Toggle QR Target */}
            <div className="flex gap-2 max-w-sm">
              <button
                type="button"
                onClick={() => setActiveQrTab('studio')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeQrTab === 'studio'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Scan for Studio Screen
              </button>
              <button
                type="button"
                onClick={() => setActiveQrTab('host')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeQrTab === 'host'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Scan for iPad Host
              </button>
            </div>

            {/* Copyable Link Bar */}
            <div className="flex items-center gap-2 bg-[#030914] border border-slate-800 rounded-xl p-1.5 pl-3 max-w-lg">
              <span className="text-xs font-mono text-slate-400 truncate flex-1">
                {currentUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const PortalPage: React.FC = () => {
  return (
    <GameSyncProvider role="studio">
      <PortalBody />
    </GameSyncProvider>
  );
};
