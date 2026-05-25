import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Video, Calendar, User, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

const MentorshipPage = () => {
  const [sessions, setSessions] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    facultyId: '',
    scheduledAt: '',
    topic: ''
  });

  useEffect(() => {
    fetchSessions();
    fetchFaculties();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/students/mentor-sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      toast.error('Failed to fetch mentorship sessions');
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await api.get('/students/faculties');
      setFaculties(response.data.faculties);
    } catch (error) {
      toast.error('Failed to fetch faculties');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.facultyId || !formData.scheduledAt) {
      toast.error('Faculty and Date are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/students/mentor-sessions', formData);
      toast.success('Mentorship session requested successfully!');
      setFormData({ facultyId: '', scheduledAt: '', topic: '' });
      setShowForm(false);
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to request session');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center bg-surface-2 border border-white/10 rounded-2xl p-6">
        <div>
          <h1 className="text-3xl font-sora font-bold">Mentorship</h1>
          <p className="text-gray-400 mt-1">Connect with faculty for guidance and career support.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
        >
          {showForm ? 'Cancel' : 'Book a Session'}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-2 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-6">Request a Mentorship Session</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Faculty *</label>
                <select
                  name="facultyId"
                  value={formData.facultyId}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">-- Select Faculty --</option>
                  {faculties.map(faculty => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name} ({faculty.department || 'General'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Date & Time *</label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Topic / Goal</label>
              <textarea
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="What would you like to discuss?"
                rows="3"
                className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-opacity disabled:opacity-50"
            >
              {loading ? 'Submitting Request...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-sora font-semibold">Your Sessions</h2>
        {sessions.length === 0 ? (
          <div className="bg-surface-2 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
            You don't have any mentorship sessions scheduled.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map(session => (
              <div key={session._id} className="bg-surface-2 p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                        {session.facultyId?.name?.charAt(0) || 'F'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{session.facultyId?.name}</h3>
                        <p className="text-xs text-gray-400">{session.facultyId?.department}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border uppercase tracking-wider font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar size={16} className="text-gray-500" />
                      {new Date(session.scheduledAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Clock size={16} className="text-gray-500" />
                      {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration} mins)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FileText size={16} className="text-gray-500" />
                      <span className="truncate">{session.sessionNotes || 'No topic specified'}</span>
                    </div>
                  </div>
                </div>

                {session.status === 'approved' && session.meetLink && (
                  <a
                    href={session.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 py-2.5 rounded-xl transition-colors text-sm font-medium"
                  >
                    <Video size={18} /> Join Meeting
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipPage;
