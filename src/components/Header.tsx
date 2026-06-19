import React, { useState, useEffect } from 'react';
import { Menu, Share2, Info, Check, HelpCircle, Download, Smartphone, Brain } from 'lucide-react';

interface HeaderProps {
  onOpenMemoryVault?: () => void;
}

export default function Header({ onOpenMemoryVault }: HeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(true); // Default to true as custom fallback helper
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      // Prevent automatic chrome prompt
      e.preventDefault();
      // Save the event for manual trigger
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If already launched standalone, remove badge
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction helper
      setShowInstallGuide(true);
    }
  };

  const shareInstructions = `Go to aistudio.google.com
Paste this in the System Instructions box
Click "Get Link" → Share that link with anyone ✅`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareInstructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-sm px-6 py-4" id="app-header">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 text-white rounded flex items-center justify-center font-bold text-xl tracking-tight leading-none shadow-xs">
            in
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 leading-tight">
              LinkedIn AI Agent <span className="text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200/50 px-2 py-0.5 rounded-full">v1.2</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Created by <span className="text-slate-700 font-semibold hover:text-blue-700 transition-colors">Ghazi Bilgrami</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenMemoryVault && (
            <button
              onClick={onOpenMemoryVault}
              className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-blue-200/50 transition-all cursor-pointer"
              id="open-memory-vault-header-btn"
              title="Open Memory & Saved Information Vault"
            >
              <Brain size={13} className="text-blue-600 animate-pulse" />
              <span>Memory Vault 🧠</span>
            </button>
          )}

          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border border-emerald-500/10 animate-pulse-slow"
              id="install-pwa-android-btn"
            >
              <Smartphone size={13} className="shrink-0" />
              <span>Install Android App 📱</span>
            </button>
          )}

          <button
            onClick={() => setShowShareModal(!showShareModal)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
            id="share-instructions-btn"
          >
            <Share2 size={13} />
            How to Share
          </button>
          
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            id="launch-aistudio-link"
          >
            Open AI Studio
          </a>
        </div>
      </div>

      {/* Android Installation Manual Guide Dialogue Overlay */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-250 text-slate-800">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider text-emerald-800">
                <span>📱</span> Install on Android Phone
              </h3>
              <button 
                onClick={() => setShowInstallGuide(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs p-1 bg-slate-100 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mb-4 font-normal leading-relaxed">
              If your phone didn't automatically trigger the launcher dialog, you can install it instantly in 2 simple taps:
            </p>

            <div className="space-y-3 mb-5 text-left">
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">1</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Tap your Google Chrome or default browser's <strong>three-dot menu (⋮)</strong> in the top-right corner.
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">2</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> from the options.
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">3</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Your Android operating system will immediately create a native standalone application icon on your home screen!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-xs font-bold tracking-tight shadow transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="absolute top-18 right-4 md:right-10 bg-white border border-slate-200 shadow-xl rounded-xl p-5 max-w-sm w-full z-50 animate-in fade-in slide-in-from-top-4 duration-200 text-slate-800">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <span className="text-blue-600">🚀</span> Share with Everyone
            </h3>
            <button 
              onClick={() => setShowShareModal(false)}
              className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
          
          <p className="text-xs text-slate-500 mb-4 font-normal leading-relaxed">
            Help your friends and network build their LinkedIn presence! You can share this exact agent structure dynamically using Google AI Studio.
          </p>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-700 relative mb-4">
            <pre className="whitespace-pre-wrap leading-relaxed select-all">
              {shareInstructions}
            </pre>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg text-xs font-semibold tracking-tight shadow transition-all cursor-pointer"
              id="copy-instructions-btn"
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? 'Copied Steps!' : 'Copy Instructions'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
