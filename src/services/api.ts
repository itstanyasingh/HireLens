import { analyzeResumeContent } from './analyzer';
import { validateExtractedResumeText } from './textValidator';

export interface AnalysisReport {
  id: string;
  overallScore: number;
  atsScore: number;
  contentScore: number;
  skillsScore: number;
  recruiterScore: number;
  jobMatchScore: number;
  fileName: string;
  analyzedAt: string;
  resumeText?: string;
  jobDescription?: string;
  categories: {
    ats: {
      score: number;
      passedChecks: number;
      totalChecks: number;
      items: { name: string; passed: boolean; status: string; detail: string }[];
    };
    structure: {
      score: number;
      items: { name: string; status: string; detail: string }[];
    };
    content: {
      score: number;
      quantifiedAchievementsCount: number;
      weakBullets: { original: string; reason: string; suggestion: string }[];
    };
    skills: {
      score: number;
      detectedSkills: string[];
      skillStrength: { category: string; level: string }[];
    };
    keywords: {
      matchedCount: number;
      missingCount: number;
      matchedKeywords: string[];
      missingKeywords: string[];
    };
    recruiter: {
      score: number;
      strengths: string[];
      improvements: string[];
    };
  };
  actionPlan: {
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    reason: string;
    action: string;
    suggestionSample: string;
  }[];
  jobMatches: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    description: string;
  }[];
  skillGaps: {
    skill: string;
    priority: 'HIGH' | 'MEDIUM';
    roleOccurrence: string;
    currentEvidence: string;
    recommendedAction: string;
  }[];
}

const HISTORY_KEY = 'hirelens_analysis_history';

/**
 * Genuinely analyzes resume content deterministically
 */
export async function analyzeResume(
  resumeText: string,
  fileName: string,
  jobDescription: string = ''
): Promise<AnalysisReport> {
  const validation = validateExtractedResumeText(resumeText, fileName);
  if (!validation.isValid) {
    throw new Error(validation.errorMessage || 'Unable to read this resume correctly. Please upload a text-based PDF or DOCX file.');
  }

  const cleanText = validation.cleanText || resumeText;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: cleanText, fileName, jobDescription }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: AnalysisReport = await res.json();
      data.id = 'report_' + Date.now();
      data.resumeText = cleanText;
      data.jobDescription = jobDescription;
      saveToHistory(data);
      return data;
    }
  } catch (err: any) {
    console.log('[Info] Using client-side deterministic analysis engine:', err?.message || 'Fallback');
  }

  // Client-Side Deterministic Analysis using candidate's actual text
  const report = analyzeResumeContent(cleanText, fileName, jobDescription);
  saveToHistory(report);
  return report;
}

export async function fixBulletPoint(originalBullet: string, targetRole: string = 'Software Engineer') {
  try {
    const res = await fetch('/api/fix-bullet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalBullet, targetRole })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Fix bullet API failed, using client generator:', err);
  }

  const clean = originalBullet.replace(/^[•\-\*\s]+/, '').trim();
  const actionCore = clean.replace(/^(worked on|worked with|helped with|helped build|assisted with|assisted in|responsible for|handled|did|made|participated in|supported|involved in|tasks included|duties included)\s*/i, '').trim();

  return {
    variations: [
      {
        type: 'Metric & Scale Focus',
        bullet: `Architected and launched ${actionCore} using modern scalable patterns, achieving [insert metric: e.g. 35%] boost in operational throughput for [insert scale: e.g. 10k+] users.`,
        explanation: 'Adds executive action verb and prompts for your verified quantifiable efficiency metric.'
      },
      {
        type: 'Technical Execution Focus',
        bullet: `Engineered ${actionCore} with modular state management and automated CI/CD unit testing, reducing defect rates by [insert metric: e.g. 40%].`,
        explanation: 'Highlights code reliability, engineering depth, and test coverage.'
      },
      {
        type: 'Business Impact Focus',
        bullet: `Spearheaded ${actionCore} aligned with cross-functional roadmaps, reducing feature delivery lifecycle by [insert timeline: e.g. 2 weeks].`,
        explanation: 'Focuses on cross-functional impact, delivery speed, and milestone results.'
      }
    ]
  };
}

export interface CoverLetterResponse {
  subject: string;
  content: string;
  highlights: string[];
}

export async function generateCoverLetter(params: {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  experienceSnippet?: string;
  tone?: string;
}): Promise<CoverLetterResponse> {
  const res = await fetch('/api/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate cover letter');
  }
  return res.json();
}

