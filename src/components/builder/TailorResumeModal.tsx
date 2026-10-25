import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  ArrowRight, 
  RotateCcw, 
  TrendingUp, 
  AlertCircle,
  FileText,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { tailorResume, TailorResumeResponse } from '../../services/api';
import { ResumeData } from '../../types/resumeBuilder';

interface TailorResumeModalProps {
  currentResume: ResumeData;
  isOpen: boolean;
  onClose: () => void;
  onApplyChanges: (changes: {
    appliedBullets?: { original: string; tailored: string }[];
    addedKeywords?: string[];
  }) => void;
}

export const TailorResumeModal: React.FC<TailorResumeModalProps> = ({
  currentResume,
  isOpen,
  onClose,
  onApplyChanges
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState(currentResume.personal.targetTitle || 'Senior Software Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TailorResumeResponse | null>(null);
  const [appliedBulletMap, setAppliedBulletMap] = useState<Record<number, boolean>>({});
  const [appliedKeywords, setAppliedKeywords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTailor = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setError('Please paste a job description (at least 20 characters).');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Compile current resume text
      const resumeText = `
${currentResume.personal.fullName}
${currentResume.personal.targetTitle}
${currentResume.summary}

SKILLS:
${currentResume.skills.join(', ')}

EXPERIENCE:
${currentResume.experience.map(e => `${e.role} at ${e.company}\n${e.bullets.join('\n')}`).join('\n\n')}
      `.trim();

      const data = await tailorResume({
        resumeText,
        jobDescription,
        targetRole
      });

      setResult(data);
      setAppliedBulletMap({});
      setAppliedKeywords([]);
    } catch (err: any) {
      setError(err.message || 'Failed to tailor resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySingleBullet = (idx: number, original: string, tailored: string) => {
    setAppliedBulletMap(prev => ({ ...prev, [idx]: !prev[idx] }));
    onApplyChanges({
      appliedBullets: [{ original, tailored }]
    });
  };

  const handleAddKeyword = (kw: string) => {
    if (appliedKeywords.includes(kw)) return;
    setAppliedKeywords(prev => [...prev, kw]);
    onApplyChanges({
      addedKeywords: [kw]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                One-Click Resume Tailor
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  ATS Alignment
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Align your experience bullets and skills directly to the target job description
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Target Job Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                <span>Resume Source</span>
                <span className="text-[10.5px] text-emerald-600 font-semibold">Active Builder Draft</span>
              </label>
              <div className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 flex items-center justify-between">
                <span>{currentResume.personal.fullName} · {currentResume.experience.length} Positions</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
              <span>Paste Target Job Description</span>
              <span className="text-[10.5px] text-slate-400">Required for tailoring</span>
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste job posting text here (responsibilities, required skills, and expectations)..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleTailor}
              disabled={loading}
              className="flex items-center gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Analyzing & Tailoring...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tailor Resume in 1-Click</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              
              {/* Score & Match Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-emerald-300 shadow-xs flex flex-col items-center justify-center font-black text-emerald-700">
                    <span className="text-base leading-none">{result.tailorScore}%</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-600">Match</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">
                      Tailoring Match Analysis Complete
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Found {result.matchedKeywords.length} matching keywords and identified {result.missingKeywords.length} high-value missing requirements.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-bold text-emerald-800 bg-white/80 border border-emerald-200 rounded-lg px-3 py-1.5 self-start sm:self-auto">
                  ATS Alignment: Optimal
                </div>
              </div>

              {/* Keywords Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                    ✓ Matched Skills ({result.matchedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i} className="text-[11px] bg-emerald-100/70 text-emerald-800 px-2 py-0.5 rounded-md font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                    + Missing High-Priority Keywords (Click to add to skills)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((kw, i) => {
                      const isAdded = appliedKeywords.includes(kw);
                      return (
                        <button
                          key={i}
                          onClick={() => handleAddKeyword(kw)}
                          disabled={isAdded}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200 border border-amber-200'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3" /> : '+'}
                          <span>{kw}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Proposed Bullet Rewrites */}
              {result.bulletRewrites && result.bulletRewrites.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Proposed Bullet Point Alignments
                  </h3>
                  <div className="space-y-3">
                    {result.bulletRewrites.map((rewrite, rIdx) => {
                      const isApplied = !!appliedBulletMap[rIdx];
                      return (
                        <div 
                          key={rIdx} 
                          className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs hover:border-slate-300 transition-colors"
                        >
                          <div className="text-[11px] text-slate-500 flex items-start gap-2">
                            <span className="font-bold text-slate-400 shrink-0">Original:</span>
                            <span className="line-through text-slate-400">{rewrite.original}</span>
                          </div>
                          <div className="text-xs text-slate-900 font-medium flex items-start gap-2">
                            <span className="font-bold text-emerald-600 shrink-0">Tailored:</span>
                            <span>{rewrite.tailored}</span>
                          </div>
                          <div className="text-[10.5px] text-slate-500 italic flex items-center justify-between pt-1 border-t border-slate-100">
                            <span>{rewrite.alignmentReason}</span>
                            <button
                              onClick={() => handleApplySingleBullet(rIdx, rewrite.original, rewrite.tailored)}
                              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                isApplied
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                              }`}
                            >
                              {isApplied ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Applied</span>
                                </>
                              ) : (
                                <>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                  <span>Apply to Resume</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section Advice */}
              {result.sectionAdvice && result.sectionAdvice.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Recruiter Strategy Advice
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {result.sectionAdvice.map((adv, aIdx) => (
                      <div key={aIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-slate-900">{adv.section} Strategy</span>
                        <p className="text-[11px] text-slate-600 leading-snug">{adv.advice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Never invents fake credentials; aligns authentic candidate experiences.
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
