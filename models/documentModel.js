const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    researcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    document: { type: String, required: true },
    status: {type: String, enum: ['Reviewed', 'Not Reviewed']},
    comments: [{ supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, comment: String }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
});

module.exports = mongoose.model('Document', DocumentSchema);

