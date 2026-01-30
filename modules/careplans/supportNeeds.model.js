/**
 * -----------------------------------------------------
 * MODEL: SupportNeeds
 * ROLE: Stores detailed support needs for a client,
 *       including personal care, mobility, communication,
 *       nutrition, medication support, behavioural needs,
 *       accessibility requirements, and staff guidance.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add AI-generated support recommendations
 * - Add automatic review reminders
 * - Add multi-disciplinary team sign-off
 * - Add outcome tracking for support effectiveness
 * - Add accessibility mode for family portal
 * - Add version history for updates
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const SupportNeedsSchema = new mongoose.Schema(
  {
    // Linked client
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Personal care needs
    personalCare: {
      washing: String,
      dressing: String,
      toileting: String,
      continence: String,
      oralCare: String,
    },

    // Mobility needs
    mobility: {
      level: {
        type: String,
        enum: ["independent", "assisted", "wheelchair", "bedbound"],
      },
      equipment: [{ type: String }], // e.g. hoist, frame, wheelchair
      transferSupport: String,
    },

    // Communication needs
    communication: {
      primaryLanguage: String,
      hearing: String,
      vision: String,
      communicationStyle: String, // e.g. gestures, Makaton, simple language
      aids: [{ type: String }],
    },

    // Nutrition & hydration
    nutrition: {
      dietType: String, // e.g. normal, soft, pureed
      allergies: [{ type: String }],
      preferences: [{ type: String }],
      fluidSupport: String,
    },

    // Medication support
    medicationSupport: {
      level: {
        type: String,
        enum: ["independent", "prompting", "assistance", "full-support"],
      },
      notes: String,
    },

    // Behavioural support
    behaviour: {
      triggers: [{ type: String }],
      calmingStrategies: [{ type: String }],
      riskBehaviours: [{ type: String }],
    },

    // Accessibility needs
    accessibility: {
      homeLayout: String,
      equipment: [{ type: String }],
      environmentalRisks: [{ type: String }],
    },

    // Staff guidance
    staffGuidance: [{ type: String }],

    // Review cycle
    createdOn: { type: Date, default: Date.now },
    lastReviewed: { type: Date },
    nextReviewDue: { type: Date },

    // Offline sync support
    updatedOffline: { type: Boolean, default: false },
    offlineRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfflineRecord",
    },
  },
  { timestamps: true }
);

// Index for fast client support needs lookups
SupportNeedsSchema.index({ clientId: 1 });

module.exports = mongoose.model("SupportNeeds", SupportNeedsSchema);