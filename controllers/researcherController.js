const TopicValidation = require('../models/topicValidationModel');
const Document = require('../models/documentModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/notifier');
const path = require('path');


exports.uploadTopic = async (req, res) => {
    try {
        const { supervisorIds } = req.body;
        const document = req.file.path;

        if (supervisorIds.length > 10) {
            return res.status(400).send('You can select up to 10 supervisors');
        }

        const topicValidation = new TopicValidation({ researcherId: req.user._id, document, supervisorIds });
        await topicValidation.save();

        const supervisors = await User.find({ _id: { $in: supervisorIds } });
        supervisors.forEach(supervisor => {
            sendEmail(supervisor.email, 'New Topic Validation Request', `A new topic validation request has been submitted by ${req.user.name}.`);
        });

        res.status(201).send('Topic validation request uploaded and supervisors notified');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.selectSupervisor = async (req, res) => {
  try {
      const { supervisorId } = req.body;
      req.user.supervisorId = supervisorId;
      await req.user.save();
      res.status(200).send('Supervisor selected');
  } catch (err) {
      res.status(400).send(err.message);
  }
};

exports.uploadResearch = async (req, res) => {
    try {
        const document = req.file.path;

        if (!req.user.supervisor) {
            return res.status(400).send('Select a supervisor first');
        }

        const doc = new Document({ researcherId: req.user._id, supervisorId: req.user.supervisor, document });
        await doc.save();

        const supervisor = await User.findById(req.user.supervisor);
        sendEmail(supervisor.email, 'New Research Document Uploaded', `A new research document has been uploaded by ${req.user.name}.`);

        res.status(201).send('Research document uploaded and supervisor notified');
    } catch (err) {
        res.status(400).send(err.message);
    }
};
