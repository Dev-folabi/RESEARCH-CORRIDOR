const Notification = require('../models/notificationModel');

// Create Notification
const createNotification = async (data, next) => {
    try {
        const newNotification = new Notification(data);
        await newNotification.save();
        if (next) next();
    } catch (err) {
        if (next) next(err);
        else console.error('Error creating notification:', err);
    }
};

// Get Notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            receiverId: req.user.id,
            receiverType: req.user.role
        });
        
        if (!notifications.length) {
            return res.status(202).json({ msg: 'No notifications found' });
        }
        
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
};

module.exports = {
    createNotification,
    getNotifications
};
