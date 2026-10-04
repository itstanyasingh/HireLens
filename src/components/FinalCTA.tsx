import React from 'react';
import { UploadCloud } from 'lucide-react';

interface FinalCTAProps {
  onScrollToUpload: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onScrollToUpload }) => {
  return (
    <section className="py-24 bg-[#07110F] text-white relative overflow-hidden border-t border-[#182321]">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#16B889]/15 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6">
        
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
          Get your resume score now!
        </h2>

        <p className="text-[15px] sm:text-[16px] text-[#AEBAB7] max-w-xl mx-auto leading-relaxed">
          Upload your resume and you'll get a personalized report with an actionable tasklist.
        </p>

        <div className="pt-4 flex justify-center">
          <div 
            onClick={onScrollToUpload}
            className="w-full max-w-[340px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all space-y-3 flex flex-col items-center justify-center group"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6 text-[#16B889]" />
            </div>

            <button
              type="button"
              className="w-full h-[44px] bg-[#16B889] hover:bg-[#129A72] text-white font-bold text-sm rounded-lg transition-all shadow-md flex items-center justify-center"
            >
              Upload Your Resume
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
