"use client";

import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { FileText, CheckCircle2, Clock, AlertTriangle, AlertCircle, UserCheck, Shield, ChevronDown, ChevronUp, Search, Activity, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const GrievancePipelinePage = () => {
  const [grievances, setGrievances] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [assignData, setAssignData] = useState({ id: null, facultyId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [grievanceRes, facultyRes] = await Promise.all([
        api.get('/admin/grievance-pipeline'),
        api.get('/admin/faculties') // Reuse this endpoint to get list of faculties
      ]);
      setGrievances(grievanceRes.data.grievances);
      setFaculties(facultyRes.data.faculties);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e, id) => {
    e.preventDefault();
    if (!assignData.facultyId) return toast.error('Please select a staff member');
    
    try {
      await api.patch(`/admin/grievances/${id}/assign`, { assignedTo: assignData.facultyId });
      toast.success('Complaint assigned successfully!');
      setAssignData({ id: null, facultyId: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to assign complaint');
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle size={14} className="text-[var(--color-status-danger)]" />;
      case 'medium': return <AlertCircle size={14} className="text-[var(--color-status-warning)]" />;
      case 'low': return <CheckCircle2 size={14} className="text-[var(--color-status-success)]" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('resolv')) return <span className="px-2.5 py-1 rounded-full bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max"><CheckCircle2 size={12} /> Resolved</span>;
    if (s.includes('progress')) return <span className="px-2.5 py-1 rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max"><Activity size={12} /> In Progress</span>;
    if (s.includes('escalat')) return <span className="px-2.5 py-1 rounded-full bg-[var(--color-status-danger)]/10 text-[var(--color-status-danger)] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max"><ShieldAlert size={12} /> Escalated</span>;
    return <span className="px-2.5 py-1 rounded-full bg-[var(--color-status-warning)]/10 text-[var(--color-status-warning)] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max"><Clock size={12} /> Pending</span>;
  };

  const filteredGrievances = grievances.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (g.trackingId && g.trackingId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-20 bg-[var(--color-bg-subtle)] rounded-2xl"></div>
      {[1,2,3].map(i => <div key={i} className="h-24 bg-[var(--color-bg-subtle)] rounded-xl"></div>)}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Complaint Pipeline</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">Monitor, route, and oversee all campus issues.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input 
            type="text"
            placeholder="Search by ID or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-xl focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredGrievances.length === 0 ? (
          <div className="text-center p-12 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] border-dashed rounded-2xl shadow-sm">
            <Shield size={48} className="mx-auto text-[var(--color-border-strong)] mb-4" />
            <p className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No complaints found.</p>
            <p className="text-sm text-[var(--color-text-secondary)]">The pipeline is currently empty or no matches were found.</p>
          </div>
        ) : (
          filteredGrievances.map(grievance => (
            <div key={grievance._id} className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl overflow-hidden transition-all hover:border-[var(--color-border-strong)] shadow-sm">
              {/* Header Section */}
              <div 
                className="p-5 cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-[var(--color-bg-subtle)] transition-colors"
                onClick={() => setExpandedId(expandedId === grievance._id ? null : grievance._id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[var(--color-brand-primary)] text-sm font-bold tracking-wider">#{grievance.trackingId?.slice(-6) || '---'}</span>
                    {getStatusBadge(grievance.status)}
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] px-2.5 py-1 bg-[var(--color-bg-subtle)] rounded-full border border-[var(--color-border-default)]">
                      {getPriorityIcon(grievance.priority)} {grievance.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 truncate">{grievance.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-1">{grievance.description}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <p className="text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-wider mb-1">Student</p>
                    <p className="text-[var(--color-text-primary)] font-medium text-sm">{grievance.studentId?.name || 'Unknown'}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-wider mb-1">Assigned To</p>
                    {grievance.assignedTo ? (
                      <p className="text-[var(--color-status-success)] font-bold text-sm flex items-center gap-1.5 justify-start md:justify-end"><UserCheck size={14} /> {grievance.assignedTo.name}</p>
                    ) : (
                      <p className="text-[var(--color-status-warning)] font-bold text-sm flex items-center gap-1.5 justify-start md:justify-end"><AlertCircle size={14}/> Unassigned</p>
                    )}
                  </div>
                  <div className="text-[var(--color-text-muted)] p-2 rounded-full hover:bg-[var(--color-border-default)] transition-colors hidden md:block">
                    {expandedId === grievance._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Expanded Details Section */}
              {expandedId === grievance._id && (
                <div className="p-6 border-t border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Full Description</h4>
                      <div className="bg-[var(--color-bg-elevated)] p-4 rounded-xl border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed shadow-sm">
                        {grievance.description}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Timeline & History</h4>
                      <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[var(--color-border-strong)] pb-4">
                        {grievance.timeline.map((event, idx) => (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-4 last:mb-0">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] text-[var(--color-brand-primary)] shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                              <Clock size={16} />
                            </div>
                            <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-1">
                                <span className="font-bold text-sm text-[var(--color-text-primary)]">{event.action}</span>
                                <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] px-2 py-0.5 rounded-md">{new Date(event.timestamp).toLocaleString(undefined, {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'})}</span>
                              </div>
                              <p className="text-sm text-[var(--color-text-secondary)]">{event.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Assignment Panel */}
                  <div className="bg-[var(--color-bg-elevated)] p-6 rounded-xl border border-[var(--color-border-default)] shadow-sm h-fit sticky top-24">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight mb-5 flex items-center gap-2">
                      <Shield size={18} className="text-[var(--color-brand-primary)]" /> Routing & Assignment
                    </h4>
                    
                    {grievance.status === 'resolved' ? (
                      <div className="bg-[var(--color-status-success)]/10 border border-[var(--color-status-success)]/20 text-[var(--color-status-success)] p-4 rounded-xl text-sm font-medium text-center">
                        This complaint has been resolved and closed.
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleAssign(e, grievance._id)} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Assign to Staff Member</label>
                          <select 
                            value={assignData.id === grievance._id ? assignData.facultyId : ''} 
                            onChange={e => setAssignData({ id: grievance._id, facultyId: e.target.value })}
                            className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-xl p-3 text-[var(--color-text-primary)] text-sm focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] focus:outline-none transition-all"
                          >
                            <option value="">Select Staff...</option>
                            {faculties.map(f => (
                              <option key={f._id} value={f._id}>{f.name} ({f.department || 'Staff'})</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          type="submit" 
                          disabled={!assignData.facultyId || assignData.id !== grievance._id}
                          className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm"
                        >
                          {grievance.assignedTo ? 'Re-assign Complaint' : 'Assign Complaint'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GrievancePipelinePage;
