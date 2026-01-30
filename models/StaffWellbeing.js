const mongoose = require('mongoose');

const staffWellbeingSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // AI-calculated wellbeing score (0–1)
  wellbeingScore: {
    type: Number,
    default: 1
  },

  // AI-detected fatigue level
  fatigueLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },

  // AI-detected stress level
  stressLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },

  // AI-detected burnout risk (0–1)
  burnoutRisk: {
    type: Number,
    default: 0
  },

  // Mood check-ins from staff
  moodCheckIns: [
    {
      mood: {
        type: String,
        enum: ['happy', 'neutral', 'tired', 'stressed', 'upset']
      },
      notes: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Lone worker safety events
  safetyEvents: [
    {
      type: {
        type: String,
        enum: [
          'panic-button',
          'no-movement',
          'gps-out-of-zone',
          'late-check-in',
          'fall-detected',
          'manual-alert'
        ]
      },
      description: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      detectedAt: {
        type: Date,
        default: Date.now
      },
      location: {
        lat: Number,
        lng: Number
      }
    }
  ],

  // AI predictions for future safety risks
  predictedRisks: [
    {
      risk: String,
      probability: Number, // 0–1
      recommendedAction: String
    }
  ],

  // AI summary for dashboards
  aiSummary: String,

  // Raw data used for AI analysis
  sourceData: Object,

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update timestamp
staffWellbeingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// ✅ Safe export to prevent OverwriteModelError
module.exports = mongoose.models.StaffWellbeing || mongoose.model('StaffWellbeing', staffWellbeingSchema);
