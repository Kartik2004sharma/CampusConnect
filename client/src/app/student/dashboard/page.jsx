"use client";

import { useEffect, useState, useContext } from 'react';
import api from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Activity, BellRing, CalendarDays, ArrowRight, Zap, GraduationCap, MapPin } from 'lucide-react';
import Link from 'next/link';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ notices: [], upcomingEvents: [], grievances: [], upcomingSessions: [], recommendations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/students/dashboard');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-32 bg-[var(--color-bg-subtle)] rounded-2xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-28 bg-[var(--color-bg-subtle)] rounded-xl"></div>
        <div className="h-28 bg-[var(--color-bg-subtle)] rounded-xl"></div>
        <div className="h-28 bg-[var(--color-bg-subtle)] rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-64 bg-[var(--color-bg-subtle)] rounded-xl"></div>
        <div className="h-64 bg-[var(--color-bg-subtle)] rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[var(--color-brand-primary)] rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-brand-accent)]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10">
          <p className="text-white/80 font-medium mb-1">{format(new Date(), 'EEEE, MMMM do')}</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Good morning, {user?.name?.split(' ')[0] || 'Student'} 👋</h1>
          <p className="text-white/90 max-w-xl text-sm leading-relaxed">Here's what's happening on campus today. You have {data.upcomingEvents.length} upcoming events and {data.grievances.length} active complaints.</p>
        </div>
        
        <div className="relative z-10 flex gap-3">
          <Link href="/student/grievances" className="bg-white text-[var(--color-brand-primary)] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-opacity-90 transition-all shadow-md flex items-center gap-2">
            Submit Issue
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/student/grievances" className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] hover:border-[var(--color-brand-primary)]/50 transition-all shadow-sm group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[var(--color-status-warning)]/10 text-[var(--color-status-warning)] rounded-xl flex items-center justify-center">
              <Activity size={24} />
            </div>
            <span className="p-2 rounded-full hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] transition-colors"><ArrowRight size={18} /></span>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{data.grievances.length}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Active Complaints</p>
          </div>
        </Link>
        
        <Link href="/student/events" className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] hover:border-[var(--color-brand-primary)]/50 transition-all shadow-sm group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-xl flex items-center justify-center">
              <CalendarDays size={24} />
            </div>
            <span className="p-2 rounded-full hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] transition-colors"><ArrowRight size={18} /></span>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{data.upcomingEvents.length}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Upcoming Events</p>
          </div>
        </Link>
        
        <div className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] rounded-xl flex items-center justify-center">
              <BellRing size={24} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{data.notices.length}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Recent Announcements</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Latest Complaints Status */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">Recent Complaints</h2>
              <Link href="/student/grievances" className="text-sm font-medium text-[var(--color-brand-primary)] hover:underline">View All</Link>
            </div>
            {data.grievances.length > 0 ? (
              <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-[var(--color-border-default)]">
                  {data.grievances.slice(0, 3).map((g, i) => (
                    <div key={i} className="p-5 hover:bg-[var(--color-bg-subtle)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] uppercase tracking-wider">{g.category}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            g.status === 'Resolved' ? 'bg-[var(--color-status-success)]/10 text-[var(--color-status-success)]' :
                            g.status === 'In Progress' ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]' :
                            'bg-[var(--color-status-warning)]/10 text-[var(--color-status-warning)]'
                          }`}>{g.status}</span>
                        </div>
                        <h4 className="font-semibold text-[var(--color-text-primary)]">{g.title}</h4>
                      </div>
                      <div className="text-sm font-medium text-[var(--color-text-muted)] text-left sm:text-right">
                        Updated {format(new Date(g.updatedAt || g.createdAt), 'MMM dd')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] border-dashed p-8 rounded-2xl text-center shadow-sm">
                <div className="w-16 h-16 bg-[var(--color-bg-subtle)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-border-strong)]">
                  <Activity size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">No active complaints</h3>
                <p className="text-[var(--color-text-secondary)] text-sm max-w-sm mx-auto mb-6">You don't have any open issues right now. Everything seems to be working smoothly!</p>
                <Link href="/student/grievances" className="inline-flex items-center justify-center bg-[var(--color-brand-primary)] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[var(--color-brand-primary-hover)] transition-colors">
                  Report an Issue
                </Link>
              </div>
            )}
          </section>

          {/* Announcements */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">Campus Announcements</h2>
            </div>
            <div className="space-y-4">
              {data.notices.length > 0 ? data.notices.slice(0, 4).map(notice => (
                <div key={notice._id} className="bg-[var(--color-bg-elevated)] p-5 rounded-2xl border border-[var(--color-border-default)] hover:border-[var(--color-brand-primary)]/30 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-bold text-[var(--color-text-primary)] leading-snug">{notice.title}</h3>
                    <span className="text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-md">{format(new Date(notice.createdAt), 'MMM dd')}</span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2 leading-relaxed">{notice.content}</p>
                </div>
              )) : (
                <div className="bg-[var(--color-bg-elevated)] p-6 text-center rounded-2xl border border-[var(--color-border-default)] text-[var(--color-text-muted)] text-sm shadow-sm">
                  No recent announcements.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          
          {/* AI Recommendations */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-accent)] text-white flex items-center justify-center shadow-md">
                <Zap size={16} fill="currentColor" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Campus AI Picks</h2>
            </div>
            
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl overflow-hidden shadow-sm">
              {data.recommendations.length > 0 ? (
                <div className="divide-y divide-[var(--color-border-default)]">
                  {data.recommendations.map((rec, i) => (
                    <div key={i} className="p-5 hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 px-2 py-0.5 rounded-full">{rec.type}</span>
                        <span className="text-xs font-bold text-[var(--color-brand-accent)]">{Math.round(rec.score * 100)}% Match</span>
                      </div>
                      <h3 className="font-semibold text-[var(--color-text-primary)] text-sm mb-1.5 group-hover:text-[var(--color-brand-primary)] transition-colors">{rec.itemTitle}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gradient-to-b from-[var(--color-bg-elevated)] to-[var(--color-bg-subtle)]">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[var(--color-border-default)] text-[var(--color-brand-primary)]">
                    <Zap size={20} />
                  </div>
                  <p className="text-[var(--color-text-secondary)] font-medium text-sm mb-1">Learning your preferences...</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Check back later for personalized campus recommendations.</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Links */}
          <section className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/student/events" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border-default)] transition-colors text-center">
                <MapPin size={20} className="text-[var(--color-text-secondary)]" />
                <span className="text-xs font-medium">Campus Map</span>
              </Link>
              <Link href="/student/mentorship" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border-default)] transition-colors text-center">
                <GraduationCap size={20} className="text-[var(--color-text-secondary)]" />
                <span className="text-xs font-medium">Academics</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
