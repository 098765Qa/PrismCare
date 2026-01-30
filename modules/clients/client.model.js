/**
 * -----------------------------------------------------
 * MODEL: Client
 * ROLE: Stores full client profile, medical details,
 *       contacts, preferences, risk levels, and links
 *       to care plans, medication, visits, and notes.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add hospital admission history
 * - Add allergy severity scoring
 * - Add behavioural support plan
 * - Add mobility assessment model
 * - Add AI wellbeing predictions
 * - Add family portal permissions
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    // Basic identity
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },

    // Contact details
    phone: { type: String },
    email: { type: String },

    // Address
    address: {
      line1: String,
      line2: String,
      city: String,
      postcode: String,
    },

    // Next of kin
    nextOfKin: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },

    // GP / Doctor
    gpDetails: {
      name: String,
      practice: String,
      phone: String,
      address: String,
    },

    // Medical information
    allergies: [{ type: String }],
    conditions: [{ type: String }],
    mobility: {
      type: String,
      enum: ["independent", "assisted", "wheelchair", "bedbound"],
      default: "independent",
    },

    // Risk level
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    // Preferences
    preferences: {
      food: [{ type: String }],
      religion: String,
      language: String,
      routines: [{ type: String }],
    },

    // Flags (important alerts)
    flags: [
      {
        type: String,
        enum: [
          "allergy",
          "falls-risk",
          "medication-changes",
          "behavioural-support",
          "mobility-support",
          "communication-support",
        ],
      },
    ],

    // Linked data
    carePlanId: { type: mongoose.Schema.Types.ObjectId, ref: "CarePlan" },
    supportNeedsId: { type: mongoose.Schema.Types.ObjectId, ref: "SupportNeeds" },

    // Assigned staff
    assignedStaff: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }
    ],

    // Link to User login
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Index for fast search
ClientSchema.index({ lastName: 1, firstName: 1 });

module.exports = mongoose.model("Client", ClientSchema);