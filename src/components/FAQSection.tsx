import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is HireLens?',
      a: 'HireLens is an AI-powered resume intelligence platform that checks your resume against ATS compliance, content quality, technical skills, keywords, and recruiter signals to give you actionable line-by-line improvements.'
    },
    {
      q: 'How does the resume score work?',
      a: 'Your overall score (0–100) evaluates ATS parseability, content quality, recruiter readability signals, and job keyword alignment.'
    },
    {
      q: 'What does the ATS check analyze?',
      a: 'The ATS check verifies document file extension (PDF/DOCX), contact block email and phone formatting, section headings, timeline date consistency, and overall text parseability.'
    },
    {
      q: 'Can I compare my resume with a specific job description?',
      a: 'Yes. By pasting a target job description, HireLens evaluates your skill overlap, identifies missing technical keywords, calculates role match percentage, and recommends high-value skill gaps.'
    },
    {
      q: 'How does HireLens protect my resume data?',
      a: 'All uploaded resume documents are processed securely with strict privacy standards and are never sold, shared with 3rd parties, or used for public AI training.'
    }
  ];

  return (
    <section id="sec-faq" className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8ECEA]">
      <div className="max-w-[1060px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT: Heading */}
          <div className="lg:col-span-5 space-y-3">
            <span className="block text-[11px] font-bold uppercase tracking-[1.5px] text-[#159A78] font-sans">
              FAQ
            </span>

            <h2 className="text-3xl sm:text-[36px] font-bold text-[#263333] tracking-tight leading-[1.15] font-sans">
              Frequently asked questions
            </h2>

            <p className="text-[15px] sm:text-[16px] text-[#5D6865] leading-relaxed font-sans pt-1">
              Have questions about how HireLens evaluates your resume or compares skills against job descriptions?
            </p>
          </div>

          {/* RIGHT: Accordion List */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className="border border-[#E4E9E6] bg-[#F8FAF9] rounded-[8px] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold text-[15px] text-[#263333] hover:bg-white transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#159A78] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#5D6865] shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-[14px] text-[#5D6865] leading-relaxed bg-white border-t border-[#E4E9E6] pt-3 font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
