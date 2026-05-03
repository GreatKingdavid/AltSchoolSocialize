const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Sign Up Route
// This takes the user's details and creates the account
router.post('/signup', authController.signup);

// 2. Sign In Route
// This verifies the user and gives them the 1-hour JWT
router.post('/signin', authController.signin);

// CRITICAL: This is what was missing! 
// This allows server.js to "see" these routes.
module.exports = router;
