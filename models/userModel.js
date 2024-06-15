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
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  selectedSupervisors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
});

// Hash the password before saving the user
UserSchema.methods.hashPassword = async function () {
  const salt = await bcrypt.genSalt(10); 
  return await bcrypt.hash(this.password, salt); 
};

// Generate JWT Token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_PRIVATE_KEY 
  );
  return token; 
};

// Match the password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password); 
};

module.exports = mongoose.model("User", UserSchema); 
