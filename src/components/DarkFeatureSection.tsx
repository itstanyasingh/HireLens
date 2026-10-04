import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Zap, Target, Eye, Scale, TrendingUp, Layers } from 'lucide-react';

interface DiagnosticCardProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
  delay: number;
  isVisible: boolean;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ icon, title, items, delay, isVisible }) => {
  return (
    <div
      style={{
        transitionDelay: `${delay}ms`,
        transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
        opacity: isVisible ? 1 : 0,
      }}
      className="group relative bg-white text-[#273330] rounded-[16px] p-7 sm:p-8 min-h-[185px] w-full max-w-[360px] mx-auto border border-[#E7ECE9] shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(22,184,137,0.14),0_8px_25px_rgba(0,0,0,0.12)] hover:border-[#16B889]/60 hover:-translate-y-2 hover:scale-[1.02] active:-translate-y-1 active:scale-[1.01] transition-all duration-300 ease-out cursor-pointer select-none space-y-4"
    >
      {/* Top Header */}
      <div className="flex items-center gap-3.5 border-b border-[#F0F3F1] pb-3.5">
        <div className="w-10 h-10 rounded-full bg-[#DDF5EC] text-[#16B889] flex items-center justify-center shrink-0 group-hover:scale-112 group-hover:-translate-y-0.5 group-hover:bg-[#16B889] group-hover:text-white transition-all duration-250 ease-out">
          {icon}
        </div>
        <h3 className="font-bold text-[16px] sm:text-[17px] text-[#273330] tracking-tight group-hover:-translate-y-0.5 transition-transform duration-250 ease-out">
          {title}
        </h3>
      </div>

      {/* Checklist items with subtle micro-interaction */}
      <div className="space-y-2 text-[14px] sm:text-[14.5px] leading-[1.8] text-[#55625F]">
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{ transitionDelay: `${idx * 40}ms` }}
            className="flex items-center gap-2 group-hover:translate-x-1.5 transition-transform duration-250 ease-out"
          >
            <span className="text-[#16B889] font-bold text-[15px] shrink-0">✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DarkFeatureSection: React.FC = () => {
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

  const cards = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'ATS ESSENTIALS',
      items: ['File format and size', 'ATS structure', 'Contact details', 'Date consistency'],
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'CONTENT QUALITY',
      items: ['Impact metrics', 'Action verbs', 'Grammar & spelling', 'Repetition alerts'],
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'RECRUITER SIGNALS',
      items: ['Project credibility', 'Career progression', 'Impact evidence', 'Role relevance'],
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: 'RESUME SECTIONS',
      items: ['Essential sections', 'Contact information', 'Technical skills', 'Key projects'],
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'JOB TAILORING',
      items: ['Hard skills match', 'Soft competencies', 'Role keywords', 'Tailored role title'],
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: 'BIAS & FAIRNESS',
      items: ['Date presentation', 'Employment gaps', 'Location neutrality', 'Consistent timeline'],
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'CAREER IMPACT',
      items: ['Business outcomes', 'Leadership signals', 'Technical scale', 'Quantifiable growth'],
    },
  ];

  return (
    <section 
      id="sec-features" 
      ref={sectionRef}
      className="relative bg-[#07110F] text-white py-24 sm:py-28 lg:py-32 overflow-hidden border-t border-[#182321]"
    >
      
      {/* Background Subtle Atmosphere */}
      <div className="absolute top-1/2 right-[-80px] -translate-y-1/2 w-[600px] h-[500px] bg-[#164A40]/25 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-50px] left-[-80px] w-[500px] h-[400px] bg-[#16B889]/10 blur-[130px] pointer-events-none z-0"></div>

      {/* Subtle Curved Line Artwork */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M -80 160 C 160 260, 210 580, -80 780" stroke="#16B889" strokeWidth="1.2" strokeOpacity="0.3" fill="none" />
        <path d="M -60 190 C 190 290, 240 610, -60 810" stroke="#397F86" strokeWidth="1" strokeOpacity="0.18" fill="none" />
        <path d="M 1580 120 C 1120 310, 1160 690, 1580 880" stroke="#16B889" strokeWidth="1.2" strokeOpacity="0.3" fill="none" />
        <path d="M 1600 150 C 1140 340, 1180 720, 1600 910" stroke="#397F86" strokeWidth="1" strokeOpacity="0.18" fill="none" />
      </svg>

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 space-y-16 lg:space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-[760px] mx-auto space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[2px] text-[#5AD3AD] font-sans block">
            COMPREHENSIVE DIAGNOSTIC AUDIT
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.1]">
            The Resume Checker that looks <br className="hidden sm:inline" />
            beyond the basics.
          </h2>

          <p className="text-[16px] sm:text-[17.5px] text-[#AEBAB7] leading-[1.65] max-w-[640px] mx-auto pt-1">
            HireLens evaluates the signals that matter to ATS systems and hiring managers.
          </p>
        </div>

        {/* 7 Diagnostic Cards Grid (3 Columns + Centered 7th Card) */}
        <div className="space-y-6">
          {/* Top 6 Cards (3x2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {cards.slice(0, 6).map((card, index) => (
              <DiagnosticCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                items={card.items}
                delay={index * 70}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* 7th Card (Centered in row 3) */}
          <div className="flex justify-center pt-1">
            <DiagnosticCard
              icon={cards[6].icon}
              title={cards[6].title}
              items={cards[6].items}
              delay={420}
              isVisible={isVisible}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
