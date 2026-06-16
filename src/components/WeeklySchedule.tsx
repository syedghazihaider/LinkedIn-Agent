import React, { useState } from 'react';
import { Calendar, Layers, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WeekPlan } from '../types';

interface WeeklyScheduleProps {
  plan: WeekPlan[];
}

export default function WeeklySchedule({ plan }: WeeklyScheduleProps) {
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const selectedWeek = plan.find(w => w.weekNumber === activeWeek) || plan[0] || { weekNumber: activeWeek, posts: [] };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="weekly-schedule-root">
      {/* Intro Description */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-amber-500 text-slate-900 px-2.5 py-1 text-[10px] font-bold rounded uppercase shrink-0 mt-0.5 tracking-wider">
            Step 4
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm uppercase tracking-wide mb-1 flex items-center gap-2">
              📅 4-Week Strategy Roadmap
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Keep your profile active and discoverable with a standard 3-post-per-week routine. We've mapped out specific high-impact professional topics for the next month to cover technical experience, career insights, and industry trends.
            </p>
          </div>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-0.5">
        {[1, 2, 3, 4].map((wk) => {
          const colors = [
            'border-amber-500 text-amber-600',
            'border-blue-500 text-blue-600',
            'border-purple-500 text-purple-600',
            'border-emerald-500 text-emerald-600'
          ];
          const isActive = activeWeek === wk;
          return (
            <button
              key={wk}
              onClick={() => setActiveWeek(wk)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? `${colors[wk-1]} font-extrabold`
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
              }`}
              id={`week-tab-${wk}`}
            >
              Week {wk}: {wk === 1 ? 'Authority' : wk === 2 ? 'Vulnerability' : wk === 3 ? 'Tactical' : 'Growth'}
            </button>
          );
        })}
      </div>

      {/* Active Week Timetable card layout */}
      <div className="grid sm:grid-cols-3 gap-6" id={`week-plan-content-${activeWeek}`}>
        {selectedWeek.posts.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative flex flex-col justify-between hover:border-blue-200 hover:shadow-sm transition-all">
            <div>
              {/* Day Label */}
              <div className="flex items-center justify-between mb-3.5">
                <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                  🗓️ {item.day}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase">
                  POST #{idx + 1}
                </span>
              </div>

              {/* Topic Headline */}
              <h5 className="font-bold text-slate-800 text-sm tracking-tight mb-2">
                {item.topic}
              </h5>

              {/* Description body */}
              <p className="text-xs text-slate-500 leading-relaxed font-normal mb-6">
                {item.description}
              </p>
            </div>

            {/* Quick coaching micro tip */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-600">
              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
              <span>Tailored to show your core credibility.</span>
            </div>
          </div>
        ))}
      </div>

      {/* Optimization Callout */}
      <div className="bg-blue-50/20 border border-blue-100/60 rounded-xl p-4 text-center">
        <p className="text-[11px] text-blue-800 font-medium">
          💡 <strong>Want custom post summaries for these topics?</strong> Type a message like <em>"Write a post for Week {activeWeek} on '{selectedWeek.posts[0]?.topic || 'this topic'}'"</em> inside Ghazi's AI Agent Chat below!
        </p>
      </div>
    </div>
  );
}
