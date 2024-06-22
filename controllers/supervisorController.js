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
