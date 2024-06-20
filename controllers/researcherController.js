const mongoose = require('mongoose');
const TopicValidation = require('../models/topicValidationModel');
const Document = require('../models/documentModel');
const Researcher = require('../models/researcherModel');
const Supervisor = require('../models/supervisorModel');
const sendEmail = require('../utils/notifier');
const path = require('path');

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

        const researcher = await Researcher.findById( req.user );
        if (!researcher) {
            return res.status(404).json({ msg: 'Researcher not found' });
        }
        researcher.supervisor = supervisorId;
        await researcher.save();
        res.status(200).send('Supervisor selected');
    } catch (err) {
        res.status(500).send('Internal Server Error');
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
            researcherId: req.user._id,
            document,
            supervisorIds: supervisorIdArray
        });
        await topicValidation.save();

        const researcher = await Researcher.findById(req.user._id);

        const supervisors = await Supervisor.find({ _id: { $in: supervisorIdArray } });
        supervisors.forEach(supervisor => {
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
        const uploadedTopics = await TopicValidation.find({ researcherId: req.user }).populate('supervisorIds', 'name email');

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
        const researcher = await Researcher.findById(req.user.id);
        const supervisorId = researcher.supervisor
        if (!supervisorId) {
            return res.status(400).send('Select a supervisor first');
        }

        const doc = new Document({
            researcherId: req.user.id,
            supervisorId: supervisorId,
            title,
            document
        });
        await doc.save();

        const supervisor = await Researcher.findById(req.user.id);
        sendEmail(supervisor.email, 'New Research Document Uploaded', `A new research document has been uploaded by ${req.user.name}.`);

        res.status(201).send('Research document uploaded and supervisor notified');
    } catch (err) {
        console.error(err);  
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
};

