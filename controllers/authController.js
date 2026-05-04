const authService = require('../Services/authServices');
const catchAsync = require('../utils/catchAsync');

// 1. SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
    const result = await authService.register(req.body);

    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        },
        data: { user: result.user }
    });
});

// 2. SIGNIN 
exports.signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    // Call the loginUser function in our authService
    const result = await authService.loginUser(email, password);

    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        },
        data: { user: result.user }
    });
});
