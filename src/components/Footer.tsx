import React, { useState } from 'react';
import { ShieldCheck, X, Mail, FileText, Lock, Building, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'landing' | 'report' | 'matcher' | 'history' | 'builder' | 'tailor' | 'cover-letter' | 'tracker' | 'interview-prep') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [modalType, setModalType] = useState<'about' | 'contact' | 'privacy' | 'terms' | null>(null);

  const handleResourceClick = (sectionId: string) => {
    onNavigate('landing');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

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

          {/* Column 2: Product & Tools */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#263333] uppercase tracking-wider block text-[11px]">Product & Tools</span>
            <ul className="space-y-1.5 text-[13px]">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Resume Checker</button></li>
              <li><button onClick={() => onNavigate('builder')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Resume Builder</button></li>
              <li><button onClick={() => onNavigate('tailor')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Resume Tailor</button></li>
              <li><button onClick={() => onNavigate('matcher')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Job Matcher</button></li>
              <li><button onClick={() => onNavigate('cover-letter')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Cover Letter</button></li>
              <li><button onClick={() => onNavigate('tracker')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Job Tracker</button></li>
              <li><button onClick={() => onNavigate('interview-prep')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Interview Prep</button></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#263333] uppercase tracking-wider block text-[11px]">Resources</span>
            <ul className="space-y-2 text-[13px]">
              <li><button onClick={() => handleResourceClick('sec-features')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Resume Guide</button></li>
              <li><button onClick={() => handleResourceClick('sec-ats-audit')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">ATS Guide</button></li>
              <li><button onClick={() => handleResourceClick('sec-features')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Career Tips</button></li>
              <li><button onClick={() => handleResourceClick('sec-faq')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">FAQ</button></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#263333] uppercase tracking-wider block text-[11px]">Company</span>
            <ul className="space-y-2 text-[13px]">
              <li><button onClick={() => setModalType('about')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">About</button></li>
              <li><button onClick={() => setModalType('contact')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Contact</button></li>
              <li><button onClick={() => setModalType('privacy')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Privacy Policy</button></li>
              <li><button onClick={() => setModalType('terms')} className="hover:text-[#159A78] transition-colors cursor-pointer text-left">Terms of Service</button></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#E8ECEA] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#65716D]">
          <p>© 2026 HireLens. All rights reserved.</p>
          <p>Analyze your resume. Fix what matters. Find jobs that fit.</p>
        </div>

      </div>

      {/* Company Modal Dialog */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-[#071310]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E2E8E5] shadow-2xl w-full max-w-lg overflow-hidden relative p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-6 right-6 text-[#788582] hover:text-[#273330] p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[#159A78]">
                  <Building className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[#263333]">About HireLens</h3>
                </div>
                <p className="text-sm text-[#5D6865] leading-relaxed">
                  HireLens is an enterprise-grade AI resume intelligence platform built to eliminate applicant tracking system (ATS) blind spots and level the playing field for job seekers worldwide.
                </p>
                <div className="space-y-2 text-xs text-[#485653]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159A78]" />
                    <span>Multi-parser ATS simulation engine (Workday, Greenhouse, Lever, Taleo)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159A78]" />
                    <span>Deterministic formula audit and explainable match diagnostics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159A78]" />
                    <span>Real-time bullet rewriting and recruiter impact validation</span>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[#159A78]">
                  <Mail className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[#263333]">Contact Support</h3>
                </div>
                <p className="text-sm text-[#5D6865] leading-relaxed">
                  Have questions about your resume audit, enterprise licensing, or technical support? Our team is available 24/7.
                </p>
                <div className="p-4 bg-[#F4F9F7] rounded-2xl border border-[#D3E8E1] space-y-2 text-xs text-[#263333]">
                  <div><strong>General Inquiries:</strong> support@hirelens.ai</div>
                  <div><strong>Enterprise & University Partnerships:</strong> enterprise@hirelens.ai</div>
                  <div><strong>Response Time:</strong> Within 2 business hours</div>
                </div>
              </div>
            )}

            {modalType === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[#159A78]">
                  <Lock className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[#263333]">Privacy Policy</h3>
                </div>
                <p className="text-xs text-[#5D6865] leading-relaxed">
                  At HireLens, your career data and resume content are completely private and secure.
                </p>
                <ul className="space-y-2 text-xs text-[#485653] list-disc pl-5">
                  <li>We never sell, rent, or monetize your resume or personal information.</li>
                  <li>Your uploaded documents are parsed strictly for audit and optimization purposes.</li>
                  <li>All connections use 256-bit SSL encryption in transit and at rest.</li>
                  <li>You can export or purge your saved scans and history at any time from local browser storage.</li>
                </ul>
              </div>
            )}

            {modalType === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[#159A78]">
                  <FileText className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-[#263333]">Terms of Service</h3>
                </div>
                <p className="text-xs text-[#5D6865] leading-relaxed">
                  By using HireLens, you agree to our transparent fair-use policies and service guarantees.
                </p>
                <ul className="space-y-2 text-xs text-[#485653] list-disc pl-5">
                  <li>HireLens provides diagnostic feedback and scoring recommendations based on real ATS patterns.</li>
                  <li>Users retain 100% full ownership of all uploaded and generated resume content.</li>
                  <li>Paid plans come with a 14-day no-questions-asked money-back guarantee.</li>
                </ul>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2 rounded-xl bg-[#159A78] text-white font-bold text-xs hover:bg-[#128366] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

