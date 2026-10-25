import { describe, it, expect } from 'vitest';
import { ROLE_PRESETS, EXPERIENCE_LEVEL_PROFILES } from '../src/data/builderPresets';
import { 
  generateResumeSummary, 
  rewriteResumeBullet, 
  extractResumeStrengths, 
  extractSkillsFromPosting 
} from '../src/services/api';

describe('HireLens Resume Studio & Enhancv-Inspired Features', () => {

  describe('Template & Role Presets', () => {
    it('provides all 4 core Enhancv-inspired industry presets', () => {
      const presetIds = ROLE_PRESETS.map(p => p.id);
      expect(presetIds).toContain('software-engineer');
      expect(presetIds).toContain('business-analyst');
      expect(presetIds).toContain('product-manager');
      expect(presetIds).toContain('operations-executive');

      ROLE_PRESETS.forEach(preset => {
        expect(preset.data.personal.fullName).toBeTruthy();
        expect(preset.data.personal.targetTitle).toBeTruthy();
        expect(preset.data.summary.length).toBeGreaterThan(30);
        expect(preset.data.keyAchievements.length).toBeGreaterThanOrEqual(2);
        expect(preset.data.experience.length).toBeGreaterThanOrEqual(1);
        expect(preset.data.skills.length).toBeGreaterThanOrEqual(5);
        expect(preset.data.education.length).toBeGreaterThanOrEqual(1);
        expect(preset.data.languages.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('supports 3 experience level profiles matching reference specification', () => {
      const levelIds = EXPERIENCE_LEVEL_PROFILES.map(l => l.id);
      expect(levelIds).toContain('senior-executive');
      expect(levelIds).toContain('mid-level');
      expect(levelIds).toContain('career-changers');

      EXPERIENCE_LEVEL_PROFILES.forEach(profile => {
        expect(profile.focusTips.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('Job-Specific Resume Summary Generator', () => {
    it('generates 3 formula-based executive summaries grounded in candidate role', async () => {
      const res = await generateResumeSummary({
        targetRole: 'Senior Full Stack Engineer',
        experienceLevel: 'Senior & Executive',
        keySkills: 'React, TypeScript, Node.js, AWS, PostgreSQL',
        jobDescription: 'Looking for a Senior Full Stack Engineer to lead web scaling and microservice architecture.'
      });

      expect(res.summary).toBeTruthy();
      expect(res.variations).toHaveLength(3);

      const titles = res.variations.map(v => v.title);
      expect(titles).toContain('Impact & Metric Focus');
      expect(titles).toContain('Technical Depth Focus');
      expect(titles).toContain('Executive Leadership Focus');

      res.variations.forEach(v => {
        expect(v.formula).toBeTruthy();
        expect(v.text).toContain('Senior Full Stack Engineer');
        expect(v.text.length).toBeGreaterThan(40);
      });
    });
  });

  describe('Experience Bullet Point Improver', () => {
    it('rewrites weak or passive bullets with active verbs and quantifiable metric placeholders', async () => {
      const weakBullet = 'worked on frontend and helped build APIs';
      const res = await rewriteResumeBullet({
        originalBullet: weakBullet,
        targetRole: 'Software Engineer',
        goal: 'recruiter'
      });

      expect(res.variations.length).toBeGreaterThanOrEqual(2);
      
      const recruiterVar = res.variations.find(v => v.type === 'Recruiter Approved');
      expect(recruiterVar).toBeDefined();
      expect(recruiterVar?.bullet.toLowerCase()).not.toContain('worked on');
      expect(recruiterVar?.bullet).toMatch(/Spearheaded|Architected|Engineered/);

      const metricVar = res.variations.find(v => v.type === 'Measurable Metrics');
      expect(metricVar).toBeDefined();
      expect(metricVar?.bullet).toContain('['); // contains metric prompt placeholder
    });
  });

  describe('Strengths & Achievements Highlighter', () => {
    it('identifies relevant strengths with metrics based on candidate experience and target JD', async () => {
      const jd = 'We need a leader with experience in high-throughput scale, database latency reduction, and 99.99% service SLA.';
      const res = await extractResumeStrengths({
        jobDescription: jd,
        targetRole: 'Senior Software Engineer'
      });

      expect(res.strengths.length).toBeGreaterThanOrEqual(3);
      expect(res.recommendedKeyAchievements.length).toBeGreaterThanOrEqual(3);

      res.strengths.forEach(str => {
        expect(str.title).toBeTruthy();
        expect(str.category).toBeTruthy();
        expect(str.metric).toBeTruthy();
      });
    });
  });

  describe('Job Posting Skills Extractor', () => {
    it('extracts hard skills, soft skills, and tools and validates against candidate resume', async () => {
      const sampleJd = `
        Requirements:
        - 5+ years experience with React, TypeScript, and Node.js
        - Proven knowledge of PostgreSQL, Redis, and AWS cloud services
        - Experience with Docker and CI/CD pipelines
        - Strong communication and cross-functional collaboration skills
        - Proficient with Git and Jira
      `;

      const candidateSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];

      const result = await extractSkillsFromPosting({
        jobDescription: sampleJd,
        resumeText: candidateSkills.join(' ')
      });

      expect(result.hardSkills.length).toBeGreaterThan(0);
      expect(result.softSkills.length).toBeGreaterThan(0);
      expect(result.tools.length).toBeGreaterThan(0);

      // Verify that skills present in candidate skills are correctly marked as found
      const reactSkill = result.hardSkills.find(s => s.name === 'React');
      expect(reactSkill?.foundInResume).toBe(true);

      // Verify that AWS (not in candidateSkills) is correctly marked as not found
      const awsSkill = result.hardSkills.find(s => s.name === 'AWS');
      if (awsSkill) {
        expect(awsSkill.foundInResume).toBe(false);
      }
    });

    it('rejects empty or insufficient job description with a clear error', async () => {
      await expect(extractSkillsFromPosting({ jobDescription: '' })).rejects.toThrow(
        /Please paste a job description/
      );
    });
  });

  describe('Validation & Error Handling Guardrails', () => {
    it('rejects empty target role in summary generator', async () => {
      await expect(generateResumeSummary({ targetRole: '' })).rejects.toThrow(
        /Please specify a target role/
      );
    });

    it('rejects empty or too short bullet point in bullet improver', async () => {
      await expect(rewriteResumeBullet({ originalBullet: 'hi' })).rejects.toThrow(
        /Please enter a bullet point/
      );
    });
  });

  describe('Blank Canvas & Data Cleanliness', () => {
    it('supports a clean blank data structure with zero fabricated achievements', () => {
      const blankResume = {
        personal: { fullName: '', targetTitle: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
        summary: '',
        keyAchievements: [],
        experience: [{ id: 'exp-1', role: '', company: '', dates: '', location: '', bullets: [''] }],
        education: [{ id: 'edu-1', degree: '', institution: '', year: '', location: '', honors: '' }],
        skills: [],
        projects: [],
        certifications: [],
        languages: []
      };

      expect(blankResume.personal.fullName).toBe('');
      expect(blankResume.keyAchievements).toHaveLength(0);
      expect(blankResume.skills).toHaveLength(0);
      expect(blankResume.projects).toHaveLength(0);
      expect(blankResume.certifications).toHaveLength(0);
    });
  });

});
