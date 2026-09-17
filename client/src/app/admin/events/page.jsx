"use client";

import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Calendar, Users, Plus, Edit2, MapPin, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    registrationDeadline: '',
    venue: '',
    category: 'other',
    maxParticipants: '',
    isPublished: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/admin/events');
      setEvents(res.data.events);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null
      };

      if (editingId) {
        await api.put(`/admin/events/${editingId}`, payload);
        toast.success('Event updated successfully!');
      } else {
        await api.post('/admin/events', payload);
        toast.success('Event created successfully!');
      }
      
      resetForm();
      fetchEvents();
    } catch (err) {
      toast.error('Failed to save event');
    }
  };

  const startEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : '',
      venue: event.venue,
      category: event.category,
      maxParticipants: event.maxParticipants || '',
      isPublished: event.isPublished
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      title: '', description: '', date: '', registrationDeadline: '', venue: '', category: 'other', maxParticipants: '', isPublished: true
    });
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await api.put(`/admin/events/${id}`, { isPublished: !currentStatus });
      toast.success(currentStatus ? 'Event unpublished' : 'Event published');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to update event status');
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-400">Loading events...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-sora font-bold text-white">Event Management</h1>
          <p className="text-gray-400 text-sm mt-1">Create and manage campus events and registrations.</p>
        </div>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Create Event</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-2 border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-sora font-semibold text-white mb-4">
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Event Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date & Time</label>
                <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Registration Deadline</label>
                <input required type="datetime-local" value={formData.registrationDeadline} onChange={e => setFormData({...formData, registrationDeadline: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Venue / Location</label>
                <input required type="text" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary">
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="fest">Fest</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Participants (Optional)</label>
                <input type="number" min="1" placeholder="Leave empty for unlimited" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="md:col-span-2 flex items-center gap-3 p-3 bg-surface rounded-xl border border-white/5">
                <input 
                  type="checkbox" 
                  id="publishToggle" 
                  checked={formData.isPublished} 
                  onChange={e => setFormData({...formData, isPublished: e.target.checked})}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="publishToggle" className="text-sm text-white cursor-pointer select-none">
                  Publish immediately (visible to students)
                </label>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                {editingId ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-surface-2 border border-white/10 rounded-2xl">
            <Calendar size={48} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400">No events have been created yet.</p>
          </div>
        ) : (
          events.map(event => (
            <div key={event._id} className={`bg-surface-2 border border-white/10 p-6 rounded-2xl flex flex-col hover:border-white/20 transition-colors ${!event.isPublished && 'opacity-75'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md">
                    {event.category}
                  </span>
                  {!event.isPublished && (
                    <span className="bg-gray-500/20 text-gray-400 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                      <EyeOff size={12} /> Draft
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => togglePublish(event._id, event.isPublished)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg" title={event.isPublished ? 'Unpublish' : 'Publish'}>
                    {event.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => startEdit(event)} className="text-gray-400 hover:text-blue-400 transition-colors bg-white/5 p-2 rounded-lg" title="Edit">
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-sora font-semibold text-white mb-2">{event.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{event.description}</p>
              
              <div className="space-y-2 p-4 bg-surface rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar size={16} className="text-primary" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users size={16} className="text-primary" />
                    {event.registeredStudents?.length || 0} {event.maxParticipants ? `/ ${event.maxParticipants}` : 'Reg'}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin size={16} className="text-primary" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminEventsPage;
