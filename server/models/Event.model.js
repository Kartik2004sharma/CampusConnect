const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['fest', 'workshop', 'seminar', 'sports', 'other'], required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  registrationDeadline: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  certificateTemplate: { type: String },
  isPublished: { type: Boolean, default: false },
  maxParticipants: { type: Number },
  tags: [{ type: String }]
}, { timestamps: true });

eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ tags: 1 });

module.exports = mongoose.model('Event', eventSchema);
