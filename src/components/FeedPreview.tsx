import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Repeat, Heart, Send, Calendar, Lightbulb, Image as ImageIcon, Terminal, Code2, Loader2, Sparkles, Maximize2 } from 'lucide-react';
import { LinkedInPost } from '../types';
import ImageViewerModal from './ImageViewerModal';

// Shared modular SVG generation helper functions
export const getTerminalSvgString = (simulation: any): string => {
  if (!simulation) return "";
  const { directory, command, outputLines } = simulation;

  const width = 620;
  const headerHeight = 42;
  const padding = 22;
  const lineHeight = 21;
  const linesCount = (outputLines || []).length + 2; 
  const height = headerHeight + padding + (linesCount * lineHeight) + padding + 15;

  const escapeXml = (unsafe: string) => {
    return (unsafe || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  let textElements = "";
  let yOffset = headerHeight + padding + lineHeight - 5;

  textElements += `
    <text x="${padding}" y="${yOffset}" font-family="JetBrains Mono, Courier New, monospace" font-size="12" fill="#58a6ff" font-weight="bold">
      user@ghazi-pro:<tspan fill="#3fb950">${escapeXml(directory || "~")}</tspan><tspan fill="#c9d1d9">$</tspan> <tspan fill="#ffffff" font-weight="bold">${escapeXml(command || "")}</tspan>
    </text>
  `;

  (outputLines || []).forEach((line: string) => {
    yOffset += lineHeight;
    let fill = "#c9d1d9";
    let weight = "normal";
    if (line.includes("Successfully") || line.includes("SUCCESS") || line.includes("completed") || line.includes("done") || line.includes("OK")) {
      fill = "#3fb950";
      weight = "bold";
    } else if (line.includes("Step") || line.includes("Building") || line.includes("Creating") || line.includes("Pushing")) {
      fill = "#58a6ff";
      weight = "bold";
    } else if (line.includes("warning") || line.includes("WARN")) {
      fill = "#d29922";
    } else if (line.includes("Executing") || line.includes("Running") || line.includes("index")) {
      fill = "#8b949e";
    }

    textElements += `
      <text x="${padding + 4}" y="${yOffset}" font-family="JetBrains Mono, Courier New, monospace" font-size="11.5" fill="${fill}" font-weight="${weight}">
        ${escapeXml(line)}
      </text>
    `;
  });

  yOffset += lineHeight;
  textElements += `
    <text x="${padding}" y="${yOffset}" font-family="JetBrains Mono, Courier New, monospace" font-size="12" fill="#8b949e" opacity="0.8">
      $ _
    </text>
  `;

  return `
    <svg xmlns="http://www.w3.org/2500/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <rect width="100%" height="100%" rx="12" fill="#0c1017" stroke="#30363d" stroke-width="1.5" />
      <rect width="100%" height="${headerHeight}" rx="12" fill="#161b22" />
      <rect y="22" width="100%" height="20" fill="#161b22" />
      <line x1="0" y1="${headerHeight}" x2="${width}" y2="${headerHeight}" stroke="#30363d" stroke-width="1" />

      <circle cx="22" cy="21" r="6" fill="#ff5f56" />
      <circle cx="42" cy="21" r="6" fill="#ffbd2e" />
      <circle cx="62" cy="21" r="6" fill="#27c93f" />

      <text x="50%" y="25" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="bold" fill="#8b949e" text-anchor="middle">
        bash • ${escapeXml(directory || "~")}
      </text>

      <text x="${width - 20}" y="25" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" fill="#2ea043" font-weight="bold" text-anchor="end">
        ● LIVE PROCESS
      </text>

      ${textElements}
    </svg>
  `.trim();
};

export const getCodeSvgString = (simulation: any): string => {
  if (!simulation) return "";
  const { language, fileName, codeLineList } = simulation;

  const width = 620;
  const headerHeight = 42;
  const padding = 22;
  const lineHeight = 21;
  const linesCount = (codeLineList || []).length; 
  const height = headerHeight + padding + (linesCount * lineHeight) + padding + 10;

  const escapeXml = (unsafe: string) => {
    return (unsafe || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  let textElements = "";
  let yOffset = headerHeight + padding + 14;

  (codeLineList || []).forEach((line: string, index: number) => {
    const lineNum = index + 1;
    textElements += `
      <text x="${padding + 8}" y="${yOffset}" font-family="JetBrains Mono, Courier New, monospace" font-size="11.5" fill="#4b5563" text-anchor="end">
        ${lineNum}
      </text>
      <text x="${padding + 28}" y="${yOffset}" font-family="JetBrains Mono, Courier New, monospace" font-size="11.5" fill="#e2e8f0">
        ${escapeXml(line)}
      </text>
    `;
    yOffset += lineHeight;
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <rect width="100%" height="100%" rx="12" fill="#0b0f19" stroke="#1e293b" stroke-width="1.5" />
      <rect width="100%" height="${headerHeight}" rx="12" fill="#111827" />
      <rect y="22" width="100%" height="20" fill="#111827" />
      <line x1="0" y1="${headerHeight}" x2="${width}" y2="${headerHeight}" stroke="#1e293b" stroke-width="1" />

      <circle cx="22" cy="21" r="6" fill="#ff5f56" />
      <circle cx="42" cy="21" r="6" fill="#ffbd2e" />
      <circle cx="62" cy="21" r="6" fill="#27c93f" />

      <text x="50%" y="25" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="bold" fill="#9ca3af" text-anchor="middle">
        📝 ${escapeXml(fileName || "snippet.py")} • ${escapeXml(language || "Code")}
      </text>

      <text x="${width - 20}" y="25" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#60a5fa" font-weight="bold" text-anchor="end">
        IDE MODE
      </text>

      ${textElements}
    </svg>
  `.trim();
};

export const getQuoteCardSvgString = (post: any): string => {
  if (!post) return "";
  const { topic, hook } = post;

  const width = 600;
  const height = 400;

  const escapeXml = (unsafe: string) => {
    return (unsafe || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const hookLines = (hook || "").split('\n');
  let hookTextContent = "";
  let yOffset = 180;
  hookLines.forEach((line: string) => {
    hookTextContent += `
      <text x="50%" y="${yOffset}" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-style="italic" fill="#ffffff" text-anchor="middle" font-weight="500">
        "${escapeXml(line)}"
      </text>
    `;
    yOffset += 28;
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="quoteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e3a8a" />
          <stop offset="50%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" rx="16" fill="url(#quoteGrad)" stroke="#1e293b" stroke-width="2" />
      <circle cx="50" cy="50" r="120" fill="#ffffff" opacity="0.015" />
      <circle cx="550" cy="350" r="160" fill="#2563eb" opacity="0.04" />

      <text x="50%" y="115" font-family="Georgia, serif" font-size="110" fill="#2563eb" opacity="0.32" text-anchor="middle">
        “
      </text>

      <text x="50%" y="138" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" fill="#3b82f6" letter-spacing="2" text-anchor="middle">
        ${escapeXml(topic || "INSIGHTS").toUpperCase()}
      </text>

      ${hookTextContent}

      <line x1="150" y1="330" x2="450" y2="330" stroke="#1e293b" stroke-width="1" />
      <text x="50%" y="355" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">
        LinkedIn Agent Tool • Created by Syed Ghazi Haider
      </text>
    </svg>
  `.trim();
};

interface FeedPreviewProps {
  posts: LinkedInPost[];
  profileContext?: any;
}

export default function FeedPreview({ posts, profileContext }: FeedPreviewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customInputValue, setCustomInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customResponse, setCustomResponse] = useState<any | null>(null);
  const [customError, setCustomError] = useState("");
  const [copiedCustom, setCopiedCustom] = useState(false);
  const [selectedMockupTab, setSelectedMockupTab] = useState<'terminal' | 'ide' | 'quote'>('terminal');

  // Image Fullscreen Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTitle, setViewerTitle] = useState("");
  const [viewerSvg, setViewerSvg] = useState("");
  const [viewerFilename, setViewerFilename] = useState("");

  const handleOpenViewer = (title: string, svg: string, filename: string) => {
    setViewerTitle(title);
    setViewerSvg(svg);
    setViewerFilename(filename);
    setViewerOpen(true);
  };

  const copyPostContent = (post: LinkedInPost, index: number) => {
    const formattedPost = `Topic: ${post.topic}\n\n${post.hook}\n\n${post.fullPost}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(formattedPost);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyCustomPost = () => {
    if (!customResponse) return;
    const { post } = customResponse;
    const formattedPost = `Topic: ${post.topic}\n\n${post.hook}\n\n${post.fullPost}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(formattedPost);
    setCopiedCustom(true);
    setTimeout(() => setCopiedCustom(false), 2000);
  };

  const downloadTerminalAsSVG = (simulation: any) => {
    if (!simulation) return;
    const svgContent = getTerminalSvgString(simulation);
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `terminal_${(simulation.directory || 'simulation').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCodeAsSVG = (simulation: any) => {
    if (!simulation) return;
    const svgContent = getCodeSvgString(simulation);
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `code_${(simulation.fileName || 'snippet').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadQuoteCardAsSVG = (post: any) => {
    if (!post) return;
    const svgContent = getQuoteCardSvgString(post);
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quote_${(post.topic || 'post').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const generateCustomTopic = async (topicName: string) => {
    if (!topicName.trim()) return;
    setIsGenerating(true);
    setCustomError("");
    try {
      const response = await fetch("/api/generate-topic-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topicName,
          profileContext: profileContext || {}
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate custom post draft.");
      }
      const data = await response.json();
      setCustomResponse(data);
    } catch (err: any) {
      setCustomError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInputValue.trim()) {
      generateCustomTopic(customInputValue);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="feed-preview-root">
      {/* Intro Stats Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="bg-purple-100 text-purple-700 px-2.5 py-1 text-[10px] font-bold rounded uppercase shrink-0 mt-0.5 tracking-wider self-start">
            Step 3
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">Generated LinkedIn Content (Drafts)</h4>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Each post is written with a high-impact scroll-stopping hook (first 2 lines), conversational short paragraphs (maximum 2 lines each), an engaging Call to Action question, and 5 trending hashtags.
            </p>
          </div>
        </div>
        <div className="text-center bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-lg shrink-0">
          <span className="text-xs uppercase tracking-wider text-blue-600 font-bold block">WORD LEVEL</span>
          <span className="text-slate-800 font-bold text-lg">150 - 250 words</span>
        </div>
      </div>

      {/* 🚀 Interactive Custom Topic Post Creator with Terminal Simulation Mockups */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl -z-10" />
        
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-blue-400 animate-pulse" />
          <h4 className="font-bold text-slate-100 text-sm uppercase tracking-wider">
            Custom Topic Post Builder & Terminal Simulator
          </h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
          Write any professional topic (like <strong>Docker, Python, AWS, SQL</strong>) or select a popular option. The agent will craft a ready-to-use scroll-stopping LinkedIn post tailored to your experience, complete with an incredible, **highly realistic terminal logs simulation mockup** to visually prove your technical competence!
        </p>

        {/* Preset quick buttons */}
        <div className="space-y-2 mb-6">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Quick Select Preset Topics</span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "🐳 docker build", topic: "Dockerizing backend APIs for production environments and optimising layers" },
              { label: "📦 git conflict", topic: "Safely resolving Git rebase merge conflicts in team code branches" },
              { label: "🐍 python scripts", topic: "Building Python scraping automation and script schedulers" },
              { label: "☁️ aws deploy", topic: "Deploying secure serverless containers to AWS Fargate and S3" },
              { label: "🗄️ postgres query", topic: "Optimising complex PostgreSQL JOIN queries with indexing" },
              { label: "💻 react hooks", topic: "Refactoring state management into streamlined React custom hooks" }
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCustomInputValue(p.topic);
                  generateCustomTopic(p.topic);
                }}
                disabled={isGenerating}
                className="bg-slate-850 hover:bg-slate-800 text-slate-205 text-xs px-3 py-1.5 rounded-lg border border-slate-700/60 hover:border-blue-500/50 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Code2 size={12} className="text-blue-400" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input execution bar */}
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/80 transition-all font-sans"
            placeholder="Type your own topic... e.g., 'Writing clean Golang APIs' or 'Refactoring CSS classes to clean Tailwind'"
            value={customInputValue}
            onChange={(e) => setCustomInputValue(e.target.value)}
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating || !customInputValue.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Compiling Post & Terminal Logs...
              </>
            ) : (
              <>
                <Terminal size={15} />
                Generate Custom Post
              </>
            )}
          </button>
        </form>

        {customError && (
          <div className="bg-red-950/40 border border-red-800/40 text-red-200 text-xs p-3.5 rounded-xl mt-4">
            ⚠️ {customError}
          </div>
        )}
      </div>

      {/* Render Custom Response if active */}
      {customResponse && (
        <div className="border-2 border-blue-500/40 rounded-2xl p-1 bg-blue-500/5">
          <div className="bg-[#ffffff] border border-slate-200 shadow-md rounded-xl overflow-hidden max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Header copy and stats */}
            <div className="p-4 border-b border-slate-100 bg-blue-50/20 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-700 text-white rounded-full font-bold text-sm flex items-center justify-center">
                  ✨
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5 flex-wrap">
                    Custom Simulated Post Generated
                    <span className="text-[10px] bg-blue-100 text-blue-700 border border-blue-200/50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      TERMINAL ENABLED
                    </span>
                    {customResponse.isQuotaFallback && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200/50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        QUOTA PROTECTION ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                     Topic matches: <strong className="text-slate-600">{customResponse.post.topic}</strong>
                  </p>
                  {customResponse.isQuotaFallback && (
                    <div className="mt-2 bg-amber-50 text-amber-800 border border-amber-100 text-[10px] p-2 py-1.5 rounded-lg leading-relaxed font-normal max-w-sm">
                      💡 <strong>Quota Protection:</strong> A pre-modeled, gorgeous template has been generated offline matching your exact custom topic.
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={copyCustomPost}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-700 p-1.5 hover:bg-white rounded border border-slate-200 hover:border-blue-200 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                {copiedCustom ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-650">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Post Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Post Content */}
            <div className="p-6 space-y-5">
              <div className="space-y-4 font-sans text-sm md:text-[15px] text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                <div className="bg-blue-50 border-l-4 border-blue-700 p-3.5 rounded-r-lg font-medium text-slate-950 italic">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-700 block mb-1">
                    🪝 SCROLL STOPPING HOOK:
                  </span>
                  {customResponse.post.hook}
                </div>

                <div className="pt-2 text-slate-700 leading-relaxed text-sm">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">
                    📝 COPYABLE POST DESCRIPTION:
                  </span>
                  {customResponse.post.fullPost}
                </div>
              </div>

              {/* Visual Mockup Chooser Tab bar */}
              <div className="space-y-3 mt-5 text-left animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#2563eb] block">
                    🎨 Visual Assets Studio (Select Your LinkedIn Attachment):
                  </span>
                  
                  {/* Small switcher buttons */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedMockupTab('terminal')}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                        selectedMockupTab === 'terminal'
                          ? 'bg-blue-600 text-white shadow-xs animate-in zoom-in-95 duration-100'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Terminal size={11} />
                      Bash Terminal
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMockupTab('ide')}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                        selectedMockupTab === 'ide'
                          ? 'bg-blue-600 text-white shadow-xs animate-in zoom-in-95 duration-100'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Code2 size={11} />
                      IDE Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMockupTab('quote')}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                        selectedMockupTab === 'quote'
                          ? 'bg-blue-600 text-white shadow-xs animate-in zoom-in-95 duration-100'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles size={11} />
                      Quote Card
                    </button>
                  </div>
                </div>

                {/* Tab content 1: Terminal simulation */}
                {selectedMockupTab === 'terminal' && (
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0c1017] shadow-xl font-mono text-[11px] md:text-xs min-h-[220px] flex flex-col justify-between animate-in fade-in duration-200">
                    <div>
                      {/* Top title bar */}
                      <div className="bg-[#161b22] px-4 py-2.5 flex items-center justify-between border-b border-slate-800 select-none">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-slate-300 font-sans text-xs font-semibold">
                          bash • {customResponse.terminalSimulation?.directory || "~"}
                        </span>
                        <div className="flex items-center gap-1 bg-[#238636]/15 border border-[#238636]/30 px-2 py-0.5 rounded text-[9px] font-bold text-[#2ea043]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2ea043] animate-pulse" />
                          LIVE PROCESS
                        </div>
                      </div>

                      {/* Terminal body logs */}
                      <div className="p-5 space-y-2.5 text-slate-300 overflow-x-auto text-left leading-relaxed">
                        <div className="flex items-center gap-1.5 text-[#58a6ff]">
                          <span>user@ghazi-pro:</span>
                          <span className="text-[#3fb950]">{customResponse.terminalSimulation?.directory || "~"}</span>
                          <span className="text-slate-100">$</span>
                          <span className="text-white font-bold tracking-tight">{customResponse.terminalSimulation?.command || "run"}</span>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {customResponse.terminalSimulation?.outputLines?.map((line: string, lIdx: number) => {
                            let color = "text-[#c9d1d9]";
                            if (line.includes("Successfully") || line.includes("SUCCESS") || line.includes("completed") || line.includes("done")) {
                              color = "text-[#3fb950] font-semibold";
                            } else if (line.includes("Step") || line.includes("Building")) {
                              color = "text-[#58a6ff] font-medium";
                            } else if (line.includes("warning") || line.includes("WARN")) {
                              color = "text-[#d29922]";
                            } else if (line.includes("Executing") || line.includes("Running")) {
                              color = "text-slate-400";
                            }
                            return (
                              <div key={lIdx} className={`${color} whitespace-pre-wrap pl-1`}>
                                {line}
                              </div>
                            );
                          })}
                        </div>

                        {/* Prompt cursor */}
                        <div className="flex items-center gap-1 text-slate-400 pt-1.5 animate-pulse">
                          <span>$ _</span>
                        </div>
                      </div>
                    </div>

                    {/* Download bar */}
                    <div className="bg-[#161b22] px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-[11px] text-slate-400">
                      <span className="text-left sm:max-w-[320px]">⚡ Download this professional vector terminal run logs simulation or open in zoomable full screen!</span>
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button 
                          type="button"
                          onClick={() => handleOpenViewer("Bash Terminal Simulation Log", getTerminalSvgString(customResponse.terminalSimulation), "terminal_logs")}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 border border-slate-700"
                          title="Open zoomable full screen player"
                        >
                          <Maximize2 size={12} fill="none" />
                          Full Screen 🔍
                        </button>
                        <button 
                          type="button"
                          onClick={() => downloadTerminalAsSVG(customResponse.terminalSimulation)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 shadow-lg hover:shadow-xl hover:scale-102 flex-row active:scale-98"
                          id="btn-download-terminal-image"
                        >
                          <ImageIcon size={12} />
                          Download Terminal SVG
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            const value = `${customResponse.terminalSimulation?.command}\n${customResponse.terminalSimulation?.outputLines?.join('\n')}`;
                            navigator.clipboard.writeText(value);
                            alert("Logs copied to clipboard!");
                          }}
                          className="text-slate-350 hover:text-white font-semibold transition-all cursor-pointer bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs hover:border-slate-500"
                        >
                          Copy Logs
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 2: IDE Editor mockup */}
                {selectedMockupTab === 'ide' && (
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0b0f19] shadow-xl font-mono text-[11px] md:text-xs min-h-[220px] flex flex-col justify-between animate-in fade-in duration-200">
                    <div>
                      {/* Top title bar */}
                      <div className="bg-[#111827] px-4 py-2.5 flex items-center justify-between border-b border-slate-800 select-none">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-slate-300 font-sans text-xs font-semibold">
                          📝 {customResponse.codeSimulation?.fileName || "config.yaml"} ({customResponse.codeSimulation?.language || "yaml"})
                        </span>
                        <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest bg-blue-900/20 border border-blue-900/40 px-2.5 py-0.5 rounded">
                          IDE SNIPPET
                        </div>
                      </div>

                      {/* IDE text environment */}
                      <div className="p-5 font-mono text-left space-y-1.5 bg-[#0b0f19] overflow-x-auto text-[#e2e8f0]">
                        {(customResponse.codeSimulation?.codeLineList || [
                          "# Sample configurations",
                          "status: ready"
                        ]).map((line: string, index: number) => (
                          <div key={index} className="flex gap-4">
                            <span className="text-slate-600 block w-5 text-right select-none">{index + 1}</span>
                            <span className="whitespace-pre">{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Download bar */}
                    <div className="bg-[#111827] px-4 py-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-[11px] text-slate-400">
                      <span className="text-left sm:max-w-[320px]">⚡ Download this clean IDE-style syntax-vibrant code editor snippet or display in zoomable full screen!</span>
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button 
                          type="button"
                          onClick={() => handleOpenViewer("IDE Code Snippet mockup", getCodeSvgString(customResponse.codeSimulation), "ide_snippet")}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 border border-slate-700"
                          title="Open zoomable full screen player"
                        >
                          <Maximize2 size={12} fill="none" />
                          Full Screen 🔍
                        </button>
                        <button 
                          type="button"
                          onClick={() => downloadCodeAsSVG(customResponse.codeSimulation)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 shadow-lg hover:shadow-xl hover:scale-102 active:scale-98"
                        >
                          <ImageIcon size={12} />
                          Download IDE Code SVG
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 3: High-impact quote card */}
                {selectedMockupTab === 'quote' && (
                  <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden text-center min-h-[220px] flex flex-col justify-between animate-in fade-in duration-200">
                    <div className="absolute top-2 left-3 text-7xl font-serif text-blue-500/10 select-none">“</div>
                    <div className="absolute bottom-2 right-3 text-7xl font-serif text-blue-500/10 select-none">”</div>
                    
                    <div className="my-auto py-4">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-3.0">
                        {customResponse.post.topic || "INSIGHTS"}
                      </span>
                      <p className="text-sm md:text-base font-medium font-sans text-slate-100 italic leading-relaxed px-4 py-1 whitespace-pre-line text-center">
                        "{customResponse.post.hook}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/65 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-sans mt-4">
                      <span>Designed & branded vector output</span>
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button 
                          type="button"
                          onClick={() => handleOpenViewer("High-Impact Quote Card", getQuoteCardSvgString(customResponse.post), "quote_card")}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 border border-slate-700"
                          title="Open zoomable full screen player"
                        >
                          <Maximize2 size={12} fill="none" />
                          Full Screen 🔍
                        </button>
                        <button 
                          type="button"
                          onClick={() => downloadQuoteCardAsSVG(customResponse.post)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 self-end sm:self-auto"
                        >
                          <ImageIcon size={12} />
                          Download Quote Card SVG
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hashtags and suggestions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  <span>Recommend Posting: <strong>{customResponse.post.bestTimeToPost}</strong></span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {customResponse.post.hashtags?.map((tag: string, tIdx: number) => (
                    <span key={tIdx} className="bg-slate-100 text-slate-655 px-2 py-0.5 rounded font-mono font-medium text-[11px]">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated reactions */}
            <div className="border-t border-slate-100 py-2.5 px-4 bg-slate-50/35 flex items-center justify-around text-xs font-semibold text-slate-500">
              <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-default">
                <Heart size={14} />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-default">
                <MessageSquare size={14} />
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-default">
                <Repeat size={14} />
                <span>Repost</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-default">
                <Send size={14} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Three feeds */}
      <h3 className="font-bold text-slate-850 text-sm uppercase tracking-wider mt-10 mb-2">💡 Your Curated Portfolio Post Options</h3>
      <div className="space-y-10">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden max-w-2xl mx-auto" id={`post-container-${idx}`}>
            {/* Post Header: LinkedIn Feed Mimic */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full font-bold text-sm flex items-center justify-center uppercase">
                  P{idx + 1}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                    LinkedIn Post #{idx + 1}
                    <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200/50 px-2 py-0.5 rounded-full font-semibold">
                      TAILORED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                     🎯 {post.topic}
                  </p>
                </div>
              </div>

              {/* Copy Utility Button */}
              <button
                onClick={() => copyPostContent(post, idx)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 p-1.5 hover:bg-slate-100 rounded border border-slate-200 hover:border-blue-200 transition-all cursor-pointer"
                id={`copy-post-btn-${idx}`}
              >
                {copiedIndex === idx ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-650">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Draft</span>
                  </>
                )}
              </button>
            </div>

            {/* Post Core View */}
            <div className="p-5 space-y-4">
              {/* Structured Metadata for the App */}
              <div className="space-y-3 font-sans text-sm md:text-[15px] text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                {/* Scroll Hook Highlighted */}
                <div className="bg-slate-50 border-l-4 border-blue-600 p-3.5 rounded-r-lg font-medium text-slate-900 italic">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 block mb-1">
                    🪝 HOOK (scroll stopper):
                  </span>
                  {post.hook}
                </div>

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                    📝 FULL POST BODY:
                  </span>
                  {post.fullPost}
                </div>
              </div>

              {/* Graphic/Image Block Suggestion */}
              <div className="bg-blue-50/30 border border-dashed border-blue-200 rounded-lg p-3.5 mt-4 flex items-start gap-3">
                <div className="bg-blue-100/80 p-2 rounded text-blue-600 shrink-0">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-xs">🖼️ Image / Graphic Suggestion:</h5>
                  <p className="text-slate-600 text-xs leading-relaxed mt-0.5 font-normal">
                    {post.imageSuggestion}
                  </p>
                </div>
              </div>

              {/* Best time to post & hashtags */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  <span>Best Time: <strong>{post.bestTimeToPost}</strong></span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map((tag, tIdx) => (
                    <span key={tIdx} className="bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-mono font-medium text-[11px]">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Footer Likes Mimic */}
            <div className="border-t border-slate-100 py-2.5 px-4 bg-slate-50/35 flex items-center justify-around text-xs font-semibold text-slate-500">
              <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-default">
                <Heart size={14} />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-default">
                <MessageSquare size={14} />
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-default">
                <Repeat size={14} />
                <span>Repost</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-default">
                <Send size={14} />
                <span>Send</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Universal full screen image modal */}
      <ImageViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        title={viewerTitle}
        svgContent={viewerSvg}
        filename={viewerFilename}
      />
    </div>
  );
}
