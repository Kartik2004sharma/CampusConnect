import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FileText, CheckCircle, Clock, AlertTriangle, AlertCircle, UserCheck, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const GrievancePipelinePage = () => {
  const [grievances, setGrievances] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  
  const [assignData, setAssignData] = useState({ id: null, facultyId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [grievanceRes, facultyRes] = await Promise.all([
        api.get('/admin/grievance-pipeline'),
        api.get('/students/faculties') // Reuse this endpoint to get list of faculties
      ]);
      setGrievances(grievanceRes.data.grievances);
      setFaculties(facultyRes.data.faculties);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e, id) => {
    e.preventDefault();
    if (!assignData.facultyId) return toast.error('Please select a faculty member');
    
    try {
      await api.patch(`/admin/grievances/${id}/assign`, { assignedTo: assignData.facultyId });
      toast.success('Grievance assigned successfully!');
      setAssignData({ id: null, facultyId: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to assign grievance');
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved': return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">Resolved</span>;
      case 'inProgress': return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">In Progress</span>;
      default: return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">Pending</span>;
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-400">Loading grievance pipeline...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-sora font-bold text-white">Grievance Pipeline</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor, route, and oversee all campus grievances.</p>
      </div>

      <div className="space-y-4">
        {grievances.length === 0 ? (
          <div className="text-center p-12 bg-surface-2 border border-white/10 rounded-2xl">
            <Shield size={48} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400">No grievances in the pipeline.</p>
          </div>
        ) : (
          grievances.map(grievance => (
            <div key={grievance._id} className="bg-surface-2 border border-white/10 rounded-2xl overflow-hidden transition-colors hover:border-white/20">
              {/* Header Section */}
              <div 
                className="p-5 cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                onClick={() => setExpandedId(expandedId === grievance._id ? null : grievance._id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-primary text-sm font-semibold tracking-wider">#{grievance.trackingId}</span>
                    {getStatusBadge(grievance.status)}
                    <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {getPriorityIcon(grievance.priority)} {grievance.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-sora font-semibold text-white mb-1">{grievance.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-1">{grievance.description}</p>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right hidden md:block">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Student</p>
                    <p className="text-gray-300 font-medium">{grievance.studentId?.name || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Assigned To</p>
                    {grievance.assignedTo ? (
                      <p className="text-emerald-400 font-medium flex items-center gap-1 justify-end"><UserCheck size={14} /> {grievance.assignedTo.name}</p>
                    ) : (
                      <p className="text-amber-400 font-medium">Unassigned</p>
                    )}
                  </div>
                  <div className="text-gray-400">
                    {expandedId === grievance._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Expanded Details Section */}
              {expandedId === grievance._id && (
                <div className="p-5 border-t border-white/10 bg-surface/50 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Full Description</h4>
                      <div className="bg-surface p-4 rounded-xl border border-white/5 text-sm text-gray-300 whitespace-pre-wrap">
                        {grievance.description}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Timeline & History</h4>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                        {grievance.timeline.map((event, idx) => (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-surface-2 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                              <Clock size={16} />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-surface-2 shadow">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm text-white">{event.action}</span>
                                <span className="text-[10px] text-gray-500">{new Date(event.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-gray-400">{event.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Assignment Panel */}
                  <div className="bg-surface p-5 rounded-xl border border-white/5 h-fit">
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Shield size={16} className="text-primary" /> Routing & Assignment
                    </h4>
                    
                    {grievance.status === 'resolved' ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg text-sm text-center">
                        This grievance has been resolved and is closed.
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleAssign(e, grievance._id)} className="space-y-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-2">Assign to Faculty Member</label>
                          <select 
                            value={assignData.id === grievance._id ? assignData.facultyId : ''} 
                            onChange={e => setAssignData({ id: grievance._id, facultyId: e.target.value })}
                            className="w-full bg-surface-2 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-primary focus:outline-none"
                          >
                            <option value="">Select Faculty...</option>
                            {faculties.map(f => (
                              <option key={f._id} value={f._id}>{f.name} ({f.department})</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          type="submit" 
                          disabled={!assignData.facultyId || assignData.id !== grievance._id}
                          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
                        >
                          {grievance.assignedTo ? 'Re-assign Grievance' : 'Assign Grievance'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GrievancePipelinePage;
