/**
 * -----------------------------------------------------
 * MODEL: OfflineRecord
 * ROLE: Stores offline actions performed by staff when
 *       no internet is available, including visits,
 *       MAR entries, notes, wellbeing checks, and
 *       document uploads. Syncs when online.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const OfflineRecordSchema = new mongoose.Schema(
  {
    // Staff who performed the offline action
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    // Type of offline action
    type: {
      type: String,
      enum: ["visit", "mar", "note", "wellbeing", "document"],
      required: true,
    },

    // Raw offline payload (stored as JSON)
    payload: {
      type: Object,
      required: true,
    },

    // Sync status
    synced: { type: Boolean, default: false },
    syncedAt: { type: Date },

    // Device metadata
    deviceInfo: {
      model: String,
      os: String,
      appVersion: String,
    },

    // Timestamp when offline action occurred
    offlineTimestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for fast sync processing
OfflineRecordSchema.index({ synced: 1, offlineTimestamp: 1 });

module.exports = mongoose.model("OfflineRecord", OfflineRecordSchema);
