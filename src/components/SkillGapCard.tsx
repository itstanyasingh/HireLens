import React from 'react';
import { Target, AlertCircle, CheckCircle2, ArrowUpRight, HelpCircle } from 'lucide-react';

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
  if (skillGaps.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">
              Skill Gap Audit
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates whether required technical competencies from the job posting are evidenced in your resume.
            </p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          No missing skill gaps detected. When you compare your resume against a target job posting, any unevidenced qualifications will be listed here with specific suggestions.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Target className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">
              Skill Gap Audit
            </h3>
            <p className="text-xs text-slate-500">
              Technical requirements identified in the job specification that were not found in your resume text.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
          {skillGaps.length} Requirements Missing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skillGaps.map((gap, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#16B889] transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-base text-slate-900 font-mono">
                  {gap.skill}
                </span>

                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${
                  gap.priority === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {gap.priority} PRIORITY
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs text-[#16B889] font-semibold mb-3 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-[#16B889] shrink-0" />
                <span>{gap.roleOccurrence}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider font-mono">
                    Resume Evidence:
                  </span>
                  <p className="text-slate-500 leading-relaxed font-sans">
                    {gap.currentEvidence}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#16B889] block text-[11px] uppercase tracking-wider font-mono">
                    Recommended Truthful Action:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium font-sans">
                    {gap.recommendedAction}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono text-[10.5px]">Evidence: Not Found</span>
              <span className="text-[#16B889] font-bold font-mono text-[11px]">
                Target Requirement
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
