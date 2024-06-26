const mongoose = require('mongoose');
const TopicValidation = require('../models/topicValidationModel');
const Document = require('../models/documentModel');
const Researcher = require('../models/researcherModel');
const Supervisor = require('../models/supervisorModel');
const Appointment = require('../models/appointmentModel');
const Progress = require("../models/progressModel");
const sendEmail = require('../utils/notifier');
const { createNotification } = require('./notificationController');


// Select lecturer
exports.selectSupervisor = async (req, res) => {
    try {
        const { supervisorId } = req.body;

        if (!supervisorId) {
            return res.status(400).send('Supervisor ID is required');
        }
        const supervisor = await Supervisor.findById(supervisorId);
        if (!supervisor) {
            return res.status(404).json({ msg: 'Supervisor not found' });
        }

        const researcher = await Researcher.findById( req.user._id );
        if (!researcher) {
            return res.status(404).json({ msg: 'Researcher not found' });
        }
        researcher.supervisor = supervisorId;
        await researcher.save();

        // Update Supervisor on Progress Percentage Sheet
const progress = await Progress.findById(req.user._id)
progress.supervisorId = supervisorId;
await progress.save()

        res.status(200).send('Supervisor selected');
    } catch (err) {
        res.status(500).json({msg: 'Internal Server Error', error: err.message})
    }
};

// Upload Topic for validation

exports.uploadTopic = async (req, res) => {
    try {
        const { title, supervisorIds } = req.body;
        const document = req.file.path;

        if (!supervisorIds || !document) {
            return res.status(400).json({ msg: 'Supervisor IDs and document are required' });
        }

        // Ensure supervisorIds is an array of ObjectIds
        const supervisorIdArray = JSON.parse(supervisorIds).map(id => new mongoose.Types.ObjectId(id));

        if (supervisorIdArray.length > 10) {
            return res.status(400).json({ msg: 'You can only select up to 10 supervisors' });
        }

        const topicValidation = new TopicValidation({
            title,
            researcherId: req.user.id,
            document,
            supervisorIds: supervisorIdArray
        });
        await topicValidation.save();

        const researcher = await Researcher.findById(req.user._id);

        const supervisors = await Supervisor.find({ _id: { $in: supervisorIdArray } });
        
        supervisors.forEach(supervisor => {
            // System Notification
            const notificationData = {
                receiverId: supervisor._id,
                receiverType: supervisor.role,
                message: `A new topic validation request has been submitted by ${researcher.name} with matric no: ${researcher.matric}.`
            };

            createNotification(notificationData)

            // Email Notification
            sendEmail(supervisor.email, 'New Topic Validation Request', `A new topic validation request has been submitted by ${researcher.name}.`);
        });

        res.status(201).json({ msg: 'Topic validation request uploaded and supervisors notified' });
    } catch (err) {
        console.error(err);  
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
};



// Get uploaded Topic
exports.getTopics = async (req, res) => {
    try {
        const uploadedTopics = await TopicValidation.find({ researcherId: req.user._id }).populate('supervisorIds', 'name email');

        res.status(200).json(uploadedTopics);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
};

// Upload Research Document
exports.uploadResearch = async (req, res) => {
    try {
        const document = req.file.path;
        const {title} = req.body

        if (!document) {
            return res.status(400).send('Document is required');
        }
        const researcher = await Researcher.findById(req.user._id);
        const supervisorId = researcher.supervisor
        if (!supervisorId) {
            return res.status(400).send('Select a supervisor first');
        }

        const doc = new Document({
            researcherId: req.user._id,
            supervisorId: supervisorId,
            title,
            document
        });
        await doc.save();

        const supervisor = await Supervisor.findById(supervisorId)

        // System Notification
        const notificationData = {
            receiverId: supervisor._id,
            receiverType: supervisor.role,
            message: `A new research document has been uploaded by ${researcher.name} with matric no: ${researcher.matric}.`
        };

        createNotification(notificationData)

        // Email Notification
        sendEmail(supervisor.email, 'New Research Document Uploaded', `A new research document has been uploaded by ${researcher.name} with matric no: ${researcher.matric}.`);

        res.status(201).send('Research document uploaded and supervisor notified');
    } catch (err) {
        console.error(err);  
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
};

// Get uploaded Research
exports.getResearch = async (req, res) => {
    try {
        const uploadedResearch = await Document.find({ researcherId: req.user._id }).select('-researcherId').select('-supervisorId')

        res.status(200).json(uploadedResearch);
    } catch (err) {
        console.error(err);  
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
};

// Get Appointment
exports.getAppointment = async (req, res) =>{

    try{
        const appointment = await Appointment.find({ researcherId: req.user._id })
        res.status(200).json(appointment);
    }catch (err){
        console.error(err);  
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
};


// Get Progress Percentage
exports.getProgress = async (req, res) =>{

    try{
        const progress = await Progress.find({ researcherId: req.user._id }).select('progressPercent')
        res.status(200).json(progress);
    } catch (err){
        console.error(err);  
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
}

// Get Profile
exports.profile = async (req, res) =>{
    try{
        const researcher = await Researcher.findById(req.user._id).select('-password').populate('supervisor', 'name').populate('season')
        res.status(200).json(researcher);
    } catch (err){
        console.error(err);  
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
}