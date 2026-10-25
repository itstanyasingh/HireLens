import React, { useState, useEffect } from 'react';
import { 
  Wand2, 
  ArrowLeft, 
  Check, 
  Copy, 
  X, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Edit3, 
  ShieldCheck,
  ListFilter
} from 'lucide-react';
import { fixBulletPoint, getHistory } from '../services/api';

interface ResumeStudioPageProps {
  onBackToHome: () => void;
  onOpenBuilder?: () => void;
}

interface SavedImprovement {
  id: string;
  original: string;
  improved: string;
  strategy: string;
  status: 'accepted' | 'rejected';
  timestamp: string;
}

const STORAGE_KEY = 'hirelens_studio_improvements';

export const ResumeStudioPage: React.FC<ResumeStudioPageProps> = ({ 
  onBackToHome,
  onOpenBuilder 
}) => {
  const history = getHistory();
  const latestReport = history[0];

  // Extract bullets from current report if available
  const existingBullets = latestReport?.categories?.content?.weakBullets?.map(b => b.original) || [
    "Worked on the web application using React and TypeScript.",
    "Responsible for database queries and optimizing backend endpoints.",
    "Helped with customer onboarding and reduced bug reports."
  ];

  const [selectedBullet, setSelectedBullet] = useState<string>(existingBullets[0] || '');
  const [jobDescription, setJobDescription] = useState<string>(latestReport?.jobDescription || '');
  const [targetRole, setTargetRole] = useState<string>('Software Engineer');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generated Variations
  const [variations, setVariations] = useState<{ type: string; bullet: string; explanation: string }[]>([]);
  const [selectedVariationIdx, setSelectedVariationIdx] = useState<number>(0);
  const [customizedBullet, setCustomizedBullet] = useState<string>('');

  // Status flags
  const [copied, setCopied] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Saved History of Accepted / Rejected bullets
  const [savedImprovements, setSavedImprovements] = useState<SavedImprovement[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedImprovements(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveToStorage = (updated: SavedImprovement[]) => {
    setSavedImprovements(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  // Generate Improvements
  const handleGenerateImprovements = async () => {
    setError(null);
    setActionFeedback(null);

    if (!selectedBullet || selectedBullet.trim().length < 10) {
      setError('Please provide or select a resume bullet point of at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fixBulletPoint(selectedBullet.trim(), targetRole);
      if (res?.variations && res.variations.length > 0) {
        setVariations(res.variations);
        setSelectedVariationIdx(0);
        setCustomizedBullet(res.variations[0].bullet);
      } else {
        setError('No variations generated. Please adjust the input text.');
      }
    } catch (err: any) {
      console.error('Studio generation error:', err);
      setError(err?.message || 'Failed to improve bullet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Copy to Clipboard
  const handleCopy = () => {
    if (!customizedBullet) return;
    navigator.clipboard.writeText(customizedBullet);
    setCopied(true);
    setActionFeedback('Copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setActionFeedback(null);
    }, 2500);
  };

  // Accept Improvement
  const handleAccept = () => {
    if (!customizedBullet) return;
    const newItem: SavedImprovement = {
      id: `imp-${Date.now()}`,
      original: selectedBullet,
      improved: customizedBullet,
      strategy: variations[selectedVariationIdx]?.type || 'Optimized',
      status: 'accepted',
      timestamp: new Date().toLocaleDateString()
    };
    saveToStorage([newItem, ...savedImprovements.filter(i => i.original !== selectedBullet)]);
    setActionFeedback('Bullet accepted & saved to your studio library!');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Reject Improvement
  const handleReject = () => {
    if (!customizedBullet) return;
    const newItem: SavedImprovement = {
      id: `imp-${Date.now()}`,
      original: selectedBullet,
      improved: customizedBullet,
      strategy: variations[selectedVariationIdx]?.type || 'Rejected',
      status: 'rejected',
      timestamp: new Date().toLocaleDateString()
    };
    saveToStorage([newItem, ...savedImprovements.filter(i => i.original !== selectedBullet)]);
    setActionFeedback('Proposal rejected. You can select another strategy or fine-tune.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#273330] pb-24">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E3ECE7] px-6 py-3.5 shadow-2xs no-print">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs font-bold text-[#55625F] hover:text-[#16B889] transition-colors cursor-pointer bg-[#F0F5F2] hover:bg-[#E4EFEA] px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="h-4 w-px bg-[#DCE5E0]"></div>
            <div>
              <h1 className="text-sm font-extrabold text-[#273330] flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[#16B889]" />
                Resume Improvement Studio
              </h1>
              <p className="text-[11px] text-[#7A8A85]">
                Side-by-side bullet point refinement, action verb strengthening & factual preservation
              </p>
            </div>
          </div>

          {onOpenBuilder && (
            <button
              onClick={onOpenBuilder}
              className="text-xs font-bold text-[#16B889] hover:bg-[#EAFBF5] px-3 py-1.5 rounded-lg border border-[#C6EFE0] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Open in Resume Builder</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#EAF8F3] border border-[#BDEBDC] rounded-full px-3.5 py-1 text-xs font-bold text-[#129A72]">
            <Sparkles className="w-3.5 h-3.5 text-[#16B889]" />
            <span>EXECUTIVE BULLET POINT REFINERY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#273330] tracking-tight">
            Turn passive responsibilities into high-impact achievements.
          </h2>
          <p className="text-xs sm:text-sm text-[#55625F] leading-relaxed">
            Select or paste any bullet point from your resume. Enhance its clarity, active verbs, and technical framing while strictly preserving factual honesty.
          </p>
        </div>

        {/* Factual Integrity Discipline Notice */}
        <div className="bg-[#FFF9F2] border border-[#FADBAA] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#7A4B10]">
          <ShieldCheck className="w-5 h-5 text-[#D9822B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Strict Factual Integrity Standard:</span>
            <p className="text-[11px] leading-relaxed">
              HireLens never invents false metrics, fake companies, or unverified skills. Where efficiency numbers are needed, safe bracketed placeholders like <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#FADBAA]">[insert metric: e.g. 25%]</span> are provided for you to replace with your real data.
            </p>
          </div>
        </div>

        {/* Action / Error Feedback Toast */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {actionFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Input Configuration Box */}
        <div className="bg-white rounded-3xl border border-[#DCE7E2] shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EEF3F0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#55625F] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#16B889]" />
              Select or Enter Resume Bullet Point
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#788582]">Target Role:</span>
              <input 
                type="text" 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="text-xs bg-[#F4F8F6] border border-[#DCE7E3] rounded-lg px-2.5 py-1 text-[#273330] font-bold outline-none focus:border-[#16B889]"
              />
            </div>
          </div>

          {/* Quick Select Buttons from loaded resume */}
          {existingBullets.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#788582] font-semibold">Or pick a bullet from your current resume:</span>
              <div className="flex flex-wrap gap-2">
                {existingBullets.slice(0, 4).map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedBullet(b);
                      setVariations([]);
                    }}
                    className={`text-[11px] text-left p-2 rounded-xl border transition-all cursor-pointer max-w-sm truncate ${
                      selectedBullet === b 
                        ? 'bg-[#EAFBF5] text-[#127F5C] border-[#BDEBDC] font-bold' 
                        : 'bg-[#F9FBFB] text-[#55625F] border-[#E2EAE6] hover:bg-[#F0F5F2]'
                    }`}
                  >
                    • {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Textarea */}
          <textarea
            rows={3}
            value={selectedBullet}
            onChange={(e) => setSelectedBullet(e.target.value)}
            placeholder="Type or paste a resume bullet point here (e.g., Developed features using React and Node.js)..."
            className="w-full text-xs font-sans bg-[#FAFCFA] border border-[#DCE5E0] rounded-xl p-3 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none transition-all"
          />

          {/* Optional Target Job Description */}
          <div className="pt-2">
            <details className="text-xs text-[#55625F]">
              <summary className="font-bold text-[#16B889] cursor-pointer hover:underline">
                + Optionally provide Target Job Description for contextual keyword alignment
              </summary>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job posting snippet here to tailor bullets to relevant tools..."
                className="w-full text-xs font-sans bg-[#FAFCFA] border border-[#DCE5E0] rounded-xl p-3 mt-2 text-[#273330] focus:bg-white focus:border-[#16B889] outline-none"
              />
            </details>
          </div>

          {/* Trigger Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerateImprovements}
              disabled={loading}
              className="bg-[#16B889] hover:bg-[#129A72] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing High-Impact Variations...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Improved Bullet Point</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SIDE-BY-SIDE COMPARISON STUDIO */}
        {variations.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#DCE7E2] shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEF3F0]">
              <h3 className="font-extrabold text-sm text-[#1F2926] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#16B889]" />
                Side-by-Side Review & Action Center
              </h3>
              
              {/* Strategy Switcher Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {variations.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedVariationIdx(i);
                      setCustomizedBullet(v.bullet);
                    }}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                      selectedVariationIdx === i
                        ? 'bg-[#16B889] text-white border-[#16B889] shadow-xs'
                        : 'bg-[#F4F8F6] text-[#55625F] border-[#DCE7E3] hover:bg-[#E5ECE9]'
                    }`}
                  >
                    {v.type}
                  </button>
                ))}
              </div>
            </div>

            {/* Strategy Explanation */}
            <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#E3ECE7] text-xs text-[#55625F] flex items-center gap-2">
              <span className="font-bold text-[#16B889] uppercase tracking-wider text-[10px]">
                {variations[selectedVariationIdx]?.type}:
              </span>
              <span>{variations[selectedVariationIdx]?.explanation}</span>
            </div>

            {/* DUAL COLUMNS: ORIGINAL VS PROPOSED */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT: ORIGINAL */}
              <div className="bg-[#FFFBF7] rounded-2xl border border-[#FADBAA] p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F7D299]">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#A05E03]">
                    Original Bullet Point
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-[#A05E03] border border-[#FADBAA]">
                    Weak Framing
                  </span>
                </div>
                <p className="text-xs font-mono text-[#4A3B2C] leading-relaxed italic bg-white p-3 rounded-xl border border-[#FADBAA]">
                  "{selectedBullet}"
                </p>
                <div className="text-[11px] text-[#805007] space-y-1">
                  <p>• Often lacks an executive active verb.</p>
                  <p>• Omits quantifiable scale and business outcome.</p>
                </div>
              </div>

              {/* RIGHT: PROPOSED REVISED */}
              <div className="bg-[#F4FBF8] rounded-2xl border border-[#BDEBDC] p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#BDEBDC]">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#127F5C] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16B889]" />
                    Proposed Enhanced Bullet
                  </span>
                  <span className="text-[10px] bg-[#16B889] text-white px-2 py-0.5 rounded font-bold">
                    Recruiter-Ready
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={customizedBullet}
                  onChange={(e) => setCustomizedBullet(e.target.value)}
                  className="w-full text-xs font-sans font-medium text-[#1F2926] leading-relaxed bg-white p-3 rounded-xl border border-[#BDEBDC] focus:border-[#16B889] outline-none resize-y shadow-inner"
                />

                <span className="text-[10px] text-[#55625F] block italic">
                  Tip: You can edit or insert your exact team metrics right in the box above before accepting.
                </span>
              </div>

            </div>

            {/* ACTION TOOLBAR: COPY, ACCEPT, REJECT */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EEF3F0]">
              <div className="text-xs text-[#788582]">
                Decision for this bullet:
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReject}
                  className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-white hover:bg-[#F4F8F6] text-[#273330] border border-[#D8E2DE] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-[#16B889]" /> : <Copy className="w-4 h-4 text-[#55625F]" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAccept}
                  className="bg-[#16B889] hover:bg-[#129A72] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Proposal</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* SAVED ACCEPTED BULLETS HISTORY */}
        {savedImprovements.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#DCE7E2] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F0]">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#55625F] flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-[#16B889]" />
                Saved Studio History ({savedImprovements.length})
              </h4>
              <button
                onClick={() => saveToStorage([])}
                className="text-[10px] text-rose-600 hover:underline cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="space-y-3">
              {savedImprovements.map((item) => (
                <div key={item.id} className="p-3 bg-[#F9FBFB] border border-[#E2EAE6] rounded-xl flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.status === 'accepted' ? 'bg-[#EAFBF5] text-[#127F5C]' : 'bg-[#FEECEB] text-[#E15241]'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] text-[#788582]">{item.strategy} • {item.timestamp}</span>
                    </div>
                    <p className="font-sans font-medium text-[#1F2926]">{item.improved}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.improved);
                      setActionFeedback('Copied from history!');
                      setTimeout(() => setActionFeedback(null), 2000);
                    }}
                    className="p-1.5 text-[#55625F] hover:text-[#16B889] bg-white rounded-lg border border-[#DCE7E3] cursor-pointer"
                    title="Copy bullet"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
