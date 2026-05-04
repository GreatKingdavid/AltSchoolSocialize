const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

// 1. Follow a User (Requirement: No self-following & No duplicates)
exports.follow = catchAsync(async (req, res, next) => {
    const targetUserId = req.params.id; // Person you want to follow
    const currentUserId = req.user;     // You (from the Bouncer)

    // A. Check: Don't follow yourself
    if (currentUserId.toString() === targetUserId) {
        const error = new Error("You cannot follow yourself!");
        error.statusCode = 400;
        return next(error);
    }

    // B. Check: Are you already following them?
    const currentUser = await User.findById(currentUserId);
    if (currentUser.following.includes(targetUserId)) {
        const error = new Error("You are already following this user");
        error.statusCode = 400;
        return next(error);
    }

    // C. Action: Update both users at the same time
    // $addToSet ensures the ID is only added once
    await Promise.all([
        User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } }),
        User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } })
    ]);

    res.status(200).json({ status: 'success', message: 'User followed successfully' });
});

// 2. Unfollow a User
exports.unfollow = catchAsync(async (req, res, next) => {
    const targetUserId = req.params.id;
    const currentUserId = req.user;

    // Remove from both lists
    await Promise.all([
        User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } }),
        User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } })
    ]);

    res.status(200).json({ status: 'success', message: 'User unfollowed successfully' });
});

// 3. Get Following List (Requirement: Get users they follow)
exports.getFollowing = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user).populate('following', 'username first_name last_name');
    
    res.status(200).json({ 
        status: 'success', 
        results: user.following.length, 
        data: { following: user.following } 
    });
});

// 4. Get Followers List (Requirement: Get users following them)
exports.getFollowers = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user).populate('followers', 'username first_name last_name');
    
    res.status(200).json({ 
        status: 'success', 
        results: user.followers.length, 
        data: { followers: user.followers } 
    });
});
