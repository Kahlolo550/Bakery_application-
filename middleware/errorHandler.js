const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    let statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Invalid or expired token.';
    } else if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'A user with that email or username already exists.';
    } else if (err.isJoi) { // Joi validation error
        statusCode = 400;
        message = err.details[0].message;
    }

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;