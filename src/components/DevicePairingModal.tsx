import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Tv, Tablet, Copy, Check, ExternalLink, X, Smartphone, QrCode } from 'lucide-react';

interface DevicePairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  redScore: number;
  blueScore: number;
}

export const DevicePairingModal: React.FC<DevicePairingModalProps> = ({
  isOpen,
  onClose,
  redScore,
  blueScore,
}) => {
  const [activeTab, setActiveTab] = useState<'studio' | 'host'>('studio');
  const [copied, setCopied] = useState(false);
  const [studioQrUrl, setStudioQrUrl] = useState<string>('');
  const [hostQrUrl, setHostQrUrl] = useState<string>('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const studioUrl = `${baseUrl}/studio`;
  const hostUrl = `${baseUrl}/host`;

  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(studioUrl, {
      width: 280,
      margin: 1.5,
      color: { dark: '#030914', light: '#FFFFFF' },
    })
      .then(setStudioQrUrl)
      .catch(() => {});

    QRCode.toDataURL(hostUrl, {
      width: 280,
      margin: 1.5,
      color: { dark: '#030914', light: '#FFFFFF' },
    })
      .then(setHostQrUrl)
      .catch(() => {});
  }, [isOpen, studioUrl, hostUrl]);

  if (!isOpen) return null;

  const currentUrl = activeTab === 'studio' ? studioUrl : hostUrl;
  const currentQr = activeTab === 'studio' ? studioQrUrl : hostQrUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#081326] border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 font-['Plus_Jakarta_Sans']">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Outfit'] text-white">
                Pair Devices to Live Instance
              </h3>
              <p className="text-xs text-slate-400">
                All connected devices share instance: <span className="text-amber-400 font-mono">fanzone-live-session</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Score Strip */}
        <div className="my-4 py-2 px-4 rounded-xl bg-[#030914] border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Broadcast Active</span>
          </div>
          <div className="font-['JetBrains_Mono'] font-bold text-amber-400">
            RED <span className="text-rose-400">{redScore}</span> · BLUE <span className="text-sky-400">{blueScore}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Studio TV Screen</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('host')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'host'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>iPad / Host Controller</span>
          </button>
        </div>

        {/* QR Code & Instructions */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
          <div className="p-3 bg-white rounded-2xl shadow-xl mb-4">
            {currentQr ? (
              <img
                src={currentQr}
                alt="Device QR Code"
                className="w-48 h-48 object-contain rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                Generating QR Code...
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-300 mb-2">
            {activeTab === 'studio'
              ? 'Point your TV browser or secondary screen camera at this QR code to launch the 16:9 Studio Display.'
              : 'Scan with your iPad or mobile phone camera to open the Host Console cockpit.'}
          </p>

          {/* Direct Link + Copy Button */}
          <div className="w-full mt-2 flex items-center gap-2 bg-[#030914] border border-slate-800 rounded-xl p-1.5 pl-3">
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
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            Works on iOS, Android, Smart TVs, Mac & PC
          </span>
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Open in New Window</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
