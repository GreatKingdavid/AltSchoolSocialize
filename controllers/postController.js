const postService = require('../Services/postService');
const Post = require('../models/Post');
const catchAsync = require('../utils/catchAsync');

// --- 1. CREATE NEW POST ---
exports.createNewPost = catchAsync(async (req, res, next) => {
    const post = await postService.createPost(req.user, req.body);
    res.status(201).json({ status: 'success', data: { post } });
});

// --- 2. UPDATE POST (OWNER ONLY) ---
exports.updatePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) return next(new Error('Post not found'));
    
    // Ownership check (using .toString() for ID comparison)
    if (post.author.toString() !== req.user.toString()) {
        const error = new Error("Oga, you don't own this post!");
        error.statusCode = 403;
        return next(error);
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { 
        new: true, 
        runValidators: true 
    });
    res.status(200).json({ status: 'success', data: { post: updatedPost } });
});

// --- 3. PUBLISH POST (OWNER ONLY) ---
exports.publishPost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) return next(new Error('Post not found'));
    if (post.author.toString() !== req.user.toString()) {
        const error = new Error("Unauthorized action");
        error.statusCode = 403;
        return next(error);
    }

    post.state = 'published';
    await post.save();
    res.status(200).json({ status: 'success', message: 'Post is now live!', data: { post } });
});

// --- 4. GET ALL PUBLISHED ---
exports.getAllPublished = catchAsync(async (req, res, next) => {
    const posts = await postService.getPublishedPosts(req.query);
    res.status(200).json({ status: 'success', results: posts.length, data: { posts } });
});

// --- 5. LIKE/UNLIKE POST ---
exports.likePost = catchAsync(async (req, res, next) => {
    const post = await postService.toggleLike(req.params.id, req.user);
    res.status(200).json({ status: 'success', data: { likes: post.like_count } });
});

// --- 6. DELETE POST (OWNER ONLY) ---
exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    
    if (!post) return next(new Error('Post not found'));
    if (post.author.toString() !== req.user.toString()) {
        const error = new Error("You cannot delete this!");
        error.statusCode = 403;
        return next(error);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
});

// --- 7. GET SINGLE POST (Missing in your current code) ---
exports.getSinglePost = catchAsync(async (req, res, next) => {
    const post = await Post.findOne({ _id: req.params.id, state: 'published' })
        .populate('author', 'first_name last_name username');

    if (!post) {
        const error = new Error('Post not found or is still a draft');
        error.statusCode = 404;
        return next(error);
    }

    res.status(200).json({ status: 'success', data: { post } });
});

// --- 8. GET LOGGED-IN USER'S POSTS (Missing in your current code) ---
exports.getMyPosts = catchAsync(async (req, res, next) => {
    const posts = await Post.find({ author: req.user });
    res.status(200).json({ status: 'success', results: posts.length, data: { posts } });
});
