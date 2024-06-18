const express = require('express');
const { supervisorSignup, supervisorLogin, updateSupervisor, researcherSignup, researcherLogin, updateResearcher } = require('../controllers/authController');
const { auth } = require('../middlewares/auth')

const router = express.Router();

// Supervisor Routes
router.post('/supervisor-signup', supervisorSignup);
router.post('/supervisor-login', supervisorLogin);
router.put('/supervisor-update', auth, updateSupervisor)

// Researcher Routes
router.post('/researcher-signup', researcherSignup);
router.post('/researcher-login', researcherLogin);
router.put('/researcher-update', auth, updateResearcher)

module.exports = router;
