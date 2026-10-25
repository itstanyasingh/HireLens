import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Copy, 
  RotateCcw, 
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';
import { rewriteResumeBullet, BuilderBulletResponse } from '../../services/api';

interface BulletGeneratorModalProps {
  initialBullet?: string;
  targetRole?: string;
  isOpen: boolean;
  onClose: () => void;
  onInsertBullet: (newBullet: string) => void;
}

export const BulletGeneratorModal: React.FC<BulletGeneratorModalProps> = ({
  initialBullet = '',
  targetRole = 'Senior Software Engineer',
  isOpen,
  onClose,
  onInsertBullet
}) => {
  const [bullet, setBullet] = useState(initialBullet || 'Developed web applications using React and TypeScript.');
  const [goal, setGoal] = useState<'recruiter' | 'metric' | 'leadership' | 'custom'>('recruiter');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuilderBulletResponse | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [insertedIdx, setInsertedIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRewrite = async () => {
    if (!bullet.trim() || bullet.trim().length < 5) {
      setError('Please provide a bullet point (at least 5 characters) to rewrite.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await rewriteResumeBullet({
        originalBullet: bullet,
        targetRole,
        goal,
        customPrompt: goal === 'custom' ? customPrompt : ''
      });
      setResult(data);
      setInsertedIdx(null);
    } catch (e: any) {
      setError(e.message || 'Failed to rewrite bullet.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleInsert = (text: string, idx: number) => {
    onInsertBullet(text);
    setInsertedIdx(idx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Experience Bullet Point Generator
              </h2>
              <p className="text-xs text-slate-500">
                Rewrite experience bullets with action verbs, quantifiable metrics, and recruiter structures
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
          {/* Bullet Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
              <span>Experience Bullet Point to Enhance</span>
              <span className="text-[10.5px] text-slate-400">Can be rough or passive draft</span>
            </label>
            <textarea
              rows={3}
              value={bullet}
              onChange={e => setBullet(e.target.value)}
              placeholder="e.g. Responsible for building APIs and working with product team..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:bg-white focus:border-blue-500 outline-none resize-y"
            />
          </div>

          {/* Goal Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Optimization Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setGoal('recruiter')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  goal === 'recruiter'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>Recruiter</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">Active verbs + scope</div>
              </button>

              <button
                type="button"
                onClick={() => setGoal('metric')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  goal === 'metric'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Metrics</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">% and scale metrics</div>
              </button>

              <button
                type="button"
                onClick={() => setGoal('leadership')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  goal === 'leadership'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Leadership</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">Strategy & speed</div>
              </button>

              <button
                type="button"
                onClick={() => setGoal('custom')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  goal === 'custom'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Custom</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">Your exact prompt</div>
              </button>
            </div>
          </div>

          {goal === 'custom' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Custom Instructions
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="e.g. Focus on AWS serverless cost savings and team mentoring..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleRewrite}
              disabled={loading || !bullet.trim()}
              className="flex items-center gap-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Rewriting Bullet...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Rewrite Bullet Instantly</span>
                </>
              )}
            </button>
          </div>

          {/* Variations List */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                Polished Bullet Variations
              </span>

              <div className="space-y-3">
                {result.variations.map((v, idx) => {
                  const isInserted = insertedIdx === idx;
                  return (
                    <div 
                      key={idx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded-md">
                          {v.type}
                        </span>
                        <span className="text-[10.5px] text-slate-500 italic">{v.explanation}</span>
                      </div>

                      <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                        • {v.bullet}
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(v.bullet, idx)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => handleInsert(v.bullet, idx)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                            isInserted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                          }`}
                        >
                          {isInserted ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                          <span>{isInserted ? 'Inserted into Experience' : 'Insert into Experience'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Formula: Action Verb + Project / Task + Quantifiable Impact
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
