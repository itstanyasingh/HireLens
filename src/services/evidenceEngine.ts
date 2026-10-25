/**
 * HireLens Evidence Engine
 * 
 * Deterministic, mathematically transparent, evidence-based resume-to-job matching,
 * data quality inspection, skill gap analysis, and resume improvement simulation.
 * 
 * Strict non-fabrication guarantee:
 * - Scores derived strictly from documented weights and actual resume evidence.
 * - Score = 100 * [Sum(w_i * s_i) / Sum(w_i)] where s_i in {1, 0.5, 0}
 * - "Needs Review" items excluded from active denominator until resolved.
 * - If inputs are insufficient, returns explicit "Unable to calculate reliable score".
 */

export type RequirementCategory = 
  | 'technical_skill' 
  | 'tool' 
  | 'experience' 
  | 'education' 
  | 'certification' 
  | 'responsibility' 
  | 'soft_skill';

export type MatchStatus = 'MATCHED' | 'PARTIAL' | 'NOT FOUND' | 'NEEDS REVIEW';

export interface JobRequirement {
  id: string;
  name: string;
  category: RequirementCategory;
  weight: number; // 1 to 5 (Default: Required = 3, Preferred = 2, Optional = 1)
  importanceLevel: 'Required' | 'Preferred' | 'Optional';
  sourceExcerpt: string;
  normalizedTerm: string;
  userEdited?: boolean;
}

export interface RequirementMatch {
  requirement: JobRequirement;
  status: MatchStatus;
  resumeExcerpt: string | null;
  explanation: string;
  limitations?: string;
  scoreContribution: number; // w_i * s_i
}

export interface ScoreAudit {
  overallScore: number | null;
  isReliable: boolean;
  unreliableReason?: string;
  totalApplicableWeight: number;
  matchedWeight: number;
  partialWeight: number;
  formula: string;
  intermediateCalculation: string;
  assessedCount: number;
  totalRequirementsCount: number;
  matchedCount: number;
  partialCount: number;
  notFoundCount: number;
  needsReviewCount: number;
  coveragePercentage: number;
  limitations: string[];
  explanation?: string;
}

export interface DetectedSection {
  name: string;
  found: boolean;
  excerpt?: string;
  lineCount?: number;
}

export interface ContactValidation {
  email: { found: boolean; value?: string; valid: boolean };
  phone: { found: boolean; value?: string; valid: boolean };
  links: { label: string; url: string; valid: boolean }[];
}

export interface TimelineEntry {
  roleOrDegree: string;
  timeframe: string;
  startYear?: number;
  endYear?: number;
  isCurrent?: boolean;
  issue?: string;
}

export interface DataQualityInspection {
  isReadable: boolean;
  tokenCount: number;
  characterCount: number;
  detectedSections: DetectedSection[];
  missingSections: string[];
  contactDetails: ContactValidation;
  timelineConsistency: {
    hasIssues: boolean;
    items: TimelineEntry[];
  };
  potentialTextLoss: {
    detected: boolean;
    unusualSymbolRatio: number;
    warning?: string;
  };
  duplicateSections: string[];
  readinessScore: number; // 0 - 100
  overallStatus: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'UNREADABLE';
  summaryMessage: string;
}

export interface SkillGapItem {
  id: string;
  skill: string;
  category: RequirementCategory;
  requirementWeight: number;
  status: 'NOT FOUND' | 'PARTIAL' | 'NEEDS REVIEW';
  missingEvidenceReason: string;
  userClaimedEvidence?: string;
  userResolved?: boolean;
  learningTopics: string[];
}

export interface ResumeSimulationResult {
  originalScore: number;
  revisedScore: number;
  scoreDelta: number;
  addedText: string[];
  removedText: string[];
  changedRequirements: {
    requirementName: string;
    previousStatus: MatchStatus;
    newStatus: MatchStatus;
    rationale: string;
  }[];
  explanation: string;
  truthfulnessNotice: string;
}

export interface ImprovementSuggestion {
  id: string;
  requirementName: string;
  originalSentence: string;
  suggestionTemplate: string;
  rationale: string;
  userFieldsNeeded: string[];
}

export interface WeightRecalculationResult {
  previousScore: number;
  recalculatedScore: number;
  scoreDelta: number;
  recalculatedAudit: ScoreAudit;
  updatedMatches: RequirementMatch[];
  weightChanges: {
    requirementId: string;
    requirementName: string;
    oldWeight: number;
    newWeight: number;
    status: MatchStatus;
    previousContribution: number;
    newContribution: number;
    impactExplanation: string;
  }[];
  summaryExplanation: string;
}

// -------------------------------------------------------------
// Term Normalization Dictionary (transparent & defensible only)
// -------------------------------------------------------------
const TERM_ALIASES: Record<string, string[]> = {
  'react': ['react', 'reactjs', 'react.js'],
  'node.js': ['node.js', 'nodejs', 'node js'],
  'typescript': ['typescript', 'ts'],
  'javascript': ['javascript', 'js', 'es6', 'ecmascript'],
  'python': ['python', 'python3', 'py'],
  'postgresql': ['postgresql', 'postgres', 'psql'],
  'aws': ['aws', 'amazon web services'],
  'gcp': ['gcp', 'google cloud platform', 'google cloud'],
  'azure': ['azure', 'microsoft azure'],
  'docker': ['docker', 'docker container', 'containerization'],
  'kubernetes': ['kubernetes', 'k8s'],
  'rest api': ['rest api', 'restful api', 'restful apis', 'rest apis', 'rest endpoints'],
  'graphql': ['graphql', 'gql'],
  'ci/cd': ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'],
  'sql': ['sql', 'structured query language'],
  'mongodb': ['mongodb', 'mongo'],
  'redis': ['redis'],
  'kafka': ['kafka', 'apache kafka'],
  'tailwind css': ['tailwind css', 'tailwind', 'tailwindcss'],
  'git': ['git', 'version control', 'github', 'gitlab'],
  'microservices': ['microservices', 'microservice architecture'],
  'system design': ['system design', 'distributed systems architecture', 'high-level design'],
  'java': ['java', 'core java'],
  'c++': ['c++', 'cpp'],
  'c#': ['c#', 'csharp', 'c-sharp'],
  'go': ['golang', 'go language', 'go programming', 'go-lang'],
  'php': ['php', 'php7', 'php8'],
  'rust': ['rust', 'rustlang'],
  'bachelor': ['bachelor', 'b.s.', 'b.a.', 'b.sc', 'bs', 'ba', 'undergraduate degree'],
  'master': ['master', 'm.s.', 'm.a.', 'm.sc', 'ms', 'ma', 'graduate degree'],
  'computer science': ['computer science', 'cs', 'computing science', 'software engineering']
};

/**
 * Normalizes a raw skill/term to its canonical key if defined in dictionary.
 */
export function normalizeTerm(raw: string): string {
  const clean = raw.toLowerCase().trim().replace(/[.,;:]+$/, '');
  for (const [canonical, aliases] of Object.entries(TERM_ALIASES)) {
    if (aliases.includes(clean) || clean === canonical) {
      return canonical;
    }
  }
  return clean;
}

