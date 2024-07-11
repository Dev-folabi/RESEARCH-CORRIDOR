const TopicValidation = require("../models/topicValidationModel");
const Document = require("../models/documentModel");
const Researcher = require("../models/researcherModel");
const Supervisor = require("../models/supervisorModel");
const Appointment = require("../models/appointmentModel");
const sendEmail = require("../utils/notifier");
const { createNotification } = require("./notificationController");
const _ = require("lodash");

// Get Supervisors
exports.getSupervisors = async (req, res) => {
  const { department } = req.body;

  try {
    const supervisors = await Supervisor.find({ department }).select(
      "name _id"
    );

    if (supervisors.length === 0) {
      return res
        .status(404)
        .json({ msg: `No supervisors found in the ${department} department` });
    }

    res.status(200).json(supervisors);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// Get All Validation Requests
exports.validationRequest = async (req, res) => {
  try {
    const validations = await TopicValidation.find({
      supervisorIds: req.user._id,
    }).populate("researcherId", "season");

    if (!validations)
      return res.status(200).json({ msg: "No Validation found" });

    const validateDocument = validations.filter((validate) =>
      validate.researcherId.season.equals(req.season._id)
    );

    if (validateDocument.length === 0)
      return res.status(200).json({ msg: "No Validation found" });

    res.status(200).json(validateDocument);
  } catch (err) {
    res
      .status(400)
      .json({ msg: "Error fetching validations", error: err.message });
  }
};

// Get A Validation Request
exports.getRequest = async (req, res) => {
  try {
    const validation = await TopicValidation.findById(req.params.id).populate(
      "researcherId",
      "matric name"
    );

    if (!validation)
      return res.status(200).json({ msg: "No Validation found" });

    res.status(200).json(validation);
  } catch (err) {
    res
      .status(400)
      .json({ msg: "Error fetching validations", error: err.message });
  }
};

// Comment on Validation
exports.commentOnValidation = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(404).json({ msg: "Comment is required" });

    const document = await TopicValidation.findById(req.params.id);
    if (!document) return res.status(404).json({ msg: "Validation not found" });

    document.comments.push({
      supervisorId: req.user._id,
      comment,
      status: "Reviewed",
    });
    await document.save();

    const receiver = await Researcher.findById(document.researcherId);

    // System Notification
    const notificationData = {
      receiverId: receiver._id,
      receiverType: receiver.role,
      message: `A new comment has been added to validation request you submitted.`,
    };

    createNotification(notificationData);

    // Email Notification
    sendEmail(
      receiver.email,
      "Validation Reviewed",
      `A new comment has been added to validation request you submitted.`
    );

    res.status(200).json({ msg: "Comment added" });
  } catch (err) {
    res.status(400).json({ msg: "Error adding comment", error: err.message });
  }
};

// Get All Documents
exports.getAllDocument = async (req, res) => {
  try {
    const documents = await Document.find({
      supervisorId: req.user.id,
    }).populate("researcherId", "matric name season");

    if (documents.length === 0)
      return res.status(200).json({ msg: "No Document found" });

    const getDocument = documents.filter((document) =>
      document.researcherId.season.equals(req.season._id)
    );

    res.status(200).json(getDocument);
  } catch (err) {
    res
      .status(400)
      .json({ msg: "Error fetching documents", error: err.message });
  }
};

// Get A Document
exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      "researcherId",
      "season"
    );

    if (!document) return res.status(200).json({ msg: "No Document found" });

    res.status(200).json(document);
  } catch (err) {
    res
      .status(400)
      .json({ msg: "Error fetching documents", error: err.message });
  }
};

// Comment on Research Document
exports.commentOnDocument = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(404).json({ msg: "Comment is required" });

    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ msg: "No Document found" });

    document.comments.push(comment);
    document.status = "Reviewed";
    document.reviewedDate = Date.now();
    await document.save();

    const receiver = await Researcher.findById(document.researcherId);
    
    // System Notification
    const notificationData = {
      receiverId: receiver._id,
      receiverType: receiver.role,
      message: `A new comment has been added to your research document by your Supervisor.`,
    };

    createNotification(notificationData);

    // Email Notification
    sendEmail(
      receiver.email,
      "Research Document Reviewed",
      `A new comment has been added to your research document by your Supervisor.`
    );
    res.status(200).json({ msg: "Comment added" });
  } catch (err) {
    res.status(400).json({ msg: "Error adding comment", error: err.message });
  }
};

// Get Assigned Researchers
exports.getResearcher = async (req, res) => {
  try {
    const researchers = await Researcher.find({
      supervisor: req.user._id,
    }).populate("progress", "progressPercent comment");

    const assignedResearchers = researchers.filter((researcher) =>
      researcher.season.equals(req.season._id)
    );

    if (assignedResearchers.length === 0) {
      return res.status(404).json({ msg: "No Researcher for this Season" });
    }

    const sanitizedResearchers = assignedResearchers.map((researcher) =>
      _.omit(researcher.toObject(), ["password", "role", "supervisor", "__v"])
    );

    res.status(200).json({ researchers: sanitizedResearchers });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    const { researcherId, date, time, agenda } = req.body;
    const supervisorId = await Supervisor.findById(req.user_id);

    const appointment = await new Appointment({
      supervisorId: supervisorId._id,
      researcherId,
      date,
      time,
      agenda,
    });
    await appointment.save();

    const researcher = await Researcher.findById(researcherId);

    // System Notification
    const notificationData = {
      receiverId: researcher._id,
      receiverType: "Researcher",
      message: `An Appointment has been scheduled by your Supervisor. Date ${date}, Time ${time}, Agenda ${agenda}.`,
    };

    createNotification(notificationData);

    // Email Notification
    sendEmail(
      researcher.email,
      "New Appointment",
      `A new Appointment has been scheduled by your Supervisor. Date ${date}, Time ${time}, Agenda ${agenda}.`
    );

    res.status(200).json({ msg: "Appointment Created", appointment });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// Get Appointment
exports.getAppointment = async (req, res) =>{

  try{
      const appointment = await Appointment.find({ supervisorId: req.user._id })
      res.status(200).json(appointment);
  }catch (err){
      console.error(err);  
      res.status(500).json({ msg: 'Internal Server Error', error: err.message });
  }
};

// Edit Appointment
exports.editAppointment = async (req, res) => {
  try {
    const { appointmentId, date, time, agenda } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId);
    if (!appointment)
      res.status(400).json({ msg: "Appointment is not available" });

    const newAppointment = await Appointment.findByIdAndUpdate(
      { appointment },
      {
        date,
        time,
        agenda,
      },
      { new: true }
    );
    await newAppointment.save();

    const researcher = await Researcher.findById(appointment.researcherId);

    // System Notification
    const notificationData = {
      receiverId: researcher._id,
      receiverType: "Researcher",
      message: `An Appointment scheduled earlier by your Supervisor has been Re-scheduled. Date ${date}, Time ${time}, Agenda ${agenda}.`,
    };

    createNotification(notificationData);

    // Email Notification
    sendEmail(
      researcher.email,
      "Appointment Re-scheduled",
      `An Appointment scheduled earlier by your Supervisor has been Re-scheduled. Date ${date}, Time ${time}, Agenda ${agenda}.`
    );

    res.status(200).json({ msg: "Appointment Updated", newAppointment });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment)
      res.status(400).json({ msg: "Appointment is not available" });

    res.status(200).json("Appointment Deleted");
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// Get Profile
exports.profile = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.user._id).select(
      "-password"
    );
    res.status(200).json(supervisor);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};
