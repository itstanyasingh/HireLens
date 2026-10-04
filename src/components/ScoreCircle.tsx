import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface ScoreCircleProps {
  score: number;
  label?: string;
  supportingText?: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  label,
  supportingText,
}) => {
  const [showMethodology, setShowMethodology] = useState(false);

  // Score status calculations
  let color = 'text-[#168F70] stroke-[#168F70] bg-[#DDF6EC] border-[#35C99A]';
  let badgeColor = 'bg-[#DDF6EC] text-[#168F70] border-[#35C99A]/40';
  let statusText = label || 'Good Resume';

  if (score >= 88) {
    color = 'text-[#16A34A] stroke-[#16A34A] bg-emerald-50 border-emerald-300';
    badgeColor = 'bg-emerald-50 text-[#16A34A] border-emerald-300';
    statusText = label || 'Exceptional Resume';
  } else if (score >= 75) {
    color = 'text-[#168F70] stroke-[#168F70] bg-[#DDF6EC] border-[#35C99A]';
    badgeColor = 'bg-[#DDF6EC] text-[#168F70] border-[#35C99A]/40';
    statusText = label || 'Good Resume';
  } else if (score >= 60) {
    color = 'text-[#D97706] stroke-[#D97706] bg-amber-50 border-amber-300';
    badgeColor = 'bg-amber-50 text-[#D97706] border-amber-300';
    statusText = label || 'Needs Improvement';
  } else {
    color = 'text-[#DC2626] stroke-[#DC2626] bg-rose-50 border-rose-300';
    badgeColor = 'bg-rose-50 text-[#DC2626] border-rose-300';
    statusText = label || 'Critical Issues';
  }

  const defaultSupportingText =
    supportingText ||
    'Your resume is in good shape, but there are several high-impact improvements that will help you stand out to hiring managers.';

  // Circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E5] shadow-xs p-6 sm:p-7">
      
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        
        {/* Score Ring */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-[#E2E8E5]"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className={`transition-all duration-1000 ease-out ${color.split(' ')[1]}`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Number Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-[#293133] tracking-tight font-mono">
              {score}
            </span>
            <span className="text-[11px] font-semibold text-[#8B9494] font-mono">
              / 100
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${badgeColor}`}>
              {statusText}
            </span>
            <span className="text-xs text-[#8B9494] font-mono">
              HireLens Index
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#293133] mb-1.5">
            Overall Resume Score
          </h3>

          <p className="text-xs text-[#5F6868] leading-relaxed max-w-lg mb-3">
            {defaultSupportingText}
          </p>

          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="text-xs font-semibold text-[#168F70] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            {showMethodology ? 'Hide scoring methodology' : 'View scoring methodology'}
            {showMethodology ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Methodology Dropdown */}
      {showMethodology && (
        <div className="mt-5 pt-4 border-t border-[#E2E8E5] text-xs text-[#5F6868] space-y-2 bg-[#F7F8F6] p-4 rounded-xl animate-fadeIn">
          <div className="font-bold text-[#293133] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#168F70]" />
            How HireLens Calculates Your Score
          </div>
          <p className="leading-relaxed text-[#5F6868]">
            Your overall score combines 6 weighted pillars calibrated against real enterprise ATS systems and recruiter screening criteria:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-[#293133] pt-1">
            <div className="bg-white p-2 rounded border border-[#E2E8E5]">
              <span className="font-bold text-[#168F70]">25%</span> ATS Essentials
            </div>
            <div className="bg-white p-2 rounded border border-[#E2E8E5]">
              <span className="font-bold text-[#168F70]">25%</span> Content Quality
            </div>
            <div className="bg-white p-2 rounded border border-[#E2E8E5]">
              <span className="font-bold text-[#168F70]">20%</span> Recruiter Signals
            </div>
            <div className="bg-white p-2 rounded border border-[#E2E8E5]">
              <span className="font-bold text-[#168F70]">15%</span> Skills & Tech Stack
            </div>
            <div className="bg-white p-2 rounded border border-[#E2E8E5]">
              <span className="font-bold text-[#168F70]">10%</span> Keyword Alignment
            </div>
            <div className="bg-white p-2 rounded border border-[#E2E8E5]">
              <span className="font-bold text-[#168F70]">5%</span> Structure & Headings
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
