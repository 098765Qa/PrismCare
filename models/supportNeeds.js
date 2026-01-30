const mongoose = require('mongoose');

const clientNeedsSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    unique: true,
    required: true,
  },

  // Complexity level
  dependencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },

  // Skills required
  requiredSkills: [String], // ['medication', 'double_up', 'hoisting']

  // Gender preference
  genderPreference: {
    type: String, // 'male', 'female', 'none'
    default: 'none',
  },

  // Suggested visit duration (minutes)
  typicalVisitDurationMinutes: {
    type: Number,
    default: 30,
  },

  // Does this client usually need double-up?
  usuallyDoubleUp: {
    type: Boolean,
    default: false,
  }
});

// ✅ Safe export to prevent OverwriteModelError
module.exports = mongoose.models.ClientNeeds || mongoose.model('ClientNeeds', clientNeedsSchema);
