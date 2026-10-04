import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure pdfjs worker using standard bundle reference or cdnjs fallback
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('Could not set pdf.js worker URL:', e);
  }
}

/**
 * Extracts clean, human-readable text from an uploaded File (PDF, DOCX, or TXT).
 * NEVER returns raw binary streams or compressed PDF data.
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
      return result.value?.trim() || '';
    } catch (docxErr) {
      console.error('Mammoth DOCX parsing failed:', docxErr);
      throw new Error('Failed to read DOCX document. Please verify the file is not corrupted.');
    }
  }

  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    return await extractTextFromPdf(arrayBuffer);
  }

  // Default text attempt
  return await file.text();
}

/**
 * PDF text parser using Mozilla pdf.js
 */
async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdfDoc = await loadingTask.promise;
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

          // If Y-position shifted noticeably, start a newline
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

    return fullText.trim();
  } catch (pdfErr) {
    console.error('PDF.js text extraction error:', pdfErr);
    throw new Error('Unable to extract text from PDF document.');
  }
}
