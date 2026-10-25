import React from 'react';
import { ArrowUpRight, Target, Info } from 'lucide-react';
import { MOCK_JOBS } from '../data/mockJobs';

export const JobRecommendationSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-[#E2E8E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#168F70] bg-[#DDF6EC] px-3 py-1 rounded-md border border-[#35C99A]/30 font-mono">
            JOB MATCHING SIMULATOR PREVIEW
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#293133] tracking-tight">
            How HireLens audits alignment with job requirements
          </h2>

          <p className="text-sm text-[#5F6868] leading-relaxed">
            Instead of giving arbitrary scores, HireLens extracts requirements from actual job descriptions and maps them directly against verified textual evidence in your resume.
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs text-[#5F6868] bg-[#F7F9F8] border border-[#E2E8E5] px-3 py-1.5 rounded-lg mt-2">
            <Info className="w-3.5 h-3.5 text-[#168F70]" />
            <span>Below are sample specifications used for testing and demonstration purposes.</span>
          </div>
        </div>

        {/* 3 Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_JOBS.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="bg-[#F7F8F6] rounded-2xl border border-[#E2E8E5] hover:border-[#35C99A] p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#5F6868] uppercase font-mono block">
                      Sample Benchmark · {job.company}
                    </span>
                    <h3 className="font-bold text-base text-[#293133] mt-0.5">
                      {job.title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-bold bg-[#EAF8F3] text-[#168F70] border border-[#BDEBDC] px-2.5 py-1 rounded-lg shrink-0">
                    Sample Spec
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#5F6868] mb-4 font-mono">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span className="font-medium text-[#293133]">Industry Benchmark</span>
                </div>

                {/* Matched Skills */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[10px] font-bold text-[#5F6868] uppercase block font-mono">Core Requirements</span>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 4).map((sk, i) => (
                      <span key={i} className="text-[11px] font-mono font-semibold bg-white text-[#16A34A] border border-emerald-200 px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skill Gap */}
                {job.preferredSkills.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#5F6868] uppercase block font-mono">Preferred Qualifications</span>
                    <div className="flex flex-wrap gap-1">
                      {job.preferredSkills.slice(0, 2).map((sk, i) => (
                        <span key={i} className="text-[11px] font-mono font-semibold bg-white text-[#D97706] border border-amber-200 px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E2E8E5] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#5F6868]">{job.type}</span>
                <span className="text-xs font-bold text-[#168F70] flex items-center gap-1 font-mono">
                  Demonstration Specification
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
