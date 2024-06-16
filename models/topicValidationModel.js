const mongoose = require('mongoose');

const TopicValidationSchema = new mongoose.Schema({
    researcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    document: { type: String, required: true },
    supervisorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, comment: String }],
});

module.exports = mongoose.model('TopicValidation', TopicValidationSchema);
