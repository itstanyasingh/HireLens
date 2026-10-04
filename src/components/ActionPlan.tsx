import React from 'react';
import { ShieldAlert, ArrowRight, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export interface ActionPlanItem {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  reason: string;
  action: string;
  suggestionSample: string;
}

interface ActionPlanProps {
  items: ActionPlanItem[];
  onOpenFixer: (sampleText: string, reasonText: string) => void;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ items, onOpenFixer }) => {
  const highPriority = items.filter((i) => i.priority === 'HIGH');
  const mediumPriority = items.filter((i) => i.priority === 'MEDIUM' || i.priority === 'LOW');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">
              Your Recommended Action Plan
            </h3>
            <p className="text-xs text-slate-500">
              Prioritized step-by-step checklist to maximize your interview callback rates.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {items.length} Action Items
        </span>
      </div>

      <div className="space-y-6">
        
        {/* High Priority Section */}
        {highPriority.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                High Priority Fixes ({highPriority.length})
              </span>
            </div>

            <div className="space-y-3.5">
              {highPriority.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-rose-200/80 bg-rose-50/30 hover:border-rose-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">
                        {item.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onOpenFixer(item.suggestionSample, item.reason)}
                      className="shrink-0 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Fix this
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                      <span className="font-bold text-slate-900 block mb-0.5">Why it matters:</span>
                      <p className="text-slate-600 leading-relaxed">{item.reason}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                      <span className="font-bold text-slate-900 block mb-0.5">Recommended action:</span>
                      <p className="text-slate-600 leading-relaxed">{item.action}</p>
                    </div>
                  </div>

                  {item.suggestionSample && (
                    <div className="p-3 bg-white/90 rounded-lg border border-slate-200/90 text-xs">
                      <span className="font-bold text-indigo-700 block mb-1">Suggested Example:</span>
                      <p className="font-mono text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                        • {item.suggestionSample}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medium Priority Section */}
        {mediumPriority.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Medium Priority Polish ({mediumPriority.length})
              </span>
            </div>

            <div className="space-y-3">
              {mediumPriority.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">
                        #{highPriority.length + idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">
                        {item.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onOpenFixer(item.suggestionSample, item.reason)}
                      className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                    >
                      Fix this
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">What to do:</span> {item.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
