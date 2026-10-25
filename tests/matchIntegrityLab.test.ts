import { describe, it, expect } from 'vitest';
import { runMatchIntegrityLab } from '../src/services/matchIntegrityLab';

describe('Match Integrity Lab Service & Report', () => {
  const testResume = `
ALEX MORGAN
alex@example.com | (555) 019-2831
Seattle, WA

EXPERIENCE
Senior Software Engineer — CloudScale Systems (2021 - Present)
• Engineered distributed streaming data pipelines in Python and FastAPI.
• Optimized PostgreSQL database indexing and query execution plans.
• Containerized services using Docker and maintained CI/CD automated deployment pipelines.

EDUCATION
B.S. in Computer Science — University of Washington (2014 - 2018)

SKILLS
Python, FastAPI, PostgreSQL, Docker, CI/CD, Redis
  `.trim();

  const testJobDescription = `
Senior Backend Engineer
Requirements:
• 5+ years of experience in backend software engineering.
• Strong proficiency in Python, FastAPI, and PostgreSQL.
• Hands-on experience with Docker, CI/CD, and Redis.
• Bachelor's degree in Computer Science.
  `.trim();

  it('runs complete match integrity lab report and passes all core tests', () => {
    const report = runMatchIntegrityLab(testResume, testJobDescription, 'Senior Backend Engineer');

    expect(report).toBeDefined();
    expect(report.totalTestsRun).toBeGreaterThan(0);
    expect(report.passCount).toBeGreaterThan(0);
    expect(report.testResults.length).toBe(report.totalTestsRun);
    expect(report.originalScore).not.toBeNull();
    expect(report.traceableEvidenceCount).toBeGreaterThan(0);

    // Verify specific test categories exist
    const categories = new Set(report.testResults.map(t => t.category));
    expect(categories.has('Evidence Audit')).toBe(true);
    expect(categories.has('Keyword Context')).toBe(true);
    expect(categories.has('Resume Robustness')).toBe(true);
    expect(categories.has('Score Sensitivity')).toBe(true);
  });
});
