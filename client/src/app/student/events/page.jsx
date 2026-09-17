"use client";

import { useState, useEffect, useContext } from 'react';
import api from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import { Calendar, MapPin, Users, CheckCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const EventsPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/students/events/all');
      setEvents(res.data.events);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/students/events/${eventId}/register`);
      toast.success('Successfully registered for the event!');
      fetchEvents(); // Refresh to show "Registered" state
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesFilter = filter === 'all' || e.category === filter;
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-20 bg-[var(--color-bg-subtle)] rounded-2xl"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-[var(--color-bg-subtle)] rounded-2xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Campus Events</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">Discover and register for upcoming activities.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input 
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-xl focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2.5 text-sm bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-xl focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all appearance-none font-medium"
            >
              <option value="all">All Categories</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="fest">Fest</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] border-dashed p-12 rounded-2xl text-center shadow-sm">
          <div className="w-16 h-16 bg-[var(--color-bg-subtle)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-border-default)]">
            <Calendar size={24} className="opacity-50 text-[var(--color-text-muted)]" />
          </div>
          <p className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No events found</p>
          <p className="text-[var(--color-text-secondary)] text-sm">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const isRegistered = event.registeredStudents.includes(user?._id);
            const isFull = event.maxParticipants && event.registeredStudents.length >= event.maxParticipants;
            
            return (
              <div key={event._id} className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] p-0 rounded-2xl flex flex-col justify-between hover:border-[var(--color-border-strong)] hover:shadow-md transition-all group overflow-hidden">
                {/* Visual placeholder for event image */}
                <div className="h-32 bg-gradient-to-br from-[var(--color-brand-primary)]/20 to-[var(--color-brand-accent)]/20 relative">
                  <div className="absolute top-4 left-4">
                    <span className="bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm border border-[var(--color-border-default)]">
                      {event.category}
                    </span>
                  </div>
                  {isRegistered && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[var(--color-status-success)] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                        <CheckCircle size={12} /> Registered
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 pt-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 line-clamp-1 group-hover:text-[var(--color-brand-primary)] transition-colors">{event.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-5 line-clamp-2 leading-relaxed flex-1">{event.description}</p>
                  
                  <div className="space-y-3 mb-6 bg-[var(--color-bg-subtle)] p-4 rounded-xl border border-[var(--color-border-default)]">
                    <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-text-secondary)]">
                      <Calendar size={16} className="text-[var(--color-brand-primary)]" />
                      {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-text-secondary)]">
                      <MapPin size={16} className="text-[var(--color-brand-accent)]" />
                      {event.venue}
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-text-secondary)]">
                        <Users size={16} className="text-[var(--color-status-info)]" />
                        <span><strong className="text-[var(--color-text-primary)]">{event.registeredStudents.length}</strong> / {event.maxParticipants} Spots Filled</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleRegister(event._id)}
                    disabled={isRegistered || isFull}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      isRegistered 
                        ? 'bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] cursor-not-allowed border border-[var(--color-status-success)]/20'
                        : isFull
                        ? 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--color-border-default)]'
                        : 'bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white shadow-sm'
                    }`}
                  >
                    {isRegistered ? 'Successfully Registered' : isFull ? 'Event is Full' : 'Register Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
