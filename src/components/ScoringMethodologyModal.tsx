import React from 'react';
import { X, ShieldCheck, Scale, Cpu, FileText, Award, Eye } from 'lucide-react';
import { AnalysisReport } from '../services/api';

interface ScoringMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: AnalysisReport | null;
}

export const ScoringMethodologyModal: React.FC<ScoringMethodologyModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#071310]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#E2E8E5] shadow-2xl w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 bg-[#0E1B18] text-white flex items-start justify-between border-b border-white/10 shrink-0">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#5AD3AD] font-sans block">
              SCORING METHODOLOGY & ARCHITECTURE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              How HireLens Calculates Your Score
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-[#99A6A2] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#44524E] text-xs leading-relaxed">
          
          {/* Formula Box */}
          <div className="p-4 bg-[#F2FBF7] border border-[#C8EFE2] rounded-2xl space-y-2">
            <span className="font-mono font-bold text-[#16B889] uppercase tracking-wider text-[11px] block">
              DETERMINISTIC WEIGHTED FORMULA
            </span>
            <div className="font-mono text-sm font-extrabold text-[#273330] bg-white p-3 rounded-xl border border-[#C8EFE2] text-center">
              Overall = (ATS × 30%) + (Content × 25%) + (Skills × 20%) + (Recruiter × 25%)
            </div>
            <p className="text-[#55625F] text-[11.5px]">
              Every metric is deterministically extracted from your document's text, structure, action verbs, and skills. Scores are non-random and strictly reflect the document content.
            </p>
          </div>

          {/* 4 Pillar Breakdowns */}
          <div className="space-y-4">
            
            {/* 1. ATS Essentials */}
            <div className="p-4 rounded-xl border border-[#E4E9E6] bg-[#FAFCFA] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#273330] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16B889]" />
                  1. ATS Compatibility (30% Weight)
                </span>
                {report && (
                  <span className="font-mono font-bold text-xs bg-[#DDF5EC] text-[#16B889] px-2 py-0.5 rounded">
                    Score: {report.atsScore}%
                  </span>
                )}
              </div>
              <p className="text-[#55625F]">
                Evaluates file extension compatibility (.pdf, .docx), presence and formatting of contact email and phone number, LinkedIn/GitHub links, and standard parseable section headings.
              </p>
            </div>

            {/* 2. Content Quality */}
            <div className="p-4 rounded-xl border border-[#E4E9E6] bg-[#FAFCFA] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#273330] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#16B889]" />
                  2. Content Quality & Impact (25% Weight)
                </span>
                {report && (
                  <span className="font-mono font-bold text-xs bg-[#DDF5EC] text-[#16B889] px-2 py-0.5 rounded">
                    Score: {report.contentScore}%
                  </span>
                )}
              </div>
              <p className="text-[#55625F]">
                Scored by measuring the ratio of executive active verbs versus weak/passive verbs, density of quantifiable numbers (%, $, scale, users), and brevity of bullet points.
              </p>
            </div>

            {/* 3. Skills & Tech Stack */}
            <div className="p-4 rounded-xl border border-[#E4E9E6] bg-[#FAFCFA] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#273330] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#16B889]" />
                  3. Skills & Technical Stack (20% Weight)
                </span>
                {report && (
                  <span className="font-mono font-bold text-xs bg-[#DDF5EC] text-[#16B889] px-2 py-0.5 rounded">
                    Score: {report.skillsScore}%
                  </span>
                )}
              </div>
              <p className="text-[#55625F]">
                Identifies 200+ industry skills across Languages, Frameworks, Cloud, and Databases. Scored based on stack breadth and cross-verification in work experience descriptions.
              </p>
            </div>

            {/* 4. Recruiter Screen */}
            <div className="p-4 rounded-xl border border-[#E4E9E6] bg-[#FAFCFA] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#273330] flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#16B889]" />
                  4. Recruiter Screen & Readability (25% Weight)
                </span>
                {report && (
                  <span className="font-mono font-bold text-xs bg-[#DDF5EC] text-[#16B889] px-2 py-0.5 rounded">
                    Score: {report.recruiterScore}%
                  </span>
                )}
              </div>
              <p className="text-[#55625F]">
                Assesses 6-second human glanceability, clear chronology, title progression, verified project implementation evidence, and social profile reachability.
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-[#F8FAF9] border-t border-[#EEF2F0] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#16B889] hover:bg-[#129A72] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Close Methodology
          </button>
        </div>

      </div>
    </div>
  );
};
