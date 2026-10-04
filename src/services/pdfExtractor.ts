import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import { validateExtractedResumeText } from './textValidator';

// Configure bundled pdf.js worker
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  } catch (e) {
    console.warn('Could not set pdf.js local worker URL:', e);
  }
}

/**
 * Extracts clean, human-readable text from an uploaded File (PDF, DOCX, or TXT).
 * If PDF contains custom unmapped font encodings or is a scanned image,
 * automatically falls back to in-browser Canvas OCR.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (ext === 'txt') {
    return await file.text();
  }

  if (ext === 'docx') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const rawDocx = result.value?.trim() || '';
      const validation = validateExtractedResumeText(rawDocx, file.name);
      if (!validation.isValid) {
        throw new Error(validation.errorMessage || 'Failed to extract readable text from DOCX document.');
      }
      return rawDocx;
    } catch (docxErr: any) {
      console.error('Mammoth DOCX parsing failed:', docxErr);
      throw new Error(docxErr?.message || 'Failed to read DOCX document.');
    }
  }

  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    return await extractTextFromPdfWithFallback(arrayBuffer, file.name);
  }

  // Fallback text attempt
  return await file.text();
}

/**
 * Multi-stage PDF Text Extraction:
 * Stage 1: Native PDF.js with complete CMap tables and font loaders.
 * Stage 2: Quality validation check.
 * Stage 3: Automatic Canvas rendering + Tesseract.js OCR if font glyphs were unmapped.
 */
async function extractTextFromPdfWithFallback(arrayBuffer: ArrayBuffer, fileName: string): Promise<string> {
  let primaryText = '';
  let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;
  const version = pdfjsLib.version || '6.4.299';

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      cMapUrl: `https://unpkg.com/pdfjs-dist@${version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${version}/standard_fonts/`,
      useSystemFonts: true,
      disableFontFace: false,
    });

    pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items as any[]) {
        if ('str' in item && typeof item.str === 'string') {
          const str = item.str;
          if (str.trim().length === 0) continue;

          // Newline on vertical jump
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }

          pageText += str;
          lastY = item.transform[5];
        }
      }

      fullText += pageText.trim() + '\n\n';
    }

    primaryText = fullText.trim();
  } catch (pdfErr) {
    console.warn('PDF.js native text extraction encountered an issue, attempting OCR fallback:', pdfErr);
  }

  // Validate primary extraction
  const validation = validateExtractedResumeText(primaryText, fileName);
  if (validation.isValid) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PDF EXTRACTION] Method: PDF.js CMap native | Length: ${primaryText.length} chars | Preview: "${primaryText.substring(0, 120)}..."`);
    }
    return primaryText;
  }

  console.warn(`[PDF EXTRACTION] Primary extraction produced unmapped glyphs or empty text. Triggering OCR fallback for "${fileName}"...`);

  // Stage 3: Canvas Rendering + Tesseract OCR Fallback
  if (pdfDoc) {
    try {
      const ocrText = await performCanvasOcr(pdfDoc);
      const ocrValidation = validateExtractedResumeText(ocrText, fileName);

      if (ocrValidation.isValid) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[PDF EXTRACTION] Method: Canvas OCR Fallback | Length: ${ocrText.length} chars | Preview: "${ocrText.substring(0, 120)}..."`);
        }
        return ocrText;
      }
    } catch (ocrErr) {
      console.error('OCR fallback processing failed:', ocrErr);
    }
  }

  // If both native extraction and OCR fail to yield readable text, halt and throw clean error
  throw new Error("Unable to read this resume correctly. We couldn't extract readable text from this PDF. Please upload a text-based PDF or DOCX file.");
}

/**
 * Renders PDF pages to off-screen HTML5 Canvas and runs Tesseract OCR
 */
async function performCanvasOcr(pdfDoc: pdfjsLib.PDFDocumentProxy): Promise<string> {
  const maxPages = Math.min(3, pdfDoc.numPages);
  let combinedOcrText = '';

  const worker = await createWorker('eng');

  try {
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for crisp OCR

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) continue;

      await page.render({
        canvasContext: ctx as any,
        viewport,
        canvas: canvas as any,
      } as any).promise;

      const { data: { text } } = await worker.recognize(canvas);
      combinedOcrText += text + '\n\n';
    }
  } finally {
    await worker.terminate();
  }

  return combinedOcrText.trim();
}
