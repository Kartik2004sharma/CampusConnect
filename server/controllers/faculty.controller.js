const { Notice, Grievance, MentorshipSession, User } = require('../models');

exports.getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user._id;

    const assignedGrievances = await Grievance.countDocuments({ assignedTo: facultyId, status: { $ne: 'resolved' } });
    const pendingSessions = await MentorshipSession.countDocuments({ facultyId, status: 'pending' });
    const publishedNotices = await Notice.countDocuments({ postedBy: facultyId });
    
    // For demo purposes, mentored students count based on completed sessions
    const mentoredStudents = await MentorshipSession.countDocuments({ facultyId, status: 'completed' });

    res.status(200).json({
      stats: { assignedGrievances, pendingSessions, publishedNotices, mentoredStudents }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ notices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.publishNotice = async (req, res) => {
  try {
    const { title, content, targetAudience, attachments } = req.body;
    const notice = await Notice.create({
      title, content, targetAudience, attachments, postedBy: req.user._id
    });
    res.status(201).json({ notice, message: 'Notice published successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!notice) return res.status(404).json({ error: 'Notice not found or unauthorized' });
    res.status(200).json({ notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
    if (!notice) return res.status(404).json({ error: 'Notice not found or unauthorized' });
    res.status(200).json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMentorshipRequests = async (req, res) => {
  try {
    const sessions = await MentorshipSession.find({ facultyId: req.user._id, status: 'pending' })
      .populate('studentId', 'name department profileImage');
    res.status(200).json({ sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveSession = async (req, res) => {
  try {
    const session = await MentorshipSession.findOneAndUpdate(
      { _id: req.params.id, facultyId: req.user._id },
      { status: 'approved', meetLink: 'https://meet.google.com/demo-link' },
      { new: true }
    );
    
    const { emitToUser } = require('../socket/socket');
    if (session) {
      emitToUser(session.studentId.toString(), 'session:approved', {
        message: `Your mentorship session has been approved!`,
        meetLink: session.meetLink
      });
    }

    res.status(200).json({ session, message: 'Session approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rescheduleSession = async (req, res) => {
  try {
    const { scheduledAt } = req.body;
    const session = await MentorshipSession.findOneAndUpdate(
      { _id: req.params.id, facultyId: req.user._id },
      { status: 'rescheduled', scheduledAt },
      { new: true }
    );
    res.status(200).json({ session, message: 'Session rescheduled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addSessionNotes = async (req, res) => {
  try {
    const { sessionNotes } = req.body;
    const session = await MentorshipSession.findOneAndUpdate(
      { _id: req.params.id, facultyId: req.user._id },
      { sessionNotes },
      { new: true }
    );
    res.status(200).json({ session, message: 'Notes added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignedGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ assignedTo: req.user._id })
      .populate('studentId', 'name department');
    res.status(200).json({ grievances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const grievance = await Grievance.findOne({ _id: req.params.id, assignedTo: req.user._id });
    if (!grievance) return res.status(404).json({ error: 'Grievance not found or unauthorized' });

    grievance.status = status;
    grievance.timeline.push({ action: `Status changed to ${status}`, updatedBy: req.user._id, note });
    await grievance.save();

    res.status(200).json({ grievance, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
