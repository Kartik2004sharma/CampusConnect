"use client";

import { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MeteorLogo from '../components/MeteorLogo';
import { AuthContext } from '@/context/AuthContext';
import { Bell, Menu, Search, X, LayoutDashboard, FileText, CalendarDays, BookOpen, User, Users, Shield } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';

const AppShell = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getLinks = () => {
    const role = user?.role || 'student';
    switch (role) {
      case 'admin':
        return [
          { name: 'Console', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Complaints', path: '/admin/pipeline', icon: <Shield size={20} /> },
          { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
          { name: 'Events', path: '/admin/events', icon: <CalendarDays size={20} /> },
        ];
      case 'faculty':
        return [
          { name: 'Work Queue', path: '/staff/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Complaints', path: '/staff/complaints', icon: <FileText size={20} /> },
          { name: 'Notices', path: '/staff/notices', icon: <BookOpen size={20} /> },
          { name: 'Mentorship', path: '/staff/mentorship', icon: <Users size={20} /> },
        ];
      default:
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Helpdesk', path: '/student/complaints', icon: <FileText size={20} /> },
          { name: 'Events', path: '/student/events', icon: <CalendarDays size={20} /> },
          { name: 'Mentorship', path: '/student/mentorship', icon: <BookOpen size={20} /> },
          { name: 'Lost & Found', path: '/student/lost-found', icon: <Search size={20} /> },
          { name: 'Profile', path: '/student/profile', icon: <User size={20} /> },
        ];
    }
  };

  const links = getLinks();
  const getRoleLabel = () => {
    if (user?.role === 'admin') return 'System Admin';
    if (user?.role === 'faculty') return 'Staff / Faculty';
    return 'Student';
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)] font-sans overflow-hidden selection:bg-[var(--color-brand-primary)] selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[var(--color-bg-page)]/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--color-bg-surface)] border-r border-[var(--color-border-default)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-border-default)] justify-between shrink-0">
          <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2 group">
            <img src="/logo.jpg" alt="CampusConnect" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
            CampusConnect
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-1 flex-1 overflow-y-auto custom-scrollbar">
          {links.map(link => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--color-brand-primary)] text-white shadow-sm shadow-[var(--color-brand-primary)]/20' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[var(--color-border-default)] shrink-0 bg-[var(--color-bg-surface)]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-brand-primary)] font-bold text-lg shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-[var(--color-text-primary)]">{user?.name || 'User'}</p>
              <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider truncate">{getRoleLabel()}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-[var(--color-status-danger)] hover:bg-[var(--color-status-danger)]/10 transition-colors border border-transparent hover:border-[var(--color-status-danger)]/20"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="h-16 bg-[var(--color-bg-surface)]/80 backdrop-blur-md border-b border-[var(--color-border-default)] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-2 -ml-2 rounded-lg hover:bg-[var(--color-bg-subtle)] transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-brand-primary)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-64 bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-full pl-9 pr-4 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-brand-accent)] rounded-full border border-[var(--color-bg-surface)]"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>

        {/* Global AI Assistant for all roles (or scoped if needed) */}
        {user?.role === 'student' && <AIAssistant />}
      </main>
    </div>
  );
};

export default AppShell;
