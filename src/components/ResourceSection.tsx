import React, { useState } from 'react';
import { ArticleModal, ArticleData } from './ArticleModal';

export const ResourceSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  const articles: ArticleData[] = [
    {
      category: 'ATS GUIDE',
      title: 'How ATS Resume Screening Actually Works',
      readTime: '5 MIN READ',
      summary: 'Applicant Tracking Systems parse raw resume text into structured candidate records, ranking candidates based on keyword frequency, title seniority, and section clarity.',
      sections: [
        {
          heading: '1. What automated parsers actually look for',
          body: 'Most modern ATS platforms (such as Greenhouse, Lever, Workday, and Taleo) extract your contact details, employment history, and technical competencies into a single structured profile. Unconventional column formatting, tables, or non-standard fonts can scramble text blocks.',
          tips: [
            'Use standard headings (Experience, Education, Skills, Projects)',
            'Stick to single-column or clean two-column layouts without nested tables',
            'Save files as PDF or clean DOCX with selectable text (not scanned images)',
          ],
        },
        {
          heading: '2. Avoiding the keyword trap',
          body: 'While keyword presence is essential, simple keyword stuffing or hiding white text will cause immediate rejection during human validation. Keywords must naturally connect with verified achievements.',
          tips: [
            'Incorporate hard technical tools directly into role accomplishment bullets',
            'Repeat core competencies 2-3 times across different projects and roles',
          ],
        },
      ],
    },
    {
      category: 'RESUME STRATEGY',
      title: 'Resume Keywords That Actually Matter',
      readTime: '4 MIN READ',
      summary: 'Distinguish between high-value hard technical keywords, domain frameworks, and generic buzzwords that provide zero ATS scoring value.',
      sections: [
        {
          heading: '1. High-impact vs low-impact vocabulary',
          body: 'Hiring managers filter for verified technologies, architectural paradigms, and quantifiable tools (e.g. TypeScript, Docker, PostgreSQL, REST APIs, Microservices) rather than subjective traits like "hard worker" or "fast learner".',
          tips: [
            'Prioritize toolnames, programming languages, and industry standards',
            'Back every technical keyword with an evidence bullet describing real usage',
          ],
        },
      ],
    },
    {
      category: 'RESUME ADVICE',
      title: 'How to Build an ATS-Friendly Resume in 2026',
      readTime: '6 MIN READ',
      summary: 'A step-by-step checklist to optimize your resume layout, typography, section order, and document metadata for 2026 recruitment pipelines.',
      sections: [
        {
          heading: '1. Document formatting standards',
          body: 'Use standard fonts (Inter, Arial, Helvetica, Calibri) with font sizes between 10pt and 12pt for body copy and 14pt to 18pt for section titles. Ensure line margins remain between 0.5 and 0.75 inches.',
          tips: [
            'Avoid placing critical contact details in isolated headers/footers',
            'Include LinkedIn profile and GitHub repository URLs cleanly',
          ],
        },
      ],
    },
    {
      category: 'RESUME ADVICE',
      title: '20 Resume Mistakes That Can Cost You an Interview',
      readTime: '7 MIN READ',
      summary: 'From passive bullet points to missing metrics and inconsistent dates, learn the top pitfalls recruiters flag during initial scans.',
      sections: [
        {
          heading: '1. Passive voice and duty-only descriptions',
          body: 'Describing what your team did or stating "Responsible for..." fails to communicate individual ownership. Begin every bullet with a strong executive action verb.',
          tips: [
            'Replace "Assisted with..." with "Engineered...", "Architected...", or "Delivered..."',
            'Quantify outcomes with percentages, cost savings, user counts, or latency reductions',
          ],
        },
      ],
    },
    {
      category: 'JOB SEARCH',
      title: 'How to Tailor Your Resume to a Job Description',
      readTime: '5 MIN READ',
      summary: 'Learn how to strategically adjust your summary, skills list, and top bullet points to match target job postings in under 10 minutes.',
      sections: [
        {
          heading: '1. The 80/20 tailoring technique',
          body: 'You do not need to rewrite your entire resume for every application. Focus 80% of your customization on the Professional Summary, the Skills list order, and the first 2 bullets under your most recent role.',
          tips: [
            'Extract the top 5 required skills from the job description',
            'Place matching skills in your top visible skills category',
          ],
        },
      ],
    },
    {
      category: 'INTERVIEW PREP',
      title: 'What Recruiters Notice Before the Interview',
      readTime: '4 MIN READ',
      summary: 'Inside the 6-second recruiter screen: what catches attention, what triggers skepticism, and how to present undeniable career progression.',
      sections: [
        {
          heading: '1. Career velocity and title progression',
          body: 'Recruiters look for rapid learning, promotions, expanding project scope, and demonstrable business impact. Ensure your timeline demonstrates continuous growth.',
          tips: [
            'Highlight scope increase (e.g. leading cross-functional teams, managing budgets)',
            'Include clear company descriptions if working for startups or private firms',
          ],
        },
      ],
    },
  ];

  const handleScrollToUpload = () => {
    const el = document.getElementById('sec-upload');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="sec-resources" className="pt-[85px] pb-[90px] bg-[#F5F7F5] border-t border-[#E4E9E6]">
      <div className="max-w-[1060px] mx-auto px-6 sm:px-8">
        
        {/* HEADER */}
        <div className="text-center space-y-2.5">
          <span className="block text-[11px] font-bold uppercase tracking-[1.5px] text-[#16B889] font-sans">
            CAREER RESOURCES
          </span>

          <h2 className="text-3xl sm:text-[36px] font-bold text-[#273330] tracking-tight leading-[1.15] font-sans">
            Learn what actually makes a resume work.
          </h2>

          <p className="text-[15px] sm:text-[16px] font-normal text-[#55625F] leading-relaxed max-w-[850px] mx-auto font-sans pt-1">
            Practical guides on ATS screening, resume keywords, tailoring your application, and what recruiters actually look for.
          </p>
        </div>

        {/* 6-ARTICLE GRID (3 cols × 2 rows) */}
        <div className="mt-[48px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-[34px]">
          {articles.map((art, idx) => (
            <article
              key={idx}
              onClick={() => setSelectedArticle(art)}
              className="group relative bg-[#FFFFFF] rounded-[10px] border border-[#E4E9E6] border-t-2 border-t-[#8BD5BE] p-6 sm:px-7 sm:py-6 h-[172px] flex flex-col justify-between shadow-[0_3px_12px_rgba(25,45,40,0.04)] hover:shadow-[0_10px_25px_rgba(25,45,40,0.08)] hover:-translate-y-[4px] hover:border-[#8BD5BE] transition-all duration-250 cursor-pointer"
            >
              {/* Category (Aligned Upper-Right) */}
              <div className="flex justify-between items-center">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.3px] text-[#16B889] font-sans">
                  {art.category}
                </span>
                <span className="text-[10px] text-[#8E9E9A] font-semibold">
                  {art.readTime}
                </span>
              </div>

              {/* Article Title */}
              <div className="pb-1">
                <h3 className="text-[19px] sm:text-[19.5px] font-semibold text-[#273330] leading-[1.24] font-sans group-hover:text-[#16B889] transition-colors">
                  {art.title}
                </h3>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      <ArticleModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
        onActionClick={handleScrollToUpload}
      />
    </section>
  );
};
