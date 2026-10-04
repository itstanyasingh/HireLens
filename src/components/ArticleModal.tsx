import React from 'react';
import { X, BookOpen, CheckCircle2, ArrowRight, Share2, Sparkles } from 'lucide-react';

export interface ArticleData {
  category: string;
  title: string;
  readTime?: string;
  summary: string;
  sections: { heading: string; body: string; tips?: string[] }[];
}

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleData | null;
  onActionClick?: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  article,
  onActionClick,
}) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#071310]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#E2E8E5] shadow-2xl w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 bg-[#0E1B18] text-white flex items-start justify-between border-b border-white/10 shrink-0">
          <div className="space-y-1.5 pr-4">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#5AD3AD] font-sans block">
              {article.category} · {article.readTime || '4 MIN READ'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {article.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-[#99A6A2] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label="Close article"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#44524E]">
          
          <div className="p-4 bg-[#F2FBF7] border border-[#C8EFE2] rounded-xl text-xs text-[#1E5E4E] font-medium leading-relaxed">
            💡 <strong>Quick Takeaway:</strong> {article.summary}
          </div>

          {article.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2.5">
              <h3 className="text-lg font-bold text-[#273330] tracking-tight">
                {sec.heading}
              </h3>
              <p className="text-sm leading-relaxed text-[#55625F]">
                {sec.body}
              </p>
              {sec.tips && sec.tips.length > 0 && (
                <div className="bg-[#F8FAF9] border border-[#E7ECE9] rounded-xl p-4 space-y-2 text-xs text-[#273330]">
                  <span className="font-bold text-[#16B889] block uppercase tracking-wider text-[10.5px]">
                    Recommended Action Items:
                  </span>
                  {sec.tips.map((tip, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>

        {/* Footer CTA */}
        <div className="px-6 sm:px-8 py-4 bg-[#F8FAF9] border-t border-[#EEF2F0] flex items-center justify-between gap-4 shrink-0">
          <span className="text-xs text-[#697572]">
            Ready to test your resume against these rules?
          </span>

          <button
            onClick={() => {
              onClose();
              if (onActionClick) onActionClick();
            }}
            className="px-5 py-2.5 bg-[#16B889] hover:bg-[#129A72] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Check My Resume Now
          </button>
        </div>

      </div>
    </div>
  );
};
