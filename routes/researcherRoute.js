const express = require('express');
const { uploadTopic, selectSupervisor, uploadResearch, getTopics } = require('../controllers/researcherController');
const { auth, authorize } = require('../middlewares/auth')
const upload = require('../middlewares/uploadValidateDocument')
const docUpload = require('../middlewares/uploadResearchDocument')

const router = express.Router();

// Select Supervisor
router.put('/select-supervisor', auth, selectSupervisor);

// Topic Validation Routes
router.post('/upload-topic', auth, upload.single('document'), uploadTopic);
router.get('/get-topics', auth, getTopics);


// Research validation Routes
router.post('/upload-research', auth, authorize('researcher'), docUpload.single('document'), uploadResearch);

module.exports = router;
