import React from 'react';
import { FileCheck, Layers, FileText, Wrench, Hash, Eye, ShieldAlert, Target, Sparkles, ChevronRight } from 'lucide-react';

interface ReportSidebarProps {
  score: number;
  atsScore: number;
  contentScore: number;
  skillsScore: number;
  recruiterScore: number;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  fileName: string;
}

export const ReportSidebar: React.FC<ReportSidebarProps> = ({
  score,
  atsScore,
  contentScore,
  skillsScore,
  recruiterScore,
  activeSection,
  onNavigateSection,
  fileName,
}) => {
  const navItems = [
    { id: 'sec-overview', label: 'Overall Score & Summary', icon: Sparkles },
    { id: 'sec-ats', label: 'ATS Essentials', icon: FileCheck },
    { id: 'sec-structure', label: 'Resume Structure', icon: Layers },
    { id: 'sec-content', label: 'Content Quality', icon: FileText },
    { id: 'sec-skills', label: 'Skills & Stack', icon: Wrench },
    { id: 'sec-keywords', label: 'Keywords & Job Match', icon: Hash },
    { id: 'sec-recruiter', label: 'Recruiter Perspective', icon: Eye },
    { id: 'sec-actionplan', label: 'Your Action Plan', icon: ShieldAlert },
    { id: 'sec-jobmatches', label: 'Matched Jobs & Gaps', icon: Target },
  ];

  let scoreBadge = 'Good';
  let badgeClass = 'bg-[#DDF6EC] text-[#168F70] border-[#35C99A]/40';
  if (score >= 88) {
    scoreBadge = 'Exceptional';
    badgeClass = 'bg-emerald-50 text-[#16A34A] border-emerald-300';
  } else if (score < 65) {
    scoreBadge = 'Needs Work';
    badgeClass = 'bg-rose-50 text-[#DC2626] border-rose-300';
  }

  return (
    <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-20 space-y-5 no-print">
      
      {/* Score Summary Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8E5] shadow-xs p-5">
        
        <div className="text-center pb-4 border-b border-[#E2E8E5]">
          <span className="text-[10px] font-bold text-[#8B9494] uppercase tracking-wider block mb-1 font-mono">
            SCORE SUMMARY
          </span>

          <div className="inline-flex items-baseline gap-1 my-1">
            <span className="text-4xl font-extrabold text-[#293133] font-mono tracking-tight">
              {score}
            </span>
            <span className="text-sm font-bold text-[#8B9494] font-mono">/100</span>
          </div>

          <div>
            <span className={`inline-block text-xs font-bold px-3 py-0.5 rounded-full border ${badgeClass}`}>
              {scoreBadge} Resume
            </span>
          </div>

          <p className="text-[11px] text-[#5F6868] truncate mt-2 font-mono">
            File: {fileName}
          </p>
        </div>

        {/* Pillar Scores Grid */}
        <div className="grid grid-cols-2 gap-2 pt-4 text-xs font-mono">
          <div className="bg-[#F7F8F6] p-2.5 rounded-xl border border-[#E2E8E5]">
            <div className="text-[10px] text-[#8B9494] font-sans uppercase font-bold">ATS Score</div>
            <div className="text-sm font-bold text-[#293133]">{atsScore}%</div>
          </div>
          <div className="bg-[#F7F8F6] p-2.5 rounded-xl border border-[#E2E8E5]">
            <div className="text-[10px] text-[#8B9494] font-sans uppercase font-bold">Content</div>
            <div className="text-sm font-bold text-[#293133]">{contentScore}%</div>
          </div>
          <div className="bg-[#F7F8F6] p-2.5 rounded-xl border border-[#E2E8E5]">
            <div className="text-[10px] text-[#8B9494] font-sans uppercase font-bold">Skills</div>
            <div className="text-sm font-bold text-[#293133]">{skillsScore}%</div>
          </div>
          <div className="bg-[#F7F8F6] p-2.5 rounded-xl border border-[#E2E8E5]">
            <div className="text-[10px] text-[#8B9494] font-sans uppercase font-bold">Recruiter</div>
            <div className="text-sm font-bold text-[#293133]">{recruiterScore}%</div>
          </div>
        </div>

      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-2xl border border-[#E2E8E5] shadow-xs p-4">
        <div className="text-xs font-bold text-[#8B9494] uppercase tracking-wider px-3 mb-2 font-mono">
          Report Navigation
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigateSection(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-[#35C99A] text-[#101716] shadow-2xs font-bold'
                    : 'text-[#5F6868] hover:text-[#293133] hover:bg-[#F7F8F6]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#101716]' : 'text-[#8B9494]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#101716]' : 'text-[#8B9494]'}`} />
              </button>
            );
          })}
        </nav>
      </div>

    </aside>
  );
};
