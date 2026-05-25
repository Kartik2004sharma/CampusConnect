import { useState, useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, Bell, Menu, X, Users, Calendar } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from '../context/NotificationContext';
import AIAssistant from '../components/AIAssistant';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { notifications, unreadCount, markRead, markAllRead } = useContext(NotificationContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
      isActive ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="flex h-screen bg-surface text-text overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-surface-2 border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-lg font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h3 className="font-sora font-semibold text-sm">{user?.name}</h3>
              <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{user?.role}</span>
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}><LayoutDashboard size={20} /> Dashboard</NavLink>
          <NavLink to="/admin/users" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}><Users size={20} /> User Management</NavLink>
          <NavLink to="/admin/events" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}><Calendar size={20} /> Events</NavLink>
          <NavLink to="/admin/grievance-pipeline" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}><FileText size={20} /> Grievance Pipeline</NavLink>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-surface z-30 relative">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="font-sora text-lg font-bold tracking-tight text-white hidden md:block">Campus<span className="text-primary">Connect</span> <span className="text-gray-400 text-sm font-normal">Admin</span></h1>
          </div>
          
          {/* Notification Bell */}
          <div className="relative">
            <button 
              className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-surface">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-2 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="font-sora font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary hover:text-indigo-400">Mark all as read</button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">No new notifications</div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          if (notif.id) markRead(notif.id);
                        }}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}
                      >
                        <p className="text-sm text-gray-200">{notif.message}</p>
                        <span className="text-[10px] text-gray-500 mt-1 block">Just now</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet />
        </main>
      </div>
      
      <AIAssistant />
    </div>
  );
};

export default AdminLayout;
