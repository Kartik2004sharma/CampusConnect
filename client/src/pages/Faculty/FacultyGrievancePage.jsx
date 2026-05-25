import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FileText, CheckCircle, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyGrievancePage = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState({ id: null, status: 'inProgress', note: '' });

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await api.get('/faculty/grievances');
      setGrievances(res.data.grievances);
    } catch (err) {
      toast.error('Failed to load assigned grievances');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e, id) => {
    e.preventDefault();
    if (!statusData.note) return toast.error('Please provide an update note');
    try {
      await api.put(`/faculty/grievances/${id}/status`, { status: statusData.status, note: statusData.note });
      toast.success('Grievance status updated!');
      setStatusData({ id: null, status: 'inProgress', note: '' });
      fetchGrievances();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle size={14} className="text-red-400" />;
      case 'medium': return <AlertCircle size={14} className="text-amber-400" />;
      case 'low': return <CheckCircle size={14} className="text-green-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'inProgress': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-400">Loading grievances...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-sora font-bold text-white">Assigned Grievances</h1>
        <p className="text-gray-400 text-sm mt-1">Review and resolve student issues assigned to you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {grievances.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-surface-2 border border-white/10 rounded-2xl">
            <FileText size={48} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400">No grievances assigned to you.</p>
          </div>
        ) : (
          grievances.map(grievance => (
            <div key={grievance._id} className="bg-surface-2 border border-white/10 p-6 rounded-2xl flex flex-col hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md">
                    {grievance.category}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md border ${getStatusColor(grievance.status)}`}>
                    {grievance.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {getPriorityIcon(grievance.priority)} {grievance.priority}
                </div>
              </div>
              
              <h3 className="text-lg font-sora font-semibold text-white mb-2">{grievance.title}</h3>
              <p className="text-sm text-gray-400 mb-4 whitespace-pre-wrap">{grievance.description}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <span>Student: {grievance.studentId?.name || 'Unknown'}</span>
                <span>•</span>
                <span>ID: {grievance.trackingId}</span>
              </div>

              {grievance.status !== 'resolved' && statusData.id !== grievance._id && (
                <button 
                  onClick={() => setStatusData({ id: grievance._id, status: 'inProgress', note: '' })}
                  className="mt-auto w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2"
                >
                  <CheckCircle size={16} /> Update Status
                </button>
              )}

              {statusData.id === grievance._id && (
                <form onSubmit={(e) => handleUpdateStatus(e, grievance._id)} className="mt-auto p-4 bg-surface rounded-xl border border-primary/30">
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Change Status</label>
                  <select 
                    value={statusData.status} 
                    onChange={e => setStatusData({...statusData, status: e.target.value})}
                    className="w-full bg-surface-2 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-primary focus:outline-none mb-3"
                  >
                    <option value="inProgress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Resolution Note</label>
                  <textarea 
                    rows="2"
                    required
                    value={statusData.note}
                    onChange={(e) => setStatusData({...statusData, note: e.target.value})}
                    placeholder="Describe what action was taken..."
                    className="w-full bg-surface-2 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-primary focus:outline-none mb-3" 
                  />
                  
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStatusData({ id: null, status: 'inProgress', note: '' })} className="flex-1 bg-white/5 text-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-semibold transition-colors">Save Update</button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyGrievancePage;
