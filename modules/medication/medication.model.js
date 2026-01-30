/**
 * -----------------------------------------------------
 * MODEL: Medication
 * ROLE: Stores prescribed medication for each client,
 *       including dose, route, schedule, PRN rules,
 *       prescriber details, and MAR entry links.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add medication review reminders
 * - Add pharmacy integration
 * - Add AI adherence predictions
 * - Add stock level tracking
 * - Add medication interactions checker
 * - Add barcode scanning support
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const MedicationSchema = new mongoose.Schema(
  {
    // Linked client
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Medication details
    name: { type: String, required: true },
    dose: { type: String, required: true }, // e.g. "5mg", "1 tablet"
    route: {
      type: String,
      enum: ["oral", "topical", "injection", "inhaler", "eye", "ear", "patch", "other"],
      required: true,
    },

    // Schedule
    frequency: {
      type: String,
      enum: ["once-daily", "twice-daily", "three-times-daily", "four-times-daily", "weekly", "monthly", "as-needed"],
      required: true,
    },

    times: [{ type: String }], // e.g. ["08:00", "12:00", "20:00"]

    // PRN (as needed) rules
    prn: {
      isPrn: { type: Boolean, default: false },
      reason: { type: String },
      maxDosesPerDay: { type: Number },
      minHoursBetweenDoses: { type: Number },
    },

    // Prescriber details
    prescriber: {
      name: String,
      organisation: String,
      phone: String,
    },

    // Start/end dates
    startDate: { type: Date, required: true },
    endDate: { type: Date },

    // MAR entries linked to this medication
    marEntries: [
      { type: mongoose.Schema.Types.ObjectId, ref: "MAR" }
    ],

    // Flags
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for fast medication lookups
MedicationSchema.index({ clientId: 1, active: 1 });

module.exports = mongoose.model("Medication", MedicationSchema);