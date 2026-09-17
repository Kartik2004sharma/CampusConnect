"use client";

import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Plus, Edit2, Trash2, Megaphone, Users, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyNoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    attachments: ''
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get('/faculty/notices');
      setNotices(res.data.notices);
    } catch (err) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        attachments: formData.attachments ? formData.attachments.split(',').map(s => s.trim()) : []
      };

      if (editingId) {
        await api.put(`/faculty/notices/${editingId}`, payload);
        toast.success('Notice updated successfully!');
      } else {
        await api.post('/faculty/notices', payload);
        toast.success('Notice published successfully!');
      }
      
      resetForm();
      fetchNotices();
    } catch (err) {
      toast.error('Failed to save notice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await api.delete(`/faculty/notices/${id}`);
      toast.success('Notice deleted');
      fetchNotices();
    } catch (err) {
      toast.error('Failed to delete notice');
    }
  };

  const startEdit = (notice) => {
    setEditingId(notice._id);
    setFormData({
      title: notice.title,
      content: notice.content,
      targetAudience: notice.targetAudience,
      attachments: notice.attachments ? notice.attachments.join(', ') : ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({ title: '', content: '', targetAudience: 'all', attachments: '' });
  };

  const audienceColors = {
    all: 'bg-indigo-500/20 text-indigo-400',
    students: 'bg-emerald-500/20 text-emerald-400',
    faculty: 'bg-purple-500/20 text-purple-400'
  };

  if (loading) return <div className="text-center p-8 text-gray-400">Loading notices...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-sora font-bold text-white">Notice Board Management</h1>
          <p className="text-gray-400 text-sm mt-1">Publish and manage official notices and announcements.</p>
        </div>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Publish Notice</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-2 border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-sora font-semibold text-white mb-4">
            {editingId ? 'Edit Notice' : 'Create New Notice'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Notice Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Detailed Content</label>
                <textarea required rows="4" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Target Audience</label>
                <select value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary">
                  <option value="all">Everyone</option>
                  <option value="students">Students Only</option>
                  <option value="faculty">Faculty Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Attachments (Comma-separated URLs)</label>
                <input type="text" placeholder="https://link1.com, https://link2.com" value={formData.attachments} onChange={e => setFormData({...formData, attachments: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                {editingId ? 'Update Notice' : 'Publish Notice'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notices.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-surface-2 border border-white/10 rounded-2xl">
            <Megaphone size={48} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400">You haven't published any notices yet.</p>
          </div>
        ) : (
          notices.map(notice => (
            <div key={notice._id} className="bg-surface-2 border border-white/10 p-6 rounded-2xl flex flex-col hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-sora font-semibold text-white">{notice.title}</h3>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(notice)} className="text-gray-400 hover:text-blue-400 transition-colors bg-white/5 p-2 rounded-lg">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(notice._id)} className="text-gray-400 hover:text-red-400 transition-colors bg-white/5 p-2 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md flex items-center gap-1 ${audienceColors[notice.targetAudience] || audienceColors.all}`}>
                  <Users size={12} /> {notice.targetAudience}
                </span>
                <span className="text-xs text-gray-500">{new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
              
              <p className="text-sm text-gray-300 mb-4 flex-1 whitespace-pre-wrap">{notice.content}</p>
              
              {notice.attachments && notice.attachments.length > 0 && (
                <div className="mt-auto pt-4 border-t border-white/5">
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Paperclip size={12} /> Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {notice.attachments.map((link, idx) => (
                      <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline bg-primary/10 px-2 py-1 rounded-md truncate max-w-full">
                        Link {idx + 1}
                      </a>
                    ))}
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

export default FacultyNoticesPage;
