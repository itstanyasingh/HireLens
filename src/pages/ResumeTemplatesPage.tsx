import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  SlidersHorizontal, 
  Upload, 
  Check, 
  Eye, 
  Filter, 
  RotateCcw,
  Layers,
  ChevronDown
} from 'lucide-react';
import { RESUME_TEMPLATES_META, ResumeTemplateMeta } from '../data/resumeTemplatesMeta';
import { TemplatePreviewModal } from '../components/builder/TemplatePreviewModal';
import { HelpMePickModal } from '../components/builder/HelpMePickModal';
import { ImportResumeModal } from '../components/builder/ImportResumeModal';
import { ResumeData, ResumeDesign, TemplateId } from '../types/resumeBuilder';
import { ROLE_PRESETS } from '../data/builderPresets';

interface ResumeTemplatesPageProps {
  onBackToHome: () => void;
  onOpenBuilderWithTemplate: (templateId: TemplateId, design?: ResumeDesign) => void;
}

const STORAGE_KEY = 'hirelens_resume_builder_full_draft';

export const ResumeTemplatesPage: React.FC<ResumeTemplatesPageProps> = ({
  onBackToHome,
  onOpenBuilderWithTemplate
}) => {
  // Load active resume data from storage or fallback to preset
  const [resumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.personal && parsed.experience) {
          return parsed;
        }
      }
    } catch (e) {}
    return ROLE_PRESETS[0].data;
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [selectedLayout, setSelectedLayout] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('All');
  const [selectedColumns, setSelectedColumns] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplateMeta | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Filter logic
  const filteredTemplates = useMemo(() => {
    return RESUME_TEMPLATES_META.filter(t => {
      if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
      if (selectedStyle !== 'All' && t.style !== selectedStyle) return false;
      if (selectedLayout !== 'All' && t.layout !== selectedLayout) return false;
      if (selectedExperience !== 'All' && t.experience !== selectedExperience) return false;
      if (selectedColor !== 'All' && t.colorTone !== selectedColor) return false;
      if (selectedPhoto === 'Photo' && !t.hasPhoto) return false;
      if (selectedPhoto === 'No Photo' && t.hasPhoto) return false;
      if (selectedColumns === 'Single' && t.columns !== 1) return false;
      if (selectedColumns === 'Double' && t.columns !== 2) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchSub = t.subtitle.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchSub) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedStyle, selectedLayout, selectedExperience, selectedColor, selectedPhoto, selectedColumns, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedStyle('All');
    setSelectedLayout('All');
    setSelectedExperience('All');
    setSelectedColor('All');
    setSelectedPhoto('All');
    setSelectedColumns('All');
    setSearchQuery('');
  };

  const handleImportComplete = (extractedText: string) => {
    try {
      // Update resume data summary or experience with imported text
      const updated = { ...resumeData };
      updated.summary = extractedText.substring(0, 400);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    setIsImportOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#273330] pb-28">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E3ECE7] px-6 py-3.5 shadow-2xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs font-bold text-[#55625F] hover:text-[#16B889] transition-colors cursor-pointer bg-[#F0F5F2] hover:bg-[#E4EFEA] px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="h-4 w-px bg-[#DCE5E0]"></div>
            <div>
              <h1 className="text-sm font-extrabold text-[#273330] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#16B889]" />
                Resume Templates Gallery
              </h1>
              <p className="text-[11px] text-[#7A8A85]">Recruiter-approved, ATS-friendly templates with live preview & editor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsImportOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#55625F] bg-[#F0F5F2] hover:bg-[#E4EFEA] px-3.5 py-2 rounded-xl cursor-pointer transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-[#16B889]" />
              <span>Import Resume</span>
            </button>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#16B889] hover:bg-[#139E75] px-4 py-2 rounded-xl shadow-sm cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Help Me Pick a Template</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 pt-10 space-y-8">
        
        {/* Hero Title Section */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11.5px] font-bold uppercase tracking-[2px] text-[#16B889] font-mono">
            ATS-OPTIMIZED DESIGNS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#192622] tracking-tight">
            Resume Templates
          </h2>
          <p className="text-xs sm:text-sm text-[#55625F] leading-relaxed">
            Start with a recruiter-approved, ATS-friendly template, then customize everything in the live editor in minutes and download as a verified PDF.
          </p>

          <div className="pt-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[#98A8A3] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search templates by name, style, or features..."
                className="w-full text-xs bg-white border border-[#D9E3DF] rounded-xl pl-10 pr-4 py-2.5 text-[#273330] focus:border-[#16B889] outline-none shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-[#E3ECE7] p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0F4F2] pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#16B889]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#192622]">Filter Templates</span>
              <span className="text-[11px] text-[#7A8A85]">({filteredTemplates.length} available)</span>
            </div>
            
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] font-bold text-[#55625F] hover:text-[#16B889] cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Category Filter */}
            <div>
              <label className="text-[10px] font-bold text-[#7A8A85] uppercase tracking-wider block mb-1">Top Picks</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-2.5 py-2 text-[#273330] focus:border-[#16B889] outline-none cursor-pointer font-medium"
              >
                <option value="All">All Categories</option>
                <option value="Top Picks">Top Picks</option>
                <option value="ATS Optimized">ATS Optimized</option>
                <option value="Executive">Executive</option>
                <option value="Modern">Modern</option>
              </select>
            </div>

            {/* Style Filter */}
            <div>
              <label className="text-[10px] font-bold text-[#7A8A85] uppercase tracking-wider block mb-1">Style</label>
              <select
                value={selectedStyle}
                onChange={e => setSelectedStyle(e.target.value)}
                className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-2.5 py-2 text-[#273330] focus:border-[#16B889] outline-none cursor-pointer font-medium"
              >
                <option value="All">All Styles</option>
                <option value="Modern">Modern</option>
                <option value="Executive">Executive</option>
                <option value="Classic">Classic</option>
              </select>
            </div>

            {/* Layout Filter */}
            <div>
              <label className="text-[10px] font-bold text-[#7A8A85] uppercase tracking-wider block mb-1">Layout</label>
              <select
                value={selectedLayout}
                onChange={e => setSelectedLayout(e.target.value)}
                className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-2.5 py-2 text-[#273330] focus:border-[#16B889] outline-none cursor-pointer font-medium"
              >
                <option value="All">All Layouts</option>
                <option value="Two-Column">Two-Column</option>
                <option value="Sidebar">Sidebar</option>
                <option value="Single Column">Single Column</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="text-[10px] font-bold text-[#7A8A85] uppercase tracking-wider block mb-1">Experience</label>
              <select
                value={selectedExperience}
                onChange={e => setSelectedExperience(e.target.value)}
                className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-2.5 py-2 text-[#273330] focus:border-[#16B889] outline-none cursor-pointer font-medium"
              >
                <option value="All">All Levels</option>
                <option value="Entry">Entry</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            {/* Color Tone */}
            <div>
              <label className="text-[10px] font-bold text-[#7A8A85] uppercase tracking-wider block mb-1">Color Tone</label>
              <select
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-2.5 py-2 text-[#273330] focus:border-[#16B889] outline-none cursor-pointer font-medium"
              >
                <option value="All">All Tones</option>
                <option value="Green">Green / Mint</option>
                <option value="Charcoal">Charcoal / Dark</option>
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
              </select>
            </div>

            {/* Columns */}
            <div>
              <label className="text-[10px] font-bold text-[#7A8A85] uppercase tracking-wider block mb-1">Columns</label>
              <select
                value={selectedColumns}
                onChange={e => setSelectedColumns(e.target.value)}
                className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-2.5 py-2 text-[#273330] focus:border-[#16B889] outline-none cursor-pointer font-medium"
              >
                <option value="All">All Columns</option>
                <option value="Single">Single Column</option>
                <option value="Double">Double Column</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Gallery Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredTemplates.map(template => (
              <div 
                key={template.id}
                className="bg-white rounded-3xl border border-[#DCE7E2] overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                {/* Template Info Top */}
                <div className="p-6 sm:p-7 space-y-3 border-b border-[#F0F4F2]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-[#192622]">{template.name}</h3>
                      {template.badge && (
                        <span className="px-2 py-0.5 bg-[#EAF8F3] text-[#129A72] text-[10px] font-extrabold rounded-md font-mono">
                          {template.badge}
                        </span>
                      )}
                    </div>
                    {template.atsFriendly && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#16B889] bg-[#F4FAF7] px-2.5 py-1 rounded-lg border border-[#C5E9DD]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>ATS Verified</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#55625F] leading-relaxed">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-mono bg-[#F0F5F2] text-[#55625F] px-2 py-0.5 rounded">
                      {template.style}
                    </span>
                    <span className="text-[10px] font-mono bg-[#F0F5F2] text-[#55625F] px-2 py-0.5 rounded">
                      {template.layout}
                    </span>
                    <span className="text-[10px] font-mono bg-[#F0F5F2] text-[#55625F] px-2 py-0.5 rounded">
                      {template.experience} Level
                    </span>
                  </div>
                </div>

                {/* Template Thumbnail Preview Box */}
                <div className="bg-[#EDF2F0] p-6 flex items-center justify-center min-h-[320px] overflow-hidden relative">
                  <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg transform group-hover:scale-102 transition-transform origin-top p-4 text-[9px] pointer-events-none select-none">
                    {/* Mini Header preview */}
                    <div className="border-b pb-2 mb-2 flex justify-between items-baseline">
                      <div>
                        <div className="font-bold text-xs">{resumeData.personal.fullName || 'Alex Morgan'}</div>
                        <div className="text-[10px] text-[#16B889] font-bold">{resumeData.personal.targetTitle || template.subtitle}</div>
                      </div>
                      <div className="text-[8px] text-slate-400">{resumeData.personal.email}</div>
                    </div>
                    {/* Mini summary preview */}
                    <div className="space-y-1 text-slate-600">
                      <div className="font-bold uppercase text-[8px] text-[#16B889]">Professional Summary</div>
                      <p className="line-clamp-2 leading-tight">{resumeData.summary || 'Experienced professional with a strong track record...'}</p>
                    </div>
                  </div>

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#192622] rounded-xl text-xs font-bold shadow-lg hover:bg-[#F4F9F7] cursor-pointer transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#16B889]" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => onOpenBuilderWithTemplate(template.id)}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-[#16B889] text-white rounded-xl text-xs font-bold shadow-lg hover:bg-[#139E75] cursor-pointer transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Edit & Download PDF</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E3ECE7] p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EAF8F3] text-[#16B889] flex items-center justify-center mx-auto">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-sm font-extrabold text-[#192622]">No templates match your filters</h3>
              <p className="text-xs text-[#7A8A85]">
                Try clearing some of your filter criteria or search terms to view available templates.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#16B889] text-white cursor-pointer shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      {/* Modals */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          resumeData={resumeData}
          onClose={() => setPreviewTemplate(null)}
          onSelectAndEdit={(templateId, design) => {
            setPreviewTemplate(null);
            onOpenBuilderWithTemplate(templateId, design);
          }}
        />
      )}

      {isHelpOpen && (
        <HelpMePickModal
          onClose={() => setIsHelpOpen(false)}
          onSelectTemplate={(templateId) => {
            setIsHelpOpen(false);
            onOpenBuilderWithTemplate(templateId);
          }}
        />
      )}

      {isImportOpen && (
        <ImportResumeModal
          onClose={() => setIsImportOpen(false)}
          onImportComplete={handleImportComplete}
        />
      )}

    </div>
  );
};
