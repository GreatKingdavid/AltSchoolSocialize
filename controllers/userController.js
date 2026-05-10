const userService = require('../Services/userService');
const catchAsync = require('../utils/catchAsync');

exports.follow = catchAsync(async (req, res) => {
  await userService.followUser(req.user._id, req.params.id);
  res.status(200).json({ status: 'success', message: 'User followed successfully' });
});

exports.unfollow = catchAsync(async (req, res) => {
  await userService.unfollowUser(req.user._id, req.params.id);
  res.status(200).json({ status: 'success', message: 'User unfollowed successfully' });
});

exports.getFollowing = catchAsync(async (req, res) => {
  const following = await userService.getFollowingList(req.user._id);
  res.status(200).json({ status: 'success', data: following });
});

exports.getFollowers = catchAsync(async (req, res) => {
  const followers = await userService.getFollowersList(req.user._id);
  res.status(200).json({ status: 'success', data: followers });
});