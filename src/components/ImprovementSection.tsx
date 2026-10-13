import React, { useState, useEffect, useRef } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  Target, 
  ArrowDown, 
  Check, 
  AlertTriangle, 
  Briefcase, 
  MessageSquare, 
  SlidersHorizontal,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';

interface ImprovementSectionProps {
  onNavigate?: (tab: 'landing' | 'report' | 'matcher' | 'history' | 'builder' | 'tailor' | 'cover-letter' | 'tracker' | 'interview-prep') => void;
}

const DEMO_STORAGE_KEY = 'hirelens_demo_suggestion_applied';
const BUILDER_STORAGE_KEY = 'hirelens_resume_builder_draft';

const ORIGINAL_BULLET = 'Developed web applications using React and TypeScript.';
const IMPROVED_BULLET = 'Built a responsive React application with reusable components, boosting customer engagement by 32%.';

export const ImprovementSection: React.FC<ImprovementSectionProps> = ({ onNavigate }) => {
  const [activePill, setActivePill] = useState('Resume Builder');
  const [isApplied, setIsApplied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Load applied state from session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DEMO_STORAGE_KEY);
      if (saved === 'true') {
        setIsApplied(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const navPills: { 
    name: string; 
    tab: 'builder' | 'tailor' | 'cover-letter' | 'tracker' | 'interview-prep' | 'matcher';
    actionLabel: string;
    description: string;
  }[] = [
    { 
      name: 'Resume Builder', 
      tab: 'builder', 
      actionLabel: 'Open Full Resume Builder & Document Studio →',
      description: 'ATS document studio with customizable sections, live layout formatting, and export.'
    },
    { 
      name: 'Resume Tailor', 
      tab: 'tailor', 
      actionLabel: 'Open Resume Tailor & Keyword Matcher →',
      description: 'Adapt resume keywords and rewrite bullet points to align with job descriptions.'
    },
    { 
      name: 'Cover Letter', 
      tab: 'cover-letter', 
      actionLabel: 'Launch Cover Letter Generator →',
      description: 'Generate targeted application letters with customizable tone and achievements.'
    },
    { 
      name: 'Job Tracker', 
      tab: 'tracker', 
      actionLabel: 'Open Job Application Tracker →',
      description: 'Organize and manage your applications, interviews, deadlines, and follow-ups.'
    },
    { 
      name: 'Interview Prep', 
      tab: 'interview-prep', 
      actionLabel: 'Start Interview Prep Coach →',
      description: 'Practice role-specific STAR behavioral, situational, and technical questions.'
    },
    { 
      name: 'Job Matches', 
      tab: 'matcher', 
      actionLabel: 'Launch Job Matcher & Skill Gap Analysis →',
      description: 'Benchmark your resume against job requirements to reveal skill gaps.'
    },
  ];

  const handlePillClick = (item: typeof navPills[0], e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActivePill(item.name);
    if (onNavigate) {
      onNavigate(item.tab);
    }
  };

  const updateBuilderSessionDraft = (applied: boolean) => {
    try {
      const saved = sessionStorage.getItem(BUILDER_STORAGE_KEY);
      let draft = saved ? JSON.parse(saved) : null;
      const targetBullet = applied ? IMPROVED_BULLET : ORIGINAL_BULLET;

      if (!draft) {
        // Initialize default draft if user has not visited builder yet
        draft = {
          fullName: 'Alex Morgan',
          targetTitle: 'Senior Full Stack Engineer',
          email: 'alex.morgan@email.com',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/alexmorgan-dev',
          github: 'github.com/alexmorgan',
          summary: 'Performance-driven Full Stack Engineer with 5+ years of experience architecting high-scale React, TypeScript, and Node.js applications. Proven record of reducing API latency by 35% and accelerating release velocity across cross-functional product squads.',
          skills: 'React, TypeScript, Next.js, Node.js, Express, Python, PostgreSQL, Redis, Docker, AWS (S3/EC2), REST APIs, GraphQL, Tailwind CSS, Jest, CI/CD',
          experience: [
            {
              id: 'exp-1',
              role: 'Senior Software Engineer',
              company: 'TechFlow Systems',
              dates: '2022 – Present',
              location: 'San Francisco, CA',
              bullets: [
                targetBullet,
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
          ],
          education: [
            {
              id: 'edu-1',
              degree: 'B.S. in Computer Science',
              institution: 'University of California, Berkeley',
              year: '2016 – 2020',
              location: 'Berkeley, CA'
            }
          ]
        };
      } else if (draft.experience && draft.experience.length > 0) {
        if (!draft.experience[0].bullets) {
          draft.experience[0].bullets = [];
        }
        draft.experience[0].bullets[0] = targetBullet;
      }
      sessionStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      // ignore
    }
  };

  const handleApplySuggestion = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nextState = !isApplied;
    setIsApplied(nextState);
    try {
      sessionStorage.setItem(DEMO_STORAGE_KEY, nextState ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
    updateBuilderSessionDraft(nextState);

    if (nextState) {
      setFeedbackMessage('✓ Improved bullet point applied! Preserved in your active Resume Builder session.');
    } else {
      setFeedbackMessage('Reverted to original bullet point in session draft.');
    }
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleUndo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsApplied(false);
    try {
      sessionStorage.setItem(DEMO_STORAGE_KEY, 'false');
    } catch (e) {
      // ignore
    }
    updateBuilderSessionDraft(false);
    setFeedbackMessage('Reverted to original draft bullet point.');
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const currentPillObj = navPills.find(p => p.name === activePill) || navPills[0];

  const features = [
    {
      icon: <FileCheck className="w-5 h-5 text-[#16B889]" />,
      title: 'Detailed resume feedback',
      description: 'Get clear feedback across ATS compatibility, content quality, skills, formatting and role fit.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#16B889]" />,
      title: 'Rewrite weak statements',
      description: 'Turn vague bullet points into concise, measurable achievements that communicate your impact.',
    },
    {
      icon: <Target className="w-5 h-5 text-[#16B889]" />,
      title: 'Tailor every application',
      description: 'Adapt your resume to the requirements and keywords of each job without losing your actual experience.',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="sec-improvement"
      className="relative bg-[#071310] text-[#F5F8F6] py-[110px] lg:py-[130px] border-t border-[#142320] overflow-hidden min-h-[850px] lg:min-h-[940px] flex items-center"
    >
      
      {/* 1. ATMOSPHERIC BACKDROP & SUBTLE RADIAL ARCS */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[550px] bg-[#164A40]/18 blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[650px] h-[450px] bg-[#16B889]/10 blur-[150px] pointer-events-none z-0"></div>
      
      {/* Decorative Faint Curved Arcs */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-25" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M -100 180 C 400 350, 900 120, 1600 280" stroke="#16B889" strokeWidth="1" strokeOpacity="0.3" fill="none" />
        <path d="M -80 580 C 500 420, 1000 680, 1600 520" stroke="#397F86" strokeWidth="1" strokeOpacity="0.2" fill="none" />
      </svg>

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 w-full space-y-16 lg:space-y-20">
        
        {/* 2. TOP HEADING AREA */}
        <div className="text-center max-w-[720px] mx-auto space-y-4">
          
          {/* Eyebrow */}
          <div>
            <span className="text-[12.5px] font-bold uppercase tracking-[2px] text-[#5AD3AD] font-mono block">
              RESUME IMPROVEMENT
            </span>
          </div>

          {/* Main Heading */}
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-[-1.8px] leading-[1.08]">
              Put your resume score to work
            </h2>
          </div>

          {/* Subheading */}
          <div>
            <p className="text-[18px] sm:text-[19px] text-[#AEBAB7] leading-[1.6] pt-1">
              Turn feedback into a stronger application. Select a tool to launch its interactive workspace.
            </p>
          </div>

        </div>

        {/* 3. SIX FEATURE BUTTONS */}
        <div className="relative z-20 flex items-center justify-center gap-3 sm:gap-3.5 flex-wrap max-w-[940px] mx-auto">
          {navPills.map((item) => {
            const isActive = activePill === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={(e) => handlePillClick(item, e)}
                title={`Launch ${item.name}: ${item.description}`}
                className={`py-[13px] px-[22px] rounded-full text-[13.5px] font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 select-none ${
                  isActive
                    ? 'bg-[#16B889] text-white shadow-[0_6px_22px_rgba(22,184,137,0.38)] scale-[1.03] ring-2 ring-[#5AD3AD]/40'
                    : 'bg-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.14] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-white/[0.08]'
                }`}
              >
                <span>{item.name}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-0.5 opacity-100' : 'opacity-60'}`} />
              </button>
            );
          })}
        </div>

        {/* 4. MAIN CONTENT AREA: 50/50 TWO-COLUMN COMPOSITION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[90px] items-center pt-2">
          
          {/* LEFT COLUMN: EDITORIAL CONTENT */}
          <div className="lg:col-span-6 space-y-8 max-w-[540px]">
            
            <div className="space-y-3">
              <span className="text-[12px] font-bold uppercase tracking-[2px] text-[#16B889] font-mono block">
                RESUME FEEDBACK & TOOLS
              </span>

              <h3 className="text-3xl sm:text-4xl lg:text-[36px] font-bold text-white tracking-[-1px] leading-[1.15]">
                Turn feedback into a stronger resume
              </h3>

              <p className="text-[17px] text-[#A8B7B3] leading-[1.65] pt-1">
                Your report shows what needs attention. Use practical suggestions to strengthen your resume and make each section more effective.
              </p>
            </div>

            {/* 3 Clean Feature Rows */}
            <div className="space-y-6 pt-2">
              {features.map((feat) => (
                <div 
                  key={feat.title}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-[12px] bg-[#12221E] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#16B889]/50 group-hover:scale-105 transition-all duration-200 shadow-sm">
                    {feat.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[16px] font-bold text-white tracking-tight">
                      {feat.title}
                    </h4>
                    <p className="text-[14.5px] text-[#8E9E9A] leading-[1.6]">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Tool Launch Shortcut */}
            {onNavigate && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(currentPillObj.tab)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#5AD3AD] hover:text-white bg-[#12221E] border border-[#16B889]/40 hover:border-[#16B889] px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#16B889]" />
                  <span>{currentPillObj.actionLabel}</span>
                </button>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: LARGE ANIMATED PRODUCT VISUAL HERO */}
          <div className="lg:col-span-6 w-full flex items-center justify-center lg:justify-end">
            
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full max-w-[580px] min-h-[490px] bg-[#0C1815] rounded-[26px] border border-white/[0.09] p-6 sm:p-7 shadow-[0_25px_65px_rgba(0,0,0,0.45)] flex flex-col justify-between overflow-hidden group cursor-default"
            >
              
              {/* Subtle Internal Dotted Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1E3A33_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none z-0"></div>

              {/* TOP STATUS BADGES & TITLE */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16B889] animate-pulse"></span>
                  <span className="font-mono text-[11.5px] font-bold text-[#D7E2DE]">
                    INTERACTIVE RESUME DRAFT PREVIEW
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#16B889]/20 border border-[#16B889]/40 text-[#5AD3AD] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#16B889]" /> Strong match
                  </span>
                  <span className="bg-[#D97736]/20 border border-[#D97736]/40 text-[#F5A773] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-[#D97736]" /> Missing metric
                  </span>
                </div>
              </div>

              {/* Success / Feedback Toast Alert */}
              {feedbackMessage && (
                <div className="relative z-20 my-2 p-2.5 bg-[#122E26] border border-[#16B889]/60 rounded-xl text-white text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-lg">
                  <span className="flex items-center gap-1.5 text-[#5AD3AD]">
                    <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                    {feedbackMessage}
                  </span>
                  {isApplied && (
                    <button
                      type="button"
                      onClick={handleUndo}
                      className="text-[11px] text-[#A8C7BD] hover:text-white underline cursor-pointer ml-2 shrink-0 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Undo</span>
                    </button>
                  )}
                </div>
              )}

              {/* RESUME PREVIEW SHEET WITH CONTINUOUS SUBTLE FLOAT */}
              <div className="relative z-10 py-1">
                
                {/* Secondary Tilted Background Sheet Layer */}
                <div 
                  style={{
                    transform: isHovered 
                      ? 'translate(12px, -6px) rotate(2deg)' 
                      : 'translate(8px, -4px) rotate(1.5deg)',
                    transition: 'transform 500ms ease-out',
                  }}
                  className="absolute inset-x-4 top-2 h-[80px] bg-white/[0.05] rounded-[14px] border border-white/[0.08] pointer-events-none"
                />

                {/* Main Resume Sheet Card */}
                <div 
                  className="relative bg-white text-[#273330] rounded-[16px] p-4.5 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.25)] border border-[#E3ECE7] space-y-2.5 animate-[float_5.5s_ease-in-out_infinite]"
                >
                  <div className="flex items-center justify-between border-b border-[#EAEFEA] pb-2">
                    <div>
                      <h4 className="font-extrabold text-[14px] text-[#273330] tracking-tight">ALEX MORGAN</h4>
                      <p className="text-[10.5px] font-bold text-[#16B889] font-mono">SENIOR FULL STACK ENGINEER</p>
                    </div>
                    <span className="text-[9.5px] text-[#7A8A85] font-mono">Experience Section (Active Draft)</span>
                  </div>

                  <div className="text-[12px] sm:text-[12.5px] text-[#44524E] leading-snug">
                    {isApplied ? (
                      <div className="space-y-1.5">
                        <p className="font-semibold text-[#16B889] bg-[#EAF8F3] p-2.5 rounded-[8px] border border-[#BDEBDC] transition-all duration-300">
                          • {IMPROVED_BULLET}
                        </p>
                        <div className="flex items-center justify-between text-[10.5px] text-[#129A72] px-1">
                          <span className="flex items-center gap-1 font-medium">
                            <Check className="w-3 h-3 text-[#16B889]" />
                            Applied to active draft session
                          </span>
                          <button
                            type="button"
                            onClick={handleUndo}
                            className="text-[#68827A] hover:text-[#129A72] underline cursor-pointer flex items-center gap-1 font-semibold"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Revert change
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="p-2.5 bg-[#F8FAF9] rounded-[8px] border border-[#EAEFEA] text-[#55625F] transition-all duration-300">
                        • {ORIGINAL_BULLET}
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* REWRITE SUGGESTION BOX WITH INTERACTIVE APPLY BUTTON */}
              <div className="relative z-10 bg-[#12221E] rounded-[18px] border border-white/[0.1] p-4 space-y-3 shadow-lg">
                
                {/* Before Statement */}
                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono font-bold text-[#D97736] uppercase tracking-wider block">
                    BEFORE — WEAK ACTION & NO METRICS
                  </span>
                  <p className="text-[11.5px] font-mono text-[#A1B2AD] line-through bg-black/40 p-2 rounded-[6px] border border-white/5">
                    "{ORIGINAL_BULLET}"
                  </p>
                </div>

                {/* After Statement */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9.5px] font-mono font-bold text-[#5AD3AD] uppercase tracking-wider">
                    <span>AFTER — QUANTIFIED IMPACT & SCALE</span>
                    <ArrowDown className="w-3 h-3 text-[#16B889]" />
                  </div>
                  <p className="text-[12px] font-mono text-white bg-[#16B889]/15 border border-[#16B889]/40 p-2.5 rounded-[6px] leading-relaxed">
                    "{IMPROVED_BULLET}"
                  </p>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplySuggestion}
                    className={`flex-1 h-[42px] rounded-[10px] text-[12.5px] font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md select-none ${
                      isApplied
                        ? 'bg-[#129A72] hover:bg-[#0E8561] text-white border border-[#5AD3AD]/40 ring-2 ring-[#5AD3AD]/25'
                        : 'bg-[#16B889] hover:bg-[#139E75] text-white hover:shadow-[0_6px_20px_rgba(22,184,137,0.35)]'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>✓ Suggestion Applied (Click to Toggle)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                        <span>✦ Apply suggestion</span>
                      </>
                    )}
                  </button>

                  {isApplied && (
                    <button
                      type="button"
                      onClick={handleUndo}
                      className="h-[42px] px-3 bg-[#1B362F] hover:bg-[#23453C] text-[#A8C7BD] hover:text-white rounded-[10px] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none"
                      title="Undo change"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-[#788E87] pt-0.5">
                  <span>Draft session active. Changes reflect across workspace tools.</span>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('builder')}
                      className="text-[#5AD3AD] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      <span>Open in Builder</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
