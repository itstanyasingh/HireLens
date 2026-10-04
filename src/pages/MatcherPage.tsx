import React, { useState } from 'react';
import { Target, FileText, Briefcase, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Building2, Zap } from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/mockResumes';
import { MOCK_JOBS } from '../data/mockJobs';
import { analyzeResume, AnalysisReport } from '../services/api';

interface MatcherPageProps {
  onReportGenerated: (report: AnalysisReport) => void;
}

export const MatcherPage: React.FC<MatcherPageProps> = ({ onReportGenerated }) => {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES[0].resumeText);
  const [resumeFileName, setResumeFileName] = useState(SAMPLE_RESUMES[0].fileName);
  const [jobDescription, setJobDescription] = useState(MOCK_JOBS[0].description);
  const [loading, setLoading] = useState(false);

  const handleRunMatch = async () => {
    if (!resumeText || resumeText.trim().length < 20) return;
    if (!jobDescription || jobDescription.trim().length < 20) return;

    setLoading(true);
    try {
      const report = await analyzeResume(resumeText, resumeFileName, jobDescription);
      onReportGenerated(report);
    } catch (err) {
      console.error('Match failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-3.5 py-1 text-xs font-bold text-indigo-700">
          <Target className="w-3.5 h-3.5 text-indigo-600" />
          <span>HIRELENS JOB MATCHER</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          See how your resume matches a job.
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Compare your resume line-by-line against any job posting. Uncover missing keywords, skill gaps, and exact changes to boost your interview callback rate.
        </p>
      </div>

      {/* Dual Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Resume Input */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <FileText className="w-4 h-4 text-indigo-600" />
              1. Your Resume
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Text or Sample</span>
          </div>

          <div className="flex gap-2">
            {SAMPLE_RESUMES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setResumeText(s.resumeText);
                  setResumeFileName(s.fileName);
                }}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  resumeFileName === s.fileName
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <textarea
            rows={10}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-y"
          />
        </div>

        {/* Right: Job Description Input */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              2. Target Job Description
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Responsibilities & Stack</span>
          </div>

          <div className="flex gap-2">
            {MOCK_JOBS.slice(0, 3).map((j) => (
              <button
                key={j.id}
                onClick={() => setJobDescription(j.description)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 truncate max-w-[130px]"
              >
                {j.company} - {j.title.split(' ')[0]}
              </button>
            ))}
          </div>

          <textarea
            rows={10}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description here..."
            className="w-full text-xs font-sans bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-y"
          />
        </div>

      </div>

      {/* Action CTA */}
      <div className="text-center pt-2">
        <button
          onClick={handleRunMatch}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-10 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          {loading ? 'Analyzing Match...' : 'Analyze Match & Generate Report'}
        </button>
      </div>

    </div>
  );
};
