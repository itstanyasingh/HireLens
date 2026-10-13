import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ReportPage } from './pages/ReportPage';
import { MatcherPage } from './pages/MatcherPage';
import { HistoryPage } from './pages/HistoryPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { ResumeTailorPage } from './pages/ResumeTailorPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { JobTrackerPage } from './pages/JobTrackerPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { AnalysisProgress } from './components/AnalysisProgress';
import { analyzeResume, AnalysisReport, getHistory } from './services/api';

export type AppTab = NavTab | 'loading';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('landing');
  const [activeReport, setActiveReport] = useState<AnalysisReport | null>(null);
  const [loadingFileName, setLoadingFileName] = useState<string>('Resume.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigate helper that scrolls to top and updates URL hash
  const navigateTo = (tab: AppTab) => {
    setActiveTab(tab);
    if (tab !== 'landing' && tab !== 'loading') {
      window.location.hash = tab;
    } else if (tab === 'landing') {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Scroll to top automatically whenever activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  // Sync with window.location.hash for direct links and browser back/forward
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace('#', '').trim();
      const validTabs: AppTab[] = [
        'landing',
        'report',
        'matcher',
        'history',
        'builder',
        'tailor',
        'cover-letter',
        'tracker',
        'interview-prep'
      ];
      if (rawHash && validTabs.includes(rawHash as AppTab)) {
        setActiveTab(rawHash as AppTab);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Auto load recent history on start if available & ensure favicon is active
  useEffect(() => {
    const history = getHistory();
    if (history.length > 0 && !activeReport) {
      setActiveReport(history[0]);
    }

    // Refresh tab favicon dynamically to force browser tab repaint
    const iconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (iconLink) {
      const currentHref = iconLink.href;
      iconLink.href = currentHref;
    }
  }, []);

  const handleStartAnalysis = async (resumeText: string, fileName: string, jobDescription?: string) => {
    setActiveReport(null);
    setLoadingFileName(fileName);
    setIsSubmitting(true);
    setActiveTab('loading');

    try {
      const report = await analyzeResume(resumeText, fileName, jobDescription);
      setActiveReport(report);
    } catch (err: any) {
      console.error('Analysis error:', err);
      // Soft feedback instead of blocking alert
      console.warn(err?.message || "Unable to read resume");
      navigateTo('landing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadingFinished = () => {
    if (activeReport) {
      navigateTo('report');
    } else {
      navigateTo('landing');
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#18181B] font-sans selection:bg-[#4F46E5] selection:text-white">
      
      {/* Top Application Header */}
      {activeTab !== 'loading' && (
        <Header
          activeTab={activeTab as NavTab}
          onNavigate={(tab) => navigateTo(tab)}
          onScrollToSection={handleScrollToSection}
          hasActiveReport={!!activeReport}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'loading' && (
          <AnalysisProgress
            fileName={loadingFileName}
            onComplete={handleLoadingFinished}
          />
        )}

        {activeTab === 'landing' && (
          <LandingPage
            onStartAnalysis={handleStartAnalysis}
            isLoading={isSubmitting}
            onNavigate={(tab) => navigateTo(tab)}
          />
        )}

        {activeTab === 'report' && activeReport && (
          <ReportPage
            report={activeReport}
            onAnalyzeAnother={() => {
              navigateTo('landing');
              setTimeout(() => handleScrollToSection('sec-upload'), 100);
            }}
          />
        )}

        {activeTab === 'matcher' && (
          <MatcherPage
            onReportGenerated={(rep) => {
              setActiveReport(rep);
              navigateTo('report');
            }}
            onBackToHome={() => navigateTo('landing')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            onSelectReport={(rep) => {
              setActiveReport(rep);
              navigateTo('report');
            }}
            onNavigateLanding={() => navigateTo('landing')}
          />
        )}

        {activeTab === 'builder' && (
          <ResumeBuilderPage
            onBackToHome={() => navigateTo('landing')}
            onSendToChecker={(text, name) => handleStartAnalysis(text, name)}
          />
        )}

        {activeTab === 'tailor' && (
          <ResumeTailorPage
            onBackToHome={() => navigateTo('landing')}
            onOpenBuilder={() => navigateTo('builder')}
          />
        )}

        {activeTab === 'cover-letter' && (
          <CoverLetterPage
            onBackToHome={() => navigateTo('landing')}
          />
        )}

        {activeTab === 'tracker' && (
          <JobTrackerPage
            onBackToHome={() => navigateTo('landing')}
          />
        )}

        {activeTab === 'interview-prep' && (
          <InterviewPrepPage
            onBackToHome={() => navigateTo('landing')}
          />
        )}
      </main>

      {/* Footer */}
      {activeTab !== 'loading' && (
        <Footer onNavigate={(tab) => navigateTo(tab)} />
      )}

    </div>
  );
}
