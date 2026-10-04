import React, { useState } from 'react';
import { X, Sparkles, Check, Copy, AlertCircle, RefreshCw, Edit2 } from 'lucide-react';
import { fixBulletPoint } from '../services/api';

interface ResumeFixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalBullet: string;
  reason?: string;
  onApplyFix?: (fixedBullet: string) => void;
}

export const ResumeFixerModal: React.FC<ResumeFixerModalProps> = ({
  isOpen,
  onClose,
  originalBullet,
  reason,
  onApplyFix,
}) => {
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<
    { type: string; bullet: string; explanation: string }[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [customText, setCustomText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  React.useEffect(() => {
    if (isOpen && originalBullet) {
      setLoading(true);
      setApplied(false);
      setCopied(false);
      fixBulletPoint(originalBullet)
        .then((res) => {
          if (res?.variations && res.variations.length > 0) {
            setVariations(res.variations);
            setCustomText(res.variations[0].bullet);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, originalBullet]);

  if (!isOpen) return null;

  const handleSelectVariation = (idx: number) => {
    setSelectedIndex(idx);
    setCustomText(variations[idx].bullet);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApplyFix) {
      onApplyFix(customText);
    }
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#101716]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl border border-[#E2E8E5] shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#101716] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#35C99A]/20 border border-[#35C99A]/30 flex items-center justify-center text-[#35C99A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-mono">HireLens Resume Fixer</h3>
              <p className="text-[11px] text-[#8B9494]">Transform weak statements into recruiter-tested bullet points</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8B9494] hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Original Statement Box */}
          <div>
            <div className="text-xs font-semibold text-[#5F6868] uppercase tracking-wider mb-2 font-mono">
              Original Statement
            </div>
            <div className="p-4 bg-[#FFF0E7] border border-orange-200 rounded-xl text-xs font-mono text-[#293133] leading-relaxed">
              "{originalBullet}"
            </div>
            {reason && (
              <p className="mt-2 text-xs text-rose-700 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Why it needs improvement: {reason}
              </p>
            )}
          </div>

          {/* Metric Warning Reminder */}
          <div className="p-3 bg-[#FFF0E7] border border-orange-200 rounded-xl text-[11px] text-orange-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Important Discipline:</span> Never invent false numbers. Replace <span className="font-mono font-bold">[25%]</span> with real metrics from your actual work experience.
            </div>
          </div>

          {/* AI Variations Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#293133] uppercase tracking-wider font-mono">
                Select Enhancement Strategy
              </span>
              {loading && (
                <span className="text-xs text-[#168F70] flex items-center gap-1.5 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating variations...
                </span>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 bg-[#F7F8F6] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {variations.map((v, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectVariation(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedIndex === idx
                        ? 'border-[#35C99A] bg-[#F0FBF7] ring-1 ring-[#35C99A]'
                        : 'border-[#E2E8E5] bg-white hover:border-slate-300 hover:bg-[#F7F8F6]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${
                        selectedIndex === idx
                          ? 'bg-[#168F70] text-white border-[#168F70]'
                          : 'bg-[#F7F8F6] text-[#5F6868] border-[#E2E8E5]'
                      }`}>
                        {v.type}
                      </span>
                      <span className="text-[11px] text-[#5F6868]">{v.explanation}</span>
                    </div>
                    <p className="text-xs text-[#293133] font-sans font-medium leading-relaxed">
                      • {v.bullet}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editable Preview */}
          <div>
            <label className="block text-xs font-semibold text-[#293133] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <Edit2 className="w-3.5 h-3.5 text-[#168F70]" />
              Fine-Tune Before Applying
            </label>
            <textarea
              rows={3}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full text-xs font-sans bg-[#F7F8F6] border border-[#E2E8E5] rounded-xl p-3 text-[#293133] focus:bg-white outline-none"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F7F8F6] border-t border-[#E2E8E5] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#5F6868] hover:text-[#293133]"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white border border-[#E2E8E5] hover:border-slate-300 text-[#293133] text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>

            <button
              onClick={handleApply}
              disabled={applied}
              className="px-6 py-2 bg-[#35C99A] hover:bg-[#168F70] text-[#101716] hover:text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
            >
              {applied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Sparkles className="w-4 h-4" />}
              {applied ? 'Applied!' : 'Apply Suggestion'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
