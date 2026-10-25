import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { extractTextFromFile } from '../../services/pdfExtractor';
import { ResumeData } from '../../types/resumeBuilder';

interface ImportResumeModalProps {
  onClose: () => void;
  onImportComplete: (extractedText: string) => void;
}

export const ImportResumeModal: React.FC<ImportResumeModalProps> = ({
  onClose,
  onImportComplete
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 20) {
        throw new Error('Unable to extract readable text from this document. Please upload a text-based PDF, DOCX, or TXT resume.');
      }
      setPreviewText(text);
      setFileName(file.name);
    } catch (err: any) {
      setError(err?.message || 'Failed to parse resume document.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyImport = () => {
    if (previewText) {
      onImportComplete(previewText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E3ECE7] relative">
        
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-8 h-8 rounded-full bg-[#EAF0EC] hover:bg-[#DCE7E2] flex items-center justify-center text-[#55625F] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-2 text-center">
          <span className="text-[11px] font-bold text-[#16B889] uppercase tracking-widest font-mono">
            RESUME PARSER & IMPORT
          </span>
          <h2 className="text-2xl font-black text-[#192622]">Import Existing Resume</h2>
          <p className="text-xs text-[#55625F]">
            Upload your current PDF, DOCX, or TXT resume. We extract your experience and text securely without overwriting until you confirm.
          </p>
        </div>

        {!previewText ? (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D9E3DF] hover:border-[#16B889] rounded-2xl p-8 text-center bg-[#F9FBFA] hover:bg-[#F4FAF7] cursor-pointer transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#EAF8F3] text-[#16B889] flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#273330]">
                  {loading ? 'Extracting text & formatting...' : 'Click to upload or drag & drop'}
                </div>
                <div className="text-[11px] text-[#7A8A85]">PDF, DOCX, or TXT (up to 10MB)</div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#F2FBF7] rounded-xl border border-[#CCEFE1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16B889]" />
                <span className="text-xs font-bold text-[#192622]">Successfully Parsed: {fileName}</span>
              </div>
              <button
                onClick={() => setPreviewText(null)}
                className="text-xs text-[#16B889] font-bold hover:underline cursor-pointer"
              >
                Upload Different File
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#55625F] block">Extracted Text Preview (First 500 chars):</label>
              <textarea
                readOnly
                rows={6}
                value={previewText}
                className="w-full text-xs font-mono bg-[#F9FBFA] border border-[#D9E3DF] rounded-xl p-3 text-[#273330]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F0F5F2] hover:bg-[#E4EFEA] text-[#55625F] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyImport}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#16B889] hover:bg-[#139E75] text-white shadow-md cursor-pointer transition-all"
              >
                <span>Apply to Studio & Templates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
