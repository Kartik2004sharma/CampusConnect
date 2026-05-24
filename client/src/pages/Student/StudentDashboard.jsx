import { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { format } from 'date-fns';
import { Activity, BellRing, CalendarDays } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ notices: [], upcomingEvents: [], grievances: [], upcomingSessions: [], recommendations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/students/dashboard');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-white/5 rounded-xl"></div><div className="h-64 bg-white/5 rounded-xl"></div></div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Bar */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-sora font-bold">Good morning, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>
        <div className="bg-surface-2 px-4 py-2 rounded-xl border border-white/10 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">CGPA</p>
          <p className="text-2xl font-bold text-accent">8.5</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center"><Activity /></div>
          <div>
            <p className="text-2xl font-bold">{data.grievances.length}</p>
            <p className="text-sm text-gray-400">Active Grievances</p>
          </div>
        </div>
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center"><CalendarDays /></div>
          <div>
            <p className="text-2xl font-bold">{data.upcomingEvents.length}</p>
            <p className="text-sm text-gray-400">Upcoming Events</p>
          </div>
        </div>
        <div className="bg-surface-2 p-5 rounded-xl border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center"><BellRing /></div>
          <div>
            <p className="text-2xl font-bold">{data.notices.length}</p>
            <p className="text-sm text-gray-400">Recent Notices</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notices */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-sora font-semibold border-b border-white/10 pb-2">Recent Notices</h2>
          <div className="space-y-3">
            {data.notices.map(notice => (
              <div key={notice._id} className="bg-surface-2 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{notice.title}</h3>
                  <span className="text-xs text-gray-500">{format(new Date(notice.createdAt), 'MMM dd')}</span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{notice.content}</p>
              </div>
            ))}
            {data.notices.length === 0 && <p className="text-gray-500">No recent notices.</p>}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4">
          <h2 className="text-xl font-sora font-semibold border-b border-white/10 pb-2 flex items-center gap-2">
            ✨ AI Picks for You
          </h2>
          <div className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <div key={i} className="bg-gradient-to-br from-surface-2 to-surface border border-white/10 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs uppercase tracking-wider text-accent">{rec.type}</span>
                  <span className="text-xs font-bold text-green-400">{Math.round(rec.score * 100)}% Match</span>
                </div>
                <h3 className="font-medium text-white line-clamp-1">{rec.itemTitle}</h3>
                <p className="text-xs text-gray-400 mt-1">{rec.reason}</p>
              </div>
            ))}
            {data.recommendations.length === 0 && (
              <div className="bg-surface-2 p-6 text-center rounded-xl border border-dashed border-white/20">
                <p className="text-gray-400 text-sm">Our AI is learning your preferences. Check back tomorrow!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
