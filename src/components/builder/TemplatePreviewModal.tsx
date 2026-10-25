import React, { useState } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Check, 
  Palette, 
  Type, 
  Layout, 
  ShieldCheck, 
  Download,
  ArrowRight
} from 'lucide-react';
import { ResumeData, ResumeDesign, AccentColor, FontFamily, TemplateId } from '../../types/resumeBuilder';
import { ResumeTemplateMeta } from '../../data/resumeTemplatesMeta';
import { ResumeTemplateRenderer } from '../builder/ResumeTemplateRenderer';

interface TemplatePreviewModalProps {
  template: ResumeTemplateMeta;
  resumeData: ResumeData;
  onClose: () => void;
  onSelectAndEdit: (templateId: TemplateId, design: ResumeDesign) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  resumeData,
  onClose,
  onSelectAndEdit
}) => {
  const [accentColor, setAccentColor] = useState<AccentColor>('#16B889');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');

  const currentDesign: ResumeDesign = {
    templateId: template.id,
    accentColor,
    fontFamily,
    spacing: 'comfortable'
  };

  const colors: { label: string; value: AccentColor }[] = [
    { label: 'Enhancv Mint', value: '#16B889' },
    { label: 'Deep Navy', value: '#1E3A8A' },
    { label: 'Indigo', value: '#4F46E5' },
    { label: 'Crimson', value: '#991B1B' },
    { label: 'Charcoal', value: '#334155' }
  ];

  const fonts: { label: string; value: FontFamily }[] = [
    { label: 'Inter Sans', value: 'sans' },
    { label: 'Merriweather Serif', value: 'serif' },
    { label: 'JetBrains Mono', value: 'mono' }
  ];

  const handleApply = () => {
    onSelectAndEdit(template.id, currentDesign);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#E3ECE7]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E3ECE7] flex items-center justify-between bg-[#F9FBFA] shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-[#16B889]/10 text-[#16B889] text-[11px] font-bold rounded-lg font-mono">
              TEMPLATE PREVIEW
            </span>
            <div>
              <h2 className="text-base font-extrabold text-[#192622]">{template.name}</h2>
              <p className="text-xs text-[#7A8A85]">{template.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#16B889] hover:bg-[#139E75] text-white shadow-sm cursor-pointer transition-all"
            >
              <span>Use This Template in Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#EAF0EC] hover:bg-[#DCE7E2] flex items-center justify-center text-[#55625F] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Customization Sidebar + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Customization Sidebar */}
          <div className="lg:col-span-4 bg-[#F7FAF9] border-r border-[#E3ECE7] p-6 space-y-6 overflow-y-auto">
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#273330] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#16B889]" />
                <span>Accent Color</span>
              </h3>
              <div className="grid grid-cols-5 gap-2 pt-1">
                {colors.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setAccentColor(c.value)}
                    className={`h-9 rounded-xl transition-all cursor-pointer flex items-center justify-center ${accentColor === c.value ? 'ring-2 ring-offset-2 ring-[#16B889] scale-105' : 'opacity-80 hover:opacity-100'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  >
                    {accentColor === c.value && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#273330] flex items-center gap-2">
                <Type className="w-4 h-4 text-[#16B889]" />
                <span>Font Family</span>
              </h3>
              <div className="space-y-2 pt-1">
                {fonts.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFontFamily(f.value)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${fontFamily === f.value ? 'bg-[#16B889] text-white shadow-sm' : 'bg-white text-[#55625F] border border-[#D9E3DF] hover:bg-[#F0F5F2]'}`}
                  >
                    <span>{f.label}</span>
                    {fontFamily === f.value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E2EBE6] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16B889]">
                <ShieldCheck className="w-4 h-4" />
                <span>ATS Compatibility Verified</span>
              </div>
              <p className="text-[11px] text-[#55625F] leading-relaxed">
                This template adheres strictly to computerized ATS parsing rules with clean DOM hierarchy and selectable plain text.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-[#7A8A85] uppercase tracking-wider">Template Highlights</h4>
              <ul className="space-y-1.5">
                {template.features.map((feat, idx) => (
                  <li key={idx} className="text-xs text-[#334155] flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#16B889] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Live Resume Render */}
          <div className="lg:col-span-8 bg-[#EDF2F0] p-6 overflow-y-auto flex items-center justify-center">
            <div className="w-full max-w-[720px] shadow-2xl rounded-2xl bg-white overflow-hidden scale-95 origin-top transition-transform">
              <ResumeTemplateRenderer
                data={resumeData}
                design={currentDesign}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
