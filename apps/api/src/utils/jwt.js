const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_PIN_EXPIRES_IN = process.env.JWT_PIN_EXPIRES_IN || '8h';

const generateToken = (payload, isPinLogin = false) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: isPinLogin ? JWT_PIN_EXPIRES_IN : JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
