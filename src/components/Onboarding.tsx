import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Send, UserCheck, Play, Upload, AlertCircle, Loader2, Linkedin, Link2 } from 'lucide-react';
import { MemoryItem } from '../types';
import { getMemoryItems } from './MemoryVault';

interface OnboardingProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const SAMPLE_PROFILES = [
  {
    title: "💻 Software Engineer Resume",
    subtitle: "Full-stack engineer seeking senior tech positions",
    content: `Anya Vance
Senior Full Stack Engineer
Summary: Results-oriented software engineer with 5+ years of experience building secure, scalable React & Node.js cloud services. Passionate about improving team velocity and API performance.
Work Experience:
- Lead Web Engineer at TechSphere (2022 - Present): Improved platform response time by 35% using lazy-loading and DB caching.
- Product Engineer at DevFlow Corp (2020 - 2022): Rewrote legacy state engines to standard React 18, cutting bug frequency by 20%.
Skills: React, TypeScript, Node.js, Express, PostgreSQL, Docker, AWS (Lambda & S3), Agile.
Target Position: Senior Tech Lead & Architect in modern FinTech.`
  },
  {
    title: "📈 Growth Marketing Specialist",
    subtitle: "Data-driven marketer targeting high-growth SaaS firms",
    content: `Liam Harrison
Product Marketing & B2B Growth Lead
Summary: Growth marketer specialized in customer acquisition, funnel conversion, and high-impact content strategies. Expert in translating complex data into friendly branding.
Work Experience:
- Senior Growth Lead at SaasStream Corp (2023 - Present): Led multi-channel content campaigns that boosted inbound sign-ups by 140%.
- Digital Strategist at Apex Media (2021 - 2023): Directed paid advertising channels with a budget of $500k, achieving 4.2x ROAS.
Skills: SEO, Paid Acquisition (Google/LinkedIn Ads), HubSpot, Python, Data Analytics, Brand Messaging.
Target Industry: SaaS, AI startups, and High-Tech growth teams.`
  },
  {
    title: "🎓 Recent UX Graduate Intro",
    subtitle: "Polished entry-level candidate portfolio",
    content: `Jordan Miller - Recent Graduate from University of Washington
I am a recent UX Design & Psychology graduate seeking an internship or entry-level product design role. I love understanding human behaviors and transforming them into beautiful interfaces.
Projects:
- FinLit Mobile App Concept: Designed a micro-savings ecosystem targeting college students, backed by 40+ user interviews.
- Redesigning Transit Info Hubs: Created localized web views for public bus networks, increasing screen readability scores by 40%.
Skills: Figma, Wireframing, User Testing, Information Architecture, Web Accessibility (WCAG), HTML/CSS.`
  }
];

