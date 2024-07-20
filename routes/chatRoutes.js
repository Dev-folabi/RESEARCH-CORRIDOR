const express = require('express');
const { getChats } = require('../controllers/chatController');
const { auth } = require('../middlewares/auth');


const router = express.Router();

router.get('/:supervisorId/:season', auth, getChats);

module.exports = router;
