import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (plan: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChoose = (planName: string) => {
    setSelectedPlan(planName);
    setTimeout(() => {
      if (onSelectPlan) onSelectPlan(planName);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#071310]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#E2E8E5] shadow-2xl w-full max-w-4xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-8 pb-6 text-center relative border-b border-[#EEF2F0]">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[#788582] hover:text-[#273330] p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close pricing modal"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[12px] font-bold uppercase tracking-[2px] text-[#16B889] font-sans block mb-2">
            HIRELENS PLANS & PRICING
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#273330] tracking-tight">
            Invest in your next career breakthrough
          </h2>

          <p className="text-[15px] text-[#55625F] max-w-md mx-auto mt-2">
            Audit your resume with enterprise-grade ATS algorithms, unlimited tailoring, and recruiter intelligence.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-6 inline-flex items-center p-1 bg-[#F4F8F6] rounded-full border border-[#DDE7E3]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#273330] shadow-xs'
                  : 'text-[#697572] hover:text-[#273330]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#16B889] text-white shadow-xs'
                  : 'text-[#697572] hover:text-[#273330]'
              }`}
            >
              Annual Billing
              <span className="bg-[#DDF5EC] text-[#16B889] text-[9.5px] px-1.5 py-0.2 rounded font-extrabold">Save 40%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Plan 1: Free Starter */}
          <div className="rounded-2xl border border-[#E4E9E6] p-6 flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all bg-[#FAFCFA]">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-[#273330]">Free Starter</h3>
                <p className="text-xs text-[#697572]">Essential diagnostic check for casual job seekers.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#273330]">$0</span>
                <span className="text-xs text-[#697572]">/ forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#485653] pt-2 border-t border-[#EEF2F0]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>3 Complete Resume Checks / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Basic ATS Parseability Score</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Contact & Section Validation</span>
                </li>
                <li className="flex items-center gap-2 text-[#98A3A0]">
                  <span>— Unlimited Job Tailoring</span>
                </li>
                <li className="flex items-center gap-2 text-[#98A3A0]">
                  <span>— Smart AI Bullet Rewrites</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Free Starter')}
              className="w-full h-[42px] rounded-xl border border-[#D5DDD9] text-[#273330] hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
            >
              {selectedPlan === 'Free Starter' ? 'Selected ✓' : 'Current Plan'}
            </button>
          </div>

          {/* Plan 2: Pro Career (Highlighted) */}
          <div className="rounded-2xl border-2 border-[#16B889] p-6 flex flex-col justify-between space-y-6 relative shadow-lg bg-white">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#16B889] text-white text-[10.5px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow-xs">
              Most Popular
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-[#273330] flex items-center gap-1.5">
                  Pro Career <Sparkles className="w-4 h-4 text-[#16B889]" />
                </h3>
                <p className="text-xs text-[#697572]">For active candidates targeting fast interviews.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#273330]">
                  {billingCycle === 'annual' ? '$14' : '$24'}
                </span>
                <span className="text-xs text-[#697572]">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#485653] pt-2 border-t border-[#EEF2F0]">
                <li className="flex items-center gap-2 font-medium text-[#273330]">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span><strong>Unlimited</strong> Resume Checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Deep Job Description Tailoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Smart Bullet Rewrites & Action Plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Recruiter Human Screening Signals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Full PDF Export & Builder Suite</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Pro Career')}
              className="w-full h-[42px] rounded-xl bg-[#16B889] hover:bg-[#129A72] text-white font-bold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              {selectedPlan === 'Pro Career' ? 'Activating Pro... ✓' : 'Start 7-Day Free Trial'}
            </button>
          </div>

          {/* Plan 3: Enterprise / Team */}
          <div className="rounded-2xl border border-[#E4E9E6] p-6 flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all bg-[#FAFCFA]">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-[#273330]">Team & Outplacement</h3>
                <p className="text-xs text-[#697572]">For career coaches, bootcamps, and universities.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#273330]">
                  {billingCycle === 'annual' ? '$49' : '$79'}
                </span>
                <span className="text-xs text-[#697572]">/ seat / mo</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#485653] pt-2 border-t border-[#EEF2F0]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Multi-candidate Cohort Dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Batch Candidate ATS Scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Custom Placement Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16B889] shrink-0" />
                  <span>Dedicated Account Manager</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Team & Outplacement')}
              className="w-full h-[42px] rounded-xl border border-[#D5DDD9] hover:border-[#16B889] text-[#273330] hover:text-[#16B889] font-bold text-xs transition-colors cursor-pointer"
            >
              {selectedPlan === 'Team & Outplacement' ? 'Contact Requested ✓' : 'Contact Sales'}
            </button>
          </div>

        </div>

        {/* Security & Guarantee Footer */}
        <div className="px-8 py-4 bg-[#F8FAF9] border-t border-[#EEF2F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-[#697572]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16B889]" />
            <span>256-bit SSL encryption · 14-day money-back guarantee · Cancel anytime</span>
          </div>
          <span className="font-semibold text-[#273330]">Questions? support@hirelens.ai</span>
        </div>

      </div>
    </div>
  );
};
