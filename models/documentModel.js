const mongoose = require("mongoose");

// Document schema
const DocumentSchema = new mongoose.Schema({
  researcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  selectedSupervisor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  file: { type: String, required: true },
  comments: [{ type: String }],
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Document", DocumentSchema);
