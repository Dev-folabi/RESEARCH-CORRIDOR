const express = require('express');
const { uploadTopic, selectSupervisor, uploadResearch, getTopics, getResearch, getProgress, profile } = require('../controllers/researcherController');
const { auth, authorize } = require('../middlewares/auth')
const upload = require('../middlewares/uploadValidateDocument')
const docUpload = require('../middlewares/uploadResearchDocument');
const { validationDirectory, researchDirectory } = require('../middlewares/docDirMiddleware');

const router = express.Router();

// Select Supervisor
router.put('/select-supervisor', auth, authorize('researcher'), selectSupervisor);

// Topic Validation Docs Routes
router.post('/upload-topic', auth, authorize('researcher'), validationDirectory, upload.single('document'), uploadTopic);
router.get('/get-topics', authorize('researcher'), auth, getTopics);


// Research Docs Routes
router.post('/upload-research', auth, authorize('researcher'), researchDirectory, docUpload.single('document'), uploadResearch);
router.get('/get-research', auth, authorize('researcher'), getResearch);

// Get Progress Percentage
router.get('/progress', auth, getProgress)

// Get Profile
router.get('/', auth, profile)

module.exports = router;
