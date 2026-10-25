import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Copy, 
  RotateCcw, 
  FileText, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { generateResumeSummary, BuilderSummaryResponse } from '../../services/api';

interface SummaryGeneratorModalProps {
  currentSummary: string;
  targetRole: string;
  keySkills: string;
  isOpen: boolean;
  onClose: () => void;
  onApplySummary: (newSummary: string) => void;
}

export const SummaryGeneratorModal: React.FC<SummaryGeneratorModalProps> = ({
  currentSummary,
  targetRole: initialTargetRole,
  keySkills,
  isOpen,
  onClose,
  onApplySummary
}) => {
  const [targetRole, setTargetRole] = useState(initialTargetRole || 'Senior Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'Senior & Executive' | 'Entry- & Mid-Level' | 'Career Changers'>('Senior & Executive');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuilderSummaryResponse | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [appliedIdx, setAppliedIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError('Please provide a target role title.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await generateResumeSummary({
        targetRole,
        experienceLevel,
        keySkills,
        jobDescription
      });
      setResult(data);
      setAppliedIdx(null);
    } catch (e: any) {
      setError(e.message || 'Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleApply = (text: string, idx: number) => {
    onApplySummary(text);
    setAppliedIdx(idx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Job-Specific Resume Summary Generator
              </h2>
              <p className="text-xs text-slate-500">
                Formula-based executive summaries tailored to your exact target role
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Experience Level Profile
              </label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-500 outline-none cursor-pointer"
              >
                <option value="Senior & Executive">Senior & Executive (Scale & Leadership)</option>
                <option value="Entry- & Mid-Level">Entry- & Mid-Level (Execution & Tech Stack)</option>
                <option value="Career Changers">Career Changers (Transferable Impact)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
              <span>Target Job Description (Optional)</span>
              <span className="text-[10.5px] text-slate-400">Pulls keywords & priorities</span>
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste job posting snippet to incorporate company terminology and key deliverables..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:bg-white focus:border-purple-500 outline-none resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Generating Summaries...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Formulas</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Variations */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                Recommended Summary Formulas
              </span>

              <div className="space-y-4">
                {result.variations.map((v, idx) => {
                  const isApplied = appliedIdx === idx;
                  const wordCount = v.text.split(/\s+/).filter(Boolean).length;

                  return (
                    <div 
                      key={idx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">{v.title}</span>
                          <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md font-mono">
                            {v.formula}
                          </span>
                        </div>
                        <span className="text-[10.5px] text-slate-500">{wordCount} words</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                        {v.text}
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(v.text, idx)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => handleApply(v.text, idx)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                          }`}
                        >
                          {isApplied ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                          <span>{isApplied ? 'Applied to Resume' : 'Apply to Resume'}</span>
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
            Current summary length: {currentSummary ? currentSummary.split(/\s+/).filter(Boolean).length : 0} words
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
