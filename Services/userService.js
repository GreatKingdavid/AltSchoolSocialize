// const User = require('../models/User');

// exports.followUser = async (currentUserId, targetUserId) => {
//   if (currentUserId.toString() === targetUserId.toString()) {
//     throw new Error("You cannot follow yourself");
//   }

//   // $addToSet prevents duplicate following
//   await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
//   await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
  
//   return { message: "Followed successfully" };
// };

// exports.unfollowUser = async (currentUserId, targetUserId) => {
//   await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
//   await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
  
//   return { message: "Unfollowed successfully" };
// };

// exports.getConnections = async (userId, type) => {
//   // type is either 'following' or 'followers'
//   const user = await User.findById(userId).populate(type, 'first_name last_name username');
//   return user[type];
// };

const User = require('../models/User');

exports.followUser = async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId) {
    throw new Error('You cannot follow yourself');
  }

  // Update target user's followers and current user's following list simultaneously
  await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
  return await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
};

exports.unfollowUser = async (currentUserId, targetUserId) => {
  await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
  return await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
};

exports.getFollowingList = async (userId) => {
  const user = await User.findById(userId).populate('following', 'username first_name last_name');
  return user.following;
};

exports.getFollowersList = async (userId) => {
  const user = await User.findById(userId).populate('followers', 'username first_name last_name');
  return user.followers;
};