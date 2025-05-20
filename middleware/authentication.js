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

module.exports = auth;
