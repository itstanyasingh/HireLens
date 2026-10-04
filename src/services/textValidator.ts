export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  isScanned?: boolean;
  cleanText?: string;
}

/**
 * Validates extracted resume text to ensure it is genuine, readable text
 * and NOT corrupted PDF binary stream data, base64, or scanned image noise.
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

  // 1. Minimum character length check
  if (text.length < 60) {
    return {
      isValid: false,
      errorMessage: "This appears to be a scanned or image-based PDF. Please upload a text-based PDF or DOCX file.",
      isScanned: true,
    };
  }

  // 2. Reject PDF stream / binary marker tokens
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
    'BT\n',
    'ET\n',
    '/ProcSet',
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
      errorMessage: "Unable to read this resume correctly. We couldn't extract readable text from this file. Please upload a text-based PDF or DOCX file.",
      isScanned: false,
    };
  }

  // 3. Token & word readability ratio check
  const tokens = text.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length < 15) {
    return {
      isValid: false,
      errorMessage: "This file contains insufficient text for analysis. Please upload a text-based PDF or DOCX file.",
      isScanned: true,
    };
  }

  let suspiciousTokenCount = 0;
  let validWordCount = 0;

  for (const token of tokens) {
    // Check for weird embedded punctuation typical of compressed binary stream garbage
    // e.g. M"0uRi.c7Sj1Eu_15xJPZ or }UD}fX0|ys0cK
    if (/[a-zA-Z0-9]+["'{}|\\_#$^[\]<>`~=]{1,}[a-zA-Z0-9]+/.test(token) || token.length > 35) {
      suspiciousTokenCount++;
    }

    // Standard word check (letters, numbers, basic punctuation)
    if (/^[a-zA-Z0-9.,;:!?()\-'/+#&@%$]+$/.test(token) && !/[{}\\^~`|]/.test(token)) {
      validWordCount++;
    }
  }

  const suspiciousRatio = suspiciousTokenCount / tokens.length;
  const validWordRatio = validWordCount / tokens.length;

  if (suspiciousRatio > 0.12 || validWordRatio < 0.65) {
    return {
      isValid: false,
      errorMessage: "Unable to read this resume correctly. We couldn't extract readable text from this file. Please upload a text-based PDF or DOCX file.",
      isScanned: true,
    };
  }

  // 4. Check for recognizable resume words
  const recognizableResumeTerms = [
    'experience', 'education', 'skills', 'projects', 'summary', 'work', 'university',
    'college', 'developer', 'engineer', 'manager', 'lead', 'team', 'technologies',
    'responsibilities', 'achievements', 'certifications', 'email', 'phone', 'contact',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
    'october', 'november', 'december', 'present', '2018', '2019', '2020', '2021', '2022',
    '2023', '2024', '2025', '2026', 'gpa', 'bachelor', 'master', 'proficient', 'built',
    'developed', 'managed', 'created', 'designed', 'maintained', 'analyzed', 'implemented',
    'software', 'product', 'design', 'business', 'data', 'analyst', 'intern', 'specialist',
    'github', 'linkedin', 'com', 'org', 'edu', 'net', 'io'
  ];

  const lowerText = text.toLowerCase();
  const matchedTerms = recognizableResumeTerms.filter((term) => lowerText.includes(term));

  if (matchedTerms.length < 3) {
    return {
      isValid: false,
      errorMessage: "No standard resume sections or recognizable terminology could be identified. Please ensure you uploaded a valid resume document.",
      isScanned: false,
    };
  }

  // Development Logging
  if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
    console.log(`[HireLens Pipeline] FILE: ${fileName} | LENGTH: ${text.length} chars | TOKENS: ${tokens.length} | VALID: true | PREVIEW: "${text.substring(0, 150).replace(/\n/g, ' ')}..."`);
  }

  return {
    isValid: true,
    cleanText: text,
  };
}
