import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Check } from 'lucide-react';

export const ExplanationSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        setParallaxY((progress - 0.5) * 30);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      id="sec-ats-audit"
      ref={sectionRef} 
      className="relative w-full bg-[#FFFFFF] border-t border-[#EEF2F0] py-[100px] lg:py-[125px] overflow-hidden"
    >
      
      {/* Soft atmospheric ambient glow behind the left animation */}
      <div 
        className="absolute top-[12%] left-[2%] w-[700px] h-[650px] rounded-full blur-[140px] opacity-60 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #C8EFE5 0%, #DCE8F8 50%, transparent 75%)' }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 w-full">
        
        {/* Genuine Two-Column Editorial Grid: Left 45%, Right 55% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[70px] items-start">
          
          {/* LEFT COLUMN: LARGE STICKY LOTTIE ANIMATION (~45% width) */}
          <div className="lg:col-span-5 w-full flex items-start justify-center lg:sticky lg:top-[120px]">
            <div 
              style={{
                transform: isVisible 
                  ? `translateY(${parallaxY}px) scale(1)` 
                  : 'translateY(40px) scale(0.94)',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative w-full max-w-[540px] h-[460px] sm:h-[520px] lg:h-[560px] flex items-center justify-center"
            >
              
              {/* Floating Pill Accent Badges */}
              <div 
                style={{
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1) 350ms',
                }}
                className="absolute top-[8%] left-[6%] z-20 bg-[#DDF5EC] text-[#16B889] text-[12px] font-bold px-3.5 py-1.5 rounded-full shadow-[0_4px_14px_rgba(22,184,137,0.15)] border border-[#C5EFE0] pointer-events-none"
              >
                Keywords
              </div>

              <div 
                style={{
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1) 500ms',
                }}
                className="absolute bottom-[28%] left-[2%] z-20 bg-[#FCE8DA] text-[#D97736] text-[12px] font-bold px-3.5 py-1.5 rounded-full shadow-[0_4px_14px_rgba(217,119,54,0.15)] border border-[#F8D4BE] pointer-events-none"
              >
                Contact information
              </div>

              <div 
                style={{
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1) 650ms',
                }}
                className="absolute bottom-[10%] right-[8%] z-20 bg-[#E8E8FA] text-[#5B5BD6] text-[12px] font-bold px-3.5 py-1.5 rounded-full shadow-[0_4px_14px_rgba(91,91,214,0.15)] border border-[#D5D5F5] pointer-events-none"
              >
                Skills
              </div>

              {/* Main Lottie Player */}
              <DotLottieReact
                src="https://lottie.host/51852c39-afc0-4165-9db7-ce7a691b700e/4QH8gDHLjs.lottie"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
                className="w-full h-full object-contain"
              />

            </div>
          </div>

          {/* RIGHT COLUMN: RICH EDITORIAL FLOW (~55% width) */}
          <div className="lg:col-span-7 w-full space-y-10 max-w-[640px] lg:pl-4">
            
            {/* Top Introductory Editorial Block */}
            <div className="space-y-6">
              
              {/* Small Eyebrow */}
              <span className="text-[12.5px] font-bold uppercase tracking-[2px] text-[#16B889] font-sans block">
                ATS AUDIT
              </span>

              {/* Main Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-[50px] font-bold text-[#273330] tracking-[-2px] leading-[1.06]">
                Get an ATS understanding check
              </h2>

              {/* 3 Full Introductory Paragraphs */}
              <div className="space-y-5 text-[17.5px] text-[#55625F] leading-[1.65]">
                <p>
                  Part of the HireLens resume checker score is based on how easily applicant tracking systems can read and interpret your resume. HireLens evaluates the structure, formatting, contact information, dates, links, file type and keywords that determine whether important information can be extracted correctly.
                </p>

                <p>
                  When you apply for a job, your resume may be processed by an applicant tracking system before it reaches a recruiter. These systems convert resumes into searchable information so hiring teams can identify candidates based on relevant skills, experience and keywords.
                </p>

                <p>
                  A resume can look perfectly polished to a person while still creating problems for an automated system. Complex layouts, unclear section headings, inconsistent dates, missing contact details or poorly formatted information can prevent important parts of your experience from being understood.
                </p>
              </div>

            </div>

            {/* NUMBERED EDITORIAL SECTION 1 */}
            <div className="pt-8 border-t border-[#EEF2F0] space-y-4">
              
              {/* Pale Green Circular Number Badge */}
              <div className="w-10 h-10 rounded-full bg-[#DDF5EC] text-[#16B889] font-bold text-[16px] flex items-center justify-center font-sans">
                1
              </div>

              {/* Number 1 Heading */}
              <h3 className="text-2xl sm:text-[28px] font-bold text-[#273330] tracking-tight leading-[1.2] pt-1">
                How much of your resume can an ATS understand?
              </h3>

              {/* Number 1 Description */}
              <p className="text-[17px] text-[#55625F] leading-[1.65]">
                HireLens checks whether your resume uses recognizable sections, readable formatting and an ATS-friendly structure. It evaluates whether important information such as your contact details, experience, education, skills, dates and links can be identified consistently.
              </p>

              {/* Small Horizontal List Underneath */}
              <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2.5 text-[14px] text-[#3C4A47] font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" /> File format
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" /> Contact extraction
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" /> Section detection
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" /> Link validation
                </span>
              </div>

            </div>

            {/* NUMBERED EDITORIAL SECTION 2 */}
            <div className="pt-8 border-t border-[#EEF2F0] space-y-4">
              
              {/* Pale Green Circular Number Badge */}
              <div className="w-10 h-10 rounded-full bg-[#DDF5EC] text-[#16B889] font-bold text-[16px] flex items-center justify-center font-sans">
                2
              </div>

              {/* Number 2 Heading */}
              <h3 className="text-2xl sm:text-[28px] font-bold text-[#273330] tracking-tight leading-[1.2] pt-1">
                What does HireLens identify?
              </h3>

              {/* Number 2 Description */}
              <p className="text-[17px] text-[#55625F] leading-[1.65]">
                HireLens looks beyond basic formatting. It identifies weak or unclear statements, missing measurable results, inconsistent information, repetitive wording and important keywords that may be missing from your resume. The goal is to show you exactly what could reduce your resume’s effectiveness before you apply.
              </p>

              {/* Small Horizontal List Underneath */}
              <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2.5 text-[14px] text-[#3C4A47] font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" /> Weak verbs
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" /> Missing metrics
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" /> Passive language
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" /> Repetition
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" /> Missing keywords
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
