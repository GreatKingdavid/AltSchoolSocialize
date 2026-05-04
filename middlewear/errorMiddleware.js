// A professional catch-all for any error in the app
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Hide stack trace in production for security
    const response = {
        status: err.status,
        message: err.message || 'Something went wrong on the server',
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
};

// middleware/errorMiddleware.js

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

