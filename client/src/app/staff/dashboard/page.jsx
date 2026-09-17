"use client";

import { useEffect, useState, useContext } from 'react';
import api from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import { Users, FileText, CheckCircle, BookOpen, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ stats: { assignedGrievances: 0, pendingSessions: 0, publishedNotices: 0, mentoredStudents: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/faculty/dashboard');
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-[var(--color-bg-subtle)] rounded-xl"></div>)}
      </div>
      <div className="h-64 bg-[var(--color-bg-subtle)] rounded-2xl"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Staff Portal</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your department's requests, complaints, and student sessions.</p>
        </div>
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-status-success)]"></span>
          <span className="text-sm font-medium">On Duty</span>
        </div>
      </div>

      {/* SLA / Risk Alert (Mocked for visual, actual data can be integrated later) */}
      {data.stats.assignedGrievances > 0 && (
        <div className="bg-[var(--color-status-warning)]/10 border border-[var(--color-status-warning)]/30 rounded-xl p-4 flex items-start gap-4">
          <AlertTriangle className="text-[var(--color-status-warning)] shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-[var(--color-status-warning)]">SLA Risk Detected</h4>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">You have 2 complaints approaching their 48-hour resolution SLA. Please review your assigned queue.</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/faculty/grievances" className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] hover:border-[var(--color-brand-primary)]/50 transition-all shadow-sm group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[var(--color-status-danger)]/10 text-[var(--color-status-danger)] rounded-xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <ArrowRight size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{data.stats.assignedGrievances}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Assigned Complaints</p>
          </div>
        </Link>
        
        <Link href="/faculty/mentorship" className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] hover:border-[var(--color-brand-primary)]/50 transition-all shadow-sm group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-xl flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <ArrowRight size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{data.stats.pendingSessions}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Pending Sessions</p>
          </div>
        </Link>
        
        <Link href="/faculty/notices" className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] hover:border-[var(--color-brand-primary)]/50 transition-all shadow-sm group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <ArrowRight size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{data.stats.publishedNotices}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Published Notices</p>
          </div>
        </Link>
        
        <div className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{data.stats.mentoredStudents}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Mentored Students</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Work Queue */}
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[var(--color-border-default)] flex justify-between items-center bg-[var(--color-bg-subtle)]/50">
              <h2 className="text-lg font-bold">Priority Work Queue</h2>
              <Link href="/faculty/grievances" className="text-sm font-medium text-[var(--color-brand-primary)] hover:underline">View Queue</Link>
            </div>
            <div className="p-8 text-center text-[var(--color-text-secondary)] flex flex-col items-center">
              <Clock className="text-[var(--color-border-strong)] mb-3" size={32} />
              <p className="font-medium text-[var(--color-text-primary)] mb-1">Queue is caught up</p>
              <p className="text-sm">You have no immediate tasks pending SLA breach.</p>
            </div>
          </div>
        </div>
        
        <div>
          {/* Quick Actions */}
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl shadow-sm p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/faculty/notices" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border-default)] hover:bg-[var(--color-bg-subtle)] transition-colors">
                <div className="bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] p-2 rounded-md">
                  <FileText size={18} />
                </div>
                <span className="text-sm font-medium">Post Announcement</span>
              </Link>
              <Link href="/faculty/mentorship" className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border-default)] hover:bg-[var(--color-bg-subtle)] transition-colors">
                <div className="bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] p-2 rounded-md">
                  <Users size={18} />
                </div>
                <span className="text-sm font-medium">Schedule Office Hours</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
