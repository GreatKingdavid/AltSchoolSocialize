const User = require('../models/User');

exports.followUser = async (currentUserId, targetUserId) => {
    // 1. Requirement: Users should not be able to follow themselves
    if (currentUserId.toString() === targetUserId.toString()) {
        const error = new Error("Oga, you cannot follow yourself!");
        error.statusCode = 400;
        throw error;
    }

    // 2. Check if already following (Requirement: No following the same user twice)
    const user = await User.findById(currentUserId);
    if (user.following.includes(targetUserId)) {
        const error = new Error("You are already following this user");
        error.statusCode = 400;
        throw error;
    }

    // 3. Double Update: Use Promise.all to update both users at once
    await Promise.all([
        // Add target to my 'following' list
        User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } }),
        // Add me to target's 'followers' list
        User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } })
    ]);

    return { message: "Followed successfully" };
};

exports.unfollowUser = async (currentUserId, targetUserId) => {
    // Double Update: Remove from both lists
    await Promise.all([
        User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } }),
        User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } })
    ]);

    return { message: "Unfollowed successfully" };
};
