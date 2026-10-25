import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

import { analyzeResumeContent } from './src/services/analyzer';
import {
  extractRequirementsFromJobDescription,
  matchRequirementsAgainstResume,
  inspectResumeDataQuality,
  generateSkillGapsAndRoadmap,
  simulateResumeImprovement,
  calculateTransparentScore
} from './src/services/evidenceEngine';

// Evidence-Based Deterministic Resume Analysis Engine
function generateFallbackAnalysis(resumeText: string, fileName: string, jobDescription?: string) {
  return analyzeResumeContent(resumeText, fileName, jobDescription);
}


import crypto from 'crypto';

// High-Performance In-Memory Cache for Analysis Reports
interface AnalysisCacheEntry {
  data: any;
  timestamp: number;
}
const analysisCache = new Map<string, AnalysisCacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

function getAnalysisCacheKey(resumeText: string, fileName: string, jobDescription?: string): string {
  const cleanResume = resumeText.trim();
  const cleanJd = (jobDescription || '').trim();
  return crypto.createHash('sha256').update(`${cleanResume}::${cleanJd}::${fileName}::v2`).digest('hex');
}

// API Endpoints

// POST /api/analyze
app.post('/api/analyze', async (req, res) => {
  const startTime = performance.now();
  try {
    const { resumeText, fileName = 'Resume.pdf', jobDescription = '' } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide valid resume text or upload a document.' });
    }

    // 1. Check High-Speed In-Memory Cache
    const cacheKey = getAnalysisCacheKey(resumeText, fileName, jobDescription);
    const cached = analysisCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      const elapsed = (performance.now() - startTime).toFixed(2);
      res.setHeader('X-Response-Time', `${elapsed}ms`);
      res.setHeader('X-Cache-Status', 'HIT');
      return res.json(cached.data);
    }

    // 2. Local Evidence Engine Computation (High Precision & ~3ms Execution)
    const localReport = generateFallbackAnalysis(resumeText, fileName, jobDescription);

    const ai = getGenAI();
    let finalReport = localReport;

    if (ai) {
      try {
        const prompt = `
You are HireLens, an elite resume reviewer, ATS auditor, and career recruiter advisor.
Analyze the following resume text carefully and (optionally) compare it with the job description if provided.

RESUME FILENAME: ${fileName}
RESUME TEXT:
"""
${resumeText}
"""

${jobDescription ? `TARGET JOB DESCRIPTION:\n"""\n${jobDescription}\n"""` : 'NO SPECIFIC JOB DESCRIPTION PROVIDED.'}

Provide a comprehensive, objective, JSON evaluation adhering strictly to the JSON schema:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "contentScore": number (0-100),
  "skillsScore": number (0-100),
  "recruiterScore": number (0-100),
  "jobMatchScore": number (0-100),
  "fileName": "${fileName}",
  "analyzedAt": "${new Date().toISOString()}",
  "categories": {
    "ats": {
      "score": number,
      "passedChecks": number,
      "totalChecks": 5,
      "items": [
        { "name": string, "passed": boolean, "status": "Passed" | "Needs attention" | "Problem", "detail": string }
      ]
    },
    "structure": {
      "score": number,
      "items": [
        { "name": string, "status": "Found" | "Could be improved" | "Missing", "detail": string }
      ]
    },
    "content": {
      "score": number,
      "quantifiedAchievementsCount": number,
      "weakBullets": [
        { "original": string, "reason": string, "suggestion": string }
      ]
    },
    "skills": {
      "score": number,
      "detectedSkills": string[],
      "skillStrength": [
        { "category": string, "level": "Strong" | "Good" | "Developing" }
      ]
    },
    "keywords": {
      "matchedCount": number,
      "missingCount": number,
      "matchedKeywords": string[],
      "missingKeywords": string[]
    },
    "recruiter": {
      "score": number,
      "strengths": string[],
      "improvements": string[]
    }
  },
  "actionPlan": [
    { "priority": "HIGH" | "MEDIUM" | "LOW", "title": string, "reason": string, "action": string, "suggestionSample": string }
  ],
  "jobMatches": [
    {
      "id": string,
      "title": string,
      "company": string,
      "location": string,
      "type": string,
      "salary": string,
      "matchScore": number,
      "matchedSkills": string[],
      "missingSkills": string[],
      "description": string
    }
  ],
  "skillGaps": [
    { "skill": string, "priority": "HIGH" | "MEDIUM", "roleOccurrence": string, "currentEvidence": string, "recommendedAction": string }
  ]
}
Return ONLY pure JSON.
`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call exceeded 4200ms limit')), 4200)
        );

        const response: any = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          }),
          timeoutPromise
        ]);

        if (response && response.text) {
          finalReport = JSON.parse(response.text);
        }
      } catch (genAiErr: any) {
        console.log('[Info] AI analysis fallback used:', genAiErr?.message || 'Fallback enabled');
      }
    }

    // Cache the verified result for subsequent requests
    analysisCache.set(cacheKey, { data: finalReport, timestamp: Date.now() });

    const elapsed = (performance.now() - startTime).toFixed(2);
    res.setHeader('X-Response-Time', `${elapsed}ms`);
    res.setHeader('X-Cache-Status', 'MISS');
    return res.json(finalReport);

  } catch (error: any) {
    console.error('Server error in /api/analyze:', error);
    res.status(500).json({ error: 'Analysis failed. Please check your document and try again.' });
  }
});

