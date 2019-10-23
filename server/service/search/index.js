const { asyncMiddleware } = require('../../util/api');
const { Router } = require('express');

const searchRouter = Router();

const { getUsers, getRuns } = require('./endpoints');

searchRouter.get(
    '/:view',
    asyncMiddleware(async (request, response, next) => {
        const {
            params: { view }
        } = request;
        // Meh. I had ideas about how I might
        // make this all dynamic, but I lost
        // the thread and this is what I
        // ended up with. Refactor as needed.
        let responder;

        if (view === 'users') {
            responder = getUsers;
        }
        if (view === 'runs') {
            responder = getRuns;
        }

        if (responder) {
            try {
                return await responder(request, response);
            } catch (error) {
                next(error);
            }
        }
    })
);

module.exports = searchRouter;
