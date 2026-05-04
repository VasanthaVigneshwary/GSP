const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Protect routes - Check if user is authenticated
const protect = (req, res, next) => {
  // Authentication disabled for development
  req.user = { 
    id: 'demo-user-id', 
    _id: 'demo-user-id',
    role: 'student',
    name: 'Demo Student',
    email: 'student@university.edu'
  };
  return next();
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