// POST /api/match/explain
// Explainable job matching with transparent formula, weights, and evidence excerpts
app.post('/api/match/explain', async (req, res) => {
  try {
    const { resumeText = '', jobDescription = '', customRequirements } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide valid resume text (at least 20 characters).' });
    }
    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide a valid job description (at least 20 characters).' });
    }

    const requirements = Array.isArray(customRequirements) && customRequirements.length > 0
      ? customRequirements
      : extractRequirementsFromJobDescription(jobDescription);

    const { matches, audit } = matchRequirementsAgainstResume(resumeText, requirements);

    return res.json({
      requirements,
      matches,
      audit
    });
  } catch (error: any) {
    console.error('Error in /api/match/explain:', error);
    return res.status(500).json({ error: 'Failed to process explainable match.' });
  }
});

// POST /api/match/simulate
// Before-and-after resume improvement simulator with score delta and diff analysis
app.post('/api/match/simulate', async (req, res) => {
  try {
    const { originalResume = '', revisedResume = '', jobDescription = '', requirements: customReqs } = req.body;

    if (!originalResume || !revisedResume) {
      return res.status(400).json({ error: 'Both originalResume and revisedResume texts are required.' });
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ error: 'Job description is required to simulate match improvements.' });
    }

    const reqs = Array.isArray(customReqs) && customReqs.length > 0
      ? customReqs
      : extractRequirementsFromJobDescription(jobDescription);

    const result = simulateResumeImprovement(originalResume, revisedResume, reqs);
    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/match/simulate:', error);
    return res.status(500).json({ error: 'Failed to simulate resume improvement.' });
  }
});

// POST /api/resume/inspect
// Data quality inspector: validates document readability, sections, contact info, and timeline consistency
app.post('/api/resume/inspect', async (req, res) => {
  try {
    const { resumeText = '', fileName = 'Resume.pdf' } = req.body;

    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({ error: 'Resume text is required for quality inspection.' });
    }

    const inspection = inspectResumeDataQuality(resumeText, fileName);
    return res.json(inspection);
  } catch (error: any) {
    console.error('Error in /api/resume/inspect:', error);
    return res.status(500).json({ error: 'Failed to inspect resume data quality.' });
  }
});

// POST /api/skills/gaps
// Skill gap analysis and curated learning roadmap
app.post('/api/skills/gaps', async (req, res) => {
  try {
    const { resumeText = '', jobDescription = '' } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Both resumeText and jobDescription are required.' });
    }

    const requirements = extractRequirementsFromJobDescription(jobDescription);
    const { matches } = matchRequirementsAgainstResume(resumeText, requirements);
    const gaps = generateSkillGapsAndRoadmap(matches);

    return res.json(gaps);
  } catch (error: any) {
    console.error('Error in /api/skills/gaps:', error);
    return res.status(500).json({ error: 'Failed to generate skill gaps.' });
  }
});

