import React from 'react';
import { Check, ShieldCheck, Cpu, Sparkles, FileText, Lock, Zap } from 'lucide-react';

export const AtsScanIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[480px] h-[460px] sm:h-[500px] flex items-center justify-center select-none">
      {/* Background Soft Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#E6F8F2] via-[#F0FDF8] to-[#EEF5FF] rounded-3xl transform -rotate-1 scale-102 opacity-70 animate-pulse" />
      <div className="absolute -inset-4 bg-radial from-[#16B889]/20 via-transparent to-transparent blur-2xl pointer-events-none" />

      {/* Main Document Container */}
      <div className="relative w-full h-full bg-white/98 backdrop-blur-md rounded-2xl border border-[#C5E9DD] shadow-[0_20px_50px_-12px_rgba(22,184,137,0.22),0_8px_20px_-6px_rgba(39,51,48,0.08)] overflow-hidden flex flex-col p-6 sm:p-7 justify-between">
        
        {/* Top ATS Status Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EEF4F1]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16B889] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16B889]" />
            </span>
            <span className="text-[11.5px] font-bold tracking-wider text-[#16B889] uppercase flex items-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 inline text-[#16B889]" /> ATS Engine v2.4 Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#E6F8F2] text-[#0E7A5A] px-3 py-1 rounded-full text-[11.5px] font-semibold border border-[#C6EFE1] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#16B889]" />
            <span>98.6% Parser Match</span>
          </div>
        </div>

        {/* Animated Resume Scanning Body */}
        <div className="flex-1 space-y-4 text-left overflow-hidden py-2 relative flex flex-col justify-around">
          
          {/* Resume Header */}
          <div className="space-y-1.5 p-3 rounded-xl bg-[#F9FBFA] border border-[#E3ECE7]">
            <div className="flex items-center justify-between">
              <h4 className="text-base sm:text-lg font-extrabold text-[#273330] tracking-tight">
                Sarah Jenkins
              </h4>
              <span className="text-[10px] font-mono font-bold text-[#16B889] bg-[#EAFBF5] px-2.5 py-0.5 rounded-full border border-[#C5F3E4]">
                Clean Contact Block
              </span>
            </div>
            <p className="text-xs font-semibold text-[#526360]">Senior Full-Stack Engineer</p>
            <div className="flex items-center gap-2 text-[10.5px] text-[#71827E]">
              <span>sarah.jenkins@example.com</span>
              <span>•</span>
              <span>(555) 234-8901</span>
            </div>
          </div>

          {/* Technical Skills & Frameworks with pulse animation */}
          <div className="space-y-2 p-3 rounded-xl bg-[#F9FBFA] border border-[#E3ECE7]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#3B4845] uppercase tracking-wider">
                Technical Skills & Frameworks
              </span>
              <span className="text-[10px] text-[#16B889] font-bold flex items-center gap-1">
                <Check className="w-3 h-3 text-[#16B889]" /> 12 Keywords Identified
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {['TypeScript', 'React 19', 'Node.js', 'PostgreSQL', 'REST APIs', 'Cloud Architecture'].map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#EBFBF4] text-[#117C5B] border border-[#BDEFD9] shadow-2xs animate-fadeIn"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience with animated highlight */}
          <div className="space-y-1.5 p-3 rounded-xl bg-[#F9FBFA] border border-[#E3ECE7]">
            <div className="flex items-center justify-between text-xs font-bold text-[#273330]">
              <span>Lead Software Engineer — FinTech Core</span>
              <span className="text-[10px] font-mono text-[#7E8E8A]">2022 – Present</span>
            </div>
            <p className="text-[11px] text-[#556360] leading-relaxed">
              • <strong className="text-[#16B889]">Architected</strong> distributed payment pipeline processing $40M+ with 99.99% uptime.
            </p>
          </div>

        </div>

        {/* Laser Scanner Bar Sweeping Across Document */}
        <div 
          className="absolute left-0 right-0 h-[3px] pointer-events-none z-30"
          style={{
            animation: 'atsSweep 3.5s ease-in-out infinite',
            background: 'linear-gradient(90deg, rgba(22,184,137,0) 0%, rgba(22,184,137,0.98) 50%, rgba(22,184,137,0) 100%)',
            boxShadow: '0 0 16px 4px rgba(22,184,137,0.55), 0 0 32px 8px rgba(22,184,137,0.25)'
          }}
        >
          <div className="absolute right-12 -top-2 w-4 h-4 rounded-full bg-[#16B889] blur-[3px] animate-ping" />
        </div>

        {/* Floating Scan Verification Micro-Badge */}
        <div className="absolute bottom-4 right-4 z-25 bg-white/98 backdrop-blur-md border border-[#C7EFE2] rounded-xl shadow-xl px-3.5 py-2 flex items-center gap-2.5 pointer-events-none">
          <Sparkles className="w-4 h-4 text-[#16B889] animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[11.5px] font-extrabold text-[#145C44]">
            Optical ATS Parse Verified
          </span>
        </div>

      </div>

      <style>{`
        @keyframes atsSweep {
          0% { top: 6%; opacity: 0.85; }
          50% { top: 90%; opacity: 1; }
          100% { top: 6%; opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};
