const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true },
    researcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher', required: true },
    progressPercent: { type: Number, default: 0 },
    comments: [ {
        comment :{ type: String },
    createdAt: { type: Date, default: Date.now }
} ]
});

module.exports = mongoose.model('Progress', ProgressSchema);
