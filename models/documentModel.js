const mongoose = require('mongoose');

// Document schema
const DocumentSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  researcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  file: { type: String, required: true },
  comments: [{ type: String }],
});

module.exports = mongoose.model('Document', DocumentSchema);
