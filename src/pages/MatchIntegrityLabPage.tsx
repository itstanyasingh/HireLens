import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scale, 
  Layers, 
  Search, 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Printer, 
  Check, 
  Info, 
  Cpu, 
  FileText,
  Target
} from 'lucide-react';
import { runMatchIntegrityLab, MatchIntegrityReport, IntegrityTestResult } from '../services/matchIntegrityLab';

interface MatchIntegrityLabPageProps {
  onBackToHome?: () => void;
  onOpenMatchLab?: () => void;
}

export const MatchIntegrityLabPage: React.FC<MatchIntegrityLabPageProps> = ({
  onBackToHome,
  onOpenMatchLab
}) => {
  const [sampleResume, setSampleResume] = useState<string>(`
ALEX MORGAN
alex.morgan@example.com | (555) 019-2831 | Seattle, WA

SUMMARY
Senior Software Engineer with 6 years of experience building resilient cloud services and web applications.

EXPERIENCE
Senior Software Engineer — CloudScale Systems (2021 - Present)
• Engineered distributed streaming data pipelines in Python and FastAPI, handling 10,000 requests per second.
• Optimized PostgreSQL database indexing and query execution plans, reducing p99 latency by 35%.
• Containerized services using Docker and maintained CI/CD automated deployment pipelines via GitHub Actions.

Software Engineer — WebMatrix Inc (2018 - 2021)
• Developed responsive web applications using React, TypeScript, and Node.js.

EDUCATION
B.S. in Computer Science — University of Washington (2014 - 2018)

SKILLS
Python, TypeScript, React, Node.js, FastAPI, PostgreSQL, Docker, CI/CD, Redis
  `.trim());

  const [sampleJobDescription, setSampleJobDescription] = useState<string>(`
Senior Backend Engineer
Requirements:
• 5+ years of software engineering experience.
• Strong proficiency in Python, FastAPI, and PostgreSQL.
• Hands-on experience with Docker, CI/CD, and Redis.
• Experience with Apache Kafka or distributed event streams is required.
• Bachelor's degree in Computer Science.
  `.trim());

  const [report, setReport] = useState<MatchIntegrityReport | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const handleRunLab = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runMatchIntegrityLab(sampleResume, sampleJobDescription, 'Senior Backend Engineer');
      setReport(res);
      setIsRunning(false);
    }, 400);
  };

  React.useEffect(() => {
    handleRunLab();
  }, []);

  const filteredTests = report?.testResults.filter(t => {
    if (selectedCategoryFilter === 'ALL') return true;
    return t.category === selectedCategoryFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-[#F6F9F8] text-[#273330] pb-24">
      
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E1ECE7] px-6 py-3.5 shadow-2xs no-print">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
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
            <div className="h-4 w-px bg-[#DCE5E0]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#273330] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16B889]" />
                  Match Integrity Lab
                </span>
                <span className="bg-[#E6F8F2] text-[#0E7A5A] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#BFF0DE]">
                  VERIFICATION & SENSITIVITY SUITE
                </span>
              </div>
              <p className="text-[11px] text-[#71827E]">Evidence auditing, keyword-context challenges, robustness tests, and score sensitivity verifications</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMatchLab && (
              <button
                onClick={onOpenMatchLab}
                className="flex items-center gap-1.5 text-xs font-bold text-[#16B889] bg-[#E6F8F2] hover:bg-[#CEF2E5] px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-[#BCEFD9]"
              >
                <Target className="w-4 h-4" />
                <span>Open Match Lab</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-bold text-[#4A5855] bg-white hover:bg-[#F0F5F2] px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-[#D5E1DC]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 pt-8 space-y-8">

        {/* Top Control Panel / Input Fixtures */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DFE8E4] shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#127F5C] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#16B889]" />
              <span>Test Resume Fixture</span>
            </h3>
            <textarea
              value={sampleResume}
              onChange={(e) => setSampleResume(e.target.value)}
              rows={8}
              className="w-full text-xs font-mono p-3 bg-[#F4F8F6] border border-[#D5E1DC] rounded-xl text-[#273330] focus:outline-none focus:ring-2 focus:ring-[#16B889]"
            />
            <p className="text-[11px] text-[#697975]">
              Controlled synthetic resume used for integrity verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DFE8E4] shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#127F5C] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#16B889]" />
              <span>Test Job Description Fixture</span>
            </h3>
            <textarea
              value={sampleJobDescription}
              onChange={(e) => setSampleJobDescription(e.target.value)}
              rows={8}
              className="w-full text-xs font-mono p-3 bg-[#F4F8F6] border border-[#D5E1DC] rounded-xl text-[#273330] focus:outline-none focus:ring-2 focus:ring-[#16B889]"
            />
            <p className="text-[11px] text-[#697975]">
              Target role criteria used to extract requirements and test robustness.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#127F5C] to-[#16B889] p-6 rounded-2xl text-white shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10.5px] uppercase font-extrabold tracking-widest text-emerald-100">Verification Engine</div>
              <h2 className="text-xl font-black mt-1">Run Integrity Lab Suite</h2>
              <p className="text-xs text-emerald-50 mt-2 leading-relaxed">
                Executes evidence audits, keyword-context challenges, structural robustness tests, and score sensitivity invariance checks.
              </p>
            </div>

            <button
              onClick={handleRunLab}
              disabled={isRunning}
              className="w-full bg-white text-[#127F5C] hover:bg-[#F4F9F7] font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running Integrity Tests...' : 'Execute Full Integrity Suite'}</span>
            </button>
          </div>
        </div>

        {report && (
          <>
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#DFE8E4] shadow-2xs space-y-1">
                <div className="text-xs text-[#62726E] font-medium">Original Match Score</div>
                <div className="text-2xl font-black text-[#273330]">
                  {report.originalScore !== null ? `${report.originalScore}%` : 'N/A'}
                </div>
                <div className="text-[11px] text-[#16B889] font-bold">Deterministic calculation</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#DFE8E4] shadow-2xs space-y-1">
                <div className="text-xs text-[#62726E] font-medium">Integrity Tests Passed</div>
                <div className="text-2xl font-black text-[#16B889]">
                  {report.passCount} / {report.totalTestsRun}
                </div>
                <div className="text-[11px] text-[#55625F]">100% execution coverage</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#DFE8E4] shadow-2xs space-y-1">
                <div className="text-xs text-[#62726E] font-medium">Traceable Excerpts</div>
                <div className="text-2xl font-black text-[#273330]">
                  {report.traceableEvidenceCount}
                </div>
                <div className="text-[11px] text-[#127F5C]">Direct quote links</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#DFE8E4] shadow-2xs space-y-1">
                <div className="text-xs text-[#62726E] font-medium">Questionable / Needs Review</div>
                <div className="text-2xl font-black text-[#E67E22]">
                  {report.questionableEvidenceCount}
                </div>
                <div className="text-[11px] text-[#B9770E]">Flagged for manual audit</div>
              </div>
            </div>

            {/* Test Categories Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DFE8E4]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#55625F] mr-2">Filter Category:</span>
                {[
                  { key: 'ALL', label: `All Tests (${report.testResults.length})` },
                  { key: 'Evidence Audit', label: 'Evidence Audit' },
                  { key: 'Keyword Context', label: 'Keyword Context' },
                  { key: 'Resume Robustness', label: 'Resume Robustness' },
                  { key: 'Score Sensitivity', label: 'Score Sensitivity' },
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategoryFilter(cat.key)}
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                      selectedCategoryFilter === cat.key
                        ? 'bg-[#16B889] text-white shadow-2xs'
                        : 'bg-[#F2F6F4] text-[#4F605C] hover:bg-[#E4ECE8]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#62726E] font-semibold">
                Generated at: {new Date(report.generatedAt).toLocaleTimeString()}
              </div>
            </div>

            {/* Test Results Table / Cards */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#273330] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#16B889]" />
                <span>Detailed Test Execution Results ({filteredTests.length})</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {filteredTests.map((t) => (
                  <div 
                    key={t.id} 
                    className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      t.passed ? 'border-[#DFE8E4]' : 'border-red-200 bg-red-50/20'
                    }`}
                  >
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                          t.passed ? 'bg-[#E6F8F2] text-[#0E7A5A]' : 'bg-red-100 text-red-700'
                        }`}>
                          {t.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#273330]">{t.testName}</h4>
                      </div>
                      <p className="text-xs text-[#556360] leading-relaxed">
                        {t.description}
                      </p>
                      <div className="text-[11px] font-mono bg-[#FAFBFB] p-2.5 rounded-xl border border-[#E9EFEA] text-[#334440] space-y-1">
                        <div><strong>Fixture:</strong> {t.inputFixture}</div>
                        <div><strong>Expected:</strong> {t.expectedOutcome} | <strong>Actual:</strong> {t.actualOutcome}</div>
                        <div className="text-[#127F5C]"><strong>Explanation:</strong> {t.explanation}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                      {t.passed ? (
                        <div className="flex items-center gap-1.5 bg-[#E6F8F2] text-[#0E7A5A] text-xs font-extrabold px-3 py-1.5 rounded-xl border border-[#BFF0DE]">
                          <CheckCircle2 className="w-4 h-4 text-[#16B889]" />
                          <span>PASS</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-red-200">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>FAIL</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations & Recommendations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-white p-6 rounded-2xl border border-[#DFE8E4] space-y-3 shadow-2xs">
                <h4 className="text-sm font-bold text-[#273330] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D35400]" />
                  <span>Known Limitations</span>
                </h4>
                <ul className="text-xs text-[#556360] space-y-2 list-disc pl-4 leading-relaxed">
                  {report.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#DFE8E4] space-y-3 shadow-2xs">
                <h4 className="text-sm font-bold text-[#273330] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#16B889]" />
                  <span>Actionable Recommendations</span>
                </h4>
                <ul className="text-xs text-[#556360] space-y-2 list-disc pl-4 leading-relaxed">
                  {report.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
