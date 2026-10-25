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

    // Verify mathematical formula: Overall = (ATS * 0.25) + (Content * 0.25) + (Skills * 0.25) + (Recruiter * 0.25)
    const expectedOverall = Math.round(
      report.atsScore * 0.25 +
      report.contentScore * 0.25 +
      report.skillsScore * 0.25 +
      report.recruiterScore * 0.25
    );
    expect(report.overallScore).toBe(expectedOverall);
  });

  it('produces significantly different, input-dependent scores for strong vs weak vs incomplete resumes', () => {
    const strongResume = sampleCandidate;
    const weakResume = `
      John Doe
      New York, NY | john.doe@email.com | (555) 123-4567

      EXPERIENCE
      Company ABC — Junior Developer
      • Worked on a website using React.
      • Helped with bug fixes and meetings.
      • Responsible for database tasks.

      EDUCATION
      State University — B.S. Computer Science
    `;
    const incompleteDraft = `
      Alex Smith
      Junior Web Developer Candidate
      New York, NY

      WORK EXPERIENCE
      • Worked on web apps using JavaScript and HTML.
      • Helped team with daily bug fixes and maintenance.

      EDUCATION
      State College — Associate Degree in Computer Science
    `;

    const strongReport = analyzeResumeContent(strongResume, 'Strong.pdf');
    const weakReport = analyzeResumeContent(weakResume, 'Weak.pdf');
    const incompleteReport = analyzeResumeContent(incompleteDraft, 'Incomplete.docx');

    // Strong resume must score higher than weak resume, which must score higher than incomplete draft
    expect(strongReport.overallScore).toBeGreaterThan(weakReport.overallScore);
    expect(weakReport.overallScore).toBeGreaterThan(incompleteReport.overallScore);

    // Incomplete draft must receive low scores reflecting missing contact info, skills, and metrics
    expect(incompleteReport.overallScore).toBeLessThan(45);
    expect(incompleteReport.categories.skills.score).toBeLessThan(30);

    // Strong resume must score high on content and skills
    expect(strongReport.overallScore).toBeGreaterThan(75);
    expect(strongReport.categories.skills.detectedSkills.length).toBeGreaterThan(10);
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

  it('never outputs fake external jobs or fabricated percentages when no job description is provided', () => {
    const report = analyzeResumeContent(sampleCandidate, 'Sarah_Chen_Resume.pdf');

    // Without a user-supplied target JD, jobMatches and skillGaps must not contain invented companies or fake salaries
    expect(report.jobMatches).toEqual([]);
    expect(report.skillGaps).toEqual([]);
    expect(report.jobMatchScore).toBe(0);

    // Action plan informs user to supply a target JD
    const hasJdAction = report.actionPlan.some(a => a.title.toLowerCase().includes('target job description'));
    expect(hasJdAction).toBe(true);
  });

  it('strictly maps skill gaps to target job requirements without fabricated market occurrence statistics', () => {
    const jobDescription = `
      Required: Python, Redis, Kafka, Cassandra, Kubernetes.
    `;
    const report = analyzeResumeContent(sampleCandidate, 'Sarah_Chen_Resume.pdf', jobDescription);

    expect(report.jobMatches.length).toBe(1);
    expect(report.jobMatches[0].title).toBeDefined();
    expect(report.skillGaps.length).toBeGreaterThanOrEqual(1);

    for (const gap of report.skillGaps) {
      // Must NOT contain fabricated statistics like "68% of matching roles"
      expect(gap.roleOccurrence).not.toMatch(/\d+%/);
      expect(gap.roleOccurrence.toLowerCase()).toContain('target job description');
    }
  });
});
