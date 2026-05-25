const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['academic', 'hostel', 'facilities', 'ragging', 'other'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'inProgress', 'resolved', 'escalated'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trackingId: { type: String, unique: true, required: true },
  timeline: [{
    action: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
  }],
  escalationDeadline: { type: Date },
  attachments: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Grievance', grievanceSchema);
