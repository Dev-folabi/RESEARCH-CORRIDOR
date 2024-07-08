const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true },
    researcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher', required: true },
    progressPercent: { type: Number, default: 0 },
    comments: [ { type: String } ]
});

module.exports = mongoose.model('Progress', ProgressSchema);
