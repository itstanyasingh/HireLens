import { describe, it, expect } from 'vitest';
import { validateExtractedResumeText } from '../src/services/textValidator';

describe('validateExtractedResumeText Quality Gate', () => {
  it('approves legitimate text-based resume content', () => {
    const validResume = `
      ALEX MORGAN
      Software Engineer | San Francisco, CA
      alex.morgan@example.com | (555) 342-9102 | linkedin.com/in/alexmorgan

      PROFESSIONAL SUMMARY
      Results-driven Software Engineer with 5+ years of experience in React, TypeScript, Node.js, and Python.
      Track record of designing scalable cloud applications and optimizing data pipelines.

      EXPERIENCE
      Senior Full-Stack Engineer — CloudTech Solutions (2021 - Present)
      • Architected distributed microservices utilizing Node.js and AWS, reducing API response times by 35%.
      • Spearheaded migration of legacy frontend to React and Tailwind CSS for 50,000 active daily users.
      • Implemented automated CI/CD deployment pipelines using GitHub Actions, decreasing build failures by 40%.

      EDUCATION
      Bachelor of Science in Computer Science — University of California, Berkeley (2017 - 2021)

      SKILLS
      Languages: Python, JavaScript, TypeScript, SQL, Java
      Frameworks: React, Express, Tailwind CSS, Jest
      Tools & Cloud: Docker, Kubernetes, AWS, Git, PostgreSQL
    `;

    const result = validateExtractedResumeText(validResume, 'Alex_Morgan_Resume.pdf');
    expect(result.isValid).toBe(true);
    expect(result.cleanText).toBeDefined();
    expect(result.cleanText?.length).toBeGreaterThan(100);
  });

  it('rejects binary PDF stream content containing /FlateDecode and /XObject', () => {
    const binaryPdfContent = `
      %PDF-1.4
      1 0 obj
      << /Type /Catalog /Pages 2 0 R >>
      endobj
      2 0 obj
      << /Type /Pages /Kids [3 0 R] /Count 1 >>
      endobj
      3 0 obj
      << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> /ProcSet [/PDF /Text] >> >>
      endobj
      4 0 obj
      << /Length 1240 /Filter /FlateDecode >>
      stream
      xœíXMoÛ8½ï¯àsº·!1†&QÄ-¶ÝÙÍ!l&Q@
      endstream
      endobj
      xref
      0 6
    `;

    const result = validateExtractedResumeText(binaryPdfContent, 'corrupted_sample.pdf');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBeDefined();
  });

  it('rejects corrupted font-subset glyph noise strings', () => {
    const glyphNoise = `
      M"0uRi.c7Sj1Eu_+J 5xJPZwbV86\\M a+m XCtU0hTU & ]\`V9b9q6 nl4}&qbbpxAj}5IZoq2 6v
      }UD}fX0|ys0cK, ?p4JATmyr347bQ?jZG;
      ^7#xk@2.L*9!vC=~+q
    `;

    const result = validateExtractedResumeText(glyphNoise, 'unmapped_font.pdf');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBeDefined();
  });

  it('rejects ultra-short or empty text uploads', () => {
    const emptyResult = validateExtractedResumeText('', 'empty.pdf');
    expect(emptyResult.isValid).toBe(false);

    const tooShortResult = validateExtractedResumeText('Hello test only', 'short.pdf');
    expect(tooShortResult.isValid).toBe(false);
  });
});
