const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token from header
  let accessToken;
  if (req.headers.authorization?.startsWith('Bearer')) {
    accessToken = req.headers.authorization.split(' ')[1];
  }

  if (!accessToken) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  try {
    // 2) Verify Access Token
    // Using promisify makes the catch block cleaner for handling expirations
    const decoded = await promisify(jwt.verify)(accessToken, process.env.JWT_ACCESS_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
    }

    // 4) Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Access token expired',
        code: 'ACCESS_TOKEN_EXPIRED' // Frontend checks for this code to trigger refresh
      });
    }
    return res.status(401).json({ message: 'Invalid token. Please log in again.' });
  }
});

exports.optionalAuth = catchAsync(async (req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (e) {
      req.user = null;
    }
  }
  next();
});