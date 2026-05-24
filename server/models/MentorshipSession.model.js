const mongoose = require('mongoose');

const mentorshipSessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 },
  status: { type: String, enum: ['pending', 'approved', 'completed', 'cancelled', 'rescheduled'], default: 'pending' },
  sessionNotes: { type: String },
  meetLink: { type: String },
  studentFeedback: { type: String },
  facultyFeedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MentorshipSession', mentorshipSessionSchema);
