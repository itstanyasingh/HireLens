import React, { useState, useEffect, useRef } from 'react';
import { Eye, CheckCircle2, TrendingUp, Award } from 'lucide-react';

export const RecruiterSection: React.FC = () => {
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
      id="sec-recruiter"
      ref={sectionRef} 
      className="relative w-full bg-[#FFFFFF] border-t border-[#EEF2F0] py-[100px] lg:py-[120px] min-h-[700px] lg:min-h-[760px] flex items-center overflow-hidden"
    >
      
      {/* Soft atmospheric ambient glow */}
      <div 
        className="absolute top-[20%] left-[5%] w-[600px] h-[500px] rounded-full blur-[140px] opacity-50 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #C8EFE5 0%, #DCE8F8 50%, transparent 75%)' }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 w-full">
        
        {/* Genuine 50/50 Alternating Grid: LARGE VISUAL ON LEFT, TEXT ON RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] items-center">
          
          {/* LEFT COLUMN: LARGE LAYERED PRODUCT PREVIEW VISUAL (540–600px wide × 450–520px tall) */}
          <div className="lg:col-span-6 w-full flex items-center justify-center lg:justify-start">
            
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
              <div className="absolute top-2 left-[-8px] right-8 bottom-[-10px] bg-gradient-to-br from-[#E2F5EE] to-[#E9F0F8] rounded-[24px] border border-[#DCEBE4] shadow-[0_15px_40px_rgba(20,40,35,0.06)] pointer-events-none z-0"></div>

              {/* Layer 2: Main Hiring Manager Review Card */}
              <div 
                style={{
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(25px) scale(0.9)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1) 350ms',
                }}
                className="relative z-10 w-full max-w-[500px] bg-white rounded-[22px] border border-[#E4E8E6] p-6 sm:p-7 shadow-[0_25px_60px_rgba(30,50,45,0.09)] space-y-4"
              >
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0F3F1] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#16B889] text-white flex items-center justify-center text-xs">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[13.5px] text-[#273330]">HUMAN SCREENING AUDIT</span>
                  </div>
                  <span className="text-[11px] text-[#16B889] font-bold bg-[#DDF5EC] px-2.5 py-0.5 rounded-full">
                    94% Ready
                  </span>
                </div>

                {/* Evidence & Signal Box 1: Project Credibility */}
                <div className="p-3.5 bg-[#FAFBFA] rounded-[12px] border border-[#E6ECE8] space-y-2">
                  <div className="flex items-center justify-between text-[11.5px] font-bold text-[#273330]">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#16B889]" />
                      Project Credibility & Evidence
                    </span>
                    <span className="text-[10px] text-[#16B889] font-bold bg-[#DDF5EC] px-1.5 py-0.2 rounded">Strong</span>
                  </div>
                  <div className="space-y-1.5 text-[11.5px] text-[#55625F]">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16B889] shrink-0 mt-0.5" />
                      <span>Quantified measurable impact across all senior roles ($1.4M saved, 42% faster sprint cycles)</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16B889] shrink-0 mt-0.5" />
                      <span>Clear leadership scope and cross-functional team ownership</span>
                    </div>
                  </div>
                </div>

                {/* Evidence & Signal Box 2: Career Velocity */}
                <div className="p-3.5 bg-[#FAFBFA] rounded-[12px] border border-[#E6ECE8] space-y-2">
                  <div className="flex items-center justify-between text-[11.5px] font-bold text-[#273330]">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#16B889]" />
                      Career Progression & Clarity
                    </span>
                    <span className="text-[10px] text-[#16B889] font-bold bg-[#DDF5EC] px-1.5 py-0.2 rounded">Verified</span>
                  </div>
                  <div className="space-y-1.5 text-[11.5px] text-[#55625F]">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16B889] shrink-0 mt-0.5" />
                      <span>Consistent chronology with zero unexplained gaps or ambiguous dates</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="p-2.5 bg-[#F4F9F7] rounded-[8px] text-[11px] text-[#1E5E4E] flex items-center justify-between font-medium">
                  <span>Recruiter-ready signals validated for human review</span>
                  <span className="font-mono text-[10px] text-[#16B889] font-bold">✓ Ready</span>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: EDITORIAL TEXT (max-width 560px) */}
          <div className="lg:col-span-6 w-full space-y-7 max-w-[560px] lg:ml-auto">
            
            {/* 1. Small Label */}
            <div
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 100ms',
              }}
            >
              <span className="text-[12.5px] font-bold uppercase tracking-[2px] text-[#16B889] font-sans block">
                HUMAN SCREENING
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
                Pass the hiring manager check
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
                Once your resume passes automated screening, HireLens helps you review signals that matter to a human reviewer.
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
                Analyze project evidence, measurable impact, career progression, clarity and role relevance before submitting.
              </p>
            </div>

            {/* 5. Paragraph 3 */}
            <div
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 580ms',
              }}
            >
              <p className="text-[18px] sm:text-[19px] text-[#55625F] leading-[1.7]">
                HireLens provides actionable suggestions grounded in your actual work experience rather than simply assigning a score.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
