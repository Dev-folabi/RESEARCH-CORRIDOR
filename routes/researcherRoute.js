const express = require('express');
const { uploadTopic, selectSupervisor, uploadResearch, getTopics } = require('../controllers/researcherController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/upload-topic', auth, upload.single('document'), uploadTopic);
router.post('/select-supervisor', auth, selectSupervisor);
router.post('/upload-research', auth, upload.single('document'), uploadResearch);
router.get('/get-topics', auth, getTopics)

module.exports = router;
