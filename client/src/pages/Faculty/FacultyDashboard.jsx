import { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { Users, FileText, CheckCircle, BookOpen } from 'lucide-react';

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

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-white/5 rounded-xl"></div></div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-surface-2 border border-white/10 rounded-2xl p-6">
        <h1 className="text-3xl font-sora font-bold">Faculty Portal - {user?.name}</h1>
        <p className="text-gray-400 mt-1">Manage your sessions, notices, and assigned grievances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center"><CheckCircle /></div>
          <div>
            <p className="text-2xl font-bold">{data.stats.assignedGrievances}</p>
            <p className="text-sm text-gray-400">Open Grievances</p>
          </div>
        </div>
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center"><BookOpen /></div>
          <div>
            <p className="text-2xl font-bold">{data.stats.pendingSessions}</p>
            <p className="text-sm text-gray-400">Pending Sessions</p>
          </div>
        </div>
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center"><FileText /></div>
          <div>
            <p className="text-2xl font-bold">{data.stats.publishedNotices}</p>
            <p className="text-sm text-gray-400">Published Notices</p>
          </div>
        </div>
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center"><Users /></div>
          <div>
            <p className="text-2xl font-bold">{data.stats.mentoredStudents}</p>
            <p className="text-sm text-gray-400">Mentored Students</p>
          </div>
        </div>
      </div>
      
      {/* Activity feed placeholder */}
      <div className="bg-surface-2 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-sora font-semibold border-b border-white/10 pb-2 mb-4">Recent Activity</h2>
        <p className="text-gray-400">Your recent actions will appear here.</p>
      </div>
    </div>
  );
};

export default FacultyDashboard;
