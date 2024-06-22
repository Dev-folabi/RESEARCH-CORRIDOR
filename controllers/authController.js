const Researcher = require("../models/researcherModel");
const Supervisor = require("../models/supervisorModel");
const Season = require("../models/seasonModel");
const Progress = require("../models/progressModel");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const sendEmail = require("../utils/notifier");
const {
  supervisorSignupSchema,
  researcherSignupSchema,
  loginSchema,
  researcherLoginSchema,
  updateSupervisorSchema,
  updateResearcherSchema,
} = require("../config/validation");

// Supervisor Signup
exports.supervisorSignup = async (req, res) => {
  const { error } = supervisorSignupSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { name, email, password, role, prefix, gender, department, phone } =
    req.body;

  try {
    let user = await Supervisor.findOne({ email });
    if (user) return res.status(400).json("User alredy exist");
    user = new Supervisor({
      name,
      email,
      password,
      role,
      prefix,
      gender,
      department,
      phone,
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_PRIVATE_KEY
    );
    sendEmail(
      email,
      "Research Corridor",
      `A new Account created as Supervisor with the following credential: Email: ${email}, Password: ${password}.`
    );
    res
      .status(201)
      .json({
        msg: "User Sign up successfully",
        token,
        user: _.omit(user.toObject(), ["password"]),
      });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Researcher Signup
exports.researcherSignup = async (req, res) => {
  const { error } = researcherSignupSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const {
    name,
    email,
    password,
    role,
    gender,
    department,
    matric,
    phone,
    topic,
    season,
    supervisor,
  } = req.body;

  try {
    const seasonID = await Season.findOne({ season });
    if (!seasonID) return res.status(400).json("Season not exist");

    let user = await Researcher.findOne({ email });
    if (user) return res.status(400).json("User alredy exist");
    user = new Researcher({
      name,
      email,
      password,
      role,
      gender,
      department,
      matric,
      phone,
      topic,
      season: seasonID._id,
      supervisor,
    });
    await user.save();

    // Create Researcher Progress Percentage Sheet
    const progress = await new Progress({
      supervisorId: supervisor,
      researcherId: user._id,
    });
    await progress.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, season: user.season },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "1d" }
    );

    sendEmail(
      email,
      "Research Corridor",
      `A new Account created as Researcher with the following credential: Email: ${email}, Password: ${password}.`
    );

    res
      .status(201)
      .json({
        msg: "User Sign up successfully",
        token,
        user: _.omit(user.toObject(), ["password"]),
      });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Supervisor Login
exports.supervisorLogin = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await Supervisor.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({
        msg: "User logged in successfully",
        token,
        user: _.omit(user.toObject(), ["password"]),
      });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Researcher Login

exports.researcherLogin = async (req, res) => {
  const { error } = researcherLoginSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { emailOrMatric, password } = req.body;

  try {
    const user = await Researcher.findOne({
      $or: [{ email: emailOrMatric }, { matric: emailOrMatric }],
    })
      .populate("season")
      .populate("supervisor", "name _id");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, season: user.season },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "User logged in successfully",
      token,
      user: _.omit(user.toObject(), ["password", "__v"]),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error, please try again later." });
  }
};

// Update Supervisor
exports.updateSupervisor = async (req, res) => {
  const { error } = updateSupervisorSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { name, email, role, prefix, gender, department, phone } = req.body;

  try {
    let existUser = await Supervisor.findById(req.user.id);
    if (!existUser) return res.status(400).json({ msg: "User does not exist" });

    const updatedUser = await Supervisor.findByIdAndUpdate(
      req.user.id,
      { name, email, role, prefix, gender, department, phone },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Update Researcher
exports.updateResearcher = async (req, res) => {
  const { error } = updateResearcherSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const {
    name,
    email,
    role,
    gender,
    department,
    matric,
    phone,
    topic,
    season,
  } = req.body;

  try {
    let existUser = await Researcher.findById(req.user.id);
    if (!existUser) return res.status(400).json({ msg: "User does not exist" });

    const updatedUser = await Researcher.findByIdAndUpdate(
      req.user.id,
      { name, email, role, gender, department, matric, phone, topic, season },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
