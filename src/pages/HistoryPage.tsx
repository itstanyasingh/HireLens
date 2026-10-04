import React, { useState, useEffect } from 'react';
import { getHistory, deleteFromHistory, AnalysisReport } from '../services/api';
import { History, FileText, Trash2, Eye, Calendar, Sparkles, ArrowRight } from 'lucide-react';

interface HistoryPageProps {
  onSelectReport: (report: AnalysisReport) => void;
  onNavigateLanding: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectReport, onNavigateLanding }) => {
  const [reports, setReports] = useState<AnalysisReport[]>([]);

  useEffect(() => {
    setReports(getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteFromHistory(id);
    setReports(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <History className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Analysis History
            </h1>
            <p className="text-xs text-slate-500">
              Review and compare your previous resume checks and scores.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateLanding}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          New Resume Check
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">
            No previous resume analyses found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload a resume to start your first analysis and unlock ATS checks, content fixes, and job matching.
          </p>
          <button
            onClick={onNavigateLanding}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Upload Resume Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((rep) => {
            const formatted = new Date(rep.analyzedAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            let scoreBadgeClass = 'bg-indigo-100 text-indigo-800 border-indigo-200';
            if (rep.overallScore >= 85) scoreBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            else if (rep.overallScore < 65) scoreBadgeClass = 'bg-rose-100 text-rose-800 border-rose-200';

            return (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 p-4 sm:px-6 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-2xs hover:shadow-md"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 font-mono ${scoreBadgeClass}`}>
                    <span className="text-base font-extrabold leading-none">{rep.overallScore}</span>
                    <span className="text-[9px] font-bold opacity-75">/100</span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {rep.fileName}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatted}
                      </span>
                      <span>•</span>
                      <span>{rep.jobDescription ? 'Targeted Job Analysis' : 'General Resume Audit'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectReport(rep);
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View Report</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(rep.id, e)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
