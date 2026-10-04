import React, { useState, useRef } from 'react';
import { SAMPLE_RESUMES } from '../data/mockResumes';
import { FileCode, X, Lock, ShieldCheck, MapPin, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { extractTextFromFile } from '../services/pdfExtractor';
import { validateExtractedResumeText } from '../services/textValidator';

interface HeroSectionProps {
  onStartAnalysis: (resumeText: string, fileName: string, jobDescription?: string) => void;
  isLoading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAnalysis, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!['pdf', 'docx', 'txt'].includes(ext || '')) {
      setError('Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Your file is larger than the 5MB limit.');
      return;
    }

    setIsExtracting(true);
    try {
      const extractedText = await extractTextFromFile(file);
      const validation = validateExtractedResumeText(extractedText, file.name);

      if (!validation.isValid) {
        setError(validation.errorMessage || "Unable to read this resume correctly. We couldn't extract readable text from this file. Please upload a text-based PDF or DOCX file.");
        setIsExtracting(false);
        return;
      }

      setSelectedFile({
        name: file.name,
        size: file.size,
        text: validation.cleanText || extractedText
      });
    } catch (err: any) {
      console.error('File extraction error:', err);
      setError(err?.message || 'Unable to read this resume correctly. We couldn\'t extract readable text from this file. Please upload a text-based PDF or DOCX file.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRunAnalysis = () => {
    setError(null);
    if (selectedFile) {
      onStartAnalysis(selectedFile.text, selectedFile.name);
    } else {
      const sample = SAMPLE_RESUMES[0];
      setSelectedFile({
        name: sample.fileName,
        size: 1024 * 35,
        text: sample.resumeText
      });
      onStartAnalysis(sample.resumeText, sample.fileName);
    }
  };

  return (
    <section 
      id="sec-upload" 
      className="relative w-full overflow-hidden bg-[#FAFCFA] min-h-[720px] lg:h-[780px] flex items-center"
    >
      
      {/* 1. ART-DIRECTED SOFT MULTI-COLOR GRADIENT CANVAS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft mint green / aqua concentrated around left & center */}
        <div 
          className="absolute -top-[10%] left-[5%] w-[950px] h-[850px] rounded-full blur-[120px] opacity-80"
          style={{ background: 'radial-gradient(circle, #A3EBD8 0%, rgba(163,235,216,0.5) 45%, transparent 75%)' }}
        />
        {/* Soft lavender / pale blue field sitting directly under & behind the product card on the right */}
        <div 
          className="absolute top-[2%] right-[-10%] w-[1100px] h-[900px] rounded-full blur-[130px] opacity-75"
          style={{ background: 'radial-gradient(circle, #D5D6F9 0%, #E3DCFA 40%, rgba(210,225,250,0.5) 60%, transparent 75%)' }}
        />
        {/* Slightly deeper soft blue in lower right */}
        <div 
          className="absolute bottom-[-15%] right-[0%] w-[850px] h-[650px] rounded-full blur-[125px] opacity-70"
          style={{ background: 'radial-gradient(circle, #BFDCFA 0%, #CEE2FA 45%, transparent 75%)' }}
        />
        {/* Subtle blush / warm tint in top right */}
        <div 
          className="absolute -top-[15%] right-[15%] w-[700px] h-[550px] rounded-full blur-[110px] opacity-45"
          style={{ background: 'radial-gradient(circle, #FDE7DE 0%, transparent 70%)' }}
        />
      </div>

      {/* 2. MAIN HERO CONTENT CONTAINER */}
      <div className="relative z-10 w-full h-full max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row items-center justify-between">
        
        {/* LEFT COLUMN: ~40% Content Territory */}
        <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 space-y-6 lg:space-y-7 pt-12 lg:pt-0 lg:ml-[2%] z-20">
          
          {/* Eyebrow */}
          <span className="text-[12px] font-bold uppercase tracking-[2px] text-[#16B889] font-sans block">
            RESUME CHECKER
          </span>

          {/* Dominant Headline (Strictly 2 lines on desktop) */}
          <h1 className="text-5xl sm:text-6xl lg:text-[68px] xl:text-[72px] font-bold text-[#273330] tracking-[-0.035em] leading-[0.98]">
            Is your resume <br />
            good enough?
          </h1>

          {/* Clean Editorial Description */}
          <p className="text-[17px] sm:text-[18px] text-[#4E5D59] leading-[1.6] max-w-[500px]">
            Analyze your resume for ATS compatibility, content quality, and recruiter-readiness — then see what needs improvement.
          </p>

          {/* Upload Area (~500px wide, ~160px high) */}
          <div className="w-full max-w-[490px] min-h-[160px] bg-white/90 backdrop-blur-xs border border-dashed border-[#84CEB9] rounded-[16px] p-6 sm:p-7 text-center space-y-3.5 shadow-[0_4px_24px_rgba(20,45,40,0.03)] flex flex-col justify-center">
            
            {error && (
              <div className="p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
              </div>
            )}

            {!selectedFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer space-y-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />

                <p className="text-[15px] font-semibold text-[#273330]">
                  Drop your resume here or choose a file.
                </p>

                <p className="text-[12.5px] text-[#61706B]">
                  PDF or DOCX · Max 2MB
                </p>

                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="h-[48px] px-8 bg-[#16B889] hover:bg-[#129A72] text-white font-bold text-[14.5px] rounded-[8px] transition-all shadow-xs hover:shadow-md inline-flex items-center justify-center cursor-pointer min-w-[180px]"
                  >
                    Upload Your Resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#F8FAF9] border border-[#E9ECEA] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileCode className="w-5 h-5 text-[#16B889] shrink-0" />
                  <span className="text-xs font-bold text-[#273330] truncate block">{selectedFile.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunAnalysis}
                    disabled={isLoading}
                    className="bg-[#16B889] hover:bg-[#129A72] text-white font-bold text-xs px-4 py-2 rounded-[6px] shadow-xs"
                  >
                    {isLoading ? 'Processing...' : 'Run Analysis'}
                  </button>
                  <button onClick={() => setSelectedFile(null)} className="text-[#61706B] hover:text-rose-600"><X className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {/* Clean Privacy Notice */}
            <div className="text-[11.5px] text-[#61706B] flex items-center justify-center gap-1.5 pt-0.5">
              <Lock className="w-3.5 h-3.5 text-[#61706B]" />
              <span>Your resume stays private.</span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: VERY LARGE CROPPED PRODUCT VISUAL (780–820px wide) */}
        <div className="w-full lg:w-[60%] relative flex justify-end items-center pt-10 lg:pt-0 lg:-mr-16 xl:-mr-24 pointer-events-none lg:pointer-events-auto">
          
          {/* Layered Floating Container with Offset Backing Matte */}
          <div className="relative w-full max-w-[620px] lg:max-w-none lg:w-[780px] xl:w-[820px] min-h-[500px] lg:h-[540px]">
            
            {/* OFFSET LAYER (White/pale lavender rounded matte layer behind the main card) */}
            <div className="absolute -top-3.5 -left-3.5 right-3.5 bottom-3.5 bg-white/70 backdrop-blur-md rounded-[28px] border border-[#E8ECF2] shadow-[0_15px_40px_rgba(25,45,40,0.06)] pointer-events-none z-0"></div>

            {/* MAIN WHITE PRODUCT PREVIEW CARD */}
            <div className="relative z-10 w-full h-full bg-white rounded-[24px] border border-[#E4E8E6] p-7 sm:p-8 shadow-[0_25px_70px_rgba(30,50,45,0.10)] flex flex-col justify-between space-y-4">
              
              {/* Card Top Header Bar */}
              <div className="flex items-center justify-between border-b border-[#F0F3F1] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#16B889] text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[16px] text-[#16B889] tracking-tight">HireLens</span>
                </div>
                <div className="text-[12.5px] font-medium text-[#788582]">
                  Resume Analysis
                </div>
              </div>

              {/* TWO-COLUMN INTERNAL LAYOUT (Left: 28-30%, Right: 70-72%) */}
              <div className="grid grid-cols-12 gap-6 items-start flex-1">
                
                {/* LEFT COLUMN (~28-30%): Score Panel & Pillar Breakdown */}
                <div className="col-span-12 md:col-span-4 space-y-4 pr-1">
                  
                  {/* Top Score Box */}
                  <div className="text-center pb-3 border-b border-[#EEF2F0]">
                    <span className="text-[13px] font-bold text-[#273330] block mb-2 font-sans">
                      Resume Score
                    </span>
                    
                    {/* Semi-circular Gauge Arc */}
                    <div className="relative w-24 h-14 mx-auto overflow-hidden flex items-end justify-center mb-1">
                      {/* Remaining Gray Arc Track */}
                      <div className="absolute top-0 w-24 h-24 rounded-full border-[7px] border-[#E5ECE9] border-b-transparent border-l-transparent -rotate-45" />
                      {/* Active Emerald Arc */}
                      <div className="absolute top-0 w-24 h-24 rounded-full border-[7px] border-[#16B889] border-b-transparent border-l-transparent rotate-[60deg]" />
                      <div className="relative z-10 text-center -mb-0.5">
                        <span className="text-2xl font-extrabold text-[#273330] leading-none block">92</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-[#273330]">
                      <span className="text-[#16B889]">92</span>/100
                    </div>
                    <span className="text-[10px] text-[#697572] block">
                      24 Issues
                    </span>
                  </div>

                  {/* Pillars List */}
                  <div className="space-y-1.5 text-[11px]">
                    
                    {/* CONTENT Row */}
                    <div className="flex items-center justify-between font-bold text-[#273330]">
                      <span>CONTENT</span>
                      <span className="flex items-center gap-1">
                        <span className="text-[9.5px] bg-[#DDF5EC] text-[#16B889] px-1.5 py-0.5 rounded font-bold">90%</span>
                        <ChevronUp className="w-3 h-3 text-[#697572]" />
                      </span>
                    </div>

                    {/* Indented Diagnostic Items */}
                    <div className="pl-1.5 space-y-1 text-[9.5px]">
                      <div className="text-[#16B889] font-medium flex items-center gap-1.5">
                        <span>✓</span> ATS Parse Rate
                      </div>
                      <div className="text-[#16B889] font-medium flex items-center gap-1.5">
                        <span>✓</span> Quantifying Impact
                      </div>
                      <div className="text-[#E15241] font-medium flex items-center gap-1.5">
                        <span>✕</span> Repetition
                      </div>
                      <div className="text-[#8B9693] flex items-center gap-1.5">
                        <span>🔒</span> Spelling & Grammar
                      </div>
                      <div className="text-[#8B9693] flex items-center gap-1.5">
                        <span>🔒</span> Summarize Resume
                      </div>
                    </div>

                    {/* Accordion Rows */}
                    <div className="pt-1 space-y-1 text-[10.5px] text-[#273330]">
                      <div className="flex items-center justify-between py-0.5">
                        <span className="text-[#697572]">FORMAT & BREVITY</span>
                        <span className="flex items-center gap-1">
                          <span className="text-[9px] bg-[#DDF5EC] text-[#16B889] px-1.5 py-0.2 rounded font-bold">84%</span>
                          <ChevronDown className="w-3 h-3 text-[#8B9693]" />
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-0.5">
                        <span className="text-[#697572]">STYLE</span>
                        <span className="flex items-center gap-1">
                          <span className="text-[9px] bg-[#FEECEB] text-[#E15241] px-1.5 py-0.2 rounded font-bold">40%</span>
                          <ChevronDown className="w-3 h-3 text-[#8B9693]" />
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-0.5">
                        <span className="text-[#697572]">SECTIONS</span>
                        <span className="flex items-center gap-1">
                          <span className="text-[9px] bg-[#FEECEB] text-[#E15241] px-1.5 py-0.2 rounded font-bold">40%</span>
                          <ChevronDown className="w-3 h-3 text-[#8B9693]" />
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-0.5">
                        <span className="text-[#697572]">SKILLS</span>
                        <span className="flex items-center gap-1">
                          <span className="text-[9px] bg-[#FEF5E7] text-[#D9822B] px-1.5 py-0.2 rounded font-bold">68%</span>
                          <ChevronDown className="w-3 h-3 text-[#8B9693]" />
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* RIGHT COLUMN (~70-72%): Soft Lavender Container with ATS Parse Rate Mockup */}
                <div className="col-span-12 md:col-span-8 bg-[#EEF1FA] rounded-[16px] p-5 space-y-3.5 border border-[#E3E8F5]">
                  
                  {/* Lavender Box Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#5B5BD6] flex items-center justify-center text-white text-[9px] font-bold">
                        ≡
                      </div>
                      <span className="font-bold text-[13px] text-[#273330] tracking-tight">CONTENT</span>
                    </div>

                    <span className="bg-white text-[#697572] font-bold text-[10px] px-2.5 py-1 rounded-full shadow-2xs border border-white">
                      8 ISSUES FOUND
                    </span>
                  </div>

                  {/* Inner White Card: ATS Parse Rate */}
                  <div className="bg-white rounded-[12px] p-4 sm:p-5 border border-[#E2E7F0] space-y-3.5 shadow-2xs">
                    
                    <div className="flex items-center justify-between text-[11.5px] font-bold text-[#273330]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-3 bg-[#4F46E5] rounded-full inline-block"></span>
                        <span>ATS PARSE RATE</span>
                      </div>
                      <ChevronUp className="w-3.5 h-3.5 text-[#697572]" />
                    </div>

                    {/* Top Skeleton Lines */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-[#E2E6E9] rounded-full w-[95%]"></div>
                      <div className="h-1.5 bg-[#E2E6E9] rounded-full w-[90%]"></div>
                      <div className="h-1.5 bg-[#E2E6E9] rounded-full w-[93%]"></div>
                      <div className="h-1.5 bg-[#E2E6E9] rounded-full w-[65%]"></div>
                    </div>

                    {/* Large Analytics Visualization Area */}
                    <div className="bg-[#FFFFFF] border border-[#E4E8EE] rounded-[10px] p-5 space-y-4 shadow-2xs">
                      
                      {/* Horizontal Green Progress Bar with Location Pin Marker */}
                      <div className="relative pt-3 pb-1">
                        <div className="w-full bg-[#E2E7EA] h-2.5 rounded-full overflow-hidden">
                          <div className="bg-[#16B889] h-full w-[78%] rounded-full"></div>
                        </div>
                        {/* MapPin Marker Pinpointed on the Progress Bar */}
                        <div className="absolute -top-1 left-[75%] text-[#16B889]">
                          <MapPin className="w-4 h-4 fill-[#16B889] text-white drop-shadow-xs" />
                        </div>
                      </div>

                      {/* Under Progress Bar: 4 Gray Placeholder Lines */}
                      <div className="space-y-1.5">
                        <div className="h-1.5 bg-[#E2E6E9] rounded-full w-[85%]"></div>
                        <div className="h-1.5 bg-[#E2E6E9] rounded-full w-[85%]"></div>
                        <div className="h-1.5 bg-[#E2E6E9] rounded-full w-[85%]"></div>
                        <div className="h-1.5 bg-[#E2E6E9] rounded-full w-[85%]"></div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
