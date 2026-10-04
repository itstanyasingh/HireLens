import React from 'react';

export const ATSSection: React.FC = () => {
  return (
    <div className="max-w-[1120px] mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT VISUAL */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full max-w-[440px] mx-auto min-h-[380px] flex items-center justify-center">
            
            <div className="absolute inset-0 bg-[#16B889]/10 blur-3xl rounded-full pointer-events-none"></div>

            {/* Offset Layers */}
            <div className="absolute top-2 left-6 right-2 h-[330px] bg-white rounded-xl border border-[#E8ECEA] shadow-sm transform rotate-3 opacity-70"></div>
            <div className="absolute top-5 left-2 right-6 h-[330px] bg-white rounded-xl border border-[#E8ECEA] shadow-sm transform -rotate-2 opacity-80"></div>

            {/* Front Document */}
            <div className="relative z-10 w-full bg-white p-5 rounded-xl border border-[#E8ECEA] shadow-lg text-[10px] space-y-2 font-sans">
              <div className="border-b border-[#E8ECEA] pb-1.5">
                <span className="font-bold text-xs text-[#293330] block">JASMINE BELL</span>
                <span className="text-[10px] text-[#16B889] font-medium block">Product Designer</span>
                <span className="text-[9px] text-[#61706B]">jasmine.b@example.com • San Francisco, CA</span>
              </div>

              <div className="space-y-1 text-[9px]">
                <span className="font-bold text-[#293330] uppercase block text-[8.5px]">EXPERIENCE</span>
                <p className="text-[#61706B] leading-tight">Led design system refactor across 12 product modules. Reduced implementation debt by 40%.</p>
                
                <div className="bg-[#F8FAF9] p-1.5 rounded border border-[#E8ECEA] mt-1">
                  <span className="font-bold text-[#16B889] uppercase block font-mono text-[8px]">SKILLS</span>
                  <span className="text-[8px] text-[#16B889] font-mono font-bold">Figma • React • Design Systems</span>
                </div>
              </div>
            </div>

            {/* 3 Floating Labels */}
            <div className="absolute top-0 left-4 z-20 bg-[#DDF5EC] text-[#16B889] border border-[#B9E8D8] px-2.5 py-0.5 rounded text-[10.5px] font-bold shadow-2xs">
              Keywords
            </div>
            <div className="absolute bottom-20 -left-2 z-20 bg-[#FFF0D9] text-[#B87522] border border-[#FFF0D9] px-2.5 py-0.5 rounded text-[10.5px] font-bold shadow-2xs">
              Contact information
            </div>
            <div className="absolute -bottom-1 right-6 z-20 bg-[#E9E7F8] text-[#6357A8] border border-[#E9E7F8] px-2.5 py-0.5 rounded text-[10.5px] font-bold shadow-2xs">
              Skills
            </div>

          </div>
        </div>

        {/* RIGHT TEXT */}
        <div className="lg:col-span-6 space-y-4 max-w-[480px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#16B889] font-sans block">
            ATS AUDIT
          </span>

          <h2 className="text-3xl sm:text-[38px] font-bold text-[#293330] tracking-tight leading-[1.15]">
            Get an ATS understanding check
          </h2>

          <div className="space-y-3 text-[15px] sm:text-[16px] text-[#61706B] leading-[1.65]">
            <p>
              Part of the resume checker score is based on parseability. HireLens evaluates formatting, contact details, dates, links, and keywords.
            </p>
            <p>
              We look for signals of ATS compatibility to ensure your accomplishments are indexed cleanly before a human reviewer sees them.
            </p>
          </div>

          <div className="pt-2">
            <span className="inline-block bg-[#DDF5EC] text-[#16B889] px-3 py-1 rounded text-xs font-semibold">
              Structure • Keywords • Formatting • Contact details
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
