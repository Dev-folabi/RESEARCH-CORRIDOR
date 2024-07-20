const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    supervisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supervisor',
        required: true
    },
    season: {
        type: String,
        required: true
    },
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'messages.senderModel'
            },
            senderModel: {
                type: String,
                required: true,
                enum: ['Researcher', 'Supervisor']
            },
            message: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('Chat', chatSchema);
