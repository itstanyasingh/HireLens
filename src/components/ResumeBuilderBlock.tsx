import React, { useState, useEffect, useRef } from 'react';
import { Plus, Move, Download, Check, Sparkles, SlidersHorizontal, Layers } from 'lucide-react';

export const ResumeBuilderBlock: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  return (
    <section 
      id="sec-builder"
      ref={sectionRef} 
      className="relative w-full bg-[#FFFFFF] border-t border-[#EEF2F0] py-[100px] lg:py-[120px] min-h-[700px] lg:min-h-[760px] flex items-center overflow-hidden"
    >
      
      {/* Soft atmospheric ambient glow behind the right visual */}
      <div 
        className="absolute top-[15%] right-[5%] w-[680px] h-[580px] rounded-full blur-[140px] opacity-45 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #C8EFE5 0%, #DCE8F8 50%, transparent 75%)' }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 w-full">
        
        {/* Genuine 50/50 Editorial Grid: TEXT ON LEFT, LARGE VISUAL ON RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[80px] items-center">
          
          {/* LEFT COLUMN: EDITORIAL TEXT (max-width 560px) */}
          <div className="lg:col-span-6 w-full space-y-7 max-w-[560px]">
            
            {/* 1. Eyebrow */}
            <div
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 100ms',
              }}
            >
              <span className="text-[12.5px] font-bold uppercase tracking-[2px] text-[#16B889] font-sans block">
                RESUME BUILDER
              </span>
            </div>

            {/* 2. Heading */}
            <div
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 220ms',
              }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#273330] tracking-[-2px] leading-[1.08]">
                Use the best resume builder in the industry
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
                After receiving your checker score, continue editing and improving your job application with HireLens. Quickly add, reorder, or remove sections.
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
                Tailor your resume based on the target job with PDF formatting that applicant tracking systems easily read.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: LARGE ANIMATED PRODUCT PREVIEW COMPOSITION (560–600px wide × 460–520px tall) */}
          <div className="lg:col-span-6 w-full flex items-center justify-center lg:justify-end">
            
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full max-w-[580px] min-h-[480px] lg:h-[520px] flex items-center justify-center cursor-pointer group"
            >
              
              {/* LAYER 1 (BACK): Pastel Lavender/Mint Offset Panel */}
              <div 
                style={{
                  transform: isVisible
                    ? isHovered 
                      ? 'translate(-22px, -22px)' 
                      : 'translate(-18px, -18px)'
                    : 'translate(0px, 20px) scale(0.95)',
                  opacity: isVisible ? 0.75 : 0,
                  transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 150ms',
                }}
                className="absolute inset-0 bg-gradient-to-br from-[#E2F5EE] to-[#E9EAFB] rounded-[24px] border border-[#DCE4F0] shadow-[0_12px_35px_rgba(20,40,35,0.05)] pointer-events-none z-0"
              />

              {/* LAYER 2 (MIDDLE): Secondary Resume Layer */}
              <div 
                style={{
                  transform: isVisible
                    ? isHovered 
                      ? 'translate(-12px, -12px)' 
                      : 'translate(-9px, -9px)'
                    : 'translate(0px, 25px) scale(0.95)',
                  opacity: isVisible ? 0.9 : 0,
                  transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 300ms',
                }}
                className="absolute inset-0 bg-[#F4F9F7] rounded-[22px] border border-[#E2EAE6] shadow-[0_18px_45px_rgba(20,40,35,0.06)] pointer-events-none z-0"
              />

              {/* LAYER 3 (MAIN): Realistic Resume Editor Interface with Infinite Floating Effect */}
              <div 
                style={{
                  transform: isVisible
                    ? isHovered 
                      ? 'translateY(-6px) scale(1.01)' 
                      : 'translateY(0px) scale(1)'
                    : 'translateY(35px) scale(0.96)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1) 450ms',
                }}
                className="relative z-10 w-full bg-white rounded-[20px] border border-[#E2E8E5] p-5 sm:p-6 shadow-[0_25px_60px_rgba(25,45,40,0.10)] space-y-4 animate-[float_6s_ease-in-out_infinite]"
              >
                
                {/* Editor Top Toolbar */}
                <div className="flex items-center justify-between border-b border-[#EEF2F0] pb-3 text-[11.5px]">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#DDF5EC] text-[#16B889] font-bold px-2 py-0.5 rounded text-[10.5px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Template: Clean Modern
                    </span>
                    <span className="text-[#697572] hidden sm:inline">Margins: Normal</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#16B889] font-bold text-[10px] bg-[#EAF8F3] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16B889]"></span> Saved
                    </span>
                    <button className="bg-[#16B889] text-white px-2.5 py-1 rounded text-[10.5px] font-bold flex items-center gap-1 hover:bg-[#129A72] transition-colors">
                      <Download className="w-3 h-3" /> Export PDF
                    </button>
                  </div>
                </div>

                {/* Main Resume Sheet Content */}
                <div className="bg-[#FAFCFA] p-5 rounded-[12px] border border-[#E8EEEB] space-y-3.5 text-[#273330]">
                  
                  {/* Candidate Header */}
                  <div className="border-b border-[#E2E8E5] pb-2.5 flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-[16px] text-[#273330] tracking-tight">ISABELLE TODD</h3>
                      <p className="text-[11.5px] font-semibold text-[#16B889]">Lead Solutions Architect</p>
                    </div>
                    <div className="text-[9.5px] text-[#788582] text-right">
                      <span>isabelle.todd@example.com</span> <br />
                      <span>San Francisco, CA · (555) 342-9102</span>
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#273330] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-[#16B889] rounded-full"></span>
                        EXPERIENCE
                      </span>
                      <span className="text-[9px] text-[#788582] font-normal lowercase">drag to reorder</span>
                    </div>

                    <div className="space-y-1 text-[11.5px] text-[#55625F] leading-snug">
                      <p>• Launched and deployed technology solutions, delivering technical support for enterprise clients.</p>
                      <p>• Architected cloud-native distributed microservices, reducing failover latency by 45%.</p>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-1.5 pt-1 border-t border-[#EEF2F0]">
                    <span className="text-[11px] font-bold text-[#273330] uppercase tracking-wider block">
                      SKILLS
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[10.5px]">
                      <span className="bg-[#DDF5EC] text-[#16B889] font-bold px-2 py-0.5 rounded">Python</span>
                      <span className="bg-[#DDF5EC] text-[#16B889] font-bold px-2 py-0.5 rounded">React</span>
                      <span className="bg-[#DDF5EC] text-[#16B889] font-bold px-2 py-0.5 rounded">SQL</span>
                      <span className="bg-[#DDF5EC] text-[#16B889] font-bold px-2 py-0.5 rounded">AWS</span>
                      <span className="bg-[#DDF5EC] text-[#16B889] font-bold px-2 py-0.5 rounded">Docker</span>
                    </div>
                  </div>

                </div>

                {/* Editor Bottom Micro-Bar Controls */}
                <div className="flex items-center justify-between pt-1 text-[10.5px] text-[#697572]">
                  <div className="flex items-center gap-3 font-medium">
                    <span className="flex items-center gap-1 hover:text-[#16B889] transition-colors cursor-pointer">
                      <Plus className="w-3 h-3 text-[#16B889]" /> Add Section
                    </span>
                    <span className="flex items-center gap-1 hover:text-[#16B889] transition-colors cursor-pointer">
                      <Move className="w-3 h-3" /> Reorder
                    </span>
                    <span className="flex items-center gap-1 hover:text-[#16B889] transition-colors cursor-pointer">
                      <SlidersHorizontal className="w-3 h-3" /> Layout
                    </span>
                  </div>

                  <span className="text-[10px] text-[#16B889] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> ATS Optimization Active
                  </span>
                </div>

              </div>

              {/* Floating Pill Badges */}
              <div 
                style={{
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1) 600ms',
                }}
                className="absolute -bottom-3 left-4 z-20 bg-white text-[#16B889] border border-[#BDEBDC] text-[11px] font-bold px-3 py-1 rounded-full shadow-[0_6px_20px_rgba(22,184,137,0.12)] flex items-center gap-1.5 pointer-events-none"
              >
                <Check className="w-3.5 h-3.5" /> ATS-Friendly PDF Output
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
