const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const researcherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'researcher', required: true },
    gender: { type: String },
    department: { type: String },
    matric: { type: String, unique: true },
    phone: { type: String },
    topic: { type: String },
    season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season'  },
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }
});

researcherSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

researcherSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Researcher = mongoose.model('Researcher', researcherSchema);

module.exports = Researcher;
