// Middleware Error Handler
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace

    // Check if the error is a known type (e.g., ValidationError)
    // and handle it accordingly
    if (err.name === 'ValidationError') {
        
        return res.status(422).json({ error: err.message });
    }

    // Handle 404 Not Found errors
    if (err.name === 'NotFound') {
        return res.status(404).json({ error: 'Not Found' });
    }

    // For all other errors, return a generic 500 Internal Server Error
    res.status(500).json({ 
        message:err?.message,
        stack:err?.stack,
    });
};

module.exports = errorHandler;
