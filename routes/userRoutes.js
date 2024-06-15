const express = require('express');
const router = express.Router();
const { register, login, getUser, updateUser } = require('../controllers/userController');


// Register a new user
router.post('/register', register);

// Log in a user
router.post('/login', login);

// Get user details 
router.get('/:id',  getUser);

// Update user details 
router.put('/updateUser',  updateUser);

module.exports = router;
