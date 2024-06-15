const express = require('express')
const { createSeason, getSeason, updateSeason } = require('../controllers/seasonController')
const routes = express.Router()

routes.post('/', createSeason);
routes.get('/', getSeason);
routes.put('/', updateSeason)

module.exports = routes