/**
 * -----------------------------------------------------
 * MODEL: MAR (Medication Administration Record)
 * -----------------------------------------------------
 */

import mongoose from "mongoose";

const MARSchema = new mongoose.Schema(
  {
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
      required: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
    },

    scheduledTime: { type: String },
    actualTime: { type: Date },

    status: {
      type: String,
      enum: ["given", "missed", "refused", "not-required", "pending"],
      required: true,
    },

    prn: {
      used: { type: Boolean, default: false },
      reason: { type: String },
      effectiveness: { type: String },
    },

    notes: { type: String },

    completedOffline: { type: Boolean, default: false },
    offlineRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfflineRecord",
    },
  },
  { timestamps: true }
);

MARSchema.index({ clientId: 1, medicationId: 1, createdAt: -1 });

const MAR = mongoose.model("MAR", MARSchema);
export default MAR;