// -------------------------------------------------------------
// 1. DATA QUALITY INSPECTOR
// -------------------------------------------------------------
export function inspectResumeDataQuality(
  resumeText: string,
  fileName: string = 'Resume.pdf'
): DataQualityInspection {
  if (!resumeText || typeof resumeText !== 'string') {
    return {
      isReadable: false,
      tokenCount: 0,
      characterCount: 0,
      detectedSections: [],
      missingSections: ['Contact Info', 'Work Experience', 'Education', 'Skills'],
      contactDetails: {
        email: { found: false, valid: false },
        phone: { found: false, valid: false },
        links: []
      },
      timelineConsistency: { hasIssues: false, items: [] },
      potentialTextLoss: { detected: true, unusualSymbolRatio: 0, warning: 'Empty document content.' },
      duplicateSections: [],
      readinessScore: 0,
      overallStatus: 'UNREADABLE',
      summaryMessage: 'Document contains no extractable text. Scanned images require OCR or text extraction.'
    };
  }

  const trimmed = resumeText.trim();
  const characterCount = trimmed.length;
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const tokenCount = tokens.length;

  // 1. Check readability & minimum length
  if (characterCount < 100 || tokenCount < 25) {
    return {
      isReadable: false,
      tokenCount,
      characterCount,
      detectedSections: [],
      missingSections: ['Substantive Resume Content'],
      contactDetails: {
        email: { found: false, valid: false },
        phone: { found: false, valid: false },
        links: []
      },
      timelineConsistency: { hasIssues: false, items: [] },
      potentialTextLoss: { detected: true, unusualSymbolRatio: 0, warning: 'Insufficient text extracted from file.' },
      duplicateSections: [],
      readinessScore: 10,
      overallStatus: 'UNREADABLE',
      summaryMessage: `Extracted only ${tokenCount} words. A standard resume requires at least 150 words of experience, skills, and background.`
    };
  }

  // 2. Unusual symbol ratio (detects corrupted PDF fonts or mojibake)
  const unusualChars = trimmed.match(/[^\w\s.,;:!?@#&()'"\/\-–—%$€£]/g) || [];
  const unusualRatio = unusualChars.length / characterCount;
  const potentialLoss = unusualRatio > 0.08;

  // 3. Section Headers Detection
  const standardSections = [
    { name: 'Contact Information', regex: /(email|phone|contact|linkedin|github|portfolio|location|address)/i },
    { name: 'Summary / Objective', regex: /(professional summary|executive summary|profile|about me|objective)/i },
    { name: 'Work Experience', regex: /(experience|employment history|work history|career history|professional experience)/i },
    { name: 'Education', regex: /(education|academic background|degrees|university|college|bachelor|master|phd)/i },
    { name: 'Skills & Stack', regex: /(skills|technical skills|technologies|proficiencies|core competencies|tooling)/i },
    { name: 'Projects / Works', regex: /(projects|personal projects|portfolio|selected works|open source)/i }
  ];

  const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
  const detectedSections: DetectedSection[] = [];
  const missingSections: string[] = [];
  const seenSectionNames: string[] = [];
  const duplicateSections: string[] = [];

  for (const s of standardSections) {
    const matchingLine = lines.find(l => s.regex.test(l) && l.length < 50);
    if (matchingLine) {
      if (seenSectionNames.includes(s.name)) {
        duplicateSections.push(s.name);
      } else {
        seenSectionNames.push(s.name);
      }
      detectedSections.push({
        name: s.name,
        found: true,
        excerpt: matchingLine
      });
    } else {
      missingSections.push(s.name);
    }
  }

  // 4. Contact Formatting Validation
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const urlRegex = /(https?:\/\/[^\s]+|linkedin\.com\/in\/[^\s]+|github\.com\/[^\s]+)/gi;

  const foundEmails = trimmed.match(emailRegex) || [];
  const foundPhones = trimmed.match(phoneRegex) || [];
  const foundUrls = trimmed.match(urlRegex) || [];

  const contactDetails: ContactValidation = {
    email: {
      found: foundEmails.length > 0,
      value: foundEmails[0],
      valid: foundEmails.length > 0
    },
    phone: {
      found: foundPhones.length > 0,
      value: foundPhones[0],
      valid: foundPhones.length > 0
    },
    links: foundUrls.map(u => ({
      label: u.includes('linkedin') ? 'LinkedIn' : u.includes('github') ? 'GitHub' : 'Portfolio',
      url: u.startsWith('http') ? u : `https://${u}`,
      valid: true
    }))
  };

  // 5. Timeline & Date Consistency
  const yearPattern = /\b(19\d\d|20\d\d)\b(?:\s*[-–—to]+\s*(19\d\d|20\d\d|present|current))?/gi;
  const timelineEntries: TimelineEntry[] = [];
  let hasTimelineIssues = false;

  let match;
  while ((match = yearPattern.exec(trimmed)) !== null) {
    const startYr = parseInt(match[1], 10);
    const endStr = match[2];
    let endYr: number | undefined;
    let isCurrent = false;

    if (endStr) {
      if (/present|current/i.test(endStr)) {
        isCurrent = true;
      } else {
        endYr = parseInt(endStr, 10);
      }
    }

    let issue: string | undefined;
    if (endYr && endYr < startYr) {
      issue = `Inverted timeframe: end year (${endYr}) occurs before start year (${startYr}).`;
      hasTimelineIssues = true;
    } else if (startYr > new Date().getFullYear() + 1) {
      issue = `Future start year (${startYr}) exceeds reasonable timeline.`;
      hasTimelineIssues = true;
    }

    // Extract surrounding line for context
    const idx = match.index;
    const startLineIdx = Math.max(0, trimmed.lastIndexOf('\n', idx));
    const endLineIdx = trimmed.indexOf('\n', idx);
    const contextLine = trimmed.slice(startLineIdx, endLineIdx === -1 ? trimmed.length : endLineIdx).trim();

    if (contextLine.length > 10 && timelineEntries.length < 8) {
      timelineEntries.push({
        roleOrDegree: contextLine.slice(0, 70),
        timeframe: match[0],
        startYear: startYr,
        endYear: endYr,
        isCurrent,
        issue
      });
    }
  }

  // 6. Calculate Readiness Score
  let score = 100;
  if (!contactDetails.email.found) score -= 15;
  if (!contactDetails.phone.found) score -= 10;
  if (missingSections.includes('Work Experience')) score -= 25;
  if (missingSections.includes('Education')) score -= 15;
  if (missingSections.includes('Skills & Stack')) score -= 15;
  if (hasTimelineIssues) score -= 10;
  if (potentialLoss) score -= 20;
  if (duplicateSections.length > 0) score -= 5;

  score = Math.max(15, Math.min(100, score));

  let overallStatus: DataQualityInspection['overallStatus'] = 'EXCELLENT';
  if (score < 40) overallStatus = 'UNREADABLE';
  else if (score < 65) overallStatus = 'NEEDS_ATTENTION';
  else if (score < 85) overallStatus = 'GOOD';

  return {
    isReadable: true,
    tokenCount,
    characterCount,
    detectedSections,
    missingSections,
    contactDetails,
    timelineConsistency: {
      hasIssues: hasTimelineIssues,
      items: timelineEntries
    },
    potentialTextLoss: {
      detected: potentialLoss,
      unusualSymbolRatio: Math.round(unusualRatio * 1000) / 10,
      warning: potentialLoss ? 'High density of unusual character glyphs; verify document is not an unsearchable scan.' : undefined
    },
    duplicateSections,
    readinessScore: score,
    overallStatus,
    summaryMessage: score >= 80 
      ? 'Resume text extracted cleanly with verified contact info and standard ATS sections.'
      : 'Document has areas needing review before reliable job matching (e.g., missing contact or timeline discrepancies).'
  };
}

// -------------------------------------------------------------
// 2. JOB DESCRIPTION REQUIREMENT EXTRACTION
// -------------------------------------------------------------
const TECH_TAXONOMY: { name: string; category: RequirementCategory; canonical: string; weight: number }[] = [
  // Languages
  { name: 'TypeScript', category: 'technical_skill', canonical: 'typescript', weight: 3 },
  { name: 'JavaScript', category: 'technical_skill', canonical: 'javascript', weight: 3 },
  { name: 'Python', category: 'technical_skill', canonical: 'python', weight: 3 },
  { name: 'Java', category: 'technical_skill', canonical: 'java', weight: 3 },
  { name: 'C++', category: 'technical_skill', canonical: 'c++', weight: 3 },
  { name: 'C#', category: 'technical_skill', canonical: 'c#', weight: 3 },
  { name: 'Go', category: 'technical_skill', canonical: 'go', weight: 3 },
  { name: 'Rust', category: 'technical_skill', canonical: 'rust', weight: 3 },
  { name: 'SQL', category: 'technical_skill', canonical: 'sql', weight: 3 },
  // Web Frameworks
  { name: 'React', category: 'technical_skill', canonical: 'react', weight: 3 },
  { name: 'Node.js', category: 'technical_skill', canonical: 'node.js', weight: 3 },
  { name: 'Next.js', category: 'technical_skill', canonical: 'next.js', weight: 2 },
  { name: 'Vue.js', category: 'technical_skill', canonical: 'vue.js', weight: 2 },
  { name: 'Angular', category: 'technical_skill', canonical: 'angular', weight: 2 },
  { name: 'FastAPI', category: 'technical_skill', canonical: 'fastapi', weight: 3 },
  { name: 'Django', category: 'technical_skill', canonical: 'django', weight: 2 },
  { name: 'Express', category: 'technical_skill', canonical: 'express', weight: 2 },
  { name: 'GraphQL', category: 'technical_skill', canonical: 'graphql', weight: 2 },
  { name: 'REST API', category: 'technical_skill', canonical: 'rest api', weight: 3 },
  // Data & Storage
  { name: 'PostgreSQL', category: 'tool', canonical: 'postgresql', weight: 3 },
  { name: 'MongoDB', category: 'tool', canonical: 'mongodb', weight: 2 },
  { name: 'Redis', category: 'tool', canonical: 'redis', weight: 3 },
  { name: 'Kafka', category: 'tool', canonical: 'kafka', weight: 3 },
  { name: 'Elasticsearch', category: 'tool', canonical: 'elasticsearch', weight: 2 },
  // DevOps & Cloud
  { name: 'AWS', category: 'tool', canonical: 'aws', weight: 3 },
  { name: 'Docker', category: 'tool', canonical: 'docker', weight: 3 },
  { name: 'Kubernetes', category: 'tool', canonical: 'kubernetes', weight: 3 },
  { name: 'CI/CD', category: 'tool', canonical: 'ci/cd', weight: 3 },
  { name: 'Terraform', category: 'tool', canonical: 'terraform', weight: 2 },
  { name: 'Git', category: 'tool', canonical: 'git', weight: 2 },
  // Architecture & Engineering Practices
  { name: 'Microservices', category: 'experience', canonical: 'microservices', weight: 3 },
  { name: 'System Design', category: 'experience', canonical: 'system design', weight: 3 },
  { name: 'Unit Testing', category: 'responsibility', canonical: 'unit testing', weight: 2 },
  { name: 'Agile / Scrum', category: 'responsibility', canonical: 'agile', weight: 1 }
];

export function extractRequirementsFromJobDescription(jobDescription: string): JobRequirement[] {
  if (!jobDescription || jobDescription.trim().length < 20) {
    return [];
  }

  const jdText = jobDescription.trim();
  const jdLower = jdText.toLowerCase();
  const requirements: JobRequirement[] = [];
  const addedCanonicals = new Set<string>();

  // 1. Extract explicit taxonomy skills present in the JD
  for (const item of TECH_TAXONOMY) {
    const aliases = TERM_ALIASES[item.canonical] || [item.name.toLowerCase()];
    for (const alias of aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:\\b|[^a-zA-Z0-9])${escaped}(?:\\b|[^a-zA-Z0-9])`, 'i');
      if (regex.test(jdText) && !addedCanonicals.has(item.canonical)) {
        addedCanonicals.add(item.canonical);

        // Find supporting sentence from JD
        const sentence = findSentenceContaining(jdText, alias) || `Requirement extracted from job posting for ${item.name}.`;

        // Determine importance based on surrounding keywords
        const isRequired = /(required|must have|mandatory|minimum|essential|strong background in)/i.test(sentence);
        const isPreferred = /(plus|preferred|nice to have|bonus|beneficial|ideal)/i.test(sentence);

        const importance: JobRequirement['importanceLevel'] = isRequired ? 'Required' : isPreferred ? 'Preferred' : 'Required';
        const weight = importance === 'Required' ? 3 : importance === 'Preferred' ? 2 : 1;

        requirements.push({
          id: `req-${item.canonical.replace(/[^a-z0-9]/g, '-')}`,
          name: item.name,
          category: item.category,
          weight,
          importanceLevel: importance,
          sourceExcerpt: sentence.slice(0, 160),
          normalizedTerm: item.canonical
        });
        break;
      }
    }
  }

  // 2. Extract Experience Requirements (e.g. "5+ years of experience", "1 year experience")
  const expMatch = jdText.match(/(\d+\+?\s*(?:to|-)\s*\d+|\d+\+?)\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp|background)/i);
  if (expMatch && !addedCanonicals.has('years-experience')) {
    addedCanonicals.add('years-experience');
    const sentence = findSentenceContaining(jdText, expMatch[0]) || expMatch[0];
    requirements.unshift({
      id: 'req-experience-duration',
      name: `${expMatch[1]} Years Experience`,
      category: 'experience',
      weight: 4, // High importance
      importanceLevel: 'Required',
      sourceExcerpt: sentence.slice(0, 160),
      normalizedTerm: 'experience duration'
    });
  }

  // 3. Extract Education Requirements (e.g. Bachelor's in CS)
  const eduMatch = jdText.match(/(bachelor'?s?|master'?s?|ph\.?d|b\.?s\.?|m\.?s\.?)\s*(?:degree)?\s*(?:in|of)?\s*(?:computer science|engineering|related field|stem)/i);
  if (eduMatch && !addedCanonicals.has('education-degree')) {
    addedCanonicals.add('education-degree');
    const sentence = findSentenceContaining(jdText, eduMatch[0]) || eduMatch[0];
    requirements.push({
      id: 'req-education-degree',
      name: eduMatch[0].replace(/\b\w/g, l => l.toUpperCase()),
      category: 'education',
      weight: 3,
      importanceLevel: 'Required',
      sourceExcerpt: sentence.slice(0, 160),
      normalizedTerm: 'degree qualification'
    });
  }

  // 4. Extract Certification Requirements (e.g. AWS Certified, PMP, CKAD)
  const certMatch = jdText.match(/(aws certified|certified kubernetes|ckad|cka|pmp|cissp|scrum master|comptia\s+[a-z+]+)/i);
  if (certMatch && !addedCanonicals.has('certification-credential')) {
    addedCanonicals.add('certification-credential');
    const sentence = findSentenceContaining(jdText, certMatch[0]) || certMatch[0];
    requirements.push({
      id: 'req-certification',
      name: certMatch[0].toUpperCase(),
      category: 'certification',
      weight: 3,
      importanceLevel: 'Required',
      sourceExcerpt: sentence.slice(0, 160),
      normalizedTerm: 'certification credential'
    });
  }

  // Deduplicate by normalizedTerm and ensure at least clean structure
  return requirements;
}

// -------------------------------------------------------------
// 3. EVIDENCE-BASED REQUIREMENT MATCHING
// -------------------------------------------------------------
export function matchRequirementsAgainstResume(
  resumeText: string,
  requirements: JobRequirement[]
): { matches: RequirementMatch[]; audit: ScoreAudit } {
  if (!resumeText || resumeText.trim().length < 20 || requirements.length === 0) {
    return {
      matches: [],
      audit: {
        overallScore: null,
        isReliable: false,
        unreliableReason: requirements.length === 0 
          ? 'No job requirements extracted. Provide a job description to calculate match.'
          : 'Insufficient resume text to evaluate evidence.',
        totalApplicableWeight: 0,
        matchedWeight: 0,
        partialWeight: 0,
        formula: 'Score = 100 * [Sum(w_i * s_i) / Sum(w_i)]',
        intermediateCalculation: 'Inputs incomplete; scoring blocked.',
        assessedCount: 0,
        totalRequirementsCount: requirements.length,
        matchedCount: 0,
        partialCount: 0,
        notFoundCount: 0,
        needsReviewCount: 0,
        coveragePercentage: 0,
        limitations: ['A real resume and job description are both required to assess coverage.']
      }
    };
  }

  const resumeLower = resumeText.toLowerCase();
  const matches: RequirementMatch[] = [];

  for (const req of requirements) {
    const canonical = req.normalizedTerm;
    const aliases = TERM_ALIASES[canonical] || [req.name.toLowerCase()];

    // Special handling for experience duration
    if (req.category === 'experience' && req.name.toLowerCase().includes('years')) {
      const match = evaluateExperienceRequirement(resumeText, req);
      matches.push(match);
      continue;
    }

    // Special handling for education degree
    if (req.category === 'education') {
      const match = evaluateEducationRequirement(resumeText, req);
      matches.push(match);
      continue;
    }

    // Special handling for certifications
    if (req.category === 'certification') {
      const match = evaluateCertificationRequirement(resumeText, req);
      matches.push(match);
      continue;
    }

    // Standard skill/tool matching with negative context & anomaly filtering
    const positiveEvidenceSentences: string[] = [];
    const negativeEvidenceSentences: string[] = [];
    let matchedAlias: string | null = null;

    for (const alias of aliases) {
      const sentences = findAllSentencesContaining(resumeText, alias);
      for (const sentence of sentences) {
        if (hasNegativeContext(sentence, alias)) {
          negativeEvidenceSentences.push(sentence);
        } else {
          positiveEvidenceSentences.push(sentence);
          if (!matchedAlias) matchedAlias = alias;
        }
      }
    }

    if (positiveEvidenceSentences.length > 0 && matchedAlias) {
      // Check for keyword stuffing anomaly
      const anomaly = detectKeywordStuffingAnomaly(resumeText, matchedAlias);
      if (anomaly.isSuspicious) {
        matches.push({
          requirement: req,
          status: 'NEEDS REVIEW',
          resumeExcerpt: positiveEvidenceSentences[0].slice(0, 180),
          explanation: anomaly.reason || `Keyword "${req.name}" repeated frequently without contextual action verbs.`,
          limitations: 'Potential keyword stuffing detected. Requires manual review of actual project deliverables.',
          scoreContribution: 0
        });
      } else {
        matches.push({
          requirement: req,
          status: 'MATCHED',
          resumeExcerpt: positiveEvidenceSentences[0].slice(0, 180),
          explanation: `Direct evidence identified: resume mentions "${req.name}" in verified context.`,
          scoreContribution: req.weight * 1.0
        });
      }
    } else if (negativeEvidenceSentences.length > 0) {
      matches.push({
        requirement: req,
        status: 'NOT FOUND',
        resumeExcerpt: negativeEvidenceSentences[0].slice(0, 180),
        explanation: `Mention of "${req.name}" in resume was identified in an exclusionary or negative context ("${negativeEvidenceSentences[0].slice(0, 90)}..."). Disqualified from positive skill credit.`,
        limitations: 'Text explicitly indicates lack of experience with this requirement.',
        scoreContribution: 0
      });
    } else {
      // Check for partial / related matches
      const partialEvidence = findRelatedPartialEvidence(resumeLower, canonical, resumeText);
      if (partialEvidence) {
        matches.push({
          requirement: req,
          status: 'PARTIAL',
          resumeExcerpt: partialEvidence.excerpt.slice(0, 180),
          explanation: partialEvidence.reason,
          limitations: 'Resume shows adjacent background but does not explicitly name this exact requirement.',
          scoreContribution: req.weight * 0.5
        });
      } else {
        matches.push({
          requirement: req,
          status: 'NOT FOUND',
          resumeExcerpt: null,
          explanation: `No textual mention of "${req.name}" or recognized aliases was found in the submitted resume text.`,
          limitations: 'Not found in document does not prove candidate lacks skill, but it cannot be verified from submitted text.',
          scoreContribution: 0
        });
      }
    }
  }

  const audit = calculateTransparentScore(matches);
  return { matches, audit };
}

/**
 * Calculates score strictly from the transparent formula:
 * Score = 100 * [Sum(w_i * s_i) / Sum(w_i)]
 * Excludes "NEEDS REVIEW" from denominator until resolved by user.
 */
export function calculateTransparentScore(matches: RequirementMatch[]): ScoreAudit {
  const limitations: string[] = [];

  let matchedWeight = 0;
  let partialWeight = 0;
  let totalApplicableWeight = 0;

  let matchedCount = 0;
  let partialCount = 0;
  let notFoundCount = 0;
  let needsReviewCount = 0;

  for (const m of matches) {
    if (m.status === 'NEEDS REVIEW') {
      needsReviewCount++;
      continue; // Excluded from denominator until user confirms
    }

    totalApplicableWeight += m.requirement.weight;

    if (m.status === 'MATCHED') {
      matchedWeight += m.requirement.weight * 1.0;
      matchedCount++;
    } else if (m.status === 'PARTIAL') {
      partialWeight += m.requirement.weight * 0.5;
      partialCount++;
    } else if (m.status === 'NOT FOUND') {
      notFoundCount++;
    }
  }

  const assessedCount = matchedCount + partialCount + notFoundCount;
  const totalCount = matches.length;

  if (totalCount === 0 || totalApplicableWeight === 0) {
    return {
      overallScore: null,
      isReliable: false,
      unreliableReason: 'Zero applicable job requirements to evaluate.',
      totalApplicableWeight: 0,
      matchedWeight: 0,
      partialWeight: 0,
      formula: 'Score = 100 * [Sum(w_i * s_i) / Sum(w_i)]',
      intermediateCalculation: 'No requirements assessed.',
      assessedCount: 0,
      totalRequirementsCount: totalCount,
      matchedCount: 0,
      partialCount: 0,
      notFoundCount: 0,
      needsReviewCount,
      coveragePercentage: 0,
      limitations: ['Provide a job description with identifiable qualifications.']
    };
  }

  // Too many unresolved items
  if (needsReviewCount > totalCount * 0.5) {
    limitations.push(`More than 50% (${needsReviewCount}/${totalCount}) of requirements are currently unconfirmed and excluded from the score.`);
  }

  const earnedWeight = matchedWeight + partialWeight;
  const rawScore = (earnedWeight / totalApplicableWeight) * 100;
  const overallScore = Math.round(rawScore);
  const coveragePercentage = Math.round((assessedCount / totalCount) * 100);

  const intermediateCalculation = `100 * [(${matchedWeight.toFixed(1)} matched pts + ${partialWeight.toFixed(1)} partial pts) / ${totalApplicableWeight.toFixed(1)} total weight] = ${rawScore.toFixed(2)}% -> rounded to ${overallScore}%`;

  if (coveragePercentage < 100) {
    limitations.push(`${needsReviewCount} requirement(s) marked 'Needs Review' are excluded from the denominator until reviewed.`);
  }

  return {
    overallScore,
    isReliable: true,
    totalApplicableWeight,
    matchedWeight,
    partialWeight,
    formula: 'Score = 100 * [Sum(w_i * s_i) / Sum(w_i)]',
    intermediateCalculation,
    assessedCount,
    totalRequirementsCount: totalCount,
    matchedCount,
    partialCount,
    notFoundCount,
    needsReviewCount,
    coveragePercentage,
    limitations
  };
}

// -------------------------------------------------------------
// 4. SKILL GAP ANALYSIS & LEARNING ROADMAP
// -------------------------------------------------------------
export function generateSkillGapsAndRoadmap(matches: RequirementMatch[]): SkillGapItem[] {
  const gaps: SkillGapItem[] = [];

  for (const m of matches) {
    if (m.status === 'NOT FOUND' || m.status === 'PARTIAL' || m.status === 'NEEDS REVIEW') {
      const canonical = m.requirement.normalizedTerm;
      const topics = getCuratedLearningTopics(canonical, m.requirement.name);

      gaps.push({
        id: `gap-${m.requirement.id}`,
        skill: m.requirement.name,
        category: m.requirement.category,
        requirementWeight: m.requirement.weight,
        status: m.status,
        missingEvidenceReason: m.status === 'NOT FOUND'
          ? `No evidence of "${m.requirement.name}" was identified in the resume text.`
          : m.explanation,
        userResolved: false,
        learningTopics: topics
      });
    }
  }

  return gaps;
}

function getCuratedLearningTopics(canonical: string, displayName: string): string[] {
  const TOPIC_MAP: Record<string, string[]> = {
    'docker': ['Containerization fundamentals & Dockerfile best practices', 'Multi-stage builds and minimal image security', 'Docker Compose for local multi-service testing'],
    'kubernetes': ['Pods, Deployments, and Service networking models', 'ConfigMaps, Secrets, and Helm package management', 'Cluster autoscaling and ingress controllers'],
    'kafka': ['Event-driven messaging and publisher-subscriber patterns', 'Topic partitioning, consumer groups, and offset management', 'Schema Registry and dead-letter queue patterns'],
    'redis': ['In-memory caching strategies (cache-aside, write-through)', 'Redis data structures: Hashes, Sorted Sets, and Pub/Sub', 'TTL management and cache eviction policies'],
    'aws': ['AWS core services: ECS/EKS, Lambda, S3, RDS, DynamoDB', 'IAM least-privilege security roles and VPC networking', 'CloudWatch observability and Infrastructure as Code'],
    'ci/cd': ['Automated linting and unit testing gates in GitHub Actions', 'Zero-downtime blue/green & canary deployments', 'Pipeline artifact caching and build optimization'],
    'postgresql': ['B-Tree indexing strategies and EXPLAIN ANALYZE query planning', 'ACID transaction isolation levels and concurrency control', 'Connection pooling with PgBouncer and migration scripts'],
    'system design': ['Scalability bottlenecks: Horizontal vs. Vertical scaling', 'Database sharding, read replicas, and caching tiers', 'Microservices resilience: Circuit breakers, rate limiters, and idempotency'],
    'typescript': ['Advanced utility types (Pick, Omit, Record, Discriminated Unions)', 'Generics and type guards for runtime boundary validation', 'Strict type configuration and tsconfig tuning']
  };

  return TOPIC_MAP[canonical] || [
    `Core principles and standard patterns for ${displayName}`,
    `Hands-on implementation project demonstrating ${displayName} in production`,
    `Performance benchmarks, testing methodologies, and architectural trade-offs`
  ];
}

// -------------------------------------------------------------
// 5. RESUME IMPROVEMENT SIMULATOR
// -------------------------------------------------------------
export function simulateResumeImprovement(
  originalText: string,
  revisedText: string,
  requirements: JobRequirement[]
): ResumeSimulationResult {
  // 1. Evaluate original match
  const origEval = matchRequirementsAgainstResume(originalText, requirements);
  // 2. Evaluate revised match using exact same engine & requirements
  const revEval = matchRequirementsAgainstResume(revisedText, requirements);

  const originalScore = origEval.audit.overallScore ?? 0;
  const revisedScore = revEval.audit.overallScore ?? 0;
  const scoreDelta = revisedScore - originalScore;

  // 3. Compute textual diff (line by line)
  const origLines = originalText.split('\n').map(l => l.trim()).filter(Boolean);
  const revLines = revisedText.split('\n').map(l => l.trim()).filter(Boolean);

  const origSet = new Set(origLines);
  const revSet = new Set(revLines);

  const addedText = revLines.filter(l => !origSet.has(l));
  const removedText = origLines.filter(l => !revSet.has(l));

  // 4. Identify changed requirements
  const changedRequirements: ResumeSimulationResult['changedRequirements'] = [];

  for (let i = 0; i < requirements.length; i++) {
    const origMatch = origEval.matches[i];
    const revMatch = revEval.matches[i];

    if (origMatch && revMatch && origMatch.status !== revMatch.status) {
      changedRequirements.push({
        requirementName: origMatch.requirement.name,
        previousStatus: origMatch.status,
        newStatus: revMatch.status,
        rationale: revMatch.status === 'MATCHED'
          ? `Added direct textual evidence supporting "${origMatch.requirement.name}".`
          : revMatch.status === 'PARTIAL'
          ? `Added partial context for "${origMatch.requirement.name}".`
          : `Evidence for "${origMatch.requirement.name}" was modified or removed.`
      });
    }
  }

  let explanation = '';
  if (scoreDelta > 0) {
    explanation = `Score increased by +${scoreDelta}% due to added verifiable evidence for: ${changedRequirements.filter(c => c.newStatus === 'MATCHED').map(c => c.requirementName).join(', ') || 'target requirements'}.`;
  } else if (scoreDelta < 0) {
    explanation = `Score decreased by ${scoreDelta}% because edits removed supporting evidence for previously satisfied requirements.`;
  } else {
    explanation = `Score remained unchanged (${originalScore}%). The edits refined wording or formatting without adding or removing verifiable evidence for target requirements.`;
  }

  return {
    originalScore,
    revisedScore,
    scoreDelta,
    addedText,
    removedText,
    changedRequirements,
    explanation,
    truthfulnessNotice: 'Remember: only include experiences, metrics, and technologies that you have genuinely performed. Fictional metrics or fabricated claims must never be used.'
  };
}

// -------------------------------------------------------------
// 6. TRUTHFUL SUGGESTIONS GENERATOR
// -------------------------------------------------------------
export function generateTruthfulSuggestions(
  matches: RequirementMatch[],
  resumeText: string
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  // Identify weak bullet points in resume
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'));
  const weakStarters = /^(worked on|helped with|assisted in|was responsible for|handled|did|participated in)/i;

  const weakBullets = lines.filter(l => weakStarters.test(l.replace(/^[•\-\*\s]+/, '')));

  for (let i = 0; i < Math.min(3, weakBullets.length); i++) {
    const bullet = weakBullets[i];
    const clean = bullet.replace(/^[•\-\*\s]+/, '');
    const core = clean.replace(weakStarters, '').trim();

    suggestions.push({
      id: `sug-verb-${i}`,
      requirementName: 'Impact & Active Verbs',
      originalSentence: bullet,
      suggestionTemplate: `Engineered ${core}, improving system reliability and workflow efficiency by [insert your actual metric, e.g. 20%].`,
      rationale: 'Replaces passive duty phrasing with an active engineering verb and prompts you for your truthful outcome metric.',
      userFieldsNeeded: ['Actual metric or percentage achieved', 'Scale of users or volume impacted']
    });
  }

  // Suggest adding evidence for top missing requirements
  const notFoundReqs = matches.filter(m => m.status === 'NOT FOUND').slice(0, 3);
  for (const nf of notFoundReqs) {
    suggestions.push({
      id: `sug-req-${nf.requirement.id}`,
      requirementName: nf.requirement.name,
      originalSentence: `(Requirement missing from resume)`,
      suggestionTemplate: `If you have worked with ${nf.requirement.name}: "Architected features using ${nf.requirement.name}, delivering [insert your specific project result]."`,
      rationale: `Target job requires ${nf.requirement.name}. If you have genuine hands-on experience, document it with project context.`,
      userFieldsNeeded: ['Project or company where used', 'Key libraries or architecture involved', 'Actual deliverable']
    });
  }

  return suggestions;
}

// -------------------------------------------------------------
// Helper Utilities & Advanced Classifiers
// -------------------------------------------------------------
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findSentenceContaining(text: string, term: string): string | null {
  const cleanTerm = term.trim();
  const escaped = escapeRegex(cleanTerm);
  const regex = new RegExp(`(?:\\b|[^a-zA-Z0-9])${escaped}(?:\\b|[^a-zA-Z0-9])`, 'i');
  const sentences = text.split(/(?<=[.!?\n])\s+/);
  for (const s of sentences) {
    if (regex.test(s) && s.length > 12) {
      return s.trim();
    }
  }
  return null;
}

export function findAllSentencesContaining(text: string, term: string): string[] {
  const cleanTerm = term.trim();
  const escaped = escapeRegex(cleanTerm);
  const regex = new RegExp(`(?:\\b|[^a-zA-Z0-9])${escaped}(?:\\b|[^a-zA-Z0-9])`, 'i');
  const sentences = text.split(/(?<=[.!?\n])\s+/);
  const matched: string[] = [];
  for (const s of sentences) {
    if (regex.test(s) && s.trim().length > 10) {
      matched.push(s.trim());
    }
  }
  return matched;
}

export function hasNegativeContext(sentence: string, term: string): boolean {
  const sLower = sentence.toLowerCase();
  const escaped = escapeRegex(term.toLowerCase());

  // Negative cues preceding the term: e.g. "no experience with Docker", "haven't used React"
  const preNegativePattern = new RegExp(
    `\\b(no|not|neither|nor|without|never|lacked|lacks|excluding|zero|unfamiliar with|haven't used|have not used|did not use|not used|avoided|little to no|none in|not familiar with|deprecated)\\b[^\n.!?]{0,45}\\b${escaped}\\b`,
    'i'
  );

  // Negative cues following the term: e.g. "Docker: none", "Kubernetes - no experience", "PHP (avoided)"
  const postNegativePattern = new RegExp(
    `\\b${escaped}\\b[^\n.!?]{0,35}\\b(none|not used|not applicable|n/a|no experience|never used|unfamiliar|avoided)\\b`,
    'i'
  );

  return preNegativePattern.test(sLower) || postNegativePattern.test(sLower);
}

export function detectKeywordStuffingAnomaly(
  text: string,
  term: string
): { isSuspicious: boolean; count: number; reason?: string } {
  const escaped = escapeRegex(term.trim());
  const regex = new RegExp(`(?:\\b|[^a-zA-Z0-9])${escaped}(?:\\b|[^a-zA-Z0-9])`, 'gi');
  const matches = text.match(regex) || [];
  const count = matches.length;

  if (count < 5) {
    return { isSuspicious: false, count };
  }

  // Count action verbs in sentences containing this term
  const actionVerbs = /\b(built|engineered|developed|implemented|architected|designed|deployed|configured|optimized|created|maintained|tested|integrated|refactored|spearheaded|led|managed|migrated|scaled|automated)\b/i;
  const sentences = findAllSentencesContaining(text, term);
  const sentencesWithVerbs = sentences.filter(s => actionVerbs.test(s));

  // Check if a single line contains 3+ occurrences (e.g. repeated in a dense list)
  const lines = text.split('\n');
  const hasDenseLine = lines.some(l => (l.match(regex) || []).length >= 3);

  if (hasDenseLine || (count >= 5 && sentencesWithVerbs.length < 2)) {
    return {
      isSuspicious: true,
      count,
      reason: `Keyword "${term}" is repeated ${count} times with low action verb context (${sentencesWithVerbs.length} action clauses). This pattern resembles keyword repetition rather than substantive project experience.`
    };
  }

  return { isSuspicious: false, count };
}

function findRelatedPartialEvidence(
  resumeLower: string,
  canonical: string,
  fullText: string
): { excerpt: string; reason: string } | null {
  const RELATIONS: Record<string, { related: string[]; reason: string }> = {
    'kubernetes': {
      related: ['docker', 'container', 'containerization'],
      reason: 'Resume demonstrates containerization experience with Docker, but does not explicitly name Kubernetes orchestration.'
    },
    'fastapi': {
      related: ['python', 'django', 'flask'],
      reason: 'Resume demonstrates Python web development experience, but does not explicitly name the FastAPI framework.'
    },
    'next.js': {
      related: ['react', 'reactjs'],
      reason: 'Resume establishes React proficiency, but does not explicitly reference Next.js server-side rendering.'
    },
    'postgresql': {
      related: ['sql', 'mysql', 'database', 'rdbms'],
      reason: 'Resume confirms relational SQL database background, but does not specify PostgreSQL.'
    },
    'ci/cd': {
      related: ['github actions', 'jenkins', 'gitlab', 'automation'],
      reason: 'Resume establishes automated pipeline tooling, but does not explicitly describe end-to-end CI/CD practices.'
    }
  };

  const rel = RELATIONS[canonical];
  if (!rel) return null;

  for (const r of rel.related) {
    if (resumeLower.includes(r)) {
      const excerpt = findSentenceContaining(fullText, r);
      if (excerpt) {
        return { excerpt, reason: rel.reason };
      }
    }
  }

  return null;
}

function evaluateExperienceRequirement(resumeText: string, req: JobRequirement): RequirementMatch {
  const reqYearsMatch = req.name.match(/\d+/);
  const requiredYears = reqYearsMatch ? parseInt(reqYearsMatch[0], 10) : 3;

  // 1. Explicit summary statement (e.g., "5+ years of experience", "1 year of experience")
  const summaryExp = resumeText.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s*of)?\s*(?:experience|exp|background)/i);
  if (summaryExp) {
    const years = parseInt(summaryExp[1], 10);
    if (years >= requiredYears) {
      return {
        requirement: req,
        status: 'MATCHED',
        resumeExcerpt: summaryExp[0],
        explanation: `Resume explicitly states ${years} years of professional experience, meeting the required ${requiredYears}+ years.`,
        scoreContribution: req.weight * 1.0
      };
    } else {
      return {
        requirement: req,
        status: 'PARTIAL',
        resumeExcerpt: summaryExp[0],
        explanation: `Resume states ${years} years of experience, which is below the target ${requiredYears}+ years.`,
        limitations: 'Candidate may have additional unstated project experience.',
        scoreContribution: req.weight * 0.5
      };
    }
  }

  // 2. Timeline date range calculation (e.g. 2019 - 2024 or 2020 - Present)
  const yearRangePattern = /\b(20\d\d|19\d\d)\s*[-–—to]+\s*(20\d\d|19\d\d|present|current)\b/gi;
  const currentYear = new Date().getFullYear();
  let maxSpan = 0;
  let sampleRange = '';

  let match;
  while ((match = yearRangePattern.exec(resumeText)) !== null) {
    const startYr = parseInt(match[1], 10);
    const endStr = match[2];
    const endYr = /present|current/i.test(endStr) ? currentYear : parseInt(endStr, 10);
    if (endYr >= startYr && startYr >= 1990 && endYr <= currentYear + 1) {
      const span = endYr - startYr;
      if (span > maxSpan) {
        maxSpan = span;
        sampleRange = match[0];
      }
    }
  }

  if (maxSpan >= requiredYears) {
    return {
      requirement: req,
      status: 'MATCHED',
      resumeExcerpt: sampleRange || `${maxSpan} year timeline`,
      explanation: `Calculated from employment history dates (${sampleRange}): ~${maxSpan} years tenure meets the target ${requiredYears}+ years.`,
      scoreContribution: req.weight * 1.0
    };
  } else if (maxSpan > 0) {
    return {
      requirement: req,
      status: 'PARTIAL',
      resumeExcerpt: sampleRange || `${maxSpan} year timeline`,
      explanation: `Employment history timeline spans ~${maxSpan} years, which is below the target ${requiredYears}+ years.`,
      limitations: 'Calculated work timeline requires candidate confirmation of full-time vs internship tenure.',
      scoreContribution: req.weight * 0.5
    };
  }

  return {
    requirement: req,
    status: 'NEEDS REVIEW',
    resumeExcerpt: null,
    explanation: 'Experience duration could not be definitively totaled from resume dates without human confirmation.',
    limitations: 'Calculated work timeline requires candidate confirmation of full-time vs internship tenure.',
    scoreContribution: 0
  };
}

function evaluateEducationRequirement(resumeText: string, req: JobRequirement): RequirementMatch {
  const reqLower = req.name.toLowerCase();

  const isMasterReq = /master|m\.s\.|m\.sc|ms degree/i.test(reqLower);
  const isDoctorateReq = /ph\.?d|doctorate/i.test(reqLower);

  const hasMaster = /(?:\b)(master'?s?|m\.s\.|m\.s\b|ms\b|m\.sc|mtech|m\.tech)(?=[^a-zA-Z0-9]|$)/i.test(resumeText);
  const hasDoctorate = /(?:\b)(ph\.?d\.?|doctorate|doctoral)(?=[^a-zA-Z0-9]|$)/i.test(resumeText);
  const hasBachelor = /(?:\b)(bachelor'?s?|b\.s\.|b\.s\b|bs\b|b\.a\.|b\.a\b|ba\b|b\.sc|btech|b\.tech|undergraduate)(?=[^a-zA-Z0-9]|$)/i.test(resumeText);
  const hasField = /(?:\b)(computer science|software engineering|information technology|electrical engineering|data science|mathematics|stem)(?=[^a-zA-Z0-9]|$)/i.test(resumeText);

  if (isDoctorateReq) {
    if (hasDoctorate) {
      const excerpt = findSentenceContaining(resumeText, 'ph.d') || findSentenceContaining(resumeText, 'doctorate') || 'Ph.D. credential';
      return {
        requirement: req,
        status: 'MATCHED',
        resumeExcerpt: excerpt.slice(0, 160),
        explanation: 'Resume provides verified evidence of doctoral / Ph.D. qualification.',
        scoreContribution: req.weight * 1.0
      };
    } else if (hasMaster || hasBachelor) {
      return {
        requirement: req,
        status: 'PARTIAL',
        resumeExcerpt: findSentenceContaining(resumeText, hasMaster ? 'master' : 'bachelor'),
        explanation: 'Candidate holds degree qualification, but job specifies Ph.D. / Doctorate.',
        limitations: 'Requires recruiter review for equivalent professional experience.',
        scoreContribution: req.weight * 0.5
      };
    }
  }

  if (isMasterReq) {
    if (hasMaster) {
      const excerpt = findSentenceContaining(resumeText, 'master') || 'Master degree credential';
      return {
        requirement: req,
        status: 'MATCHED',
        resumeExcerpt: excerpt.slice(0, 160),
        explanation: 'Resume provides verified evidence of Master’s degree qualification.',
        scoreContribution: req.weight * 1.0
      };
    } else if (hasBachelor) {
      return {
        requirement: req,
        status: 'PARTIAL',
        resumeExcerpt: findSentenceContaining(resumeText, 'bachelor'),
        explanation: 'Candidate holds Bachelor’s degree, but job posting specifies Master’s degree.',
        limitations: 'Verify if candidate’s work experience substitutes for advanced degree.',
        scoreContribution: req.weight * 0.5
      };
    }
  }

  // Standard Bachelor / STEM degree requirement
  if (hasBachelor && hasField) {
    const excerpt = findSentenceContaining(resumeText, 'bachelor') || findSentenceContaining(resumeText, 'computer science') || 'Bachelor degree in Computer Science';
    return {
      requirement: req,
      status: 'MATCHED',
      resumeExcerpt: excerpt.slice(0, 160),
      explanation: 'Resume provides direct evidence of relevant Bachelor’s degree in technical field.',
      scoreContribution: req.weight * 1.0
    };
  } else if (hasBachelor || hasField) {
    const excerpt = findSentenceContaining(resumeText, hasBachelor ? 'bachelor' : 'computer science');
    return {
      requirement: req,
      status: 'PARTIAL',
      resumeExcerpt: excerpt ? excerpt.slice(0, 160) : null,
      explanation: hasBachelor 
        ? 'Resume confirms Bachelor degree; field of study is adjacent or unspecified.'
        : 'Resume mentions computer science background; explicit graduation degree requires review.',
      limitations: 'Confirm whether candidate completed graduation vs in-progress degree.',
      scoreContribution: req.weight * 0.5
    };
  }

  return {
    requirement: req,
    status: 'NOT FOUND',
    resumeExcerpt: null,
    explanation: 'No explicit college degree or Computer Science qualification was identified in the resume text.',
    scoreContribution: 0
  };
}

function evaluateCertificationRequirement(resumeText: string, req: JobRequirement): RequirementMatch {
  const resumeLower = resumeText.toLowerCase();
  const reqLower = req.name.toLowerCase();

  const knownCertificates = [
    'aws certified', 'certified solutions architect', 'certified developer',
    'certified kubernetes', 'ckad', 'cka', 'pmp', 'project management professional',
    'scrum master', 'csm', 'psm', 'cissp', 'comptia security+', 'comptia a+',
    'google cloud certified', 'azure certified', 'hashicorp certified'
  ];

  const casualMention = /certified\s+(that|my|our|all|the|this)/i.test(resumeText);
  const matchingCert = knownCertificates.find(cert => resumeLower.includes(cert));

  if (matchingCert) {
    const excerpt = findSentenceContaining(resumeText, matchingCert) || matchingCert;
    return {
      requirement: req,
      status: 'MATCHED',
      resumeExcerpt: excerpt.slice(0, 180),
      explanation: `Resume demonstrates verified certification credential: "${matchingCert}".`,
      scoreContribution: req.weight * 1.0
    };
  }

  if (resumeLower.includes(reqLower) && !casualMention) {
    const excerpt = findSentenceContaining(resumeText, reqLower) || req.name;
    return {
      requirement: req,
      status: 'MATCHED',
      resumeExcerpt: excerpt.slice(0, 180),
      explanation: `Resume mentions certification credential: "${req.name}".`,
      scoreContribution: req.weight * 1.0
    };
  }

  if (resumeLower.includes('certification') || resumeLower.includes('certified')) {
    const certExcerpt = findSentenceContaining(resumeText, 'certified') || findSentenceContaining(resumeText, 'certification');
    return {
      requirement: req,
      status: 'NEEDS REVIEW',
      resumeExcerpt: certExcerpt ? certExcerpt.slice(0, 180) : null,
      explanation: `Resume lists general certification background, but specific credential for "${req.name}" requires visual verification.`,
      limitations: 'Digital badge or certificate ID should be verified by the hiring team.',
      scoreContribution: 0
    };
  }

  return {
    requirement: req,
    status: 'NOT FOUND',
    resumeExcerpt: null,
    explanation: `No mention of accredited certification for "${req.name}" was found in the resume.`,
    scoreContribution: 0
  };
}

// -------------------------------------------------------------
// 7. EXPLAINABLE SCORE RECALCULATION TOOL
// -------------------------------------------------------------
export function recalculateScoreWithWeights(
  currentMatches: RequirementMatch[],
  updatedWeights: Record<string, number>
): WeightRecalculationResult {
  const previousAudit = calculateTransparentScore(currentMatches);
  const previousScore = previousAudit.overallScore ?? 0;

  const weightChanges: WeightRecalculationResult['weightChanges'] = [];
  const updatedMatches: RequirementMatch[] = currentMatches.map(m => {
    const rawNewWeight = updatedWeights[m.requirement.id] ?? updatedWeights[m.requirement.name] ?? m.requirement.weight;
    const validatedWeight = Math.max(1, Math.min(5, Math.round(Number(rawNewWeight) || 3)));
    const oldWeight = m.requirement.weight;

    const multiplier = m.status === 'MATCHED' ? 1.0 : m.status === 'PARTIAL' ? 0.5 : 0.0;
    const previousContribution = oldWeight * multiplier;
    const newContribution = validatedWeight * multiplier;

    if (validatedWeight !== oldWeight) {
      weightChanges.push({
        requirementId: m.requirement.id,
        requirementName: m.requirement.name,
        oldWeight,
        newWeight: validatedWeight,
        status: m.status,
        previousContribution,
        newContribution,
        impactExplanation: `Weight adjusted from ${oldWeight} to ${validatedWeight}. ${
          m.status === 'MATCHED'
            ? `Earned points increased from ${previousContribution.toFixed(1)} to ${newContribution.toFixed(1)}.`
            : m.status === 'PARTIAL'
            ? `Partial points shifted from ${previousContribution.toFixed(1)} to ${newContribution.toFixed(1)}.`
            : `Unmatched requirement weight increased total denominator without adding points, exerting downward pressure on score.`
        }`
      });
    }

    return {
      ...m,
      requirement: {
        ...m.requirement,
        weight: validatedWeight
      },
      scoreContribution: newContribution
    };
  });

  const recalculatedAudit = calculateTransparentScore(updatedMatches);
  const recalculatedScore = recalculatedAudit.overallScore ?? 0;
  const scoreDelta = recalculatedScore - previousScore;

  let summaryExplanation = '';
  if (weightChanges.length === 0) {
    summaryExplanation = 'No weights were modified; recalculated score is identical to original score.';
  } else if (scoreDelta > 0) {
    summaryExplanation = `Score increased by +${scoreDelta}% (${previousScore}% -> ${recalculatedScore}%). Increased weight on verified matched requirements raised the overall weighted average.`;
  } else if (scoreDelta < 0) {
    summaryExplanation = `Score decreased by ${Math.abs(scoreDelta)}% (${previousScore}% -> ${recalculatedScore}%). Higher weights assigned to unverified or missing requirements increased the required denominator.`;
  } else {
    summaryExplanation = `Score remained at ${recalculatedScore}%. Weight adjustments balanced out evenly across matched and missing criteria.`;
  }

  return {
    previousScore,
    recalculatedScore,
    scoreDelta,
    recalculatedAudit,
    updatedMatches,
    weightChanges,
    summaryExplanation
  };
}
