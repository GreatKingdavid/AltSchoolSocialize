const authService = require('../Services/authServices');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res) => {
  const result = await authService.signup(req.body);
  res.status(201).json({ success: true, ...result });
});

exports.signin = catchAsync(async (req, res) => {
  const result = await authService.signin(req.body.email, req.body.password);
  res.status(200).json({ success: true, ...result });
});