const express = require('express');
const { signup, login, updateUser } = require('../controllers/authController');
const { auth } = require('../middlewares/auth')

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/update', auth, updateUser)

module.exports = router;
