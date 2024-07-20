const Chat = require('../models/chatModel');
const Supervisor = require('../models/supervisorModel');
const Researcher = require('../models/researcherModel');

exports.getChats = async (req, res) => {
    try {
        const { supervisorId, season } = req.params;
        let chats = await Chat.findOne({ supervisorId, season }).populate('messages.senderId', 'name');

        if (chats) {
            chats.messages.sort((a, b) => b.timestamp - a.timestamp); 
        }

        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.addMessage = async (supervisorId, season, senderId, message) => {
    try {
        let chat = await Chat.findOne({ supervisorId, season });

        if (!chat) {
            chat = new Chat({ supervisorId, season, messages: [] });
        } 

        let senderModel

        const supervisor= await Supervisor.findById(senderId);
        const researcher = await Researcher.findById(senderId);

        if(supervisor) {
            senderModel = supervisor.role
        }else{ senderModel = researcher.role }

        chat.messages.push({ senderId, senderModel, message });
        await chat.save();
    } catch (err) {
        console.error(err.message);
    }
};
