import { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EventsPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/students/events/all');
      setEvents(res.data.events);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/students/events/${eventId}/register`);
      toast.success('Successfully registered for the event!');
      fetchEvents(); // Refresh to show "Registered" state
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.category === filter);

  if (loading) return <div className="text-center p-8 text-gray-400">Loading events...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-sora font-bold text-white">Campus Events</h1>
          <p className="text-gray-400 text-sm mt-1">Discover and register for upcoming events.</p>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-surface border border-white/10 rounded-xl p-2.5 text-sm text-gray-300 focus:outline-none focus:border-primary"
        >
          <option value="all">All Categories</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="fest">Fest</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-surface-2 border border-white/10 rounded-2xl">
            <p className="text-gray-400">No upcoming events found.</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const isRegistered = event.registeredStudents.includes(user?._id);
            const isFull = event.maxParticipants && event.registeredStudents.length >= event.maxParticipants;
            
            return (
              <div key={event._id} className="bg-surface-2 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md">
                      {event.category}
                    </span>
                    {isRegistered && (
                      <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                        <CheckCircle size={14} /> Registered
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-sora font-semibold text-white mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar size={16} className="text-primary" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin size={16} className="text-primary" />
                      {event.venue}
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Users size={16} className="text-primary" />
                        {event.registeredStudents.length} / {event.maxParticipants} Registered
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleRegister(event._id)}
                  disabled={isRegistered || isFull}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isRegistered 
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : isFull
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  {isRegistered ? 'Registered' : isFull ? 'Event Full' : 'Register Now'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventsPage;
