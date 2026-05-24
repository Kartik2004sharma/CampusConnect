import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { LogOut, LayoutDashboard, FileText, Calendar, BookOpen, Search, User } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import AIAssistant from '../components/AIAssistant';

const StudentLayout = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div className="flex h-screen bg-surface text-text">
      <aside className="w-64 bg-surface-2 border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10 text-center">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <h3 className="font-sora font-semibold">{user?.name}</h3>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full uppercase tracking-wider">{user?.role}</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/student/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/student/events" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"><Calendar size={20} /> Events</Link>
          <Link to="/student/grievances" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"><FileText size={20} /> Grievances</Link>
          <Link to="/student/lost-found" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"><Search size={20} /> Lost & Found</Link>
          <Link to="/student/mentorship" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"><BookOpen size={20} /> Mentorship</Link>
          <Link to="/student/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"><User size={20} /> Profile</Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
      
      <AIAssistant />
    </div>
  );
};

export default StudentLayout;
