import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Briefcase, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Building2, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  Filter,
  Check,
  X
} from 'lucide-react';

interface JobTrackerPageProps {
  onBackToHome: () => void;
}

export type ApplicationStatus = 'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary?: string;
  dateApplied: string;
  status: ApplicationStatus;
  url?: string;
  notes?: string;
}

const STORAGE_KEY = 'hirelens_job_tracker_applications';

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    company: 'Stripe',
    role: 'Backend Software Engineer',
    location: 'San Francisco, CA / Remote',
    salary: '$140k - $175k',
    dateApplied: '2026-10-08',
    status: 'Interviewing',
    url: 'https://stripe.com/jobs',
    notes: 'Technical screen scheduled for Thursday. Review distributed systems & Redis caching.'
  },
  {
    id: 'app-2',
    company: 'Vercel',
    role: 'Full Stack Engineer (React / Next.js)',
    location: 'Remote',
    salary: '$135k - $165k',
    dateApplied: '2026-10-10',
    status: 'Applied',
    url: 'https://vercel.com/careers',
    notes: 'Submitted resume tailored for Next.js 15 & edge runtime performance.'
  },
  {
    id: 'app-3',
    company: 'Anthropic',
    role: 'Full Stack Systems Engineer',
    location: 'San Francisco, CA',
    salary: '$150k - $190k',
    dateApplied: '2026-10-02',
    status: 'Wishlist',
    url: 'https://anthropic.com/careers',
    notes: 'Need to add Python and ML pipeline experience to skills section before submitting.'
  }
];

