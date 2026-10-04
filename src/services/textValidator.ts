export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  isScanned?: boolean;
  cleanText?: string;
}

// Common dictionary & resume vocabulary tokens for quick English text validation
const COMMON_ENGLISH_WORDS = new Set([
  'the', 'and', 'with', 'for', 'experience', 'education', 'skills', 'projects',
  'summary', 'developer', 'engineer', 'development', 'software', 'management',
  'design', 'built', 'created', 'worked', 'team', 'using', 'application', 'data',
  'system', 'technical', 'university', 'college', 'degree', 'bachelor', 'master',
  'science', 'technology', 'work', 'history', 'professional', 'responsibilities',
  'implemented', 'maintained', 'assisted', 'managed', 'developed', 'lead', 'leading',
  'api', 'database', 'web', 'services', 'cloud', 'python', 'javascript', 'react',
  'node', 'sql', 'java', 'git', 'agile', 'scrum', 'performance', 'code', 'user',
  'users', 'client', 'clients', 'company', 'solutions', 'january', 'february', 'march',
  'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
  'present', 'gpa', 'email', 'phone', 'contact', 'location', 'city', 'state', 'profile',
  'across', 'through', 'optimizing', 'scalable', 'automated', 'pipeline', 'infrastructure',
  'collaboration', 'business', 'product', 'frontend', 'backend', 'fullstack', 'stack',
  'framework', 'testing', 'unit', 'integration', 'deployment', 'docker', 'aws', 'linux'
]);

/**
 * Validates extracted resume text to ensure it is authentic, readable human text
 * and NOT unmapped font glyphs, PDF stream binary, or corrupted OCR noise.
 */
export function validateExtractedResumeText(rawText: string, fileName: string = 'Resume.pdf'): ValidationResult {
  if (!rawText || typeof rawText !== 'string') {
    return {
      isValid: false,
      errorMessage: "Unable to read this resume correctly. We couldn't extract readable text from this file. Please upload a text-based PDF or DOCX file.",
      isScanned: true,
    };
  }

  const text = rawText.trim();

  // 1. Length check
  if (text.length < 50) {
    return {
      isValid: false,
      errorMessage: "This file contains insufficient text for a resume analysis. Please upload a text-based PDF or DOCX file.",
      isScanned: true,
    };
  }

  // 2. Reject internal PDF stream / binary marker tokens
  const pdfBinaryKeywords = [
    '/FlateDecode',
    '/XObject',
    '/Length',
    '/Filter',
    '/Type /Page',
    '/MediaBox',
    '/Font',
    '/Catalog',
    'stream\r\n',
    'stream\n',
    'endstream',
    'endobj',
    'xref\n',
    'trailer',
    'startxref',
  ];

  let binaryKeywordCount = 0;
  for (const kw of pdfBinaryKeywords) {
    if (text.includes(kw)) {
      binaryKeywordCount++;
    }
  }

  if (binaryKeywordCount >= 2) {
    return {
      isValid: false,
      errorMessage: "Corrupted PDF data stream detected. Please upload a standard text-based PDF or DOCX file.",
      isScanned: false,
    };
  }

  // 3. Tokenize and evaluate word validity & glyph corruption
  const rawTokens = text.split(/\s+/).filter((t) => t.length > 0);
  if (rawTokens.length < 15) {
    return {
      isValid: false,
      errorMessage: "Insufficient word tokens found in document.",
      isScanned: true,
    };
  }

  let corruptedTokenCount = 0;
  let recognizedCommonWordCount = 0;
  let validWordLikeCount = 0;

  for (const token of rawTokens) {
    const cleanToken = token.replace(/^[^\w]+|[^\w]+$/g, '').toLowerCase();

    // Check if token has intra-word symbol garbage (typical of unmapped font subsets)
    // e.g. M"0uRi.c7Sj1Eu or 5xJPZwbV86\M or }UD}fX0|ys0cK
    if (/[a-zA-Z0-9]+["'{}|\\_#$^[\]<>`~=]{1,}[a-zA-Z0-9]+/.test(token)) {
      corruptedTokenCount++;
      continue;
    }

    // Check if token is excessively long random string
    if (token.length > 28 && !token.startsWith('http') && !token.includes('@')) {
      corruptedTokenCount++;
      continue;
    }

    if (COMMON_ENGLISH_WORDS.has(cleanToken)) {
      recognizedCommonWordCount++;
      validWordLikeCount++;
    } else if (/^[a-zA-Z0-9+\-#.]+$/.test(cleanToken) && cleanToken.length >= 2) {
      // General valid word/number
      validWordLikeCount++;
    }
  }

  const totalTokens = rawTokens.length;
  const corruptedRatio = corruptedTokenCount / totalTokens;
  const commonWordRatio = recognizedCommonWordCount / totalTokens;
  const validWordRatio = validWordLikeCount / totalTokens;

  // If more than 8% of tokens are corrupted glyph strings, or less than 50% are valid word-like tokens
  if (corruptedRatio > 0.08 || validWordRatio < 0.50 || recognizedCommonWordCount < 3) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[VALIDATION REJECTED] File: ${fileName} | Corrupted ratio: ${(corruptedRatio * 100).toFixed(1)}% | Common words: ${recognizedCommonWordCount} | Valid words: ${(validWordRatio * 100).toFixed(1)}%`);
    }
    return {
      isValid: false,
      errorMessage: "Unable to read this resume correctly. The document appears to have non-standard font encoding or unreadable text. Please upload a text-based PDF or DOCX file.",
      isScanned: true,
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[VALIDATION PASSED] File: ${fileName} | Tokens: ${totalTokens} | Common words found: ${recognizedCommonWordCount} (${(commonWordRatio * 100).toFixed(1)}%)`);
  }

  return {
    isValid: true,
    cleanText: text,
  };
}
