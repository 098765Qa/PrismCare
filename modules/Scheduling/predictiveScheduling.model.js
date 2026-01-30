/**
 * -----------------------------------------------------
 * MODEL: PredictiveScheduling
 * ROLE: Stores AI-generated predictions and scheduling
 *       insights including visit duration estimates,
 *       travel time, staff suitability, client priority,
 *       and conflict detection signals.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add real-time optimisation engine
 * - Add fatigue modelling for staff
 * - Add multi-visit route optimisation
 * - Add predictive cancellations
 * - Add weather-based travel adjustments
 * - Add explainability metadata (XAI)
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const PredictiveSchedulingSchema = new mongoose.Schema(
  {
    // Linked visit (optional for pre-scheduling predictions)
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
    },

    // Linked client
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Linked staff (optional if predicting best staff)
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },

    // Predicted visit duration (minutes)
    predictedDuration: { type: Number },

    // Predicted travel time (minutes)
    predictedTravelTime: { type: Number },

    // Staff suitability score (0–1)
    staffSuitability: { type: Number, min: 0, max: 1 },

    // Client priority score (0–1)
    clientPriority: { type: Number, min: 0, max: 1 },

    // Conflict detection signals
    conflicts: [
      {
        type: String,
        enum: [
          "overlap",
          "travel-too-long",
          "double-booking",
          "fatigue-risk",
          "high-priority-delay",
        ],
      },
    ],

    // AI-generated recommendation summary
    recommendation: { type: String },

    // Metadata for debugging or explainability
    metadata: {
      type: Object,
      default: {},
    },

    // Whether admin/staff approved the suggestion
    approved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Indexes for fast scheduling queries
PredictiveSchedulingSchema.index({ clientId: 1 });
PredictiveSchedulingSchema.index({ staffId: 1 });
PredictiveSchedulingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("PredictiveScheduling", PredictiveSchedulingSchema);