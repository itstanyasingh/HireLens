import React from 'react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    { num: '01', title: 'Upload', detail: 'Upload PDF or DOCX resume' },
    { num: '02', title: 'Analyze', detail: 'ATS, structure & content checks' },
    { num: '03', title: 'Understand', detail: 'Score & line-by-line feedback' },
    { num: '04', title: 'Improve', detail: 'Fix weak bullet points & metrics' },
    { num: '05', title: 'Match', detail: 'Compare against target job description' },
    { num: '06', title: 'Apply', detail: 'Submit with high interview confidence' },
  ];

  return (
    <section id="sec-workflow" className="py-20 bg-white border-t border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] font-mono">
            THE PRODUCT JOURNEY
          </span>
          <h2 className="text-3xl font-extrabold text-[#18181B] tracking-tight mt-1">
            End-to-End Career Progression Workflow
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-[#F7F7F5] rounded-2xl border border-[#E4E4E7] p-5 space-y-2 text-center hover:border-indigo-300 transition-all"
            >
              <span className="text-2xl font-extrabold text-[#4F46E5] font-mono block">
                {s.num}
              </span>
              <h3 className="font-bold text-base text-[#18181B]">
                {s.title}
              </h3>
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                {s.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
