const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  recommendations: [{
    type: { type: String }, // e.g. 'event', 'mentor'
    itemId: { type: String },
    itemTitle: { type: String },
    score: { type: Number },
    reason: { type: String }
  }],
  lastRefreshed: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
