const User = require('../models/userModel');
const _ = require('lodash');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role, prefix, gender, department, matric, phone, topic, season, supervisor } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    if (role === 'researcher' && !season) return res.status(400).json({ msg: 'Season is required for researcher' });

    // Create a new user instance
    user = new User({ name, email, password, role, prefix, gender, department, matric, phone, topic, season, supervisor });
    await user.save();

    // Generate a JWT token
    const token = user.generateAuthToken();
    const picked = _.pick(user, ['_id', 'name', 'email', 'role', 'prefix', 'gender', 'department', 'matric', 'phone', 'topic', 'season', 'supervisor']);

    res.status(201).json({ msg: 'User registered successfully', token, user: picked });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Log in a user
exports.login = async (req, res) => {
  const { email, matric, password } = req.body;
  const log = email ? { email } : { matric };

  try {
    // Check if the user exists
    let user = await User.findOne(log);
    if (!user) return res.status(400).json({ msg: 'Invalid email or matric and password' });

    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or matric and password' });

    // Generate a JWT token
    const token = user.generateAuthToken();
    const picked = _.pick(user, ['_id', 'name', 'email', 'role', 'prefix', 'gender', 'department', 'matric', 'phone', 'topic', 'season', 'supervisor']);

    res.status(200).json({ msg: 'User logged in successfully', token, user: picked });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get user details
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('season').populate('supervisor', 'name _id');;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { _id, name, email, role, prefix, gender, department, matric, phone, topic, season, supervisor } = req.body;
  try {
    const query = _id ? { _id } : { email };

    let existUser = await User.findOne(query);
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
