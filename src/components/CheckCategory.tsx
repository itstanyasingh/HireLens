import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight, FileCheck, Layers, FileText, Wrench, Hash, Eye } from 'lucide-react';

export interface CategorySummary {
  id: string;
  name: string;
  status: string;
  passedCount?: number;
  totalCount?: number;
  issueCount?: number;
  iconName: 'ats' | 'structure' | 'content' | 'skills' | 'keywords' | 'recruiter';
}

interface CheckCategoryProps {
  categories: CategorySummary[];
  activeCategoryId?: string;
  onSelectCategory: (id: string) => void;
}

const ICON_MAP = {
  ats: FileCheck,
  structure: Layers,
  content: FileText,
  skills: Wrench,
  keywords: Hash,
  recruiter: Eye,
};

export const CheckCategory: React.FC<CheckCategoryProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
          Analysis Checklists
        </h3>
        <span className="text-xs text-slate-500 font-mono">
          7 Categories Evaluated
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {categories.map((cat) => {
          const IconComp = ICON_MAP[cat.iconName] || FileCheck;
          const isActive = activeCategoryId === cat.id;

          let badge = (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {cat.passedCount !== undefined ? `${cat.passedCount}/${cat.totalCount} Passed` : 'Passed'}
            </span>
          );

          if (cat.issueCount && cat.issueCount > 0) {
            badge = (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                {cat.issueCount} {cat.issueCount === 1 ? 'Improvement' : 'Improvements'}
              </span>
            );
          } else if (cat.status.toLowerCase().includes('problem') || cat.status.toLowerCase().includes('missing')) {
            badge = (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                {cat.status}
              </span>
            );
          }

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-4 sm:px-5 flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-slate-50/80 ${
                isActive ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600 pl-4' : ''
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                }`}>
                  <IconComp className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-900 truncate">
                    {cat.name}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {cat.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {badge}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
