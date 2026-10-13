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
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: cleanText, fileName, jobDescription }),
    });

    if (res.ok) {
      const data: AnalysisReport = await res.json();
      data.id = 'report_' + Date.now();
      data.resumeText = cleanText;
      data.jobDescription = jobDescription;
      saveToHistory(data);
      return data;
    }
  } catch (err) {
    console.warn('Backend API unavailable, using client-side deterministic analysis engine:', err);
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
        bullet: `Architected and launched ${actionCore} using modern scalable patterns, achieving a [35%] boost in operational throughput for [10k+] monthly users.`,
        explanation: 'Adds executive action verb and quantifiable efficiency metric.'
      },
      {
        type: 'Technical Execution Focus',
        bullet: `Engineered ${actionCore} with modular state management and automated CI/CD unit testing, reducing defect rates by [40%].`,
        explanation: 'Highlights code reliability, engineering depth, and error prevention.'
      },
      {
        type: 'Business Impact Focus',
        bullet: `Spearheaded ${actionCore} aligned with cross-functional roadmaps, reducing feature delivery lifecycle by [2 weeks].`,
        explanation: 'Focuses on cross-functional impact, delivery speed, and business outcomes.'
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
