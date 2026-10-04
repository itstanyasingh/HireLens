import React, { useState } from 'react';
import { Building2, MapPin, DollarSign, CheckCircle2, AlertCircle, ExternalLink, Briefcase, Sparkles, X } from 'lucide-react';

export interface JobMatchData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
}

interface JobMatchCardProps {
  job: JobMatchData;
  onSelectJob?: (job: JobMatchData) => void;
}

export const JobMatchCard: React.FC<JobMatchCardProps> = ({ job, onSelectJob }) => {
  const [showDrawer, setShowDrawer] = useState(false);

  let matchBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (job.matchScore < 75) {
    matchBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 p-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                {job.company}
              </span>
              <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                {job.title}
              </h4>
            </div>

            <span className={`text-xs font-extrabold font-mono px-2.5 py-1 rounded-lg border ${matchBadgeColor}`}>
              {job.matchScore}% Match
            </span>
          </div>

          {/* Details Bar */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-slate-700 font-semibold">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              {job.salary}
            </span>
          </div>

          {/* Skills Matched */}
          <div className="space-y-2 mb-4">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Matched Skills ({job.matchedSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.matchedSkills.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          {job.missingSkills.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Missing Requirements ({job.missingSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.missingSkills.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded"
                  >
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            {job.type}
          </span>
          <button
            onClick={() => setShowDrawer(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View Job Specs
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Detail Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl p-6 space-y-5 max-h-[85vh] overflow-y-auto animate-fadeIn">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-indigo-600 tracking-wider">
                  {job.company}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {job.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span className="font-mono text-emerald-700 font-bold">{job.salary}</span>
                </div>
              </div>

              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-600">Calculated Compatibility</div>
                <div className="text-xl font-bold text-indigo-900 font-mono">{job.matchScore}% Resume Match</div>
              </div>
              <span className="text-xs text-indigo-700 bg-white px-3 py-1 rounded-lg border border-indigo-200 font-medium">
                High Hiring Probability
              </span>
            </div>

            <div>
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
                Job Overview & Requirements
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {job.description}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDrawer(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
