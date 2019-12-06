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

exports.joinCohort = asyncMiddleware(async function joinCohortAsync(req, res) {
    const user_id = req.session.user.id;
    const { id: cohort_id, role } = req.params;
    const result = await db.setCohortUserRole({
        cohort_id,
        user_id,
        role,
        action: 'join'
    });
    res.json(result.rows);
});

exports.quitCohort = asyncMiddleware(async function quitCohortAsync(req, res) {
    const user_id = req.session.user.id;
    const { id: cohort_id, role } = req.params;
    const result = await db.setCohortUserRole({
        cohort_id,
        user_id,
        role,
        action: 'quit'
    });
    res.json(result.rows);
});

exports.doneCohort = asyncMiddleware(async function doneCohortAsync(req, res) {
    const user_id = req.session.user.id;
    const { id: cohort_id, role } = req.params;
    const result = await db.setCohortUserRole({
        cohort_id,
        user_id,
        role,
        action: 'done'
    });
    res.json(result.rows);
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
