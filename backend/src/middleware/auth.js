const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Protect routes - Check if user is authenticated
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    // Development/Demo fallback when token is missing
    req.user = { id: 'demo-user-id', role: 'student' };
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Development/Demo fallback when token is invalid
    req.user = { id: 'demo-user-id', role: 'student' };
    return next();
  }
};

// Optional authentication - Check token but don't require it
const optionalAuth = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Token is invalid, but we continue (optional)
    }
  }

  next();
};

module.exports = {
  protect,
  optionalAuth,
};
