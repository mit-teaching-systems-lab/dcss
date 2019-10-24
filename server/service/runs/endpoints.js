const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { runForRequest } = require('./middleware');

exports.createRun = asyncMiddleware(async function createRun(req, res) {
    const { scenario_id } = req.params;
    const { id: user_id } = req.session.user;
    res.json(await db.createRun({ scenario_id, user_id }));
});

exports.postResponseData = asyncMiddleware(async function postResponseData(
    req,
    res
) {
    const { id: run_id } = await runForRequest(req);
    const { response_id } = req.params;
    const response = req.body;
    res.json(await db.upsertResponse({ run_id, response_id, response }));
});

exports.finishRun = asyncMiddleware(async function createRun(req, res) {
    const { id } = await runForRequest(req);
    res.json(await db.finishRun(id));
});
