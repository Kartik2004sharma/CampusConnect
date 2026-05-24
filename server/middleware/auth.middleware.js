const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.verifyToken = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'You are not logged in! Please log in to get access.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

    const currentUser = await User.findById(decoded.id);
    if (!currentUser || !currentUser.isActive) {
      return res.status(401).json({ error: 'The user belonging to this token does no longer exist or is inactive.' });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token. Please log in again.' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    next();
  };
};