// POST /api/fix-bullet
app.post('/api/fix-bullet', async (req, res) => {
  try {
    const { originalBullet, targetRole = 'Software Engineer' } = req.body;
    if (!originalBullet) {
      return res.status(400).json({ error: 'originalBullet is required' });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `
You are a top executive resume writer. Rewrite the following weak/generic resume bullet point into 3 distinct high-impact variations for a ${targetRole} candidate.
Original Bullet: "${originalBullet}"

Rules:
1. Every variation MUST begin with a strong active verb (e.g., Engineered, Spearheaded, Optimized, Architected).
2. Include clear metric placeholders like [X%], [$Y], [Z users] if exact numbers are unknown.
3. Show direct business impact or result.
4. Never invent fake achievements; use explicit brackets like [X%] so the user can insert real data.

Return JSON format:
{
  "variations": [
    { "type": "Metric & Scale Focus", "bullet": "string", "explanation": "string" },
    { "type": "Technical & Architecture Focus", "bullet": "string", "explanation": "string" },
    { "type": "Leadership & Business Outcome Focus", "bullet": "string", "explanation": "string" }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (e) {
        console.warn('Gemini fix bullet failed, using template:', e);
      }
    }

    // Fallback bullet variations with clean verb replacement
    const clean = originalBullet.replace(/^[•\-\*\s]+/, '').trim();
    const actionCore = clean.replace(/^(worked on|worked with|helped with|helped build|assisted with|assisted in|responsible for|handled|did|made|participated in|supported|involved in|tasks included|duties included)\s*/i, '').trim();

    return res.json({
      variations: [
        {
          type: 'Metric & Scale Focus',
          bullet: `Engineered ${actionCore} utilizing modern scalable patterns, driving a [insert metric: e.g. 25%] increase in operational throughput across [insert scale: e.g. 10,000+] active users.`,
          explanation: 'Replaces passive language with active engineering verb and quantifiable efficiency metric.'
        },
        {
          type: 'Technical & Quality Focus',
          bullet: `Architected and deployed ${actionCore} with comprehensive automated testing and CI/CD pipelines, reducing defect rates by [insert metric: e.g. 30%].`,
          explanation: 'Emphasizes code quality, technical execution, and reduction of engineering errors.'
        },
        {
          type: 'Business Outcome Focus',
          bullet: `Spearheaded ${actionCore} in collaboration with cross-functional teams, accelerating product delivery velocity by [insert timeline: e.g. 2 weeks].`,
          explanation: 'Highlights cross-functional leadership, execution velocity, and delivery timeline impact.'
        }
      ]
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to generate bullet fix.' });
  }
});

// POST /api/generate-cover-letter
app.post('/api/generate-cover-letter', async (req, res) => {
  try {
    const { 
      candidateName = 'Alex Morgan',
      jobTitle = 'Software Engineer',
      companyName = 'Acme Corp',
      experienceSnippet = '',
      tone = 'Professional & Confident'
    } = req.body;

    if (!jobTitle || !companyName) {
      return res.status(400).json({ error: 'Job title and Company name are required.' });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `
You are an executive career advisor and professional resume writer.
Write a compelling, high-converting cover letter tailored for:
Candidate Name: ${candidateName}
Target Role: ${jobTitle}
Company: ${companyName}
Tone: ${tone}
Key Experience / Background:
${experienceSnippet || 'Strong software engineering background with emphasis on scalable systems, web performance, and reliable teamwork.'}

Requirements:
1. Include Date and recipient placeholders.
2. Hook the hiring manager with enthusiasm for ${companyName} and relevant qualifications for ${jobTitle}.
3. Highlight 2-3 specific achievements with quantifiable metrics and active verbs.
4. Explain alignment with ${companyName}'s mission and technical standard.
5. Provide a confident, proactive call to action.
6. Return JSON format:
{
  "subject": "Application for ${jobTitle} - ${candidateName}",
  "content": "string (multiline formatted letter)",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"]
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Gemini cover letter generation failed, using heuristic template:', err);
      }
    }

    // Heuristic Cover Letter Fallback
    const letterDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const content = `${letterDate}

Hiring Team
${companyName}

Dear Hiring Manager,

I am writing to express my strong enthusiasm for the ${jobTitle} role at ${companyName}. Having followed ${companyName}'s impactful work in building resilient, user-centric technology, I am excited by the opportunity to bring my hands-on background and engineering rigor to your team.

${experienceSnippet.trim().length > 20 
  ? `In my previous work, I focused on turning complex product specifications into dependable, maintainable software. Specifically, ${experienceSnippet.trim().slice(0, 300)}.`
  : `Throughout my career, I have specialized in building robust software solutions that drive measurable business outcomes. In my recent roles, I architected scalable services and collaborated closely with cross-functional product stakeholders to ship quality software on schedule.`}

What excites me most about ${companyName} is your commitment to engineering excellence and sustainable team velocity. I thrive in environments where data-driven problem solving and ownership are celebrated, and I am confident that my experience with modern architectural patterns will allow me to contribute immediately to your product milestones.

I welcome the chance to discuss how my skill set and proactive approach align with ${companyName}'s growth goals. Thank you for your time and consideration.

Sincerely,

${candidateName}`;

    return res.json({
      subject: `Application for ${jobTitle} - ${candidateName}`,
      content,
      highlights: [
        `Customized for ${jobTitle} at ${companyName}`,
        'Quantifiable impact narrative and action verbs',
        'Direct alignment with team velocity and technical goals'
      ]
    });

  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: 'Failed to generate cover letter.' });
  }
});

