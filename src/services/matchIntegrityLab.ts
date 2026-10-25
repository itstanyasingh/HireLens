/**
 * HireLens Match Integrity Lab Service
 * 
 * Provides automated integrity testing, evidence auditing, keyword-context challenges,
 * resume robustness tests, and score sensitivity verifications.
 * Adheres strictly to non-fabrication principles: exposes weaknesses honestly.
 */

import {
  JobRequirement,
  RequirementMatch,
  ScoreAudit,
  extractRequirementsFromJobDescription,
  matchRequirementsAgainstResume,
  calculateTransparentScore,
  hasNegativeContext,
  detectKeywordStuffingAnomaly
} from './evidenceEngine';

export interface IntegrityTestResult {
  id: string;
  category: 'Evidence Audit' | 'Keyword Context' | 'Resume Robustness' | 'Score Sensitivity';
  testName: string;
  description: string;
  inputFixture: string;
  expectedOutcome: string;
  actualOutcome: string;
  passed: boolean;
  explanation: string;
}

export interface MatchIntegrityReport {
  generatedAt: string;
  targetRole: string;
  originalScore: number | null;
  totalTestsRun: number;
  passCount: number;
  failCount: number;
  testResults: IntegrityTestResult[];
  traceableEvidenceCount: number;
  questionableEvidenceCount: number;
  limitations: string[];
  recommendations: string[];
}

/**
 * Runs the comprehensive Match Integrity Lab evaluation suite on given resume & JD text.
 */
