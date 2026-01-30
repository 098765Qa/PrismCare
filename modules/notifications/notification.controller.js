// modules/notifications/notification.controller.js
let io;

const Notification = require('../../models/Notification'); // FIXED

module.exports = {
    setSocketIO: (socketIO) => { io = socketIO; },

    getAllNotifications: async (req, res) => {
        try {
            const notifications = await Notification.find();
            res.json(notifications);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching notifications' });
        }
    },

    createNotification: async (req, res) => {
        try {
            const notification = new Notification(req.body);
            await notification.save();

            if (io) io.emit('newNotification', notification);

            res.status(201).json(notification);
        } catch (err) {
            res.status(500).json({ message: 'Error creating notification' });
        }
    },
};