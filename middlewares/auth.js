const jwt = require("jsonwebtoken");

// Middleware for general authentication
const auth = (req, res, next) => {
  
  const token = req.header("x-auth-token");

 
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware for role-based authorization
const authorize = (role) => {
  return (req, res, next) => {
    
    const token = req.header("x-auth-token");

    // Check if not token
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      req.user = decoded; 

      
      if (req.user.role !== role) {
        return res.status(403).json({ msg: "Access denied, role not authorized" });
      }

      next(); 
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};

module.exports = {
  auth,
  authorize
};
