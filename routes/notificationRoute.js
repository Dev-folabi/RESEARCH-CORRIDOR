const express = require('express')
const {auth} = require('../middlewares/auth');
const { getNotifications } = require('../controllers/notificationController');
const routes = express.Router()

routes.get('/', auth, getNotifications);


module.exports = routes