const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  researcherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Researcher",
    required: true,
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
    required: true,
  },
  document: { type: String, required: true },
  status: {
    type: String,
    enum: ["Reviewed", "Not Reviewed"],
    default: "Not Reviewed",
  },
  comments: [ {message: { type: String }}],

  reviewedDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", DocumentSchema);
