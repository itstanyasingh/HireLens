import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ReportPage } from './pages/ReportPage';
import { MatcherPage } from './pages/MatcherPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalysisProgress } from './components/AnalysisProgress';
import { analyzeResume, AnalysisReport, getHistory } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'report' | 'matcher' | 'history' | 'loading'>('landing');
  const [activeReport, setActiveReport] = useState<AnalysisReport | null>(null);
  const [loadingFileName, setLoadingFileName] = useState<string>('Resume.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto load recent history on start if available
  useEffect(() => {
    const history = getHistory();
    if (history.length > 0 && !activeReport) {
      setActiveReport(history[0]);
    }
  }, []);

  const handleStartAnalysis = async (resumeText: string, fileName: string, jobDescription?: string) => {
    setLoadingFileName(fileName);
    setIsSubmitting(true);
    setActiveTab('loading');

    try {
      const report = await analyzeResume(resumeText, fileName, jobDescription);
      setActiveReport(report);
    } catch (err) {
      console.error('Analysis error:', err);
      setActiveTab('landing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadingFinished = () => {
    if (activeReport) {
      setActiveTab('report');
    } else {
      setActiveTab('landing');
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
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
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
          />
        )}

        {activeTab === 'report' && activeReport && (
          <ReportPage
            report={activeReport}
            onAnalyzeAnother={() => setActiveTab('landing')}
          />
        )}

        {activeTab === 'matcher' && (
          <MatcherPage
            onReportGenerated={(rep) => {
              setActiveReport(rep);
              setActiveTab('report');
            }}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            onSelectReport={(rep) => {
              setActiveReport(rep);
              setActiveTab('report');
            }}
            onNavigateLanding={() => setActiveTab('landing')}
          />
        )}
      </main>

      {/* Footer */}
      {activeTab !== 'loading' && (
        <Footer onNavigate={(tab) => setActiveTab(tab)} />
      )}

    </div>
  );
}
