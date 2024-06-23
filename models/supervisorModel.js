const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const supervisorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Supervisor', required: true },
    prefix: { type: String, require: true },
    gender: { type: String },
    department: { type: String },
    phone: { type: String }
});

supervisorSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

supervisorSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Supervisor = mongoose.model('Supervisor', supervisorSchema);

module.exports = Supervisor;
