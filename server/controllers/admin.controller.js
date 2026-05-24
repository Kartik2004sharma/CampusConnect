const { User, Grievance, Event, MentorshipSession, Notice } = require('../models');

exports.getSystemAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const faculty = await User.countDocuments({ role: 'faculty' });
    
    const grievances = await Grievance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const events = await Event.countDocuments();
    const sessions = await MentorshipSession.countDocuments();

    res.status(200).json({
      users: { total: totalUsers, students, faculty },
      grievances,
      events: { total: events },
      sessions: { total: sessions }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;
    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.status(200).json({ user, message: 'Role updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');
    res.status(200).json({ user, message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.manageEvents = async (req, res) => {
  // Create event logic for admin (similar to what we'd do in event routes)
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ event, message: 'Event created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGrievancePipeline = async (req, res) => {
  try {
    const grievances = await Grievance.find().populate('studentId', 'name').populate('assignedTo', 'name');
    res.status(200).json({ grievances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
