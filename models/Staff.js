const mongoose = require('mongoose');

const staffProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },

  // Skills / capabilities
  skills: [String], // ['medication', 'challenging_behaviour', 'hoisting', 'dementia']

  // Preferred shift patterns
  preferredShiftTypes: [String], // ['morning', 'evening', 'night']

  // Max hours per week (to avoid fatigue)
  maxWeeklyHours: {
    type: Number,
    default: 40,
  },

  // Preferred clients (continuity)
  preferredClients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    }
  ],

  // Home base for distance/travel estimation (rough)
  homePostcode: String,

  // Do they drive?
  drives: {
    type: Boolean,
    default: false,
  }
});

// ✅ Safe export to prevent OverwriteModelError
module.exports = mongoose.models.StaffProfile || mongoose.model('StaffProfile', staffProfileSchema);
