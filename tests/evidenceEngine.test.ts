import { describe, it, expect } from 'vitest';
import {
  extractRequirementsFromJobDescription,
  matchRequirementsAgainstResume,
  calculateTransparentScore,
  inspectResumeDataQuality,
  simulateResumeImprovement,
  JobRequirement
} from '../src/services/evidenceEngine';

describe('HireLens Evidence Engine & Transparent Scoring (Phase 8 Audit)', () => {
  const sampleResume = `
    ALEXANDER MORGAN
    Senior Full-Stack Engineer | Seattle, WA
    alex.morgan@example.com | (555) 345-6789 | github.com/alexmorgan

    PROFESSIONAL SUMMARY
    Full-stack software engineer with 5 years of professional experience designing, building, and deploying scalable web applications and microservices.

    EXPERIENCE
    Senior Software Engineer — CloudScale Systems (2021 - Present)
    • Architected distributed streaming data pipelines in Python and FastAPI, handling 10,000 requests per second.
    • Optimized PostgreSQL database indexing and query execution plans, reducing p99 latency by 35%.
    • Containerized 15+ microservices using Docker and maintained CI/CD automated deployment pipelines via GitHub Actions.
    • Implemented Redis caching layers to improve page load throughput.

    Software Engineer — WebMatrix Inc (2019 - 2021)
    • Developed responsive web applications using React, TypeScript, and Node.js.
    • Built REST APIs and GraphQL endpoints for customer-facing dashboards.

    EDUCATION
    B.S. in Computer Science — University of Washington (2015 - 2019)

    SKILLS
    Languages: Python, TypeScript, JavaScript, SQL
    Frameworks & Tools: React, Node.js, FastAPI, PostgreSQL, Redis, Docker, CI/CD, Git
  `;

  const sampleJobDescription = `
    Senior Backend Engineer
    Requirements:
    • 5+ years of experience in backend development.
    • Strong proficiency in Python, FastAPI, and PostgreSQL.
    • Hands-on experience with Docker, CI/CD, and Redis.
    • Experience with Apache Kafka or distributed event streams is required.
    • B.S. or M.S. degree in Computer Science.
  `;

  // Test 1: Deterministic scoring — Same inputs and settings produce the exact same score
  it('1. Produces the exact same score for identical inputs and settings (determinism)', () => {
    const reqs1 = extractRequirementsFromJobDescription(sampleJobDescription);
    const reqs2 = extractRequirementsFromJobDescription(sampleJobDescription);

    const run1 = matchRequirementsAgainstResume(sampleResume, reqs1);
    const run2 = matchRequirementsAgainstResume(sampleResume, reqs2);

    expect(run1.audit.overallScore).toBe(run2.audit.overallScore);
    expect(run1.audit.matchedWeight).toBe(run2.audit.matchedWeight);
    expect(run1.audit.totalApplicableWeight).toBe(run2.audit.totalApplicableWeight);
    expect(run1.matches.length).toBe(run2.matches.length);

    for (let i = 0; i < run1.matches.length; i++) {
      expect(run1.matches[i].status).toBe(run2.matches[i].status);
      expect(run1.matches[i].scoreContribution).toBe(run2.matches[i].scoreContribution);
    }
  });

  // Test 2: Empty or unreadable resumes do not produce fabricated scores
  it('2. Empty or unreadable resumes do not produce fabricated scores', () => {
    const emptyResume = '';
    const reqs = extractRequirementsFromJobDescription(sampleJobDescription);
    const result = matchRequirementsAgainstResume(emptyResume, reqs);

    expect(result.audit.overallScore).toBeNull();
    expect(result.audit.isReliable).toBe(false);
    expect(result.audit.unreliableReason).toBeDefined();

    const quality = inspectResumeDataQuality(emptyResume);
    expect(quality.isReadable).toBe(false);
    expect(quality.overallStatus).toBe('UNREADABLE');
  });

  // Test 3: Missing job descriptions prevent job-specific scoring
  it('3. Missing or empty job description prevents job-specific scoring', () => {
    const reqs = extractRequirementsFromJobDescription('');
    expect(reqs).toEqual([]);

    const result = matchRequirementsAgainstResume(sampleResume, reqs);
    expect(result.audit.overallScore).toBeNull();
    expect(result.audit.isReliable).toBe(false);
  });

  // Test 4: Exact supporting evidence is recognized correctly (MATCHED)
  it('4. Recognizes direct supporting evidence as MATCHED with excerpt', () => {
    const reqs = extractRequirementsFromJobDescription(sampleJobDescription);
    const result = matchRequirementsAgainstResume(sampleResume, reqs);

    const pythonMatch = result.matches.find(m => m.requirement.name === 'Python');
    expect(pythonMatch).toBeDefined();
    expect(pythonMatch?.status).toBe('MATCHED');
    expect(pythonMatch?.resumeExcerpt).toBeDefined();
    expect(pythonMatch?.resumeExcerpt?.toLowerCase()).toContain('python');
    expect(pythonMatch?.scoreContribution).toBe(pythonMatch!.requirement.weight * 1.0);
  });

  // Test 5: Partial matches are not treated as exact matches (PARTIAL)
  it('5. Classifies adjacent or incomplete qualifications as PARTIAL (not exact)', () => {
    // Resume has Docker and containerization, but not Kubernetes
    const k8sReq: JobRequirement = {
      id: 'req-k8s',
      name: 'Kubernetes',
      category: 'tool',
      weight: 3,
      importanceLevel: 'Required',
      sourceExcerpt: 'Kubernetes cluster orchestration',
      normalizedTerm: 'kubernetes'
    };

    const result = matchRequirementsAgainstResume(sampleResume, [k8sReq]);
    const k8sMatch = result.matches[0];

    expect(k8sMatch.status).toBe('PARTIAL');
    expect(k8sMatch.scoreContribution).toBe(k8sReq.weight * 0.5); // 1.5 pts
    expect(k8sMatch.explanation.toLowerCase()).toContain('docker');
    expect(k8sMatch.limitations).toBeDefined();
  });

  // Test 6: Unsupported qualifications are not assumed (NOT FOUND)
  it('6. Marks unsupported qualifications as NOT FOUND with zero score contribution', () => {
    // Resume mentions nothing about Apache Kafka or event streaming
    const reqs = extractRequirementsFromJobDescription(sampleJobDescription);
    const result = matchRequirementsAgainstResume(sampleResume, reqs);

    const kafkaMatch = result.matches.find(m => m.requirement.name === 'Kafka');
    expect(kafkaMatch).toBeDefined();
    expect(kafkaMatch?.status).toBe('NOT FOUND');
    expect(kafkaMatch?.scoreContribution).toBe(0);
    expect(kafkaMatch?.resumeExcerpt).toBeNull();
  });

  // Test 7: Duplicate requirements do not accidentally inflate scores
  it('7. Normalizes and deduplicates duplicate requirements to prevent inflation', () => {
    const jdWithDuplicates = `
      Required: Python, NodeJS, Node.js, node js, Python3, python.
    `;
    const reqs = extractRequirementsFromJobDescription(jdWithDuplicates);

    const pythonReqs = reqs.filter(r => r.normalizedTerm === 'python');
    const nodeReqs = reqs.filter(r => r.normalizedTerm === 'node.js');

    expect(pythonReqs.length).toBe(1);
    expect(nodeReqs.length).toBe(1);
  });

  // Test 8: Changing requirement weights changes score according to documented formula
  it('8. Changing requirement weights alters score according to Score = 100 * [Sum(w_i * s_i) / Sum(w_i)]', () => {
    const req1: JobRequirement = {
      id: 'r1',
      name: 'Python',
      category: 'technical_skill',
      weight: 1, // Matched
      importanceLevel: 'Optional',
      sourceExcerpt: 'Python required',
      normalizedTerm: 'python'
    };
    const req2: JobRequirement = {
      id: 'r2',
      name: 'Kafka',
      category: 'tool',
      weight: 5, // Not Found
      importanceLevel: 'Required',
      sourceExcerpt: 'Kafka required',
      normalizedTerm: 'kafka'
    };

    // When Kafka has weight 5 and Python weight 1:
    // Matched = 1*1 = 1, Total = 1 + 5 = 6. Score = 100 * (1/6) = 17%
    const resHeavyKafka = matchRequirementsAgainstResume(sampleResume, [req1, req2]);
    expect(resHeavyKafka.audit.overallScore).toBe(17);

    // If we invert weights: Python weight 5 (Matched), Kafka weight 1 (Not Found):
    // Matched = 5*1 = 5, Total = 5 + 1 = 6. Score = 100 * (5/6) = 83%
    const req1Heavy = { ...req1, weight: 5 };
    const req2Light = { ...req2, weight: 1 };
    const resHeavyPython = matchRequirementsAgainstResume(sampleResume, [req1Heavy, req2Light]);
    expect(resHeavyPython.audit.overallScore).toBe(83);
  });

  // Test 9 & 10: Unrelated text changes or changing candidate name alone does not change requirement score
  it('9 & 10. Changing candidate name or adding unrelated filler text does not alter match score', () => {
    const reqs = extractRequirementsFromJobDescription(sampleJobDescription);
    const score1 = matchRequirementsAgainstResume(sampleResume, reqs).audit.overallScore;

    // Change candidate name and location
    const alteredResume = sampleResume
      .replace('ALEXANDER MORGAN', 'EMILY WATSON')
      .replace('Seattle, WA', 'Austin, TX');

    const score2 = matchRequirementsAgainstResume(alteredResume, reqs).audit.overallScore;
    expect(score2).toBe(score1);

    // Add unrelated hobby text
    const resumeWithHobbies = alteredResume + '\nHobbies: Enjoys hiking, landscape photography, and baking sourdough bread.';
    const score3 = matchRequirementsAgainstResume(resumeWithHobbies, reqs).audit.overallScore;
    expect(score3).toBe(score1);
  });

  // Test 11: A rewrite that adds no relevant evidence does not receive a score increase
  it('11. A rewrite that adds no relevant evidence does not receive an automatic score increase', () => {
    const reqs = extractRequirementsFromJobDescription(sampleJobDescription);
    const revisedText = sampleResume.replace(
      'Built REST APIs and GraphQL endpoints for customer-facing dashboards.',
      'Diligently developed robust REST APIs and GraphQL endpoints for various customer-facing dashboards with high focus.'
    );

    const simulation = simulateResumeImprovement(sampleResume, revisedText, reqs);
    expect(simulation.scoreDelta).toBe(0);
    expect(simulation.revisedScore).toBe(simulation.originalScore);
  });

  // Test 12: Adding genuine evidence for a missing requirement increases score deterministically
  it('12. Adding verifiable evidence for a missing requirement increases score deterministically', () => {
    const reqs = extractRequirementsFromJobDescription(sampleJobDescription);
    const revisedWithKafka = sampleResume + '\n• Engineered real-time event streaming pipeline using Apache Kafka to ingest 50M messages daily.';

    const simulation = simulateResumeImprovement(sampleResume, revisedWithKafka, reqs);
    expect(simulation.scoreDelta).toBeGreaterThan(0);
    expect(simulation.revisedScore).toBeGreaterThan(simulation.originalScore);

    const kafkaChange = simulation.changedRequirements.find(c => c.requirementName === 'Kafka');
    expect(kafkaChange).toBeDefined();
    expect(kafkaChange?.previousStatus).toBe('NOT FOUND');
    expect(kafkaChange?.newStatus).toBe('MATCHED');
  });

  // Test 13: Data Quality Inspector flags inverted/invalid timelines
  it('13. Flags invalid or inverted date timelines in resume quality inspection', () => {
    const resumeWithInvertedDates = sampleResume.replace(
      'Senior Software Engineer — CloudScale Systems (2021 - Present)',
      'Senior Software Engineer — CloudScale Systems (2024 - 2020)' // Inverted: 2024 to 2020
    );

    const quality = inspectResumeDataQuality(resumeWithInvertedDates);
    expect(quality.timelineConsistency.hasIssues).toBe(true);

    const issueItem = quality.timelineConsistency.items.find(i => i.issue?.includes('Inverted timeframe'));
    expect(issueItem).toBeDefined();
  });

  // Test 14: Requirements needing review are excluded from denominator and reported as limitations
  it('14. Excludes Needs Review items from active denominator and reports coverage limitation', () => {
    const reqMatched: JobRequirement = {
      id: 'req-m',
      name: 'Python',
      category: 'technical_skill',
      weight: 3,
      importanceLevel: 'Required',
      sourceExcerpt: 'Python required',
      normalizedTerm: 'python'
    };
    const reqReview: JobRequirement = {
      id: 'req-r',
      name: 'Confidential Clearance',
      category: 'certification',
      weight: 3,
      importanceLevel: 'Required',
      sourceExcerpt: 'Must hold active clearance',
      normalizedTerm: 'security clearance'
    };

    const matches = [
      {
        requirement: reqMatched,
        status: 'MATCHED' as const,
        resumeExcerpt: 'Python',
        explanation: 'Direct evidence',
        scoreContribution: 3.0
      },
      {
        requirement: reqReview,
        status: 'NEEDS REVIEW' as const,
        resumeExcerpt: null,
        explanation: 'Clearance cannot be verified from resume text',
        limitations: 'Candidate confirmation required',
        scoreContribution: 0
      }
    ];

    const audit = calculateTransparentScore(matches);
    expect(audit.assessedCount).toBe(1);
    expect(audit.needsReviewCount).toBe(1);
    expect(audit.totalApplicableWeight).toBe(3.0); // Only python included in denominator
    expect(audit.overallScore).toBe(100); // 3.0 / 3.0 = 100%
    expect(audit.coveragePercentage).toBe(50); // 1 of 2 assessed
    expect(audit.limitations.length).toBeGreaterThan(0);
  });

  // Test 15: Related but non-equivalent technologies (Java vs JavaScript)
  it('15. Strictly differentiates non-equivalent technologies (e.g. Java does not match JavaScript)', () => {
    const javaOnlyResume = `
      JOHN DOE
      Software Engineer | john@example.com
      5 years experience in enterprise Java, Spring Boot, and Hibernate development.
    `;

    const jsReq: JobRequirement = {
      id: 'req-js',
      name: 'JavaScript',
      category: 'technical_skill',
      weight: 3,
      importanceLevel: 'Required',
      sourceExcerpt: 'Must have strong JavaScript experience',
      normalizedTerm: 'javascript'
    };

    const result = matchRequirementsAgainstResume(javaOnlyResume, [jsReq]);
    expect(result.matches[0].status).toBe('NOT FOUND');
    expect(result.matches[0].scoreContribution).toBe(0);
  });

  // Test 16: Experience duration check
  it('16. Accurately evaluates experience duration (junior tenure against senior JD yields PARTIAL)', () => {
    const juniorResume = `
      JUNIOR CANDIDATE
      junior@example.com | (555) 123-4567
      SUMMARY: Energetic developer with 2 years of experience building web apps.
      EXPERIENCE:
      Junior Developer — TechCo (2022 - 2024)
      • Built web applications in TypeScript.
    `;

    const seniorExpReq: JobRequirement = {
      id: 'req-exp-5',
      name: '5+ Years Experience',
      category: 'experience',
      weight: 4,
      importanceLevel: 'Required',
      sourceExcerpt: 'Requires 5+ years of backend development',
      normalizedTerm: 'experience duration'
    };

    const result = matchRequirementsAgainstResume(juniorResume, [seniorExpReq]);
    const expMatch = result.matches[0];

    expect(expMatch.status).toBe('PARTIAL');
    expect(expMatch.explanation).toContain('2 years of experience');
    expect(expMatch.scoreContribution).toBe(seniorExpReq.weight * 0.5); // 2 pts out of 4
  });

  // Test 17: Degree requirements validation
  it('17. Evaluates academic degree requirements against genuine education credentials', () => {
    const degreeReq: JobRequirement = {
      id: 'req-edu',
      name: 'Bachelor in Computer Science',
      category: 'education',
      weight: 3,
      importanceLevel: 'Required',
      sourceExcerpt: 'B.S. in Computer Science required',
      normalizedTerm: 'degree qualification'
    };

    // Candidate with genuine B.S. CS
    const matchSuccess = matchRequirementsAgainstResume(sampleResume, [degreeReq]);
    expect(matchSuccess.matches[0].status).toBe('MATCHED');
    expect(matchSuccess.matches[0].scoreContribution).toBe(3);

    // Candidate with no degree mentioned
    const noDegreeResume = `
      SELF TAUGHT DEV
      dev@example.com
      5 years experience building Python and React applications. No college degree.
    `;
    const matchFail = matchRequirementsAgainstResume(noDegreeResume, [degreeReq]);
    expect(matchFail.matches[0].status).toBe('NOT FOUND');
    expect(matchFail.matches[0].scoreContribution).toBe(0);
  });

  // Test 18: Job description with no usable requirements
  it('18. Job description with no usable requirements blocks scoring honestly', () => {
    const genericJd = 'We are a fast-paced energetic company looking for great people to join our fun team.';
    const reqs = extractRequirementsFromJobDescription(genericJd);

    const result = matchRequirementsAgainstResume(sampleResume, reqs);
    expect(result.audit.overallScore).toBeNull();
    expect(result.audit.isReliable).toBe(false);
    expect(result.audit.unreliableReason).toContain('No job requirements');
  });

  // Test 19: Manual mathematical calculation audit with small verifiable test case
  it('19. Accurately executes manual calculation test case: weights [3, 2, 1] with statuses [MATCHED, PARTIAL, NOT FOUND]', () => {
    // Expected math:
    // Req A (weight 3, MATCHED): 3 * 1.0 = 3.0 pts
    // Req B (weight 2, PARTIAL): 2 * 0.5 = 1.0 pts
    // Req C (weight 1, NOT FOUND): 1 * 0.0 = 0.0 pts
    // Total applicable weight = 3 + 2 + 1 = 6.0
    // Total points earned = 3.0 + 1.0 + 0.0 = 4.0
    // Expected percentage = (4.0 / 6.0) * 100 = 66.666...% -> rounded to 67%

    const matches = [
      {
        requirement: {
          id: 'ra',
          name: 'Requirement A',
          category: 'technical_skill' as const,
          weight: 3,
          importanceLevel: 'Required' as const,
          sourceExcerpt: 'Req A',
          normalizedTerm: 'a'
        },
        status: 'MATCHED' as const,
        resumeExcerpt: 'Evidence A',
        explanation: 'Matched',
        scoreContribution: 3.0
      },
      {
        requirement: {
          id: 'rb',
          name: 'Requirement B',
          category: 'tool' as const,
          weight: 2,
          importanceLevel: 'Preferred' as const,
          sourceExcerpt: 'Req B',
          normalizedTerm: 'b'
        },
        status: 'PARTIAL' as const,
        resumeExcerpt: 'Evidence B',
        explanation: 'Partial',
        scoreContribution: 1.0
      },
      {
        requirement: {
          id: 'rc',
          name: 'Requirement C',
          category: 'tool' as const,
          weight: 1,
          importanceLevel: 'Optional' as const,
          sourceExcerpt: 'Req C',
          normalizedTerm: 'c'
        },
        status: 'NOT FOUND' as const,
        resumeExcerpt: null,
        explanation: 'Not found',
        scoreContribution: 0.0
      }
    ];

    const audit = calculateTransparentScore(matches);
    expect(audit.isReliable).toBe(true);
    expect(audit.totalApplicableWeight).toBe(6.0);
    expect(audit.matchedWeight).toBe(3.0);
    expect(audit.partialWeight).toBe(1.0);
    expect(audit.overallScore).toBe(67);
    expect(audit.assessedCount).toBe(3);
    expect(audit.coveragePercentage).toBe(100);
  });

  // Test 20: Irrelevant keyword stuffing does not fabricate experience or education
  it('20. Keyword stuffing without context does not satisfy experience or education requirements', () => {
    const stuffedResume = `
      KEYWORD STUFFER
      stuffer@example.com
      Skills: Python, Python, Python, Python, Docker, Docker, SQL, SQL, AWS, AWS, Kafka, Kafka.
    `;

    const seniorExpReq: JobRequirement = {
      id: 'req-exp-5',
      name: '5+ Years Experience',
      category: 'experience',
      weight: 4,
      importanceLevel: 'Required',
      sourceExcerpt: 'Requires 5+ years of experience',
      normalizedTerm: 'experience duration'
    };

    const eduReq: JobRequirement = {
      id: 'req-edu-ms',
      name: 'Master in Computer Science',
      category: 'education',
      weight: 3,
      importanceLevel: 'Required',
      sourceExcerpt: 'M.S. in Computer Science',
      normalizedTerm: 'degree qualification'
    };

    const result = matchRequirementsAgainstResume(stuffedResume, [seniorExpReq, eduReq]);
    // Stuffer has no timeline and no degree
    expect(result.matches[0].status).toBe('NEEDS REVIEW');
    expect(result.matches[1].status).toBe('NOT FOUND');
    expect(result.audit.overallScore).toBe(0); // 0 earned out of 3 applicable weight
  });
});
