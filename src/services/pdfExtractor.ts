import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure pdfjs worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

/**
 * Extracts raw text from an uploaded File (PDF, DOCX, or TXT)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  try {
    if (ext === 'txt') {
      return await file.text();
    }

    if (ext === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value?.trim() || '';
    }

    if (ext === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      return await extractTextFromPdfBuffer(arrayBuffer);
    }

    // Default text fallback
    return await file.text();
  } catch (err) {
    console.warn(`Primary extraction failed for ${file.name}, using stream parser fallback:`, err);
    return await fallbackStreamExtractor(file);
  }
}

/**
 * PDF parser using pdfjs-dist
 */
async function extractTextFromPdfBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
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
        if ('str' in item) {
          // Add newline if vertical position changes significantly
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          pageText += item.str;
          lastY = item.transform[5];
        }
      }

      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (pdfErr) {
    console.warn('PDF.js parsing failed, attempting raw stream decoder:', pdfErr);
    return decodeRawPdfStream(arrayBuffer);
  }
}

/**
 * Fallback binary text stream cleaner for PDFs
 */
function decodeRawPdfStream(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let text = '';
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    // Printable ASCII characters and standard newlines
    if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
      text += String.fromCharCode(byte);
    }
  }

  // Extract blocks between parentheses in stream operators ( Tj / TJ )
  const matches = text.match(/\(([^()]{2,100})\)/g);
  if (matches && matches.length > 10) {
    return matches.map(m => m.slice(1, -1)).join(' ');
  }

  // Fallback to filtered printable string
  return text.replace(/stream[\s\S]*?endstream/g, ' ')
             .replace(/<[0-9a-fA-F]+>/g, ' ')
             .replace(/\s+/g, ' ')
             .trim();
}

/**
 * Fallback stream reader
 */
async function fallbackStreamExtractor(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return decodeRawPdfStream(buffer);
}
