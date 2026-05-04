const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./dbconfig/db'); // Importing your existing DB config
const globalErrorHandler = require('./middlewear/errorMiddleware');

// Import Route Files
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');


console.log("Check AuthRoutes:", typeof authRoutes);
console.log("Check PostRoutes:", typeof postRoutes);
console.log("Check UserRoutes:", typeof userRoutes);
console.log("Check ErrorHandler:", typeof globalErrorHandler);

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


// 69f85f1f812880dcf9629514
// {
//   "status": "success",
//   "data": {
//     "post": {
//       "title": "My AltSchool Journey",
//       "content": "This is my second semester project!",
//       "tags": [
//         "altschool",
//         "backend",
//         "nigeria"
//       ],
//       "author": "69f859db448cde18fbca0d26",
//       "state": "draft",
//       "link_count": 0,
//       "likedBy": [],
//       "comment_count": 0,
//       "_id": "69f85f1f812880dcf9629514",
//       "createdAt": "2026-05-04T08:55:59.438Z",
//       "updatedAt": "2026-05-04T08:55:59.438Z",
//       "__v": 0
//     }
//   }
// }
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Zjg1OWRiNDQ4Y2RlMThmYmNhMGQyNiIsImlhdCI6MTc3Nzg4NDY0NywiZXhwIjoxNzc3ODg4MjQ3fQ.2yveZk-fYX9Ie95w309_9eFnpU42KQjLW_VoYqFcwZY