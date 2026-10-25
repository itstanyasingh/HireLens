import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Printer, 
  RotateCcw, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Eye, 
  SlidersHorizontal,
  Code2,
  Globe,
  Upload,
  Layers,
  Zap,
  TrendingUp,
  Tag,
  Palette,
  Type,
  Layout,
  ChevronDown,
  FileCode,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { 
  ResumeData, 
  ResumeDesign, 
  TemplateId, 
  AccentColor, 
  FontFamily, 
  SpacingDensity,
  AchievementItem,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  LanguageItem
} from '../types/resumeBuilder';
import { ROLE_PRESETS } from '../data/builderPresets';
import { ResumeTemplateRenderer } from '../components/builder/ResumeTemplateRenderer';
import { TailorResumeModal } from '../components/builder/TailorResumeModal';
import { SummaryGeneratorModal } from '../components/builder/SummaryGeneratorModal';
import { BulletGeneratorModal } from '../components/builder/BulletGeneratorModal';
import { StrengthsHighlighterModal } from '../components/builder/StrengthsHighlighterModal';
import { SkillsExtractorModal } from '../components/builder/SkillsExtractorModal';
import { RoleTemplatesModal } from '../components/builder/RoleTemplatesModal';

interface ResumeBuilderPageProps {
  onBackToHome: () => void;
  onSendToChecker?: (resumeText: string, fileName: string) => void;
}

