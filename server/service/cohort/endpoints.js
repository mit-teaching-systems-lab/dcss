const { asyncMiddleware } = require('../../util/api');

const db = require('./db');

exports.createCohort = asyncMiddleware(async function createCohort(req, res) {
    const user_id = req.session.user.id;
    const { name } = req.body;
    const cohort = await db.createCohort({ name, user_id });
    res.json({ cohort });
});

exports.getCohort = asyncMiddleware(async function getCohort(req, res) {
    const { id } = req.params;
    const cohort = await db.getCohort({ id });
    res.json({ cohort });
});

exports.getCohorts = asyncMiddleware(async function getCohorts(req, res) {
    const user_id = req.session.user.id;
    const cohorts = await db.getCohorts({ user_id });
    res.json({ cohorts });
});

exports.setCohort = asyncMiddleware(async function setCohort(req, res) {
    //
    //
    //
    // TODO!
    //
    //
    //
    // const { id } = req.params;
    const { cohort } = req.body;

    res.json({ cohort });
});

exports.setCohortScenarios = asyncMiddleware(async function setCohortScenarios(
    req,
    res
) {
    const { id } = req.params;
    const { scenarios } = req.body;

    await db.setCohortScenarios({ id, scenarios });
    res.json({ scenarios });
});

exports.listUserCohorts = asyncMiddleware(async function listUserCohorts(
    req,
    res
) {
    const user_id = req.session.user.id;
    const cohorts = await db.listUserCohorts({ user_id });
    res.json({ cohorts });
});
