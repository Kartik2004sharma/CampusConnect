"use client";

import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Calendar, User, Clock, CheckCircle, XCircle, FileText, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyMentorshipPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleData, setRescheduleData] = useState({ id: null, date: '' });
  const [notesData, setNotesData] = useState({ id: null, notes: '' });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      // The API currently returns pending sessions, but we'll fetch all assigned to faculty if the backend allows.
      // Assuming the backend GET /faculty/mentorship/requests returns all relevant sessions for this UI.
      const res = await api.get('/faculty/mentorship/requests');
      setSessions(res.data.sessions);
    } catch (err) {
      toast.error('Failed to load mentorship requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/faculty/mentorship/${id}/approve`);
      toast.success('Session approved!');
      fetchSessions();
    } catch (err) {
      toast.error('Failed to approve session');
    }
  };

  const handleReschedule = async (e, id) => {
    e.preventDefault();
    if (!rescheduleData.date) return toast.error('Please select a date');
    try {
      await api.put(`/faculty/mentorship/${id}/reschedule`, { scheduledAt: rescheduleData.date });
      toast.success('Session rescheduled!');
      setRescheduleData({ id: null, date: '' });
      fetchSessions();
    } catch (err) {
      toast.error('Failed to reschedule session');
    }
  };

  const handleAddNotes = async (e, id) => {
    e.preventDefault();
    try {
      await api.put(`/faculty/mentorship/${id}/notes`, { sessionNotes: notesData.notes });
      toast.success('Notes added to session!');
      setNotesData({ id: null, notes: '' });
      fetchSessions();
    } catch (err) {
      toast.error('Failed to add notes');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'pending': return <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1"><XCircle size={12} /> Cancelled</span>;
      case 'rescheduled': return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1"><Calendar size={12} /> Rescheduled</span>;
      default: return null;
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-400">Loading requests...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-sora font-bold text-white">Mentorship Requests</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your upcoming student mentorship sessions.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sessions.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-surface-2 border border-white/10 rounded-2xl">
            <p className="text-gray-400">No mentorship requests at this time.</p>
          </div>
        ) : (
          sessions.map(session => (
            <div key={session._id} className="bg-surface-2 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                      {session.studentId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-sm font-sora font-semibold text-white">{session.studentId?.name || 'Unknown Student'}</h3>
                      <p className="text-xs text-gray-400">{session.studentId?.department || 'No Dept'}</p>
                    </div>
                  </div>
                  {getStatusBadge(session.status)}
                </div>
                
                <div className="space-y-3 mb-6 p-4 bg-surface rounded-xl border border-white/5">
                  <div className="flex items-start gap-3">
                    <FileText size={16} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Topic / Notes</p>
                      <p className="text-sm text-gray-300">{session.sessionNotes}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Scheduled For</p>
                      <p className="text-sm text-gray-300">{new Date(session.scheduledAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                {session.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleApprove(session._id)}
                      className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button 
                      onClick={() => setRescheduleData({ id: session._id, date: '' })}
                      className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar size={16} /> Reschedule
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => setNotesData({ id: session._id, notes: session.sessionNotes })}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Update Notes
                </button>
              </div>

              {/* Reschedule Form Overlay */}
              {rescheduleData.id === session._id && (
                <form onSubmit={(e) => handleReschedule(e, session._id)} className="mt-4 p-4 bg-surface rounded-xl border border-blue-500/30">
                  <label className="block text-sm text-gray-400 mb-2">Select New Date & Time</label>
                  <div className="flex gap-2">
                    <input 
                      type="datetime-local" 
                      required
                      value={rescheduleData.date}
                      onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                      className="flex-1 bg-surface-2 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-blue-500 focus:outline-none" 
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
                    <button type="button" onClick={() => setRescheduleData({ id: null, date: '' })} className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm font-semibold">X</button>
                  </div>
                </form>
              )}

              {/* Update Notes Form Overlay */}
              {notesData.id === session._id && (
                <form onSubmit={(e) => handleAddNotes(e, session._id)} className="mt-4 p-4 bg-surface rounded-xl border border-white/20">
                  <label className="block text-sm text-gray-400 mb-2">Session Notes / Prep Required</label>
                  <textarea 
                    rows="3"
                    required
                    value={notesData.notes}
                    onChange={(e) => setNotesData({...notesData, notes: e.target.value})}
                    className="w-full bg-surface-2 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-primary focus:outline-none mb-2" 
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setNotesData({ id: null, notes: '' })} className="bg-white/5 text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Notes</button>
                  </div>
                </form>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyMentorshipPage;
