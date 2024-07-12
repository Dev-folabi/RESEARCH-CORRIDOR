const mongoose = require("mongoose")

const gradeSchema = new mongoose.Schema({
    researcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher', required: true },
    name: { type: String, required: true },
    matric: { type: String, required: true },
    projectTitle: { type: String },
    introduction: { type: Number, default: 0, },
    reviewLit: { type: Number, default: 0, },
    researchMethod: { type: Number, default: 0, },
    dataAnalysis: { type: Number, default: 0, },
    discussion: { type: Number, default: 0, },
    language: { type: Number, default: 0, },
    reference: { type: Number, default: 0, },
    formart: { type: Number, default: 0, },
    total: { type: Number, default: 0, },
    generalComment: { type: String },
    evaluator: { type: String },
    date: { type: Date }
})

module.exports = mongoose.model('Grade', gradeSchema)