import React, { useState, useEffect } from 'react';
import { 
  Target, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Printer, 
  RefreshCw, 
  Sliders, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Scale, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  Check, 
  Cpu, 
  AlertCircle,
  Copy,
  Info
} from 'lucide-react';
import { 
  JobRequirement, 
  RequirementMatch, 
  ScoreAudit, 
  DataQualityInspection, 
  SkillGapItem, 
  ResumeSimulationResult,
  ImprovementSuggestion,
  extractRequirementsFromJobDescription,
  matchRequirementsAgainstResume,
  inspectResumeDataQuality,
  generateSkillGapsAndRoadmap,
  simulateResumeImprovement,
  generateTruthfulSuggestions,
  recalculateScoreWithWeights,
  WeightRecalculationResult
} from '../services/evidenceEngine';
import { getHistory, saveToHistory, AnalysisReport } from '../services/api';
import { downloadMatchLabAuditReport } from '../utils/reportExporter';

interface MatchLabPageProps {
  onBackToHome?: () => void;
  onSendToReport?: (report: AnalysisReport) => void;
}

type TabMode = 'match-table' | 'skill-gaps' | 'simulator' | 'inspector' | 'audit';

export const MatchLabPage: React.FC<MatchLabPageProps> = ({ onBackToHome }) => {
  // 1. Initial State from history if available
  const history = getHistory();
  const latest = history[0];

  const defaultResume = latest?.resumeText || `SARAH CHEN
Senior Backend Engineer | San Francisco, CA
sarah.chen@example.com | (555) 789-2345 | linkedin.com/in/sarahchen | github.com/sarahchen

PROFESSIONAL SUMMARY
Results-driven backend software engineer with 6 years of experience building high-throughput APIs, distributed systems, and real-time microservices in Python, Node.js, and TypeScript.

WORK EXPERIENCE
Senior Backend Engineer — FinTech Data Corp (2021 - Present)
• Architected high-throughput payment settlement engine using Python, FastAPI, and PostgreSQL, processing $25M+ in weekly volume with 99.99% uptime.
• Optimized PostgreSQL query execution plans and database connection pooling, reducing 95th-percentile response latency by 42%.
• Containerized microservices with Docker and deployed automated CI/CD integration workflows using GitHub Actions.
• Implemented caching tier using Redis to handle 12,000+ cache read operations per second.

Software Engineer — CloudScale Labs (2018 - 2021)
• Built scalable REST APIs using Node.js, Express, and TypeScript for enterprise customers.
• Collaborated in cross-functional agile sprints and participated in weekly peer code reviews.

EDUCATION
B.S. in Computer Science — University of California, Berkeley (2014 - 2018)

SKILLS & TECHNOLOGIES
Languages: Python, TypeScript, JavaScript, SQL
Backend: FastAPI, Node.js, Express, REST APIs, Redis, PostgreSQL
Tools & Cloud: Docker, Git, CI/CD, GitHub Actions, Linux, Agile`;

  const defaultJobDescription = `Senior Backend Engineer — Platform Core

About the Role:
We are seeking an experienced Senior Backend Engineer to design and scale our mission-critical data processing architecture.

Key Requirements:
• 5+ years of experience in backend software engineering with high-scale systems.
• Proven expertise in Python, TypeScript, or Go.
• Deep proficiency in PostgreSQL, relational database indexing, and query optimization.
• Hands-on experience with Redis caching strategies.
• Experience with containerization using Docker and Kubernetes cluster management.
• Solid background in building and maintaining CI/CD automated deployment pipelines.
• Experience with Apache Kafka or event-driven messaging is a strong plus.
• Strong foundation in Computer Science principles and distributed system design.
• B.S. or M.S. degree in Computer Science, STEM, or equivalent practical experience.`;

  const [resumeText, setResumeText] = useState<string>(defaultResume);
  const [jobDescription, setJobDescription] = useState<string>(defaultJobDescription);
  const [extractedRequirements, setExtractedRequirements] = useState<JobRequirement[]>([]);
  const [matches, setMatches] = useState<RequirementMatch[]>([]);
  const [audit, setAudit] = useState<ScoreAudit | null>(null);
  const [qualityInspection, setQualityInspection] = useState<DataQualityInspection | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>([]);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);

  // Simulation State
  const [revisedResume, setRevisedResume] = useState<string>(defaultResume);
  const [simulationResult, setSimulationResult] = useState<ResumeSimulationResult | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<TabMode>('match-table');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);
  const [recalcResult, setRecalcResult] = useState<WeightRecalculationResult | null>(null);
  const [newReqName, setNewReqName] = useState('');
  const [newReqWeight, setNewReqWeight] = useState(3);
  const [showFormulaAudit, setShowFormulaAudit] = useState(false);
  const [claimedEvidenceSkill, setClaimedEvidenceSkill] = useState<string | null>(null);
  const [claimedEvidenceText, setClaimedEvidenceText] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Initial Calculation
  useEffect(() => {
    recalculateAll(resumeText, jobDescription);
  }, []);

  const recalculateAll = (rText: string, jdText: string, customReqs?: JobRequirement[]) => {
    // 1. Data Quality Inspection
    const inspection = inspectResumeDataQuality(rText);
    setQualityInspection(inspection);

    // 2. Requirements Extraction
    const reqs = customReqs || extractRequirementsFromJobDescription(jdText);
    setExtractedRequirements(reqs);

    // 3. Evidence-Based Requirement Matching
    const evalResult = matchRequirementsAgainstResume(rText, reqs);
    setMatches(evalResult.matches);
    setAudit(evalResult.audit);

    // 4. Skill Gaps & Roadmap
    const gaps = generateSkillGapsAndRoadmap(evalResult.matches);
    setSkillGaps(gaps);

    // 5. Truthful Improvement Suggestions
    const suggs = generateTruthfulSuggestions(evalResult.matches, rText);
    setSuggestions(suggs);

    // 6. Run baseline simulation if revised differs
    if (revisedResume !== rText) {
      const sim = simulateResumeImprovement(rText, revisedResume, reqs);
      setSimulationResult(sim);
    } else {
      setSimulationResult(null);
    }
  };

  const handleUpdateWeight = (id: string, newWeight: number) => {
    const updated = extractedRequirements.map(r => {
      if (r.id === id) {
        return { ...r, weight: newWeight, userEdited: true };
      }
      return r;
    });
    setExtractedRequirements(updated);

    // Run explainable recalculation tool
    const result = recalculateScoreWithWeights(matches, { [id]: newWeight });
    setRecalcResult(result);
    setMatches(result.updatedMatches);
    setAudit(result.recalculatedAudit);
  };

  const handleDeleteRequirement = (id: string) => {
    const updated = extractedRequirements.filter(r => r.id !== id);
    setExtractedRequirements(updated);
    const evalResult = matchRequirementsAgainstResume(resumeText, updated);
    setMatches(evalResult.matches);
    setAudit(evalResult.audit);
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqName.trim()) return;

    const newReq: JobRequirement = {
      id: `custom-req-${Date.now()}`,
      name: newReqName.trim(),
      category: 'technical_skill',
      weight: newReqWeight,
      importanceLevel: newReqWeight >= 3 ? 'Required' : newReqWeight === 2 ? 'Preferred' : 'Optional',
      sourceExcerpt: `Custom requirement added by candidate: "${newReqName.trim()}"`,
      normalizedTerm: newReqName.trim().toLowerCase(),
      userEdited: true
    };

    const updated = [...extractedRequirements, newReq];
    setExtractedRequirements(updated);
    setNewReqName('');
    const evalResult = matchRequirementsAgainstResume(resumeText, updated);
    setMatches(evalResult.matches);
    setAudit(evalResult.audit);
    setStatusNotice(`Added requirement "${newReq.name}".`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  // Add evidence to a skill gap and update resume
  const handleConfirmPossessedSkill = () => {
    if (!claimedEvidenceSkill || !claimedEvidenceText.trim()) return;

    const evidenceLine = `• Proven experience with ${claimedEvidenceSkill}: ${claimedEvidenceText.trim()}`;
    const updatedResume = `${resumeText}\n\n${evidenceLine}`;
    
    setResumeText(updatedResume);
    setRevisedResume(updatedResume);
    recalculateAll(updatedResume, jobDescription, extractedRequirements);

    setStatusNotice(`Evidence for "${claimedEvidenceSkill}" added to resume and match score updated.`);
    setClaimedEvidenceSkill(null);
    setClaimedEvidenceText('');
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handleRunSimulation = () => {
    const sim = simulateResumeImprovement(resumeText, revisedResume, extractedRequirements);
    setSimulationResult(sim);
  };

  const handleApplyRevisionToOriginal = () => {
    setResumeText(revisedResume);
    recalculateAll(revisedResume, jobDescription, extractedRequirements);
    setSimulationResult(null);
    setStatusNotice('Revised resume accepted! Match score, evidence, and quality audit updated.');
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handleResetRevision = () => {
    setRevisedResume(resumeText);
    setSimulationResult(null);
  };

  // Filtered requirements list
  const filteredMatches = matches.filter(m => {
    if (statusFilter === 'ALL') return true;
    return m.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-[#F6F9F8] text-[#273330] pb-24">
      
      {/* Top Banner Navigation */}
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
                  <Target className="w-4 h-4 text-[#16B889]" />
                  HireLens Match Lab
                </span>
                <span className="bg-[#E6F8F2] text-[#0E7A5A] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#BFF0DE]">
                  EXPLAINABLE SIMULATOR
                </span>
              </div>
              <p className="text-[11px] text-[#71827E]">Transparent, evidence-based matching with mathematical formula audit</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFormulaAudit(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#16B889] bg-[#EAFBF5] hover:bg-[#DCF8EE] border border-[#BFF0DF] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Formula Audit</span>
            </button>
            {audit && (
              <button
                onClick={() => downloadMatchLabAuditReport({
                  fileName: 'Candidate_Resume.pdf',
                  audit,
                  matches,
                  qualityInspection,
                  skillGaps
                })}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#145C44] bg-[#E6F8F2] hover:bg-[#D4F4EA] border border-[#BDEBDC] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit (.txt)</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#485552] bg-white hover:bg-[#F3F7F5] border border-[#D5E1DC] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Status Notification */}
      {statusNotice && (
        <div className="max-w-2xl mx-auto mt-4 px-4">
          <div className="p-3.5 bg-[#EAFBF5] border border-[#BCEFD9] rounded-xl text-xs font-medium text-[#0D6E50] flex items-center gap-2 shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#16B889] shrink-0" />
            <span>{statusNotice}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Section 1: Dual Input & Extracted Text Review */}
        <div className="bg-white rounded-2xl border border-[#DFE8E4] shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EEF4F1] gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#273330] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#16B889]" />
                Resume & Target Job Inputs
              </h2>
              <p className="text-xs text-[#6F7E7A]">
                Review the actual text extracted from your resume and target role. Every requirement and score is derived from these real inputs.
              </p>
            </div>
            <button
              onClick={() => recalculateAll(resumeText, jobDescription)}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#16B889] hover:bg-[#139E75] px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalculate Match</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Resume Text Area & Word Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#3B4845] flex items-center gap-1.5">
                  <span>Candidate Resume Content</span>
                  <span className="text-[11px] text-[#7E8E8A] font-normal">
                    ({resumeText.split(/\s+/).filter(Boolean).length} words)
                  </span>
                </label>
                {qualityInspection && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    qualityInspection.readinessScore >= 80 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    Data Readiness: {qualityInspection.readinessScore}% ({qualityInspection.overallStatus})
                  </span>
                )}
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setRevisedResume(e.target.value);
                }}
                rows={9}
                placeholder="Paste or review your resume text here..."
                className="w-full text-xs font-mono p-3.5 bg-[#FAFBFB] rounded-xl border border-[#D8E4DF] focus:border-[#16B889] focus:bg-white outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Right: Job Description Text Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#3B4845] flex items-center gap-1.5">
                  <span>Target Job Description</span>
                  <span className="text-[11px] text-[#7E8E8A] font-normal">
                    ({jobDescription.split(/\s+/).filter(Boolean).length} words)
                  </span>
                </label>
                <span className="text-[10px] font-semibold text-[#16B889] bg-[#E8F8F2] px-2 py-0.5 rounded-full border border-[#C7F0E1]">
                  {extractedRequirements.length} Requirements Detected
                </span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={9}
                placeholder="Paste the target job description here..."
                className="w-full text-xs font-mono p-3.5 bg-[#FAFBFB] rounded-xl border border-[#D8E4DF] focus:border-[#16B889] focus:bg-white outline-none transition-all leading-relaxed"
              />
            </div>

          </div>

          {/* Quick Stats Bar */}
          {audit && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#F6FAF8] border border-[#E2EBE7]">
                <div className="text-[11px] text-[#6E7F7B] font-medium">Assessed Requirements</div>
                <div className="text-xl font-extrabold text-[#273330] mt-0.5">
                  {audit.assessedCount} <span className="text-xs font-normal text-[#8E9E9A]">/ {audit.totalRequirementsCount}</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F0FAF5] border border-[#CEEDE1]">
                <div className="text-[11px] text-[#127F5C] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16B889]" /> Fully Matched
                </div>
                <div className="text-xl font-extrabold text-[#117C5B] mt-0.5">
                  {audit.matchedCount} <span className="text-xs font-normal text-[#16B889]">({audit.matchedWeight.toFixed(1)} pts)</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FDF9F2] border border-[#F4E3C5]">
                <div className="text-[11px] text-[#A66E14] font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D9822B]" /> Partially Matched
                </div>
                <div className="text-xl font-extrabold text-[#B07415] mt-0.5">
                  {audit.partialCount} <span className="text-xs font-normal text-[#D9822B]">({audit.partialWeight.toFixed(1)} pts)</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FCF3F3] border border-[#F5D5D5]">
                <div className="text-[11px] text-[#C0392B] font-semibold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-[#E74C3C]" /> Not Found in Resume
                </div>
                <div className="text-xl font-extrabold text-[#C0392B] mt-0.5">
                  {audit.notFoundCount} <span className="text-xs font-normal text-[#E74C3C]">(0.0 pts)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Score Overview & Transparent Formula Banner */}
        {audit && audit.isReliable ? (
          <div className="bg-gradient-to-r from-[#16B889]/10 via-[#F3FAF7] to-white rounded-2xl border border-[#CFEBE0] p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-5">
                {/* Visual Score Ring */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 border-[#16B889] flex flex-col items-center justify-center shadow-md shrink-0">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#273330] tracking-tight">
                    {audit.overallScore}%
                  </span>
                  <span className="text-[9.5px] font-bold text-[#16B889] uppercase tracking-wider">
                    Match
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#273330]">
                      Documented Match Estimate
                    </h3>
                    <span className="bg-[#D8F5EA] text-[#0C6E4E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Zero Hallucination
                    </span>
                  </div>
                  <p className="text-xs text-[#526360] max-w-xl leading-relaxed">
                    Score calculated from <strong className="text-[#273330]">{audit.assessedCount} actual requirements</strong> using the formula:
                    <code className="ml-1 px-1.5 py-0.5 bg-white border border-[#D5E6E0] rounded text-[11px] font-mono text-[#0F7553]">
                      Score = 100 × [Σ(wᵢ × sᵢ) / Σwᵢ]
                    </code>
                  </p>
                  <div className="text-[11px] font-mono text-[#4F605C] pt-1">
                    Calculation: {audit.intermediateCalculation}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                <button
                  onClick={() => setShowFormulaAudit(true)}
                  className="flex items-center justify-center gap-2 text-xs font-bold text-[#16B889] bg-white hover:bg-[#F2FAF6] border border-[#BDEBDC] px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  <span>Why this score?</span>
                </button>
                <button
                  onClick={() => setIsEditingRequirements(!isEditingRequirements)}
                  className="flex items-center justify-center gap-2 text-xs font-bold text-[#44524F] bg-white hover:bg-[#F4F8F6] border border-[#D5E1DC] px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{isEditingRequirements ? 'Done Editing Weights' : 'Adjust Weights & Add'}</span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold">Unable to calculate a reliable score</div>
              <div className="text-xs text-amber-700 mt-0.5">
                {audit?.unreliableReason || 'Please provide both resume text and a target job description with extractable requirements.'}
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Requirements Customization Drawer (if editing is active) */}
        {isEditingRequirements && (
          <div className="bg-[#FAFDFB] rounded-2xl border-2 border-[#16B889]/40 p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#273330] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#16B889]" />
                  Edit Requirements & Scoring Weights
                </h3>
                <p className="text-xs text-[#6B7B77]">
                  Adjust weight (1 = Optional, 2 = Preferred, 3 = Required, 4-5 = Critical). You can also add custom role qualifications.
                </p>
              </div>
              <span className="text-xs text-[#16B889] font-bold bg-[#E8F9F3] px-2.5 py-1 rounded-full">
                {extractedRequirements.length} Active Criteria
              </span>
            </div>

            {/* Add Custom Requirement Form */}
            <form onSubmit={handleAddRequirement} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <input
                type="text"
                value={newReqName}
                onChange={(e) => setNewReqName(e.target.value)}
                placeholder="Add custom requirement (e.g. GraphQL, Kubernetes, Microservices)..."
                className="w-full sm:flex-1 text-xs p-2.5 bg-white rounded-xl border border-[#D3E0DB] focus:border-[#16B889] outline-none"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={newReqWeight}
                  onChange={(e) => setNewReqWeight(Number(e.target.value))}
                  className="text-xs p-2.5 bg-white rounded-xl border border-[#D3E0DB] focus:border-[#16B889] outline-none font-semibold text-[#3B4845]"
                >
                  <option value={1}>Weight 1 (Optional)</option>
                  <option value={2}>Weight 2 (Preferred)</option>
                  <option value={3}>Weight 3 (Required)</option>
                  <option value={4}>Weight 4 (High Priority)</option>
                  <option value={5}>Weight 5 (Critical Core)</option>
                </select>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#16B889] hover:bg-[#139E75] px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Criterion</span>
                </button>
              </div>
            </form>

            {/* List of requirements with interactive weight changers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 max-h-72 overflow-y-auto pr-1">
              {extractedRequirements.map(req => (
                <div key={req.id} className="p-3 bg-white rounded-xl border border-[#E1ECE7] flex items-center justify-between gap-2 shadow-2xs">
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#273330] truncate">{req.name}</div>
                    <div className="text-[10px] text-[#7E8E8A] capitalize">{req.category.replace('_', ' ')}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={req.weight}
                      onChange={(e) => handleUpdateWeight(req.id, Number(e.target.value))}
                      className="text-[11px] font-bold p-1 bg-[#F4F8F6] rounded border border-[#D5E1DC] text-[#127F5C]"
                    >
                      <option value={1}>w: 1</option>
                      <option value={2}>w: 2</option>
                      <option value={3}>w: 3</option>
                      <option value={4}>w: 4</option>
                      <option value={5}>w: 5</option>
                    </select>
                    <button
                      onClick={() => handleDeleteRequirement(req.id)}
                      className="p-1 text-[#C0392B] hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Remove requirement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Explainable Recalculation Breakdown Tool */}
            {recalcResult && recalcResult.weightChanges.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-[#F0FAF6] border border-[#BCEFD9] space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#16B889]" />
                    <span className="text-xs font-bold text-[#127F5C] uppercase tracking-wider">
                      Explainable Score Recalculation Breakdown
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#55625F]">Previous: <strong className="text-[#273330]">{recalcResult.previousScore}%</strong></span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8E9E9A]" />
                    <span className="text-xs font-bold text-[#16B889] bg-white px-2 py-0.5 rounded-lg border border-[#BCEFD9] shadow-2xs">
                      Recalculated: {recalcResult.recalculatedScore}%
                    </span>
                    <span className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded ${
                      recalcResult.scoreDelta > 0 
                        ? 'bg-[#16B889] text-white' 
                        : recalcResult.scoreDelta < 0 
                        ? 'bg-[#E74C3C] text-white' 
                        : 'bg-[#95A5A6] text-white'
                    }`}>
                      {recalcResult.scoreDelta > 0 ? `+${recalcResult.scoreDelta}%` : `${recalcResult.scoreDelta}%`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#2A4B40] leading-relaxed">
                  {recalcResult.summaryExplanation}
                </p>

                {/* Itemized attributions */}
                <div className="space-y-1.5 pt-1">
                  {recalcResult.weightChanges.map((wc) => (
                    <div key={wc.requirementId} className="text-[11px] bg-white/90 p-2 rounded-lg border border-[#D5EADF] flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#273330]">
                        Criterion <strong className="text-[#127F5C]">"{wc.requirementName}"</strong> (Status: <span className="font-mono text-[10px] uppercase font-bold text-[#3B4D47]">{wc.status}</span>)
                      </span>
                      <span className="text-[#55625F] text-right truncate max-w-sm">
                        {wc.impactExplanation}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#CCE9DD] text-[10.5px] text-[#55625F]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#16B889]" />
                    Candidate evidence classifications remain locked; recalculation updates mathematical weights only.
                  </span>
                  <button
                    onClick={() => setRecalcResult(null)}
                    className="text-[#647974] hover:text-[#273330] font-semibold underline cursor-pointer"
                  >
                    Dismiss Notice
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 4: Main Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E1ECE7] pb-1 overflow-x-auto">
          {[
            { id: 'match-table', label: 'Requirement Evidence Table', icon: Layers, count: matches.length },
            { id: 'skill-gaps', label: 'Skill Gaps & Roadmap', icon: TrendingUp, count: skillGaps.length },
            { id: 'simulator', label: 'Resume Improvement Simulator', icon: Edit3 },
            { id: 'inspector', label: 'Data Quality Inspector', icon: ShieldCheck, count: qualityInspection?.readinessScore },
            { id: 'audit', label: 'Formula & Weight Audit', icon: Scale },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabMode)}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
                  active 
                    ? 'bg-white text-[#16B889] border-t-2 border-t-[#16B889] border-x border-[#DFE7E3] shadow-2xs' 
                    : 'text-[#62726E] hover:text-[#273330] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#16B889]' : 'text-[#8E9E9A]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active ? 'bg-[#E6F8F2] text-[#0E7A5A]' : 'bg-[#EBEFEA] text-[#697975]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: REQUIREMENT EVIDENCE TABLE */}
        {activeTab === 'match-table' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#DFE8E4]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-[#55625F] mr-2">Status:</span>
                {[
                  { key: 'ALL', label: `All (${matches.length})` },
                  { key: 'MATCHED', label: `Matched (${matches.filter(m => m.status === 'MATCHED').length})` },
                  { key: 'PARTIAL', label: `Partially Matched (${matches.filter(m => m.status === 'PARTIAL').length})` },
                  { key: 'NOT FOUND', label: `Not Found (${matches.filter(m => m.status === 'NOT FOUND').length})` },
                  { key: 'NEEDS REVIEW', label: `Needs Review (${matches.filter(m => m.status === 'NEEDS REVIEW').length})` },
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      statusFilter === filter.key
                        ? 'bg-[#16B889] text-white shadow-2xs'
                        : 'bg-[#F2F6F4] text-[#4F605C] hover:bg-[#E4ECE8]'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#7B8B87]">
                Showing {filteredMatches.length} of {matches.length} requirements
              </div>
            </div>

            {/* Evidence Cards / Table */}
            <div className="space-y-3">
              {filteredMatches.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-[#DFE8E4] text-xs text-[#7B8B87]">
                  No requirements found for the selected status filter.
                </div>
              ) : (
                filteredMatches.map(m => {
                  const isMatched = m.status === 'MATCHED';
                  const isPartial = m.status === 'PARTIAL';
                  const isNotFound = m.status === 'NOT FOUND';
                  const isReview = m.status === 'NEEDS REVIEW';

                  return (
                    <div 
                      key={m.requirement.id}
                      className={`p-5 rounded-2xl border bg-white shadow-2xs transition-all space-y-3 ${
                        isMatched 
                          ? 'border-[#C8EFE2] hover:border-[#16B889]' 
                          : isPartial 
                          ? 'border-[#F8E2BE] hover:border-[#E5A338]' 
                          : isReview
                          ? 'border-[#D9DAF8] hover:border-[#7373EA]'
                          : 'border-[#F4D7D7] hover:border-[#E74C3C]'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            isMatched ? 'bg-[#16B889]' : isPartial ? 'bg-[#E5A338]' : isReview ? 'bg-[#7373EA]' : 'bg-[#E74C3C]'
                          }`} />
                          <h4 className="text-sm font-extrabold text-[#273330]">
                            {m.requirement.name}
                          </h4>
                          <span className="text-[10.5px] font-mono text-[#6A7B77] bg-[#F2F6F4] px-2 py-0.5 rounded border border-[#DFE8E4] capitalize">
                            {m.requirement.category.replace('_', ' ')}
                          </span>
                          <span className="text-[10.5px] font-bold text-[#127F5C] bg-[#E8F8F2] px-2 py-0.5 rounded border border-[#C5F0E1]">
                            Weight {m.requirement.weight} ({m.requirement.importanceLevel})
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                            isMatched 
                              ? 'bg-[#E6F8F2] text-[#0C6E4E] border-[#BEEFDD]' 
                              : isPartial 
                              ? 'bg-[#FDF6E8] text-[#9A6412] border-[#F8E0B3]' 
                              : isReview
                              ? 'bg-[#ECECFD] text-[#4747B8] border-[#D4D4F8]'
                              : 'bg-[#FCEDED] text-[#B02828] border-[#F5CACA]'
                          }`}>
                            {isMatched && <CheckCircle2 className="w-3.5 h-3.5 text-[#16B889]" />}
                            {isPartial && <AlertTriangle className="w-3.5 h-3.5 text-[#E5A338]" />}
                            {isReview && <HelpCircle className="w-3.5 h-3.5 text-[#7373EA]" />}
                            {isNotFound && <XCircle className="w-3.5 h-3.5 text-[#E74C3C]" />}
                            <span>{m.status}</span>
                          </span>

                          <span className="text-xs font-mono font-bold text-[#4F605C] bg-[#FAFBFB] px-2.5 py-1 rounded-lg border border-[#E1EBE7]">
                            +{m.scoreContribution.toFixed(1)} pts
                          </span>
                        </div>
                      </div>

                      {/* Evidence Comparison Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                        
                        {/* Left: Job Description Context */}
                        <div className="p-3 bg-[#FAFBFB] rounded-xl border border-[#E6EFEA] space-y-1">
                          <div className="text-[10px] font-bold text-[#6D7D79] uppercase tracking-wider">
                            Target Job Requirement Excerpt:
                          </div>
                          <p className="text-[#3E4D4A] italic leading-relaxed">
                            "{m.requirement.sourceExcerpt}"
                          </p>
                        </div>

                        {/* Right: Resume Evidence Excerpt */}
                        <div className={`p-3 rounded-xl border space-y-1 ${
                          m.resumeExcerpt 
                            ? 'bg-[#F4FBF8] border-[#CEEFE3]' 
                            : 'bg-[#FCF5F5] border-[#F5DEDE]'
                        }`}>
                          <div className="text-[10px] font-bold text-[#6D7D79] uppercase tracking-wider">
                            Supporting Resume Evidence:
                          </div>
                          {m.resumeExcerpt ? (
                            <p className="text-[#136A4E] font-medium leading-relaxed">
                              "{m.resumeExcerpt}"
                            </p>
                          ) : (
                            <p className="text-[#A32A2A] italic">
                              No explicit textual evidence identified in submitted resume.
                            </p>
                          )}
                        </div>

                      </div>

                      {/* Explanation & Rationale */}
                      <div className="text-xs text-[#526360] bg-[#FAFDFB] p-2.5 rounded-lg border border-[#E9F0EC] space-y-1">
                        <div>
                          <strong className="text-[#273330]">Audit Decision:</strong> {m.explanation}
                        </div>
                        {m.limitations && (
                          <div className="text-[11px] text-[#A66E14] font-medium flex items-center gap-1.5 pt-0.5">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{m.limitations}</span>
                          </div>
                        )}
                      </div>

                      {/* Quick action for Not Found */}
                      {isNotFound && (
                        <div className="pt-1 flex items-center justify-end">
                          <button
                            onClick={() => {
                              setClaimedEvidenceSkill(m.requirement.name);
                              setClaimedEvidenceText('');
                            }}
                            className="text-xs font-bold text-[#16B889] hover:text-[#118A65] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>I actually have this skill — Add my evidence</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SKILL GAPS & ROADMAP */}
        {activeTab === 'skill-gaps' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#DFE8E4] space-y-2">
              <h3 className="text-base font-bold text-[#273330] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#16B889]" />
                Target Skill Gaps & Practical Roadmap
              </h3>
              <p className="text-xs text-[#5D6E6A] leading-relaxed">
                Derived directly from missing or partially supported requirements in the target job. If you possess any of these competencies, you can provide your authentic project evidence to recalculate your match.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillGaps.map(gap => (
                <div key={gap.id} className="bg-white p-5 rounded-2xl border border-[#DFE8E4] shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E5A338]" />
                        <h4 className="text-sm font-bold text-[#273330]">{gap.skill}</h4>
                      </div>
                      <span className="text-[11px] font-bold text-[#A66E14] bg-[#FDF7EB] px-2.5 py-0.5 rounded-full border border-[#F6E1B6]">
                        {gap.status}
                      </span>
                    </div>

                    <div className="text-xs text-[#556360] bg-[#FAFBFB] p-3 rounded-xl border border-[#E9EFEA]">
                      <div className="font-semibold text-[#273330] mb-0.5">Why this is a gap:</div>
                      {gap.missingEvidenceReason}
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-[#3B4845] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#16B889]" />
                        <span>Recommended Practical Topics:</span>
                      </div>
                      <ul className="text-xs text-[#4F605C] space-y-1 pl-4 list-disc">
                        {gap.learningTopics.map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0F5F2] flex items-center justify-between">
                    <span className="text-[11px] text-[#788884]">
                      Weight impact: +{(gap.requirementWeight * 1.0).toFixed(1)} potential pts
                    </span>
                    <button
                      onClick={() => {
                        setClaimedEvidenceSkill(gap.skill);
                        setClaimedEvidenceText('');
                      }}
                      className="text-xs font-bold text-[#16B889] bg-[#EAFBF5] hover:bg-[#D9F7ED] px-3 py-1.5 rounded-lg border border-[#BCEFD9] transition-colors cursor-pointer"
                    >
                      I have this skill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESUME IMPROVEMENT SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#DFE8E4] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#273330] flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[#16B889]" />
                    Interactive Resume Improvement Simulator
                  </h3>
                  <p className="text-xs text-[#5D6E6A]">
                    Edit your resume on the right, simulate the rescoring engine in real time, and see how your match score changes line by line.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetRevision}
                    className="text-xs font-semibold text-[#5A6A66] hover:bg-[#F2F6F4] border border-[#D5E1DC] px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Reset to Original
                  </button>
                  <button
                    onClick={handleRunSimulation}
                    className="text-xs font-bold text-white bg-[#16B889] hover:bg-[#139E75] px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    Rescore Revised Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Simulation Delta Banner if calculated */}
            {simulationResult && (
              <div className={`p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                simulationResult.scoreDelta > 0 
                  ? 'bg-[#EBFBF4] border-[#BDEFD8]' 
                  : simulationResult.scoreDelta < 0 
                  ? 'bg-[#FDF3F3] border-[#F6D0D0]' 
                  : 'bg-[#F5F8F7] border-[#DCE7E2]'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="text-center bg-white p-3 rounded-xl border border-[#D0E7DE] shadow-2xs">
                    <div className="text-xs text-[#6F7F7B]">Original</div>
                    <div className="text-xl font-bold text-[#273330]">{simulationResult.originalScore}%</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#16B889]" />
                  <div className="text-center bg-white p-3 rounded-xl border border-[#D0E7DE] shadow-2xs">
                    <div className="text-xs text-[#6F7F7B]">Revised</div>
                    <div className="text-xl font-bold text-[#16B889]">{simulationResult.revisedScore}%</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-[#273330]">
                      Score Delta: {simulationResult.scoreDelta > 0 ? `+${simulationResult.scoreDelta}%` : `${simulationResult.scoreDelta}%`}
                    </div>
                    <p className="text-xs text-[#4F605C]">
                      {simulationResult.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyRevisionToOriginal}
                    className="text-xs font-bold text-white bg-[#16B889] hover:bg-[#139E75] px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Accept & Set as Resume
                  </button>
                </div>
              </div>
            )}

            {/* Dual Editor: Original vs Revised */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Original Column */}
              <div className="bg-white p-5 rounded-2xl border border-[#DFE8E4] space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0F5F2]">
                  <span className="text-xs font-bold text-[#3B4845]">Original Resume (Read-Only)</span>
                  <span className="text-[11px] text-[#7B8B87]">Baseline ({audit?.overallScore ?? 0}%)</span>
                </div>
                <textarea
                  readOnly
                  value={resumeText}
                  rows={14}
                  className="w-full text-xs font-mono p-3 bg-[#FAFBFB] rounded-xl border border-[#DFE8E4] text-[#4F605C] leading-relaxed outline-none"
                />
              </div>

              {/* Revised Column */}
              <div className="bg-white p-5 rounded-2xl border-2 border-[#16B889]/30 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0F5F2]">
                  <span className="text-xs font-bold text-[#16B889] flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    Editable Revised Resume
                  </span>
                  <span className="text-[11px] text-[#16B889] font-bold">Live Workspace</span>
                </div>
                <textarea
                  value={revisedResume}
                  onChange={(e) => setRevisedResume(e.target.value)}
                  rows={14}
                  className="w-full text-xs font-mono p-3 bg-white rounded-xl border border-[#BCE8D8] focus:border-[#16B889] focus:ring-1 focus:ring-[#16B889] text-[#273330] leading-relaxed outline-none"
                />
              </div>

            </div>

            {/* Truthful Suggestions Guide */}
            <div className="bg-white p-6 rounded-2xl border border-[#DFE8E4] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#273330] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#16B889]" />
                  Truthful Action Verb & Metric Prompts
                </h4>
                <span className="text-[11px] text-[#6E7F7B]">
                  No fictional achievements or fabricated numbers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map(s => (
                  <div key={s.id} className="p-4 bg-[#F8FAF9] rounded-xl border border-[#E1ECE7] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#273330]">{s.requirementName}</span>
                      <button
                        onClick={() => {
                          setRevisedResume(`${revisedResume}\n• ${s.suggestionTemplate}`);
                        }}
                        className="text-[11px] font-bold text-[#16B889] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Insert Template
                      </button>
                    </div>

                    <p className="text-[#136A4E] font-medium bg-[#EBFBF4] p-2 rounded-lg border border-[#C6EFDE]">
                      "{s.suggestionTemplate}"
                    </p>

                    <p className="text-[11px] text-[#556360]">
                      {s.rationale}
                    </p>

                    <div className="text-[10px] text-[#A66E14] font-semibold">
                      Required from you: {s.userFieldsNeeded.join('; ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: DATA QUALITY INSPECTOR */}
        {activeTab === 'inspector' && qualityInspection && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#DFE8E4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#273330] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#16B889]" />
                  Pre-Scoring Document Quality Gate
                </h3>
                <p className="text-xs text-[#5D6E6A]">
                  Validates document readability, section completeness, contact accuracy, and timeline chronology before analysis.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xl font-extrabold text-[#273330]">
                    {qualityInspection.readinessScore}/100
                  </div>
                  <div className={`text-[11px] font-bold ${
                    qualityInspection.readinessScore >= 80 ? 'text-[#16B889]' : 'text-[#D9822B]'
                  }`}>
                    Status: {qualityInspection.overallStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Sections */}
              <div className="bg-white p-5 rounded-2xl border border-[#DFE8E4] space-y-3">
                <div className="text-xs font-bold text-[#273330] border-b border-[#F0F5F2] pb-2 flex items-center justify-between">
                  <span>Standard ATS Sections</span>
                  <span className="text-[10px] text-[#16B889] font-bold">
                    {qualityInspection.detectedSections.length} Detected
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {qualityInspection.detectedSections.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[#384845]">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#16B889]" />
                        {s.name}
                      </span>
                      <span className="text-[10px] text-[#7A8A86] truncate max-w-[100px]">
                        {s.excerpt}
                      </span>
                    </div>
                  ))}
                  {qualityInspection.missingSections.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[#A32A2A]">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D9822B]" />
                        {s}
                      </span>
                      <span className="text-[10px] text-[#C0392B]">Missing</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Contact Formatting */}
              <div className="bg-white p-5 rounded-2xl border border-[#DFE8E4] space-y-3">
                <div className="text-xs font-bold text-[#273330] border-b border-[#F0F5F2] pb-2 flex items-center justify-between">
                  <span>Contact Formatting</span>
                  <span className="text-[10px] text-[#16B889] font-bold">Parsed</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#556360]">Email:</span>
                    <span className="font-mono text-[#273330] font-medium">
                      {qualityInspection.contactDetails.email.value || 'Not detected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#556360]">Phone:</span>
                    <span className="font-mono text-[#273330] font-medium">
                      {qualityInspection.contactDetails.phone.value || 'Not detected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#556360]">Links / Profiles:</span>
                    <span className="text-[#273330] font-medium">
                      {qualityInspection.contactDetails.links.length} found
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Timeline & Chronology */}
              <div className="bg-white p-5 rounded-2xl border border-[#DFE8E4] space-y-3">
                <div className="text-xs font-bold text-[#273330] border-b border-[#F0F5F2] pb-2 flex items-center justify-between">
                  <span>Timeline Consistency</span>
                  <span className={`text-[10px] font-bold ${
                    qualityInspection.timelineConsistency.hasIssues ? 'text-[#C0392B]' : 'text-[#16B889]'
                  }`}>
                    {qualityInspection.timelineConsistency.hasIssues ? 'Issues Found' : 'Chronology Verified'}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {qualityInspection.timelineConsistency.items.length === 0 ? (
                    <div className="text-xs text-[#7B8B87]">No date ranges parsed.</div>
                  ) : (
                    qualityInspection.timelineConsistency.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="p-2 bg-[#FAFBFB] rounded-lg border border-[#E9EFEA] text-[11px]">
                        <div className="font-semibold text-[#273330] truncate">{item.roleOrDegree}</div>
                        <div className="text-[#6E7F7B] font-mono">{item.timeframe}</div>
                        {item.issue && (
                          <div className="text-red-600 font-bold text-[10px] mt-0.5">{item.issue}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: FORMULA & WEIGHT AUDIT */}
        {activeTab === 'audit' && audit && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#DFE8E4] space-y-4">
              <h3 className="text-base font-bold text-[#273330] flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#16B889]" />
                Transparent Formula & Scoring Methodology
              </h3>
              <p className="text-xs text-[#5D6E6A] leading-relaxed">
                HireLens uses a deterministic requirement-coverage formula without black-box parameters or fabricated percentage boosts.
              </p>

              <div className="p-5 bg-[#FAFDFB] rounded-2xl border border-[#CFEBE0] space-y-3">
                <div className="text-xs font-bold text-[#16B889] uppercase tracking-wider">
                  Mathematical Formula:
                </div>
                <div className="text-lg sm:text-xl font-mono font-bold text-[#145C44] bg-white p-4 rounded-xl border border-[#BCE8D8]">
                  Score = 100 × [ Σ(wᵢ × sᵢ) / Σwᵢ ]
                </div>
                <div className="text-xs text-[#4F605C] space-y-1">
                  <div>• <code className="font-mono text-[#16B889]">wᵢ</code> = Documented weight of requirement <em>i</em> (1 to 5).</div>
                  <div>• <code className="font-mono text-[#16B889]">sᵢ = 1.0</code> for direct supporting textual evidence (Matched).</div>
                  <div>• <code className="font-mono text-[#16B889]">sᵢ = 0.5</code> for partial or related background (Partially Matched).</div>
                  <div>• <code className="font-mono text-[#16B889]">sᵢ = 0.0</code> when no supporting evidence exists in document (Not Found).</div>
                  <div>• Unresolved items (<code className="font-mono text-[#7373EA]">Needs Review</code>) are excluded from the active denominator until verified.</div>
                </div>
              </div>

              {/* Intermediate Breakdown */}
              <div className="p-4 bg-white rounded-xl border border-[#DFE8E4] space-y-2">
                <div className="text-xs font-bold text-[#273330]">Active Calculation Breakdown:</div>
                <div className="text-xs font-mono text-[#384845] bg-[#F4F8F6] p-3 rounded-lg border border-[#D5E1DC]">
                  {audit.intermediateCalculation}
                </div>
              </div>

              {/* Limitations Notice */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Important Methodological Limitations:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-amber-800 text-[11px]">
                  <li>A match score estimates textual keyword & experience alignment; it is not a guarantee of employment or hiring probability.</li>
                  <li>"Not found" indicates absence of evidence in the submitted text, not that candidate lacks the capability.</li>
                  <li>Weighting can be customized above to reflect the actual priority of the specific hiring team.</li>
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Modal: "I have this skill" Evidence Input */}
      {claimedEvidenceSkill && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DFE8E4] shadow-xl max-w-lg w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F2]">
              <h4 className="text-sm font-bold text-[#273330]">
                Add Authentic Evidence for "{claimedEvidenceSkill}"
              </h4>
              <button
                onClick={() => setClaimedEvidenceSkill(null)}
                className="text-[#8E9E9A] hover:text-[#273330] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#526360] leading-relaxed">
              Never invent accomplishments. Please describe your genuine hands-on experience, project context, or deliverable where you used <strong>{claimedEvidenceSkill}</strong>:
            </p>

            <textarea
              value={claimedEvidenceText}
              onChange={(e) => setClaimedEvidenceText(e.target.value)}
              rows={4}
              placeholder="e.g. Architected streaming data pipeline using Apache Kafka to process 5,000 events/sec with zero loss across our analytics cluster..."
              className="w-full text-xs p-3 bg-[#FAFBFB] rounded-xl border border-[#D5E1DC] focus:border-[#16B889] outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setClaimedEvidenceSkill(null)}
                className="text-xs font-semibold text-[#55625F] hover:bg-[#F2F6F4] px-4 py-2 rounded-xl border border-[#D5E1DC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPossessedSkill}
                disabled={!claimedEvidenceText.trim()}
                className="text-xs font-bold text-white bg-[#16B889] hover:bg-[#139E75] disabled:opacity-50 px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Add Evidence & Recalculate Score
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Score Audit Modal */}
      {showFormulaAudit && audit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DFE8E4] shadow-2xl max-w-xl w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F2]">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#16B889]" />
                <h4 className="text-base font-bold text-[#273330]">
                  Mathematical Score Audit
                </h4>
              </div>
              <button
                onClick={() => setShowFormulaAudit(false)}
                className="text-[#8E9E9A] hover:text-[#273330] p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#FAFDFB] rounded-xl border border-[#BCE8D8]">
                <div className="font-bold text-[#145C44]">Active Formula:</div>
                <div className="font-mono text-sm font-bold text-[#16B889] mt-0.5">
                  Score = 100 × [ Σ(wᵢ × sᵢ) / Σwᵢ ]
                </div>
              </div>

              <div className="space-y-1.5 p-3.5 bg-[#F6FAF8] rounded-xl border border-[#DFE8E4]">
                <div className="font-bold text-[#273330]">Step-by-Step Substitution:</div>
                <div>• Total applicable weight (denominator): <strong className="font-mono">{audit.totalApplicableWeight.toFixed(1)}</strong></div>
                <div>• Matched points earned: <strong className="font-mono">{audit.matchedWeight.toFixed(1)}</strong> ({audit.matchedCount} requirements × weight)</div>
                <div>• Partial points earned: <strong className="font-mono">{audit.partialWeight.toFixed(1)}</strong> ({audit.partialCount} requirements × 0.5 × weight)</div>
                <div>• Not found points: <strong className="font-mono">0.0</strong> ({audit.notFoundCount} requirements)</div>
                <div className="pt-1 font-mono text-[#0E7A5A] font-bold">
                  {audit.intermediateCalculation}
                </div>
              </div>

              <div className="text-[11px] text-[#6E7F7B]">
                HireLens strictly validates each score against the actual inputs. No synthetic or hardcoded metrics are ever added.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFormulaAudit(false)}
                className="text-xs font-bold text-white bg-[#16B889] hover:bg-[#139E75] px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
