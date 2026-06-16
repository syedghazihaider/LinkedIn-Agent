import React, { useState } from 'react';
import { Menu, Share2, Info, Check, HelpCircle } from 'lucide-react';

export default function Header() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

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

        <div className="flex items-center gap-2">
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
