const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    researcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher', required: true },
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true },
    document: { type: String, required: true },
    status: {type: String, enum: ['Reviewed', 'Not Reviewed']},
    comments: [{  type: String }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
});

module.exports = mongoose.model('Document', DocumentSchema);

