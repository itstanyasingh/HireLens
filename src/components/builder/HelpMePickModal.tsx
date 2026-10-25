import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Check, ArrowLeft, Target, Layers } from 'lucide-react';
import { RESUME_TEMPLATES_META, ResumeTemplateMeta } from '../../data/resumeTemplatesMeta';
import { TemplateId, ResumeDesign } from '../../types/resumeBuilder';

interface HelpMePickModalProps {
  onClose: () => void;
  onSelectTemplate: (templateId: TemplateId) => void;
}

export const HelpMePickModal: React.FC<HelpMePickModalProps> = ({
  onClose,
  onSelectTemplate
}) => {
  const [step, setStep] = useState<number>(1);
  const [experience, setExperience] = useState<'Entry' | 'Mid-Level' | 'Senior' | 'Executive'>('Mid-Level');
  const [roleType, setRoleType] = useState<string>('Tech / Software Engineering');
  const [layoutPref, setLayoutPref] = useState<'Two-Column' | 'Sidebar' | 'Single Column'>('Two-Column');
  const [stylePref, setStylePref] = useState<'Modern' | 'Executive' | 'Classic'>('Modern');
  const [recommendations, setRecommendations] = useState<ResumeTemplateMeta[]>([]);

  const handleCalculateRecommendations = () => {
    let matches = [...RESUME_TEMPLATES_META];
    
    if (layoutPref) {
      matches = matches.filter(t => t.layout === layoutPref || t.columns === (layoutPref === 'Single Column' ? 1 : 2));
    }
    if (stylePref) {
      matches = matches.filter(t => t.style === stylePref || t.category === 'Top Picks');
    }
    if (matches.length === 0) {
      matches = RESUME_TEMPLATES_META.slice(0, 2);
    }
    setRecommendations(matches.slice(0, 3));
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E3ECE7] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-8 h-8 rounded-full bg-[#EAF0EC] hover:bg-[#DCE7E2] flex items-center justify-center text-[#55625F] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <span className="text-[11px] font-bold text-[#16B889] uppercase tracking-widest font-mono">
                TEMPLATE RECOMMENDATION WIZARD
              </span>
              <h2 className="text-2xl font-black text-[#192622]">Help Me Pick a Template</h2>
              <p className="text-xs text-[#55625F] max-w-md mx-auto">
                Answer 3 quick questions about your career stage and style preferences to receive personalized recruiter-approved template matches.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {/* Question 1 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#273330] block">1. What is your experience level or career stage?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Entry', 'Mid-Level', 'Senior', 'Executive'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperience(lvl)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${experience === lvl ? 'bg-[#16B889] text-white border-[#16B889] shadow-xs' : 'bg-[#F9FBFA] text-[#55625F] border-[#D9E3DF] hover:bg-[#F0F5F2]'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#273330] block">2. What is your preferred template layout?</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Two-Column', 'Sidebar', 'Single Column'] as const).map(lay => (
                    <button
                      key={lay}
                      type="button"
                      onClick={() => setLayoutPref(lay)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${layoutPref === lay ? 'bg-[#16B889] text-white border-[#16B889] shadow-xs' : 'bg-[#F9FBFA] text-[#55625F] border-[#D9E3DF] hover:bg-[#F0F5F2]'}`}
                    >
                      {lay}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#273330] block">3. Choose your desired design style:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Modern', 'Executive', 'Classic'] as const).map(sty => (
                    <button
                      key={sty}
                      type="button"
                      onClick={() => setStylePref(sty)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${stylePref === sty ? 'bg-[#16B889] text-white border-[#16B889] shadow-xs' : 'bg-[#F9FBFA] text-[#55625F] border-[#D9E3DF] hover:bg-[#F0F5F2]'}`}
                    >
                      {sty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={handleCalculateRecommendations}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold bg-[#16B889] hover:bg-[#139E75] text-white shadow-md cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Show My Recommended Templates</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E3ECE7] pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#16B889] uppercase tracking-wider font-mono">
                  PERSONALIZED MATCHES
                </span>
                <h2 className="text-xl font-extrabold text-[#192622]">Recommended For You</h2>
              </div>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#55625F] hover:text-[#16B889] cursor-pointer bg-[#F0F5F2] px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Adjust Answers</span>
              </button>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={rec.id} className="p-4 rounded-2xl bg-[#F9FBFA] border border-[#E3ECE7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#16B889] text-white text-[10px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-extrabold text-[#192622]">{rec.name}</h3>
                      {rec.badge && (
                        <span className="px-2 py-0.5 bg-[#EAF8F3] text-[#129A72] text-[10px] font-bold rounded">
                          {rec.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#55625F]">{rec.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTemplate(rec.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-[#16B889] hover:bg-[#139E75] text-white text-xs font-bold rounded-xl cursor-pointer transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
