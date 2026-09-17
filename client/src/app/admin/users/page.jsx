"use client";

import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Users, Shield, UserX, CheckCircle, Search, Edit, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('student');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      await api.put(`/admin/users/${id}/deactivate`, { isActive: !currentStatus });
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to change user status');
    }
  };

  const handleChangeRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.put(`/admin/users/${selectedUser._id}/role`, { role: newRole });
      toast.success('User role updated!');
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to change user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <span className="bg-[var(--color-status-danger)]/10 text-[var(--color-status-danger)] border border-[var(--color-status-danger)]/20 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">Admin</span>;
      case 'faculty': return <span className="bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] border border-[var(--color-status-success)]/20 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">Staff / Faculty</span>;
      default: return <span className="bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">Student</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up relative pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--color-bg-elevated)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">User Management</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">Manage accounts, roles, and access across the platform.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-xl p-2.5 text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] shrink-0 transition-all"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty / Staff</option>
            <option value="admin">Admins</option>
          </select>
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-[var(--color-bg-subtle)] rounded-2xl"></div>
          <div className="h-64 bg-[var(--color-bg-subtle)] rounded-2xl"></div>
        </div>
      ) : (
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--color-text-secondary)]">
              <thead className="bg-[var(--color-bg-subtle)]/50 text-[var(--color-text-muted)] uppercase text-[10px] tracking-wider font-bold border-b border-[var(--color-border-default)]">
                <tr>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-default)]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <Users size={32} className="mx-auto text-[var(--color-border-strong)] mb-3" />
                      <p className="text-[var(--color-text-primary)] font-bold mb-1">No users found</p>
                      <p className="text-[var(--color-text-secondary)] text-sm">Adjust your search or filter criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-[var(--color-bg-subtle)] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center font-bold text-sm shrink-0 border border-[var(--color-brand-primary)]/20 shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[var(--color-text-primary)] font-bold">{user.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="flex items-center gap-1.5 text-[var(--color-status-success)] text-xs font-bold uppercase tracking-wider"><CheckCircle2 size={14} /> Active</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[var(--color-status-danger)] text-xs font-bold uppercase tracking-wider"><UserX size={14} /> Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setSelectedUser(user); setNewRole(user.role); }}
                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] p-2 bg-[var(--color-bg-surface)] hover:bg-[var(--color-brand-primary)]/10 rounded-lg border border-[var(--color-border-default)] transition-colors shadow-sm"
                            title="Change Role"
                          >
                            <Shield size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeactivate(user._id, user.isActive)}
                            className={`${user.isActive ? 'text-[var(--color-text-secondary)] hover:text-[var(--color-status-danger)] hover:bg-[var(--color-status-danger)]/10' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-status-success)] hover:bg-[var(--color-status-success)]/10'} p-2 bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-default)] transition-colors shadow-sm`}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.isActive ? <UserX size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
              <ShieldAlert size={20} className="text-[var(--color-brand-primary)]" /> Change User Role
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Select a new role for <span className="text-[var(--color-text-primary)] font-bold">{selectedUser.name}</span>. This will affect their permissions immediately.
            </p>
            <form onSubmit={handleChangeRole}>
              <div className="space-y-3 mb-6">
                {['student', 'faculty', 'admin'].map(role => (
                  <label key={role} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${newRole === role ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-sm' : 'border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] hover:border-[var(--color-border-strong)]'}`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value={role} 
                      checked={newRole === role} 
                      onChange={() => setNewRole(role)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${newRole === role ? 'border-[var(--color-brand-primary)]' : 'border-[var(--color-text-muted)]'}`}>
                      {newRole === role && <div className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)]" />}
                    </div>
                    <span className="capitalize font-bold text-[var(--color-text-primary)] text-sm">{role === 'faculty' ? 'Faculty / Staff' : role}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedUser(null)} className="px-5 py-2.5 rounded-full text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-full text-sm font-bold bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white shadow-sm transition-all">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
