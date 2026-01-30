/**
 * -----------------------------------------------------
 * MODEL: RiskAssessment
 * ROLE: Stores client risk assessments including
 *       categories, severity, control measures,
 *       review dates, responsible staff, and links
 *       to care plans and support needs.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add AI risk prediction scoring
 * - Add automatic review reminders
 * - Add multi-agency risk sharing
 * - Add incident-linked risk updates
 * - Add version history for assessments
 * - Add risk trend analytics dashboard
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const RiskAssessmentSchema = new mongoose.Schema(
  {
    // Linked client
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Risk categories
    risks: [
      {
        category: {
          type: String,
          enum: [
            "falls",
            "medication",
            "nutrition",
            "mobility",
            "behaviour",
            "mental-health",
            "environmental",
            "skin-integrity",
            "infection-control",
            "other",
          ],
          required: true,
        },

        description: { type: String, required: true },

        severity: {
          type: String,
          enum: ["low", "medium", "high"],
          required: true,
        },

        likelihood: {
          type: String,
          enum: ["unlikely", "possible", "likely"],
          required: true,
        },

        controlMeasures: [{ type: String }],

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

    // Linked care plan
    carePlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarePlan",
    },

    // Offline sync support
    updatedOffline: { type: Boolean, default: false },
    offlineRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfflineRecord",
    },
  },
  { timestamps: true }
);

// Index for fast client risk lookups
RiskAssessmentSchema.index({ clientId: 1 });

module.exports = mongoose.model("RiskAssessment", RiskAssessmentSchema);