// POST /api/generate-interview-prep
app.post('/api/generate-interview-prep', async (req, res) => {
  try {
    const {
      jobTitle = 'Software Engineer',
      companyName = 'Target Company',
      jobDescription = '',
      experienceLevel = 'Mid-Senior'
    } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ error: 'Job title is required.' });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `
You are an expert technical recruiter and interview coach.
Generate a comprehensive interview preparation guide for:
Job Title: ${jobTitle}
Company: ${companyName}
Experience Level: ${experienceLevel}
Job Requirements / Description:
${jobDescription || 'Standard requirements for modern high-performance engineering.'}

Provide JSON conforming strictly to:
{
  "roleOverview": "Brief 2-sentence summary of what interviewers screen for in this role",
  "behavioral": [
    {
      "question": "string",
      "evaluates": "what recruiters/interviewers look for",
      "starStrategy": "step-by-step guidance on answering using Situation, Task, Action, Result",
      "suggestedKeywords": ["keyword1", "keyword2"]
    }
  ],
  "technical": [
    {
      "question": "string",
      "evaluates": "technical competencies and system concepts evaluated",
      "starStrategy": "how to break down problem, trade-offs, and architecture",
      "suggestedKeywords": ["keyword1", "keyword2"]
    }
  ],
  "situational": [
    {
      "question": "string",
      "evaluates": "conflict resolution, prioritization, stakeholder communication",
      "starStrategy": "recommended diplomatic and impact-focused approach",
      "suggestedKeywords": ["keyword1", "keyword2"]
    }
  ]
}
Generate at least 3 questions in each category. Return ONLY JSON.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Gemini interview prep generation failed, using heuristic engine:', err);
      }
    }

    // Heuristic Interview Prep Fallback
    return res.json({
      roleOverview: `For a ${experienceLevel} ${jobTitle} at ${companyName}, interviewers evaluate deep domain execution, system scalability, and the ability to articulate trade-offs clearly under ambiguity.`,
      behavioral: [
        {
          question: `Tell me about a challenging project where requirements changed midway through delivery.`,
          evaluates: 'Agility, communication with stakeholders, and practical prioritization.',
          starStrategy: 'Situation: Outline the initial project scope. Task: Explain the sudden shift in constraints. Action: Detail how you re-estimated timeline and communicated with product teams. Result: Highlight on-time delivery with zero critical regression.',
          suggestedKeywords: ['Scope management', 'Stakeholder alignment', 'Trade-off analysis', 'Delivery velocity']
        },
        {
          question: `Describe a scenario where you disagreed with a senior engineer or product decision. How did you resolve it?`,
          evaluates: 'Emotional intelligence, data-driven reasoning, and cross-functional alignment.',
          starStrategy: 'Frame the disagreement around user/system impact rather than personal preference. Present how you gathered metrics or benchmarks to facilitate an objective team decision.',
          suggestedKeywords: ['Data-driven consensus', 'Objective trade-offs', 'Professional collaboration', 'Shared goals']
        },
        {
          question: `Can you walk me through your biggest technical failure or production incident and what you learned?`,
          evaluates: 'Accountability, blameless root-cause analysis, and preventative engineering.',
          starStrategy: 'Own the mistake directly without deflecting. Emphasize the mitigation protocol, post-mortem analysis, and automated guards put in place to ensure it never recurs.',
          suggestedKeywords: ['Root-cause analysis', 'Incident mitigation', 'Post-mortem', 'Automated safeguards']
        }
      ],
      technical: [
        {
          question: `How would you architect a high-throughput API service to handle 10,000+ requests per second with strict latency constraints?`,
          evaluates: 'Caching tiers, database indexing, horizontal scaling, and asynchronous job processing.',
          starStrategy: 'Start with high-level architecture diagram. Address load balancing, Redis caching layer, connection pooling, and message queues (e.g. Kafka/RabbitMQ) for deferred execution.',
          suggestedKeywords: ['Redis caching', 'Horizontal auto-scaling', 'Connection pooling', 'Asynchronous queues']
        },
        {
          question: `Explain how you diagnose and fix a subtle performance bottleneck or memory leak in production.`,
          evaluates: 'Observability, APM profiling tools, memory dumps, and database query optimization.',
          starStrategy: 'Walk through systematic diagnosis: metrics monitoring, APM traces, flame graphs, database slow query logs, followed by surgical verification in staging before deployment.',
          suggestedKeywords: ['APM telemetry', 'Query explain plans', 'Heap analysis', 'Micro-benchmarking']
        },
        {
          question: `What criteria do you use when choosing between a relational database (PostgreSQL) and a document store (MongoDB)?`,
          evaluates: 'ACID compliance, schema evolution, query pattern predictability, and data normalization.',
          starStrategy: 'Compare data relational integrity vs write speed, transaction semantics, indexing capabilities, and long-term reporting requirements.',
          suggestedKeywords: ['ACID transactions', 'Relational constraints', 'Schema migrations', 'Read vs Write workloads']
        }
      ],
      situational: [
        {
          question: `A critical deadline is in 48 hours, but you discover a bug that degrades latency by 15% under peak loads. What do you do?`,
          evaluates: 'Risk assessment, stakeholder escalation, and feature gating.',
          starStrategy: 'Quantify actual user impact. Present 3 options to leadership: launch with feature flag off, release hotfix with scoped rollback plan, or negotiate a 24h delay with clear rationale.',
          suggestedKeywords: ['Feature flagging', 'Risk matrix', 'Rollback strategy', 'Clear escalation']
        },
        {
          question: `How do you onboard new engineers and maintain consistent code quality across a rapidly scaling team?`,
          evaluates: 'Documentation discipline, automated CI linting/testing, and constructive PR reviews.',
          starStrategy: 'Describe hands-on pairing, comprehensive runbooks, strict PR review templates, and automated linter/type checks that run in CI before merge.',
          suggestedKeywords: ['CI/CD gates', 'Code review culture', 'Living documentation', 'Mentorship']
        }
      ]
    });

  } catch (error: any) {
    console.error('Error generating interview prep:', error);
    res.status(500).json({ error: 'Failed to generate interview prep.' });
  }
});

// POST /api/tailor-resume
app.post('/api/tailor-resume', async (req, res) => {
  try {
    const { resumeText = '', jobDescription = '', targetRole = '' } = req.body;

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide valid resume text.' });
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide a target job description.' });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `
You are an expert ATS optimization consultant.
Compare this resume against the target job description and generate precise tailoring suggestions:

TARGET ROLE: ${targetRole || 'Target Position'}
TARGET JOB DESCRIPTION:
"""
${jobDescription}
"""

RESUME TEXT:
"""
${resumeText}
"""

Return pure JSON:
{
  "tailorScore": number (0-100),
  "matchedKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "bulletRewrites": [
    {
      "original": "string",
      "tailored": "string",
      "alignmentReason": "string"
    }
  ],
  "sectionAdvice": [
    { "section": "Summary" | "Experience" | "Skills", "advice": "string" }
  ]
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Gemini tailor failed, using heuristic engine:', err);
      }
    }

    // Heuristic Tailoring Fallback
    const targetKeywords = [
      'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes',
      'SQL', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'CI/CD', 'Microservices',
      'System Design', 'Agile', 'Unit Testing', 'Tailwind CSS', 'FastAPI'
    ];

    const jdLower = jobDescription.toLowerCase();
    const resumeLower = resumeText.toLowerCase();

    const required = targetKeywords.filter(k => jdLower.includes(k.toLowerCase()));
    if (required.length === 0) {
      required.push('React', 'TypeScript', 'Node.js', 'REST API', 'SQL', 'AWS');
    }

    const matched = required.filter(k => resumeLower.includes(k.toLowerCase()));
    const missing = required.filter(k => !resumeLower.includes(k.toLowerCase()));

    const matchRatio = required.length > 0 ? (matched.length / required.length) : 0.75;
    const tailorScore = Math.min(96, Math.max(50, Math.round(matchRatio * 100)));

    return res.json({
      tailorScore,
      matchedKeywords: matched,
      missingKeywords: missing,
      bulletRewrites: [
        {
          original: 'Developed web applications using React and TypeScript.',
          tailored: `Architected full-stack features utilizing ${matched.slice(0, 3).join(', ')}, optimizing client performance and reducing API latency by [insert metric: e.g. 25%].`,
          alignmentReason: `Incorporates verified tech stack keywords from the job posting with active engineering impact.`
        },
        {
          original: 'Collaborated with cross-functional teams to build APIs.',
          tailored: `Engineered secure RESTful microservices with automated testing, accelerating feature deployment cycles by [insert timeline: e.g. 2 weeks].`,
          alignmentReason: 'Replaces passive collaboration verb with active engineering impact and automated testing safeguards.'
        }
      ],
      sectionAdvice: [
        {
          section: 'Summary',
          advice: `Explicitly align your title in the summary with "${targetRole || 'Target Role'}" to immediately pass the initial ATS title-matching filter.`
        },
        {
          section: 'Skills',
          advice: missing.length > 0
            ? `Incorporate missing keywords (${missing.slice(0, 3).join(', ')}) into your technical competencies block.`
            : 'Group your technical stack into clear categories (Languages, Frameworks, Cloud & Databases) for rapid scanner parsing.'
        },
        {
          section: 'Experience',
          advice: 'Add at least one measurable business metric (percentage, revenue, latency reduction) to your top 3 bullet points.'
        }
      ]
    });

  } catch (error: any) {
    console.error('Error in /api/tailor-resume:', error);
    res.status(500).json({ error: 'Failed to tailor resume.' });
  }
});

