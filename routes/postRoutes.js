const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect, optionalAuth } = require('../middlewear/authMiddleware'); // Assuming you have these

// Public & Private Access
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getSinglePost);

// Protected Access
router.use(protect); 
router.post('/', postController.createPost);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

exports.likePost = async (postId, userId) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { likes: userId } }, // Only adds if userId isn't already there
    { new: true }
  );
  if (post) post.like_count = post.likes.length;
  return await post.save();
};

exports.unlikePost = async (postId, userId) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $pull: { likes: userId } }, // Removes the userId
    { new: true }
  );
  if (post) post.like_count = post.likes.length;
  return await post.save();
};

exports.getMyPosts = async (userId, state, page = 1) => {
  const limit = 20;
  const filter = { author: userId };
  if (state) filter.state = state;

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  return posts;
};

module.exports = router;