export default function Onboarding({ onSubmit, isLoading }: OnboardingProps) {
  const [onboardingMode, setOnboardingMode] = useState<'linkedin' | 'resume'>('linkedin');
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [inputText, setInputText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [savedMemories, setSavedMemories] = useState<MemoryItem[]>([]);

  useEffect(() => {
    // Initial fetch
    setSavedMemories(getMemoryItems());

    // Listen to real-time events triggered from MemoryVault
    const handleMemoryUpdated = () => {
      setSavedMemories(getMemoryItems());
    };
    window.addEventListener("ghazi_memory_updated", handleMemoryUpdated);
    return () => {
      window.removeEventListener("ghazi_memory_updated", handleMemoryUpdated);
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const [isExtracting, setIsExtracting] = useState(false);

  const parseFileContents = (file: File) => {
    setUploadError("");
    setFileName(file.name);
    setIsExtracting(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const resultString = e.target?.result as string;
      if (!resultString) {
        setUploadError("Could not read file details.");
        setIsExtracting(false);
        return;
      }

      // Convert raw readAsDataURL results to clean base64 string
      const base64Data = resultString.split(",")[1] || resultString;

      try {
        const res = await fetch("/api/extract-resume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            base64: base64Data,
            fileName: file.name,
            mimeType: file.type
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to parse document details.");
        }

        const data = await res.json();
        if (data.text) {
          setInputText(data.text);
          setUploadError("");
        } else {
          throw new Error("No readable text found after analyzing document.");
        }
      } catch (err: any) {
        console.error("Resume extractor error:", err);
        const errStr = err.message || "";
        if (errStr.includes("quota") || errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("Limit")) {
          setUploadError(`API Quota Exceeded (Limit: 20 calls/day reached). \n💡 Tip: You can bypass this instantly! Simply copy-paste your resume or LinkedIn bio text directly using the "Write or Paste Text" tab above, which supports fully functional instant template fallbacks!`);
        } else {
          setUploadError(`Error parsing ${file.name}: ${errStr || "Please copy-paste raw text instead."}`);
        }
      } finally {
        setIsExtracting(false);
      }
    };

    reader.onerror = () => {
      setUploadError("Error reading the local file.");
      setIsExtracting(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseFileContents(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseFileContents(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onboardingMode === 'linkedin') {
      if (!linkedinUrl.trim()) return;
      const rawText = `LinkedIn Profile URL: ${linkedinUrl.trim()}\nCandidate Name: ${candidateName.trim() || 'Professional Candidate'}`;
      onSubmit(rawText);
    } else {
      if (inputText.trim()) {
        onSubmit(inputText);
      }
    }
  };

  const selectSample = (content: string) => {
    setInputText(content);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300" id="onboarding-root">
      {/* Designer Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl -z-10" />
        
        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
          <div className="bg-blue-600 text-white rounded-2xl p-4 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <Sparkles size={32} className="animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full mb-3">
              Official Personal Assistant
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
              "Help professionals worldwide grow their LinkedIn presence."
            </h2>
            <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-3 font-normal">
              <p>
                Hello! I am your <strong>Personal LinkedIn AI Agent 🤖</strong> — created by <strong>Ghazi Bilgrami</strong>.
              </p>
              <p>
                Whether you want to optimize your profile, command attention from hiring managers, or set up a world-class sharing strategy, you are in the right place. 
                Simply paste your raw resume or write a quick summary of your background below, and let's get you noticed!
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 border-t border-slate-800/80 pt-4 text-xs text-slate-400 font-medium">
              <div>👨‍💻 Creator: <span className="text-slate-200">Ghazi Bilgrami</span></div>
              <div className="text-slate-600">•</div>
              <div>⚡ Stack: <span className="text-slate-200">Gemini 3.5 & React</span></div>
              <div className="text-slate-600">•</div>
              <div>🎯 Focus: <span className="text-slate-200">Growth & Hiring</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Input Form Column */}
        <div className="md:col-span-3 bg-white border border-slate-200 shadow-sm rounded-xl p-6" id="input-section">
          <h3 className="font-semibold text-slate-800 text-lg mb-1 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            Candidate Intake & Profile Check
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Identify strengths/gaps ("Good vs Bad Things") on the candidate's public LinkedIn profile or standard resume details, and prepare custom high-impact designs.
          </p>

          {/* New Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/40">
            <button
              type="button"
              onClick={() => {
                setOnboardingMode('linkedin');
                setUploadError("");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                onboardingMode === 'linkedin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="mode-tab-linkedin"
            >
              <Linkedin size={13} />
              LinkedIn Profile URL
            </button>
            <button
              type="button"
              onClick={() => {
                setOnboardingMode('resume');
                setUploadError("");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                onboardingMode === 'resume'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="mode-tab-resume"
            >
              <Upload size={13} />
              Upload Resume / Bio
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {onboardingMode === 'linkedin' ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <label htmlFor="linkedin-url-field" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Paste Candidate's LinkedIn URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Link2 size={16} />
                    </div>
                    <input
                      type="url"
                      id="linkedin-url-field"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-sans transition-all placeholder:text-slate-400 bg-slate-50 text-slate-800"
                      placeholder="e.g. https://www.linkedin.com/in/ghazi-haider-data-analyst"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      required={onboardingMode === 'linkedin'}
                      disabled={isLoading}
                    />
                  </div>
                  {/* Memory Vault category link suggestions */}
                  {savedMemories.filter(m => m.type === "link" && m.enabled).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        🧠 Saved links:
                      </span>
                      {savedMemories.filter(m => m.type === "link" && m.enabled).map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLinkedinUrl(item.value)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200/40 cursor-pointer transition-all flex items-center gap-0.5"
                          title={item.value}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 block font-normal leading-relaxed">
                    Enter the public profile link. The agent will retrieve SEO elements, audit current details, and index custom stats.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="linkedin-name-field" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Candidate Full Name (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserCheck size={16} />
                    </div>
                    <input
                      type="text"
                      id="linkedin-name-field"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-sans transition-all placeholder:text-slate-400 bg-slate-50 text-slate-800"
                      placeholder="e.g. Syed Ghazi Haider"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {/* Memory Vault category name suggestions */}
                  {savedMemories.filter(m => m.type === "name" && m.enabled).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        🧠 Saved names:
                      </span>
                      {savedMemories.filter(m => m.type === "name" && m.enabled).map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCandidateName(item.value)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200/40 cursor-pointer transition-all"
                          title={item.value}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Drag & Drop Upload Block */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all relative flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    isExtracting
                      ? 'border-blue-500 bg-blue-50/20'
                      : isDragging 
                        ? 'border-blue-600 bg-blue-50/50 scale-[1.01]' 
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <input 
                    type="file" 
                    id="file-upload-input" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept=".txt,.md,.rtf,.pdf,.docx,.doc"
                    onChange={handleFileChange}
                    disabled={isLoading || isExtracting}
                  />
                  {isExtracting ? (
                    <Loader2 size={24} className="text-blue-600 animate-spin" />
                  ) : (
                    <Upload size={24} className={isDragging ? 'text-blue-600 animate-bounce' : 'text-slate-400'} />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">
                      {isExtracting 
                        ? "Reading & Extracting Resume text..." 
                        : fileName 
                          ? `Loaded: ${fileName}` 
                          : "Upload Resume File"}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                      {isExtracting 
                        ? "Our backend AI is converting and indexing document contents..." 
                        : "Drag and drop or browse to extract details (.txt, .md, .pdf, .docx)"}
                    </span>
                  </div>
                </div>

                {uploadError && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-3.5 py-2.5 rounded-lg flex items-start gap-2 leading-relaxed">
                    <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div className="relative">
                  <label htmlFor="resume-input-field" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Review / Edit Extracted Bio
                  </label>
                  <textarea
                    className="w-full h-56 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-sans resize-none transition-all placeholder:text-slate-400 bg-slate-50 text-slate-800"
                    placeholder="Example: I'm a Data Analyst with 3 years of experience in Python and Tableau. Here is my current role..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isLoading || isExtracting}
                    required={onboardingMode === 'resume'}
                    id="resume-input-field"
                  />
                  {/* Memory Vault category text/prompt suggestions */}
                  {savedMemories.filter(m => (m.type === "text" || m.type === "prompt") && m.enabled).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block w-full mb-1">
                        🧠 Saved Bios & Prompts (Click to Use):
                      </span>
                      {savedMemories.filter(m => (m.type === "text" || m.type === "prompt") && m.enabled).map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            if (inputText.trim()) {
                              if (confirm("Replace current text with this saved memory? Click Cancel to append instead.")) {
                                setInputText(item.value);
                              } else {
                                setInputText(inputText + "\n\n" + item.value);
                              }
                            } else {
                              setInputText(item.value);
                            }
                          }}
                          className="bg-emerald-55 hover:bg-emerald-100 text-emerald-8 bg-emerald-50 text-xs px-2.0 py-1 rounded border border-emerald-250 cursor-pointer transition-all mr-1.5 text-left text-[11px] leading-tight max-w-full font-medium"
                          title={item.value}
                        >
                          + {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between gap-4 mt-6">
              <span className="text-xs text-slate-400 font-medium">
                {onboardingMode === 'linkedin' 
                  ? (linkedinUrl ? 'LinkedIn mode active' : 'Fill Profile URL to activate') 
                  : `${inputText.length} characters`
                }
              </span>

              <button
                type="submit"
                disabled={isLoading || isExtracting || (onboardingMode === 'linkedin' ? !linkedinUrl.trim() : inputText.trim().length < 5)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg text-sm shadow hover:shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:shadow-none transition-all cursor-pointer"
                id="optimize-submit-btn"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Extracting & Auditing...
                  </>
                ) : isExtracting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Extracting File...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    {onboardingMode === 'linkedin' ? "Audit & Activate Agent" : "Activate Agent"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Demo Templates Column */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-200/80 rounded-xl p-6" id="demo-section">
          <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <UserCheck size={16} className="text-slate-600" />
            Interactive Demo Profiles
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Don't have your resume on hand? Click one of these professionally premade templates to instantly activate the agent!
          </p>

          <div className="space-y-3.5">
            {SAMPLE_PROFILES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSample(sample.content)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2 group ${
                  inputText === sample.content
                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
                id={`sample-profile-btn-${idx}`}
              >
                <div className={`p-1.5 rounded-md mt-0.5 transition-colors ${
                  inputText === sample.content ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}>
                  <Play size={12} className={inputText === sample.content ? "fill-blue-700" : "fill-slate-500"} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs tracking-tight group-hover:text-blue-600 transition-colors">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-normal leading-normal">
                    {sample.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-800 text-xs mb-1.5">💡 Expert Bio tip</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              To achieve the absolute best results, provide both your career goals and key work achievements. This matches your advice context perfectly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
