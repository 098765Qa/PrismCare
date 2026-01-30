/**
 * -----------------------------------------------------
 * MODEL: Notification
 * ROLE: Stores system notifications, live events,
 *       read/unread status, priorities, and channels.
 * AUTHOR: Amna Idris + PrismCare AI Assistant
 * DATE: 2026
 * -----------------------------------------------------
 */

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, default: 'general' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    channels: { type: [String], default: ['push'] },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
    queuedOffline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
