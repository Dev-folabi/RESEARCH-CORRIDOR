const mongoose = require("mongoose");


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
  selectedSupervisors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  }],
  file: { 
    type: String, 
    required: true 
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    text: {
      type: String, 
      required: true
    },
    date: {
      type: Date,
      default: Date.now 
    }
  }],
  createAt: {
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Document", DocumentSchema);
