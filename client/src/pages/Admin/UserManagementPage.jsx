import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, Shield, UserX, CheckCircle, Search, MoreVertical, Edit, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null); // For role change modal
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
      case 'admin': return <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Admin</span>;
      case 'faculty': return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Faculty</span>;
      default: return <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Student</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-sora font-bold text-white">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage accounts, roles, and access across the platform.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-surface border border-white/10 rounded-xl p-2 text-sm text-gray-300 focus:outline-none focus:border-primary shrink-0"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admins</option>
          </select>
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8 text-gray-400">Loading users...</div>
      ) : (
        <div className="bg-surface-2 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-white/5 text-gray-300 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-2xl">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <Users size={32} className="mx-auto text-gray-600 mb-2" />
                      <p>No users found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium"><CheckCircle size={14} /> Active</span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400 text-xs font-medium"><UserX size={14} /> Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => { setSelectedUser(user); setNewRole(user.role); }}
                          className="text-gray-400 hover:text-white p-2 bg-surface rounded-lg border border-white/5 transition-colors"
                          title="Change Role"
                        >
                          <Shield size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeactivate(user._id, user.isActive)}
                          className={`${user.isActive ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-emerald-400'} p-2 bg-surface rounded-lg border border-white/5 transition-colors`}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.isActive ? <UserX size={16} /> : <CheckCircle size={16} />}
                        </button>
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-sora font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert size={20} className="text-primary" /> Change User Role
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Select a new role for <span className="text-white font-semibold">{selectedUser.name}</span> ({selectedUser.email}). This will affect their permissions immediately.
            </p>
            <form onSubmit={handleChangeRole}>
              <div className="space-y-3 mb-6">
                {['student', 'faculty', 'admin'].map(role => (
                  <label key={role} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${newRole === role ? 'border-primary bg-primary/10' : 'border-white/10 bg-surface-2 hover:border-white/20'}`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value={role} 
                      checked={newRole === role} 
                      onChange={() => setNewRole(role)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${newRole === role ? 'border-primary' : 'border-gray-500'}`}>
                      {newRole === role && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="capitalize font-medium text-white">{role}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedUser(null)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-colors">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
