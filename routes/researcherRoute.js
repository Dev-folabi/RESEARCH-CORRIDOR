const express = require('express');
const { uploadTopic, selectSupervisor, uploadResearch, getTopics, getResearch, getProgress, profile, getAppointment, getResearchs, getTopic } = require('../controllers/researcherController');
const { auth } = require('../middlewares/auth')
const upload = require('../middlewares/uploadValidateDocument')
const docUpload = require('../middlewares/uploadResearchDocument');
const { validationDirectory, researchDirectory } = require('../middlewares/docDirMiddleware');

const router = express.Router();

// Select Supervisor
router.put('/select-supervisor', auth,  selectSupervisor);

// Topic Validation Docs Routes
router.post('/upload-topic', auth,  validationDirectory, upload.single('document'), uploadTopic);
router.get('/get-topics',  auth, getTopics);
router.get('/get-topic/:id',  getTopic);


// Research Docs Routes
router.post('/upload-research', auth,  researchDirectory, docUpload.single('document'), uploadResearch);
router.get('/get-research', auth,  getResearchs);
router.get('/get-research/:id', getResearch);

// Get Appointment
router.get('/appointments', auth, getAppointment)

// Get Progress Percentage
router.get('/progress', auth, getProgress)

// Get Profile
router.get('/', auth, profile)

module.exports = router;
