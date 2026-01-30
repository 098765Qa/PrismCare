/**
 * Notification Model
 * -----------------------------------------------------
 * Roadmap:
 * - Store notifications for staff/admin
 * - Track read/unread status
 * - Support categories: system, schedule, medication, incident
 * - Future: push notifications + real-time socket events
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['system', 'schedule', 'medication', 'incident'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in dev/hot reload
module.exports =
  mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema);