const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./dbconfig/db'); // Importing your existing DB config
const globalErrorHandler = require('./middlewear/errorMiddleware');

// Import Route Files
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

// 1. Initialize Environment Variables
dotenv.config();

// 2. Connect to MongoDB
connectDB(); 

const app = express();

// 3. Global Middlewares
app.use(express.json()); // Essential to read data from req.body

// 4. Mount Routes
// These link the URLs to your Controllers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);

// 5. Handle Unhandled Routes (404)
// If a user types a wrong URL, this catches it
app.all('*splat', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(err);
});


// 6. Global Error Handling Middleware
// This is the "Safety Net" that sends clean error messages
app.use(globalErrorHandler);

// 7. Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});