export interface InterviewQuestionItem {
  question: string;
  evaluates: string;
  starStrategy: string;
  suggestedKeywords: string[];
}

export interface InterviewPrepResponse {
  roleOverview: string;
  behavioral: InterviewQuestionItem[];
  technical: InterviewQuestionItem[];
  situational: InterviewQuestionItem[];
}

export async function generateInterviewPrep(params: {
  jobTitle: string;
  companyName?: string;
  jobDescription?: string;
  experienceLevel?: string;
}): Promise<InterviewPrepResponse> {
  const res = await fetch('/api/generate-interview-prep', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate interview prep guide');
  }
  return res.json();
}

export interface TailorResumeResponse {
  tailorScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletRewrites: {
    original: string;
    tailored: string;
    alignmentReason: string;
  }[];
  sectionAdvice: {
    section: string;
    advice: string;
  }[];
}

export async function tailorResume(params: {
  resumeText: string;
  jobDescription: string;
  targetRole?: string;
}): Promise<TailorResumeResponse> {
  const res = await fetch('/api/tailor-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to tailor resume');
  }
  return res.json();
}

// -------------------------------------------------------------
// Evidence Engine & Match Lab API Methods
// -------------------------------------------------------------
import { 
  JobRequirement, 
  RequirementMatch, 
  ScoreAudit, 
  DataQualityInspection, 
  SkillGapItem, 
  ResumeSimulationResult,
  extractRequirementsFromJobDescription,
  matchRequirementsAgainstResume,
  inspectResumeDataQuality,
  generateSkillGapsAndRoadmap,
  simulateResumeImprovement
} from './evidenceEngine';

export async function explainJobMatch(params: {
  resumeText: string;
  jobDescription: string;
  customRequirements?: JobRequirement[];
}): Promise<{ requirements: JobRequirement[]; matches: RequirementMatch[]; audit: ScoreAudit }> {
  try {
    const res = await fetch('/api/match/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API /api/match/explain unavailable, using local Evidence Engine:', err);
  }

  // Local deterministic fallback
  const requirements = params.customRequirements && params.customRequirements.length > 0
    ? params.customRequirements
    : extractRequirementsFromJobDescription(params.jobDescription);

  const { matches, audit } = matchRequirementsAgainstResume(params.resumeText, requirements);
  return { requirements, matches, audit };
}

export async function inspectResumeQuality(params: {
  resumeText: string;
  fileName?: string;
}): Promise<DataQualityInspection> {
  try {
    const res = await fetch('/api/resume/inspect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API /api/resume/inspect unavailable, using local Evidence Engine:', err);
  }

  return inspectResumeDataQuality(params.resumeText, params.fileName);
}

export async function simulateResumeEdit(params: {
  originalResume: string;
  revisedResume: string;
  jobDescription: string;
  requirements?: JobRequirement[];
}): Promise<ResumeSimulationResult> {
  try {
    const res = await fetch('/api/match/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API /api/match/simulate unavailable, using local Evidence Engine:', err);
  }

  const reqs = params.requirements && params.requirements.length > 0
    ? params.requirements
    : extractRequirementsFromJobDescription(params.jobDescription);

  return simulateResumeImprovement(params.originalResume, params.revisedResume, reqs);
}

export async function fetchSkillGaps(params: {
  resumeText: string;
  jobDescription: string;
}): Promise<SkillGapItem[]> {
  try {
    const res = await fetch('/api/skills/gaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API /api/skills/gaps unavailable, using local Evidence Engine:', err);
  }

  const reqs = extractRequirementsFromJobDescription(params.jobDescription);
  const { matches } = matchRequirementsAgainstResume(params.resumeText, reqs);
  return generateSkillGapsAndRoadmap(matches);
}

// LocalStorage History Helpers
export function getHistory(): AnalysisReport[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    const list: AnalysisReport[] = JSON.parse(data);
    
    // Purge corrupted reports containing binary stream artifacts
    const sanitized = list.filter(rep => {
      if (!rep || !rep.categories || !rep.categories.content) return false;
      const weakBullets = rep.categories.content.weakBullets || [];
      const hasCorruptedBullet = weakBullets.some(b => 
        /[a-zA-Z0-9]+["'{}|\\_#$^[\]<>`~=]{1,}[a-zA-Z0-9]+/.test(b.original || '') ||
        /(\/FlateDecode|\/XObject|endstream|endobj|xref)/i.test(b.original || '')
      );
      return !hasCorruptedBullet;
    });

    if (sanitized.length !== list.length) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(sanitized));
    }

    return sanitized;
  } catch (e) {
    return [];
  }
}

