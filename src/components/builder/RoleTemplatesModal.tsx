import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Briefcase, 
  Sparkles, 
  GraduationCap, 
  TrendingUp, 
  UserCheck, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { ROLE_PRESETS, EXPERIENCE_LEVEL_PROFILES, RolePreset } from '../../data/builderPresets';
import { ResumeData, TemplateId, AccentColor } from '../../types/resumeBuilder';

interface RoleTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: { data: ResumeData; templateId: TemplateId; accentColor: AccentColor }) => void;
}

export const RoleTemplatesModal: React.FC<RoleTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('software-engineer');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('senior-executive');

  if (!isOpen) return null;

  const currentRole = ROLE_PRESETS.find(r => r.id === selectedRoleId) || ROLE_PRESETS[0];
  const currentLevel = EXPERIENCE_LEVEL_PROFILES.find(l => l.id === selectedLevelId) || EXPERIENCE_LEVEL_PROFILES[0];

  const handleApply = () => {
    onSelectPreset({
      data: currentRole.data,
      templateId: currentRole.recommendedTemplate,
      accentColor: currentRole.accentColor
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Industry Roles & Experience Templates
              </h2>
              <p className="text-xs text-slate-500">
                Verified recruiter-vetted resume templates inspired by top Enhancv layouts
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
          
          {/* Experience Level Selector (Screenshot 8) */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
              1. Select Experience Level
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EXPERIENCE_LEVEL_PROFILES.map(level => {
                const isSelected = selectedLevelId === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevelId(level.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{level.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {level.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Industry Roles Carousel / Selector (Screenshot 10) */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
              2. Select Target Industry & Role
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ROLE_PRESETS.map(role => {
                const isSelected = selectedRoleId === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 uppercase font-mono">{role.category}</div>
                    <div className="text-xs font-bold truncate mt-0.5">{role.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div>
                <h4 className="text-xs font-black text-slate-900">{currentRole.name}</h4>
                <p className="text-[11px] text-slate-500">
                  Recommended Layout: <span className="font-semibold text-slate-700">{currentRole.recommendedTemplate}</span> · Accent: <span className="font-mono text-emerald-700">{currentRole.accentColor}</span>
                </p>
              </div>
              <span className="text-xs font-bold bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                {currentRole.data.experience.length} Positions · {currentRole.data.skills.length} Skills
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{currentRole.data.summary}"
            </p>

            {/* Level guidance tips */}
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[10.5px] font-bold text-slate-700 block mb-1">
                Strategic Focus for {currentLevel.title}:
              </span>
              <ul className="space-y-0.5">
                {currentLevel.focusTips.map((tip, i) => (
                  <li key={i} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Loading this preset will populate the live editor with verified sample data.
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Load Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