// POST /api/builder/summary
app.post('/api/builder/summary', async (req, res) => {
  try {
    const {
      targetRole = 'Software Engineer',
      experienceLevel = 'Mid-Senior',
      keySkills = '',
      experienceSnippet = '',
      jobDescription = ''
    } = req.body;

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `
You are an executive resume writer for tech and corporate roles.
Generate 3 distinct, ATS-optimized professional summaries for:
Target Role: ${targetRole}
Experience Level: ${experienceLevel}
Key Skills: ${keySkills || 'Modern engineering, system architecture, team collaboration'}
Experience Highlights: ${experienceSnippet || 'Built scalable applications and improved team velocity'}
Target Job Description: ${jobDescription || 'None provided'}

Provide JSON strictly conforming to:
{
  "summary": "Best recommended summary",
  "variations": [
    {
      "title": "Impact & Metric Focus",
      "formula": "Role + Years + Key Technologies + Quantified Impact",
      "text": "..."
    },
    {
      "title": "Technical Depth Focus",
      "formula": "Specialization + Architectural Rigor + Domain Mastery",
      "text": "..."
    },
    {
      "title": "Executive Leadership Focus",
      "formula": "Leadership Scope + Cross-Functional Scale + Delivery Velocity",
      "text": "..."
    }
  ]
}
Return ONLY valid JSON.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Gemini builder summary failed, using heuristic engine:', err);
      }
    }

    // Heuristic Summary Engine
    const skillsList = keySkills
      ? keySkills.split(/[,|]/).map((s: string) => s.trim()).filter(Boolean).slice(0, 4).join(', ')
      : 'React, TypeScript, Node.js, and cloud architectures';

    const v1 = `Results-driven ${targetRole} with proven experience engineering high-performance systems and user-facing applications. Proficient in ${skillsList}, with a track record of cutting API latency by 35% and delivering mission-critical product features on schedule.`;
    const v2 = `Technical ${targetRole} specializing in end-to-end software development, scalable system architecture, and robust automated testing. Deep expertise in ${skillsList}, dedicated to writing maintainable code and optimizing system resilience.`;
    const v3 = `High-impact ${targetRole} experienced in collaborating across cross-functional product and engineering teams. Leverages ${skillsList} to align technical execution with commercial roadmaps, accelerating feature release cycles by 25%.`;

    return res.json({
      summary: v1,
      variations: [
        {
          title: 'Impact & Metric Focus',
          formula: 'Role + Years + Key Technologies + Quantified Impact',
          text: v1
        },
        {
          title: 'Technical Depth Focus',
          formula: 'Specialization + Architectural Rigor + Domain Mastery',
          text: v2
        },
        {
          title: 'Executive Leadership Focus',
          formula: 'Leadership Scope + Cross-Functional Scale + Delivery Velocity',
          text: v3
        }
      ]
    });
  } catch (error: any) {
    console.error('Error in /api/builder/summary:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

// POST /api/builder/bullet
app.post('/api/builder/bullet', async (req, res) => {
  try {
    const { originalBullet = '', targetRole = 'Software Engineer', goal = 'impact', customPrompt = '' } = req.body;

    if (!originalBullet || originalBullet.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide a bullet point to improve.' });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `
You are an expert resume reviewer and executive coach.
Rewrite the following resume bullet point to make it more impactful for a ${targetRole} position.
Original bullet: "${originalBullet}"
Desired Goal: ${goal}
Custom Guidance: ${customPrompt || 'Use active verbs, avoid passive voice, highlight scale and business impact with quantifiable metric placeholders if none are present.'}

Provide JSON conforming strictly to:
{
  "original": "${originalBullet}",
  "variations": [
    {
      "type": "Recruiter Approved",
      "bullet": "string",
      "explanation": "string"
    },
    {
      "type": "Measurable Metrics",
      "bullet": "string",
      "explanation": "string"
    },
    {
      "type": "Action-Oriented Leadership",
      "bullet": "string",
      "explanation": "string"
    }
  ]
}
Return ONLY valid JSON.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Gemini builder bullet failed, using heuristic engine:', err);
      }
    }

    // Heuristic Bullet Improver
    const clean = originalBullet.replace(/^[•\-\*\s]+/, '').trim();
    const actionCore = clean.replace(/^(worked on|worked with|helped with|helped build|assisted with|assisted in|responsible for|handled|did|made|participated in|supported|involved in|tasks included|duties included)\s*/i, '').trim();

    return res.json({
      original: originalBullet,
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
    });
  } catch (error: any) {
    console.error('Error in /api/builder/bullet:', error);
    res.status(500).json({ error: 'Failed to rewrite bullet.' });
  }
});

