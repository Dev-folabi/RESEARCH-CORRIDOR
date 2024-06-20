const mongoose = require('mongoose');

const TopicValidationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    researcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher', required: true },
    document: { type: String, required: true },
    supervisorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', require: true }],
    comments: [{ supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }, comment: String }],
    createdAt: { type: Date, default: Date.now, },
});

module.exports = mongoose.model('TopicValidation', TopicValidationSchema);
