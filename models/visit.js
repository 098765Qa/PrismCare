const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  additionalStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  type: { type: String, enum: ['personal-care','medication','welfare-check','domestic','meal-prep','community-support','overnight','other'], required: true },
  scheduledStart: { type: Date, required: true },
  scheduledEnd: { type: Date, required: true },
  actualStart: Date,
  actualEnd: Date,
  status: { type: String, enum: ['scheduled','in-progress','completed','missed','cancelled'], default: 'scheduled' },
  tasks: [{ title: String, completed: { type: Boolean, default: false }, completedAt: Date }],
  gpsVerification: { start: { lat: Number, lng: Number, timestamp: Date }, end: { lat: Number, lng: Number, timestamp: Date }, verified: { type: Boolean, default: false } },
  travelDistanceKm: Number,
  travelDurationMinutes: Number,
  notes: [{ staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String, createdAt: { type: Date, default: Date.now } }],
  marEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MAR' }],
  aiSummary: String,
  aiRiskScore: Number,
  aiFlags: [String],
  anomalies: [{ type: String }],
  safeguardingFlags: [String],
  predictedDuration: Number,
  predictedEndTime: Date,
  qualityScore: Number,
  completedOffline: { type: Boolean, default: false },
  offlineRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'OfflineRecord' },
}, { timestamps: true });

visitSchema.index({ staffId: 1, scheduledStart: 1 });
visitSchema.index({ clientId: 1, scheduledStart: 1 });

module.exports = mongoose.models.Visit || mongoose.model('Visit', visitSchema);
