"use client";

import { useState, useEffect } from 'react';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import { Plus, X, Search, FileText, CheckCircle2, AlertCircle, Clock, ShieldAlert, ArrowRight, Activity, ArrowLeft } from 'lucide-react';

const GrievancePage = () => {
  const [grievances, setGrievances] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, resolved

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const response = await api.get('/students/grievances');
      setGrievances(response.data.grievances);
    } catch (error) {
      toast.error('Failed to fetch grievances');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.category) return toast.error('Please select a category');
    if (step === 2 && (!formData.title || !formData.description)) return toast.error('Please fill in title and description');
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post('/students/grievances', formData);
      toast.success(`Complaint submitted! ID: ${response.data.trackingId}`);
      setFormData({ category: '', title: '', description: '' });
      setShowForm(false);
      setStep(1);
      fetchGrievances();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('resolv')) return <span className="px-2.5 py-1 rounded-full bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 size={12} /> Resolved</span>;
    if (s.includes('progress')) return <span className="px-2.5 py-1 rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Activity size={12} /> In Progress</span>;
    if (s.includes('escalat')) return <span className="px-2.5 py-1 rounded-full bg-[var(--color-status-danger)]/10 text-[var(--color-status-danger)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><ShieldAlert size={12} /> Escalated</span>;
    return <span className="px-2.5 py-1 rounded-full bg-[var(--color-status-warning)]/10 text-[var(--color-status-warning)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock size={12} /> Pending</span>;
  };

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) || (g.trackingId && g.trackingId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'active' ? (g.status || '').toLowerCase() !== 'resolved' :
      (g.status || '').toLowerCase() === 'resolved';
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Helpdesk</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Submit, track, and manage your campus issues.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-[var(--color-brand-primary)] text-white rounded-full font-semibold hover:bg-[var(--color-brand-primary-hover)] transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={18} /> New Complaint
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-[var(--color-bg-elevated)] p-8 rounded-2xl border border-[var(--color-border-default)] shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
          <button 
            onClick={() => { setShowForm(false); setStep(1); }}
            className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-2 rounded-full hover:bg-[var(--color-bg-subtle)] transition-colors"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold tracking-tight mb-2">Submit a Complaint</h2>
          
          {/* Stepper */}
          <div className="flex items-center gap-2 mb-8 mt-6">
            <div className={`h-1.5 rounded-full flex-1 ${step >= 1 ? 'bg-[var(--color-brand-primary)]' : 'bg-[var(--color-border-default)]'}`} />
            <div className={`h-1.5 rounded-full flex-1 ${step >= 2 ? 'bg-[var(--color-brand-primary)]' : 'bg-[var(--color-border-default)]'}`} />
            <div className={`h-1.5 rounded-full flex-1 ${step >= 3 ? 'bg-[var(--color-brand-primary)]' : 'bg-[var(--color-border-default)]'}`} />
          </div>

          <div className="max-w-2xl">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h3 className="text-lg font-semibold mb-4">What type of issue are you experiencing?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['academic', 'hostel', 'facilities', 'it-support', 'ragging', 'other'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat})}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-all ${
                        formData.category === cat 
                          ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 text-[var(--color-brand-primary)]' 
                          : 'border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <FileText size={24} />
                      <span className="font-medium text-sm capitalize">{cat.replace('-', ' ')}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={nextStep} className="px-6 py-2.5 bg-[var(--color-brand-primary)] text-white rounded-full font-semibold hover:bg-[var(--color-brand-primary-hover)] transition-all flex items-center gap-2">
                    Next Step <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h3 className="text-lg font-semibold mb-4">Provide details about the issue</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Issue Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="E.g., WiFi router broken in Room 302"
                      className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] p-3 rounded-xl border border-[var(--color-border-default)] focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Detailed Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please describe exactly what happened..."
                      rows="5"
                      className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] p-3 rounded-xl border border-[var(--color-border-default)] focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] outline-none transition-all resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={prevStep} className="px-6 py-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] rounded-full font-semibold transition-all flex items-center gap-2">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button onClick={nextStep} className="px-6 py-2.5 bg-[var(--color-brand-primary)] text-white rounded-full font-semibold hover:bg-[var(--color-brand-primary-hover)] transition-all flex items-center gap-2">
                    Review <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h3 className="text-lg font-semibold mb-4">Review your complaint</h3>
                
                <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Category</p>
                    <p className="font-medium capitalize">{formData.category.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Title</p>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Description</p>
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{formData.description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[var(--color-brand-primary)]/5 rounded-xl text-[var(--color-brand-primary)] text-sm">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p>By submitting this complaint, you agree that all provided information is accurate to the best of your knowledge.</p>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={prevStep} disabled={loading} className="px-6 py-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] rounded-full font-semibold transition-all flex items-center gap-2">
                    <ArrowLeft size={16} /> Edit
                  </button>
                  <button onClick={handleSubmit} disabled={loading} className="px-8 py-2.5 bg-[var(--color-status-success)] text-white rounded-full font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-sm disabled:opacity-70">
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!showForm && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-bg-elevated)] p-4 rounded-xl border border-[var(--color-border-default)] shadow-sm">
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {['all', 'active', 'resolved'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-all ${filter === f ? 'bg-[var(--color-brand-primary)] text-white shadow-sm' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]'}`}
                >
                  {f} Issues
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-full focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all"
              />
            </div>
          </div>

          {filteredGrievances.length === 0 ? (
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] border-dashed rounded-2xl p-12 text-center text-[var(--color-text-muted)]">
              <div className="w-16 h-16 bg-[var(--color-bg-subtle)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-border-default)]">
                <FileText size={24} className="opacity-50" />
              </div>
              <p className="text-lg font-medium mb-1">No complaints found</p>
              <p className="text-sm">Submit a new complaint if you need assistance.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGrievances.map(grievance => (
                <div key={grievance._id} className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-all shadow-sm flex flex-col cursor-pointer group hover:-translate-y-1 duration-200">
                  <div className="flex justify-between items-start mb-4">
                    {getStatusBadge(grievance.status)}
                    <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">#{grievance.trackingId?.slice(-6) || '---'}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 line-clamp-1 group-hover:text-[var(--color-brand-primary)] transition-colors">{grievance.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{grievance.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border-default)] mt-auto">
                    <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider px-2.5 py-1 bg-[var(--color-bg-subtle)] rounded-md border border-[var(--color-border-default)]">{grievance.category}</span>
                    <span className="text-xs font-medium text-[var(--color-text-secondary)] flex items-center gap-1.5"><Clock size={12}/> {new Date(grievance.createdAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GrievancePage;
