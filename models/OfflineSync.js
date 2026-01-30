const mongoose = require('mongoose');

const offlineSyncSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // What type of data is being synced
  type: {
    type: String,
    enum: [
      'visit-update',
      'mar-entry',
      'incident',
      'gps-log',
      'note',
      'task',
      'check-in',
      'check-out'
    ],
    required: true
  },

  // The actual offline data (raw JSON)
  payload: {
    type: Object,
    required: true
  },

  // Whether this offline record has been synced to the server
  synced: {
    type: Boolean,
    default: false
  },

  // When the device created the offline record
  deviceTimestamp: {
    type: Date,
    required: true
  },

  // When the server successfully synced it
  syncedAt: {
    type: Date
  },

  // Device info for debugging
  deviceInfo: {
    model: String,
    os: String,
    appVersion: String
  },

  // GPS location at the time of the offline action
  location: {
    lat: Number,
    lng: Number
  },

  // Conflict resolution status
  conflictStatus: {
    type: String,
    enum: ['none', 'resolved', 'manual-review'],
    default: 'none'
  },

  // Notes for conflict resolution
  conflictNotes: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Safe export to prevent OverwriteModelError
module.exports = mongoose.models.OfflineSync || mongoose.model('OfflineSync', offlineSyncSchema);
