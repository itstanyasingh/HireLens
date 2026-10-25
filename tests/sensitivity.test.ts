import { describe, it, expect } from 'vitest';
import {
  extractRequirementsFromJobDescription,
  matchRequirementsAgainstResume,
  recalculateScoreWithWeights,
  JobRequirement
} from '../src/services/evidenceEngine';

describe('HireLens Score Sensitivity & Consistency Tests', () => {
  const baseResume = `
ALEX MORGAN
alex@example.com | (555) 019-2831
Seattle, WA

PROFESSIONAL SUMMARY
Senior Software Engineer with 5+ years of experience building web platforms in React, TypeScript, and Node.js.

WORK EXPERIENCE
Senior Full Stack Engineer — Acme Corp (2020 - Present)
• Built scalable frontend architectures using React and TypeScript.
• Engineered backend microservices in Node.js and PostgreSQL.
• Containerized services using Docker and automated CI/CD with GitHub Actions.

EDUCATION
B.S. in Computer Science — University of Washington (2015 - 2019)

SKILLS
React, TypeScript, Node.js, PostgreSQL, Docker, CI/CD, Git
`.trim();

  const baseJobDescription = `
Senior Full Stack Engineer
Requirements:
• 5+ years of experience.
• Strong proficiency in React and TypeScript.
• Backend experience with Node.js and PostgreSQL.
• Experience with Docker and CI/CD pipelines.
• Experience with Kubernetes is required.
• Experience with Apache Kafka is required.
• Bachelor's degree in Computer Science.
`.trim();

  // Test 1: Determinism Invariance
  it('1. Identical inputs and settings produce identical scores every time', () => {
    const reqs1 = extractRequirementsFromJobDescription(baseJobDescription);
    const reqs2 = extractRequirementsFromJobDescription(baseJobDescription);

    const run1 = matchRequirementsAgainstResume(baseResume, reqs1);
    const run2 = matchRequirementsAgainstResume(baseResume, reqs2);

    expect(run1.audit.overallScore).toBe(run2.audit.overallScore);
    expect(run1.audit.matchedWeight).toBe(run2.audit.matchedWeight);
    expect(run1.audit.totalApplicableWeight).toBe(run2.audit.totalApplicableWeight);
    expect(run1.matches.map(m => m.status)).toEqual(run2.matches.map(m => m.status));
  });

  // Test 2: Weight Monotonicity on Matched Criteria
  it('2. Increasing the weight of a MATCHED requirement strictly increases or maintains score', () => {
    const reqs = extractRequirementsFromJobDescription(baseJobDescription);
    const initialRun = matchRequirementsAgainstResume(baseResume, reqs);
    const initialScore = initialRun.audit.overallScore ?? 0;

    // TypeScript is MATCHED. Increase its weight from 3 to 5.
    const recalc = recalculateScoreWithWeights(initialRun.matches, {
      'req-typescript': 5
    });

    expect(recalc.recalculatedScore).toBeGreaterThanOrEqual(initialScore);
    expect(recalc.scoreDelta).toBeGreaterThanOrEqual(0);
    expect(recalc.weightChanges.length).toBe(1);
    expect(recalc.weightChanges[0].status).toBe('MATCHED');
  });

  // Test 3: Weight Monotonicity on Missing Criteria
  it('3. Increasing the weight of a NOT FOUND requirement strictly decreases or maintains score', () => {
    const reqs = extractRequirementsFromJobDescription(baseJobDescription);
    const initialRun = matchRequirementsAgainstResume(baseResume, reqs);
    const initialScore = initialRun.audit.overallScore ?? 0;

    // Kafka is NOT FOUND. Increase its weight from 3 to 5.
    const recalc = recalculateScoreWithWeights(initialRun.matches, {
      'req-kafka': 5
    });

    expect(recalc.recalculatedScore).toBeLessThanOrEqual(initialScore);
    expect(recalc.scoreDelta).toBeLessThanOrEqual(0);
    expect(recalc.weightChanges.length).toBe(1);
    expect(recalc.weightChanges[0].status).toBe('NOT FOUND');
  });

  // Test 4: Removing Supporting Evidence strictly reduces score
  it('4. Removing supporting evidence cannot silently preserve an unjustified match', () => {
    const reqs = extractRequirementsFromJobDescription(baseJobDescription);
    const initialRun = matchRequirementsAgainstResume(baseResume, reqs);
    const initialScore = initialRun.audit.overallScore ?? 0;

    // Remove React and TypeScript from resume
    const strippedResume = baseResume
      .replace(/React/gi, 'Angular')
      .replace(/TypeScript/gi, 'PHP');

    const strippedRun = matchRequirementsAgainstResume(strippedResume, reqs);
    const strippedScore = strippedRun.audit.overallScore ?? 0;

    expect(strippedScore).toBeLessThan(initialScore);
    const reactMatch = strippedRun.matches.find(m => m.requirement.normalizedTerm === 'react');
    const tsMatch = strippedRun.matches.find(m => m.requirement.normalizedTerm === 'typescript');

    expect(reactMatch?.status).not.toBe('MATCHED');
    expect(tsMatch?.status).not.toBe('MATCHED');
  });

  // Test 5: Adding Unrelated Noise Text does not improve score
  it('5. Adding unrelated noise or cooking recipes does not create an unsupported improvement', () => {
    const reqs = extractRequirementsFromJobDescription(baseJobDescription);
    const initialRun = matchRequirementsAgainstResume(baseResume, reqs);
    const initialScore = initialRun.audit.overallScore ?? 0;

    const noiseResume = `${baseResume}
      INTERESTS & RECIPES
      • Prepared authentic sourdough bread using 80% hydration flour and active levain.
      • Slow-cooked boeuf bourguignon with red burgundy wine and caramelized shallots.
      • Hiked across Pacific Northwest mountain trails and documented landscape photography.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
    `;

    const noiseRun = matchRequirementsAgainstResume(noiseResume, reqs);
    const noiseScore = noiseRun.audit.overallScore ?? 0;

    // Score must be identical because no target technical requirements were added
    expect(noiseScore).toBe(initialScore);
    expect(noiseRun.audit.matchedCount).toBe(initialRun.audit.matchedCount);
  });

  // Test 6: Demographic & Name Neutrality (Zero Bias)
  it('6. Changing only the candidate name does not alter skill matching or scores', () => {
    const reqs = extractRequirementsFromJobDescription(baseJobDescription);
    const names = [
      'Sarah Connor',
      'John Doe',
      'Amina Al-Mansoor',
      'Wei Chen',
      'Priya Sharma',
      'Alejandro Rodriguez'
    ];

    const scores: number[] = [];

    for (const name of names) {
      const modifiedResume = baseResume.replace('ALEX MORGAN', name).replace('alex@example.com', `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`);
      const run = matchRequirementsAgainstResume(modifiedResume, reqs);
      scores.push(run.audit.overallScore ?? 0);
    }

    // All scores must be strictly identical
    const allIdentical = scores.every(s => s === scores[0]);
    expect(allIdentical).toBe(true);
  });

  // Test 7: Section Reordering Invariance
  it('7. Reordering standard resume sections does not alter requirement coverage', () => {
    const reqs = extractRequirementsFromJobDescription(baseJobDescription);
    const initialRun = matchRequirementsAgainstResume(baseResume, reqs);

    const reorderedResume = `
ALEX MORGAN
alex@example.com

SKILLS
React, TypeScript, Node.js, PostgreSQL, Docker, CI/CD, Git

EDUCATION
B.S. in Computer Science — University of Washington (2015 - 2019)

WORK EXPERIENCE
Senior Full Stack Engineer — Acme Corp (2020 - Present)
• Built scalable frontend architectures using React and TypeScript.
• Engineered backend microservices in Node.js and PostgreSQL.
• Containerized services using Docker and automated CI/CD with GitHub Actions.
    `.trim();

    const reorderedRun = matchRequirementsAgainstResume(reorderedResume, reqs);

    expect(reorderedRun.audit.overallScore).toBe(initialRun.audit.overallScore);
    expect(reorderedRun.audit.matchedCount).toBe(initialRun.audit.matchedCount);
    expect(reorderedRun.audit.notFoundCount).toBe(initialRun.audit.notFoundCount);
  });

  // Test 8: Adding Real Evidenced Skill increases score appropriately
  it('8. Adding verifiable evidence for a missing requirement increases the score deterministically', () => {
    const reqs = extractRequirementsFromJobDescription(baseJobDescription);
    const initialRun = matchRequirementsAgainstResume(baseResume, reqs);
    const initialScore = initialRun.audit.overallScore ?? 0;

    // Add verifiable Kafka experience
    const enhancedResume = `${baseResume}
• Architected event-driven streaming services utilizing Apache Kafka with consumer group partition tuning.`;

    const enhancedRun = matchRequirementsAgainstResume(enhancedResume, reqs);
    const enhancedScore = enhancedRun.audit.overallScore ?? 0;

    expect(enhancedScore).toBeGreaterThan(initialScore);
    const kafkaMatch = enhancedRun.matches.find(m => m.requirement.normalizedTerm === 'kafka');
    expect(kafkaMatch?.status).toBe('MATCHED');
  });
});
