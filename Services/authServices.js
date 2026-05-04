const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');

// This line ensures the function is exported
exports.register = async (userData) => {
 const { first_name, last_name, username, email, password } = userData;

 // 1. Validation: Check all fields exist
 if (!first_name || !last_name || !username || !email || !password) {
 const error = new Error('Please provide all required fields');
 error.statusCode = 400;
 throw error;
 }

 if (password.length < 8) {
 const error = new Error('Password must be at least 8 characters');
 error.statusCode = 400;
 throw error;
 }

 // 2. Conflict Check: Database lookup
 const existingUser = await User.findOne({
 $or: [{ email }, { username }]
 });

 if (existingUser) {
 const field = existingUser.username === username ? 'username' : 'email';
 const error = new Error(`User with this ${field} already exists`);
 error.statusCode = 409;
 throw error;
 }

 // 3. Create User
 const newUser = await User.create({
 first_name,
 last_name,
 username,
 email,
 password // The Model should handle bcrypt hashing automatically
 });

 // 4. Generate Tokens
 const accessToken = generateAccessToken(newUser._id);
 const refreshToken = generateRefreshToken(newUser._id);

 // 5. Cleanup: Remove password from the response object
 const userResponse = newUser.toObject();
 delete userResponse.password;

 return {
 user: userResponse,
 accessToken,
 refreshToken
 };
};

// 
exports.loginUser = async (email, password) => {
    // 1. Find user and manually select password (because we set select: false in the model)
    const user = await User.findOne({ email }).select('+password');

    // 2. If no user or password doesn't match
    if (!user || !(await user.comparePassword(password))) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    // 3. Generate new tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 4. Cleanup
    const userResponse = user.toObject();
    delete userResponse.password;

    return { 
        user: userResponse, 
        accessToken, 
        refreshToken 
    };
};
