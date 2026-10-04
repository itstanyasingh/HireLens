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
  Compass, 
  Layers 
} from 'lucide-react';

export const ImprovementSection: React.FC = () => {
  const [activePill, setActivePill] = useState('Resume Builder');
  const [isApplied, setIsApplied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const navPills = [
    'Resume Builder',
    'Resume Tailor',
    'Cover Letter',
    'Job Tracker',
    'Interview Prep',
    'Job Matches',
  ];

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
          <div
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1) 100ms',
            }}
          >
            <span className="text-[12.5px] font-bold uppercase tracking-[2px] text-[#5AD3AD] font-sans block">
              RESUME IMPROVEMENT
            </span>
          </div>

          {/* Main Heading */}
          <div
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1) 220ms',
            }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-[-1.8px] leading-[1.08]">
              Put your resume score to work
            </h2>
          </div>

          {/* Subheading */}
          <div
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1) 340ms',
            }}
          >
            <p className="text-[18px] sm:text-[19px] text-[#AEBAB7] leading-[1.6] pt-1">
              Turn feedback into a stronger application.
            </p>
          </div>

        </div>

        {/* 3. REDESIGNED NAVIGATION PILLS */}
        <div className="flex items-center justify-center gap-3 sm:gap-3.5 flex-wrap max-w-[940px] mx-auto">
          {navPills.map((pill, idx) => {
            const isActive = activePill === pill;
            return (
              <button
                key={pill}
                onClick={() => setActivePill(pill)}
                style={{
                  transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                  opacity: isVisible ? 1 : 0,
                  transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${400 + idx * 70}ms`,
                }}
                className={`py-[13px] px-[22px] rounded-full text-[13.5px] font-bold transition-all duration-250 cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-[#16B889] text-white shadow-[0_6px_22px_rgba(22,184,137,0.38)] scale-[1.02]'
                    : 'bg-white/[0.08] text-white/75 hover:text-white hover:bg-white/[0.14] hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-white/[0.08]'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* 4. MAIN CONTENT AREA: 50/50 TWO-COLUMN COMPOSITION (max-width 1240px, gap 80–100px) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[90px] items-center pt-2">
          
          {/* LEFT COLUMN: EDITORIAL CONTENT (max-width 540px) */}
          <div className="lg:col-span-6 space-y-8 max-w-[540px]">
            
            <div className="space-y-3">
              <span className="text-[12px] font-bold uppercase tracking-[2px] text-[#16B889] font-sans block">
                RESUME FEEDBACK
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
              {features.map((feat, index) => (
                <div 
                  key={feat.title}
                  style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                    opacity: isVisible ? 1 : 0,
                    transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${600 + index * 120}ms`,
                  }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-[12px] bg-[#12221E] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#16B889]/50 group-hover:scale-105 transition-all duration-250 shadow-sm">
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

          </div>

          {/* RIGHT COLUMN: LARGE ANIMATED PRODUCT VISUAL HERO (540–600px wide × 440–500px tall) */}
          <div className="lg:col-span-6 w-full flex items-center justify-center lg:justify-end">
            
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                transform: isVisible
                  ? isHovered 
                    ? 'translateY(-6px) scale(1.01)' 
                    : 'translateY(0px) scale(1)'
                  : 'translateY(40px) scale(0.95)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1) 400ms',
              }}
              className="relative w-full max-w-[580px] min-h-[460px] lg:h-[500px] bg-[#0C1815] rounded-[26px] border border-white/[0.09] p-6 sm:p-7 shadow-[0_25px_65px_rgba(0,0,0,0.45)] flex flex-col justify-between overflow-hidden group cursor-default"
            >
              
              {/* Subtle Internal Dotted Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1E3A33_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none z-0"></div>

              {/* TOP STATUS BADGES & TITLE */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16B889] animate-pulse"></span>
                  <span className="font-mono text-[12px] font-bold text-[#D7E2DE]">
                    LIVE RESUME AUDIT
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span 
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0.85)',
                      opacity: isVisible ? 1 : 0,
                      transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1) 650ms',
                    }}
                    className="bg-[#16B889]/20 border border-[#16B889]/40 text-[#5AD3AD] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-[#16B889]" /> Strong match
                  </span>
                  <span 
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0.85)',
                      opacity: isVisible ? 1 : 0,
                      transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1) 750ms',
                    }}
                    className="bg-[#D97736]/20 border border-[#D97736]/40 text-[#F5A773] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3 text-[#D97736]" /> Missing metric
                  </span>
                </div>
              </div>

              {/* RESUME PREVIEW SHEET WITH CONTINUOUS SUBTLE FLOAT (5–6s loop) */}
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
                      <p className="text-[10.5px] font-bold text-[#16B889] font-mono">SOFTWARE ENGINEER</p>
                    </div>
                    <span className="text-[9.5px] text-[#7A8A85] font-mono">Experience Section</span>
                  </div>

                  <div className="text-[12px] sm:text-[12.5px] text-[#44524E] leading-snug">
                    {isApplied ? (
                      <p className="font-semibold text-[#16B889] bg-[#EAF8F3] p-2 rounded-[8px] border border-[#BDEBDC] transition-all duration-300">
                        • Built a responsive React application with reusable components, boosting customer engagement by 32%.
                      </p>
                    ) : (
                      <p className="p-2 bg-[#F8FAF9] rounded-[8px] border border-[#EAEFEA] text-[#55625F]">
                        • Developed web applications using React and TypeScript.
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* REWRITE SUGGESTION BOX WITH INTERACTIVE APPLY BUTTON */}
              <div className="relative z-10 bg-[#12221E] rounded-[18px] border border-white/[0.1] p-4 space-y-3 shadow-lg">
                
                {/* Before Statement */}
                <div 
                  style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1) 850ms',
                  }}
                  className="space-y-1"
                >
                  <span className="text-[9.5px] font-mono font-bold text-[#D97736] uppercase tracking-wider block">
                    BEFORE
                  </span>
                  <p className="text-[11.5px] font-mono text-[#A1B2AD] line-through bg-black/40 p-2 rounded-[6px] border border-white/5">
                    "We worked on a website using React."
                  </p>
                </div>

                {/* After Statement */}
                <div 
                  style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1) 950ms',
                  }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between text-[9.5px] font-mono font-bold text-[#5AD3AD] uppercase tracking-wider">
                    <span>AFTER — IMPROVED</span>
                    <ArrowDown className="w-3 h-3 text-[#16B889]" />
                  </div>
                  <p className="text-[12px] font-mono text-white bg-[#16B889]/15 border border-[#16B889]/40 p-2.5 rounded-[6px] leading-relaxed">
                    "Built a responsive React application with reusable components."
                  </p>
                </div>

                {/* Interactive Action Button */}
                <button
                  onClick={() => setIsApplied(!isApplied)}
                  className={`w-full h-[42px] rounded-[10px] text-[12.5px] font-bold transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isApplied
                      ? 'bg-[#129A72] text-white border border-[#5AD3AD]/40'
                      : 'bg-[#16B889] hover:bg-[#139E75] text-white hover:shadow-[0_6px_20px_rgba(22,184,137,0.35)]'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Applied to Resume ✓ (Click to reset)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                      <span>✦ Apply suggestion</span>
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
