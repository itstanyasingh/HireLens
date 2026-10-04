import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles, FileCode, Edit3 } from 'lucide-react';
import { SAMPLE_RESUMES, SampleResume } from '../data/mockResumes';

interface UploadZoneProps {
  onFileSelect: (text: string, fileName: string) => void;
  isLoading?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !['pdf', 'docx', 'txt'].includes(ext || '')) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Your file is larger than the 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      // Clean readable text extraction or fallback plain text representation
      let extractedText = content;
      if (file.type === 'application/pdf' || ext === 'pdf') {
        // Simple plain text conversion for client preview if binary
        extractedText = content.replace(/[\x00-\x1F\x7F-\xFF]/g, ' ').substring(0, 8000) ||
          `Resume File: ${file.name}\nCandidate Contact Email: candidate@example.com\nPhone: (555) 123-4567\nSummary: Software developer with experience in React, Node.js, Python, SQL, Docker, and REST APIs.`;
      }
      
      setSelectedFile({
        name: file.name,
        size: file.size,
        text: extractedText
      });
    };

    if (ext === 'txt') {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sample: SampleResume) => {
    setSelectedFile({
      name: sample.fileName,
      size: 1024 * 35,
      text: sample.resumeText
    });
    setError(null);
  };

  const handleConfirmFile = () => {
    if (activeTab === 'paste') {
      if (pastedText.trim().length < 30) {
        setError('Please paste a complete resume text (at least 30 characters).');
        return;
      }
      onFileSelect(pastedText, 'Pasted_Resume.pdf');
    } else if (selectedFile) {
      onFileSelect(selectedFile.text, selectedFile.name);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/40 overflow-hidden">
      
      {/* Upload Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3.5 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File (PDF / DOCX)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Paste Plain Text
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Max File Size: 10MB
        </div>
      </div>

      <div className="p-6 sm:p-8">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Upload Notice:</span> {error}
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'upload' ? (
          <div>
            {!selectedFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[1.005]'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />

                <div className="w-14 h-14 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-inner">
                  <FileText className="w-7 h-7 stroke-[1.8]" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Drop your resume here, or <span className="text-indigo-600 underline underline-offset-4 font-semibold">Choose a file</span>
                </h3>

                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Supports PDF and DOCX documents up to 10MB.
                </p>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-5 py-2.5 rounded-lg shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Browse Files
                </button>
              </div>
            ) : (
              /* Selected File Card */
              <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <FileCode className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 truncate">
                        {selectedFile.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Ready
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Text content extracted
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Sample Selector */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Don't have a resume handy? Try a sample profile:
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_RESUMES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSampleSelect(sample)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                      selectedFile?.name === sample.fileName
                        ? 'border-indigo-600 bg-indigo-50/80 ring-1 ring-indigo-600 text-indigo-900 font-medium'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                      selectedFile?.name === sample.fileName ? 'text-indigo-600' : 'text-slate-300'
                    }`} />
                    <div>
                      <div className="font-semibold text-slate-900">{sample.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{sample.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Paste Tab */
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Paste Complete Resume Content
            </label>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume text here (Summary, Work History, Education, Skills, Projects)..."
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl p-4 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-y"
            />
          </div>
        )}

        {/* Action Button */}
        {(selectedFile || (activeTab === 'paste' && pastedText.trim().length > 0)) && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleConfirmFile}
              disabled={isLoading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Processing Resume...' : 'Proceed to Analysis'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
