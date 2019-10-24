const { asyncMiddleware } = require('../../util/api');
const { requireUser } = require('../auth/middleware');
const db = require('./db');

const runCache = new WeakMap();

exports.runForRequest = async req => {
    if (!runCache.has(req)) {
        runCache.set(req, await db.getRunById(req.params.run_id));
    }
    return runCache.get(req);
};

exports.requireUserForRun = [
    requireUser,
    asyncMiddleware(async function requireUserForRun(req, res, next) {
        const { user_id } = await exports.runForRequest(req);
        if (user_id != req.session.user.id) {
            const eAccess = new Error('Access Denied, this is not your run');
            eAccess.status = 401;
            throw eAccess;
        }
        // the user is the owner of the run!
        next();
    })
];
