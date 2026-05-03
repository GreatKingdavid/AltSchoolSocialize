const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');

const register = async (userData) => {
    const { first_name, last_name, username, email, password } = userData;

    // 1. Validation: Professional error throwing
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
        password // The Model should handle the Bcrypt hashing automatically
    });

    // 4. Generate Tokens (Requirement: 1-hour access token)
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // 5. Cleanup: Remove password from the object for security
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return {
        user: userResponse,
        accessToken,
        refreshToken
    };
};

module.exports = { register };
