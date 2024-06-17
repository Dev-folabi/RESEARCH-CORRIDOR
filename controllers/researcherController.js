const TopicValidation = require('../models/topicValidationModel');
const Document = require('../models/documentModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/notifier');
const path = require('path');

// Select lecturer
exports.selectSupervisor = async (req, res) => {
    try {
        const { supervisorId } = req.body;

        if (!supervisorId) {
            return res.status(400).send('Supervisor ID is required');
        }

        req.user.supervisorId = supervisorId;
        await req.user.save();
        res.status(200).send('Supervisor selected');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
};

// Upload Topic for validation
exports.uploadTopic = async (req, res) => {
    try {
        const { supervisorIds } = req.body;
        const document = req.file.path;

        if (!supervisorIds || !document) {
            return res.status(400).send('Supervisor IDs and document are required');
        }

        if (supervisorIds.length > 10) {
            return res.status(400).send('You can select up to 10 supervisors');
        }

        const topicValidation = new TopicValidation({
            researcherId: req.user._id,
            document,
            supervisorIds
        });
        await topicValidation.save();

        const supervisors = await User.find({ _id: { $in: supervisorIds } });
        supervisors.forEach(supervisor => {
            sendEmail(supervisor.email, 'New Topic Validation Request', `A new topic validation request has been submitted by ${req.user.name}.`);
        });

        res.status(201).send('Topic validation request uploaded and supervisors notified');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
};

// Get uploaded Topic
exports.getTopics = async (req, res) => {
    try {
        const uploadedTopics = await TopicValidation.find({ researcherId: req.user._id });

        res.status(200).json(uploadedTopics);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
};

// Upload Research Document
exports.uploadResearch = async (req, res) => {
    try {
        const document = req.file.path;

        if (!document) {
            return res.status(400).send('Document is required');
        }

        if (!req.user.supervisorId) {
            return res.status(400).send('Select a supervisor first');
        }

        const doc = new Document({
            researcherId: req.user._id,
            supervisorId: req.user.supervisorId,
            document
        });
        await doc.save();

        const supervisor = await User.findById(req.user.supervisorId);
        sendEmail(supervisor.email, 'New Research Document Uploaded', `A new research document has been uploaded by ${req.user.name}.`);

        res.status(201).send('Research document uploaded and supervisor notified');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
};

