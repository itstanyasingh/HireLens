import React, { useState } from 'react';
import { Target, ChevronDown, ChevronUp, Sparkles, Building2, Briefcase } from 'lucide-react';
import { MOCK_JOBS } from '../data/mockJobs';

interface JobDescriptionInputProps {
  jobDescription: string;
  onChange: (value: string) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescription,
  onChange,
  isEnabled,
  onToggle,
}) => {
  const [showSamples, setShowSamples] = useState(false);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      
      {/* Toggle Header */}
      <div 
        onClick={() => onToggle(!isEnabled)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            isEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            <Target className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              Want a more targeted analysis?
              {isEnabled && (
                <span className="text-[10px] uppercase font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                  Targeted Mode Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Analyze your resume against a specific job description for keyword gaps and match scoring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
            isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
          }`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </div>
      </div>

      {/* Expandable Form */}
      {isEnabled && (
        <div className="p-6 pt-2 border-t border-slate-100 bg-slate-50/40 animate-fadeIn">
          
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Paste the Job Description
            </label>
            
            <button
              type="button"
              onClick={() => setShowSamples(!showSamples)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5" />
              {showSamples ? 'Hide Sample Job Posts' : 'Load Sample Job Posting'}
            </button>
          </div>

          {/* Sample Jobs Bar */}
          {showSamples && (
            <div className="mb-4 p-3 bg-white rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {MOCK_JOBS.slice(0, 3).map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => {
                    onChange(job.description);
                    setShowSamples(false);
                  }}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 truncate">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    {job.company} — {job.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {job.requiredSkills.slice(0, 4).join(', ')}
                  </div>
                </button>
              ))}
            </div>
          )}

          <textarea
            rows={5}
            value={jobDescription}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste the target job description here (Responsibilities, Requirements, Tech Stack)..."
            className="w-full text-xs font-sans bg-white border border-slate-300 rounded-xl p-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-y shadow-inner"
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>HireLens will extract required tech keywords, qualifications, and role metrics.</span>
            <span>{jobDescription.length} characters</span>
          </div>

        </div>
      )}

    </div>
  );
};
