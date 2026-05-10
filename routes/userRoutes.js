const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewear/authMiddleware');

router.use(protect); // All routes below are protected

router.post('/follow/:id', userController.follow);
router.post('/unfollow/:id', userController.unfollow);
router.get('/following', userController.getFollowing);
router.get('/followers', userController.getFollowers);

module.exports = router;