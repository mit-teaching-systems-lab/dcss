exports.apiError = (res, error) => {
    const { status = 400, message } = error;
    // TODO: turn on stack in DEV
    return res.status(status).json({ error: true, message });
};

// This function wraps around async middlewares and catches errors
exports.asyncMiddleware = middle => (req, res, next) =>
    Promise.resolve(middle(req, res, next)).catch(e => exports.apiError(e));
