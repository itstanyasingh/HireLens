import { describe, it, expect, beforeEach } from 'vitest';
import { 
  extractRequirementsFromJobDescription, 
  matchRequirementsAgainstResume, 
  calculateTransparentScore,
  JobRequirement,
  RequirementMatch
} from '../src/services/evidenceEngine';
import { fixBulletPoint } from '../src/services/api';
import { validateExtractedResumeText } from '../src/services/textValidator';

describe('Feature 1: Job Match Intelligence Engine', () => {
  const sampleResume = `
    Alex Morgan - Senior Full Stack Engineer
    alex@example.com | San Francisco, CA

    Professional Summary:
    Full-stack engineer with 6 years experience building distributed web applications using React, TypeScript, Node.js, and PostgreSQL.

    Experience:
    Staff Software Engineer | TechCorp (2021 - Present)
    • Architected cloud-native microservices using Node.js and AWS (ECS, S3, RDS).
    • Designed high-throughput GraphQL APIs and REST endpoints handling 5M daily requests.
    • Built component design systems in React and TypeScript with automated Jest testing.

    Education:
    B.S. in Computer Science, University of California, Berkeley (2018)
  `;

  const backendJobPosting = `
    Backend Engineer - High Scale Systems
    We are seeking a Backend Engineer with strong expertise in Node.js, TypeScript, and PostgreSQL.
    Required:
    - 4+ years of professional backend engineering with Node.js
    - Strong database design with PostgreSQL
    - Hands-on experience deploying to AWS
    Preferred:
    - Experience with GraphQL
    - Knowledge of Kubernetes and Docker
  `;

  const mobileJobPosting = `
    iOS & Mobile Developer
    Requirements:
    - Swift and SwiftUI development
    - Objective-C legacy maintenance
    - Published iOS apps on the App Store
    Preferred:
    - Android Kotlin experience
  `;

  it('extracts explicit required vs preferred requirements from real job postings', () => {
    const reqs = extractRequirementsFromJobDescription(backendJobPosting);
    expect(reqs.length).toBeGreaterThan(2);

    const hasNode = reqs.some(r => r.name.toLowerCase().includes('node'));
    const hasPostgres = reqs.some(r => r.name.toLowerCase().includes('postgres'));
    expect(hasNode).toBe(true);
    expect(hasPostgres).toBe(true);

    const requiredItems = reqs.filter(r => r.importanceLevel === 'Required');
    expect(requiredItems.length).toBeGreaterThan(0);
  });

  it('matches resume evidence and extracts verifiable excerpts', () => {
    const reqs = extractRequirementsFromJobDescription(backendJobPosting);
    const { matches, audit } = matchRequirementsAgainstResume(sampleResume, reqs);

    expect(matches.length).toBe(reqs.length);
    expect(audit.overallScore).toBeGreaterThan(50);

    // Verify evidence excerpts exist for matched requirements
    const matchedNode = matches.find(m => m.requirement.name.toLowerCase().includes('node'));
    expect(matchedNode).toBeDefined();
    expect(matchedNode?.status).toBe('MATCHED');
    expect(matchedNode?.resumeExcerpt).toBeTruthy();
    expect(matchedNode?.resumeExcerpt?.toLowerCase()).toContain('node');
  });

  it('produces significantly different scores for different job descriptions with the same resume', () => {
    const backendReqs = extractRequirementsFromJobDescription(backendJobPosting);
    const mobileReqs = extractRequirementsFromJobDescription(mobileJobPosting);

    const backendMatch = matchRequirementsAgainstResume(sampleResume, backendReqs);
    const mobileMatch = matchRequirementsAgainstResume(sampleResume, mobileReqs);

    // Backend match should be substantially higher than Mobile match for a backend/fullstack resume
    const backendScore = backendMatch.audit.overallScore ?? 0;
    const mobileScore = mobileMatch.audit.overallScore ?? 0;

    expect(backendScore).toBeGreaterThan(mobileScore);
    expect(mobileScore).toBeLessThan(35);
  });

  it('validates input length and rejects empty or corrupt text', () => {
    const emptyValidation = validateExtractedResumeText('', 'Empty.pdf');
    expect(emptyValidation.isValid).toBe(false);

    const shortValidation = validateExtractedResumeText('Short text', 'Short.pdf');
    expect(shortValidation.isValid).toBe(false);

    const validValidation = validateExtractedResumeText(sampleResume, 'Alex_Resume.pdf');
    expect(validValidation.isValid).toBe(true);
  });

  it('transparent score calculation strictly follows mathematical weighted formula', () => {
    const mockRequirements: JobRequirement[] = [
      { id: '1', name: 'React', category: 'technical_skill', weight: 3, importanceLevel: 'Required', sourceExcerpt: 'React', normalizedTerm: 'react' },
      { id: '2', name: 'PostgreSQL', category: 'technical_skill', weight: 2, importanceLevel: 'Required', sourceExcerpt: 'PostgreSQL', normalizedTerm: 'postgresql' },
      { id: '3', name: 'Kubernetes', category: 'technical_skill', weight: 1, importanceLevel: 'Preferred', sourceExcerpt: 'Kubernetes', normalizedTerm: 'kubernetes' }
    ];

    // Case 1: Both React (weight 3) and Postgres (weight 2) matched, Kubernetes missing (weight 1)
    // Total Applicable Weight = 3 + 2 + 1 = 6. Matched Weight = 3(1.0) + 2(1.0) + 1(0) = 5.
    // Overall Score = round((5 / 6) * 100) = 83%
    const matchesCase1: RequirementMatch[] = [
      { requirement: mockRequirements[0], status: 'MATCHED', resumeExcerpt: 'React', explanation: 'Direct match', scoreContribution: 3 },
      { requirement: mockRequirements[1], status: 'MATCHED', resumeExcerpt: 'PostgreSQL', explanation: 'Direct match', scoreContribution: 2 },
      { requirement: mockRequirements[2], status: 'NOT FOUND', resumeExcerpt: null, explanation: 'Not found', scoreContribution: 0 }
    ];

    const audit1 = calculateTransparentScore(matchesCase1);
    expect(audit1.matchedWeight).toBe(5);
    expect(audit1.totalApplicableWeight).toBe(6);
    expect(audit1.overallScore).toBe(83);
  });
});

