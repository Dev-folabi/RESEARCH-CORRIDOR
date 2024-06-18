const Researcher = require('../models/researcherModel');
const Supervisor = require('../models/supervisorModel')
const jwt = require('jsonwebtoken');
const _ = require('lodash');

exports.supervisorSignup = async (req, res) => {
    const { name, email, password, role, prefix, gender, department, phone } = req.body;

    try {
        const user = new Supervisor({ name, email, password, role, prefix, gender, department, phone });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Researcher SignUp
exports.researcherSignup = async (req, res) => {
    const { name, email, password, role, gender, department, matric, phone, topic, season } = req.body;

    try {
        const user = new Researcher({ name, email, password, role, gender, department, matric, phone, topic, season });
        await user.save();

        if (!season) return res.status(400).json({ msg: 'Season is required' });

        const token = jwt.sign({ id: user._id, role: user.role, season: user.season }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Supervisor Login
exports.supervisorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Supervisor.findOne({ email }).select('-password')
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' });
        
        res.status(200).json({ msg: 'User logged in successfully', token, user });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

//  Reseacher Login
exports.researcherLogin = async (req, res) => {
    const { emailOrMatric, password } = req.body;

    try {
        const user = await Researcher.findOne({ $or: [{ email: emailOrMatric }, { matric: emailOrMatric }] }).select('-password').populate('season').populate('supervisor', 'name _id');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, role: user.role, season: user.season }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' });
        
        res.status(200).json({ msg: 'User logged in successfully', token, user });
    } catch (err) {
        res.status(400).send(err.message);
    }
};


// Update Supervisor 
exports.updateSupervisor = async (req, res) => {

    const { name, email, role, prefix, gender, department, phone } = req.body;
  try {

    let existUser = await Supervisor.findOne(req.user);
    if (!existUser) return res.status(400).json({ msg: 'User does not exist' });

    const updatedUser = await Supervisor.findOneAndUpdate(
      query,
      { name, email, role, prefix, gender, department, matric, phone, topic, season, supervisor },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Update Researcher
exports.updateResearcher = async (req, res) => {

    const { name, email, role, gender, department, matric, phone, topic, season } = req.body;
  try {

    let existUser = await Researcher.findOne(req.user);
    if (!existUser) return res.status(400).json({ msg: 'User does not exist' });

    const updatedUser = await Researcher.findOneAndUpdate(
      query,
      { name, email, password, role, gender, department, matric, phone, topic, season },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
