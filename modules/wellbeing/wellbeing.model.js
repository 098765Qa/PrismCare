/**
 * -----------------------------------------------------
 * MODEL: WellbeingCheck
 * ROLE: Records daily wellbeing checks for clients,
 *       including mood, hydration, nutrition, pain,
 *       sleep, behaviour, safeguarding concerns, and
 *       staff observations.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add AI wellbeing prediction scoring
 * - Add trend analysis for mood/pain/sleep
 * - Add automatic alerts for concerning patterns
 * - Add family portal wellbeing summaries
 * - Add voice-to-text wellbeing entries
 * - Add photo attachments (optional)
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const WellbeingSchema = new mongoose.Schema(
  {
    // Linked client
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Staff who completed the check
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    // Mood
    mood: {
      type: String,
      enum: ["happy", "neutral", "sad", "anxious", "agitated", "confused"],
      required: true,
    },

    // Hydration
    hydration: {
      type: String,
      enum: ["good", "adequate", "low"],
      required: true,
    },

    // Nutrition
    nutrition: {
      type: String,
      enum: ["ate-well", "ate-some", "refused-food"],
      required: true,
    },

    // Pain level
    pain: {
      type: String,
      enum: ["none", "mild", "moderate", "severe"],
      required: true,
    },

    // Sleep quality
    sleep: {
      type: String,
      enum: ["good", "broken", "poor"],
      required: true,
    },

    // Behaviour observations
    behaviour: {
      notes: String,
      flags: [
        {
          type: String,
          enum: [
            "agitation",
            "withdrawn",
            "confusion",
            "aggression",
            "wandering",
            "low-mood",
          ],
        },
      ],
    },

    // Safeguarding concerns
    safeguarding: {
      isConcern: { type: Boolean, default: false },
      description: String,
      severity: {
        type: String,
        enum: ["low", "medium", "high"],
      },
    },

    // Additional notes
    notes: { type: String },

    // Offline sync support
    createdOffline: { type: Boolean, default: false },
    offlineRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfflineRecord",
    },
  },
  { timestamps: true }
);

// Index for fast wellbeing lookups
WellbeingSchema.index({ clientId: 1, createdAt: -1 });

module.exports = mongoose.model("WellbeingCheck", WellbeingSchema);