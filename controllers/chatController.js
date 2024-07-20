const Chat = require('../models/chatModel');

exports.getChats = async (req, res) => {
    try {
        const { supervisorId, season } = req.query;
        const chats = await Chat.findOne({ supervisorId, season });
        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addMessage = async (supervisorId, season, sender, message) => {
    try {
        let chat = await Chat.findOne({ supervisorId, season });

        if (!chat) {
            chat = new Chat({ supervisorId, season, messages: [] });
        }

        chat.messages.push({ sender, message });
        await chat.save();
    } catch (err) {
        console.error(err.message);
    }
};
