const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['grievance', 'event', 'notice', 'session', 'system', 'recommendation'], required: true },
  isRead: { type: Boolean, default: false },
  relatedModule: { type: String },
  relatedId: { type: String },
  actionUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
