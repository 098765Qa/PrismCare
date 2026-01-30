/**
 * -----------------------------------------------------
 * MODEL: AIInsight
 * ROLE: Stores AI-generated insights, predictions,
 *       anomaly detections, and trend analyses for
 *       clients, visits, medication, wellbeing, and
 *       staff performance.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add real-time AI monitoring engine
 * - Add predictive risk scoring
 * - Add medication adherence forecasting
 * - Add wellbeing trend analysis
 * - Add visit anomaly detection
 * - Add staff performance insights
 * - Add explainability metadata (XAI)
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const AIInsightSchema = new mongoose.Schema(
  {
    // Insight category
    type: {
      type: String,
      enum: [
        "risk",
        "medication",
        "wellbeing",
        "visit",
        "scheduling",
        "performance",
        "anomaly",
        "general",
      ],
      required: true,
    },

    // Linked entities (optional)
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
    },
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
    },
    wellbeingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WellbeingCheck",
    },

    // AI-generated summary
    summary: { type: String, required: true },

    // Detailed insight (optional)
    details: { type: String },

    // AI confidence score (0–1)
    confidence: { type: Number, min: 0, max: 1 },

    // Severity or importance
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    // Insight metadata
    metadata: {
      type: Object,
      default: {},
    },

    // Whether the insight has been reviewed by admin/staff
    reviewed: { type: Boolean, default: false },
    reviewedAt: { type: Date },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index for fast insight lookups
AIInsightSchema.index({ clientId: 1, createdAt: -1 });
AIInsightSchema.index({ type: 1 });

module.exports = mongoose.model("AIInsight", AIInsightSchema);

