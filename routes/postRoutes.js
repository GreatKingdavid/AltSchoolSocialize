const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middlewear/authMiddleware'); // The Bouncer

// --- PUBLIC ROUTES (No login required) ---
// Requirement: Logged in and not logged in users can get posts
router.get('/', postController.getAllPublished);
router.get('/:id', postController.getSinglePost);

// --- PROTECTED ROUTES (Login required) ---
router.use(protect); // This protects EVERYTHING below this line

// Requirement: Logged in users can create posts (starts as draft)
router.post('/', postController.createNewPost);

// Requirement: Owner can update state to 'published'
router.patch('/:id/publish', postController.publishPost);

// Requirement: Owner can edit or delete
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// Requirement: Like/Unlike a post
router.post('/:id/like', postController.likePost);

// Requirement: Owner can get their own posts
router.get('/my-posts', postController.getMyPosts);

module.exports = router;
