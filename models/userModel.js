const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['supervisor', 'researcher'], required: true },
    prefix: { type: String },
    gender: { type: String },
    department: { type: String },
    matric: { type: String, unique: true },
    phone: { type: String },
    topic: { type: String },
    season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season'  },
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
