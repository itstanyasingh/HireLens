import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  RotateCcw, 
  Plus, 
  Code2, 
  Tag, 
  Layers, 
  CheckCircle2,
  Wrench
} from 'lucide-react';
import { extractSkillsFromPosting, BuilderSkillsResponse } from '../../services/api';

interface SkillsExtractorModalProps {
  currentSkills: string[];
  isOpen: boolean;
  onClose: () => void;
  onAddSkills: (skillsToAdd: string[]) => void;
}

export const SkillsExtractorModal: React.FC<SkillsExtractorModalProps> = ({
  currentSkills,
  isOpen,
  onClose,
  onAddSkills
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuilderSkillsResponse | null>(null);
  const [addedSkills, setAddedSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtract = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 15) {
      setError('Please paste a job description (at least 15 characters) to extract skills.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await extractSkillsFromPosting({
        jobDescription,
        resumeText: currentSkills.join(' ')
      });
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Failed to extract skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingle = (skill: string) => {
    if (addedSkills.includes(skill) || currentSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) return;
    onAddSkills([skill]);
    setAddedSkills(prev => [...prev, skill]);
  };

  const handleAddAllMissing = () => {
    if (!result) return;
    const missingHard = result.hardSkills.filter(s => !s.foundInResume && !addedSkills.includes(s.name)).map(s => s.name);
    const missingSoft = result.softSkills.filter(s => !s.foundInResume && !addedSkills.includes(s.name)).map(s => s.name);
    const toAdd = Array.from(new Set([...missingHard, ...missingSoft]));
    if (toAdd.length > 0) {
      onAddSkills(toAdd);
      setAddedSkills(prev => [...prev, ...toAdd]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Job Posting Skills Extractor
              </h2>
              <p className="text-xs text-slate-500">
                Extract essential technical competencies, tools, and soft skills from any job posting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer">×</button>
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
              <span>Paste Job Description</span>
              <span className="text-[10.5px] text-slate-400">Pulls hard & soft skills</span>
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here. We'll extract the must-have skills..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:bg-white focus:border-rose-500 outline-none resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExtract}
              disabled={loading || !jobDescription.trim()}
              className="flex items-center gap-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Extracting Skills...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Skills Now</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-5 pt-4 border-t border-slate-100">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Extracted Skills & Resume Match Status
                </span>
                <button
                  onClick={handleAddAllMissing}
                  className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add All Missing Skills</span>
                </button>
              </div>

              {/* Hard Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Code2 className="w-4 h-4 text-rose-600" />
                  <span>Hard Skills & Technical Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.hardSkills.map((s, idx) => {
                    const inResume = s.foundInResume || currentSkills.map(sk => sk.toLowerCase()).includes(s.name.toLowerCase()) || addedSkills.includes(s.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAddSingle(s.name)}
                        disabled={inResume}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          inResume
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-white hover:bg-rose-50 text-slate-800 border border-slate-200 hover:border-rose-300'
                        }`}
                      >
                        {inResume ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-rose-600" />}
                        <span>{s.name}</span>
                        {s.importance === 'high' && (
                          <span className="text-[9px] font-bold uppercase bg-rose-100 text-rose-800 px-1 py-0.2 rounded">
                            Must-Have
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Soft Skills & Collaboration</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.softSkills.map((s, idx) => {
                    const inResume = s.foundInResume || currentSkills.map(sk => sk.toLowerCase()).includes(s.name.toLowerCase()) || addedSkills.includes(s.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAddSingle(s.name)}
                        disabled={inResume}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          inResume
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-white hover:bg-blue-50 text-slate-800 border border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {inResume ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-blue-600" />}
                        <span>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tools */}
              {result.tools && result.tools.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Wrench className="w-4 h-4 text-amber-600" />
                    <span>Tools & Platforms</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.tools.map((t, idx) => {
                      const inResume = t.foundInResume || currentSkills.map(sk => sk.toLowerCase()).includes(t.name.toLowerCase()) || addedSkills.includes(t.name);
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAddSingle(t.name)}
                          disabled={inResume}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                            inResume
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-white hover:bg-amber-50 text-slate-800 border border-slate-200 hover:border-amber-300'
                          }`}
                        >
                          {inResume ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-amber-600" />}
                          <span>{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Total active skills on resume: {currentSkills.length}
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
