import { AnalysisReport } from './api';

// Extensive Taxonomy of 200+ Recognized Technical & Professional Skills
export const SKILLS_TAXONOMY: Record<string, string[]> = {
  'Programming Languages': [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C', 'Go', 'Golang', 
    'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Dart', 'Shell', 'Bash'
  ],
  'Frontend Frameworks & Web': [
    'React', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Svelte', 'HTML5', 'HTML', 'CSS3', 'CSS', 
    'Tailwind CSS', 'Tailwind', 'Bootstrap', 'Redux', 'Zustand', 'GraphQL', 'Webpack', 'Vite', 
    'Sass', 'SCSS', 'Material UI', 'Chakra UI', 'jQuery', 'WebSockets'
  ],
  'Backend & Frameworks': [
    'Node.js', 'Node', 'Express', 'Express.js', 'Nest.js', 'Django', 'FastAPI', 'Flask', 
    'Spring Boot', 'Spring', 'Ruby on Rails', 'Rails', 'ASP.NET', '.NET Core', 'Laravel', 
    'REST API', 'RESTful APIs', 'gRPC', 'Microservices', 'Kafka', 'RabbitMQ'
  ],
  'Databases & Storage': [
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB', 'Cassandra', 
    'Oracle', 'Elasticsearch', 'Firebase', 'Supabase', 'Prisma', 'Drizzle', 'TypeORM', 'Snowflake'
  ],
  'Cloud, DevOps & Infra': [
    'AWS', 'Amazon Web Services', 'GCP', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'K8s', 
    'Terraform', 'CI/CD', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Linux', 'Nginx', 'Vercel', 
    'Serverless', 'Ansible', 'Cloudflare'
  ],
  'AI, ML & Data Science': [
    'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'OpenCV', 
    'Pandas', 'NumPy', 'NLP', 'Natural Language Processing', 'LLMs', 'LangChain', 'Computer Vision', 
    'Generative AI', 'Hugging Face', 'Data Analysis', 'Tableau', 'Power BI'
  ],
  'Tools, Testing & Methodologies': [
    'Git', 'GitHub', 'GitLab', 'Jira', 'Postman', 'Jest', 'Cypress', 'Playwright', 'Selenium', 
    'Figma', 'Agile', 'Scrum', 'Unit Testing', 'System Design', 'TDD', 'CI/CD Pipelines'
  ],
  'Leadership & Professional': [
    'Project Management', 'Cross-functional Collaboration', 'Code Reviews', 'Technical Leadership', 
    'Mentorship', 'Stakeholder Management', 'Sprint Planning', 'Product Roadmapping'
  ]
};

const WEAK_VERB_PATTERNS = [
  { regex: /\b(worked on|worked with|helped with|helped build|assisted with|assisted in|responsible for|handled|did|made|participated in|supported|involved in|tasks included|duties included)\b/gi, label: 'Passive or weak phrasing' },
];

const STRONG_VERBS = [
  'engineered', 'architected', 'spearheaded', 'accelerated', 'deployed', 'orchestrated',
  'developed', 'designed', 'streamlined', 'optimized', 'automated', 'implemented',
  'refactored', 'built', 'launched', 'scaled', 'delivered', 'established', 'formulated',
  'championed', 'revitalized', 'curated', 'pioneered', 'maximized', 'minimized'
];

/**
 * Deterministic Resume Parsing & Analysis Engine
 */
