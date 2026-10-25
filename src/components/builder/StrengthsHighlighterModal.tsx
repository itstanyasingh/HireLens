import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  TrendingUp, 
  Award, 
  RotateCcw, 
  Plus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { extractResumeStrengths, BuilderStrengthsResponse } from '../../services/api';
import { AchievementItem } from '../../types/resumeBuilder';

interface StrengthsHighlighterModalProps {
  currentAchievements: AchievementItem[];
  targetRole?: string;
  isOpen: boolean;
  onClose: () => void;
  onAddAchievement: (achievement: AchievementItem) => void;
}

export const StrengthsHighlighterModal: React.FC<StrengthsHighlighterModalProps> = ({
  currentAchievements,
  targetRole = 'Senior Software Engineer',
  isOpen,
  onClose,
  onAddAchievement
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuilderStrengthsResponse | null>(null);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtractStrengths = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await extractResumeStrengths({
        jobDescription,
        targetRole
      });
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Failed to extract strengths.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (title: string, metric: string, description: string) => {
    const item: AchievementItem = {
      id: `ach-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      metric,
      description
    };
    onAddAchievement(item);
    setAddedItems(prev => [...prev, title]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Strengths & Achievements Highlighter
              </h2>
              <p className="text-xs text-slate-500">
                Put your best accomplishments front and center with measurable business impact
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer">×</button>
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
              <span>Target Job Description</span>
              <span className="text-[10.5px] text-slate-400">Identifies requirements to highlight</span>
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here. We'll tell you exactly what strengths and metrics to highlight..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:bg-white focus:border-amber-500 outline-none resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExtractStrengths}
              disabled={loading}
              className="flex items-center gap-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Role Strengths...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Highlight Best Accomplishments</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-5 pt-4 border-t border-slate-100">
              
              {/* Strengths Cards */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Core Role Strengths & Metrics
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.strengths.map((str, sIdx) => {
                    const isAdded = addedItems.includes(str.title);
                    return (
                      <div 
                        key={sIdx}
                        className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                            {str.category}
                          </span>
                          <h4 className="text-xs font-black text-slate-900 leading-snug">
                            {str.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            {str.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                          <span className="text-xs font-black text-amber-900">
                            {str.metric}
                          </span>
                          <button
                            onClick={() => handleAdd(str.title, str.metric, str.description)}
                            disabled={isAdded}
                            className={`text-[10.5px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            <span>{isAdded ? 'Added' : 'Add Card'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Key Achievements List */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  High-Impact Achievement Badges
                </span>
                <div className="space-y-2">
                  {result.recommendedKeyAchievements.map((rec, rIdx) => {
                    const isAdded = addedItems.includes(rec);
                    return (
                      <div 
                        key={rIdx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{rec}</span>
                        </div>
                        <button
                          onClick={() => handleAdd(rec.slice(0, 30), rec.match(/\d+[\w%+]*/)?.[0] || 'High Impact', rec)}
                          disabled={isAdded}
                          className={`text-xs font-bold px-3 py-1 rounded-lg shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                          }`}
                        >
                          {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{isAdded ? 'Added' : 'Add to Resume'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Active achievements on resume: {currentAchievements.length}
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