// POST /api/builder/strengths
app.post('/api/builder/strengths', async (req, res) => {
  try {
    const { jobDescription = '', resumeText = '', targetRole = 'Software Engineer' } = req.body;

    const ai = getGenAI();
    if (ai && (jobDescription.trim().length > 20 || resumeText.trim().length > 20)) {
      try {
        const prompt = `
You are a career strategist analyzing job requirements and candidate qualifications.
Identify candidate strengths and key achievements to highlight front-and-center on their resume.
Target Role: ${targetRole}
Job Description:
"""
${jobDescription || 'High scale modern engineering, architecture, delivery velocity, cross-functional collaboration'}
"""
Resume Content:
"""
${resumeText || 'Full Stack Engineer with React, TypeScript, Node.js, SQL, AWS, microservices experience.'}
"""

Provide JSON:
{
  "strengths": [
    {
      "title": "Short title (under 5 words)",
      "category": "Technical Mastery" | "Execution Velocity" | "Team Leadership" | "Product Impact",
      "description": "1-2 sentences explaining why this matters for the target role",
      "metric": "e.g. +35% Latency Reduction or 45k+ Daily Users"
    }
  ],
  "recommendedKeyAchievements": [
    "Short 1-line achievement badge with metric",
    "Short 1-line achievement badge with metric",
    "Short 1-line achievement badge with metric"
  ]
}
Return ONLY valid JSON with at least 3 strengths and 3 achievements.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Gemini strengths failed, using heuristic engine:', err);
      }
    }

    // Heuristic Strengths Engine
    const jdLower = jobDescription.toLowerCase();
    const hasCloud = jdLower.includes('aws') || jdLower.includes('cloud') || jdLower.includes('kubernetes');
    const hasData = jdLower.includes('sql') || jdLower.includes('database') || jdLower.includes('postgres') || jdLower.includes('analytics');
    const hasScale = jdLower.includes('scale') || jdLower.includes('high-throughput') || jdLower.includes('latency');

    return res.json({
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
    });
  } catch (error: any) {
    console.error('Error in /api/builder/strengths:', error);
    res.status(500).json({ error: 'Failed to extract strengths.' });
  }
});

// POST /api/builder/extract-skills
app.post('/api/builder/extract-skills', async (req, res) => {
  try {
    const { jobDescription = '', resumeText = '' } = req.body;

    if (!jobDescription || jobDescription.trim().length < 15) {
      return res.status(400).json({ error: 'Please provide a job description to extract skills from.' });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `
Extract skills from this job posting and compare with the candidate's resume:
Job Description:
"""
${jobDescription}
"""
Resume Text:
"""
${resumeText || ''}
"""

Provide JSON:
{
  "hardSkills": [
    { "name": "string", "importance": "high" | "medium", "foundInResume": boolean }
  ],
  "softSkills": [
    { "name": "string", "foundInResume": boolean }
  ],
  "tools": [
    { "name": "string", "foundInResume": boolean }
  ]
}
Return ONLY valid JSON.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Gemini extract-skills failed, using heuristic engine:', err);
      }
    }

    // Heuristic Skills Extractor
    const hardSkillsTaxonomy = [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'Go', 'Rust',
      'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Next.js', 'Tailwind CSS'
    ];
    const softSkillsTaxonomy = [
      'Cross-functional Collaboration', 'Problem Solving', 'Communication',
      'Mentorship', 'Agile / Scrum', 'System Design', 'Stakeholder Management',
      'Product Ownership', 'Root Cause Analysis'
    ];
    const toolsTaxonomy = [
      'Git', 'GitHub', 'Jira', 'Figma', 'Postman', 'Datadog', 'Terraform', 'Webpack', 'Vite'
    ];

    const jdLower = jobDescription.toLowerCase();
    const resumeLower = resumeText.toLowerCase();

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

    return res.json({ hardSkills, softSkills, tools });
  } catch (error: any) {
    console.error('Error in /api/builder/extract-skills:', error);
    res.status(500).json({ error: 'Failed to extract skills.' });
  }
});

// Explicit Favicon & Manifest routes with cache headers
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Content-Type', 'image/x-icon');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

app.get(['/favicon.png', '/favicon-32x32.png', '/favicon-16x16.png', '/apple-touch-icon.png'], (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  const filename = path.basename(req.path);
  res.sendFile(path.join(__dirname, 'public', filename));
});

app.get('/favicon.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'public', 'favicon.svg'));
});

app.get('/site.webmanifest', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'public', 'site.webmanifest'));
});

// Vite Middleware for Development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const rawIndex = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      const template = await vite.transformIndexHtml(url, rawIndex);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  // Production static files
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`HireLens server running on http://localhost:${PORT}`);
});
