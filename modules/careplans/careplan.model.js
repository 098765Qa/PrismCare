/**
 * -----------------------------------------------------
 * MODEL: CarePlan
 * ROLE: Stores the full care plan for a client,
 *       including goals, outcomes, interventions,
 *       review dates, responsible staff, and links
 *       to risk assessments and support needs.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add AI-generated care plan suggestions
 * - Add automatic review reminders
 * - Add version history for updates
 * - Add family portal visibility rules
 * - Add outcome scoring + analytics
 * - Add multi-disciplinary team sign-off
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const CarePlanSchema = new mongoose.Schema(
  {
    // Linked client
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Care plan summary
    summary: { type: String },

    // Goals & outcomes
    goals: [
      {
        title: { type: String, required: true },
        description: String,
        outcome: String,
        progress: {
          type: String,
          enum: ["not-started", "in-progress", "achieved", "declined"],
          default: "not-started",
        },
      },
    ],

    // Interventions (what staff must do)
    interventions: [
      {
        title: { type: String, required: true },
        description: String,
        frequency: String, // e.g. "daily", "weekly", "as needed"
        responsibleStaff: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff",
        },
      },
    ],

    // Review cycle
    createdOn: { type: Date, default: Date.now },
    lastReviewed: { type: Date },
    nextReviewDue: { type: Date },

    // Linked assessments
    riskAssessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RiskAssessment",
    },
    supportNeedsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportNeeds",
    },

    // Attachments (documents)
    documents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Document" }
    ],

    // Offline sync support
    updatedOffline: { type: Boolean, default: false },
    offlineRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfflineRecord",
    },
  },
  { timestamps: true }
);

// Index for fast client care plan lookups
CarePlanSchema.index({ clientId: 1 });

module.exports = mongoose.model("CarePlan", CarePlanSchema);