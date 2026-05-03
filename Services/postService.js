const Post = require('../models/Post');

// 1. Create a Post (Force to 'draft' state per requirement)
exports.createPost = async (userId, postData) => {
    return await Post.create({
        ...postData,
        author: userId,
        state: 'draft' 
    });
};

// 2. Get Published Posts (Pagination, Search, Filter, Sort)
exports.getPublishedPosts = async (query) => {
    // A. Pagination (Default 20 per page)
    const page = Math.abs(parseInt(query.page)) || 1;
    const limit = Math.abs(parseInt(query.limit)) || 20;
    const skip = (page - 1) * limit;

    // B. Filtering & Searching
    const filter = { state: 'published' };
    
    if (query.author) filter.author = query.author;
    if (query.tags) filter.tags = { $in: query.tags.split(',') };
    if (query.search) {
        filter.title = { $regex: query.search, $options: 'i' };
    }

    // C. Sorting (Orderable by likes, comments, timestamp)
    let sort = { createdAt: -1 }; 
    if (query.orderBy) {
        const field = query.orderBy === 'timestamp' ? 'createdAt' : query.orderBy;
        sort = { [field]: -1 };
    }

    // D. Execution (Return author info with post)
    return await Post.find(filter)
        .populate('author', 'first_name last_name username email') 
        .sort(sort)
        .skip(skip)
        .limit(limit);
};

// 3. Toggle Like Logic (Prevents double-liking)
exports.toggleLike = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
    }

    const hasLiked = post.likedBy.includes(userId);

    return await Post.findByIdAndUpdate(
        postId,
        hasLiked 
            ? { $pull: { likedBy: userId }, $inc: { like_count: -1 } } 
            : { $addToSet: { likedBy: userId }, $inc: { like_count: 1 } },
        { new: true }
    );
};
