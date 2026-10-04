import React from 'react';

export const SkillGapSection: React.FC = () => {
  const gaps = [
    { name: 'Docker', priority: 'HIGH PRIORITY', occurrence: '68% of matching roles', width: '68%' },
    { name: 'AWS Cloud', priority: 'HIGH PRIORITY', occurrence: '61% of matching roles', width: '61%' },
    { name: 'PostgreSQL', priority: 'MEDIUM PRIORITY', occurrence: '42% of matching roles', width: '42%' },
    { name: 'Redis Caching', priority: 'MEDIUM PRIORITY', occurrence: '34% of matching roles', width: '34%' },
  ];

  return (
    <section className="py-20 bg-[#F7F8F6] border-t border-[#E2E8E5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#168F70] bg-[#DDF6EC] px-3 py-1 rounded-md border border-[#35C99A]/30 font-mono">
            SKILL GAP ANALYSIS
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#293133] tracking-tight">
            Know which skills could unlock more opportunities.
          </h2>

          <p className="text-sm text-[#5F6868] leading-relaxed">
            Your skill gap analysis is based on the requirements of the live roles matching your experience level.
          </p>
        </div>

        {/* Large Skill Gap Panel */}
        <div className="bg-white rounded-2xl border border-[#E2E8E5] shadow-xs p-8 space-y-6">
          {gaps.map((gap, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#293133]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{gap.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    gap.priority.includes('HIGH')
                      ? 'bg-[#FFF0E7] text-[#D97706] border border-orange-200'
                      : 'bg-amber-50 text-[#D97706] border border-amber-200'
                  }`}>
                    {gap.priority}
                  </span>
                </div>

                <span className="text-[#5F6868] font-mono">{gap.occurrence}</span>
              </div>

              {/* Mint Green Thin Progress Bar */}
              <div className="w-full bg-[#F7F8F6] rounded-full h-2.5 border border-[#E2E8E5] overflow-hidden p-0.5">
                <div
                  className="bg-[#35C99A] h-full rounded-full transition-all duration-1000"
                  style={{ width: gap.width }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
