const { Notice, Event, Grievance, MentorshipSession, Recommendation, User, LostFound } = require('../models');

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

exports.submitGrievance = async (req, res) => {
  try {
    const { category, title, description } = req.body;
    
    if (!category || !title || !description) {
      return res.status(400).json({ error: 'Category, title, and description are required' });
    }

    const { v4: uuidv4 } = require('uuid');
    const trackingId = `GRV-${uuidv4().substring(0, 8).toUpperCase()}`;

    const grievance = new Grievance({
      studentId: req.user._id,
      category,
      title,
      description,
      trackingId,
      timeline: [{
        action: 'Grievance submitted',
        updatedBy: req.user._id,
        timestamp: new Date(),
        note: 'Grievance submitted by student'
      }]
    });

    await grievance.save();

    const { emitToRole } = require('../socket/socket');
    emitToRole('faculty', 'grievance:new', { message: `New grievance: ${grievance.title}`, grievanceId: grievance._id });

    res.status(201).json({ message: 'Grievance submitted successfully', grievance, trackingId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.requestMentorSession = async (req, res) => {
  try {
    const { facultyId, scheduledAt, topic } = req.body;
    
    if (!facultyId || !scheduledAt) {
      return res.status(400).json({ error: 'Faculty and Scheduled Date are required' });
    }

    const session = new MentorshipSession({
      studentId: req.user._id,
      facultyId,
      scheduledAt,
      sessionNotes: topic || 'No topic provided',
      status: 'pending'
    });

    await session.save();
    res.status(201).json({ message: 'Mentorship session requested', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFaculties = async (req, res) => {
  try {
    const faculties = await User.find({ role: 'faculty', isVerified: true }).select('name department profileImage email');
    res.status(200).json({ faculties });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true, date: { $gte: new Date() } })
      .sort({ date: 1 });
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.registeredStudents.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already registered' });
    }
    if (event.maxParticipants && event.registeredStudents.length >= event.maxParticipants) {
      return res.status(400).json({ error: 'Event is full' });
    }
    event.registeredStudents.push(req.user._id);
    await event.save();
    res.status(200).json({ message: 'Registered successfully', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, department },
      { new: true }
    ).select('-password');
    res.status(200).json({ user, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLostFoundItems = async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    else query.status = 'open';
    const items = await LostFound.find(query)
      .populate('reportedBy', 'name department')
      .sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reportLostFound = async (req, res) => {
  try {
    const { type, itemName, description, location, contactInfo } = req.body;
    const item = await LostFound.create({
      reportedBy: req.user._id,
      type, itemName, description, location, contactInfo
    });
    res.status(201).json({ item, message: 'Item reported successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.claimItem = async (req, res) => {
  try {
    const item = await LostFound.findOneAndUpdate(
      { _id: req.params.id, status: 'open' },
      { status: 'claimed', claimedBy: req.user._id },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found or already claimed' });
    res.status(200).json({ item, message: 'Item marked as claimed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
