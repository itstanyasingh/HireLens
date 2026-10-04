import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MOCK_JOBS } from '../data/mockJobs';

export const JobRecommendationSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-[#E2E8E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#168F70] bg-[#DDF6EC] px-3 py-1 rounded-md border border-[#35C99A]/30 font-mono">
            HIRELENS OPPORTUNITIES
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#293133] tracking-tight">
            Your resume shouldn't stop at a score.
          </h2>

          <p className="text-sm text-[#5F6868] leading-relaxed">
            Discover roles where your verified skills and qualifications hold high interview callback probability.
          </p>
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
                      {job.company}
                    </span>
                    <h3 className="font-bold text-base text-[#293133] mt-0.5">
                      {job.title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-extrabold bg-[#DDF6EC] text-[#168F70] border border-[#35C99A]/40 px-2.5 py-1 rounded-lg shrink-0">
                    92% Match
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#5F6868] mb-4 font-mono">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span className="font-bold text-[#293133]">{job.salary}</span>
                </div>

                {/* Matched Skills */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[10px] font-bold text-[#5F6868] uppercase block font-mono">Matched Skills</span>
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
                    <span className="text-[10px] font-bold text-[#5F6868] uppercase block font-mono">Skill Gap</span>
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
                <button className="text-xs font-bold text-[#168F70] hover:underline flex items-center gap-1">
                  View Opportunity <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
