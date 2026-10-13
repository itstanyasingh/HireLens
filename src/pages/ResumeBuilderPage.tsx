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
  SlidersHorizontal 
} from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/mockResumes';

interface ResumeBuilderPageProps {
  onBackToHome: () => void;
  onSendToChecker?: (resumeText: string, fileName: string) => void;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  dates: string;
  location: string;
  bullets: string[];
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  location: string;
}

const STORAGE_KEY = 'hirelens_resume_builder_draft';

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({
  onBackToHome,
  onSendToChecker
}) => {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [targetTitle, setTargetTitle] = useState('Senior Full Stack Engineer');
  const [email, setEmail] = useState('alex.morgan@email.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [location, setLocation] = useState('San Francisco, CA');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/alexmorgan-dev');
  const [github, setGithub] = useState('github.com/alexmorgan');
  const [summary, setSummary] = useState(
    'Performance-driven Full Stack Engineer with 5+ years of experience architecting high-scale React, TypeScript, and Node.js applications. Proven record of reducing API latency by 35% and accelerating release velocity across cross-functional product squads.'
  );

  const [skills, setSkills] = useState('React, TypeScript, Next.js, Node.js, Express, Python, PostgreSQL, Redis, Docker, AWS (S3/EC2), REST APIs, GraphQL, Tailwind CSS, Jest, CI/CD');

  const [experience, setExperience] = useState<ExperienceItem[]>([
    {
      id: 'exp-1',
      role: 'Senior Software Engineer',
      company: 'TechFlow Systems',
      dates: '2022 – Present',
      location: 'San Francisco, CA',
      bullets: [
        'Built a responsive React application with reusable components, boosting customer engagement by 32%.',
        'Architected high-throughput RESTful microservices in Node.js/TypeScript serving 45,000+ daily active users with 99.98% uptime.',
        'Engineered Redis caching layer for heavy SQL query endpoints, cutting median response time from 320ms to 45ms.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Full Stack Engineer',
      company: 'Nexus Digital',
      dates: '2020 – 2022',
      location: 'Austin, TX',
      bullets: [
        'Spearheaded frontend migration to Next.js and Tailwind CSS, increasing Lighthouse performance score from 68 to 96.',
        'Integrated Stripe payment workflows and webhook reconciliation pipeline processing $1.2M in annual transactions.'
      ]
    }
  ]);

  const [education, setEducation] = useState<EducationItem[]>([
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      year: '2016 – 2020',
      location: 'Berkeley, CA'
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  // Load from session storage if exists
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.targetTitle) setTargetTitle(parsed.targetTitle);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.summary) setSummary(parsed.summary);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.education) setEducation(parsed.education);
      } else {
        const demoApplied = sessionStorage.getItem('hirelens_demo_suggestion_applied');
        if (demoApplied === 'false') {
          setExperience(prev => {
            const updated = [...prev];
            if (updated.length > 0 && updated[0].bullets.length > 0) {
              const bullets = [...updated[0].bullets];
              bullets[0] = 'Developed web applications using React and TypeScript.';
              updated[0] = { ...updated[0], bullets };
            }
            return updated;
          });
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Autosave to session storage
  useEffect(() => {
    try {
      const draft = { fullName, targetTitle, email, phone, location, linkedin, github, summary, skills, experience, education };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      // ignore
    }
  }, [fullName, targetTitle, email, phone, location, linkedin, github, summary, skills, experience, education]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Company Name',
      dates: '2021 – 2023',
      location: 'City, State',
      bullets: ['Architected scalable core feature delivering 25% efficiency gains.']
    };
    setExperience([...experience, newItem]);
    showToast('Added experience position');
  };

  const handleRemoveExperience = (id: string) => {
    setExperience(experience.filter(e => e.id !== id));
    showToast('Removed position');
  };

  const handleAddBullet = (expId: string) => {
    setExperience(experience.map(e => {
      if (e.id === expId) {
        return {
          ...e,
          bullets: [...e.bullets, 'Engineered automated workflow reducing latency by 20%.']
        };
      }
      return e;
    }));
  };

  const handleUpdateBullet = (expId: string, idx: number, val: string) => {
    setExperience(experience.map(e => {
      if (e.id === expId) {
        const updated = [...e.bullets];
        updated[idx] = val;
        return { ...e, bullets: updated };
      }
      return e;
    }));
  };

  const handleRemoveBullet = (expId: string, idx: number) => {
    setExperience(experience.map(e => {
      if (e.id === expId) {
        const updated = e.bullets.filter((_, i) => i !== idx);
        return { ...e, bullets: updated };
      }
      return e;
    }));
  };

  const handleApplyPreset = (presetIndex: number) => {
    const s = SAMPLE_RESUMES[presetIndex];
    if (!s) return;
    setFullName(s.title.includes('Frontend') ? 'Sarah Chen' : 'Alex Morgan');
    setTargetTitle(s.title);
    setSummary('Results-oriented engineering lead with proven record in distributed systems, modern frontends, and quantifiable user scale.');
    showToast(`Loaded ${s.title} template`);
  };

  const compiledResumeText = `
${fullName.toUpperCase()}
${targetTitle} | ${email} | ${phone} | ${location} | ${linkedin}

PROFESSIONAL SUMMARY
${summary}

TECHNICAL SKILLS
${skills}

EXPERIENCE
${experience.map(exp => `
${exp.role} - ${exp.company} (${exp.dates})
Location: ${exp.location}
${exp.bullets.map(b => `• ${b}`).join('\n')}
`).join('\n')}

EDUCATION
${education.map(edu => `${edu.degree} - ${edu.institution} (${edu.year})`).join('\n')}
  `.trim();

  const handleExportTxt = () => {
    const blob = new Blob([compiledResumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded plain text resume');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#273330] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#12221E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-[#16B889]/40 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-[#16B889]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E3ECE7] px-6 py-3.5 shadow-2xs no-print">
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
                <SlidersHorizontal className="w-4 h-4 text-[#16B889]" />
                HireLens Resume Builder
              </h1>
              <p className="text-[11px] text-[#7A8A85]">ATS-optimized layout with real-time preview & auto-draft</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle for Mobile/Desktop */}
            <div className="hidden sm:flex bg-[#EDF3F0] p-1 rounded-lg text-xs font-bold text-[#55625F]">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-md transition-all ${viewMode === 'split' ? 'bg-white text-[#16B889] shadow-2xs' : 'hover:text-[#273330]'}`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewMode('edit')}
                className={`px-2.5 py-1 rounded-md transition-all ${viewMode === 'edit' ? 'bg-white text-[#16B889] shadow-2xs' : 'hover:text-[#273330]'}`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded-md transition-all ${viewMode === 'preview' ? 'bg-white text-[#16B889] shadow-2xs' : 'hover:text-[#273330]'}`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-bold bg-[#EAF8F3] text-[#129A72] border border-[#BDEBDC] hover:bg-[#D5F2E7] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleExportTxt}
              className="flex items-center gap-1.5 text-xs font-bold bg-white text-[#44524E] border border-[#D5E1DC] hover:bg-[#F2F6F4] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export TXT</span>
            </button>

            {onSendToChecker && (
              <button
                onClick={() => onSendToChecker(compiledResumeText, `${fullName.replace(/\s+/g, '_')}_Resume.pdf`)}
                className="flex items-center gap-1.5 text-xs font-bold bg-[#16B889] text-white hover:bg-[#139E75] px-3.5 py-1.5 rounded-lg cursor-pointer transition-all shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Check Score</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Builder Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: FORM CONTROLS */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-6 no-print`}>
              
              {/* Presets Bar */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-4 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-[#273330]">Quick Starter Presets:</span>
                  <p className="text-[11px] text-[#7A8A85]">Load verified industry sample to customize</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApplyPreset(0)}
                    className="text-[11px] font-bold text-[#16B889] bg-[#EAF8F3] hover:bg-[#D4F4E7] px-2.5 py-1 rounded-md transition-all cursor-pointer"
                  >
                    Senior Full Stack
                  </button>
                  <button
                    onClick={() => handleApplyPreset(1)}
                    className="text-[11px] font-bold text-[#55625F] bg-[#F0F5F2] hover:bg-[#E4ECE8] px-2.5 py-1 rounded-md transition-all cursor-pointer"
                  >
                    Product Manager
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-[#F0F4F2] pb-3">
                  <FileText className="w-4 h-4 text-[#16B889]" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#273330]">1. Contact & Header</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#55625F] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#55625F] block mb-1">Target Professional Title</label>
                    <input
                      type="text"
                      value={targetTitle}
                      onChange={e => setTargetTitle(e.target.value)}
                      className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#55625F] block mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#55625F] block mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#55625F] block mb-1">Location (City, State)</label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#55625F] block mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={e => setLinkedin(e.target.value)}
                      className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#16B889]" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#273330]">2. Professional Summary</h2>
                  </div>
                  <span className="text-[10.5px] text-[#7A8A85]">{summary.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full text-xs leading-relaxed bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg p-3 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none resize-y"
                  placeholder="2-3 sentences highlighting target role, years of experience, core technical stack, and measurable impact."
                />
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#16B889]" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#273330]">3. Skills & Technologies</h2>
                  </div>
                  <span className="text-[10.5px] text-[#16B889] font-bold">Comma separated</span>
                </div>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg p-3 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none"
                  placeholder="e.g. React, TypeScript, Node.js, Python, PostgreSQL, AWS"
                />
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#16B889]" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#273330]">4. Work History & Impact Bullets</h2>
                  </div>
                  <button
                    onClick={handleAddExperience}
                    className="text-xs font-bold text-[#16B889] hover:text-[#129A72] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Position</span>
                  </button>
                </div>

                <div className="space-y-5">
                  {experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 bg-[#F9FBFA] rounded-xl border border-[#E3ECE7] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#16B889]">Position #{idx + 1}</span>
                        {experience.length > 1 && (
                          <button
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={e => {
                            const updated = experience.map(item => item.id === exp.id ? { ...item, role: e.target.value } : item);
                            setExperience(updated);
                          }}
                          placeholder="Job Title"
                          className="text-xs bg-white border border-[#D9E3DF] rounded-lg px-2.5 py-1.5"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={e => {
                            const updated = experience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item);
                            setExperience(updated);
                          }}
                          placeholder="Company"
                          className="text-xs bg-white border border-[#D9E3DF] rounded-lg px-2.5 py-1.5"
                        />
                        <input
                          type="text"
                          value={exp.dates}
                          onChange={e => {
                            const updated = experience.map(item => item.id === exp.id ? { ...item, dates: e.target.value } : item);
                            setExperience(updated);
                          }}
                          placeholder="Dates (e.g. 2021 – Present)"
                          className="text-xs bg-white border border-[#D9E3DF] rounded-lg px-2.5 py-1.5"
                        />
                        <input
                          type="text"
                          value={exp.location}
                          onChange={e => {
                            const updated = experience.map(item => item.id === exp.id ? { ...item, location: e.target.value } : item);
                            setExperience(updated);
                          }}
                          placeholder="Location"
                          className="text-xs bg-white border border-[#D9E3DF] rounded-lg px-2.5 py-1.5"
                        />
                      </div>

                      {/* Bullet points */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-[#55625F]">Achievement Bullets (Action Verb + Scope + Metric):</label>
                          <button
                            onClick={() => handleAddBullet(exp.id)}
                            className="text-[11px] font-bold text-[#16B889] hover:underline cursor-pointer"
                          >
                            + Add Bullet
                          </button>
                        </div>
                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <span className="text-[#16B889] font-bold mt-1.5">•</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={e => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                              className="flex-1 text-xs bg-white border border-[#D9E3DF] rounded-lg p-2 text-[#273330] focus:border-[#16B889] outline-none"
                            />
                            {exp.bullets.length > 1 && (
                              <button
                                onClick={() => handleRemoveBullet(exp.id, bIdx)}
                                className="text-[#9EAEA8] hover:text-red-500 p-1 cursor-pointer mt-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#16B889]" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#273330]">5. Education</h2>
                  </div>
                </div>
                {education.map(edu => (
                  <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#F9FBFA] rounded-xl border border-[#E3ECE7]">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed))}
                      placeholder="Degree"
                      className="text-xs bg-white border border-[#D9E3DF] rounded-lg px-2.5 py-1.5"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, institution: e.target.value } : ed))}
                      placeholder="Institution"
                      className="text-xs bg-white border border-[#D9E3DF] rounded-lg px-2.5 py-1.5"
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, year: e.target.value } : ed))}
                      placeholder="Graduation Year"
                      className="text-xs bg-white border border-[#D9E3DF] rounded-lg px-2.5 py-1.5"
                    />
                    <input
                      type="text"
                      value={edu.location}
                      onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, location: e.target.value } : ed))}
                      placeholder="Location"
                      className="text-xs bg-white border border-[#D9E3DF] rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* RIGHT: REAL-TIME ATS RESUME DOCUMENT PREVIEW */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} sticky top-20 self-start`}>
              
              <div className="bg-[#E9F0EC] p-3 rounded-2xl border border-[#D6E2DC] shadow-sm mb-3 flex items-center justify-between no-print">
                <div className="flex items-center gap-2 text-xs font-bold text-[#35433F]">
                  <Eye className="w-4 h-4 text-[#16B889]" />
                  <span>Real-Time ATS Document Preview</span>
                </div>
                <span className="text-[11px] bg-white text-[#129A72] font-mono px-2 py-0.5 rounded-full border border-[#C5DDD2]">
                  Standard 1-Page Layout
                </span>
              </div>

              {/* Paper Canvas */}
              <div 
                id="printable-resume"
                className="bg-white text-[#1C2523] rounded-xl shadow-xl p-8 sm:p-10 border border-[#DEE7E2] min-h-[850px] font-sans text-xs leading-normal select-text space-y-4 print:p-0 print:border-none print:shadow-none"
              >
                
                {/* Document Header */}
                <div className="text-center border-b border-[#CCD7D1] pb-3 space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#111A18] uppercase">
                    {fullName || 'YOUR NAME'}
                  </h1>
                  <p className="text-[12px] font-bold text-[#16B889] font-mono">
                    {targetTitle || 'Target Professional Role'}
                  </p>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-[10.5px] text-[#55625F] pt-0.5">
                    {email && <span>{email}</span>}
                    {phone && <span>• {phone}</span>}
                    {location && <span>• {location}</span>}
                    {linkedin && <span>• {linkedin}</span>}
                  </div>
                </div>

                {/* Professional Summary */}
                {summary && (
                  <div className="space-y-1">
                    <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#16B889] border-b border-[#E3ECE7] pb-0.5">
                      Professional Summary
                    </h2>
                    <p className="text-[11px] text-[#33403C] leading-relaxed pt-0.5">
                      {summary}
                    </p>
                  </div>
                )}

                {/* Technical Skills */}
                {skills && (
                  <div className="space-y-1">
                    <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#16B889] border-b border-[#E3ECE7] pb-0.5">
                      Technical Skills
                    </h2>
                    <p className="text-[11px] text-[#33403C] leading-relaxed pt-0.5">
                      {skills}
                    </p>
                  </div>
                )}

                {/* Work Experience */}
                <div className="space-y-3">
                  <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#16B889] border-b border-[#E3ECE7] pb-0.5">
                    Professional Experience
                  </h2>
                  {experience.map(exp => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex items-baseline justify-between font-bold text-[11.5px]">
                        <span className="text-[#192320]">{exp.role} — <span className="font-semibold text-[#55625F]">{exp.company}</span></span>
                        <span className="text-[10px] text-[#7A8A85] font-mono">{exp.dates}</span>
                      </div>
                      <div className="text-[10px] text-[#7A8A85] italic">{exp.location}</div>
                      <ul className="list-disc list-inside space-y-1 pt-0.5">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="text-[11px] text-[#33403C] leading-relaxed pl-1">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#16B889] border-b border-[#E3ECE7] pb-0.5">
                    Education
                  </h2>
                  {education.map(edu => (
                    <div key={edu.id} className="flex items-baseline justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-[#192320]">{edu.degree}</span>
                        <span className="text-[#55625F]">, {edu.institution}</span>
                      </div>
                      <span className="text-[10px] text-[#7A8A85] font-mono">{edu.year}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
