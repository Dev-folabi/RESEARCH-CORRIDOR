const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverType: { type: String, enum: ['researcher', 'supervisor'], required: true },
    message: { type: String, required: true }
});

module.exports = mongoose.model('Notification', notificationSchema);
