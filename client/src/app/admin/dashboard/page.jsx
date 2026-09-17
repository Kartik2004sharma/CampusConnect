"use client";

import { useEffect, useState, useContext } from 'react';
import api from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import { Users, FileText, CalendarDays, BookOpen, AlertTriangle, Shield, Building2, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['var(--color-status-success)', 'var(--color-brand-primary)', 'var(--color-status-warning)', 'var(--color-status-danger)', 'var(--color-brand-accent)'];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ users: {}, grievances: [], events: {}, sessions: {} });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [res, activityRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/recent-activity')
        ]);
        setData(res.data);
        setRecentActivity(activityRes.data.activity);
      } catch (error) {
        console.error('Error fetching admin analytics', error);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 bg-[var(--color-bg-subtle)] rounded-2xl"></div>
        <div className="h-96 bg-[var(--color-bg-subtle)] rounded-2xl"></div>
      </div>
    </div>
  );

  const grievanceChartData = data.grievances.map(g => ({
    name: g._id,
    value: g.count
  }));

  const totalGrievances = data.grievances.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-bg-elevated)] to-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-xl flex items-center justify-center border border-[var(--color-brand-primary)]/20 shadow-sm">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Admin Console</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Platform overview and system health metrics.</p>
          </div>
        </div>
        <div className="relative z-10 flex gap-3">
          <button className="bg-[var(--color-status-danger)]/10 hover:bg-[var(--color-status-danger)]/20 text-[var(--color-status-danger)] border border-[var(--color-status-danger)]/20 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm flex items-center gap-2">
            <AlertTriangle size={18} /> System Alert
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm flex flex-col justify-between hover:border-[var(--color-brand-primary)]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-lg flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="flex items-center text-[var(--color-status-success)] text-xs font-bold bg-[var(--color-status-success)]/10 px-2 py-1 rounded-md">
              <TrendingUp size={12} className="mr-1" /> +12%
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{data.users.total || 0}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">Total Users</p>
          </div>
        </div>
        
        <div className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm flex flex-col justify-between hover:border-[var(--color-brand-primary)]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-[var(--color-status-warning)]/10 text-[var(--color-status-warning)] rounded-lg flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{totalGrievances}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">Total Complaints</p>
          </div>
        </div>
        
        <div className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm flex flex-col justify-between hover:border-[var(--color-brand-primary)]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] rounded-lg flex items-center justify-center">
              <Building2 size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{data.events.total || 0}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">Campus Events</p>
          </div>
        </div>
        
        <div className="bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm flex flex-col justify-between hover:border-[var(--color-brand-primary)]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-[var(--color-status-info)]/10 text-[var(--color-status-info)] rounded-lg flex items-center justify-center">
              <BookOpen size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{data.sessions.total || 0}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">Mentorship Sessions</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl p-6 h-[400px] shadow-sm flex flex-col">
          <h2 className="text-lg font-bold tracking-tight mb-6 shrink-0">Complaint Distribution</h2>
          <div className="flex-1 min-h-0 relative">
            {grievanceChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={grievanceChartData} 
                    cx="50%" cy="45%" 
                    innerRadius={80} outerRadius={110} 
                    paddingAngle={5} 
                    dataKey="value"
                    stroke="none"
                  >
                    {grievanceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    itemStyle={{ color: 'var(--color-text-primary)', fontWeight: '600' }} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-muted)] border-2 border-dashed border-[var(--color-border-default)] rounded-xl">
                <PieChart size={32} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No complaint data available</p>
              </div>
            )}
            
            {/* Center Text */}
            {grievanceChartData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-bold text-[var(--color-text-primary)]">{totalGrievances}</span>
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Total</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl p-0 h-[400px] flex flex-col shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[var(--color-border-default)] bg-[var(--color-bg-subtle)]/50 shrink-0">
            <h2 className="text-lg font-bold tracking-tight">System Activity Log</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 hover:bg-[var(--color-bg-subtle)] rounded-xl transition-colors border border-transparent hover:border-[var(--color-border-default)] group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      act.type === 'grievance' ? 'bg-[var(--color-status-warning)]/10 text-[var(--color-status-warning)] border border-[var(--color-status-warning)]/20' :
                      act.type === 'event' ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20' :
                      'bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] border border-[var(--color-brand-accent)]/20'
                    }`}>
                      {act.type === 'grievance' ? <FileText size={18} /> : 
                       act.type === 'event' ? <CalendarDays size={18} /> : 
                       <Users size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{act.label}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 truncate">{act.sub}</p>
                    </div>
                    <div className="shrink-0 text-[11px] font-medium text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] px-2.5 py-1 rounded-full group-hover:bg-[var(--color-bg-elevated)] group-hover:border group-hover:border-[var(--color-border-default)] transition-colors">
                      {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                <Activity size={32} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">No recent system activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
