import { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { Users, FileText, CalendarDays, BookOpen, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ users: {}, grievances: [], events: {}, sessions: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching admin analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-white/5 rounded-xl"></div></div>;

  const grievanceChartData = data.grievances.map(g => ({
    name: g._id,
    value: g.count
  }));

  return (
    <div className="space-y-8 animate-fade-in-up p-8">
      <div className="flex justify-between items-center bg-surface-2 border border-white/10 rounded-2xl p-6">
        <div>
          <h1 className="text-3xl font-sora font-bold">Admin Control Panel</h1>
          <p className="text-gray-400 mt-1">System Overview & Analytics</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <AlertTriangle size={18} /> Emergency Alert
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-2xl font-bold">{data.users.total}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center"><Users size={20}/></div>
        </div>
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Events</p>
            <p className="text-2xl font-bold">{data.events.total}</p>
          </div>
          <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center"><CalendarDays size={20}/></div>
        </div>
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Grievances</p>
            <p className="text-2xl font-bold">{data.grievances.reduce((acc, curr) => acc + curr.count, 0)}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center"><FileText size={20}/></div>
        </div>
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Mentorship Sessions</p>
            <p className="text-2xl font-bold">{data.sessions.total}</p>
          </div>
          <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center"><BookOpen size={20}/></div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-2 border border-white/10 rounded-2xl p-6 h-80">
          <h2 className="text-xl font-sora font-semibold mb-4">Grievance Status</h2>
          {grievanceChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={grievanceChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {grievanceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#2A2A3E', borderColor: '#4F46E5', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
          )}
        </div>
        
        <div className="bg-surface-2 border border-white/10 rounded-2xl p-6 h-80">
          <h2 className="text-xl font-sora font-semibold mb-4">Recent Activity</h2>
          <div className="h-full flex items-center justify-center text-gray-500">Activity table (WIP)</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
