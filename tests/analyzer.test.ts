import { describe, it, expect } from 'vitest';
import { analyzeResumeContent } from '../src/services/analyzer';

describe('analyzeResumeContent Scoring Engine', () => {
  const sampleCandidate = `
    SARAH CHEN
    Senior Backend Engineer | New York, NY
    sarah.chen@example.com | (555) 789-2345 | linkedin.com/in/sarahchen | github.com/sarahchen

    PROFESSIONAL SUMMARY
    Results-driven backend software engineer with 6 years of experience building high-throughput APIs, distributed systems, and real-time data pipelines.

    EXPERIENCE
    Senior Software Engineer — FinTech Data Corp (2021 - Present)
    • Architected payments settlement engine in Python and FastAPI, handling 15,000 requests per second with 99.99% uptime.
    • Optimized PostgreSQL database indexing and query plans, reducing average 95th-percentile query latency by 45%.
    • Worked on background worker tasks for account syncing.
    • Implemented automated integration tests with Docker and GitHub Actions across 20+ microservices.

    Software Engineer — WebScale Innovations (2018 - 2021)
    • Built REST APIs and GraphQL endpoints using Node.js, Express, and Redis caching.
    • Assisted in team code reviews and sprint planning sessions.

    EDUCATION
    Master of Science in Computer Science — Columbia University (2018)
    Bachelor of Science in Information Technology — NYU (2016)

    SKILLS
    Languages: Python, JavaScript, TypeScript, SQL, Go
    Backend & Databases: FastAPI, Node.js, Express, PostgreSQL, Redis, MongoDB
    DevOps & Tools: Docker, Kubernetes, AWS, Git, CI/CD, Linux, Agile
  `;

  it('calculates mathematically consistent scores between 0 and 100', () => {
    const report = analyzeResumeContent(sampleCandidate, 'Sarah_Chen_Resume.pdf');

    expect(report.overallScore).toBeGreaterThanOrEqual(50);
    expect(report.overallScore).toBeLessThanOrEqual(100);
    expect(report.atsScore).toBeGreaterThanOrEqual(40);
    expect(report.contentScore).toBeGreaterThanOrEqual(40);
    expect(report.skillsScore).toBeGreaterThanOrEqual(40);
    expect(report.recruiterScore).toBeGreaterThanOrEqual(40);

    // Verify mathematical formula: Overall = (ATS * 0.3) + (Content * 0.25) + (Skills * 0.20) + (Recruiter * 0.25)
    const expectedOverall = Math.round(
      report.atsScore * 0.30 +
      report.contentScore * 0.25 +
      report.skillsScore * 0.20 +
      report.recruiterScore * 0.25
    );
    expect(report.overallScore).toBe(expectedOverall);
  });

  it('detects skills accurately from taxonomy', () => {
    const report = analyzeResumeContent(sampleCandidate, 'Sarah_Chen_Resume.pdf');
    const skills = report.categories.skills.detectedSkills;

    expect(skills).toContain('Python');
    expect(skills).toContain('FastAPI');
    expect(skills).toContain('PostgreSQL');
    expect(skills).toContain('Redis');
    expect(skills).toContain('Docker');
    expect(skills).toContain('Git');
  });

  it('detects quantified metrics and identifies genuine weak bullet points', () => {
    const report = analyzeResumeContent(sampleCandidate, 'Sarah_Chen_Resume.pdf');

    expect(report.categories.content.quantifiedAchievementsCount).toBeGreaterThanOrEqual(2);

    // Should detect weak passive bullets like "Worked on background worker tasks" or "Assisted in team code reviews"
    const weakBullets = report.categories.content.weakBullets;
    expect(weakBullets.length).toBeGreaterThanOrEqual(1);

    const hasPassiveExample = weakBullets.some(b => 
      b.original.toLowerCase().includes('worked on') || 
      b.original.toLowerCase().includes('assisted in')
    );
    expect(hasPassiveExample).toBe(true);

    // Every weak bullet MUST be a readable sentence without corrupted characters
    for (const b of weakBullets) {
      expect(b.original).not.toMatch(/[a-zA-Z0-9]+["'{}|\\_#$^[\]<>`~=]{1,}[a-zA-Z0-9]+/);
      expect(b.suggestion).toBeDefined();
      expect(b.reason).toBeDefined();
    }
  });

  it('compares accurately with target job descriptions', () => {
    const jobDescription = `
      Looking for a Senior Backend Engineer proficient in Python, Go, Kubernetes, Kafka, and Redis.
      Experience with AWS, CI/CD, and distributed databases required.
    `;

    const report = analyzeResumeContent(sampleCandidate, 'Sarah_Chen_Resume.pdf', jobDescription);

    expect(report.categories.keywords.matchedKeywords).toContain('Python');
    expect(report.categories.keywords.matchedKeywords).toContain('Redis');
    expect(report.categories.keywords.missingKeywords).toContain('Kafka');
    expect(report.jobMatchScore).toBeGreaterThan(0);
  });
});