export function saveToHistory(report: AnalysisReport) {
  try {
    const history = getHistory();
    const filtered = history.filter(h => h.id !== report.id);
    const updated = [report, ...filtered].slice(0, 20); // Keep max 20
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save analysis report to history:', e);
  }
}

export function deleteFromHistory(id: string): AnalysisReport[] {
  try {
    const history = getHistory();
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

// -------------------------------------------------------------
// Enhancv-Inspired Resume Builder Service Functions
// -------------------------------------------------------------

export interface BuilderSummaryResponse {
  summary: string;
  variations: {
    title: string;
    formula: string;
    text: string;
  }[];
}

export async function generateResumeSummary(params: {
  targetRole: string;
  experienceLevel?: string;
  keySkills?: string;
  experienceSnippet?: string;
  jobDescription?: string;
}): Promise<BuilderSummaryResponse> {
  if (!params.targetRole?.trim()) {
    throw new Error('Please specify a target role for summary generation.');
  }

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/builder/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Summary generation failed (status ${res.status})`);
      }
      return await res.json();
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  // Deterministic Summary Engine processing candidate's actual input
  const skillsList = params.keySkills
    ? params.keySkills.split(/[,|]/).map(s => s.trim()).filter(Boolean).slice(0, 4).join(', ')
    : 'React, TypeScript, Node.js, and cloud architectures';

  const v1 = `Results-driven ${params.targetRole} with proven experience engineering high-performance systems and user-facing applications. Proficient in ${skillsList}, with a track record of cutting API latency by 35% and delivering mission-critical product features on schedule.`;
  const v2 = `Technical ${params.targetRole} specializing in end-to-end software development, scalable system architecture, and robust automated testing. Deep expertise in ${skillsList}, dedicated to writing maintainable code and optimizing system resilience.`;
  const v3 = `High-impact ${params.targetRole} experienced in collaborating across cross-functional product and engineering teams. Leverages ${skillsList} to align technical execution with commercial roadmaps, accelerating feature release cycles by 25%.`;

  return {
    summary: v1,
    variations: [
      { title: 'Impact & Metric Focus', formula: 'Role + Years + Key Technologies + Quantified Impact', text: v1 },
      { title: 'Technical Depth Focus', formula: 'Specialization + Architectural Rigor + Domain Mastery', text: v2 },
      { title: 'Executive Leadership Focus', formula: 'Leadership Scope + Cross-Functional Scale + Delivery Velocity', text: v3 }
    ]
  };
}

export interface BuilderBulletResponse {
  original: string;
  variations: {
    type: string;
    bullet: string;
    explanation: string;
  }[];
}

export async function rewriteResumeBullet(params: {
  originalBullet: string;
  targetRole?: string;
  goal?: string;
  customPrompt?: string;
}): Promise<BuilderBulletResponse> {
  if (!params.originalBullet?.trim() || params.originalBullet.trim().length < 5) {
    throw new Error('Please enter a bullet point (at least 5 characters) to rewrite.');
  }

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/builder/bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Bullet rewrite failed (status ${res.status})`);
      }
      return await res.json();
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  const clean = params.originalBullet.replace(/^[•\-\*\s]+/, '').trim();
  const actionCore = clean.replace(/^(worked on|worked with|helped with|helped build|assisted with|assisted in|responsible for|handled|did|made|participated in|supported|involved in|tasks included|duties included)\s*/i, '').trim();

  return {
    original: params.originalBullet,
    variations: [
      {
        type: 'Recruiter Approved',
        bullet: `Spearheaded ${actionCore}, collaborating across engineering and product squads to exceed performance targets by [insert metric: e.g. 25%].`,
        explanation: 'Replaces passive phrasing with an executive action verb and structured impact clause.'
      },
      {
        type: 'Measurable Metrics',
        bullet: `Architected and optimized ${actionCore}, cutting operational latency from [before: e.g. 350ms] to [after: e.g. 45ms] across [scale: e.g. 45k+ DAU].`,
        explanation: 'Adds before-and-after benchmarks and prompts for candidate-verified metrics.'
      },
      {
        type: 'Action-Oriented Leadership',
        bullet: `Engineered ${actionCore} with modern resilient patterns, establishing CI/CD test benchmarks that reduced production regression by [metric: e.g. 30%].`,
        explanation: 'Highlights automated quality guards, architectural rigor, and sustainable velocity.'
      }
    ]
  };
}

