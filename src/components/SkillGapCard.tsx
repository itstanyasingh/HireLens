import React from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle, ArrowUpRight, BookOpen } from 'lucide-react';

export interface SkillGap {
  skill: string;
  priority: 'HIGH' | 'MEDIUM';
  roleOccurrence: string;
  currentEvidence: string;
  recommendedAction: string;
}

interface SkillGapCardProps {
  skillGaps: SkillGap[];
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({ skillGaps }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Target className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">
              Skill Gap Analysis
            </h3>
            <p className="text-xs text-slate-500">
              High-value skills commonly required by hiring managers that are currently missing from your resume.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
          {skillGaps.length} Skill Gaps Identified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skillGaps.map((gap, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-base text-slate-900 font-mono">
                  {gap.skill}
                </span>

                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  gap.priority === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {gap.priority} PRIORITY
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs text-indigo-700 font-semibold mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                {gap.roleOccurrence}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Current Resume Evidence:
                  </span>
                  <p className="text-slate-500 leading-relaxed">
                    {gap.currentEvidence}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-indigo-700">
                    Recommended Action:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {gap.recommendedAction}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Market Demand: High</span>
              <span className="text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                Add to skills <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
