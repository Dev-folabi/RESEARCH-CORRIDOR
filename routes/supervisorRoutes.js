const express = require('express')
const { getSupervisors } = require('../controllers/supervisorController')
const router = express.Router()

// Get Supervisor
router.post('/', getSupervisors)

module.exports = router