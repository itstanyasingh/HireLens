import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Sparkles, 
  Check, 
  Copy, 
  Printer, 
  AlertTriangle, 
  Building2, 
  Briefcase, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { generateInterviewPrep, InterviewPrepResponse, InterviewQuestionItem } from '../services/api';

interface InterviewPrepPageProps {
  onBackToHome: () => void;
}

export const InterviewPrepPage: React.FC<InterviewPrepPageProps> = ({ onBackToHome }) => {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [companyName, setCompanyName] = useState('Stripe');
  const [jobDescription, setJobDescription] = useState(
    'Seeking experienced engineer to build high-scale payments APIs, microservices, and reliable React developer dashboards with 99.99% availability.'
  );
  const [experienceLevel, setExperienceLevel] = useState('Mid-Senior');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prepData, setPrepData] = useState<InterviewPrepResponse | null>(null);

  // User practice notes keyed by question index
  const [practiceNotes, setPracticeNotes] = useState<{ [key: string]: string }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({
    'behavioral-0': true,
    'technical-0': true,
    'situational-0': true
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobTitle.trim()) {
      setError('Please provide a target job role.');
      return;
    }

    setLoading(true);
    try {
      const data = await generateInterviewPrep({
        jobTitle,
        companyName,
        jobDescription,
        experienceLevel
      });
      setPrepData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate interview prep guide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyQuestion = (key: string, item: InterviewQuestionItem) => {
    const text = `Question: ${item.question}\n\nWhat Interviewers Look For: ${item.evaluates}\n\nRecommended STAR Strategy: ${item.starStrategy}\n\nKey Concepts: ${item.suggestedKeywords.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleNoteChange = (key: string, text: string) => {
    setPracticeNotes(prev => ({ ...prev, [key]: text }));
  };

  const handlePrint = () => {
    window.print();
  };

  const renderQuestionCard = (item: InterviewQuestionItem, category: string, index: number) => {
    const key = `${category}-${index}`;
    const isExpanded = expandedKeys[key] ?? false;

    return (
      <div key={key} className="bg-white rounded-2xl border border-[#E3ECE7] p-5 shadow-2xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <span className="text-[10px] font-mono font-bold text-[#16B889] uppercase tracking-wider">
              {category.toUpperCase()} #{index + 1}
            </span>
            <h4 className="font-extrabold text-[14px] text-[#192622] leading-snug">
              "{item.question}"
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 no-print">
            <button
              onClick={() => handleCopyQuestion(key, item)}
              className="p-1.5 text-[#6A7B76] hover:text-[#16B889] bg-[#F9FBFA] rounded-lg border border-[#D9E3DF] cursor-pointer"
              title="Copy STAR strategy"
            >
              {copiedKey === key ? <Check className="w-3.5 h-3.5 text-[#16B889]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => toggleExpand(key)}
              className="p-1.5 text-[#6A7B76] hover:text-[#16B889] bg-[#F9FBFA] rounded-lg border border-[#D9E3DF] cursor-pointer"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-3 pt-1 border-t border-[#F0F4F2]">
            {/* Recruiter Evaluation Signal */}
            <div className="p-3 bg-[#F4FAF7] rounded-xl border border-[#D0EDE0] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#129A72]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>What Interviewers Are Evaluating:</span>
              </div>
              <p className="text-xs text-[#35433F] leading-relaxed">
                {item.evaluates}
              </p>
            </div>

            {/* STAR Answer Strategy */}
            <div className="p-3 bg-[#FFFBF5] rounded-xl border border-[#FBE6C8] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C96B1C]">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Recommended STAR Answer Strategy:</span>
              </div>
              <p className="text-xs text-[#523F30] leading-relaxed">
                {item.starStrategy}
              </p>
            </div>

            {/* Suggested Keywords */}
            {item.suggestedKeywords && item.suggestedKeywords.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[10.5px] font-bold text-[#7A8A85]">Keywords to Include:</span>
                {item.suggestedKeywords.map((k, ki) => (
                  <span key={ki} className="text-[11px] font-mono font-bold bg-[#F0F5F2] text-[#129A72] border border-[#D4E4DC] px-2 py-0.5 rounded-md">
                    {k}
                  </span>
                ))}
              </div>
            )}

            {/* User Practice Notes */}
            <div className="space-y-1 pt-1 no-print">
              <label className="text-[11px] font-bold text-[#55625F] block">My STAR Practice Notes (Autosaved):</label>
              <textarea
                rows={2}
                value={practiceNotes[key] || ''}
                onChange={e => handleNoteChange(key, e.target.value)}
                placeholder="Jot down a real project, metrics, or personal story for this question..."
                className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg p-2.5 text-[#273330] focus:border-[#16B889] outline-none"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#273330] pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E3ECE7] px-6 py-3.5 shadow-2xs no-print">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs font-bold text-[#55625F] hover:text-[#16B889] transition-colors cursor-pointer bg-[#F0F5F2] hover:bg-[#E4EFEA] px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="h-4 w-px bg-[#DCE5E0]"></div>
            <div>
              <h1 className="text-sm font-extrabold text-[#273330] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#16B889]" />
                HireLens Interview Prep Coach
              </h1>
              <p className="text-[11px] text-[#7A8A85]">Tailored behavioral, technical, and leadership questions with STAR answer frameworks</p>
            </div>
          </div>

          {prepData && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-bold bg-[#EAF8F3] hover:bg-[#D5F2E7] text-[#129A72] border border-[#BDEBDC] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Guide</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* Intro */}
        <div className="max-w-2xl mx-auto text-center space-y-2 no-print">
          <span className="text-[11.5px] font-bold uppercase tracking-[2px] text-[#16B889] font-mono">
            RECRUITER INTERVIEW SIMULATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222E2B] tracking-tight">
            Prepare for top-tier company interviews
          </h2>
          <p className="text-xs sm:text-sm text-[#55625F] leading-relaxed">
            Enter your target role and company. HireLens will simulate what senior interviewers will ask and provide actionable STAR frameworks so you speak with confidence.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl border border-[#E3ECE7] p-6 max-w-3xl mx-auto shadow-2xs space-y-4 no-print">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Target Job Title *</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#98A8A3] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg pl-9 pr-3 py-2 text-[#273330] focus:border-[#16B889] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Target Company (Optional)</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#98A8A3] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, Netflix, Google"
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg pl-9 pr-3 py-2 text-[#273330] focus:border-[#16B889] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={e => setExperienceLevel(e.target.value)}
                  className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:border-[#16B889] outline-none cursor-pointer"
                >
                  <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
                  <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                  <option value="Mid-Senior (5-8 yrs)">Mid-Senior (5-8 yrs)</option>
                  <option value="Staff / Lead (8+ yrs)">Staff / Lead (8+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Target Job Description (Optional)</label>
                <input
                  type="text"
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste brief responsibilities or tech stack requirements..."
                  className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:border-[#16B889] outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold bg-[#16B889] hover:bg-[#139E75] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Comprehensive Interview Guide...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Interview Questions & STAR Guide</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RESULTS GUIDE */}
        {prepData && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Overview Banner */}
            <div className="p-6 bg-[#F4FAF7] rounded-2xl border border-[#CCE9DD] space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#16B889]" />
                <h3 className="font-extrabold text-base text-[#192622]">
                  Recruiter Screening Context: {jobTitle} at {companyName || 'Target Company'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#445550] leading-relaxed">
                {prepData.roleOverview}
              </p>
            </div>

            {/* 1. Behavioral Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#273330] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16B889]"></span>
                  1. Behavioral & Team Collaboration Questions ({prepData.behavioral.length})
                </h3>
                <span className="text-[11px] text-[#7A8A85]">Evaluates culture, resilience, communication</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {prepData.behavioral.map((item, idx) => renderQuestionCard(item, 'behavioral', idx))}
              </div>
            </div>

            {/* 2. Technical & System Architecture Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#273330] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#397F86]"></span>
                  2. Technical Execution & System Design Questions ({prepData.technical.length})
                </h3>
                <span className="text-[11px] text-[#7A8A85]">Evaluates architecture, scale, trade-offs</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {prepData.technical.map((item, idx) => renderQuestionCard(item, 'technical', idx))}
              </div>
            </div>

            {/* 3. Situational Leadership & Conflict Resolution */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#273330] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97736]"></span>
                  3. Situational Leadership & Risk Management ({prepData.situational.length})
                </h3>
                <span className="text-[11px] text-[#7A8A85]">Evaluates crisis management, prioritization</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {prepData.situational.map((item, idx) => renderQuestionCard(item, 'situational', idx))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
