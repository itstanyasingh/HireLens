import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: () => void;
  fileName: string;
}

const STAGES = [
  'Reading your resume',
  'Understanding your experience',
  'Checking resume structure',
  'Analyzing skills and keywords',
  'Checking content quality',
  'Comparing with job requirements',
  'Preparing your report'
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ onComplete, fileName }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (currentStageIndex < STAGES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStageIndex((prev) => prev + 1);
      }, 600); // 600ms per stage = ~4.2s total smooth experience
      return () => clearTimeout(timer);
    } else {
      const completionTimer = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(completionTimer);
    }
  }, [currentStageIndex, onComplete]);

  const progressPercentage = Math.round(((currentStageIndex + 1) / STAGES.length) * 100);

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-8 sm:p-10 text-slate-900">
        
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 shadow-inner">
            <Sparkles className="w-8 h-8 animate-pulse text-indigo-600" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600"></span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Analyzing your resume...
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Processing <span className="font-semibold text-slate-800">{fileName}</span> under the lens.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
            <span>Overall Analysis Progress</span>
            <span className="text-indigo-600 font-mono font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60 p-0.5">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklist Steps */}
        <div className="space-y-3 bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage}
                className={`flex items-center justify-between text-xs font-medium transition-all duration-300 ${
                  isDone
                    ? 'text-slate-800 font-semibold'
                    : isCurrent
                    ? 'text-indigo-700 font-bold scale-[1.01]'
                    : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span>{stage}</span>
                </div>

                {isDone && (
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Complete
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded animate-pulse">
                    In Progress
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-400">
          Evaluating ATS parser rules, impact metrics, keyword alignment, and recruiter signals.
        </div>

      </div>
    </div>
  );
};
