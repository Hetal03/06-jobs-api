const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide all values' });
  }

  // Check if user exists (optional)
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email already in use' });
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Create JWT token (example)
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  res.send('Login User')
}

module.exports = { register, login };





/*const register = async (req, res) => {
  res.send('Register User')
}

const login = async (req, res) => {
  res.send('Login User')
}

module.exports = {
  register,
  login
}*/


