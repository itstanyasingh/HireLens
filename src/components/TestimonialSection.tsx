import React from 'react';
import { Star, ExternalLink } from 'lucide-react';

export const TestimonialSection: React.FC = () => {
  return (
    <section className="relative py-20 lg:py-24 bg-[#F8FAF9] border-t border-[#EEF2F0] overflow-hidden">
      
      {/* Large Soft Organic Background Shape */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[85%] max-w-[1000px] h-[480px] rounded-[140px] rotate-[-4deg] bg-gradient-to-tr from-[#BFE8D9]/70 via-[#D8E8F5]/65 via-[#E7DDF5]/60 to-[#F4E2D5]/70 blur-[90px] opacity-75"></div>
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-8 space-y-10">
        
        {/* Upper-Left Heading (Left-Aligned) */}
        <div className="max-w-[520px]">
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#293330] tracking-tight leading-[1.15] font-sans">
            Trusted by people building their next opportunity
          </h2>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
          
          {/* LEFT COLUMN (4 Cols) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Card 1: Aditi */}
            <div className="bg-white rounded-[5px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-[20px] h-[20px] rounded-[3px] bg-[#35B98B] flex items-center justify-center text-white">
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                ))}
              </div>

              <div className="text-[13px] text-[#68746F] font-sans">2 days ago</div>

              <p className="text-[15px] text-[#293330] leading-[1.5] font-sans">
                The precise AI guided suggestions and ATS keyword templates are easy to edit and update quickly. Really user friendly.
              </p>

              <div className="text-[13px] font-semibold text-[#293330] font-sans pt-1">
                — Aditi
              </div>
            </div>

            {/* Card 4: Meera */}
            <div className="bg-white rounded-[5px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-[20px] h-[20px] rounded-[3px] bg-[#35B98B] flex items-center justify-center text-white">
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                ))}
              </div>

              <div className="text-[13px] text-[#68746F] font-sans">2 days ago</div>

              <p className="text-[15px] text-[#293330] leading-[1.5] font-sans">
                Great tool for resume building. Clean, simple and actually helpful. Definitely recommended.
              </p>

              <div className="text-[13px] font-semibold text-[#293330] font-sans pt-1">
                — Meera
              </div>
            </div>

          </div>

          {/* CENTER COLUMN (4 Cols) */}
          <div className="md:col-span-4 space-y-6 md:-mt-8">
            
            {/* Center Stat Card */}
            <div className="bg-white/95 backdrop-blur-xs rounded-[5px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-2 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-[20px] h-[20px] rounded-[3px] bg-[#35B98B] flex items-center justify-center text-white">
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                  ))}
                </div>
                <span className="text-[14px] font-bold text-[#293330] font-sans">4.8 Rating</span>
              </div>

              <p className="text-[17px] font-bold text-[#293330] leading-[1.35] font-sans pt-1">
                2,400+ candidates have used HireLens to improve their resumes.
              </p>
            </div>

            {/* Center Testimonial Card (Rohan) */}
            <div className="bg-white rounded-[5px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-[20px] h-[20px] rounded-[3px] bg-[#35B98B] flex items-center justify-center text-white">
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                ))}
              </div>

              <div className="text-[13px] text-[#68746F] font-sans">3 days ago</div>

              <p className="text-[15px] text-[#293330] leading-[1.5] font-sans">
                HireLens makes it easy to create and maintain your CV, as well as adapting it for different jobs. It also allows you to keep track of applications and what stage you are in the process.
              </p>

              <div className="text-[13px] font-semibold text-[#293330] font-sans pt-1">
                — Rohan
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (4 Cols) */}
          <div className="md:col-span-4 space-y-6 md:pt-4">
            
            {/* Card 5: Arjun */}
            <div className="bg-white rounded-[5px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-[20px] h-[20px] rounded-[3px] bg-[#35B98B] flex items-center justify-center text-white">
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                ))}
              </div>

              <div className="text-[13px] text-[#68746F] font-sans">3 days ago</div>

              <p className="text-[15px] text-[#293330] leading-[1.5] font-sans">
                It is a fast application which automates the tedious parts of tailoring my CV.
              </p>

              <div className="text-[13px] font-semibold text-[#293330] font-sans pt-1">
                — Arjun
              </div>
            </div>

            {/* Card 2: Jacques */}
            <div className="bg-white rounded-[5px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-[20px] h-[20px] rounded-[3px] bg-[#35B98B] flex items-center justify-center text-white">
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                ))}
              </div>

              <div className="text-[13px] text-[#68746F] font-sans">4 days ago</div>

              <p className="text-[15px] text-[#293330] leading-[1.5] font-sans">
                The line-by-line suggestions were the most useful part. I could immediately understand what to improve before applying.
              </p>

              <div className="text-[13px] font-semibold text-[#293330] font-sans pt-1">
                — Jacques
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM CENTER REVIEWS LINK CARD */}
        <div className="pt-4 flex justify-center">
          <div className="bg-white/95 backdrop-blur-xs rounded-[5px] border border-[#EEF2F0] px-8 py-4 text-center shadow-[0_4px_14px_rgba(20,35,30,0.06)] hover:-translate-y-[2px] transition-all">
            <span className="text-[13px] text-[#68746F] font-sans block mb-1">
              Read reviews or leave yours at:
            </span>
            <a
              href="#sec-upload"
              className="text-[14px] font-bold text-[#27B889] hover:underline inline-flex items-center gap-1 font-sans"
            >
              Reviews.io <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
