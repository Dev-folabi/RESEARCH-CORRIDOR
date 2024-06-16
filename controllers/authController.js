const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const _ = require('lodash')

exports.signup = async (req, res) => {
    const { name, email, password, role, prefix, gender, department, matric, phone, topic, season } = req.body;

    try {
        const user = new User({ name, email, password, role, prefix, gender, department, matric, phone, topic, season });
        await user.save();

        if (role === 'researcher' && !season) return res.status(400).json({ msg: 'Season is required for researcher' });

        const token = jwt.sign({ id: user._id, role: user.role, season: user.season }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.login = async (req, res) => {
    const { emailOrMatric, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: emailOrMatric }, { matric: emailOrMatric }] }).select('-password').populate('season').populate('supervisor', 'name _id');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, role: user.role, season: user.season }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' });
        
        res.status(200).json({ msg: 'User logged in successfully', token, user });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.updateUser = async (req, res) => {

    const { name, email, role, prefix, gender, department, matric, phone, topic, season, supervisor } = req.body;
  try {

    let existUser = await User.findOne(req.user._id);
    if (!existUser) return res.status(400).json({ msg: 'User does not exist' });

    const updatedUser = await User.findOneAndUpdate(
      query,
      { name, email, role, prefix, gender, department, matric, phone, topic, season, supervisor },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