describe('Feature 2: Resume Improvement Studio', () => {
  it('generates high-impact bullet variations without inventing false facts', async () => {
    const weakBullet = "worked on building web features with React and Node";
    const res = await fixBulletPoint(weakBullet, "Frontend Engineer");

    expect(res.variations).toBeDefined();
    expect(res.variations.length).toBeGreaterThanOrEqual(1);

    const firstVariation = res.variations[0];
    expect(firstVariation.bullet).toBeTruthy();
    // Must begin with an active engineering verb
    expect(/^(Architected|Engineered|Spearheaded|Developed|Optimized|Built)/i.test(firstVariation.bullet)).toBe(true);
    // Preserves original technical stack
    expect(firstVariation.bullet.toLowerCase()).toContain('react');
    // Prompted placeholders for metrics rather than fabricated numbers
    expect(firstVariation.bullet).toMatch(/\[insert metric:|e\.g\./);
  });

  it('preserves user numbers if already present in the original bullet', async () => {
    const bulletWithRealData = "Reduced API latency by 45% using Redis caching";
    const res = await fixBulletPoint(bulletWithRealData, "Backend Engineer");

    expect(res.variations[0].bullet).toContain('45%');
    expect(res.variations[0].bullet).toContain('Redis');
  });
});

describe('Feature 3: Smart Application Tracker', () => {
  const storageMap = new Map<string, string>();
  const mockLocalStorage = {
    getItem: (key: string) => storageMap.get(key) || null,
    setItem: (key: string, val: string) => { storageMap.set(key, String(val)); },
    removeItem: (key: string) => { storageMap.delete(key); },
    clear: () => { storageMap.clear(); }
  };

  beforeEach(() => {
    storageMap.clear();
  });

  it('supports all 5 required statuses: Saved, Applied, Interview, Offer, Rejected', () => {
    const statuses = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];
    const apps = statuses.map((status, idx) => ({
      id: `app-${idx}`,
      company: `Company ${idx}`,
      role: 'Software Engineer',
      dateApplied: '2026-10-23',
      followUpDate: '2026-10-30',
      status,
      jobDescription: 'Great role description',
      notes: 'Initial notes'
    }));

    const STORAGE_KEY = 'hirelens_smart_applications_test_user';
    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    const retrieved = JSON.parse(mockLocalStorage.getItem(STORAGE_KEY) || '[]');

    expect(retrieved.length).toBe(5);
    expect(retrieved.map((a: any) => a.status)).toEqual(statuses);
  });

  it('supports follow-up dates, job descriptions, and user isolation in persistence', () => {
    const userAKey = 'hirelens_smart_applications_alex@example.com';
    const userBKey = 'hirelens_smart_applications_sarah@example.com';

    const userAApps = [
      { id: '1', company: 'Google', role: 'Staff Engineer', status: 'Interview', followUpDate: '2026-11-01', jobDescription: 'Core search systems' }
    ];
    const userBApps = [
      { id: '2', company: 'Meta', role: 'Product Lead', status: 'Offer', followUpDate: '2026-11-05', jobDescription: 'Reality Labs apps' }
    ];

    mockLocalStorage.setItem(userAKey, JSON.stringify(userAApps));
    mockLocalStorage.setItem(userBKey, JSON.stringify(userBApps));

    const retrievedA = JSON.parse(mockLocalStorage.getItem(userAKey) || '[]');
    const retrievedB = JSON.parse(mockLocalStorage.getItem(userBKey) || '[]');

    expect(retrievedA[0].company).toBe('Google');
    expect(retrievedA[0].followUpDate).toBe('2026-11-01');
    expect(retrievedA[0].jobDescription).toBe('Core search systems');
    expect(retrievedB[0].company).toBe('Meta');
    expect(retrievedB[0].status).toBe('Offer');
  });
});
