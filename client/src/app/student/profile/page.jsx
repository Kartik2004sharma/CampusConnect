"use client";

import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { User, Mail, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/students/profile', formData);
      setUser(res.data.user);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-surface-2 border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto mt-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-5xl font-bold text-white shadow-xl">
              {user.name?.charAt(0)}
            </div>
            <span className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs uppercase tracking-wider font-semibold">
              {user.role}
            </span>
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-3xl font-sora font-bold">{user.name}</h1>
                <p className="text-gray-400 mt-1 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-green-400" /> Account Verified
                </p>
              </div>
              <button 
                onClick={() => setEditing(!editing)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl transition-colors text-sm"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full bg-surface border border-white/5 rounded-xl p-3 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Department</label>
                    <input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-gray-400 border border-white/5">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Full Name</p>
                    <p className="font-medium text-lg">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-gray-400 border border-white/5">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email Address</p>
                    <p className="font-medium text-lg">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-gray-400 border border-white/5">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Department</p>
                    <p className="font-medium text-lg">{user.department || 'Not Specified'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-gray-400 border border-white/5">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Role</p>
                    <p className="font-medium text-lg capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
