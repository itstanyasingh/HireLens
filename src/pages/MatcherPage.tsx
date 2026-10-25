import React, { useState, useRef } from 'react';
import { 
  Target, 
  FileText, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Scale,
  Loader2,
  Upload,
  Check,
  X,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/mockResumes';
import { MOCK_JOBS } from '../data/mockJobs';
import { 
  analyzeResume, 
  AnalysisReport, 
  getHistory, 
  explainJobMatch 
} from '../services/api';
import { extractTextFromFile } from '../services/pdfExtractor';
import { validateExtractedResumeText } from '../services/textValidator';
import { JobRequirement, RequirementMatch, ScoreAudit } from '../services/evidenceEngine';

interface MatcherPageProps {
  onReportGenerated: (report: AnalysisReport) => void;
  onBackToHome?: () => void;
}

export const MatcherPage: React.FC<MatcherPageProps> = ({ 
  onReportGenerated,
  onBackToHome 
}) => {
  const initialHistory = getHistory();
  const latestReport = initialHistory[0];

  const [resumeText, setResumeText] = useState(latestReport?.resumeText || '');
  const [resumeFileName, setResumeFileName] = useState(latestReport?.fileName || 'My_Resume.pdf');
  const [jobDescription, setJobDescription] = useState(latestReport?.jobDescription || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MATCHED' | 'MISSING' | 'REQUIRED' | 'PREFERRED'>('ALL');

  // Job Match Intelligence State
  const [matchIntelligence, setMatchIntelligence] = useState<{
    requirements: JobRequirement[];
    matches: RequirementMatch[];
    audit: ScoreAudit;
    calculatedAt: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload & Format Validation
  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) {
      setErrorMessage('Unsupported file format. Please upload a PDF, DOCX, or plain text (.txt) resume file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit. Please upload a smaller document.');
      return;
    }

    setIsExtractingFile(true);
    try {
      const extracted = await extractTextFromFile(file);
      const validation = validateExtractedResumeText(extracted, file.name);
      if (!validation.isValid) {
        setErrorMessage(validation.errorMessage || 'Unable to extract readable text. Please check the document.');
        setIsExtractingFile(false);
        return;
      }
      setResumeText(validation.cleanText || extracted);
      setResumeFileName(file.name);
      setMatchIntelligence(null); // Invalidate previous match
    } catch (err: any) {
      console.error('File extraction error:', err);
      setErrorMessage(err?.message || 'Failed to read uploaded resume. Please paste text directly.');
    } finally {
      setIsExtractingFile(false);
    }
  };

  // Run Job Match Intelligence
  const handleCalculateMatch = async () => {
    setErrorMessage(null);

    // Strict Input Validation
    if (!resumeText || resumeText.trim().length < 30) {
      setErrorMessage('Resume text is too short. Please provide at least 30 characters of resume content to analyze.');
      return;
    }
    if (!jobDescription || jobDescription.trim().length < 30) {
      setErrorMessage('Job description is too short. Please provide at least 30 characters of target role requirements.');
      return;
    }

    setLoading(true);
    try {
      const result = await explainJobMatch({
        resumeText: resumeText.trim(),
        jobDescription: jobDescription.trim()
      });

      setMatchIntelligence({
        requirements: result.requirements,
        matches: result.matches,
        audit: result.audit,
        calculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err: any) {
      console.error('Match Intelligence error:', err);
      setErrorMessage(err?.message || 'Failed to calculate job match intelligence. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate Full Multi-Pillar Diagnostic Report
  const handleGenerateFullReport = async () => {
    if (!resumeText || !jobDescription) return;
    setLoading(true);
    try {
      const report = await analyzeResume(resumeText, resumeFileName, jobDescription);
      onReportGenerated(report);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to generate comprehensive report.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered Matches
  const displayedMatches = matchIntelligence?.matches.filter(m => {
    if (activeFilter === 'MATCHED') return m.status === 'MATCHED';
    if (activeFilter === 'MISSING') return m.status === 'NOT FOUND';
    if (activeFilter === 'REQUIRED') return m.requirement.importanceLevel === 'Required';
    if (activeFilter === 'PREFERRED') return m.requirement.importanceLevel === 'Preferred';
    return true;
  }) || [];

  const scoreDisplay = matchIntelligence?.audit.overallScore ?? 0;

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
                Job Match Intelligence
              </h1>
              <p className="text-[11px] text-[#7A8A85]">
                Evidence-based requirement matching, verifiable excerpts & transparent scoring
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#EAF8F3] border border-[#BDEBDC] rounded-full px-3.5 py-1 text-xs font-bold text-[#129A72]">
            <Target className="w-3.5 h-3.5 text-[#16B889]" />
            <span>JOB MATCH INTELLIGENCE ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#273330] tracking-tight">
            See how your resume matches a target job.
          </h2>
          <p className="text-xs sm:text-sm text-[#55625F] leading-relaxed">
            Compare your actual resume line-by-line against any real job posting. Uncover missing requirements, verified skill evidence excerpts, and mathematically transparent match scoring.
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
                <span>1. Resume Document</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf,.docx,.txt" 
                  className="hidden" 
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtractingFile}
                  className="text-[11px] font-bold text-[#16B889] hover:bg-[#EAFBF5] px-2.5 py-1 rounded-lg border border-[#C6EFE0] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {isExtractingFile ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  <span>Upload File</span>
                </button>
                <span className="text-[10px] text-[#7A8A85] font-mono">
                  {resumeText ? `${resumeText.length} chars` : 'Required'}
                </span>
              </div>
            </div>

            <textarea
              rows={11}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setErrorMessage(null);
                setMatchIntelligence(null);
              }}
              placeholder="Paste your actual resume content here (Summary, Work History, Education, Skills, Projects) or upload a PDF/DOCX file above..."
              className="w-full text-xs font-mono bg-[#FAFCFA] border border-[#DCE5E0] rounded-xl p-3 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none transition-all resize-y"
            />

            {/* Benchmark Sample Resumes */}
            <div className="pt-2 border-t border-[#EEF2F0]">
              <div className="flex items-center justify-between text-[11px] text-[#61706B] mb-1.5">
                <span>Load a benchmark resume to test:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_RESUMES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setResumeText(s.resumeText);
                      setResumeFileName(s.fileName);
                      setErrorMessage(null);
                      setMatchIntelligence(null);
                    }}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      resumeFileName === s.fileName && resumeText === s.resumeText
                        ? 'bg-[#16B889] text-white border-[#16B889]'
                        : 'bg-[#F7FAF9] text-[#55625F] border-[#E3ECE7] hover:bg-[#EAEFEA]'
                    }`}
                  >
                    Sample: {s.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Job Description Input */}
          <div className="bg-white rounded-2xl border border-[#E3ECE7] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEFEA]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#273330]">
                <Briefcase className="w-4 h-4 text-[#16B889]" />
                <span>2. Target Job Description</span>
              </div>
              <span className="text-[11px] text-[#7A8A85] font-medium font-mono">
                {jobDescription ? `${jobDescription.length} chars` : 'Required'}
              </span>
            </div>

            <textarea
              rows={11}
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setErrorMessage(null);
                setMatchIntelligence(null);
              }}
              placeholder="Paste the target job description or posting here (Responsibilities, Tech Stack, Required Qualifications, Nice to haves)..."
              className="w-full text-xs font-sans bg-[#FAFCFA] border border-[#DCE5E0] rounded-xl p-3 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none transition-all resize-y"
            />

            {/* Benchmark Roles */}
            <div className="pt-2 border-t border-[#EEF2F0]">
              <div className="flex items-center justify-between text-[11px] text-[#61706B] mb-1.5">
                <span>Load a benchmark role:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_JOBS.slice(0, 3).map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => {
                      setJobDescription(j.description);
                      setErrorMessage(null);
                      setMatchIntelligence(null);
                    }}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      jobDescription === j.description
                        ? 'bg-[#16B889] text-white border-[#16B889]'
                        : 'bg-[#F7FAF9] text-[#55625F] border-[#E3ECE7] hover:bg-[#EAEFEA]'
                    }`}
                  >
                    Spec: {j.title.split(' ')[0]} ({j.company})
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Action Trigger */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleCalculateMatch}
            disabled={loading || isExtractingFile}
            className="bg-[#16B889] hover:bg-[#139E75] text-white font-bold text-sm px-9 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Auditing Evidence & Calculating Intelligence...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Calculate Job Match Intelligence</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-[#7A8A85] mt-2">
            Deterministic evaluation — extracts explicit requirements, checks contextual evidence excerpts, and avoids false positives.
          </p>
        </div>

        {/* RESULTS: JOB MATCH INTELLIGENCE CARD */}
        {matchIntelligence && (
          <div className="bg-white rounded-3xl border border-[#DCE7E2] shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            
            {/* Top Score Summary Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#EEF3F0]">
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-2xl shadow-inner ${
                  scoreDisplay >= 80 
                    ? 'bg-[#EAFBF5] text-[#127F5C] border border-[#BDEBDC]' 
                    : scoreDisplay >= 60 
                    ? 'bg-[#FEF5E7] text-[#D9822B] border border-[#FADBAA]' 
                    : 'bg-[#FEECEB] text-[#E15241] border border-[#FDC8C5]'
                }`}>
                  <span>{scoreDisplay}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#788582]">Match</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#1F2926]">
                      {scoreDisplay >= 80 ? 'Strong Evidence Alignment' : scoreDisplay >= 60 ? 'Moderate Alignment' : 'Substantial Evidence Gaps'}
                    </h3>
                    <span className="text-[10px] bg-[#F4F8F6] text-[#55625F] px-2 py-0.5 rounded font-mono font-bold">
                      Calculated {matchIntelligence.calculatedAt}
                    </span>
                  </div>
                  <p className="text-xs text-[#55625F]">
                    {matchIntelligence.matches.filter(m => m.status === 'MATCHED').length} of {matchIntelligence.requirements.length} job requirements supported with verified resume excerpts.
                  </p>
                </div>
              </div>

              {/* View Full Report Button */}
              <button
                type="button"
                onClick={handleGenerateFullReport}
                className="bg-[#273330] hover:bg-[#1F2926] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>View Full Diagnostic Report</span>
                <ChevronRight className="w-4 h-4 text-[#16B889]" />
              </button>
            </div>

            {/* Transparent Calculation Explanation Box */}
            <div className="bg-[#F8FAF9] border border-[#E3ECE7] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#273330]">
                <Scale className="w-4 h-4 text-[#16B889]" />
                <span>Transparent Scoring Methodology & Formula</span>
              </div>
              <p className="text-xs text-[#55625F] leading-relaxed">
                {matchIntelligence.audit.explanation}
              </p>
              <div className="bg-white p-3 rounded-xl border border-[#DCE7E2] text-xs font-mono text-[#273330] flex flex-wrap items-center justify-between gap-2">
                <span>Formula: Score = 100 × [ Σ (weight_i × score_i) / Σ weight_i ]</span>
                <span className="font-bold text-[#16B889]">Weight: {matchIntelligence.audit.matchedWeight.toFixed(1)} / {matchIntelligence.audit.totalApplicableWeight}</span>
              </div>
            </div>

            {/* Filter Tabs for Requirements */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-[#F4F8F6] p-1 rounded-xl border border-[#DCE7E3]">
                {(['ALL', 'MATCHED', 'MISSING', 'REQUIRED', 'PREFERRED'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeFilter === filter
                        ? 'bg-white text-[#127F5C] shadow-2xs'
                        : 'text-[#697572] hover:text-[#273330]'
                    }`}
                  >
                    {filter === 'ALL' ? `All (${matchIntelligence.matches.length})` : 
                     filter === 'MATCHED' ? `Matched (${matchIntelligence.matches.filter(m => m.status === 'MATCHED').length})` :
                     filter === 'MISSING' ? `Missing (${matchIntelligence.matches.filter(m => m.status === 'NOT FOUND').length})` :
                     filter === 'REQUIRED' ? `Required (${matchIntelligence.matches.filter(m => m.requirement.importanceLevel === 'Required').length})` :
                     `Preferred (${matchIntelligence.matches.filter(m => m.requirement.importanceLevel === 'Preferred').length})`}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#788582]">Showing {displayedMatches.length} requirements</span>
            </div>

            {/* Requirements & Traceable Evidence List */}
            <div className="space-y-3">
              {displayedMatches.map((m) => {
                const isMatched = m.status === 'MATCHED';
                const isPartial = m.status === 'PARTIAL';

                return (
                  <div 
                    key={m.requirement.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isMatched 
                        ? 'bg-[#FCFDFD] border-[#C6EFE0]' 
                        : isPartial
                        ? 'bg-[#FFFCF7] border-[#FADBAA]'
                        : 'bg-[#FFFBFB] border-[#FDC8C5]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          isMatched 
                            ? 'bg-[#EAFBF5] text-[#127F5C]' 
                            : isPartial 
                            ? 'bg-[#FEF5E7] text-[#D9822B]' 
                            : 'bg-[#FEECEB] text-[#E15241]'
                        }`}>
                          {m.status}
                        </span>
                        <span className="text-xs font-bold text-[#1F2926]">
                          {m.requirement.name}
                        </span>
                        <span className="text-[10px] text-[#788582] font-semibold bg-[#F4F8F6] px-2 py-0.5 rounded border border-[#E2EAE6]">
                          {m.requirement.category} • Weight: {m.requirement.weight}x
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.requirement.importanceLevel === 'Required' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.requirement.importanceLevel}
                      </span>
                    </div>

                    {/* Excerpt or Reason */}
                    {m.resumeExcerpt ? (
                      <div className="mt-2 bg-white p-2.5 rounded-lg border border-[#E5ECE9] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#127F5C] flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#16B889]" /> Verified Resume Evidence Excerpt:
                        </span>
                        <p className="text-xs text-[#273330] font-mono italic leading-relaxed">
                          "{m.resumeExcerpt}"
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 bg-white p-2.5 rounded-lg border border-[#FDC8C5] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E15241] flex items-center gap-1">
                          <X className="w-3 h-3 text-red-500" /> Evidence Not Found:
                        </span>
                        <p className="text-xs text-[#55625F] leading-relaxed">
                          {m.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
