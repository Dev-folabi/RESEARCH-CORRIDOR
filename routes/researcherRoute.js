const express = require('express');
const { uploadTopic, selectSupervisor, uploadResearch, getTopics, getResearch, getProgress, profile, getAppointment, getResearchs, getTopic, deleteTopic, deleteResearch } = require('../controllers/researcherController');
const { auth } = require('../middlewares/auth');
const { validationDirectory, researchDirectory } = require('../middlewares/uploadMiddleware');
const { uploadValidateDocument, uploadResearchDocument } = require('../config/multer');



const router = express.Router();

// Select Supervisor
router.put('/select-supervisor', auth,  selectSupervisor);

// Topic Validation Docs Routes
router.post('/upload-topic', auth,  validationDirectory, uploadValidateDocument.single('document'), uploadTopic);
router.get('/get-topics',  auth, getTopics);
router.get('/get-topics/:id',  getTopic);
router.delete('/delete-topic/:id', deleteTopic)


// Research Docs Routes
router.post('/upload-research', auth,  researchDirectory, uploadResearchDocument.single('document'), uploadResearch);
router.get('/get-research', auth,  getResearchs);
router.get('/get-research/:id', getResearch);
router.delete('/delete-research/:id', deleteResearch)

// Get Appointment
router.get('/appointments', auth, getAppointment)

// Get Progress Percentage
router.get('/progress', auth, getProgress)

// Get Profile
router.get('/', auth, profile)

module.exports = router;
