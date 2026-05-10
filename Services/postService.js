const Post = require('../models/Post');

exports.createPost = async (postData, userId) => {
  return await Post.create({ ...postData, author: userId });
};

exports.getPosts = async (query) => {
  const { page = 1, limit = 20, state, author, title, tags, sortBy } = query;
  
  const filter = {};
  if (state) filter.state = state;
  if (author) filter.author = author;
  if (title) filter.title = { $regex: title, $options: 'i' };
  if (tags) filter.tags = { $in: tags.split(',') };

  // Determine sort order
  let sort = {};
  if (sortBy) {
    const parts = sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort = { createdAt: -1 }; // Default to newest
  }

  const posts = await Post.find(filter)
    .populate('author', 'username first_name last_name')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Post.countDocuments(filter);

  return { posts, totalPages: Math.ceil(count / limit), currentPage: page };
};

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

exports.getFeed = async (userId, page = 1) => {
  const limit = 20;
  // First, find the user to get their 'following' list
  const user = await User.findById(userId);
  const followedIds = user.following || [];

  // Query: Author is either the user OR in their following list
  const filter = {
    author: { $in: [userId, ...followedIds] },
    state: 'published' // Usually, feeds only show published content
  };

  const posts = await Post.find(filter)
    .populate('author', 'username first_name last_name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  return posts;
};