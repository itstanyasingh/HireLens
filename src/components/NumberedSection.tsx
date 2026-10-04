import React from 'react';

export const NumberedSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#FFFFFF] border-t border-[#E8ECEA]">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8 space-y-24 lg:space-y-32">
        
        {/* ITEM 01 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-1">
            <div className="w-[46px] h-[46px] rounded-full bg-[#DDF5EC] flex items-center justify-center font-bold text-base text-[#16B889]">
              1
            </div>
          </div>

          <div className="lg:col-span-11 space-y-3 max-w-[760px]">
            <h3 className="text-2xl sm:text-[30px] font-bold text-[#293330] tracking-tight leading-snug">
              How much of your resume can an ATS understand?
            </h3>

            <p className="text-[16px] text-[#61706B] leading-[1.6]">
              HireLens checks whether your resume uses recognizable sections, readable formatting, consistent dates and ATS-friendly structure.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[13px] font-semibold text-[#293330]">
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> File format</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Contact extraction</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Section detection</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Link validation</span>
            </div>
          </div>
        </div>

        {/* ITEM 02 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start border-t border-[#E8ECEA]/60 pt-20 lg:pt-24">
          <div className="lg:col-span-1">
            <div className="w-[46px] h-[46px] rounded-full bg-[#DDF5EC] flex items-center justify-center font-bold text-base text-[#16B889]">
              2
            </div>
          </div>

          <div className="lg:col-span-11 space-y-3 max-w-[760px]">
            <h3 className="text-2xl sm:text-[30px] font-bold text-[#293330] tracking-tight leading-snug">
              What does HireLens identify?
            </h3>

            <p className="text-[16px] text-[#61706B] leading-[1.6]">
              HireLens flags passive statements, weak action verbs, missing metrics, and repetitive phrasing that can weaken your resume.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[13px] font-semibold text-[#293330]">
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Weak verbs</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Missing metrics</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Passive voice</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Repetition</span>
            </div>
          </div>
        </div>

        {/* ITEM 03 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start border-t border-[#E8ECEA]/60 pt-20 lg:pt-24">
          <div className="lg:col-span-1">
            <div className="w-[46px] h-[46px] rounded-full bg-[#DDF5EC] flex items-center justify-center font-bold text-base text-[#16B889]">
              3
            </div>
          </div>

          <div className="lg:col-span-11 space-y-3 max-w-[760px]">
            <h3 className="text-2xl sm:text-[30px] font-bold text-[#293330] tracking-tight leading-snug">
              How well does your resume fit the role?
            </h3>

            <p className="text-[16px] text-[#61706B] leading-[1.6]">
              Compare your resume against a target role to identify relevant technical keywords and high-priority skill gaps.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[13px] font-semibold text-[#293330]">
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Keyword overlap</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Skill gap alerts</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Role compatibility</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16B889] font-bold">✓</span> Semantic fit</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
