import React from 'react';
import { 
  ResumeData, 
  ResumeDesign 
} from '../../types/resumeBuilder';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Award, 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Languages as LangIcon,
  CheckCircle2
} from 'lucide-react';

interface ResumeTemplateRendererProps {
  data: ResumeData;
  design: ResumeDesign;
  onSelectBulletToImprove?: (bullet: string) => void;
}

export const ResumeTemplateRenderer: React.FC<ResumeTemplateRendererProps> = ({
  data,
  design,
  onSelectBulletToImprove
}) => {
  const { personal, summary, keyAchievements, experience, education, skills, projects, certifications, languages } = data;
  const accent = design.accentColor || '#16B889';

  const fontClass = 
    design.fontFamily === 'serif' ? 'font-serif' :
    design.fontFamily === 'mono' ? 'font-mono' : 'font-sans';

  const densityClass = design.spacing === 'compact' ? 'space-y-3.5 text-[11px]' : 'space-y-5 text-[11.5px]';
  const itemPadding = design.spacing === 'compact' ? 'py-1' : 'py-1.5';

  // -------------------------------------------------------------
  // TEMPLATE 1: EXECUTIVE DARK SIDEBAR (Violet Rodriguez style)
  // -------------------------------------------------------------
  if (design.templateId === 'executive-dark') {
    return (
      <div 
        id="printable-resume"
        className={`bg-white text-[#1C2523] rounded-xl shadow-xl overflow-hidden border border-[#DCE5E0] min-h-[960px] ${fontClass} leading-relaxed select-text print:shadow-none print:border-none print:m-0 print:p-0 print:min-h-0`}
      >
        <div className="grid grid-cols-12 min-h-[960px] print:min-h-0">
          
          {/* DARK LEFT SIDEBAR (4 cols) */}
          <div className="col-span-12 sm:col-span-4 bg-[#1E293B] text-white p-6 sm:p-7 space-y-6 flex flex-col justify-between print:bg-[#1E293B] print:text-white">
            <div className="space-y-6">
              
              {/* Profile Avatar & Name in Sidebar */}
              <div className="text-center sm:text-left space-y-2 border-b border-slate-700/60 pb-5">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto sm:mx-0 shadow-md transition-transform"
                  style={{ backgroundColor: accent, color: '#FFFFFF' }}
                >
                  {personal.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'HL'}
                </div>
                <h1 className="text-lg font-black tracking-tight uppercase pt-1 text-white">
                  {personal.fullName || 'YOUR NAME'}
                </h1>
                <p className="text-xs font-semibold text-slate-300">
                  {personal.targetTitle || 'Professional Role'}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-2.5 text-[11px] text-slate-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-700/40">
                  Contact
                </span>
                {personal.email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{personal.email}</span>
                  </div>
                )}
                {personal.phone && (
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{personal.phone}</span>
                  </div>
                )}
                {personal.location && (
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.linkedin && (
                  <div className="flex items-center gap-2 truncate">
                    <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                )}
                {personal.github && (
                  <div className="flex items-center gap-2 truncate">
                    <Github className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                )}
                {personal.website && (
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{personal.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                )}
              </div>

              {/* Key Achievements Metric Cards */}
              {keyAchievements && keyAchievements.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-700/40 flex items-center justify-between">
                    <span>Key Achievements</span>
                    <TrendingUp className="w-3 h-3 text-slate-400" />
                  </span>
                  <div className="space-y-2 pt-1">
                    {keyAchievements.map(ach => (
                      <div 
                        key={ach.id} 
                        className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/70 space-y-1"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: accent }}>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{ach.metric || ach.title}</span>
                        </div>
                        {ach.description && (
                          <p className="text-[10px] text-slate-300 leading-snug">
                            {ach.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Cloud */}
              {skills && skills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-700/40">
                    Core Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="text-[10px] bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages with rating dots */}
              {languages && languages.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-700/40">
                    Languages
                  </span>
                  <div className="space-y-1.5 pt-1">
                    {languages.map(lang => (
                      <div key={lang.id} className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>{lang.language}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9.5px] text-slate-400 mr-1">{lang.proficiency}</span>
                          {[1, 2, 3, 4, 5].map(dot => (
                            <div 
                              key={dot}
                              className={`w-1.5 h-1.5 rounded-full ${dot <= (lang.levelScore || 5) ? 'bg-emerald-400' : 'bg-slate-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="pt-4 text-[9px] text-slate-500 text-center sm:text-left">
              HireLens ATS Optimized · Enhancv Standard
            </div>
          </div>

          {/* MAIN WHITE RIGHT COLUMN (8 cols) */}
          <div className="col-span-12 sm:col-span-8 p-6 sm:p-9 space-y-6">
            
            {/* Header in main column for desktop flow */}
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                {personal.fullName || 'YOUR NAME'}
              </h2>
              <div className="text-xs font-bold pt-0.5" style={{ color: accent }}>
                {personal.targetTitle || 'Senior Software Engineer'}
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div className="space-y-1.5">
                <h3 
                  className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-2"
                  style={{ color: accent }}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Professional Summary</span>
                </h3>
                <p className="text-[#334155] leading-relaxed pt-1 text-[11.5px]">
                  {summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <div className="space-y-4">
                <h3 
                  className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-2"
                  style={{ color: accent }}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Experience</span>
                </h3>
                <div className="space-y-4 pt-1">
                  {experience.map(exp => (
                    <div key={exp.id} className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <div className="text-xs font-bold text-[#0F172A]">
                          {exp.role} <span className="font-semibold text-slate-600">at {exp.company}</span>
                        </div>
                        <span className="text-[10.5px] font-mono text-slate-500">{exp.dates}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 italic">{exp.location}</div>
                      <ul className="space-y-1 pt-1">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="text-[#334155] flex items-start gap-2 leading-relaxed text-[11px] group">
                            <span className="font-bold shrink-0 mt-0.5" style={{ color: accent }}>•</span>
                            <span className="flex-1">{b}</span>
                            {onSelectBulletToImprove && (
                              <button
                                onClick={() => onSelectBulletToImprove(b)}
                                className="hidden group-hover:inline-block text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 text-emerald-700 cursor-pointer no-print shrink-0"
                                title="Improve this bullet with AI"
                              >
                                AI Polish
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <div className="space-y-3">
                <h3 
                  className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-2"
                  style={{ color: accent }}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Education</span>
                </h3>
                <div className="space-y-2 pt-1">
                  {education.map(edu => (
                    <div key={edu.id} className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0F172A]">{edu.degree}</span>
                        <span className="text-slate-600"> — {edu.institution}</span>
                        {edu.honors && <span className="text-[10px] text-slate-500 block italic">{edu.honors}</span>}
                      </div>
                      <span className="text-[10.5px] font-mono text-slate-500">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div className="space-y-3">
                <h3 
                  className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-2"
                  style={{ color: accent }}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Projects</span>
                </h3>
                <div className="space-y-2 pt-1">
                  {projects.map(proj => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex items-baseline justify-between text-xs font-bold text-[#0F172A]">
                        <span>{proj.name} {proj.role && <span className="text-slate-500 font-normal">({proj.role})</span>}</span>
                        {proj.link && <span className="text-[10px] font-mono text-slate-500 underline">{proj.link}</span>}
                      </div>
                      <ul className="space-y-0.5">
                        {proj.bullets.map((b, i) => (
                          <li key={i} className="text-[#334155] text-[11px] leading-relaxed flex items-start gap-1.5">
                            <span className="font-bold text-slate-400">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div className="space-y-2">
                <h3 
                  className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200 flex items-center gap-2"
                  style={{ color: accent }}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certifications</span>
                </h3>
                <div className="flex flex-wrap gap-3 pt-1">
                  {certifications.map(cert => (
                    <div key={cert.id} className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1">
                      <span className="font-bold">{cert.name}</span> · <span className="text-slate-500">{cert.issuer} ({cert.year})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 2: ENHANCV TWO-COLUMN (Justin Coleman / Vanessa Ford style)
  // -------------------------------------------------------------
  if (design.templateId === 'enhancv-two-column') {
    return (
      <div 
        id="printable-resume"
        className={`bg-white text-[#1C2523] rounded-xl shadow-xl p-8 sm:p-10 border border-[#DCE5E0] min-h-[960px] ${fontClass} leading-relaxed select-text print:shadow-none print:border-none print:p-0 print:m-0 print:min-h-0`}
      >
        {/* Top Accent Strip */}
        <div className="h-2 w-full rounded-full mb-6 print:hidden" style={{ backgroundColor: accent }} />

        {/* Top Header */}
        <div className="border-b border-[#E3ECE7] pb-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111A18]">
                {personal.fullName || 'YOUR NAME'}
              </h1>
              <p className="text-sm font-bold font-mono pt-1" style={{ color: accent }}>
                {personal.targetTitle || 'Professional Role'}
              </p>
            </div>
            <div className="text-[11px] text-slate-600 sm:text-right space-y-0.5">
              {personal.email && <div>{personal.email}</div>}
              {personal.phone && <div>{personal.phone} · {personal.location}</div>}
              {personal.linkedin && <div className="text-slate-500">{personal.linkedin.replace(/^https?:\/\//, '')}</div>}
            </div>
          </div>
        </div>

        {/* Dual Columns */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (65% width) */}
          <div className="col-span-12 sm:col-span-7 space-y-6">
            
            {/* Summary */}
            {summary && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-[#E3ECE7]" style={{ color: accent }}>
                  Summary
                </h2>
                <p className="text-[11.5px] text-[#33403C] leading-relaxed pt-1">
                  {summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-[#E3ECE7]" style={{ color: accent }}>
                  Professional Experience
                </h2>
                <div className="space-y-4 pt-1">
                  {experience.map(exp => (
                    <div key={exp.id} className="space-y-1.5">
                      <div className="flex items-baseline justify-between text-xs font-bold">
                        <span className="text-[#192320]">{exp.role}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{exp.dates}</span>
                      </div>
                      <div className="text-[10.5px] text-slate-600 font-semibold">{exp.company} · <span className="font-normal italic text-slate-500">{exp.location}</span></div>
                      <ul className="space-y-1 pt-1">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="text-[11px] text-[#33403C] flex items-start gap-2 leading-relaxed">
                            <span className="font-bold shrink-0 mt-0.5" style={{ color: accent }}>•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-[#E3ECE7]" style={{ color: accent }}>
                  Featured Projects
                </h2>
                <div className="space-y-2 pt-1">
                  {projects.map(proj => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex items-baseline justify-between text-xs font-bold text-[#192320]">
                        <span>{proj.name}</span>
                        {proj.link && <span className="text-[10px] text-slate-500 font-mono underline">{proj.link}</span>}
                      </div>
                      <ul className="space-y-0.5">
                        {proj.bullets.map((b, idx) => (
                          <li key={idx} className="text-[11px] text-[#33403C] flex items-start gap-1.5">
                            <span className="text-slate-400">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN (35% width) */}
          <div className="col-span-12 sm:col-span-5 space-y-6">
            
            {/* Key Achievements */}
            {keyAchievements && keyAchievements.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-[#E3ECE7]" style={{ color: accent }}>
                  Key Achievements
                </h2>
                <div className="space-y-2 pt-1">
                  {keyAchievements.map(ach => (
                    <div key={ach.id} className="p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E3ECE7] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold" style={{ color: accent }}>
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span>{ach.metric || ach.title}</span>
                      </div>
                      {ach.description && (
                        <p className="text-[10.5px] text-[#44524E] leading-snug">
                          {ach.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {skills && skills.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-[#E3ECE7]" style={{ color: accent }}>
                  Skills & Tools
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.map((skill, i) => (
                    <span 
                      key={i}
                      className="text-[10.5px] font-medium bg-[#F0F5F2] text-[#273330] border border-[#DCE5E0] px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-[#E3ECE7]" style={{ color: accent }}>
                  Education
                </h2>
                <div className="space-y-2 pt-1">
                  {education.map(edu => (
                    <div key={edu.id} className="space-y-0.5 text-xs">
                      <div className="font-bold text-[#192320]">{edu.degree}</div>
                      <div className="text-[11px] text-slate-600">{edu.institution}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{edu.year} · {edu.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-[#E3ECE7]" style={{ color: accent }}>
                  Languages
                </h2>
                <div className="space-y-1.5 pt-1">
                  {languages.map(lang => (
                    <div key={lang.id} className="flex items-center justify-between text-[11px] text-[#33403C]">
                      <span>{lang.language}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500 mr-1">{lang.proficiency}</span>
                        {[1, 2, 3, 4, 5].map(d => (
                          <div 
                            key={d} 
                            className={`w-1.5 h-1.5 rounded-full ${d <= (lang.levelScore || 5) ? 'bg-[#16B889]' : 'bg-slate-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-[#E3ECE7]" style={{ color: accent }}>
                  Certifications
                </h2>
                <div className="space-y-1.5 pt-1">
                  {certifications.map(c => (
                    <div key={c.id} className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md p-2">
                      <div className="font-bold text-[#192320]">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.issuer} · {c.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 3: MODERN CLEAN (Johnatan Carrillo style)
  // -------------------------------------------------------------
  if (design.templateId === 'modern-clean') {
    return (
      <div 
        id="printable-resume"
        className={`bg-white text-[#1C2523] rounded-xl shadow-xl p-8 sm:p-10 border border-[#DCE5E0] min-h-[960px] ${fontClass} ${densityClass} select-text print:shadow-none print:border-none print:p-0 print:m-0 print:min-h-0`}
      >
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F172A]">
                {personal.fullName || 'YOUR NAME'}
              </h1>
              <p className="text-xs font-bold uppercase tracking-wider pt-0.5" style={{ color: accent }}>
                {personal.targetTitle || 'Professional Role'}
              </p>
            </div>
            <div className="text-[10.5px] font-mono text-slate-600 sm:text-right space-y-0.5">
              <div>{personal.email} · {personal.phone}</div>
              <div>{personal.location} · {personal.linkedin}</div>
            </div>
          </div>
        </div>

        {/* 2-3 Box Metric Grid Callouts */}
        {keyAchievements && keyAchievements.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1">
            {keyAchievements.slice(0, 3).map((ach, idx) => (
              <div 
                key={ach.id || idx}
                className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-center sm:text-left"
              >
                <div className="text-sm font-black tracking-tight" style={{ color: accent }}>
                  {ach.metric || ach.title}
                </div>
                <div className="text-[10px] text-slate-600 leading-snug line-clamp-2">
                  {ach.description || ach.title}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="space-y-1">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
              Professional Profile
            </h2>
            <p className="text-[#334155] leading-relaxed pt-0.5">
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
              Work Experience
            </h2>
            <div className="space-y-3.5 pt-0.5">
              {experience.map(exp => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-baseline justify-between font-bold text-xs">
                    <span className="text-[#0F172A]">{exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                    <span className="text-[10px] font-mono text-slate-500">{exp.dates}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 italic">{exp.location}</div>
                  <ul className="space-y-1 pt-0.5">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="text-[#334155] flex items-start gap-2 leading-relaxed">
                        <span className="font-bold text-slate-400 mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
              Featured Projects
            </h2>
            <div className="space-y-2 pt-0.5">
              {projects.map(proj => (
                <div key={proj.id} className="space-y-0.5 break-inside-avoid print:break-inside-avoid">
                  <div className="flex items-baseline justify-between font-bold text-xs text-slate-900">
                    <span>{proj.name} {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}</span>
                    {proj.link && <span className="text-[10px] font-mono text-slate-500 underline">{proj.link}</span>}
                  </div>
                  <ul className="space-y-0.5">
                    {proj.bullets.map((b, idx) => (
                      <li key={idx} className="text-[#334155] text-[11px] flex items-start gap-1.5 leading-relaxed">
                        <span className="text-slate-400">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-1">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
              Technical Competencies
            </h2>
            <p className="text-[#334155] leading-relaxed pt-0.5">
              {skills.join(' · ')}
            </p>
          </div>
        )}

        {/* Education, Certifications & Languages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {education && education.length > 0 && (
            <div className="space-y-1 break-inside-avoid print:break-inside-avoid">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
                Education
              </h2>
              {education.map(edu => (
                <div key={edu.id} className="text-xs pt-0.5">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-[10.5px] text-slate-600">{edu.institution} ({edu.year})</div>
                </div>
              ))}
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div className="space-y-1 break-inside-avoid print:break-inside-avoid">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
                Certifications
              </h2>
              {certifications.map(c => (
                <div key={c.id} className="text-xs pt-0.5">
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[10.5px] text-slate-600">{c.issuer} · {c.year}</div>
                </div>
              ))}
            </div>
          )}

          {languages && languages.length > 0 && (
            <div className="space-y-1 sm:col-span-2 break-inside-avoid print:break-inside-avoid">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
                Languages
              </h2>
              <div className="flex flex-wrap gap-4 text-xs pt-0.5">
                {languages.map(lang => (
                  <span key={lang.id} className="text-slate-700">
                    <strong className="text-slate-900">{lang.language}</strong> ({lang.proficiency})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 4: CLASSIC ATS (Single Column Traditional)
  // -------------------------------------------------------------
  return (
    <div 
      id="printable-resume"
      className={`bg-white text-[#1C2523] rounded-xl shadow-xl p-8 sm:p-10 border border-[#DCE5E0] min-h-[960px] ${fontClass} ${densityClass} select-text space-y-4 print:shadow-none print:border-none print:p-0 print:m-0 print:min-h-0`}
    >
      {/* Header */}
      <div className="text-center border-b border-slate-300 pb-3 space-y-1">
        <h1 className="text-2xl font-black uppercase tracking-tight text-[#111A18]">
          {personal.fullName || 'YOUR NAME'}
        </h1>
        <p className="text-xs font-bold font-mono" style={{ color: accent }}>
          {personal.targetTitle || 'Target Professional Role'}
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-[10.5px] text-slate-600 pt-0.5">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-1">
          <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5" style={{ color: accent }}>
            Professional Summary
          </h2>
          <p className="text-[#33403C] leading-relaxed pt-0.5">
            {summary}
          </p>
        </div>
      )}

      {/* Key Achievements */}
      {keyAchievements && keyAchievements.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5" style={{ color: accent }}>
            Selected Key Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
            {keyAchievements.map(ach => (
              <div key={ach.id} className="p-2 border border-slate-200 rounded text-xs break-inside-avoid print:break-inside-avoid">
                <div className="font-bold" style={{ color: accent }}>{ach.metric || ach.title}</div>
                {ach.description && <p className="text-[10.5px] text-slate-600">{ach.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5" style={{ color: accent }}>
            Technical Skills & Core Competencies
          </h2>
          <p className="text-[#33403C] leading-relaxed pt-0.5">
            {skills.join(', ')}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5" style={{ color: accent }}>
            Professional Experience
          </h2>
          {experience.map(exp => (
            <div key={exp.id} className="space-y-1 break-inside-avoid print:break-inside-avoid">
              <div className="flex items-baseline justify-between font-bold text-xs">
                <span className="text-[#192320]">{exp.role} — <span className="font-semibold text-slate-600">{exp.company}</span></span>
                <span className="text-[10px] text-slate-500 font-mono">{exp.dates}</span>
              </div>
              <div className="text-[10px] text-slate-500 italic">{exp.location}</div>
              <ul className="list-disc list-inside space-y-1 pt-0.5">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="text-[#33403C] leading-relaxed pl-1">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5" style={{ color: accent }}>
            Projects
          </h2>
          {projects.map(proj => (
            <div key={proj.id} className="space-y-0.5 break-inside-avoid print:break-inside-avoid">
              <div className="flex items-baseline justify-between text-xs font-bold text-[#192320]">
                <span>{proj.name} {proj.role && <span className="font-normal text-slate-600">({proj.role})</span>}</span>
                {proj.link && <span className="text-[10px] font-mono text-slate-500 underline">{proj.link}</span>}
              </div>
              <ul className="list-disc list-inside space-y-0.5 pt-0.5">
                {proj.bullets.map((b, i) => (
                  <li key={i} className="text-[#33403C] text-[11px] leading-relaxed pl-1">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="space-y-2 break-inside-avoid print:break-inside-avoid">
          <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5" style={{ color: accent }}>
            Education
          </h2>
          {education.map(edu => (
            <div key={edu.id} className="flex items-baseline justify-between text-xs">
              <div>
                <span className="font-bold text-[#192320]">{edu.degree}</span>
                <span className="text-slate-600">, {edu.institution}</span>
                {edu.honors && <span className="text-[10px] text-slate-500 block italic">{edu.honors}</span>}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{edu.year}</span>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="space-y-1.5 break-inside-avoid print:break-inside-avoid">
          <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5" style={{ color: accent }}>
            Certifications
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {certifications.map(c => (
              <span key={c.id} className="text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                <strong>{c.name}</strong> ({c.issuer}, {c.year})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="space-y-1 break-inside-avoid print:break-inside-avoid">
          <h2 className="text-[11.5px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5" style={{ color: accent }}>
            Languages
          </h2>
          <p className="text-xs text-slate-700">
            {languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}
          </p>
        </div>
      )}

    </div>
  );
};
