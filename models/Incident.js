const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },

  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  type: {
    type: String,
    enum: [
      'fall',
      'refused_care',
      'medication_issue',
      'safeguarding',
      'environmental',
      'other'
    ],
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// ✅ Safe export to avoid OverwriteModelError
module.exports = mongoose.models.Incident || mongoose.model('Incident', incidentSchema);
