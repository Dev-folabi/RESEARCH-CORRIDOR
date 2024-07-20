const express = require('express');
const { getChats } = require('../controllers/chatController');
const { auth } = require('../middlewares/auth');


const router = express.Router();

router.get('/chats', auth, getChats);

module.exports = router;
