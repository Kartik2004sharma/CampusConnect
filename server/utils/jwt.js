const jwt = require('jsonwebtoken');

exports.signToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};
