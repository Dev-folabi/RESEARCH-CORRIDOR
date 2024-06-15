const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  prefix: { type: String },
  gender: { type: String },
  department: { type: String, required: true },
  matric: { type: String },
  phone: { type: String },
  topic: { type: String },
  season: { type: mongoose.Schema.Types.ObjectId, ref: "Season" },
  progress: { type: Number, default: 0 },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  selectedSupervisors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Pre-save middleware to hash the password before saving the user
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Generate JWT Token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_PRIVATE_KEY, 
    { expiresIn: '1h' }
  );
  return token;
};

// Match the password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


UserSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = mongoose.model("User", UserSchema);
