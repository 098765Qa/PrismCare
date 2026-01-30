const mongoose = require('mongoose');

const marEntrySchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },

  visit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visit',
    required: true,
  },

  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true,
  },

  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  status: {
    type: String,
    enum: ['taken', 'refused', 'not_taken', 'unable'],
    required: true,
  },

  drink: {
    type: String,
    enum: ['water', 'juice', 'tea', 'coffee', 'thickened', 'other', 'none'],
    default: 'water',
  },

  notes: {
    type: String,
  },

  dateTime: {
    type: Date,
    default: Date.now,
  }
});

// ✅ Safe export to avoid OverwriteModelError
module.exports = mongoose.models.MarEntry || mongoose.model('MarEntry', marEntrySchema);
