import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'landing' | 'report' | 'matcher' | 'history') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E8ECEA] py-16 text-xs text-[#5D6865] no-print">
      <div className="max-w-[1060px] mx-auto px-6 sm:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#159A78] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-[#263333] text-base font-sans">HireLens</span>
            </div>
            <p className="text-[#65716D] text-xs leading-relaxed">
              AI-powered resume intelligence platform helping job seekers fix resume issues and match target roles.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#263333] uppercase tracking-wider block text-[11px]">Product</span>
            <ul className="space-y-2 text-[13px]">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-[#159A78] transition-colors cursor-pointer">Resume Checker</button></li>
              <li><button onClick={() => onNavigate('matcher')} className="hover:text-[#159A78] transition-colors cursor-pointer">Job Matcher</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-[#159A78] transition-colors cursor-pointer">Skill Gap Analysis</button></li>
              <li><button onClick={() => onNavigate('history')} className="hover:text-[#159A78] transition-colors cursor-pointer">History</button></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#263333] uppercase tracking-wider block text-[11px]">Resources</span>
            <ul className="space-y-2 text-[13px]">
              <li><a href="#sec-resources" className="hover:text-[#159A78] transition-colors">Resume Guide</a></li>
              <li><a href="#sec-resources" className="hover:text-[#159A78] transition-colors">ATS Guide</a></li>
              <li><a href="#sec-resources" className="hover:text-[#159A78] transition-colors">Career Tips</a></li>
              <li><a href="#sec-faq" className="hover:text-[#159A78] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#263333] uppercase tracking-wider block text-[11px]">Company</span>
            <ul className="space-y-2 text-[13px]">
              <li><a href="#" className="hover:text-[#159A78] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#159A78] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#159A78] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#159A78] transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#E8ECEA] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#65716D]">
          <p>© 2026 HireLens. All rights reserved.</p>
          <p>Analyze your resume. Fix what matters. Find jobs that fit.</p>
        </div>

      </div>
    </footer>
  );
};
