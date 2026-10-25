import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  AlertTriangle,
  Send,
  Building2,
  User,
  Briefcase,
  Layers,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { generateCoverLetter, CoverLetterResponse } from '../services/api';
import { ResumeData } from '../types/resumeBuilder';

interface CoverLetterPageProps {
  onBackToHome: () => void;
}

const STORAGE_KEY = 'hirelens_resume_builder_full_draft';

export const CoverLetterPage: React.FC<CoverLetterPageProps> = ({ onBackToHome }) => {
  const [candidateName, setCandidateName] = useState('Alex Morgan');
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [companyName, setCompanyName] = useState('Stripe');
  const [experienceSnippet, setExperienceSnippet] = useState(
    '5+ years building distributed React/Node.js web systems. Architected Redis caching reducing API response times by 35% across 40k+ daily sessions. Led cross-functional product delivery for payment workflows.'
  );
  const [tone, setTone] = useState('Professional & Confident');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<CoverLetterResponse | null>(null);
  const [editableContent, setEditableContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Import from Resume Studio draft
  const handleImportFromStudio = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setError('No saved resume found in Resume Studio. Please build or import a resume in Resume Studio first.');
        return;
      }
      const data: ResumeData = JSON.parse(raw);
      if (data.personal?.fullName) {
        setCandidateName(data.personal.fullName);
      }
      if (data.personal?.targetTitle) {
        setJobTitle(data.personal.targetTitle);
      }
      let summarySnippet = data.summary || '';
      if (data.experience && data.experience.length > 0) {
        const topExp = data.experience[0];
        summarySnippet += ` Recent role: ${topExp.role} at ${topExp.company}`;
        if (topExp.bullets && topExp.bullets.length > 0) {
          summarySnippet += ` Key achievement: ${topExp.bullets[0]}`;
        }
      }
      if (summarySnippet) {
        setExperienceSnippet(summarySnippet.trim());
      }
      setError(null);
    } catch (e: any) {
      setError('Failed to import details from Resume Studio.');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobTitle.trim()) {
      setError('Please provide a target job title.');
      return;
    }
    if (!companyName.trim()) {
      setError('Please provide the company name.');
      return;
    }

    setLoading(true);
    try {
      const data = await generateCoverLetter({
        candidateName,
        jobTitle,
        companyName,
        experienceSnippet,
        tone
      });
      setGeneratedResult(data);
      setEditableContent(data.content);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([editableContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidateName.replace(/\s+/g, '_')}_Cover_Letter_${companyName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClear = () => {
    setEditableContent('');
    setGeneratedResult(null);
  };

  const wordCount = editableContent.split(/\s+/).filter(Boolean).length;

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
                <FileCheck className="w-4 h-4 text-[#16B889]" />
                HireLens Cover Letter Generator
              </h1>
              <p className="text-[11px] text-[#7A8A85]">Tailored, high-converting cover letters matching your resume experience</p>
            </div>
          </div>
          
          <button
            onClick={handleImportFromStudio}
            className="flex items-center gap-1.5 text-xs font-bold text-[#129A72] bg-[#EAF8F3] hover:bg-[#D5F2E7] border border-[#BDEBDC] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            title="Import applicant details from Resume Studio"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Import from Resume Studio</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* Intro */}
        <div className="max-w-2xl mx-auto text-center space-y-2 no-print">
          <span className="text-[11.5px] font-bold uppercase tracking-[2px] text-[#16B889] font-mono">
            AI COVER LETTER BUILDER
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222E2B] tracking-tight">
            Generate a targeted cover letter in seconds
          </h2>
          <p className="text-xs sm:text-sm text-[#55625F] leading-relaxed">
            Hiring managers look for genuine alignment between your verified achievements and their company mission. Fill out the details below to generate a tailored letter.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: FORM INPUTS */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E3ECE7] p-6 space-y-5 shadow-2xs no-print">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#273330] border-b border-[#F0F4F2] pb-3">
              Application Details
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#98A8A3] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg pl-9 pr-3 py-2 text-[#273330] focus:border-[#16B889] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Target Role / Job Title</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#98A8A3] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg pl-9 pr-3 py-2 text-[#273330] focus:border-[#16B889] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Target Company</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#98A8A3] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, Airbnb, Google"
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg pl-9 pr-3 py-2 text-[#273330] focus:border-[#16B889] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Key Experience Points to Highlight</label>
                <textarea
                  rows={4}
                  value={experienceSnippet}
                  onChange={e => setExperienceSnippet(e.target.value)}
                  placeholder="Paste 1-3 bullet points or skills from your resume that directly prove your impact..."
                  className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg p-3 text-[#273330] focus:border-[#16B889] outline-none resize-y"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Tone & Voice</label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                  className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 text-[#273330] focus:border-[#16B889] outline-none cursor-pointer"
                >
                  <option value="Professional & Confident">Professional & Confident</option>
                  <option value="Concise & Impact-Driven">Concise & Impact-Driven</option>
                  <option value="Warm & Passionate">Warm & Passionate</option>
                  <option value="Executive & Strategic">Executive & Strategic</option>
                </select>
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
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-[#16B889] hover:bg-[#139E75] text-white shadow-sm cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Cover Letter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Cover Letter</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: PREVIEW & LIVE EDITOR */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E3ECE7] p-6 space-y-5 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-3 no-print">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#16B889]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#273330]">
                  Cover Letter Preview & Editor
                </h3>
              </div>
              
              {editableContent && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#16B889] bg-[#EAF8F3] hover:bg-[#D5F2E7] px-2.5 py-1 rounded-md cursor-pointer transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#55625F] bg-[#F0F5F2] hover:bg-[#E4ECE8] px-2.5 py-1 rounded-md cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>TXT</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#55625F] bg-[#F0F5F2] hover:bg-[#E4ECE8] px-2.5 py-1 rounded-md cursor-pointer transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    title="Clear content"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {editableContent ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-[#7A8A85] font-mono no-print">
                  <span>Word Count: {wordCount} words</span>
                  <span>Editable Preview</span>
                </div>
                <textarea
                  rows={16}
                  value={editableContent}
                  onChange={e => setEditableContent(e.target.value)}
                  className="w-full flex-1 text-xs font-serif leading-relaxed bg-[#F9FBFA] border border-[#D9E3DF] rounded-xl p-4 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none resize-y"
                />

                {generatedResult?.highlights && generatedResult.highlights.length > 0 && (
                  <div className="p-4 bg-[#F2FBF7] rounded-xl border border-[#CCEFE1] space-y-2 no-print">
                    <span className="text-[11px] font-bold text-[#16B889] uppercase tracking-wider font-mono">
                      Alignment Highlights
                    </span>
                    <ul className="space-y-1">
                      {generatedResult.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-[#355248] flex items-center gap-2">
                          <Check className="w-3 h-3 text-[#16B889] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3 my-auto">
                <div className="w-12 h-12 rounded-full bg-[#EAF8F3] text-[#16B889] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h4 className="text-xs font-extrabold text-[#273330]">No Cover Letter Generated Yet</h4>
                  <p className="text-[11px] text-[#7A8A85]">
                    Fill in your application details on the left or import from Resume Studio, then click Generate.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
