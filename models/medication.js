const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  dosage: {
    type: String,
    required: true,
  },

  form: {
    type: String, // Tablet, Liquid, Capsule, Cream, Inhaler, Patch, etc.
    required: true,
  },

  instructions: {
    type: String, // e.g. "Take with food", "Crush tablet", "Use inhaler twice"
  },

  times: [
    {
      type: String, // "08:00", "12:00", "18:00"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin who added it
  }
});

// ✅ Safe export
module.exports = mongoose.models.Medication || mongoose.model('Medication', medicationSchema);
