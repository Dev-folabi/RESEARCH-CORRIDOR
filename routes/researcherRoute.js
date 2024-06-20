const express = require('express');
const { uploadTopic, selectSupervisor, uploadResearch, getTopics, getResearch } = require('../controllers/researcherController');
const { auth, authorize } = require('../middlewares/auth')
const upload = require('../middlewares/uploadValidateDocument')
const docUpload = require('../middlewares/uploadResearchDocument')

const router = express.Router();

// Select Supervisor
router.put('/select-supervisor', auth, authorize('researcher'), selectSupervisor);

// Topic Validation Routes
router.post('/upload-topic', auth, authorize('researcher'), upload.single('document'), uploadTopic);
router.get('/get-topics', authorize('researcher'), auth, getTopics);


// Research validation Routes
router.post('/upload-research', auth, authorize('researcher'), docUpload.single('document'), uploadResearch);
router.get('/get-research', auth, authorize('researcher'), getResearch);

module.exports = router;