const STORAGE_KEY = 'hirelens_resume_builder_full_draft';
const DESIGN_KEY = 'hirelens_resume_builder_design';

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({
  onBackToHome,
  onSendToChecker
}) => {
  // Resume Data State
  const [resumeData, setResumeData] = useState<ResumeData>(() => ROLE_PRESETS[0].data);

  // Resume Design State
  const [resumeDesign, setResumeDesign] = useState<ResumeDesign>({
    templateId: 'executive-dark',
    accentColor: '#16B889',
    fontFamily: 'sans',
    spacing: 'comfortable'
  });

  // UI View Modes
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'tailor' | 'summary' | 'bullets' | 'strengths' | 'skills'>('builder');

  // Modals state
  const [isTailorOpen, setIsTailorOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isBulletOpen, setIsBulletOpen] = useState(false);
  const [isStrengthsOpen, setIsStrengthsOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [selectedBulletToEdit, setSelectedBulletToEdit] = useState('');

  // Skill input field
  const [newSkillText, setNewSkillText] = useState('');

  // Load draft from local storage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.personal && parsed.experience) {
          setResumeData(parsed);
        }
      }
      const savedDesign = localStorage.getItem(DESIGN_KEY);
      if (savedDesign) {
        setResumeDesign(JSON.parse(savedDesign));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Autosave draft to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      localStorage.setItem(DESIGN_KEY, JSON.stringify(resumeDesign));
    } catch (e) {
      // ignore
    }
  }, [resumeData, resumeDesign]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // -------------------------------------------------------------
  // Data Handlers
  // -------------------------------------------------------------
  const updatePersonal = (field: keyof typeof resumeData.personal, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const handleAddAchievement = () => {
    const newItem: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: 'Performance Benchmark',
      metric: '35% Efficiency Gain',
      description: 'Streamlined operational workflow delivering measurable throughput improvements.'
    };
    setResumeData(prev => ({
      ...prev,
      keyAchievements: [...prev.keyAchievements, newItem]
    }));
    showToast('Added key achievement card');
  };

  const handleUpdateAchievement = (id: string, field: keyof AchievementItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      keyAchievements: prev.keyAchievements.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const handleRemoveAchievement = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      keyAchievements: prev.keyAchievements.filter(a => a.id !== id)
    }));
  };

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Tech Innovations Inc',
      dates: '2021 – 2023',
      location: 'San Francisco, CA',
      bullets: [
        'Architected high-throughput service layer reducing median request latency by 30%.',
        'Collaborated with cross-functional design and product squads to release core customer features on schedule.'
      ]
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newItem]
    }));
    showToast('Added work experience position');
  };

  const handleUpdateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
    showToast('Removed experience position');
  };

  const handleAddBullet = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => {
        if (e.id === expId) {
          return {
            ...e,
            bullets: [...e.bullets, 'Engineered automated pipeline accelerating release cycles by 25%.']
          };
        }
        return e;
      })
    }));
  };

  const handleUpdateBullet = (expId: string, idx: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => {
        if (e.id === expId) {
          const updated = [...e.bullets];
          updated[idx] = value;
          return { ...e, bullets: updated };
        }
        return e;
      })
    }));
  };

  const handleRemoveBullet = (expId: string, idx: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => {
        if (e.id === expId) {
          return { ...e, bullets: e.bullets.filter((_, i) => i !== idx) };
        }
        return e;
      })
    }));
  };

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    const added = newSkillText.split(/[,|]/).map(s => s.trim()).filter(Boolean);
    setResumeData(prev => ({
      ...prev,
      skills: Array.from(new Set([...prev.skills, ...added]))
    }));
    setNewSkillText('');
    showToast(`Added ${added.length} skill${added.length > 1 ? 's' : ''}`);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleAddEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      institution: 'University of California',
      year: '2016 – 2020',
      location: 'Berkeley, CA',
      honors: 'Dean\'s Honor Roll'
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newItem]
    }));
    showToast('Added education entry');
  };

  const handleRemoveEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
    showToast('Removed education entry');
  };

  const handleAddLanguage = () => {
    const newItem: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: 'Spanish',
      proficiency: 'Professional Working',
      levelScore: 4
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, newItem]
    }));
    showToast('Added language entry');
  };

  const handleRemoveLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
    showToast('Removed language entry');
  };

  const handleAddProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: 'Distributed Cloud Architecture',
      role: 'Lead Architect',
      link: 'https://github.com/project',
      bullets: ['Architected microservice routing layer sustaining 50k+ req/sec with 99.99% uptime.']
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newItem]
    }));
    showToast('Added project entry');
  };

  const handleUpdateProject = (id: string, field: keyof ProjectItem, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleRemoveProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
    showToast('Removed project entry');
  };

  const handleAddProjectBullet = (projId: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projId) {
          return { ...p, bullets: [...p.bullets, 'Engineered automated CI/CD pipeline cutting deployment window by 40%.'] };
        }
        return p;
      })
    }));
  };

  const handleUpdateProjectBullet = (projId: string, idx: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projId) {
          const updated = [...p.bullets];
          updated[idx] = value;
          return { ...p, bullets: updated };
        }
        return p;
      })
    }));
  };

  const handleRemoveProjectBullet = (projId: string, idx: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projId) {
          return { ...p, bullets: p.bullets.filter((_, i) => i !== idx) };
        }
        return p;
      })
    }));
  };

  const handleAddCertification = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      year: '2023'
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newItem]
    }));
    showToast('Added certification');
  };

  const handleUpdateCertification = (id: string, field: keyof CertificationItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const handleRemoveCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
    showToast('Removed certification');
  };

  const handleStartBlank = () => {
    const blank: ResumeData = {
      personal: {
        fullName: '',
        targetTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: ''
      },
      summary: '',
      keyAchievements: [],
      experience: [
        {
          id: `exp-${Date.now()}`,
          role: '',
          company: '',
          dates: '',
          location: '',
          bullets: ['']
        }
      ],
      education: [
        {
          id: `edu-${Date.now()}`,
          degree: '',
          institution: '',
          year: '',
          location: '',
          honors: ''
        }
      ],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    };
    setResumeData(blank);
    showToast('Cleared resume data to clean blank canvas');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.resumeData) {
          setResumeData(parsed.resumeData);
          if (parsed.resumeDesign) {
            setResumeDesign(parsed.resumeDesign);
          }
          showToast('Loaded resume from JSON backup');
        } else if (parsed.personal && parsed.experience) {
          setResumeData(parsed);
          showToast('Loaded resume from JSON backup');
        } else {
          showToast('Invalid resume JSON format');
        }
      } catch (err) {
        showToast('Error reading JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // -------------------------------------------------------------
  // Compiled Plain Text for Export & ATS Checker
  // -------------------------------------------------------------
  const compiledResumeText = `
${resumeData.personal.fullName.toUpperCase()}
${resumeData.personal.targetTitle}
${resumeData.personal.email} | ${resumeData.personal.phone} | ${resumeData.personal.location} | ${resumeData.personal.linkedin}

PROFESSIONAL SUMMARY
${resumeData.summary}

KEY ACHIEVEMENTS & METRICS
${resumeData.keyAchievements.map(a => `• ${a.metric}: ${a.description}`).join('\n')}

TECHNICAL SKILLS & COMPETENCIES
${resumeData.skills.join(', ')}

PROFESSIONAL EXPERIENCE
${resumeData.experience.map(exp => `
${exp.role} - ${exp.company} (${exp.dates})
Location: ${exp.location}
${exp.bullets.map(b => `• ${b}`).join('\n')}
`).join('\n')}

EDUCATION
${resumeData.education.map(edu => `${edu.degree} - ${edu.institution} (${edu.year})`).join('\n')}

PROJECTS
${resumeData.projects?.map(p => `${p.name} (${p.role}) - ${p.bullets.join('; ')}`).join('\n')}

CERTIFICATIONS
${resumeData.certifications?.map(c => `${c.name} - ${c.issuer} (${c.year})`).join('\n')}

LANGUAGES
${resumeData.languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
  `.trim();

  const handleExportTxt = () => {
    const blob = new Blob([compiledResumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resumeData.personal.fullName || 'Resume').trim().replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded plain text resume');
  };

  const handleExportJson = () => {
    const draft = { resumeData, resumeDesign };
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resumeData.personal.fullName || 'Resume').trim().replace(/\s+/g, '_')}_Draft.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported resume JSON draft');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1E2925] pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E3ECE7] px-4 sm:px-8 py-3 shadow-2xs no-print">
        <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <div>
              <h1 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>HireLens Resume Studio</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Enhancv Layouts
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ATS-optimized templates with continuous live preview, one-click tailoring, and instant AI polish
              </p>
            </div>
          </div>

          {/* Quick Sub-Tool Segmented Navigation (Screenshot 1 & 2) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'builder' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Editor & Templates</span>
            </button>
            <button
              onClick={() => { setActiveTab('tailor'); setIsTailorOpen(true); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'tailor' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tailor Resume</span>
            </button>
            <button
              onClick={() => { setActiveTab('summary'); setIsSummaryOpen(true); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'summary' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Generate Summary</span>
            </button>
            <button
              onClick={() => { setActiveTab('bullets'); setIsBulletOpen(true); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'bullets' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Rewrite Bullets</span>
            </button>
            <button
              onClick={() => { setActiveTab('strengths'); setIsStrengthsOpen(true); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'strengths' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Highlight Strengths</span>
            </button>
            <button
              onClick={() => { setActiveTab('skills'); setIsSkillsOpen(true); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'skills' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-rose-600" />
              <span>Extract Skills</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            <button
              onClick={() => setIsPresetsOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Load Template</span>
            </button>

            <label className="flex items-center gap-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all" title="Upload a previously saved JSON draft">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Import JSON</span>
              <input type="file" accept=".json,application/json" onChange={handleImportJson} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (window.confirm('Clear all resume data to start with a clean blank canvas?')) {
                  handleStartBlank();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
              title="Start from a clean blank slate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Blank</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleExportTxt}
              className="flex items-center gap-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export TXT</span>
            </button>

            {onSendToChecker && (
              <button
                onClick={() => onSendToChecker(compiledResumeText, `${(resumeData.personal.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`)}
                className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg cursor-pointer transition-all shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Check Score</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* TEMPLATE STYLING CONTROLS BAR (Screenshot 9) */}
      <div className="bg-white border-b border-[#E3ECE7] px-4 sm:px-8 py-2.5 no-print shadow-2xs">
        <div className="max-w-[1560px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Template Layout Picker */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Template:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => setResumeDesign(d => ({ ...d, templateId: 'executive-dark' }))}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  resumeDesign.templateId === 'executive-dark' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Executive Dark
              </button>
              <button
                onClick={() => setResumeDesign(d => ({ ...d, templateId: 'enhancv-two-column' }))}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  resumeDesign.templateId === 'enhancv-two-column' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Two-Column
              </button>
              <button
                onClick={() => setResumeDesign(d => ({ ...d, templateId: 'modern-clean' }))}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  resumeDesign.templateId === 'modern-clean' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Modern Clean
              </button>
              <button
                onClick={() => setResumeDesign(d => ({ ...d, templateId: 'classic-ats' }))}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  resumeDesign.templateId === 'classic-ats' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Classic ATS
              </button>
            </div>
          </div>

          {/* Accent Color Picker */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              <span>Accent:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { label: 'Mint', color: '#16B889' as AccentColor },
                { label: 'Navy', color: '#1E3A8A' as AccentColor },
                { label: 'Indigo', color: '#4F46E5' as AccentColor },
                { label: 'Crimson', color: '#991B1B' as AccentColor },
                { label: 'Slate', color: '#334155' as AccentColor }
              ].map(c => (
                <button
                  key={c.color}
                  onClick={() => setResumeDesign(d => ({ ...d, accentColor: c.color }))}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer border-2 ${
                    resumeDesign.accentColor === c.color ? 'scale-125 border-slate-900' : 'border-white hover:scale-110 shadow-2xs'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Typography Font Picker */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              <span>Font:</span>
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => setResumeDesign(d => ({ ...d, fontFamily: 'sans' }))}
                className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${
                  resumeDesign.fontFamily === 'sans' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Sans
              </button>
              <button
                onClick={() => setResumeDesign(d => ({ ...d, fontFamily: 'serif' }))}
                className={`px-2 py-0.5 rounded text-xs font-serif cursor-pointer ${
                  resumeDesign.fontFamily === 'serif' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => setResumeDesign(d => ({ ...d, fontFamily: 'mono' }))}
                className={`px-2 py-0.5 rounded text-xs font-mono cursor-pointer ${
                  resumeDesign.fontFamily === 'mono' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Mono
              </button>
            </div>
          </div>

          {/* View Mode Splitter */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                viewMode === 'split' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('edit')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                viewMode === 'edit' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Editor Only
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                viewMode === 'preview' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Preview Only
            </button>
          </div>

        </div>
      </div>

      {/* MAIN BUILDER WORKSPACE */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: INTERACTIVE LIVE EDITOR */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-5 no-print`}>
              
              {/* Demo Template Indicator Banner */}
              {resumeData.personal.fullName === 'Alex Morgan' && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong className="font-extrabold">Sample Demo Content Active:</strong> Alex Morgan template is loaded. Customize below or click to start fresh.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all resume data to start from a clean blank canvas?')) {
                        handleStartBlank();
                      }
                    }}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200/80 border border-amber-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0"
                  >
                    Start Blank Canvas
                  </button>
                </div>
              )}
              
              {/* 1. CONTACT & HEADER */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      1. Contact & Header
                    </h2>
                  </div>
                  <span className="text-[11px] text-slate-400">Essential Contact Info</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personal.fullName}
                      onChange={e => updatePersonal('fullName', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Professional Title</label>
                    <input
                      type="text"
                      value={resumeData.personal.targetTitle}
                      onChange={e => updatePersonal('targetTitle', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Email</label>
                    <input
                      type="email"
                      value={resumeData.personal.email}
                      onChange={e => updatePersonal('email', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={resumeData.personal.phone}
                      onChange={e => updatePersonal('phone', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Location (City, State / Country)</label>
                    <input
                      type="text"
                      value={resumeData.personal.location}
                      onChange={e => updatePersonal('location', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={resumeData.personal.linkedin}
                      onChange={e => updatePersonal('linkedin', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">GitHub / Code Portfolio</label>
                    <input
                      type="text"
                      value={resumeData.personal.github}
                      onChange={e => updatePersonal('github', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Personal Website</label>
                    <input
                      type="text"
                      value={resumeData.personal.website}
                      onChange={e => updatePersonal('website', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. PROFESSIONAL SUMMARY */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      2. Professional Summary
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsSummaryOpen(true)}
                      className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Summary with AI</span>
                    </button>
                    <span className="text-[10.5px] text-slate-400">
                      {resumeData.summary.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={resumeData.summary}
                  onChange={e => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full text-xs leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:bg-white focus:border-purple-500 outline-none resize-y"
                  placeholder="2-3 impactful sentences highlighting your primary qualifications, core technical stack, and verifiable business achievements."
                />
              </div>

              {/* 3. KEY ACHIEVEMENTS & METRICS (Enhancv Highlight) */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      3. Key Achievements & Metrics
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsStrengthsOpen(true)}
                      className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Highlight Strengths</span>
                    </button>
                    <button
                      onClick={handleAddAchievement}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Achievement</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {resumeData.keyAchievements.map((ach, idx) => (
                    <div key={ach.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-700">Achievement #{idx + 1}</span>
                        <button
                          onClick={() => handleRemoveAchievement(ach.id)}
                          className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={ach.metric}
                          onChange={e => handleUpdateAchievement(ach.id, 'metric', e.target.value)}
                          placeholder="Metric (e.g. 35% Latency Drop)"
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
                        />
                        <input
                          type="text"
                          value={ach.title}
                          onChange={e => handleUpdateAchievement(ach.id, 'title', e.target.value)}
                          placeholder="Category / Title"
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={ach.description}
                        onChange={e => handleUpdateAchievement(ach.id, 'description', e.target.value)}
                        placeholder="1-line context of what you did and how it was achieved..."
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-amber-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. SKILLS & COMPETENCIES */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-rose-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      4. Skills & Technologies
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsSkillsOpen(true)}
                    className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Extract from Job Posting</span>
                  </button>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                  {resumeData.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick Add Skill Input */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={newSkillText}
                    onChange={e => setNewSkillText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Type skill name and press Enter (or comma-separated)..."
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 outline-none focus:bg-white focus:border-rose-500"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* 5. WORK HISTORY & BULLETS */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      5. Work Experience & Impact Bullets
                    </h2>
                  </div>
                  <button
                    onClick={handleAddExperience}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Position</span>
                  </button>
                </div>

                <div className="space-y-5">
                  {resumeData.experience.map((exp, expIdx) => (
                    <div key={exp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-700">Position #{expIdx + 1}</span>
                        {resumeData.experience.length > 1 && (
                          <button
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Position</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Role / Job Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={e => handleUpdateExperience(exp.id, 'role', e.target.value)}
                            placeholder="Job Title"
                            className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={e => handleUpdateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Company Name"
                            className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Dates</label>
                          <input
                            type="text"
                            value={exp.dates}
                            onChange={e => handleUpdateExperience(exp.id, 'dates', e.target.value)}
                            placeholder="e.g. 2021 – Present"
                            className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={e => handleUpdateExperience(exp.id, 'location', e.target.value)}
                            placeholder="e.g. San Francisco, CA"
                            className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Bullets */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <label className="text-[10.5px] font-bold text-slate-600">
                            Achievement Bullets (Action Verb + Scope + Metric):
                          </label>
                          <button
                            onClick={() => handleAddBullet(exp.id)}
                            className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                          >
                            + Add Bullet
                          </button>
                        </div>

                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                            <div className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold mt-1">•</span>
                              <textarea
                                rows={2}
                                value={bullet}
                                onChange={e => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                                className="flex-1 text-xs bg-transparent border-none text-slate-900 focus:outline-none resize-y"
                              />
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                              <button
                                onClick={() => {
                                  setSelectedBulletToEdit(bullet);
                                  setIsBulletOpen(true);
                                }}
                                className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Zap className="w-3 h-3 text-blue-600" />
                                <span>Rewrite Bullet with AI</span>
                              </button>
                              {exp.bullets.length > 1 && (
                                <button
                                  onClick={() => handleRemoveBullet(exp.id, bIdx)}
                                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                  Remove Bullet
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* 6. EDUCATION */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      6. Education
                    </h2>
                  </div>
                  <button
                    onClick={handleAddEducation}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                {resumeData.education.map(edu => (
                  <div key={edu.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Education Entry</span>
                      <button
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 cursor-pointer"
                        title="Remove degree"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => setResumeData(prev => ({
                          ...prev,
                          education: prev.education.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed)
                        }))}
                        placeholder="Degree (e.g. B.S. in Computer Science)"
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={e => setResumeData(prev => ({
                          ...prev,
                          education: prev.education.map(ed => ed.id === edu.id ? { ...ed, institution: e.target.value } : ed)
                        }))}
                        placeholder="Institution / University"
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                      />
                      <input
                        type="text"
                        value={edu.year}
                        onChange={e => setResumeData(prev => ({
                          ...prev,
                          education: prev.education.map(ed => ed.id === edu.id ? { ...ed, year: e.target.value } : ed)
                        }))}
                        placeholder="Graduation Year"
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                      />
                      <input
                        type="text"
                        value={edu.location}
                        onChange={e => setResumeData(prev => ({
                          ...prev,
                          education: prev.education.map(ed => ed.id === edu.id ? { ...ed, location: e.target.value } : ed)
                        }))}
                        placeholder="Location"
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 7. LANGUAGES */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      7. Languages
                    </h2>
                  </div>
                  <button
                    onClick={handleAddLanguage}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Language</span>
                  </button>
                </div>

                {resumeData.languages.map(lang => (
                  <div key={lang.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={lang.language}
                      onChange={e => setResumeData(prev => ({
                        ...prev,
                        languages: prev.languages.map(l => l.id === lang.id ? { ...l, language: e.target.value } : l)
                      }))}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 flex-1"
                      placeholder="Language"
                    />
                    <input
                      type="text"
                      value={lang.proficiency}
                      onChange={e => setResumeData(prev => ({
                        ...prev,
                        languages: prev.languages.map(l => l.id === lang.id ? { ...l, proficiency: e.target.value } : l)
                      }))}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 w-36"
                      placeholder="e.g. Native / Fluent"
                    />
                    <select
                      value={lang.levelScore || 5}
                      onChange={e => setResumeData(prev => ({
                        ...prev,
                        languages: prev.languages.map(l => l.id === lang.id ? { ...l, levelScore: Number(e.target.value) } : l)
                      }))}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1"
                    >
                      <option value={5}>5/5 Dots</option>
                      <option value={4}>4/5 Dots</option>
                      <option value={3}>3/5 Dots</option>
                      <option value={2}>2/5 Dots</option>
                    </select>
                    <button
                      onClick={() => handleRemoveLanguage(lang.id)}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                      title="Remove language"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 8. FEATURED PROJECTS */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      8. Featured Projects
                    </h2>
                  </div>
                  <button
                    onClick={handleAddProject}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(!resumeData.projects || resumeData.projects.length === 0) && (
                    <div className="text-xs text-slate-400 italic text-center py-2">
                      No projects added yet. Click &quot;Add Project&quot; to showcase your work.
                    </div>
                  )}
                  {resumeData.projects?.map((proj, pIdx) => (
                    <div key={proj.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-700">Project #{pIdx + 1}</span>
                        <button
                          onClick={() => handleRemoveProject(proj.id)}
                          className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Project</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={proj.name}
                          onChange={e => handleUpdateProject(proj.id, 'name', e.target.value)}
                          placeholder="Project Name"
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                        />
                        <input
                          type="text"
                          value={proj.role || ''}
                          onChange={e => handleUpdateProject(proj.id, 'role', e.target.value)}
                          placeholder="Role (e.g. Lead Author)"
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                        />
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={e => handleUpdateProject(proj.id, 'link', e.target.value)}
                          placeholder="Link (e.g. github.com/...)"
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                        />
                      </div>

                      {/* Project Bullets */}
                      <div className="space-y-2 pt-1 border-t border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-500">Impact Bullets:</label>
                          <button
                            onClick={() => handleAddProjectBullet(proj.id)}
                            className="text-[10.5px] font-bold text-emerald-700 hover:underline cursor-pointer"
                          >
                            + Add Bullet
                          </button>
                        </div>
                        {proj.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-emerald-600 font-bold">•</span>
                            <input
                              type="text"
                              value={b}
                              onChange={e => handleUpdateProjectBullet(proj.id, bIdx, e.target.value)}
                              className="flex-1 text-xs bg-transparent border-none text-slate-900 focus:outline-none"
                            />
                            {proj.bullets.length > 1 && (
                              <button
                                onClick={() => handleRemoveProjectBullet(proj.id, bIdx)}
                                className="text-slate-400 hover:text-red-500 text-xs cursor-pointer px-1"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. CERTIFICATIONS */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      9. Certifications & Credentials
                    </h2>
                  </div>
                  <button
                    onClick={handleAddCertification}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certification</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(!resumeData.certifications || resumeData.certifications.length === 0) && (
                    <div className="text-xs text-slate-400 italic text-center py-2">
                      No certifications added yet. Click &quot;Add Certification&quot; to add relevant credentials.
                    </div>
                  )}
                  {resumeData.certifications?.map(cert => (
                    <div key={cert.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={e => handleUpdateCertification(cert.id, 'name', e.target.value)}
                        placeholder="Certification Name"
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 flex-1 w-full font-semibold"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={e => handleUpdateCertification(cert.id, 'issuer', e.target.value)}
                        placeholder="Issuing Organization"
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 w-full sm:w-44"
                      />
                      <input
                        type="text"
                        value={cert.year}
                        onChange={e => handleUpdateCertification(cert.id, 'year', e.target.value)}
                        placeholder="Year"
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 w-full sm:w-24 font-mono"
                      />
                      <button
                        onClick={() => handleRemoveCertification(cert.id)}
                        className="text-slate-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                        title="Remove certification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* RIGHT: REAL-TIME ENHANCV RESUME PREVIEW */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} sticky top-28 self-start`}>
              
              {/* Preview Header Banner (Screenshot 1 & 8) */}
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-sm mb-3 flex items-center justify-between no-print">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                    86%
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Enhancv Live Paper Canvas
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Standard ATS-Compliant Printable Layout · Vector typography
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJson}
                    className="text-[10.5px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    Save JSON
                  </button>
                  <button
                    onClick={handlePrint}
                    className="text-[10.5px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>

              {/* The Rendered Paper Resume */}
              <ResumeTemplateRenderer
                data={resumeData}
                design={resumeDesign}
                onSelectBulletToImprove={(b) => {
                  setSelectedBulletToEdit(b);
                  setIsBulletOpen(true);
                }}
              />

            </div>
          )}

        </div>
      </div>

      {/* SUB-TOOL MODALS */}
      <TailorResumeModal
        currentResume={resumeData}
        isOpen={isTailorOpen}
        onClose={() => setIsTailorOpen(false)}
        onApplyChanges={({ appliedBullets, addedKeywords }) => {
          if (appliedBullets && appliedBullets.length > 0) {
            setResumeData(prev => {
              const updatedExp = prev.experience.map(e => ({
                ...e,
                bullets: e.bullets.map(b => {
                  const match = appliedBullets.find(ab => ab.original === b);
                  return match ? match.tailored : b;
                })
              }));
              return { ...prev, experience: updatedExp };
            });
            showToast('Applied tailored bullets to experience');
          }
          if (addedKeywords && addedKeywords.length > 0) {
            setResumeData(prev => ({
              ...prev,
              skills: Array.from(new Set([...prev.skills, ...addedKeywords]))
            }));
            showToast(`Added ${addedKeywords.length} keywords to skills`);
          }
        }}
      />

      <SummaryGeneratorModal
        currentSummary={resumeData.summary}
        targetRole={resumeData.personal.targetTitle}
        keySkills={resumeData.skills.join(', ')}
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        onApplySummary={(newSummary) => {
          setResumeData(prev => ({ ...prev, summary: newSummary }));
          showToast('Updated resume summary');
        }}
      />

      <BulletGeneratorModal
        initialBullet={selectedBulletToEdit}
        targetRole={resumeData.personal.targetTitle}
        isOpen={isBulletOpen}
        onClose={() => setIsBulletOpen(false)}
        onInsertBullet={(newBullet) => {
          setResumeData(prev => {
            const expList = [...prev.experience];
            if (expList.length > 0) {
              const first = { ...expList[0] };
              first.bullets = [newBullet, ...first.bullets];
              expList[0] = first;
            }
            return { ...prev, experience: expList };
          });
          showToast('Inserted bullet into top experience entry');
        }}
      />

      <StrengthsHighlighterModal
        currentAchievements={resumeData.keyAchievements}
        targetRole={resumeData.personal.targetTitle}
        isOpen={isStrengthsOpen}
        onClose={() => setIsStrengthsOpen(false)}
        onAddAchievement={(ach) => {
          setResumeData(prev => ({
            ...prev,
            keyAchievements: [...prev.keyAchievements, ach]
          }));
          showToast('Added achievement to resume');
        }}
      />

      <SkillsExtractorModal
        currentSkills={resumeData.skills}
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
        onAddSkills={(skillsToAdd) => {
          setResumeData(prev => ({
            ...prev,
            skills: Array.from(new Set([...prev.skills, ...skillsToAdd]))
          }));
          showToast(`Added ${skillsToAdd.length} skill${skillsToAdd.length > 1 ? 's' : ''}`);
        }}
      />

      <RoleTemplatesModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={({ data, templateId, accentColor }) => {
          setResumeData(data);
          setResumeDesign(d => ({ ...d, templateId, accentColor }));
          showToast(`Loaded ${data.personal.targetTitle} template`);
        }}
      />

    </div>
  );
};
