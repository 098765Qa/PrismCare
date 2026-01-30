// models/AuditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  action: {
    type: String,
    required: true,
  },

  entityType: {
    type: String, // "Client", "Visit", "Medication", "MarEntry", "Incident", "Document"
    required: true,
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  details: {
    type: Object, // flexible JSON for extra info
  },

  ip: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Safe export to avoid OverwriteModelError
module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
