const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true },
    researcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    agenda: { type: String }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);