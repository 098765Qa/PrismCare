/**
 * -----------------------------------------------------
 * MODEL: Visit
 * ROLE: Stores scheduled visits, assigned staff, client,
 *       timing, status, GPS verification, notes, tasks,
 *       AI summaries, anomalies, travel data, and links
 *       to MAR entries and offline sync.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add predictive scheduling weight scores
 * - Add AI visit summary generation
 * - Add multi-staff visit support
 * - Add travel time + mileage tracking
 * - Add visit recurrence rules
 * - Add safeguarding alert triggers
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema(
  {
    // Client receiving the visit
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Primary staff assigned to the visit
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    // Additional staff (future-proof)
    additionalStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
      },
    ],

    // Visit type
    type: {
      type: String,
      enum: [
        "personal-care",
        "medication",
        "welfare-check",
        "domestic",
        "meal-prep",
        "community-support",
        "overnight",
        "other",
      ],
      required: true,
    },

    // Scheduled time
    scheduledStart: { type: Date, required: true },
    scheduledEnd: { type: Date, required: true },

    // Actual time (recorded by staff)
    actualStart: { type: Date },
    actualEnd: { type: Date },

    // Visit status
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "missed", "cancelled"],
      default: "scheduled",
    },

    // Visit tasks
    tasks: [
      {
        title: String,
        completed: { type: Boolean, default: false },
        completedAt: Date,
      },
    ],

    // GPS verification
    gpsVerification: {
      start: {
        lat: Number,
        lng: Number,
        timestamp: Date,
      },
      end: {
        lat: Number,
        lng: Number,
        timestamp: Date,
      },
      verified: { type: Boolean, default: false },
    },

    // Travel + mileage
    travelDistanceKm: Number,
    travelDurationMinutes: Number,

    // Notes recorded during or after visit
    notes: [
      {
        staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // MAR entries linked to this visit
    marEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: "MAR" }],

    // AI summary + insights
    aiSummary: String,
    aiRiskScore: Number,
    aiFlags: [String],

    // Visit anomalies (AI)
    anomalies: [
      {
        type: String, // e.g. "short-visit", "gps-mismatch"
      },
    ],

    // Safeguarding triggers
    safeguardingFlags: [String],

    // Predictive scheduling
    predictedDuration: Number, // minutes
    predictedEndTime: Date,

    // Visit quality score (optional)
    qualityScore: Number,

    // Offline sync support
    completedOffline: { type: Boolean, default: false },
    offlineRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfflineRecord",
    },
  },
  { timestamps: true }
);

// Index for fast scheduling queries
VisitSchema.index({ staffId: 1, scheduledStart: 1 });
VisitSchema.index({ clientId: 1, scheduledStart: 1 });

module.exports = mongoose.model("Visit", VisitSchema);