import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Onboarding from "./components/Onboarding";
import ProfileLayout from "./components/ProfileLayout";
import FeedPreview from "./components/FeedPreview";
import WeeklySchedule from "./components/WeeklySchedule";
import AgentChat from "./components/AgentChat";
import MemoryVault from "./components/MemoryVault";
import { OptimizeResponse } from "./types";
import { Sparkles, FileText, ArrowLeft, RefreshCw, Layers, Send, HelpCircle, Check, Briefcase } from "lucide-react";

export default function App() {
  const [optimizedData, setOptimizedData] = useState<OptimizeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"audit" | "posts" | "schedule" | "advisor">("audit");
  const [isMemoryVaultOpen, setIsMemoryVaultOpen] = useState(false);

  const loadingMessages = [
    "🤖 Activated Ghazi's LinkedIn Agent...",
    "🔍 STEP 1: Parsing your professional history & CV...",
    "✍️ STEP 2: Writing keyword-optimized Headline & About copy...",
    "📝 STEP 3: Planning 3 engaging ready-to-use LinkedIn draft posts...",
    "🗓️ STEP 4: Creating your simple 4-week growth schedule...",
    "🚀 STEP 5: Finalizing your Interactive AI Coaching advisor..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleOptimizeProfile = async (rawInput: string) => {
    setIsLoading(true);
    setErrorMessage("");
    setOptimizedData(null);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to optimize profile. Check your server logs or key configuration.");
      }

      const data = await response.json();
      setOptimizedData(data);
      setActiveTab("audit");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred while processing your resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAgent = () => {
    setOptimizedData(null);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between" id="app-root">
      <div>
        {/* Universal Sticky Header */}
        <Header onOpenMemoryVault={() => setIsMemoryVaultOpen(true)} />

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in fade-in duration-300" id="loading-container">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                <div 
                  className="h-full bg-blue-600 transition-all duration-1000" 
                  style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                />
              </div>

              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
                <RefreshCw size={28} className="animate-spin" />
              </div>

              <h3 className="text-lg font-bold text-slate-800">Coaching Advisor Processing</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Please wait while the LinkedIn Assistant analyzes your resume</p>

              {/* Steps Progress Visual */}
              <div className="mt-8 space-y-3.5 max-w-md mx-auto text-left">
                {loadingMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                      idx === loadingStep 
                        ? 'text-blue-600 font-bold opacity-100 scale-102 transform' 
                        : idx < loadingStep 
                          ? 'text-slate-400 opacity-60' 
                          : 'text-slate-350 opacity-30 font-normal'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                      idx < loadingStep 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : idx === loadingStep 
                          ? 'border-blue-500 text-blue-500 font-bold bg-blue-50 animate-pulse' 
                          : 'border-slate-200 text-slate-400'
                    }`}>
                      {idx < loadingStep ? <Check size={10} /> : idx + 1}
                    </div>
                    <span className="leading-none">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && !isLoading && (
          <div className="max-w-xl mx-auto px-4 py-8" id="error-container">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center shadow">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-bold text-red-900 mt-2 text-sm">Failed to Activate Assistant</h3>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                {errorMessage}
              </p>
              <button
                onClick={resetAgent}
                className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Welcome Onboarding Form */}
        {!optimizedData && !isLoading && !errorMessage && (
          <Onboarding onSubmit={handleOptimizeProfile} isLoading={isLoading} />
        )}

        {/* Main Dashboard Screen */}
        {optimizedData && !isLoading && !errorMessage && (
          <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300" id="main-dashboard">
            {/* Context/Action bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Sparkles size={12} className="animate-pulse" />
                  PERSONAL EXECUTIVE REPORT
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    Optimized Profile for <span className="text-blue-600 font-extrabold">{optimizedData.profile.name || "User"}</span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetAgent}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3.5 py-2 border border-slate-200 rounded-lg transition-all cursor-pointer"
                  id="reset-agent-btn"
                >
                  <ArrowLeft size={13} />
                  Analyze Another Resume
                </button>
              </div>
            </div>

            {/* Fallback Banner */}
            {optimizedData.isQuotaFallback && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs text-left animate-in fade-in slide-in-from-top-3 duration-350">
                <div className="flex gap-2.5 items-start">
                  <span className="text-xl shrink-0">⚡</span>
                  <div>
                    <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                      Quota Protection Active
                    </h5>
                    <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                      AI Studio's free tier has temporarily reached its daily maximum requests quota (20 calls/day limit). 
                      Your dynamic personal audit reports, code mockups, and writing guides remain <strong>100% functional</strong> via optimized localized templates!
                    </p>
                  </div>
                </div>
                <div className="bg-amber-105/10 border border-amber-200/50 text-amber-800 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded shrink-0 self-end sm:self-center bg-amber-100">
                  Live Fallback Mode
                </div>
              </div>
            )}

            {/* Core Segmented Nav Tabs */}
            <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-0.5">
              <button
                onClick={() => setActiveTab("audit")}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "audit"
                    ? "border-blue-600 text-blue-650 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
                id="tab-audit-btn"
              >
                <FileText size={16} />
                Profile Audit & Tips
              </button>

              <button
                onClick={() => setActiveTab("posts")}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "posts"
                    ? "border-blue-600 text-blue-650 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
                id="tab-posts-btn"
              >
                <Layers size={16} />
                Generate Posts Draft
              </button>

              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "schedule"
                    ? "border-blue-600 text-blue-650 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
                id="tab-schedule-btn"
              >
                <Briefcase size={16} />
                4-Week Posting Plan
              </button>

              <button
                onClick={() => setActiveTab("advisor")}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "advisor"
                    ? "border-blue-600 text-blue-650 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
                id="tab-advisor-btn"
              >
                <Sparkles size={16} />
                Interactive AI Coach
              </button>
            </div>

            {/* Render selected state */}
            <div className="mt-6">
              {activeTab === "audit" && (
                <ProfileLayout 
                  profile={optimizedData.profile} 
                  optimization={optimizedData.optimization} 
                />
              )}

              {activeTab === "posts" && (
                <FeedPreview posts={optimizedData.posts} profileContext={optimizedData} />
              )}

              {activeTab === "schedule" && (
                <WeeklySchedule plan={optimizedData.weeklyPlan} />
              )}

              {activeTab === "advisor" && (
                <AgentChat contextInfo={optimizedData} />
              )}
            </div>
          </main>
        )}
      </div>

      {/* Signature & Support Banner (Ghazi Credit Mandate) */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-xs mt-12" id="app-footer">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <p className="font-normal">
            "This LinkedIn AI Agent was created by <strong className="text-white hover:text-blue-400 cursor-help transition-all">Ghazi Bilgrami</strong> — Data Analyst, Cloud & Banking Professional, and founder of this tool."
          </p>
          <div className="text-[10px] text-slate-500 font-medium">
            Always encouraging, professional, and motivating. Designed in Google AI Studio • React 19 • Express Integrated. 
          </div>
        </div>
      </footer>

      {/* Persistence Memory Vault Dialog */}
      <MemoryVault
        isOpen={isMemoryVaultOpen}
        onClose={() => setIsMemoryVaultOpen(false)}
      />
    </div>
  );
}
