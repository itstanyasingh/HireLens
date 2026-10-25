import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

interface AnalysisProgressProps {
  fileName: string;
  isReady: boolean;
  error: string | null;
  onComplete: () => void;
  onBackToHome: () => void;
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

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  fileName,
  isReady,
  error,
  onComplete,
  onBackToHome
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (error) return;

    if (currentStageIndex < STAGES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStageIndex((prev) => prev + 1);
      }, 350); // 350ms per stage = ~2.1s smooth progress animation
      return () => clearTimeout(timer);
    }
  }, [currentStageIndex, error]);

  // When stage reaches end AND report isReady, trigger completion
  useEffect(() => {
    if (isReady && !error) {
      setCurrentStageIndex(STAGES.length - 1);
      const completionTimer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(completionTimer);
    }
  }, [isReady, error, onComplete]);

  // Safety guard: guarantee progress never hangs indefinitely under any network condition
  useEffect(() => {
    if (error || isReady) return;

    const safetyTimer = setTimeout(() => {
      if (!isReady && !error) {
        onComplete();
      }
    }, 6500);

    return () => clearTimeout(safetyTimer);
  }, [isReady, error, onComplete]);

  const progressPercentage = isReady
    ? 100
    : Math.min(95, Math.round(((currentStageIndex + 1) / STAGES.length) * 100));

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-rose-200 shadow-2xl p-8 text-slate-900 space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Unable to Process Resume Score
            </h2>
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-left leading-relaxed">
              {error}
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Ensure your file contains readable text (not scanned images without OCR) and is in PDF, DOCX, or TXT format.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#16B889] hover:bg-[#129A72] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Another Resume / Sample</span>
            </button>
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-8 sm:p-10 text-slate-900">
        
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EAF8F3] border border-[#BDEBDC] text-[#16B889] mb-4 shadow-inner">
            <Sparkles className="w-8 h-8 animate-pulse text-[#16B889]" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16B889] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#16B889]"></span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Analyzing your resume...
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Processing <span className="font-semibold text-slate-800">{fileName}</span> under the HireLens engine.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
            <span>Overall Analysis Progress</span>
            <span className="text-[#16B889] font-mono font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60 p-0.5">
            <div
              className="bg-[#16B889] h-full rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklist Steps */}
        <div className="space-y-3 bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIndex || (isReady && idx <= currentStageIndex);
            const isCurrent = idx === currentStageIndex && !isDone;

            return (
              <div
                key={stage}
                className={`flex items-center justify-between text-xs font-medium transition-all duration-300 ${
                  isDone
                    ? 'text-slate-800 font-semibold'
                    : isCurrent
                    ? 'text-[#127F5C] font-bold scale-[1.01]'
                    : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#16B889] shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-[#16B889] animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span>{stage}</span>
                </div>

                {isDone && (
                  <span className="text-[10px] uppercase font-bold text-[#127F5C] bg-[#EAF8F3] px-2 py-0.5 rounded">
                    Complete
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] uppercase font-bold text-[#16B889] bg-[#EAF8F3] px-2 py-0.5 rounded animate-pulse">
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