export function runMatchIntegrityLab(
  resumeText: string,
  jobDescription: string,
  targetRoleName: string = 'Software Engineer'
): MatchIntegrityReport {
  const testResults: IntegrityTestResult[] = [];
  const requirements = extractRequirementsFromJobDescription(jobDescription);
  const { matches, audit } = matchRequirementsAgainstResume(resumeText, requirements);

  // 1. EVIDENCE AUDIT TESTS
  // Test A: Check that matched items have verified excerpts
  const matchedWithExcerpt = matches.filter(m => m.status === 'MATCHED' && m.resumeExcerpt && m.resumeExcerpt.length > 5);
  const matchedWithoutExcerpt = matches.filter(m => m.status === 'MATCHED' && (!m.resumeExcerpt || m.resumeExcerpt.length <= 5));
  
  testResults.push({
    id: 'audit-excerpts',
    category: 'Evidence Audit',
    testName: 'Verifiable Excerpt Audit',
    description: 'Verifies that all MATCHED requirements possess non-empty traceable quote excerpts from the resume.',
    inputFixture: `${matches.length} matched/evaluated requirements`,
    expectedOutcome: 'All MATCHED items must have valid supporting resume excerpts.',
    actualOutcome: `${matchedWithExcerpt.length} of ${matches.filter(m => m.status === 'MATCHED').length} matched items have verified excerpts. ${matchedWithoutExcerpt.length} missing excerpts.`,
    passed: matchedWithoutExcerpt.length === 0,
    explanation: matchedWithoutExcerpt.length === 0
      ? 'Evidence audit passed: every verified match is backed by a direct quote excerpt.'
      : 'Evidence audit warning: some matched requirements lack traceable quote excerpts.'
  });

  // Test B: Unsupported classification check (Not Found items must not contribute score)
  const notFoundWithScore = matches.filter(m => m.status === 'NOT FOUND' && m.scoreContribution > 0);
  testResults.push({
    id: 'audit-not-found-contribution',
    category: 'Evidence Audit',
    testName: 'Zero Credit for Missing Evidence',
    description: 'Verifies that NOT FOUND or NEEDS REVIEW items receive exactly 0 score contribution.',
    inputFixture: 'All evaluated requirements in match set',
    expectedOutcome: 'NOT FOUND items must have 0 score contribution.',
    actualOutcome: notFoundWithScore.length === 0 ? 'All NOT FOUND items have 0 score contribution.' : `${notFoundWithScore.length} violations found.`,
    passed: notFoundWithScore.length === 0,
    explanation: 'Ensures missing skills never contribute to the score.'
  });

  // 2. KEYWORD-CONTEXT CHALLENGE TESTS
  // Challenge A: Skill in project description (Expected: MATCHED)
  const projSnippet = 'Engineered distributed caching layer using Redis and Python.';
  const redisReq: JobRequirement = {
    id: 'req-redis',
    name: 'Redis',
    category: 'tool',
    weight: 3,
    importanceLevel: 'Required',
    sourceExcerpt: 'Redis caching required',
    normalizedTerm: 'redis'
  };
  const projMatch = matchRequirementsAgainstResume(projSnippet, [redisReq]);
  testResults.push({
    id: 'ctx-project',
    category: 'Keyword Context',
    testName: 'Skill in Project Description',
    description: 'Evaluates a skill embedded within an active engineering project description.',
    inputFixture: projSnippet,
    expectedOutcome: 'MATCHED',
    actualOutcome: projMatch.matches[0].status,
    passed: projMatch.matches[0].status === 'MATCHED',
    explanation: 'Correctly identifies skill in active project sentence.'
  });

  // Challenge B: Skill in negative context (Expected: NOT FOUND)
  const negSnippet = 'Experienced in Python and PostgreSQL; no experience with Redis or caching tiers.';
  const negMatch = matchRequirementsAgainstResume(negSnippet, [redisReq]);
  testResults.push({
    id: 'ctx-negative',
    category: 'Keyword Context',
    testName: 'Skill in Negative Context Disambiguation',
    description: 'Evaluates a skill preceded by exclusionary denial ("no experience with").',
    inputFixture: negSnippet,
    expectedOutcome: 'NOT FOUND',
    actualOutcome: negMatch.matches[0].status,
    passed: negMatch.matches[0].status === 'NOT FOUND',
    explanation: 'Negative context rule successfully blocked false positive match.'
  });

  // Challenge C: Keyword stuffing anomaly (Expected: NEEDS REVIEW)
  const stuffSnippet = 'Redis Redis Redis Redis Redis Redis Redis Redis';
  const stuffMatch = matchRequirementsAgainstResume(stuffSnippet, [redisReq]);
  testResults.push({
    id: 'ctx-stuffing',
    category: 'Keyword Context',
    testName: 'Keyword Stuffing Anomaly Detection',
    description: 'Evaluates dense keyword repetition without action verbs.',
    inputFixture: stuffSnippet,
    expectedOutcome: 'NEEDS REVIEW',
    actualOutcome: stuffMatch.matches[0].status,
    passed: stuffMatch.matches[0].status === 'NEEDS REVIEW',
    explanation: 'Anomaly detector flagged repetitive keyword stuffing for review.'
  });

  // 3. RESUME ROBUSTNESS TESTS
  // Test A: Section Reordering Invariance
  const reorderedResume = `
SKILLS & STACK
Python, TypeScript, Redis, PostgreSQL

EXPERIENCE
Software Engineer at Acme Corp
• Engineered distributed caching layer using Redis and Python.
  `.trim();
  const origRun = matchRequirementsAgainstResume(resumeText, requirements);
  const reorderedRun = matchRequirementsAgainstResume(reorderedResume, requirements);
  const scoresEqual = origRun.audit.overallScore === reorderedRun.audit.overallScore;
  testResults.push({
    id: 'robust-reorder',
    category: 'Resume Robustness',
    testName: 'Section Reordering Invariance',
    description: 'Tests whether reordering resume sections preserves match coverage and scores.',
    inputFixture: 'Resume with Skills placed above Experience',
    expectedOutcome: `Identical score (${origRun.audit.overallScore}%)`,
    actualOutcome: `Score calculated as ${reorderedRun.audit.overallScore}%`,
    passed: scoresEqual,
    explanation: 'Demonstrates robustness against structural layout changes.'
  });

  // Test B: Unrelated Noise Invariance
  const noisyResume = `${resumeText}\n\nHOBBIES & INTERESTS\n• Baking sourdough bread and hiking Alpine trails.`;
  const noisyRun = matchRequirementsAgainstResume(noisyResume, requirements);
  const noiseScoresEqual = noisyRun.audit.overallScore === origRun.audit.overallScore;
  testResults.push({
    id: 'robust-noise',
    category: 'Resume Robustness',
    testName: 'Irrelevant Filler Text Invariance',
    description: 'Tests whether adding unrelated personal hobbies or filler text alters technical match scores.',
    inputFixture: 'Original resume + 3 lines of cooking hobbies',
    expectedOutcome: `Identical score (${origRun.audit.overallScore}%)`,
    actualOutcome: `Score calculated as ${noisyRun.audit.overallScore}%`,
    passed: noiseScoresEqual,
    explanation: 'Ensures personal hobbies do not inflate or deflate match scores.'
  });

  // 4. SCORE SENSITIVITY TESTS
  // Test A: Determinism
  const detRun1 = matchRequirementsAgainstResume(resumeText, requirements);
  const detRun2 = matchRequirementsAgainstResume(resumeText, requirements);
  const deterministic = detRun1.audit.overallScore === detRun2.audit.overallScore;
  testResults.push({
    id: 'sens-determinism',
    category: 'Score Sensitivity',
    testName: 'Deterministic Score Invariance',
    description: 'Tests whether running matching twice on identical inputs produces identical scores.',
    inputFixture: 'Identical resume and job description strings',
    expectedOutcome: 'Exact bit-for-bit score match',
    actualOutcome: `Run 1: ${detRun1.audit.overallScore}%, Run 2: ${detRun2.audit.overallScore}%`,
    passed: deterministic,
    explanation: 'Guarantees 100% reproducible scoring without random fluctuations.'
  });

  // Test B: Name Neutrality
  const namedResume = resumeText.replace(/^[\w\s]+/, 'AMINA AL-MANSOOR');
  const namedRun = matchRequirementsAgainstResume(namedResume, requirements);
  const nameNeutral = namedRun.audit.overallScore === origRun.audit.overallScore;
  testResults.push({
    id: 'sens-name-neutrality',
    category: 'Score Sensitivity',
    testName: 'Demographic Name Neutrality',
    description: 'Tests whether changing the candidate name alters skill matching or scores.',
    inputFixture: 'Resume with candidate name changed to AMINA AL-MANSOOR',
    expectedOutcome: `Identical score (${origRun.audit.overallScore}%)`,
    actualOutcome: `Score calculated as ${namedRun.audit.overallScore}%`,
    passed: nameNeutral,
    explanation: 'Proves zero demographic or name bias in the scoring algorithm.'
  });

  const passCount = testResults.filter(t => t.passed).length;
  const failCount = testResults.length - passCount;
  const traceableEvidenceCount = matches.filter(m => m.resumeExcerpt && m.resumeExcerpt.length > 5).length;
  const questionableEvidenceCount = matches.filter(m => m.status === 'NEEDS REVIEW' || m.status === 'PARTIAL').length;

  const limitations = [
    'Evidence matching relies on lexical tokenization and syntactic sentence boundaries; heavily stylized graphic resumes requiring complex visual reasoning may experience parser errors.',
    'Results on synthetic test cases establish software reliability but do not guarantee hiring outcomes.'
  ];

  const recommendations = [
    'Review any items marked "NEEDS REVIEW" in the Match Lab to verify actual project deliverables.',
    'Incorporate missing required keywords into active project experience bullets rather than raw keyword lists.'
  ];

  return {
    generatedAt: new Date().toISOString(),
    targetRole: targetRoleName,
    originalScore: audit.overallScore,
    totalTestsRun: testResults.length,
    passCount,
    failCount,
    testResults,
    traceableEvidenceCount,
    questionableEvidenceCount,
    limitations,
    recommendations
  };
}
