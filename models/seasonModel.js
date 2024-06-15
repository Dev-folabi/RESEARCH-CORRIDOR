const mongoose = require('mongoose');

// Define the Season schema
const SeasonSchema = new mongoose.Schema({
    season: {
        type: String,
        required: true, 
        unique: true, 
        trim: true 
    }
});


const Season = mongoose.model('Season', SeasonSchema);

module.exports = Season; 
