const { Notice, Event, Grievance, MentorshipSession, Recommendation } = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Fetch latest 5 notices (targetAudience: all/students)
    const notices = await Notice.find({
      targetAudience: { $in: ['all', 'students'] }
    }).sort({ createdAt: -1 }).limit(5).populate('postedBy', 'name profileImage');

    // Fetch upcoming 3 events not registered by student
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      registeredStudents: { $ne: studentId }
    }).sort({ date: 1 }).limit(3);

    // Fetch student's grievances (last 3, sorted by updatedAt)
    const grievances = await Grievance.find({ studentId })
      .sort({ updatedAt: -1 }).limit(3);

    // Fetch student's upcoming mentorship sessions
    const upcomingSessions = await MentorshipSession.find({
      studentId,
      scheduledAt: { $gte: new Date() },
      status: { $in: ['pending', 'approved'] }
    }).sort({ scheduledAt: 1 }).populate('facultyId', 'name department profileImage');

    // Fetch AI recommendations
    const recommendations = await Recommendation.findOne({ studentId });

    res.status(200).json({
      notices,
      upcomingEvents,
      grievances,
      upcomingSessions,
      recommendations: recommendations ? recommendations.recommendations : []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json({ grievances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    // Static seeded timetable for demonstration
    const timetable = [
      { day: 'Monday', slots: [{ time: '09:00', subject: 'Data Structures' }] },
      { day: 'Tuesday', slots: [{ time: '10:00', subject: 'Operating Systems' }] }
    ];
    res.status(200).json({ timetable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ registeredStudents: req.user._id })
      .sort({ date: 1 });
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyMentorSessions = async (req, res) => {
  try {
    const sessions = await MentorshipSession.find({ studentId: req.user._id })
      .sort({ scheduledAt: -1 }).populate('facultyId', 'name department profileImage');
    res.status(200).json({ sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
