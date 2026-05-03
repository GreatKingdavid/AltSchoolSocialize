const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewear/authMiddleware'); // The Bouncer

// All User social routes require login
router.use(protect);

// Requirement: Follow/Unfollow logic
router.post('/follow/:id', userController.follow);
router.post('/unfollow/:id', userController.unfollow);

// Requirement: List of following and followers
router.get('/following', userController.getFollowing);
router.get('/followers', userController.getFollowers);

module.exports = router;
