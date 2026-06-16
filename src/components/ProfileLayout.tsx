import React, { useState } from 'react';
import { User, Briefcase, Target, ShieldAlert, BadgePlus, Check, Copy, Award, FileSpreadsheet, Image, Users } from 'lucide-react';
import { ProfileAnalysis, ProfileOptimization } from '../types';

interface ProfileLayoutProps {
  profile: ProfileAnalysis;
  optimization: ProfileOptimization;
}

export default function ProfileLayout({ profile, optimization }: ProfileLayoutProps) {
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedAbout, setCopiedAbout] = useState(false);

  const copyText = (text: string, type: 'headline' | 'about') => {
    navigator.clipboard.writeText(text);
    if (type === 'headline') {
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
    } else {
      setCopiedAbout(true);
      setTimeout(() => setCopiedAbout(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="profile-layout-root">
      {/* LinkedIn Profile Card Mockup */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        {/* Banner Mockup */}
        <div className="h-32 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 relative">
          <div className="absolute top-2 right-2 text-[10px] text-blue-200 bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono tracking-wider">
            PREVIEW MOCKUP
          </div>
        </div>

        {/* Content Container */}
        <div className="px-6 pb-6 relative">
          {/* Avatar Placement */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
            <div className="w-24 h-24 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-full border-4 border-white shadow-md flex items-center justify-center text-slate-400 font-bold text-2xl overflow-hidden">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name || "Candidate"} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                profile.name ? profile.name.split(' ').map(n=>n[0]).join('') : 'U'
              )}
            </div>
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open to Market Opportunities
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{profile.name || "Qualified Professional"}</h3>
              <div className="text-slate-500 text-xs font-semibold mt-1 flex flex-wrap gap-y-1.5 gap-x-4 items-center">
                <span className="flex items-center gap-1">
                  <Briefcase size={13} />
                  {profile.recentRole || 'Current / Most Recent Position'}
                </span>
                {profile.linkedinUrl && (
                  <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50/60 hover:bg-blue-50 border border-blue-200/40 px-2 py-0.5 rounded-md transition-colors">
                    <User size={13} />
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      LinkedIn Profile
                    </a>
                  </span>
                )}
              </div>
            </div>

            {/* AI Generated Headline Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-4 relative group hover:bg-blue-50 hover:border-blue-200 transition-all">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  <Award size={13} />
                  RECOMMENDED HEADLINE
                </span>
                <button
                  onClick={() => copyText(optimization.headline, 'headline')}
                  className="text-slate-500 hover:text-blue-600 p-1.5 hover:bg-white rounded border border-slate-200 hover:border-blue-200 shadow-sm transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  id="copy-headline-btn"
                >
                  {copiedHeadline ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  {copiedHeadline ? "Copied" : "Copy Headline"}
                </button>
              </div>
              <p className="text-slate-800 font-semibold text-sm md:text-base leading-relaxed font-sans">
                {optimization.headline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Profile Quality Audit - Good and Bad Things */}
      {((profile.goodThings && profile.goodThings.length > 0) || (profile.badThings && profile.badThings.length > 0)) && (
        <div className="grid md:grid-cols-2 gap-6 bg-white border border-slate-200 shadow-sm rounded-xl p-6 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-4">
            <h4 className="font-bold text-emerald-800 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="p-1 bg-emerald-100 text-emerald-700 text-xs rounded-lg">👍</span>
              The Good Elements (What's Working)
            </h4>
            <ul className="space-y-3">
              {profile.goodThings?.map((good, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-normal">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span>{good}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-rose-800 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="p-1 bg-rose-105 text-rose-700 text-xs rounded-lg font-bold">⚠️</span>
              The Gaps & Blindspots (Needs Fixing)
            </h4>
            <ul className="space-y-3">
              {profile.badThings?.map((bad, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-normal">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 mt-0.5 font-semibold text-[10px]">
                    ✕
                  </div>
                  <span>{bad}</span>
                </li>
              ))}
            </ul>
          </div>

          {profile.profileSuggestions && profile.profileSuggestions.length > 0 && (
            <div className="md:col-span-2 mt-2 bg-gradient-to-r from-blue-50/40 to-indigo-50/40 border border-blue-100 rounded-xl p-4.5 space-y-3">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-blue-800">
                🚀 Action Plan: Make Your Profile Professional & Attractive
              </h5>
              <div className="grid md:grid-cols-2 gap-4">
                {profile.profileSuggestions.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-650 leading-relaxed font-normal bg-white p-2.5 rounded-lg border border-slate-200/50 shadow-xs">
                    <span className="text-blue-600 font-bold shrink-0">Step {idx + 1}:</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left Column: STEP 1 Profile Extracted Overview */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-4">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Step 1</span>
              <h4 className="font-bold text-slate-850 text-sm uppercase tracking-wider">
                Profile Analysis
              </h4>
            </div>

            <div className="space-y-5 text-sm">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Candidate Name</span>
                <span className="text-slate-800 font-semibold block mt-0.5">{profile.name || "Not Specified"}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Most Recent Role</span>
                <span className="text-slate-800 font-semibold block mt-0.5">{profile.recentRole || "Not Specified"}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider mb-1">Extracted Experiences</span>
                <ul className="space-y-2 mt-1">
                  {profile.experiences?.length > 0 ? (
                    profile.experiences.map((exp, idx) => (
                      <li key={idx} className="text-slate-600 text-xs bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed font-normal">
                        {exp}
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic">No experience data extracted</li>
                  )}
                </ul>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider mb-1.5">Key Core Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md border border-slate-200/80 font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No skills extracted</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider flex items-center gap-1">
                  <Target size={13} className="text-red-500" />
                  Target / Career Goal
                </span>
                <span className="text-slate-800 font-medium block mt-1 leading-relaxed text-xs">
                  {profile.careerGoal || "Establish high engagement visibility and grow professional connections"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: STEP 2 Optimization Details */}
        <div className="md:col-span-3 space-y-6">
          {/* About Section */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">Step 2</span>
                <h4 className="font-bold text-slate-850 text-sm uppercase tracking-wider">
                  Profile Optimization
                </h4>
              </div>
              <button
                onClick={() => copyText(optimization.aboutSection, 'about')}
                className="text-slate-500 hover:text-blue-600 p-1.5 hover:bg-slate-50 rounded border border-slate-200 hover:border-blue-200 shadow-sm transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
                id="copy-about-btn"
              >
                {copiedAbout ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                {copiedAbout ? "Copied" : "Copy Section"}
              </button>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed font-sans italic bg-slate-50/50 p-4 border border-slate-100 rounded-lg">
              "{optimization.aboutSection}"
            </p>
            <span className="text-[11px] text-slate-400 block mt-2.5">
              💡 <strong>Protip from Ghazi:</strong> Keep this summary inside your About section to leverage keywords and grab executive search indexing directly!
            </span>
          </div>

          {/* Skills, Photo/Banner and Outreach 전략 */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-5">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <BadgePlus size={16} className="text-blue-600" />
              Strategic Growth Tips
            </h4>

            {/* Suggested Skills to Add */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Recommended Skills to Add (SEO Booster)</span>
              <div className="space-y-2.5">
                {optimization.skillsToAdd?.length > 0 ? (
                  optimization.skillsToAdd.map((skillObj, idx) => {
                    const name = typeof skillObj === 'string' ? skillObj : (skillObj as any).skillName;
                    const explanation = typeof skillObj === 'string' 
                      ? 'Aligns with your profile goals and enhances your indexability for recruitment search filters.' 
                      : (skillObj as any).explanation;
                    return (
                      <div key={idx} className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg flex flex-col gap-1 hover:border-blue-200 hover:bg-blue-50/10 transition-all">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                            {name}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed font-normal pl-3">
                          {explanation}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-slate-400 italic">No recommended skills loaded</span>
                )}
              </div>
            </div>

            {/* Profile Photo and Banner Tips */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Image size={13} className="text-amber-500" />
                Photo & Canvas Banner advice
              </span>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                {optimization.photoAndBannerTips}
              </p>
            </div>

            {/* Connection and Outreach Strategy */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Users size={13} className="text-indigo-500" />
                Network Connection Strategy
              </span>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                {optimization.connectionStrategy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
