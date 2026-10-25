import { describe, it, expect } from 'vitest';
import {
  extractRequirementsFromJobDescription,
  matchRequirementsAgainstResume,
  hasNegativeContext,
  detectKeywordStuffingAnomaly,
  MatchStatus
} from '../src/services/evidenceEngine';

/**
 * HIRELENS REQUIREMENT-MATCHING EVALUATION SUITE
 * 
 * Notice: This evaluation suite uses strictly controlled synthetic test fixtures
 * with independently defined ground truth labels to test algorithmic classification
 * precision, recall, and boundary behavior.
 * 
 * CRITICAL METHODOLOGY NOTICE:
 * Performance on synthetic test cases verifies deterministic software behavior
 * under controlled inputs. It does NOT establish real-world subjective hiring accuracy.
 */

interface SyntheticTestCase {
  id: string;
  name: string;
  description: string;
  resumeSnippet: string;
  jobRequirementName: string;
  expectedStatus: MatchStatus;
  rationale: string;
}

describe('Synthetic Requirement-Matching Evaluation Suite (Ground Truth Benchmark)', () => {
  const EVALUATION_FIXTURES: SyntheticTestCase[] = [
    {
      id: 'tc-01-exact-match',
      name: 'Exact Skill Match with Engineering Verbs',
      description: 'Candidate documents TypeScript usage with active delivery context',
      resumeSnippet: 'Engineered high-throughput web applications using TypeScript and React with strict type safety.',
      jobRequirementName: 'TypeScript',
      expectedStatus: 'MATCHED',
      rationale: 'Resume contains direct mention of TypeScript in an active engineering sentence.'
    },
    {
      id: 'tc-02-partial-match',
      name: 'Partial Adjacent Match',
      description: 'Candidate documents Docker containerization but JD asks for Kubernetes orchestration',
      resumeSnippet: 'Containerized 15+ microservices with Docker and managed local Docker Compose clusters.',
      jobRequirementName: 'Kubernetes',
      expectedStatus: 'PARTIAL',
      rationale: 'Resume shows containerization background with Docker, which is adjacent but not identical to Kubernetes orchestration.'
    },
    {
      id: 'tc-03-non-equiv-java-vs-js',
      name: 'Non-Equivalent Technology: Java vs JavaScript',
      description: 'Candidate has Java background; JD asks for JavaScript',
      resumeSnippet: 'Senior Java backend developer with Spring Boot and JVM garbage collection tuning experience.',
      jobRequirementName: 'JavaScript',
      expectedStatus: 'NOT FOUND',
      rationale: 'Java and JavaScript are entirely distinct platforms; Java must never match JavaScript.'
    },
    {
      id: 'tc-04-non-equiv-js-vs-java',
      name: 'Non-Equivalent Technology: JavaScript vs Java',
      description: 'Candidate has JavaScript frontend background; JD asks for Java',
      resumeSnippet: 'Frontend developer skilled in JavaScript, DOM manipulation, CSS, and HTML5.',
      jobRequirementName: 'Java',
      expectedStatus: 'NOT FOUND',
      rationale: 'JavaScript must never match the Java backend language.'
    },
    {
      id: 'tc-05-negative-context',
      name: 'Keyword in Explicit Negative Context',
      description: 'Candidate explicitly denies experience with the target tool',
      resumeSnippet: 'Familiar with React and Python; no experience with Kubernetes or container orchestration.',
      jobRequirementName: 'Kubernetes',
      expectedStatus: 'NOT FOUND',
      rationale: 'Negative marker "no experience with" precedes Kubernetes, disqualifying it from positive skill credit.'
    },
    {
      id: 'tc-06-irrelevant-english-go',
      name: 'Generic English Word Disambiguation: Go Language',
      description: 'Candidate uses English word "go" in business context; JD asks for Go programming language',
      resumeSnippet: 'Spearheaded go-to-market product launch, ensuring the cross-functional team will go above and beyond.',
      jobRequirementName: 'Go',
      expectedStatus: 'NOT FOUND',
      rationale: 'English phrases like "go-to-market" or "go above" must not be parsed as Go programming language proficiency.'
    },
    {
      id: 'tc-07-missing-evidence',
      name: 'Completely Missing Skill',
      description: 'Candidate has no mention of the requested technology',
      resumeSnippet: 'Full stack developer with Ruby on Rails, PostgreSQL, and Bootstrap.',
      jobRequirementName: 'FastAPI',
      expectedStatus: 'NOT FOUND',
      rationale: 'Candidate has no Python or FastAPI experience in the document.'
    },
    {
      id: 'tc-08-keyword-stuffing',
      name: 'Misleading Keyword Stuffing Anomaly',
      description: 'Candidate repeats Docker 7 times in a row without verbs or context',
      resumeSnippet: 'Docker Docker Docker Docker Docker Docker Docker.\nAlso listed: Git.',
      jobRequirementName: 'Docker',
      expectedStatus: 'NEEDS REVIEW',
      rationale: 'High repetition density (7x) without action verbs triggers the anomaly detector, flagging it for review.'
    },
    {
      id: 'tc-09-experience-tenure-shortfall',
      name: 'Experience Duration Shortfall',
      description: 'Candidate has 1 year experience; JD requires 5+ years',
      resumeSnippet: 'Junior software developer with 1 year of experience in full-stack engineering.',
      jobRequirementName: '5+ Years Experience',
      expectedStatus: 'PARTIAL',
      rationale: 'Stated 1 year tenure is below the 5+ years requirement, properly classified as PARTIAL rather than MATCHED.'
    },
    {
      id: 'tc-10-education-degree-match',
      name: 'Verified Degree Match',
      description: 'Candidate lists B.S. in Computer Science',
      resumeSnippet: 'B.S. in Computer Science from University of Washington (2018 - 2022).',
      jobRequirementName: "Bachelor's Degree in Computer Science",
      expectedStatus: 'MATCHED',
      rationale: 'Direct evidence of Bachelor of Science in Computer Science identified.'
    }
  ];

  it('evaluates all synthetic fixtures and calculates Precision, Recall, and F1 on ground truth', () => {
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;
    let trueNegatives = 0;

    const results: { id: string; expected: MatchStatus; actual: MatchStatus; correct: boolean }[] = [];

    for (const fixture of EVALUATION_FIXTURES) {
      const requirements = extractRequirementsFromJobDescription(
        `Job Description requiring ${fixture.jobRequirementName}. Must have ${fixture.jobRequirementName}.`
      );

      // In case requirement extraction mapped it specifically
      let targetReq = requirements.find(r => r.name.toLowerCase().includes(fixture.jobRequirementName.toLowerCase())) || requirements[0];
      if (!targetReq) {
        targetReq = {
          id: `req-${fixture.jobRequirementName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: fixture.jobRequirementName,
          category: fixture.jobRequirementName.includes('Experience') ? 'experience' : fixture.jobRequirementName.includes('Degree') ? 'education' : 'technical_skill',
          weight: 3,
          importanceLevel: 'Required',
          sourceExcerpt: `Must have ${fixture.jobRequirementName}`,
          normalizedTerm: fixture.jobRequirementName.toLowerCase()
        };
      }

      const evalResult = matchRequirementsAgainstResume(fixture.resumeSnippet, [targetReq]);
      const actualMatch = evalResult.matches[0];
      const actualStatus = actualMatch ? actualMatch.status : 'NOT FOUND';

      const isCorrect = actualStatus === fixture.expectedStatus;
      results.push({
        id: fixture.id,
        expected: fixture.expectedStatus,
        actual: actualStatus,
        correct: isCorrect
      });

      // Binary evaluation metrics (Positive = MATCHED or PARTIAL, Negative = NOT FOUND or NEEDS REVIEW)
      const expectedPositive = fixture.expectedStatus === 'MATCHED' || fixture.expectedStatus === 'PARTIAL';
      const actualPositive = actualStatus === 'MATCHED' || actualStatus === 'PARTIAL';

      if (expectedPositive && actualPositive) truePositives++;
      else if (!expectedPositive && actualPositive) falsePositives++;
      else if (expectedPositive && !actualPositive) falseNegatives++;
      else trueNegatives++;

      expect(actualStatus).toBe(fixture.expectedStatus);
    }

    // Compute Precision, Recall, F1
    const precision = truePositives + falsePositives > 0 ? truePositives / (truePositives + falsePositives) : 1;
    const recall = truePositives + falseNegatives > 0 ? truePositives / (truePositives + falseNegatives) : 1;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 1;

    expect(precision).toBeGreaterThanOrEqual(0.9);
    expect(recall).toBeGreaterThanOrEqual(0.9);
    expect(f1Score).toBeGreaterThanOrEqual(0.9);
  });

  it('correctly classifies negative context patterns across varied phrasing', () => {
    expect(hasNegativeContext('I have no experience with Kubernetes whatsoever.', 'Kubernetes')).toBe(true);
    expect(hasNegativeContext('Worked with React; not familiar with AWS Lambda.', 'AWS')).toBe(true);
    expect(hasNegativeContext('Avoided PHP due to legacy constraints.', 'PHP')).toBe(true);
    expect(hasNegativeContext('Little to no experience in Docker orchestration.', 'Docker')).toBe(true);
    expect(hasNegativeContext('Architected high-throughput microservices using Docker.', 'Docker')).toBe(false);
  });

  it('flags keyword stuffing when density is high and action verbs are absent', () => {
    const stuffedText = 'Docker Docker Docker Docker Docker Docker Docker Docker';
    const anomaly = detectKeywordStuffingAnomaly(stuffedText, 'Docker');
    expect(anomaly.isSuspicious).toBe(true);
    expect(anomaly.count).toBeGreaterThanOrEqual(7);

    const legitimateText = `
      Senior Engineer at TechCorp.
      • Built microservices using Docker containers and Kubernetes clusters.
      • Configured Docker multi-stage builds to optimize image layers.
      • Maintained CI/CD pipelines deploying Docker containers to production.
      • Tested Docker networking configurations under simulated loads.
      • Optimized Docker runtime resource limits.
    `;
    const legitAnomaly = detectKeywordStuffingAnomaly(legitimateText, 'Docker');
    expect(legitAnomaly.isSuspicious).toBe(false);
  });
});
