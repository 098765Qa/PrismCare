/**
 * -----------------------------------------------------
 * MODEL: AuditLog
 * ROLE: Stores every important action in the system,
 *       including who performed it, what changed,
 *       before/after values, IP/device info, and
 *       AI-flagged suspicious activity.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add AI anomaly detection for suspicious changes
 * - Add tamper-proof hashing for compliance
 * - Add export to PDF/CSV for inspections
 * - Add real-time audit dashboard
 * - Add chain-of-custody tracking
 * - Add multi-record grouped audit events
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    // User who performed the action
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Entity affected (Client, Visit, MAR, etc.)
    entityType: {
      type: String,
      required: true,
    },

    // ID of the affected entity
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Action performed
    action: {
      type: String,
      enum: [
        "create",
        "update",
        "delete",
        "login",
        "logout",
        "status-change",
        "system",
      ],
      required: true,
    },

    // Before and after values (for updates)
    before: { type: Object },
    after: { type: Object },

    // Metadata
    ip: { type: String },
    userAgent: { type: String },
    device: { type: String },

    // AI anomaly detection (future)
    aiFlagged: { type: Boolean, default: false },
    aiReason: { type: String },

    // Optional notes
    notes: { type: String },
  },
  { timestamps: true }
);

// Indexes for fast audit queries
AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", AuditLogSchema);