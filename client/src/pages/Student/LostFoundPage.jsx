import { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { MapPin, Phone, Search, Plus, CheckCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const LostFoundPage = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lost');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'lost',
    itemName: '',
    description: '',
    location: '',
    contactInfo: ''
  });

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students/lost-found?type=${activeTab}&status=open`);
      setItems(res.data.items);
    } catch (err) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students/lost-found', formData);
      toast.success('Item reported successfully!');
      setShowForm(false);
      setFormData({ type: activeTab, itemName: '', description: '', location: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      toast.error('Failed to report item');
    }
  };

  const handleClaim = async (itemId) => {
    try {
      await api.put(`/students/lost-found/${itemId}/claim`);
      toast.success('Item marked as claimed!');
      fetchItems();
    } catch (err) {
      toast.error('Failed to claim item');
    }
  };

  const filteredItems = items.filter(item => 
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-sora font-bold text-white">Lost & Found</h1>
          <p className="text-gray-400 text-sm mt-1">Report or find lost items on campus.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setFormData({...formData, type: activeTab}); }}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Report Item</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-2 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-sora font-semibold text-white mb-4">Report an Item</h2>
          <form onSubmit={handleReport} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Item Type</label>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary">
                  <option value="lost">I lost something</option>
                  <option value="found">I found something</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Item Name</label>
                <input required type="text" placeholder="e.g. Blue Backpack" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea required rows="2" placeholder="Brand, color, identifiable marks..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location Lost/Found</label>
                <input required type="text" placeholder="e.g. Library 2nd Floor" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Contact Info</label>
                <input required type="text" placeholder="Phone number or email" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors">Submit Report</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-2 p-2 rounded-xl border border-white/10">
        <div className="flex w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('lost')}
            className={`flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'lost' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Lost Items
          </button>
          <button 
            onClick={() => setActiveTab('found')}
            className={`flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'found' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Found Items
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8 text-gray-400">Loading items...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-surface-2 border border-white/10 rounded-2xl">
              <Package size={48} className="mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400">No {activeTab} items found.</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item._id} className="bg-surface-2 border border-white/10 p-5 rounded-2xl flex flex-col hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-sora font-semibold text-white">{item.itemName}</h3>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md ${
                    item.type === 'lost' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4 flex-1">{item.description}</p>
                
                <div className="space-y-2 mb-4 p-3 bg-surface rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <MapPin size={14} className="text-primary" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Phone size={14} className="text-primary" />
                    <span>{item.contactInfo}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/5">
                  <div className="text-xs text-gray-500">
                    Reported by: <span className="text-gray-300">{item.reportedBy?.name || 'Unknown'}</span>
                  </div>
                  {(item.reportedBy?._id === user?._id || user?.role === 'admin') && (
                    <button 
                      onClick={() => handleClaim(item._id)}
                      className="text-xs flex items-center gap-1 text-primary hover:text-indigo-400 transition-colors"
                    >
                      <CheckCircle size={14} /> Mark Claimed
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LostFoundPage;
