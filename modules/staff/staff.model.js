/**
 * -----------------------------------------------------
 * MODEL: Staff
 * ROLE: Stores full staff profile, employment details,
 *       compliance, training, availability, and links
 *       to assigned clients and visits.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add training expiry reminders
 * - Add rota availability patterns
 * - Add qualification uploads
 * - Add performance metrics
 * - Add AI skill-matching for scheduling
 * - Add payroll integration (optional)
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    // Basic identity
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    email: { type: String, unique: true },

    // Employment details
    jobTitle: { type: String, required: true },
    employmentStart: { type: Date },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "bank", "agency"],
      default: "full-time",
    },

    // Compliance
    dbsNumber: { type: String },
    dbsExpiry: { type: Date },
    rightToWorkVerified: { type: Boolean, default: false },

    // Skills & training
    skills: [{ type: String }],
    trainingRecords: [
      {
        name: String,
        completedOn: Date,
        expiresOn: Date,
      },
    ],

    // Availability
    availability: {
      monday: { type: Boolean, default: true },
      tuesday: { type: Boolean, default: true },
      wednesday: { type: Boolean, default: true },
      thursday: { type: Boolean, default: true },
      friday: { type: Boolean, default: true },
      saturday: { type: Boolean, default: false },
      sunday: { type: Boolean, default: false },
    },

    // Emergency contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    // Assigned clients
    assignedClients: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Client" }
    ],

    // Link to User login
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Index for fast staff search
StaffSchema.index({ lastName: 1, firstName: 1 });

module.exports = mongoose.model("Staff", StaffSchema);