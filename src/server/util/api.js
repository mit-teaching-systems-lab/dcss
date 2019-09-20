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

// error handling middleware needs 4 parameters, even though we don't use it, we MUST define it:
// eslint-disable-next-line no-unused-vars
exports.errorHandler = (error, req, res, next) => exports.apiError(res, error);

// This function wraps around async middlewares and catches errors
exports.asyncMiddleware = middle => {
    if (typeof middle !== 'function') {
        throw new Error('Must provide a function to asyncMiddleware');
    }
    if (middle.length == 2 || middle.length == 3) {
        // (req, res) or (req, res, next)
        return async function asyncMiddlewareWrapper(req, res, next) {
            try {
                return await middle(req, res, next);
            } catch (error) {
                next(error);
            }
        };
    } else if (middle.length == 4) {
        // (error, req, res, next)
        return async function asyncErrorHandlingMiddlewareWrapper(
            error,
            req,
            res,
            next
        ) {
            try {
                return await middle(error, req, res, next);
            } catch (error) {
                next(error);
            }
        };
    } else {
        throw new Error(
            `Unknown length of function parameters - needs (req, res), (req, res, next) or (error, req, res, next) -- got: ${middle}`
        );
    }
};
