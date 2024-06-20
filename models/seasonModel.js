const mongoose = require('mongoose');

// Define the Season schema
const seasonSchema = new mongoose.Schema({
    season: {
        type: String,
        required: true, 
        unique: true, 
        trim: true 
    }
});


const Season = mongoose.model('Season', seasonSchema);

module.exports = Season; 
