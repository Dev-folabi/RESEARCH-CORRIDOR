const mongoose = require('mongoose');
const TopicValidation = require('../models/topicValidationModel');
const Document = require('../models/documentModel');
const Researcher = require('../models/researcherModel');
const Supervisor = require('../models/supervisorModel');
const Appointment = require('../models/appointmentModel')
const sendEmail = require('../utils/notifier');
const { createNotification } = require('./notificationController');

exports.getSupervisors = async (req, res) => {
    const { department } = req.body;

    try {
        const supervisors = await Supervisor.find({ department }).select('name _id');
        
        if (supervisors.length === 0) {
            return res.status(404).json({ msg: `No supervisors found in the ${department} department` });
        }

        res.status(200).json(supervisors);
    } catch (err) {
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
};

// Topic Vallidation Request

// exports.validateTopic = async (req, res) =>{
//     const {_id} = req.user

    
// }

// Comment on Validation

exports.commentOnDocument = async (req, res) => {
    try {
        const { documentId, comment } = req.body;
        const document = await Document.findById(documentId);
        document.comments.push({ supervisorId: req.user._id, comment });
        await document.save();
        res.status(200).send('Comment added');
    } catch (err) {
        res.status(400).send(err.message);
    }
};