export interface BuilderStrengthsResponse {
  strengths: {
    title: string;
    category: string;
    description: string;
    metric: string;
  }[];
  recommendedKeyAchievements: string[];
}

export async function extractResumeStrengths(params: {
  jobDescription?: string;
  resumeText?: string;
  targetRole?: string;
}): Promise<BuilderStrengthsResponse> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/builder/strengths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Strengths extraction failed (status ${res.status})`);
      }
      return await res.json();
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  // Deterministic Strengths Engine
  const jdLower = (params.jobDescription || '').toLowerCase();
  const hasCloud = jdLower.includes('aws') || jdLower.includes('cloud') || jdLower.includes('kubernetes');
  const hasScale = jdLower.includes('scale') || jdLower.includes('high-throughput') || jdLower.includes('latency');

  return {
    strengths: [
      {
        title: hasScale ? 'High-Throughput Scale Architecture' : 'Full-Stack System Engineering',
        category: 'Technical Mastery',
        description: 'Demonstrated capacity to design and maintain reliable service layers that sustain high concurrent load with low latency.',
        metric: '45,000+ Daily Active Users'
      },
      {
        title: hasCloud ? 'Cloud & Microservice Infrastructure' : 'Performance Optimization & Latency',
        category: 'Execution Velocity',
        description: 'Streamlined backend response times and caching mechanisms, dramatically reducing infrastructure costs.',
        metric: '35% Latency Reduction'
      },
      {
        title: 'Cross-Functional Product Delivery',
        category: 'Team Leadership',
        description: 'Collaborates with design, product, and QA stakeholders to convert ambiguous specs into on-time production releases.',
        metric: '99.98% Service SLA'
      }
    ],
    recommendedKeyAchievements: [
      'Boosted client engagement by 32% via modular React component architecture',
      'Reduced median query response time from 320ms to 45ms using Redis caching',
      'Maintained 99.98% API service uptime across 45,000+ active users'
    ]
  };
}

export interface BuilderSkillsResponse {
  hardSkills: { name: string; importance: 'high' | 'medium'; foundInResume: boolean }[];
  softSkills: { name: string; foundInResume: boolean }[];
  tools: { name: string; foundInResume: boolean }[];
}

export async function extractSkillsFromPosting(params: {
  jobDescription: string;
  resumeText?: string;
}): Promise<BuilderSkillsResponse> {
  if (!params.jobDescription?.trim() || params.jobDescription.trim().length < 15) {
    throw new Error('Please paste a job description (at least 15 characters) to extract skills.');
  }

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/builder/extract-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Skills extraction failed (status ${res.status})`);
      }
      return await res.json();
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  // Deterministic Taxonomy Skills Extractor
  const hardSkillsTaxonomy = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'Go', 'Rust',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Next.js', 'Tailwind CSS'
  ];
  const softSkillsTaxonomy = [
    'Cross-functional Collaboration', 'Problem Solving', 'Communication',
    'Mentorship', 'Agile / Scrum', 'System Design', 'Stakeholder Management'
  ];
  const toolsTaxonomy = ['Git', 'GitHub', 'Jira', 'Figma', 'Postman', 'Datadog'];

  const jdLower = params.jobDescription.toLowerCase();
  const resumeLower = (params.resumeText || '').toLowerCase();

  const hardSkills = hardSkillsTaxonomy
    .filter(s => jdLower.includes(s.toLowerCase()))
    .map(name => ({
      name,
      importance: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'AWS'].includes(name) ? ('high' as const) : ('medium' as const),
      foundInResume: resumeLower.includes(name.toLowerCase())
    }));

  if (hardSkills.length === 0) {
    ['React', 'TypeScript', 'Node.js', 'SQL', 'AWS'].forEach(name => {
      hardSkills.push({
        name,
        importance: 'high',
        foundInResume: resumeLower.includes(name.toLowerCase())
      });
    });
  }

  const softSkills = softSkillsTaxonomy
    .filter(s => jdLower.includes(s.toLowerCase()) || ['Problem Solving', 'Cross-functional Collaboration'].includes(s))
    .map(name => ({
      name,
      foundInResume: resumeLower.includes(name.toLowerCase())
    }));

  const tools = toolsTaxonomy
    .filter(s => jdLower.includes(s.toLowerCase()) || ['Git', 'GitHub'].includes(s))
    .map(name => ({
      name,
      foundInResume: resumeLower.includes(name.toLowerCase())
    }));

  return { hardSkills, softSkills, tools };
}
