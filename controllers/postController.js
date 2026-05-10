const postService = require('../Services/postService');
const Post = require('../models/Post');
const catchAsync = require('../utils/catchAsync');

exports.createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.body, req.user._id);
  res.status(201).json({ status: 'success', data: post });
});

exports.getAllPosts = catchAsync(async (req, res) => {
  // Logic allows both logged-in and guests via the service
  const result = await postService.getPosts(req.query);
  res.status(200).json({ status: 'success', ...result });
});

exports.updatePost = catchAsync(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
  if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

  Object.assign(post, req.body);
  await post.save();
  res.status(200).json({ status: 'success', data: post });

});

// Add these if they are missing
exports.getSinglePost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username first_name last_name');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.status(200).json({ status: 'success', data: post });
});

exports.deletePost = catchAsync(async (req, res) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id });
  if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
  res.status(204).send();
});

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

exports.getUserFeed = catchAsync(async (req, res) => {
  const feed = await postService.getFeed(req.user._id, req.query.page);
  res.status(200).json({ status: 'success', results: feed.length, data: feed });
});