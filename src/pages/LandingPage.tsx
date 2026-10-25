import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ExplanationSection } from '../components/ExplanationSection';
import { DarkFeatureSection } from '../components/DarkFeatureSection';
import { TailoringSection } from '../components/TailoringSection';
import { RecruiterSection } from '../components/RecruiterSection';
import { ResumeBuilderBlock } from '../components/ResumeBuilderBlock';
import { ImprovementSection } from '../components/ImprovementSection';
import { ResourceSection } from '../components/ResourceSection';
import { TestimonialSection } from '../components/TestimonialSection';
import { FAQSection } from '../components/FAQSection';
import { FinalCTA } from '../components/FinalCTA';

interface LandingPageProps {
  onStartAnalysis: (resumeText: string, fileName: string, jobDescription?: string) => void;
  isLoading: boolean;
  onNavigate?: (tab: 'landing' | 'report' | 'matcher' | 'history' | 'builder' | 'tailor' | 'cover-letter' | 'tracker' | 'interview-prep' | 'studio' | 'match-lab' | 'methodology') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis, isLoading, onNavigate }) => {
  const scrollToUpload = () => {
    const el = document.getElementById('sec-upload');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-0">
      
      {/* 1. HERO SECTION */}
      <HeroSection
        onStartAnalysis={onStartAnalysis}
        isLoading={isLoading}
      />

      {/* 2. ATS AUDIT SECTION (50/50 Large Lottie Animation on Left + Clean Content on Right) */}
      <ExplanationSection />

      {/* 3. FULL-WIDTH DARK COMPREHENSIVE DIAGNOSTIC AUDIT */}
      <DarkFeatureSection />

      {/* 4. SECTION 2: JOB TAILORING (Text on Left, Large Layered Visual on Right) */}
      <TailoringSection onOpenTailor={() => onNavigate?.('tailor')} />

      {/* 5. SECTION 3: HUMAN SCREENING (Large Layered Visual on Left, Text on Right) */}
      <RecruiterSection />

      {/* 6. RESUME BUILDER COMPONENT */}
      <ResumeBuilderBlock onOpenBuilder={() => onNavigate?.('builder')} />

      {/* 7. PUT YOUR RESUME SCORE TO WORK */}
      <ImprovementSection onNavigate={onNavigate} />

      {/* 8. CAREER RESOURCES */}
      <ResourceSection />

      {/* 9. TESTIMONIALS */}
      <TestimonialSection />

      {/* 10. FAQ */}
      <FAQSection />

      {/* 11. FINAL CTA */}
      <FinalCTA onScrollToUpload={scrollToUpload} />

    </div>
  );
};
