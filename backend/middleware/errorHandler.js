// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
};

module.exports = { errorHandler };