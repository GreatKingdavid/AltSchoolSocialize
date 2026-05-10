const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to generate both tokens
const signTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { 
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' 
  });

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' 
  });

  return { accessToken, refreshToken };
};

exports.signup = async (data) => {
  const user = await User.create(data);
  const { accessToken, refreshToken } = signTokens(user._id);
  
  // Optional: Save refreshToken to the user document in DB for security/logout
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

exports.signin = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const { accessToken, refreshToken } = signTokens(user._id);

  // Update the refresh token in the database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};