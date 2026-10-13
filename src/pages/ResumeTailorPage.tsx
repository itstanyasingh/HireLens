import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  FileText, 
  Briefcase, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/mockResumes';
import { MOCK_JOBS } from '../data/mockJobs';
import { tailorResume, TailorResumeResponse } from '../services/api';

interface ResumeTailorPageProps {
  onBackToHome: () => void;
  onOpenBuilder?: () => void;
}

export const ResumeTailorPage: React.FC<ResumeTailorPageProps> = ({
  onBackToHome,
  onOpenBuilder
}) => {
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [jobDescription, setJobDescription] = useState(MOCK_JOBS[0].description);
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES[0].resumeText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TailorResumeResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleTailor = async () => {
    setError(null);
    if (!jobDescription || jobDescription.trim().length < 20) {
      setError('Please paste a target job description (at least 20 characters).');
      return;
    }
    if (!resumeText || resumeText.trim().length < 20) {
      setError('Please provide your resume content (at least 20 characters).');
      return;
    }

    setLoading(true);
    try {
      const data = await tailorResume({
        resumeText,
        jobDescription,
        targetRole
      });
      setResults(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to tailor resume. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#273330] pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E3ECE7] px-6 py-3.5 shadow-2xs">
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
                <Target className="w-4 h-4 text-[#16B889]" />
                HireLens Resume Tailor
              </h1>
              <p className="text-[11px] text-[#7A8A85]">Adapt your resume for any specific job posting & pass ATS filters</p>
            </div>
          </div>

          {onOpenBuilder && (
            <button
              onClick={onOpenBuilder}
              className="flex items-center gap-1.5 text-xs font-bold text-[#129A72] bg-[#EAF8F3] hover:bg-[#D5F2E7] border border-[#BDEBDC] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Open in Resume Builder</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* Intro */}
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <span className="text-[11.5px] font-bold uppercase tracking-[2px] text-[#16B889] font-mono">
            JOB-SPECIFIC TAILORING
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222E2B] tracking-tight">
            Tailor your resume to the exact job description
          </h2>
          <p className="text-xs sm:text-sm text-[#55625F] leading-relaxed">
            Applicant Tracking Systems match keyword density and phrasing against target role requirements. Paste the job description below to uncover missing keywords and receive impact-focused bullet rewrites.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Target Role & Job Description */}
          <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#16B889]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#273330]">1. Target Job Details</h3>
              </div>
              <span className="text-[11px] text-[#7A8A85]">Job requirements</span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#55625F] block mb-1">Target Job Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:border-[#16B889] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#55625F]">Job Description / Posting Text:</label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setTargetRole('Full Stack Engineer');
                      setJobDescription(MOCK_JOBS[0].description);
                    }}
                    className="text-[10px] text-[#16B889] bg-[#EAF8F3] px-2 py-0.5 rounded cursor-pointer font-bold"
                  >
                    Stripe Backend
                  </button>
                  <button
                    onClick={() => {
                      setTargetRole('Full Stack Engineer');
                      setJobDescription(MOCK_JOBS[1].description);
                    }}
                    className="text-[10px] text-[#55625F] bg-[#F0F5F2] px-2 py-0.5 rounded cursor-pointer font-bold"
                  >
                    Vercel React
                  </button>
                </div>
              </div>
              <textarea
                rows={10}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the target job description, responsibilities, and required qualifications..."
                className="w-full text-xs font-mono bg-[#F9FBFA] border border-[#D9E3DF] rounded-xl p-3 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none resize-y"
              />
            </div>
          </div>

          {/* Current Resume */}
          <div className="bg-white rounded-2xl border border-[#E3ECE7] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#16B889]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#273330]">2. Your Current Resume</h3>
              </div>
              <div className="flex gap-1.5">
                {SAMPLE_RESUMES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setResumeText(s.resumeText)}
                    className="text-[10px] text-[#55625F] bg-[#F0F5F2] hover:bg-[#E4ECE8] px-2 py-0.5 rounded cursor-pointer font-bold"
                  >
                    {s.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-8">
              <label className="text-[11px] font-bold text-[#55625F] block">Resume Experience & Skills Text:</label>
              <textarea
                rows={12}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your current resume content here..."
                className="w-full text-xs font-mono bg-[#F9FBFA] border border-[#D9E3DF] rounded-xl p-3 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none resize-y"
              />
            </div>
          </div>

        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleTailor}
            disabled={loading}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold bg-[#16B889] hover:bg-[#139E75] text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing & Tailoring Keywords...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tailor My Resume for This Job</span>
              </>
            )}
          </button>
        </div>

        {/* RESULTS SECTION */}
        {results && (
          <div className="bg-white rounded-3xl border border-[#DCE7E2] p-6 sm:p-8 space-y-8 shadow-sm animate-fadeIn">
            
            {/* Top Score Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-[#F4FAF7] rounded-2xl border border-[#C5E9DD]">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[11px] font-bold text-[#16B889] uppercase tracking-wider font-mono">
                  KEYWORD ALIGNMENT ANALYSIS
                </span>
                <h3 className="text-2xl font-extrabold text-[#192622]">
                  Job Tailoring Match: {results.tailorScore}%
                </h3>
                <p className="text-xs text-[#55625F]">
                  Based on target qualifications, tool stack, and semantic role phrasing.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-[#16B889]">{results.matchedKeywords.length}</div>
                  <div className="text-[11px] font-bold text-[#55625F]">Matched Keywords</div>
                </div>
                <div className="h-8 w-px bg-[#CDE0D8]"></div>
                <div className="text-center">
                  <div className="text-2xl font-black text-[#D97736]">{results.missingKeywords.length}</div>
                  <div className="text-[11px] font-bold text-[#55625F]">Missing Keywords</div>
                </div>
              </div>
            </div>

            {/* Missing vs Matched Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Missing High Priority Keywords */}
              <div className="p-5 bg-[#FFF9F5] rounded-2xl border border-[#FBE0D0] space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D97736]" />
                  <h4 className="text-xs font-extrabold text-[#D97736] uppercase tracking-wider">
                    Missing Keywords to Add ({results.missingKeywords.length})
                  </h4>
                </div>
                <p className="text-[11px] text-[#7A6052]">
                  These core requirements appeared in the job posting but were absent from your resume:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {results.missingKeywords.length > 0 ? (
                    results.missingKeywords.map(k => (
                      <span key={k} className="px-2.5 py-1 bg-white border border-[#E9C6B2] text-[#8C3F0F] rounded-lg text-xs font-bold font-mono">
                        + {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#16B889] font-bold">All primary keywords matched!</span>
                  )}
                </div>
              </div>

              {/* Matched Keywords */}
              <div className="p-5 bg-[#F2FBF7] rounded-2xl border border-[#CCEFE1] space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B889]" />
                  <h4 className="text-xs font-extrabold text-[#16B889] uppercase tracking-wider">
                    Already Matched Keywords ({results.matchedKeywords.length})
                  </h4>
                </div>
                <p className="text-[11px] text-[#42685B]">
                  Confirmed keywords verified between your resume and this posting:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {results.matchedKeywords.map(k => (
                    <span key={k} className="px-2.5 py-1 bg-white border border-[#BDEBDC] text-[#129A72] rounded-lg text-xs font-bold font-mono">
                      ✓ {k}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Bullet Point Rewrites */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-[#192622] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#16B889]" />
                <span>Tailored Achievement Bullet Rewrites</span>
              </h4>

              <div className="space-y-4">
                {results.bulletRewrites.map((item, idx) => (
                  <div key={idx} className="p-4 bg-[#F9FBFA] rounded-2xl border border-[#E0EAE5] space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-[#8A9A95] uppercase">Original Statement:</span>
                      <p className="text-xs text-[#55625F] bg-white p-2.5 rounded-lg border border-[#E7ECE9]">
                        {item.original}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[#16B889] uppercase">Tailored & Keyword-Aligned:</span>
                        <button
                          onClick={() => handleCopyBullet(item.tailored, idx)}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#16B889] hover:text-[#129A72] cursor-pointer"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Bullet</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-[#162320] font-semibold bg-[#EBF8F3] p-3 rounded-lg border border-[#BDEBDC] leading-relaxed">
                        • {item.tailored}
                      </p>
                    </div>

                    <p className="text-[11px] text-[#697A75] italic">
                      💡 {item.alignmentReason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Advice */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-[#192622]">Target Role Section Guidance</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {results.sectionAdvice.map((sa, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-[#E2EBE6] space-y-1.5 shadow-2xs">
                    <span className="text-xs font-bold text-[#16B889]">{sa.section} Section</span>
                    <p className="text-[11.5px] text-[#55625F] leading-relaxed">{sa.advice}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
