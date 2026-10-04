import React, { useState } from 'react';
import { AnalysisReport } from '../services/api';
import { ReportSidebar } from '../components/ReportSidebar';
import { ScoreCircle } from '../components/ScoreCircle';
import { CheckCategory, CategorySummary } from '../components/CheckCategory';
import { ActionPlan } from '../components/ActionPlan';
import { JobMatchCard } from '../components/JobMatchCard';
import { SkillGapCard } from '../components/SkillGapCard';
import { ResumeFixerModal } from '../components/ResumeFixerModal';
import { Download, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Sparkles, FileText, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react';

interface ReportPageProps {
  report: AnalysisReport;
  onAnalyzeAnother: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({ report, onAnalyzeAnother }) => {
  const [activeSection, setActiveSection] = useState('sec-overview');
  const [fixerModalOpen, setFixerModalOpen] = useState(false);
  const [fixerOriginalText, setFixerOriginalText] = useState('');
  const [fixerReason, setFixerReason] = useState('');

  // Scroll smoothly to section
  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openFixer = (sampleText: string, reasonText?: string) => {
    setFixerOriginalText(sampleText || 'Worked on a website using React.');
    setFixerReason(reasonText || 'Statement is passive and lacks measurable outcomes.');
    setFixerModalOpen(true);
  };

  const handlePrintDownload = () => {
    window.print();
  };

  // Prepare Category Summaries for CheckCategory component
  const categorySummaries: CategorySummary[] = [
    {
      id: 'sec-ats',
      name: 'ATS Essentials',
      status: `${report.categories.ats.passedChecks}/${report.categories.ats.totalChecks} checks passed`,
      passedCount: report.categories.ats.passedChecks,
      totalCount: report.categories.ats.totalChecks,
      iconName: 'ats',
    },
    {
      id: 'sec-structure',
      name: 'Resume Structure',
      status: 'Standard Sections Found',
      issueCount: report.categories.structure.items.filter((i) => i.status !== 'Found').length,
      iconName: 'structure',
    },
    {
      id: 'sec-content',
      name: 'Content Quality',
      status: `${report.categories.content.weakBullets.length} Improvements`,
      issueCount: report.categories.content.weakBullets.length,
      iconName: 'content',
    },
    {
      id: 'sec-skills',
      name: 'Skills & Stack',
      status: `${report.categories.skills.detectedSkills.length} Tech Skills Detected`,
      iconName: 'skills',
    },
    {
      id: 'sec-keywords',
      name: 'Keywords & Job Match',
      status: `${report.categories.keywords.matchedCount} Found / ${report.categories.keywords.missingCount} Missing`,
      issueCount: report.categories.keywords.missingCount,
      iconName: 'keywords',
    },
    {
      id: 'sec-recruiter',
      name: 'Recruiter Signals',
      status: `${report.categories.recruiter.strengths.length} Strengths / ${report.categories.recruiter.improvements.length} Fixes`,
      issueCount: report.categories.recruiter.improvements.length,
      iconName: 'recruiter',
    },
  ];

  const formattedDate = new Date(report.analyzedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 8. REPORT HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#168F70] bg-[#DDF6EC] border border-[#35C99A]/40 px-2.5 py-0.5 rounded font-mono">
              HireLens Resume Check
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Analyzed: {formattedDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {report.fileName}
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Target Analysis Mode: {report.jobDescription ? 'Specific Job Posting Comparison' : 'General Role Benchmark'}
          </p>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3 no-print shrink-0">
          <button
            onClick={handlePrintDownload}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Download Report
          </button>

          <button
            onClick={onAnalyzeAnother}
            className="px-4 py-2.5 bg-[#35C99A] hover:bg-[#168F70] text-[#101716] hover:text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Analyze Another Resume
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        
        {/* LEFT: Sticky Summary & Navigation */}
        <ReportSidebar
          score={report.overallScore}
          atsScore={report.atsScore}
          contentScore={report.contentScore}
          skillsScore={report.skillsScore}
          recruiterScore={report.recruiterScore}
          activeSection={activeSection}
          onNavigateSection={handleNavigateSection}
          fileName={report.fileName}
        />

        {/* RIGHT: Detailed Report Sections */}
        <main className="flex-1 w-full space-y-8 min-w-0">
          
          {/* SECTION 1: Overall Score */}
          <section id="sec-overview">
            <ScoreCircle
              score={report.overallScore}
            />
          </section>

          {/* Checklist Categories Quick Bar */}
          <section>
            <CheckCategory
              categories={categorySummaries}
              activeCategoryId={activeSection}
              onSelectCategory={handleNavigateSection}
            />
          </section>

          {/* SECTION 2: ATS Essentials */}
          <section id="sec-ats" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  ATS Essentials
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {report.categories.ats.score}% ATS Compliance
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Can your resume be parsed and understood correctly by automated Applicant Tracking Systems?
              </p>
            </div>

            <div className="space-y-3">
              {report.categories.ats.items.map((item, idx) => {
                const isProblem = item.status.toLowerCase().includes('problem') || item.status.toLowerCase().includes('missing');
                const isWarning = item.status.toLowerCase().includes('attention') || item.status.toLowerCase().includes('improved');

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {item.passed && !isProblem ? (
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                      ) : isProblem ? (
                        <XCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {item.detail}
                        </div>
                      </div>
                    </div>

                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded border self-start sm:self-center flex items-center gap-1 ${
                      item.passed && !isProblem
                        ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                        : isProblem
                        ? 'bg-rose-50 text-[#DC2626] border-rose-200'
                        : 'bg-amber-50 text-[#D97706] border-amber-200'
                    }`}>
                      {item.passed && !isProblem ? '✓ Passed' : isProblem ? '✕ Problem' : '! Needs attention'}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: Resume Structure */}
          <section id="sec-structure" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Resume Structure
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Essential section headings, chronological layout, and standard document organization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.categories.structure.items.map((sec, idx) => {
                const isFound = sec.status === 'Found' || sec.status.toLowerCase().includes('passed');
                const isMissing = sec.status === 'Missing' || sec.status.toLowerCase().includes('not detected');

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        {sec.name}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1 ${
                        isFound
                          ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                          : isMissing
                          ? 'bg-rose-50 text-[#DC2626] border-rose-200'
                          : 'bg-amber-50 text-[#D97706] border-amber-200'
                      }`}>
                        {isFound ? '✓ Found' : isMissing ? '✕ Not detected' : '! Could be improved'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {sec.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 4: Content Quality & Bullet Improvements */}
          <section id="sec-content" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Content Quality & Achievement Bullets
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluates action verbs, quantifiable metrics, specificity, and impact statements.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                  {report.categories.content.quantifiedAchievementsCount} Quantified Metrics Found
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {report.categories.content.weakBullets.length === 0 ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  No weak or generic bullet points detected. Excellent work!
                </div>
              ) : (
                report.categories.content.weakBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider bg-rose-100 border border-rose-200 px-2 py-0.5 rounded">
                        WEAK BULLET #{idx + 1}
                      </span>

                      <button
                        onClick={() => openFixer(bullet.original, bullet.reason)}
                        className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg shadow-2xs transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Fix this
                      </button>
                    </div>

                    <p className="text-xs font-mono text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                      • "{bullet.original}"
                    </p>

                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-900">Why it needs improvement:</span> {bullet.reason}
                    </div>

                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs text-emerald-950">
                      <span className="font-bold text-emerald-900 block mb-0.5">Suggested Improvement:</span>
                      <p className="font-mono text-emerald-800">
                        • {bullet.suggestion}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 5: Skills Analysis */}
          <section id="sec-skills" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Detected Skills & Technical Stack
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verified technical languages, frameworks, cloud databases, and software methodologies.
              </p>
            </div>

            {/* Detected Skills Chips */}
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Detected Skills ({report.categories.skills.detectedSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {report.categories.skills.detectedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 rounded-lg"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Strength Categories */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Skill Domain Evaluation
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {report.categories.skills.skillStrength.map((st, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{st.category}</span>
                    <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{st.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: Keyword Analysis */}
          <section id="sec-keywords" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Keyword Alignment Analysis
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Comparison against essential industry skills and targeted job requirements.
                </p>
              </div>

              {report.jobDescription && (
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full self-start">
                  Job Match: {report.jobMatchScore}%
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matched Keywords */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                    Matched Keywords ({report.categories.keywords.matchedCount})
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {report.categories.keywords.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono font-medium bg-white text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-rose-800 tracking-wider">
                    Missing Keywords ({report.categories.keywords.missingCount})
                  </span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {report.categories.keywords.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono font-medium bg-white text-rose-900 border border-rose-200 px-2.5 py-1 rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 italic">
              💡 <span className="font-semibold text-slate-800">Pro-Tip:</span> Only add keywords that genuinely reflect your experience. Avoid keyword stuffing or artificial lists.
            </div>
          </section>

          {/* SECTION 7: Recruiter Perspective */}
          <section id="sec-recruiter" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Recruiter Perspective & Human Screen
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                How a senior technical recruiter or hiring manager reviews your resume during a 6-second initial scan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Key Recruiter Strengths
                </span>
                <ul className="space-y-2 text-xs text-slate-700">
                  {report.categories.recruiter.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Areas For Improvement
                </span>
                <ul className="space-y-2 text-xs text-slate-700">
                  {report.categories.recruiter.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 8: Action Plan */}
          <section id="sec-actionplan">
            <ActionPlan
              items={report.actionPlan}
              onOpenFixer={openFixer}
            />
          </section>

          {/* SECTION 9: Matched Jobs & Skill Gaps */}
          <section id="sec-jobmatches" className="space-y-8">
            
            {/* Job Matches */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Jobs That Match Your Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated role compatibility based on skills, experience relevance, and keyword overlap.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.jobMatches.map((job) => (
                  <JobMatchCard key={job.id} job={job} />
                ))}
              </div>
            </div>

            {/* Skill Gap Cards */}
            <SkillGapCard skillGaps={report.skillGaps} />

          </section>

        </main>

      </div>

      {/* Resume Fixer Modal */}
      <ResumeFixerModal
        isOpen={fixerModalOpen}
        onClose={() => setFixerModalOpen(false)}
        originalBullet={fixerOriginalText}
        reason={fixerReason}
      />

    </div>
  );
};
