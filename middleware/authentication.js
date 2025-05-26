const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors'); // 👈 custom error handler

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for missing or invalid header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  // Extract the token
  const token = authHeader.split(' ')[1];

  try {
    //  Verify token and attach user to request
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      name: payload.name,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = auth;

/*

const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Authentication Invalid' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Authentication Invalid' });
  }
};

module.exports = auth;  */
