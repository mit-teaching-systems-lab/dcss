const ServiceError = require('../../util/ServiceError');
const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

const status = 200;

async function getUsersAsync(request, response) {
    try {
        const { keyword } = request.query;
        const results = await db.getUsers(keyword);
        response.send({ results, status });
    } catch (apiError) {
        throw new ServiceError({
            message: 'Error while querying users',
            stack: apiError.stack
        });
    }
}

async function getRunsAsync(request, response) {
    try {
        const { keyword } = request.query;
        const results = await db.getRuns(keyword);
        response.send({ results, status });
    } catch (apiError) {
        throw new ServiceError({
            message: 'Error while querying runs',
            stack: apiError.stack
        });
    }
}

exports.getUsers = asyncMiddleware(getUsersAsync);
exports.getRuns = asyncMiddleware(getRunsAsync);
