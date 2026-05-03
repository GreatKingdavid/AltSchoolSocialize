const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load the environment variables
dotenv.config();

//  Create the 1-hour Access Token
const generateAccessToken = (id) => {
return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
});
};

//  Create the long-term Refresh Token
const generateRefreshToken = (id) => {
return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
});
};

//  Verify the Access Token (The Bouncer uses this)
const verifyAccessToken = (token) => {
try {
return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
} catch (error) {
return null; // Token is expired or tampered with
}
};

//  Verify the Refresh Token (Used to get a new Access Token)
const verifyRefreshToken = (token) => {
try {
return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
} catch (error) {
return null;
}
};

module.exports = {
generateAccessToken,
generateRefreshToken,
verifyAccessToken,
verifyRefreshToken
};