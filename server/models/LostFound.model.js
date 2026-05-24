const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  contactInfo: { type: String, required: true },
  status: { type: String, enum: ['open', 'claimed', 'archived'], default: 'open' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('LostFound', lostFoundSchema);
