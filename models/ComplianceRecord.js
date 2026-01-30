const mongoose = require('mongoose');

const complianceRecordSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: [
      'client',
      'staff',
      'visit',
      'medication',
      'incident',
      'training',
      'policy',
      'document'
    ],
    required: true
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },

  category: {
    type: String,
    enum: [
      'documentation',
      'medication',
      'scheduling',
      'visit-completion',
      'incident-reporting',
      'training',
      'policy',
      'risk',
      'general'
    ],
    required: true
  },

  complianceScore: {
    type: Number,
    default: 1
  },

  issues: [
    {
      issue: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      detectedAt: { type: Date, default: Date.now }
    }
  ],

  predictedRisks: [
    {
      risk: String,
      probability: Number, // 0–1
      recommendedAction: String
    }
  ],

  aiSummary: String,

  recommendedActions: [
    {
      action: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      }
    }
  ],

  sourceData: Object,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update timestamp
complianceRecordSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// ✅ Safe export to prevent OverwriteModelError
module.exports = mongoose.models.ComplianceRecord || mongoose.model('ComplianceRecord', complianceRecordSchema);