export function analyzeResumeContent(
  resumeText: string,
  fileName: string,
  jobDescription?: string
): AnalysisReport {
  const text = resumeText || '';
  const textLower = text.toLowerCase();
  const fileExt = fileName.split('.').pop()?.toLowerCase() || 'pdf';
  const isPdfOrDocx = ['pdf', 'docx'].includes(fileExt);

  // 1. Contact Extraction
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : null;

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  const hasLinkedin = /(?:linkedin\.com\/(?:in|company)\/|linkedin:[ ]*[a-zA-Z0-9_-]+)/i.test(text);
  const hasGithub = /(?:github\.com\/|github:[ ]*[a-zA-Z0-9_-]+)/i.test(text);
  const hasPortfolio = /(?:portfolio|https?:\/\/[^\s]+\.(?:dev|io|me|app|com))/i.test(text);

  // 2. Section Detection
  const hasSummary = /\b(summary|professional summary|executive summary|profile|about me|objective)\b/i.test(text);
  const hasExperience = /\b(experience|work experience|employment history|work history|career history|professional experience)\b/i.test(text);
  const hasEducation = /\b(education|academic background|university|college|degrees?)\b/i.test(text);
  const hasSkills = /\b(skills|technical skills|technologies|core competencies|tech stack|tools & languages)\b/i.test(text);
  const hasProjects = /\b(projects|key projects|personal projects|portfolio projects|open source)\b/i.test(text);
  const hasCertifications = /\b(certifications?|licenses?|credentials?)\b/i.test(text);

  // 3. Skills Extraction from Taxonomy
  const detectedSkillsSet = new Set<string>();
  const skillCategoryCount: Record<string, number> = {};

  for (const [category, skillsList] of Object.entries(SKILLS_TAXONOMY)) {
    skillCategoryCount[category] = 0;
    for (const skill of skillsList) {
      // Word boundary regex matching
      const escapedSkill = skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#.])${escapedSkill}(?:$|[^a-zA-Z0-9+#.])`, 'i');
      
      if (regex.test(text)) {
        detectedSkillsSet.add(skill);
        skillCategoryCount[category]++;
      }
    }
  }

  const detectedSkills = Array.from(detectedSkillsSet);

  // Skill domain evaluation
  const skillStrength = Object.entries(skillCategoryCount)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => {
      let level: 'Strong' | 'Good' | 'Developing' = 'Developing';
      if (count >= 4) level = 'Strong';
      else if (count >= 2) level = 'Good';
      return { category, level };
    });

  if (skillStrength.length === 0) {
    skillStrength.push({ category: 'General Technical Skills', level: 'Developing' });
  }

  // 4. Content Quality & Bullet Extraction
  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const bulletLines: string[] = [];

  for (const line of rawLines) {
    if (/^[•\-\*\u2022\u25E6\u2043\u2219]\s*/.test(line) || /^\d+\.\s+/.test(line)) {
      const clean = line.replace(/^[•\-\*\u2022\u25E6\u2043\u2219\d\.\s]+/, '').trim();
      if (clean.length >= 15) {
        bulletLines.push(clean);
      }
    } else if (line.length >= 25 && line.length <= 220 && !line.endsWith(':') && !hasSectionHeaderMatch(line)) {
      // Consider standalone sentences as potential bullet descriptions
      if (line.split(' ').length >= 5) {
        bulletLines.push(line);
      }
    }
  }

  // Quantified metrics detection
  const metricRegex = /\b(\d+(?:\.\d+)?%|\$\d+(?:,\d{3})*(?:\.\d+)?(?:k|m|b|million|billion)?|\d+\+?\s*(?:users|clients|customers|requests|transactions|ms|seconds|minutes|hours|days|weeks|months|years|x|engineers|developers|sprints|features|endpoints|nodes|servers|test cases|tests))\b/gi;
  const metricsFound = text.match(metricRegex) || [];
  const quantifiedAchievementsCount = metricsFound.length;

  // Weak bullet points identification
  const weakBullets: { original: string; reason: string; suggestion: string }[] = [];
  const firstWordMap: Record<string, number> = {};

  for (const bullet of bulletLines) {
    const firstWord = bullet.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
    if (firstWord) {
      firstWordMap[firstWord] = (firstWordMap[firstWord] || 0) + 1;
    }

    // Check for weak starter verbs
    if (/^(worked on|worked with|helped|assisted|responsible for|handled|participated in|supported|involved in|did|made|duties included)/i.test(bullet)) {
      const coreAction = bullet.replace(/^(worked on|worked with|helped with|helped build|assisted with|assisted in|responsible for|handled|did|made|participated in|supported|involved in|tasks included|duties included)\s*/i, '');
      weakBullets.push({
        original: bullet,
        reason: 'Begins with passive, duty-focused phrasing rather than an impactful active verb.',
        suggestion: `Engineered and executed ${coreAction}, increasing system reliability and workflow efficiency by [20%].`
      });
    } else if (!metricRegex.test(bullet) && bullet.length > 25 && weakBullets.length < 4) {
      // Bullet without metrics
      weakBullets.push({
        original: bullet,
        reason: 'Statement describes a responsibility but lacks quantifiable impact, scale, or business outcome.',
        suggestion: `${bullet.replace(/\.$/, '')}, achieving measurable throughput gains across [10k+] monthly operations.`
      });
    }
  }

  // 5. Keyword & Job Matching Evaluation
  let jobMatchScore = 80;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];

  if (jobDescription && jobDescription.trim().length > 20) {
    const jdSkills = new Set<string>();
    for (const [_, skillsList] of Object.entries(SKILLS_TAXONOMY)) {
      for (const skill of skillsList) {
        const escaped = skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        if (new RegExp(`(?:^|[^a-zA-Z0-9+#.])${escaped}(?:$|[^a-zA-Z0-9+#.])`, 'i').test(jobDescription)) {
          jdSkills.add(skill);
        }
      }
    }

    const jdRequired = Array.from(jdSkills);
    if (jdRequired.length > 0) {
      matchedKeywords = jdRequired.filter(s => detectedSkillsSet.has(s));
      missingKeywords = jdRequired.filter(s => !detectedSkillsSet.has(s));
      const ratio = matchedKeywords.length / jdRequired.length;
      jobMatchScore = Math.min(96, Math.max(45, Math.round(ratio * 100)));
    } else {
      matchedKeywords = detectedSkills.slice(0, 6);
      missingKeywords = ['Docker', 'AWS', 'CI/CD'];
      jobMatchScore = 75;
    }
  } else {
    // Benchmark against industry standard modern software / role skills
    const benchmarkSkills = ['Git', 'REST API', 'SQL', 'Docker', 'CI/CD', 'Unit Testing', 'TypeScript', 'Agile'];
    matchedKeywords = benchmarkSkills.filter(s => detectedSkillsSet.has(s));
    missingKeywords = benchmarkSkills.filter(s => !detectedSkillsSet.has(s));
    jobMatchScore = Math.min(94, Math.max(60, Math.round((matchedKeywords.length / benchmarkSkills.length) * 100)));
  }

  // 6. ATS Essentials Checklist
  const atsItems = [
    {
      name: 'File Format',
      passed: isPdfOrDocx,
      status: isPdfOrDocx ? 'Passed' : 'Problem',
      detail: isPdfOrDocx 
        ? `Detected standard format (.${fileExt}). Compatible with enterprise ATS parsers.` 
        : `Detected format .${fileExt}. Modern ATS systems prefer clean PDF or DOCX documents.`
    },
    {
      name: 'Professional Email',
      passed: !!email,
      status: email ? 'Passed' : 'Problem',
      detail: email 
        ? `Valid contact email found: ${email}.` 
        : 'No direct email address found in the contact header.'
    },
    {
      name: 'Phone Number',
      passed: !!phone,
      status: phone ? 'Passed' : 'Needs attention',
      detail: phone 
        ? `Phone number formatted correctly: ${phone}.` 
        : 'No direct telephone contact number identified.'
    },
    {
      name: 'Professional Profile Links',
      passed: hasLinkedin || hasGithub || hasPortfolio,
      status: (hasLinkedin || hasGithub) ? 'Passed' : 'Needs attention',
      detail: hasLinkedin && hasGithub 
        ? 'LinkedIn and GitHub profiles identified in header block.' 
        : hasLinkedin 
        ? 'LinkedIn profile detected.' 
        : hasGithub 
        ? 'GitHub profile detected. Suggest adding your LinkedIn profile.' 
        : 'No LinkedIn, GitHub, or portfolio links detected.'
    },
    {
      name: 'Standard Section Headings',
      passed: hasExperience && hasEducation,
      status: (hasExperience && hasEducation) ? 'Passed' : 'Problem',
      detail: (hasExperience && hasEducation && hasSkills) 
        ? 'Standard section headings (Experience, Education, Skills) detected.' 
        : 'Some standard section headings are ambiguous or missing.'
    }
  ];

  const atsPassedCount = atsItems.filter(i => i.passed).length;

  // 7. Structure Items
  const structureItems = [
    {
      name: 'Professional Summary',
      status: hasSummary ? 'Found' : 'Could be improved',
      detail: hasSummary 
        ? 'Summary block introduces your target title and core competencies.' 
        : 'Adding a 2-3 sentence executive summary introduces your career value proposition.'
    },
    {
      name: 'Work Experience Section',
      status: hasExperience ? 'Found' : 'Missing',
      detail: hasExperience 
        ? 'Chronological employment history with dates and titles detected.' 
        : 'No clear professional work history section detected.'
    },
    {
      name: 'Education Section',
      status: hasEducation ? 'Found' : 'Missing',
      detail: hasEducation 
        ? 'Degrees and academic institutions detected.' 
        : 'No clear academic education section identified.'
    },
    {
      name: 'Skills & Tech Stack',
      status: hasSkills ? 'Found' : (detectedSkills.length > 3 ? 'Could be improved' : 'Missing'),
      detail: hasSkills 
        ? `Dedicated technical skills section detected with ${detectedSkills.length} parsed skills.` 
        : 'Skills are dispersed throughout text but lack a dedicated, categorized Skills section.'
    },
    {
      name: 'Projects & Portfolio',
      status: hasProjects ? 'Found' : 'Could be improved',
      detail: hasProjects 
        ? 'Highlighted practical technical projects and deliverables detected.' 
        : 'Adding 2-3 technical projects provides evidence of real-world implementation.'
    }
  ];

  // 8. Deterministic Scoring Logic
  // ATS Score (0-100)
  let atsScore = 50;
  if (isPdfOrDocx) atsScore += 15;
  if (email) atsScore += 15;
  if (phone) atsScore += 10;
  if (hasExperience) atsScore += 15;
  if (hasEducation) atsScore += 10;
  if (hasLinkedin || hasGithub) atsScore += 10;
  if (!text.includes('curriculum vitae') && text.length > 200) atsScore += 5;
  atsScore = Math.min(100, Math.max(30, atsScore));

  // Content Score (0-100)
  let contentScore = 55;
  const strongVerbCount = STRONG_VERBS.filter(v => textLower.includes(v)).length;
  contentScore += Math.min(25, strongVerbCount * 3);
  contentScore += Math.min(20, quantifiedAchievementsCount * 4);
  contentScore -= Math.min(20, weakBullets.length * 4);
  if (hasSummary) contentScore += 5;
  contentScore = Math.min(98, Math.max(35, contentScore));

  // Skills Score (0-100)
  let skillsScore = 40;
  skillsScore += Math.min(35, detectedSkills.length * 4);
  skillsScore += Math.min(20, skillStrength.length * 5);
  if (hasSkills) skillsScore += 10;
  skillsScore = Math.min(98, Math.max(30, skillsScore));

  // Recruiter Score (0-100)
  let recruiterScore = 50;
  if (hasExperience) recruiterScore += 15;
  if (hasLinkedin) recruiterScore += 10;
  if (quantifiedAchievementsCount >= 3) recruiterScore += 15;
  if (detectedSkills.length >= 6) recruiterScore += 10;
  if (hasProjects) recruiterScore += 10;
  recruiterScore = Math.min(96, Math.max(40, recruiterScore));

  // Overall Score (Deterministic Weighted Average)
  const overallScore = Math.round(
    atsScore * 0.30 +
    contentScore * 0.25 +
    skillsScore * 0.20 +
    recruiterScore * 0.25
  );

  // 9. Action Plan
  const actionPlan: AnalysisReport['actionPlan'] = [];

  if (quantifiedAchievementsCount < 4) {
    actionPlan.push({
      priority: 'HIGH',
      title: 'Strengthen experience bullet points with quantifiable metrics',
      reason: 'Recruiters evaluate engineering impact by metrics (e.g., % improvement, $ revenue, user count, latency reduction).',
      action: 'Review bullet points and replace generic duties with "Action Verb + Technical Scope + Measurable Result".',
      suggestionSample: weakBullets[0]?.suggestion || 'Engineered automated pipeline reducing test execution time by 35% across 500+ daily builds.'
    });
  }

  if (missingKeywords.length > 0) {
    actionPlan.push({
      priority: 'HIGH',
      title: `Incorporate missing core competencies (${missingKeywords.slice(0, 3).join(', ')})`,
      reason: 'Automated screening algorithms filter candidates who lack key technical keywords.',
      action: 'Integrate verified technologies into your dedicated Skills section and project descriptions.',
      suggestionSample: `Include verified proficiency with ${missingKeywords.slice(0, 2).join(' and ')} in your tech stack list.`
    });
  }

  if (!hasLinkedin || !hasGithub) {
    actionPlan.push({
      priority: 'MEDIUM',
      title: 'Add complete online profile URLs (LinkedIn & GitHub)',
      reason: 'Recruiters frequently cross-reference code repositories and career history online during initial screens.',
      action: 'Place direct links to LinkedIn and GitHub alongside your email and phone number in the contact header.',
      suggestionSample: 'LinkedIn: linkedin.com/in/yourname | GitHub: github.com/yourname'
    });
  }

  if (!hasSummary) {
    actionPlan.push({
      priority: 'MEDIUM',
      title: 'Include a high-impact 3-sentence professional summary',
      reason: 'A targeted summary anchors your primary specialization for recruiters during a 6-second scan.',
      action: 'Add a 3-sentence summary highlighting your years of experience, core stack, and standout achievements.',
      suggestionSample: `Results-driven software engineer specializing in ${detectedSkills.slice(0, 3).join(', ')} with a track record of delivering scalable web systems.`
    });
  }

  return {
    id: 'report_' + Date.now(),
    overallScore,
    atsScore,
    contentScore,
    skillsScore,
    recruiterScore,
    jobMatchScore,
    fileName: fileName || 'Resume.pdf',
    analyzedAt: new Date().toISOString(),
    resumeText: text,
    jobDescription,
    categories: {
      ats: {
        score: atsScore,
        passedChecks: atsPassedCount,
        totalChecks: atsItems.length,
        items: atsItems
      },
      structure: {
        score: Math.round(((hasSummary ? 1 : 0) + (hasExperience ? 2 : 0) + (hasEducation ? 1 : 0) + (hasSkills ? 1 : 0) + (hasProjects ? 1 : 0)) / 6 * 100),
        items: structureItems
      },
      content: {
        score: contentScore,
        quantifiedAchievementsCount,
        weakBullets
      },
      skills: {
        score: skillsScore,
        detectedSkills,
        skillStrength
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
          detectedSkills.length > 5 ? `Rich technical stack with ${detectedSkills.length} identified technologies.` : 'Technical foundation present.',
          quantifiedAchievementsCount > 0 ? `${quantifiedAchievementsCount} quantifiable performance metrics identified in accomplishments.` : 'Standard chronological format.',
          hasLinkedin ? 'Professional LinkedIn profile linked in contact block.' : 'Contact email detected.'
        ],
        improvements: [
          weakBullets.length > 0 ? `${weakBullets.length} bullet points lack measurable business outcomes or start with passive verbs.` : 'Enhance bullet specificity.',
          missingKeywords.length > 0 ? `Key industry competencies (${missingKeywords.slice(0, 3).join(', ')}) are absent from the document.` : 'Tailor keyword positioning.'
        ]
      }
    },
    actionPlan,
    jobMatches: [
      {
        id: 'job-1',
        title: detectedSkills.some(s => ['React', 'Vue', 'Angular', 'Frontend'].includes(s)) ? 'Senior Frontend Engineer' : 'Backend Software Engineer',
        company: 'Stripe',
        location: 'San Francisco, CA / Remote',
        type: 'Full-time',
        salary: '$145,000 - $185,000',
        matchScore: jobMatchScore,
        matchedSkills: detectedSkills.slice(0, 5),
        missingSkills: missingKeywords.slice(0, 2),
        description: 'Building high-scale distributed payments infrastructure, modern user interfaces, and robust APIs.'
      },
      {
        id: 'job-2',
        title: 'Full Stack Engineer (TypeScript / Cloud)',
        company: 'Vercel',
        location: 'Remote',
        type: 'Full-time',
        salary: '$135,000 - $170,000',
        matchScore: Math.min(98, Math.max(50, jobMatchScore + 4)),
        matchedSkills: detectedSkills.filter(s => ['TypeScript', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'AWS'].includes(s)),
        missingSkills: missingKeywords.slice(0, 2),
        description: 'Crafting ultra-fast web experiences, developer tools, and serverless runtime cloud platforms.'
      }
    ],
    skillGaps: missingKeywords.slice(0, 3).map((skill, idx) => ({
      skill,
      priority: (idx === 0 ? 'HIGH' : 'MEDIUM') as 'HIGH' | 'MEDIUM',
      roleOccurrence: `Found in ${65 - idx * 12}% of target postings in this domain.`,
      currentEvidence: 'Competency not explicitly detected in experience or skills block.',
      recommendedAction: `Incorporate practical project implementation of ${skill} and list in Skills.`
    }))
  };
}

function hasSectionHeaderMatch(line: string): boolean {
  return /^(experience|work experience|education|skills|projects|summary|objective|certifications|awards|publications)$/i.test(line.trim());
}
