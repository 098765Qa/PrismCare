/**
 * -----------------------------------------------------
 * MODEL: Document
 * ROLE: Stores metadata for uploaded documents linked to
 *       clients, staff, and the organisation, including
 *       categories, expiry dates, and compliance info.
 *
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 *
 * ROADMAP:
 * - Add file storage integration (S3 / Azure / GCP)
 * - Add versioning for updated documents
 * - Add access control rules per role
 * - Add document approval workflow
 * - Add auto-expiry notifications to admin/staff
 * - Add inspection export packs (CQC / regulators)
 * -----------------------------------------------------
 */

const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    // Who this document belongs to (usually a client)
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    // Optional: document related to a staff member
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },

    // Basic info
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    // Storage details (adjust later when you integrate actual upload)
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String, // e.g. "pdf", "image", "docx"
    },
    fileSize: {
      type: Number, // in bytes
    },

    // Category for filtering and compliance
    category: {
      type: String,
      enum: [
        "care-plan",
        "risk-assessment",
        "medication",
        "mar",
        "id",
        "medical-report",
        "consent",
        "contract",
        "training",
        "policy",
        "other",
      ],
      default: "other",
    },

    // Expiry and review management
    expiryDate: {
      type: Date,
    },

    // How many days before expiry to start warning
    expiryWarningDays: {
      type: Number,
      default: 30, // e.g. warn 30 days before
    },

    // Flag used by background jobs / checks
    isExpired: {
      type: Boolean,
      default: false,
    },

    // Who uploaded it
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Optional: organisation / branch for multi-site future
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
    },
  },
  { timestamps: true }
);

// Indexes for performance and common queries
DocumentSchema.index({ clientId: 1, category: 1, expiryDate: 1 });
DocumentSchema.index({ staffId: 1, category: 1 });
DocumentSchema.index({ isExpired: 1, expiryDate: 1 });

module.exports = mongoose.model("Document", DocumentSchema);