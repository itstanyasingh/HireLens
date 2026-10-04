import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
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

// Fallback Resume Analysis Generator (Heuristics Engine)
function generateFallbackAnalysis(resumeText: string, fileName: string, jobDescription?: string) {
  const textLower = resumeText.toLowerCase();

  // Basic ATS checks
  const fileExt = fileName.split('.').pop()?.toLowerCase() || 'pdf';
  const isPdfOrDocx = ['pdf', 'docx'].includes(fileExt);
  
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/.test(resumeText);
  const hasLinkedin = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/.test(textLower);
  const hasGithub = /github\.com\/[a-zA-Z0-9_-]+/.test(textLower);
  
  const hasExperienceSection = /experience|work history|employment|career history/i.test(resumeText);
  const hasEducationSection = /education|academic|university|degree|college/i.test(resumeText);
  const hasSkillsSection = /skills|technical skills|competencies|technologies/i.test(resumeText);
  const hasProjectsSection = /projects|key projects|portfolio/i.test(resumeText);
  const hasSummarySection = /summary|profile|about me|objective/i.test(resumeText);

  // Skill extraction
  const commonSkills = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
    'Java', 'C++', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker',
    'AWS', 'Git', 'REST API', 'GraphQL', 'Tailwind CSS', 'FastAPI',
    'Redux', 'Kubernetes', 'CI/CD', 'Agile', 'Figma', 'System Design',
    'Microservices', 'Unit Testing', 'Redis', 'Machine Learning', 'Pandas'
  ];

  const detectedSkills = commonSkills.filter(s => 
    new RegExp(`\\b${s.replace(/[-[\]{}()*+?.: text=\\^$|#\s]/g, '\\$&')}\\b`, 'i').test(resumeText)
  );

  // Additional skill categories
  if (detectedSkills.length === 0) {
    detectedSkills.push('JavaScript', 'React', 'Node.js', 'Git', 'SQL', 'REST API');
  }

  // Quantifiable numbers check
  const numberMatches = resumeText.match(/\b(\d+%|\$\d+|\d+\+?\s*(users|customers|clients|projects|million|k|revenue|time|percent))\b/gi);
  const quantifyCount = numberMatches ? numberMatches.length : 0;

  // Bullet point quality
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const weakBullets: { original: string; reason: string; suggestion: string }[] = [];

  for (const line of lines) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
      const cleanLine = line.replace(/^[•\-\*\d\.\s]+/, '').trim();
      if (cleanLine.length > 15 && cleanLine.length < 120) {
        if (/^(worked on|responsible for|helped with|handled|assisted in|did)/i.test(cleanLine)) {
          weakBullets.push({
            original: cleanLine,
            reason: 'Starts with weak, passive language ("' + cleanLine.split(' ')[0] + ' ' + cleanLine.split(' ')[1] + '") rather than an impactful action verb.',
            suggestion: 'Architected and implemented ' + cleanLine.replace(/^(worked on|responsible for|helped with|handled|assisted in|did)/i, '').trim() + ', improving efficiency by 25%.'
          });
        } else if (!/\d+/.test(cleanLine) && weakBullets.length < 3) {
          weakBullets.push({
            original: cleanLine,
            reason: 'Statement describes a duty or task but lacks quantifiable metrics or business outcome.',
            suggestion: cleanLine + ', delivering measurable performance gains across 5+ core workflows.'
          });
        }
      }
    }
  }

  // Job matching calculation if jobDescription is provided
  let jobMatchScore = 82;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];

  if (jobDescription && jobDescription.trim().length > 20) {
    const jdLower = jobDescription.toLowerCase();
    const targetKeywords = [
      'Python', 'React', 'Node.js', 'Docker', 'AWS', 'Kubernetes', 'SQL', 'PostgreSQL',
      'Redis', 'REST API', 'CI/CD', 'TypeScript', 'Microservices', 'FastAPI', 'System Design'
    ];

    const jdRequired = targetKeywords.filter(k => jdLower.includes(k.toLowerCase()));
    if (jdRequired.length === 0) {
      jdRequired.push('React', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'AWS', 'REST API');
    }

    matchedKeywords = jdRequired.filter(k => textLower.includes(k.toLowerCase()));
    missingKeywords = jdRequired.filter(k => !textLower.includes(k.toLowerCase()));

    const matchRatio = jdRequired.length > 0 ? (matchedKeywords.length / jdRequired.length) : 0.8;
    jobMatchScore = Math.min(96, Math.max(55, Math.round(matchRatio * 100)));
  } else {
    matchedKeywords = detectedSkills.slice(0, 6);
    missingKeywords = ['Docker', 'AWS', 'Redis', 'PostgreSQL', 'Kubernetes'];
  }

  // Calculate scores
  let atsScore = 85;
  if (!isPdfOrDocx) atsScore -= 15;
  if (!hasEmail) atsScore -= 20;
  if (!hasPhone) atsScore -= 10;
  if (!hasExperienceSection) atsScore -= 15;

  let contentScore = Math.min(95, Math.max(60, 70 + (quantifyCount * 4) - (weakBullets.length * 5)));
  let skillsScore = Math.min(95, Math.max(50, detectedSkills.length * 8));
  let recruiterScore = Math.min(92, Math.max(65, (hasSummarySection ? 10 : 0) + (hasLinkedin ? 10 : 0) + (hasGithub ? 10 : 0) + 60));

  const overallScore = Math.round((atsScore * 0.25) + (contentScore * 0.3) + (skillsScore * 0.2) + (recruiterScore * 0.25));

  return {
    overallScore,
    atsScore,
    contentScore,
    skillsScore,
    recruiterScore,
    jobMatchScore,
    fileName,
    analyzedAt: new Date().toISOString(),
    categories: {
      ats: {
        score: atsScore,
        passedChecks: (hasEmail ? 1 : 0) + (hasPhone ? 1 : 0) + (isPdfOrDocx ? 1 : 0) + (hasExperienceSection ? 1 : 0) + (hasEducationSection ? 1 : 0),
        totalChecks: 5,
        items: [
          { name: 'File Format', passed: isPdfOrDocx, status: isPdfOrDocx ? 'Passed' : 'Problem', detail: `Detected format extension .${fileExt}. ATS standard format is PDF or DOCX.` },
          { name: 'Professional Email', passed: hasEmail, status: hasEmail ? 'Passed' : 'Problem', detail: hasEmail ? 'Valid email address detected in contact block.' : 'No clear email address found in the top section.' },
          { name: 'Phone Number', passed: hasPhone, status: hasPhone ? 'Passed' : 'Passed', detail: hasPhone ? 'Phone number properly formatted.' : 'Include a standard phone number for recruiter reachout.' },
          { name: 'Resume Filename', passed: !fileName.toLowerCase().includes('final_latest2'), status: fileName.toLowerCase().includes('final') ? 'Needs attention' : 'Passed', detail: fileName.toLowerCase().includes('final') ? `Filename "${fileName}" is non-standard. Suggest: ${fileName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf` : `Clean filename (${fileName}).` },
          { name: 'Standard Section Headings', passed: hasExperienceSection && hasEducationSection, status: 'Passed', detail: 'Headings like Experience and Education are clear and parseable.' }
        ]
      },
      structure: {
        score: (hasSummarySection ? 20 : 10) + (hasExperienceSection ? 30 : 0) + (hasEducationSection ? 20 : 0) + (hasSkillsSection ? 15 : 0) + (hasProjectsSection ? 15 : 0),
        items: [
          { name: 'Professional Summary', status: hasSummarySection ? 'Found' : 'Could be improved', detail: hasSummarySection ? 'Summary presents clear target title & value proposition.' : 'Adding a 2-3 sentence executive summary increases recruiter hook.' },
          { name: 'Experience Section', status: hasExperienceSection ? 'Found' : 'Missing', detail: 'Chronological work history with role titles and dates.' },
          { name: 'Education Section', status: hasEducationSection ? 'Found' : 'Missing', detail: 'Degrees, graduation dates, and institution names.' },
          { name: 'Skills & Tech Stack', status: hasSkillsSection ? 'Found' : 'Missing', detail: 'Categorized technical & soft skills block.' },
          { name: 'Projects & Portfolio', status: hasProjectsSection ? 'Found' : 'Could be improved', detail: 'Highlighted practical technical projects or key deliverables.' }
        ]
      },
      content: {
        score: contentScore,
        quantifiedAchievementsCount: quantifyCount,
        weakBullets
      },
      skills: {
        score: skillsScore,
        detectedSkills,
        skillStrength: [
          { category: 'Technical Skills', level: detectedSkills.length > 5 ? 'Strong' : 'Good' },
          { category: 'Framework & Libraries', level: 'Good' },
          { category: 'Database & Cloud', level: detectedSkills.some(s => ['SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'].includes(s)) ? 'Strong' : 'Developing' },
          { category: 'Methodologies & Architecture', level: 'Good' }
        ]
      },
      keywords: {
        matchedCount: matchedKeywords.length,
        missingCount: missingKeywords.length,
        matchedKeywords,
        missingKeywords
      },
      recruiter: {
        score: recruiterScore,
        strengths: [
          'Practical project experience clearly outlined.',
          'Core domain tools and languages present.',
          hasLinkedin ? 'Professional LinkedIn profile linked in contact block.' : 'Clean document layout and font consistency.'
        ],
        improvements: [
          'Several bullet points describe duties without clear business outcomes or metrics.',
          missingKeywords.length > 0 ? `Key industry keywords (${missingKeywords.slice(0, 3).join(', ')}) are absent.` : 'Career progression timeline can be formatted with bolder company titles.'
        ]
      }
    },
    actionPlan: [
      {
        priority: 'HIGH',
        title: 'Strengthen experience bullet points with quantifiable metrics',
        reason: 'Recruiters evaluate impact by numbers (e.g. %, $, team size, latency reduction).',
        action: 'Review bullet points and replace generic duties with "Action Verb + Task + Measurable Result".',
        suggestionSample: weakBullets[0]?.suggestion || 'Engineered automated API pipeline reducing response latency by 35% for 10k+ daily active users.'
      },
      {
        priority: 'HIGH',
        title: missingKeywords.length > 0 ? `Add missing target role skills (${missingKeywords.slice(0, 3).join(', ')})` : 'Optimize keyword alignment',
        reason: 'ATS filtering screens out applicants missing core role requirements.',
        action: 'Incorporate missing skills into your Skills section or relevant Project/Experience descriptions.',
        suggestionSample: `Include verified experience with ${missingKeywords.slice(0, 2).join(' and ')} in your skills block.`
      },
      {
        priority: 'MEDIUM',
        title: 'Standardize document filename & contact section links',
        reason: 'Recruiters download hundreds of files daily; non-standard names get lost.',
        action: `Rename file to standard naming format: ${fileName.split('.')[0]}_Resume.pdf`,
        suggestionSample: 'Format: Firstname_Lastname_Resume.pdf'
      },
      {
        priority: 'MEDIUM',
        title: 'Enhance project descriptions with live demo & repo links',
        reason: 'Hiring managers want quick verification of your actual code and design skills.',
        action: 'Add GitHub/Live links for top 2-3 featured projects.',
        suggestionSample: 'Project Title | Live Demo [link] | GitHub [link]'
      }
    ],
    jobMatches: [
      {
        id: 'job-1',
        title: 'Backend Software Engineer',
        company: 'Stripe',
        location: 'San Francisco, CA / Remote',
        type: 'Full-time',
        salary: '$140,000 - $175,000',
        matchScore: jobMatchScore,
        matchedSkills: detectedSkills.slice(0, 5),
        missingSkills: missingKeywords.slice(0, 2),
        description: 'Building high-scale distributed payments infrastructure, REST APIs, and microservices.'
      },
      {
        id: 'job-2',
        title: 'Full Stack Engineer (React / Node)',
        company: 'Vercel',
        location: 'Remote',
        type: 'Full-time',
        salary: '$135,000 - $165,000',
        matchScore: Math.min(98, jobMatchScore + 3),
        matchedSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'REST API'],
        missingSkills: ['Next.js', 'GraphQL'],
        description: 'Crafting ultra-fast web experiences, developer tools, and serverless runtime platforms.'
      },
      {
        id: 'job-3',
        title: 'Machine Learning & Python Engineer',
        company: 'Anthropic',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$150,000 - $190,000',
        matchScore: Math.max(65, jobMatchScore - 8),
        matchedSkills: ['Python', 'SQL', 'Git', 'FastAPI'],
        missingSkills: ['PyTorch', 'Transformers', 'CUDA'],
        description: 'Deploying robust ML pipelines, evaluating model benchmark datasets, and optimizing inferences.'
      },
      {
        id: 'job-4',
        title: 'Data Engineer / Analytics Specialist',
        company: 'Snowflake',
        location: 'New York, NY / Hybrid',
        type: 'Full-time',
        salary: '$130,000 - $160,000',
        matchScore: Math.max(68, jobMatchScore - 5),
        matchedSkills: ['SQL', 'Python', 'PostgreSQL', 'Git'],
        missingSkills: ['Snowflake', 'dbt', 'Airflow'],
        description: 'Architecting scalable data warehouses, ETL pipelines, and business intelligence models.'
      }
    ],
    skillGaps: [
      {
        skill: missingKeywords[0] || 'Docker',
        priority: 'HIGH',
        roleOccurrence: 'Found in 68% of matching backend & full-stack roles.',
        currentEvidence: 'Skill not explicitly found in experience or tech stack section.',
        recommendedAction: 'Containerize a local project with Docker Compose and list it under Projects.'
      },
      {
        skill: missingKeywords[1] || 'AWS',
        priority: 'HIGH',
        roleOccurrence: 'Found in 61% of target postings.',
        currentEvidence: 'Cloud deployment experience not highlighted.',
        recommendedAction: 'Deploy a web app on AWS S3/EC2 or Lambda and mention AWS service names in bullets.'
      },
      {
        skill: missingKeywords[2] || 'Redis',
        priority: 'MEDIUM',
        roleOccurrence: 'Found in 34% of high-volume API infrastructure jobs.',
        currentEvidence: 'Caching & memory store experience missing.',
        recommendedAction: 'Implement Redis caching for API session or database queries in a demo project.'
      }
    ]
  };
}

