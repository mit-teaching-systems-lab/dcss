const { asyncMiddleware } = require('../../util/api');

const db = require('./db');

exports.createCohort = asyncMiddleware(async function createCohort(req, res) {
    const user_id = req.session.user.id;
    const { name } = req.body;
    const cohort = await db.createCohort({ name, user_id });
    res.json({ cohort });
});

exports.listUserCohorts = asyncMiddleware(async function listUserCohorts(
    req,
    res
) {
    const user_id = req.session.user.id;
    const cohorts = await db.listUserCohorts({ user_id });
    res.json({ cohorts });
});
