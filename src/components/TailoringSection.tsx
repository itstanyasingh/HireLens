import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, CheckCircle2 } from 'lucide-react';

export const TailoringSection: React.FC = () => {
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
      { threshold: 0.15 }
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
        setParallaxY((progress - 0.5) * -30);
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
      id="sec-tailoring"
      ref={sectionRef} 
      className="relative w-full bg-[#FAFCFA] border-t border-[#EEF2F0] py-[100px] lg:py-[120px] min-h-[700px] lg:min-h-[760px] flex items-center overflow-hidden"
    >
      
      {/* Soft atmospheric ambient glow */}
      <div 
        className="absolute top-[20%] right-[5%] w-[600px] h-[500px] rounded-full blur-[140px] opacity-50 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #D5EBF5 0%, #E3E2F8 50%, transparent 75%)' }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 w-full">
        
        {/* Genuine 50/50 Alternating Grid: TEXT ON LEFT, LARGE VISUAL ON RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] items-center">
          
          {/* LEFT COLUMN: EDITORIAL TEXT (max-width 560px) */}
          <div className="lg:col-span-6 w-full space-y-7 max-w-[560px]">
            
            {/* 1. Small Label */}
            <div
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 100ms',
              }}
            >
              <span className="text-[12.5px] font-bold uppercase tracking-[2px] text-[#16B889] font-sans block">
                JOB TAILORING
              </span>
            </div>

            {/* 2. Main Heading */}
            <div
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 220ms',
              }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#273330] tracking-[-2px] leading-[1.08]">
                Tailor your resume to a job description
              </h2>
            </div>

            {/* 3. Paragraph 1 */}
            <div
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 340ms',
              }}
            >
              <p className="text-[18px] sm:text-[19px] text-[#55625F] leading-[1.7]">
                Paste the job you're applying for and HireLens compares the role requirements with the skills and experience already present in your resume.
              </p>
            </div>

            {/* 4. Paragraph 2 */}
            <div
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 460ms',
              }}
            >
              <p className="text-[18px] sm:text-[19px] text-[#55625F] leading-[1.7]">
                It highlights relevant matches, identifies meaningful gaps and suggests improvements that are grounded in the experience already shown on your resume.
              </p>
            </div>

            {/* 5. Highlighted Information Box */}
            <div
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 580ms',
              }}
              className="p-4 bg-[#F2FBF7] border border-[#CDEEE2] rounded-[10px] flex items-center gap-3 text-[14px] text-[#1E5E4E] font-medium shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#16B889] text-white flex items-center justify-center shrink-0 text-xs">
                ✓
              </div>
              <span>Only recommend skills that genuinely match the candidate's experience.</span>
            </div>

          </div>

          {/* RIGHT COLUMN: LARGE LAYERED PRODUCT PREVIEW VISUAL (540–600px wide × 450–520px tall) */}
          <div className="lg:col-span-6 w-full flex items-center justify-center lg:justify-end">
            
            <div 
              style={{
                transform: isVisible 
                  ? `translateY(${parallaxY}px) scale(1)` 
                  : 'translateY(50px) scale(0.92)',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1), transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative w-full max-w-[580px] min-h-[460px] lg:h-[500px] flex items-center justify-center"
            >
              
              {/* Layer 1: Background Offset Soft Card Backing */}
              <div className="absolute top-2 right-[-8px] left-8 bottom-[-10px] bg-gradient-to-br from-[#E2ECF7] to-[#EBE9FB] rounded-[24px] border border-[#DCE4F2] shadow-[0_15px_40px_rgba(20,40,35,0.06)] pointer-events-none z-0"></div>

              {/* Layer 2: Floating Mini Score Widget (Left) */}
              <div 
                style={{
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(25px) scale(0.9)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1) 300ms',
                }}
                className="absolute -top-4 left-0 z-20 w-[140px] bg-white rounded-[16px] border border-[#E4E8E6] p-4 shadow-[0_12px_30px_rgba(30,50,45,0.09)] space-y-2 text-center"
              >
                <span className="text-[10px] font-bold text-[#697572] uppercase tracking-wider block">Your Score</span>
                <div className="text-xl font-extrabold text-[#273330]">
                  <span className="text-[#16B889]">80</span>/100
                </div>
                <span className="text-[10px] text-[#8B9693] block">13 Issues</span>
                <div className="space-y-1 pt-1 border-t border-[#F0F3F1] text-[8.5px] text-left">
                  <div className="flex justify-between text-[#273330]">
                    <span>CONTENT</span>
                    <span className="text-[#16B889] font-bold">75%</span>
                  </div>
                  <div className="flex justify-between text-[#273330]">
                    <span>TAILORING</span>
                    <span className="text-[#16B889] font-bold">88%</span>
                  </div>
                </div>
              </div>

              {/* Layer 3: Main Product Card (Right) */}
              <div 
                style={{
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(25px) scale(0.9)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1) 450ms',
                }}
                className="relative z-10 w-full max-w-[480px] ml-auto bg-white rounded-[22px] border border-[#E4E8E6] p-6 sm:p-7 shadow-[0_25px_60px_rgba(30,50,45,0.09)] space-y-4"
              >
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0F3F1] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#16B889] text-white flex items-center justify-center text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[13.5px] text-[#273330]">RESUME TAILORING</span>
                  </div>
                  <span className="text-[11px] text-[#16B889] font-semibold bg-[#DDF5EC] px-2 py-0.5 rounded">
                    Match Analysis
                  </span>
                </div>

                {/* Job Title Bar */}
                <div className="p-2.5 bg-[#F8FAF9] rounded-[8px] border border-[#E9ECE9] text-[11.5px] text-[#55625F] flex items-center justify-between">
                  <span>Target: <strong className="text-[#273330]">Senior Product Manager</strong></span>
                  <span className="text-[10px] text-[#16B889] font-bold">88% Match</span>
                </div>

                {/* Hard Skills Box */}
                <div className="p-4 bg-[#FAFBFA] rounded-[12px] border border-[#E6ECE8] space-y-3">
                  <div className="flex items-center justify-between text-[11.5px] font-bold text-[#273330]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-3 bg-[#16B889] rounded-full inline-block"></span>
                      HARD SKILLS
                    </span>
                    <span className="text-[10.5px] text-[#16B889] font-bold">All Required Present</span>
                  </div>

                  <p className="text-[11.5px] text-[#55625F] leading-tight">
                    You have all the <strong className="text-[#273330]">hard skills</strong> that the job requires in your resume:
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white text-[#16B889] border border-[#BDEBDC] px-2.5 py-1 rounded-md shadow-2xs">
                      <Check className="w-3 h-3" /> SEO Strategy
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white text-[#16B889] border border-[#BDEBDC] px-2.5 py-1 rounded-md shadow-2xs">
                      <Check className="w-3 h-3" /> Google Analytics
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white text-[#16B889] border border-[#BDEBDC] px-2.5 py-1 rounded-md shadow-2xs">
                      <Check className="w-3 h-3" /> SEMRush
                    </span>
                  </div>
                </div>

                {/* Bottom Action Notice */}
                <div className="p-2.5 bg-[#EEF2FA] rounded-[8px] text-[11px] text-[#4A5D78] flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5B5BD6]" />
                    Job-winning role alignment verified
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
