import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const GrievancePage = () => {
  const [grievances, setGrievances] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const response = await api.get('/students/grievances');
      setGrievances(response.data.grievances);
    } catch (error) {
      toast.error('Failed to fetch grievances');
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
    
    if (!formData.category || !formData.title || !formData.description) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/students/grievances', formData);
      toast.success(`Grievance submitted! Tracking ID: ${response.data.trackingId}`);
      setFormData({ category: '', title: '', description: '' });
      setShowForm(false);
      fetchGrievances();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-900 text-yellow-200',
      inProgress: 'bg-blue-900 text-blue-200',
      resolved: 'bg-green-900 text-green-200',
      escalated: 'bg-red-900 text-red-200'
    };
    return colors[status] || 'bg-gray-900 text-gray-200';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-sora font-bold text-white">Grievance Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Submit New Grievance'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Submit a New Grievance</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a category</option>
                <option value="academic">Academic</option>
                <option value="hostel">Hostel</option>
                <option value="facilities">Facilities</option>
                <option value="ragging">Ragging</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief title of your grievance"
                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of your grievance"
                rows="5"
                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600"
            >
              {loading ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Your Grievances</h2>
        {grievances.length === 0 ? (
          <p className="text-gray-400">No grievances submitted yet.</p>
        ) : (
          grievances.map(grievance => (
            <div key={grievance._id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white">{grievance.title}</h3>
                  <p className="text-sm text-gray-400">ID: {grievance.trackingId}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(grievance.status)}`}>
                  {grievance.status}
                </span>
              </div>
              <p className="text-gray-300 mb-2">{grievance.description}</p>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Category: <strong>{grievance.category}</strong></span>
                <span>Submitted: {new Date(grievance.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GrievancePage;
