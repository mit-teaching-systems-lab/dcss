exports.apiError = (res, error) => {
    const { status = 400, message } = error;
    // TODO: turn on stack in DEV
    const result = {
        error: true,
        message
    };
    if (process.env.NODE_ENV !== 'production') {
        result.stack = error.stack;
        console.error(error.stack);
    }
    return res.status(status).json(result);
};

// This function wraps around async middlewares and catches errors
exports.asyncMiddleware = middle => async (req, res, next) => {
    try {
        return await middle(req, res, next);
    } catch (error) {
        exports.apiError(res, error);
    }
};