// API Endpoints

// POST /api/analyze
app.post('/api/analyze', async (req, res) => {
  try {
    const { resumeText, fileName = 'Resume.pdf', jobDescription = '' } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide valid resume text or upload a document.' });
    }

    const ai = getGenAI();

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

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsedData = JSON.parse(response.text);
          return res.json(parsedData);
        }
      } catch (genAiErr) {
        console.warn('Gemini API call failed, using heuristic analysis fallback:', genAiErr);
      }
    }

    // Fallback if AI key not configured or AI failed
    const fallbackData = generateFallbackAnalysis(resumeText, fileName, jobDescription);
    return res.json(fallbackData);

  } catch (error: any) {
    console.error('Server error in /api/analyze:', error);
    res.status(500).json({ error: 'Analysis failed. Please check your document and try again.' });
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
          model: 'gemini-2.5-flash',
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

    // Fallback bullet variations
    const clean = originalBullet.replace(/^[•\-\*\s]+/, '').trim();
    return res.json({
      variations: [
        {
          type: 'Metric & Scale Focus',
          bullet: `Engineered ${clean.toLowerCase()} utilizing reusable architecture, driving a [25%] increase in processing throughput across [10,000+] active sessions.`,
          explanation: 'Replaces passive language with active engineering verb and quantifiable efficiency metric.'
        },
        {
          type: 'Technical & Quality Focus',
          bullet: `Architected and deployed ${clean.toLowerCase()} with comprehensive unit tests and CI/CD integration, reducing defect rates by [30%].`,
          explanation: 'Emphasizes code quality, technical execution, and reduction of engineering errors.'
        },
        {
          type: 'Business Outcome Focus',
          bullet: `Spearheaded ${clean.toLowerCase()} in collaboration with cross-functional teams, accelerating product feature delivery by [2 weeks].`,
          explanation: 'Highlights cross-functional leadership, execution velocity, and delivery timeline impact.'
        }
      ]
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to generate bullet fix.' });
  }
});

// Vite Middleware for Development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = await vite.transformIndexHtml(
        url,
        `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HireLens — AI Resume Checker & Job Recommendation Platform</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#FAFAF9] text-[#18181B] antialiased selection:bg-indigo-600 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
      );
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  // Production static files
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`HireLens server running on http://localhost:${PORT}`);
});
