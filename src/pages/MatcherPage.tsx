import React, { useState } from 'react';
import { 
  Target, 
  FileText, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  Zap,
  Loader2
} from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/mockResumes';
import { MOCK_JOBS } from '../data/mockJobs';
import { analyzeResume, AnalysisReport } from '../services/api';

interface MatcherPageProps {
  onReportGenerated: (report: AnalysisReport) => void;
  onBackToHome?: () => void;
}

export const MatcherPage: React.FC<MatcherPageProps> = ({ 
  onReportGenerated,
  onBackToHome 
}) => {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES[0].resumeText);
  const [resumeFileName, setResumeFileName] = useState(SAMPLE_RESUMES[0].fileName);
  const [jobDescription, setJobDescription] = useState(MOCK_JOBS[0].description);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRunMatch = async () => {
    setErrorMessage(null);
    if (!resumeText || resumeText.trim().length < 20) {
      setErrorMessage('Please provide a resume text (at least 20 characters) or choose a sample above.');
      return;
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      setErrorMessage('Please provide a job description (at least 20 characters) or choose a sample above.');
      return;
    }

    setLoading(true);
    try {
      const report = await analyzeResume(resumeText, resumeFileName, jobDescription);
      onReportGenerated(report);
    } catch (err: any) {
      console.error('Match failed:', err);
      setErrorMessage(err?.message || 'Failed to analyze match between resume and job description. Please check your text and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#273330] pb-24">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E3ECE7] px-6 py-3.5 shadow-2xs no-print">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="flex items-center gap-2 text-xs font-bold text-[#55625F] hover:text-[#16B889] transition-colors cursor-pointer bg-[#F0F5F2] hover:bg-[#E4EFEA] px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            )}
            <div className="h-4 w-px bg-[#DCE5E0]"></div>
            <div>
              <h1 className="text-sm font-extrabold text-[#273330] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#16B889]" />
                HireLens Job Matcher
              </h1>
              <p className="text-[11px] text-[#7A8A85]">Compare resume vs. role description, detect keyword alignment & skill gaps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#EAF8F3] border border-[#BDEBDC] rounded-full px-3.5 py-1 text-xs font-bold text-[#129A72]">
            <Target className="w-3.5 h-3.5 text-[#16B889]" />
            <span>HIRELENS JOB MATCHER & SKILL GAP AUDIT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#273330] tracking-tight">
            See how your resume matches a target job.
          </h2>

          <p className="text-xs sm:text-sm text-[#55625F] leading-relaxed">
            Compare your resume line-by-line against any job posting. Uncover missing keywords, skill gaps, and exact changes to boost your interview callback rate.
          </p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dual Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Resume Input */}
          <div className="bg-white rounded-2xl border border-[#E3ECE7] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEFEA]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#273330]">
                <FileText className="w-4 h-4 text-[#16B889]" />
                1. Your Resume
              </div>
              <span className="text-[11px] text-[#7A8A85] font-medium">Text or Sample</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SAMPLE_RESUMES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setResumeText(s.resumeText);
                    setResumeFileName(s.fileName);
                    setErrorMessage(null);
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    resumeFileName === s.fileName
                      ? 'bg-[#16B889] text-white border-[#16B889]'
                      : 'bg-[#F7FAF9] text-[#55625F] border-[#E3ECE7] hover:bg-[#EAEFEA]'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <textarea
              rows={11}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Paste your resume text here..."
              className="w-full text-xs font-mono bg-[#FAFCFA] border border-[#DCE5E0] rounded-xl p-3 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none transition-all resize-y"
            />
          </div>

          {/* Right: Job Description Input */}
          <div className="bg-white rounded-2xl border border-[#E3ECE7] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEFEA]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#273330]">
                <Briefcase className="w-4 h-4 text-[#16B889]" />
                2. Target Job Description
              </div>
              <span className="text-[11px] text-[#7A8A85] font-medium">Responsibilities & Stack</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {MOCK_JOBS.slice(0, 3).map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => {
                    setJobDescription(j.description);
                    setErrorMessage(null);
                  }}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border bg-[#F7FAF9] text-[#55625F] border-[#E3ECE7] hover:bg-[#EAEFEA] truncate max-w-[150px] cursor-pointer"
                >
                  {j.company} - {j.title.split(' ')[0]}
                </button>
              ))}
            </div>

            <textarea
              rows={11}
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Paste target job description here..."
              className="w-full text-xs font-sans bg-[#FAFCFA] border border-[#DCE5E0] rounded-xl p-3 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none transition-all resize-y"
            />
          </div>

        </div>

        {/* Action CTA */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleRunMatch}
            disabled={loading}
            className="bg-[#16B889] hover:bg-[#139E75] text-white font-bold text-sm px-10 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Comparing Resume with Job Posting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Match & Generate Report</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-[#7A8A85] mt-2">
            Generates ATS score, keyword alignment, missing skills, and detailed recommendations.
          </p>
        </div>

      </div>
    </div>
  );
};
