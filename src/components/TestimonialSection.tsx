import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Scale, Target, Sparkles, FileText } from 'lucide-react';

export const TestimonialSection: React.FC = () => {
  return (
    <section className="relative py-20 lg:py-24 bg-[#F8FAF9] border-t border-[#EEF2F0] overflow-hidden">
      
      {/* Large Soft Organic Background Shape */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[85%] max-w-[1000px] h-[480px] rounded-[140px] rotate-[-4deg] bg-gradient-to-tr from-[#BFE8D9]/70 via-[#D8E8F5]/65 via-[#E7DDF5]/60 to-[#F4E2D5]/70 blur-[90px] opacity-75"></div>
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-8 space-y-10">
        
        {/* Upper-Left Heading (Left-Aligned) */}
        <div className="max-w-[620px] space-y-2">
          <span className="text-[12px] font-bold uppercase tracking-[2px] text-[#16B889] font-mono block">
            DATA INTEGRITY & ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#293330] tracking-tight leading-[1.15] font-sans">
            Built on 100% Real-Data Accuracy & Explainability
          </h2>
          <p className="text-[15.5px] text-[#55625F] leading-relaxed pt-1">
            HireLens rejects fabricated metrics, simulated market claims, and invented qualifications. Every evaluation is grounded in verifiable evidence.
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
          
          {/* LEFT COLUMN (4 Cols) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Card 1: Zero Hallucinated Credentials */}
            <div className="bg-white rounded-[14px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8F3] text-[#16B889] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <h3 className="text-[16px] font-bold text-[#293330] font-sans">
                Zero Invented Qualifications
              </h3>

              <p className="text-[14px] text-[#55625F] leading-[1.6] font-sans">
                We never inject fabricated numbers, made-up certifications, or imagined achievements into your resume. Every suggestion is explicitly mapped to your submitted text.
              </p>

              <div className="text-[12px] font-mono font-bold text-[#16B889] pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Factual Grounding
              </div>
            </div>

            {/* Card 2: Transparent Scoring Formulas */}
            <div className="bg-white rounded-[14px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8F3] text-[#16B889] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>

              <h3 className="text-[16px] font-bold text-[#293330] font-sans">
                Transparent Mathematical Scoring
              </h3>

              <p className="text-[14px] text-[#55625F] leading-[1.6] font-sans">
                No mystery scores or random dice rolls. Every point reflects verified formulas: ATS (30%), Content (25%), Skills (20%), and Recruiter Readability (25%).
              </p>

              <div className="text-[12px] font-mono font-bold text-[#16B889] pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Explainable Architecture
              </div>
            </div>

          </div>

          {/* CENTER COLUMN (4 Cols) */}
          <div className="md:col-span-4 space-y-6 md:-mt-8">
            
            {/* Center Core Guarantee Card */}
            <div className="bg-white/95 backdrop-blur-xs rounded-[16px] border border-[#BDEBDC] p-6 shadow-[0_8px_24px_rgba(22,184,137,0.14)] space-y-3 hover:-translate-y-[3px] transition-all duration-200">
              <div className="inline-flex items-center gap-2 bg-[#DDF5EC] text-[#129A72] border border-[#BDEBDC] px-3 py-1 rounded-full text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#16B889]" />
                <span>100% REAL DATA GUARANTEE</span>
              </div>

              <h3 className="text-[18px] font-bold text-[#293330] leading-[1.3] font-sans">
                Evidence-Based Resume Analysis & Gap Auditing
              </h3>

              <p className="text-[14px] text-[#55625F] leading-[1.6] font-sans">
                Every requirement match, keyword overlap, and identified skill gap is derived strictly from candidate text and target job specifications.
              </p>

              <div className="pt-2 border-t border-[#EEF2F0] flex items-center justify-between text-xs text-[#55625F] font-mono">
                <span>Deterministic Rules</span>
                <span className="font-bold text-[#16B889]">Auditable</span>
              </div>
            </div>

            {/* Center Card 2: Deterministic Local Processing */}
            <div className="bg-white rounded-[14px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8F3] text-[#16B889] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>

              <h3 className="text-[16px] font-bold text-[#293330] font-sans">
                Reproducible Local Evaluation
              </h3>

              <p className="text-[14px] text-[#55625F] leading-[1.6] font-sans">
                HireLens uses structured 200+ skill taxonomies and document grammar engines to guarantee stable, consistent evaluations without arbitrary scoring swings.
              </p>

              <div className="text-[12px] font-mono font-bold text-[#16B889] pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Consistent & Reliable
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (4 Cols) */}
          <div className="md:col-span-4 space-y-6 md:pt-4">
            
            {/* Card 5: Real-World Requirements Only */}
            <div className="bg-white rounded-[14px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8F3] text-[#16B889] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>

              <h3 className="text-[16px] font-bold text-[#293330] font-sans">
                User-Supplied Job Matching
              </h3>

              <p className="text-[14px] text-[#55625F] leading-[1.6] font-sans">
                We never display fabricated jobs or fake company openings. Match scores are only calculated against actual job descriptions you supply.
              </p>

              <div className="text-[12px] font-mono font-bold text-[#16B889] pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> No Fake Vacancies
              </div>
            </div>

            {/* Card 6: Privacy by Design */}
            <div className="bg-white rounded-[14px] border border-[#EEF2F0] p-6 shadow-[0_5px_18px_rgba(20,35,30,0.08)] space-y-3 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(20,35,30,0.12)] transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8F3] text-[#16B889] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>

              <h3 className="text-[16px] font-bold text-[#293330] font-sans">
                Client Privacy & Control
              </h3>

              <p className="text-[14px] text-[#55625F] leading-[1.6] font-sans">
                Your resume text stays strictly within your active workspace. Candidate documents are never sold, syndicated, or used for third-party commercial training.
              </p>

              <div className="text-[12px] font-mono font-bold text-[#16B889] pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fully Confidential
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