export const JobTrackerPage: React.FC<JobTrackerPageProps> = ({ onBackToHome }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [dateApplied, setDateApplied] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setApplications(JSON.parse(saved));
      } else {
        setApplications(INITIAL_APPLICATIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      }
    } catch (e) {
      setApplications(INITIAL_APPLICATIONS);
    }
  }, []);

  const saveApplications = (updated: JobApplication[]) => {
    setApplications(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setCompany('');
    setRole('');
    setLocation('Remote');
    setSalary('');
    setDateApplied(new Date().toISOString().split('T')[0]);
    setStatus('Applied');
    setUrl('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app: JobApplication) => {
    setEditingId(app.id);
    setCompany(app.company);
    setRole(app.role);
    setLocation(app.location);
    setSalary(app.salary || '');
    setDateApplied(app.dateApplied);
    setStatus(app.status);
    setUrl(app.url || '');
    setNotes(app.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    if (editingId) {
      const updated = applications.map(a => {
        if (a.id === editingId) {
          return {
            ...a,
            company,
            role,
            location,
            salary,
            dateApplied,
            status,
            url,
            notes
          };
        }
        return a;
      });
      saveApplications(updated);
      showToast(`Updated application for ${company}`);
    } else {
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        company,
        role,
        location,
        salary,
        dateApplied,
        status,
        url,
        notes
      };
      saveApplications([newApp, ...applications]);
      showToast(`Added application for ${company}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, compName: string) => {
    const updated = applications.filter(a => a.id !== id);
    saveApplications(updated);
    showToast(`Removed application for ${compName}`);
  };

  const handleQuickStatusChange = (id: string, newStatus: ApplicationStatus) => {
    const updated = applications.map(a => a.id === id ? { ...a, status: newStatus } : a);
    saveApplications(updated);
    showToast(`Status updated to ${newStatus}`);
  };

  // Filtered applications
  const filtered = applications.filter(a => {
    const matchesSearch = 
      a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.notes && a.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics Metrics
  const totalApps = applications.length;
  const interviewingCount = applications.filter(a => a.status === 'Interviewing').length;
  const offersCount = applications.filter(a => a.status === 'Offer').length;
  const appliedCount = applications.filter(a => a.status === 'Applied').length;
  const responseRate = totalApps > 0 ? Math.round(((interviewingCount + offersCount) / totalApps) * 100) : 0;

  const getStatusBadge = (st: ApplicationStatus) => {
    switch (st) {
      case 'Wishlist':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Applied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interviewing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
      case 'Offer':
        return 'bg-teal-100 text-teal-800 border-teal-300 font-extrabold';
      case 'Rejected':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#273330] pb-24">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#12221E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-[#16B889]/40 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-[#16B889]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E3ECE7] px-6 py-3.5 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs font-bold text-[#55625F] hover:text-[#16B889] transition-colors cursor-pointer bg-[#F0F5F2] hover:bg-[#E4EFEA] px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="h-4 w-px bg-[#DCE5E0]"></div>
            <div>
              <h1 className="text-sm font-extrabold text-[#273330] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#16B889]" />
                HireLens Job Application Tracker
              </h1>
              <p className="text-[11px] text-[#7A8A85]">Track interviews, follow-ups, offers, and job stages</p>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 text-xs font-bold bg-[#16B889] hover:bg-[#139E75] text-white px-3.5 py-1.5 rounded-lg cursor-pointer transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#E3ECE7] p-4.5 shadow-2xs">
            <span className="text-[11px] font-bold text-[#7A8A85] uppercase">Total Applications</span>
            <div className="text-2xl font-black text-[#192622] pt-1">{totalApps}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E3ECE7] p-4.5 shadow-2xs">
            <span className="text-[11px] font-bold text-[#16B889] uppercase">Active Interviews</span>
            <div className="text-2xl font-black text-[#16B889] pt-1">{interviewingCount}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E3ECE7] p-4.5 shadow-2xs">
            <span className="text-[11px] font-bold text-[#107C5F] uppercase">Job Offers</span>
            <div className="text-2xl font-black text-[#107C5F] pt-1">{offersCount}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E3ECE7] p-4.5 shadow-2xs">
            <span className="text-[11px] font-bold text-[#55625F] uppercase">Interview Callback Rate</span>
            <div className="text-2xl font-black text-[#273330] pt-1">{responseRate}%</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E3ECE7] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8A9A95] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by company, role, or notes..."
              className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-xl pl-9 pr-3 py-2 text-[#273330] focus:border-[#16B889] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto text-xs font-bold">
            {['ALL', 'Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#16B889] text-white shadow-2xs'
                    : 'bg-[#F0F5F2] text-[#55625F] hover:bg-[#E4ECE8]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map(app => (
              <div 
                key={app.id} 
                className="bg-white rounded-2xl border border-[#E3ECE7] p-5 shadow-2xs hover:border-[#16B889]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-extrabold text-[15px] text-[#192622]">{app.role}</h3>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#55625F] flex-wrap font-medium">
                    <span className="font-bold text-[#16B889] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {app.company}
                    </span>
                    <span>• {app.location}</span>
                    {app.salary && <span>• {app.salary}</span>}
                    <span className="text-[#8A9A95] font-mono text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {app.dateApplied}
                    </span>
                  </div>

                  {app.notes && (
                    <p className="text-xs text-[#6A7B76] bg-[#F9FBFA] p-2 rounded-lg border border-[#EDF2EF] mt-1">
                      {app.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={e => handleQuickStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="text-xs bg-[#F0F5F2] border border-[#D5E1DC] rounded-lg px-2.5 py-1.5 text-[#35433F] font-bold outline-none cursor-pointer"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  {app.url && (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#6A7B76] hover:text-[#16B889] bg-[#F9FBFA] rounded-lg border border-[#D9E3DF]"
                      title="Open job link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => handleOpenEditModal(app)}
                    className="p-1.5 text-[#6A7B76] hover:text-[#16B889] bg-[#F9FBFA] rounded-lg border border-[#D9E3DF] cursor-pointer"
                    title="Edit details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(app.id, app.company)}
                    className="p-1.5 text-[#6A7B76] hover:text-red-600 bg-[#F9FBFA] rounded-lg border border-[#D9E3DF] cursor-pointer"
                    title="Delete application"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-[#E3ECE7] p-12 text-center space-y-3 text-[#7A8A85]">
              <div className="w-12 h-12 rounded-full bg-[#F0F5F2] flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6 text-[#16B889]" />
              </div>
              <h4 className="font-bold text-sm text-[#273330]">No applications found</h4>
              <p className="text-xs max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try clearing your search or status filter.'
                  : 'Start tracking your job search by clicking "Add Application".'}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#DEE7E2] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-3">
              <h3 className="font-extrabold text-sm text-[#273330]">
                {editingId ? 'Edit Job Application' : 'Add New Application'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#8A9A95] hover:text-[#273330] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#55625F] block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Stripe"
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 outline-none focus:border-[#16B889]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#55625F] block mb-1">Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 outline-none focus:border-[#16B889]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#55625F] block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Remote, Austin, TX"
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 outline-none focus:border-[#16B889]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#55625F] block mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={e => setSalary(e.target.value)}
                    placeholder="e.g. $130k - $160k"
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 outline-none focus:border-[#16B889]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#55625F] block mb-1">Application Date</label>
                  <input
                    type="date"
                    value={dateApplied}
                    onChange={e => setDateApplied(e.target.value)}
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 outline-none focus:border-[#16B889]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#55625F] block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ApplicationStatus)}
                    className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 outline-none focus:border-[#16B889] font-bold"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Job Posting Link</label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://company.com/jobs/..."
                  className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg px-3 py-2 outline-none focus:border-[#16B889]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#55625F] block mb-1">Notes & Next Steps</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Interview rounds, recruiter contacts, technical focus areas..."
                  className="w-full text-xs bg-[#F9FBFA] border border-[#D9E3DF] rounded-lg p-2.5 outline-none focus:border-[#16B889]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#55625F] hover:bg-[#F0F5F2] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#16B889] hover:bg-[#139E75] text-white rounded-lg shadow-2xs cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
