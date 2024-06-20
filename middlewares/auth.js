const jwt = require("jsonwebtoken");
const Supervisor = require("../models/supervisorModel");
const Researcher = require('../models/researcherModel');

// Middleware for general authentication
const auth = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    let user;

    if (decoded.role === 'supervisor') {
      user = await Supervisor.findById(decoded.id);
    } else if (decoded.role === 'researcher') {
      user = await Researcher.findById(decoded.id);
    } else {
      return res.status(400).json({ msg: "Invalid user role" });
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = user;
    
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid", error: err.message});
  }
};

// Middleware for role-based authorization
const authorize = (role) => {
  return (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

      if (decoded.role !== role) {
        return res.status(403).json({ msg: "Access denied, role not authorized" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};

module.exports = { auth, authorize };
