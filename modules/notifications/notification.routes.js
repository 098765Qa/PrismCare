// modules/notifications/notification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');

// GET all notifications
router.get('/', notificationController.getAllNotifications);

// POST create a notification
router.post('/', notificationController.createNotification);

module.exports = router; // ✅ export router, NOT controller
