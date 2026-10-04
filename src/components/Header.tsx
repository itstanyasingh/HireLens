import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  X, 
  FileText, 
  Target, 
  Sparkles, 
  Layers, 
  Building2, 
  GraduationCap, 
  Users, 
  CreditCard, 
  User, 
  LogOut, 
  History, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { PricingModal } from './PricingModal';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  activeTab: 'landing' | 'report' | 'matcher' | 'history';
  onNavigate: (tab: 'landing' | 'report' | 'matcher' | 'history') => void;
  onScrollToSection?: (sectionId: string) => void;
  hasActiveReport?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  onScrollToSection,
  hasActiveReport,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'resume' | 'tools' | 'orgs' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavAction = (
    sectionId?: string,
    tab: 'landing' | 'report' | 'matcher' | 'history' = 'landing'
  ) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    onNavigate(tab);
    if (sectionId && onScrollToSection) {
      setTimeout(() => onScrollToSection(sectionId), 120);
    }
  };

  const handleLoginSuccess = (email: string) => {
    setCurrentUser(email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#E9ECEA] h-[76px] flex items-center no-print">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 w-full flex items-center justify-between">
          
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-8 lg:gap-10" ref={dropdownRef}>
            
            {/* Brand Logo */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              onClick={() => handleNavAction(undefined, 'landing')}
            >
              <div className="w-8 h-8 rounded-lg bg-[#16B889] flex items-center justify-center text-white shadow-2xs group-hover:bg-[#129A72] transition-colors">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-xl tracking-tight text-[#273330] group-hover:text-[#16B889] transition-colors font-sans">
                  HireLens
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-[#697572] border-l border-[#E9ECEA] pl-2">
                  AI Resume Intelligence
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links & Dropdowns */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#55625F]">
              
              {/* 1. Resume Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'resume' ? null : 'resume')}
                  className={`hover:text-[#273330] transition-colors py-2 flex items-center gap-1 cursor-pointer ${
                    activeTab === 'landing' ? 'text-[#16B889] font-bold' : ''
                  }`}
                >
                  Resume <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'resume' ? 'rotate-180 text-[#16B889]' : 'text-[#8E9E9A]'}`} />
                </button>

                {openDropdown === 'resume' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-[#E2E8E5] shadow-xl p-2.5 space-y-1 z-50 animate-fadeIn">
                    <button
                      onClick={() => handleNavAction('sec-upload', 'landing')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <FileText className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">Resume Checker</div>
                        <div className="text-[11px] text-[#788582]">Instant ATS audit and scoring</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavAction('sec-ats-audit', 'landing')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">ATS Understanding Check</div>
                        <div className="text-[11px] text-[#788582]">Enterprise parser readiness</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavAction(undefined, 'matcher')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <Target className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">Job Matcher</div>
                        <div className="text-[11px] text-[#788582]">Match role description & skill gaps</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavAction(undefined, 'history')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <History className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">Saved Scans & History</div>
                        <div className="text-[11px] text-[#788582]">View previous resume check reports</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'tools' ? null : 'tools')}
                  className="hover:text-[#273330] transition-colors py-2 flex items-center gap-1 cursor-pointer"
                >
                  Tools <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'tools' ? 'rotate-180 text-[#16B889]' : 'text-[#8E9E9A]'}`} />
                </button>

                {openDropdown === 'tools' && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-[#E2E8E5] shadow-xl p-2.5 space-y-1 z-50 animate-fadeIn">
                    <button
                      onClick={() => handleNavAction('sec-features', 'landing')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <Layers className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">Diagnostic Audit (7 Pillars)</div>
                        <div className="text-[11px] text-[#788582]">ATS, Content, Bias, and Recruiter signals</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavAction('sec-tailoring', 'landing')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <Target className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">Resume Tailoring</div>
                        <div className="text-[11px] text-[#788582]">Custom keywords & skill overlap</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavAction('sec-recruiter', 'landing')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <Eye className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">Human Screening Check</div>
                        <div className="text-[11px] text-[#788582]">Review project evidence & metrics</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavAction('sec-builder', 'landing')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">Resume Builder</div>
                        <div className="text-[11px] text-[#788582]">ATS-optimized PDF template editor</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Organizations Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'orgs' ? null : 'orgs')}
                  className="hover:text-[#273330] transition-colors py-2 flex items-center gap-1 cursor-pointer"
                >
                  Organizations <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'orgs' ? 'rotate-180 text-[#16B889]' : 'text-[#8E9E9A]'}`} />
                </button>

                {openDropdown === 'orgs' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-[#E2E8E5] shadow-xl p-2.5 space-y-1 z-50 animate-fadeIn">
                    <button
                      onClick={() => {
                        setOpenDropdown(null);
                        setPricingModalOpen(true);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <Building2 className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">Enterprise ATS Solutions</div>
                        <div className="text-[11px] text-[#788582]">Recruiting & outplacement tools</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setOpenDropdown(null);
                        setPricingModalOpen(true);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <GraduationCap className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">University Career Centers</div>
                        <div className="text-[11px] text-[#788582]">Student career prep cohorts</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setOpenDropdown(null);
                        setPricingModalOpen(true);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4F9F7] text-xs transition-colors flex items-start gap-2.5 cursor-pointer group"
                    >
                      <Users className="w-4 h-4 text-[#16B889] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#273330] group-hover:text-[#16B889]">Team Subscriptions</div>
                        <div className="text-[11px] text-[#788582]">Bulk coach licensing & seats</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Pricing Button */}
              <button
                onClick={() => setPricingModalOpen(true)}
                className="hover:text-[#273330] transition-colors py-2 cursor-pointer font-semibold"
              >
                Pricing
              </button>

              {/* Active Current Report Chip (if report loaded) */}
              {hasActiveReport && (
                <button
                  onClick={() => handleNavAction(undefined, 'report')}
                  className="text-[#16B889] bg-[#DDF5EC] px-3 py-1 rounded-full border border-[#BDEBDC] font-bold flex items-center gap-1.5 hover:bg-[#CEF2E5] transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Current Report
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16B889] animate-pulse"></span>
                </button>
              )}

            </nav>

          </div>

          {/* Right: User Authentication & CTA Buttons */}
          <div className="flex items-center gap-3">
            
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-[#F4F8F6] border border-[#DCE7E3] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#273330]">
                  <div className="w-6 h-6 rounded-full bg-[#16B889] text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline truncate max-w-[120px]">{currentUser.split('@')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#788582] hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-xs font-semibold border border-[#E9ECEA] hover:border-slate-300 text-[#273330] px-4 py-2.5 rounded-[8px] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => handleNavAction('sec-upload', 'landing')}
              className="bg-[#16B889] hover:bg-[#129A72] text-white text-xs font-bold px-5 py-2.5 rounded-[8px] transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              Get Started
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#55625F] hover:text-[#273330] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[76px] z-40 bg-white border-b border-[#E9ECEA] p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#16B889] block px-3">
              NAVIGATION
            </span>

            <button
              onClick={() => handleNavAction('sec-upload', 'landing')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F4F9F7] text-sm font-bold text-[#273330] flex items-center justify-between"
            >
              <span>Resume Checker</span>
              <ArrowRight className="w-4 h-4 text-[#16B889]" />
            </button>

            <button
              onClick={() => handleNavAction('sec-features', 'landing')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F4F9F7] text-sm font-bold text-[#273330] flex items-center justify-between"
            >
              <span>Diagnostic Audit</span>
              <ArrowRight className="w-4 h-4 text-[#16B889]" />
            </button>

            <button
              onClick={() => handleNavAction(undefined, 'matcher')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F4F9F7] text-sm font-bold text-[#273330] flex items-center justify-between"
            >
              <span>Job Matcher</span>
              <ArrowRight className="w-4 h-4 text-[#16B889]" />
            </button>

            <button
              onClick={() => handleNavAction(undefined, 'history')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F4F9F7] text-sm font-bold text-[#273330] flex items-center justify-between"
            >
              <span>Saved Scans & History</span>
              <ArrowRight className="w-4 h-4 text-[#16B889]" />
            </button>

            {hasActiveReport && (
              <button
                onClick={() => handleNavAction(undefined, 'report')}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-[#DDF5EC] text-sm font-bold text-[#16B889] flex items-center justify-between"
              >
                <span>Current Report</span>
                <CheckCircle2 className="w-4 h-4 text-[#16B889]" />
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setPricingModalOpen(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F4F9F7] text-sm font-bold text-[#273330] flex items-center justify-between"
            >
              <span>Plans & Pricing</span>
              <CreditCard className="w-4 h-4 text-[#16B889]" />
            </button>
          </div>

          <div className="pt-3 border-t border-[#EEF2F0] flex gap-3">
            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#D8E0DC] text-center text-xs font-bold text-[#273330]"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-rose-200 text-center text-xs font-bold text-rose-600"
              >
                Sign Out ({currentUser.split('@')[0]})
              </button>
            )}

            <button
              onClick={() => handleNavAction('sec-upload', 'landing')}
              className="flex-1 py-2.5 rounded-xl bg-[#16B889] text-center text-xs font-bold text-white shadow-xs"
            >
              Check Resume
            </button>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};
