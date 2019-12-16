const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { getScenarioPrompts } = require('../scenarios/db');

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

exports.getMyCohorts = asyncMiddleware(async function getMyCohorts(req, res) {
    const user_id = req.session.user.id;
    const cohorts = await db.getMyCohorts({ user_id });
    res.json({ cohorts });
});

exports.linkCohortToRun = asyncMiddleware(async function linkCohortToRunAsync(
    req,
    res
) {
    const { id, run_id } = req.params;

    await db.linkCohortToRun({ id, run_id });

    const cohort = await db.getCohort({ id });

    res.json({ cohort, status: 200 });
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

exports.getCohortData = asyncMiddleware(async function getCohortDataAsync(
    req,
    res
) {
    const { id, scenario_id } = req.params;

    const prompts = await getScenarioPrompts(scenario_id);
    const responses = await db.getCohortRunResponses({ id, scenario_id });

    res.json({ prompts, responses });
});

exports.getCohortParticipantData = asyncMiddleware(
    async function getCohortDataAsync(req, res) {
        const { id, participant_id } = req.params;

        const responses = await db.getCohortRunResponses({
            id,
            participant_id
        });

        const prompts = {};

        for (const response of responses) {
            if (!prompts[response.scenario_id]) {
                prompts[response.scenario_id] = [
                    await getScenarioPrompts(response.scenario_id)
                ];
            }
        }

        res.json({ prompts, responses });
    }
);

exports.listUserCohorts = asyncMiddleware(async function listUserCohorts(
    req,
    res
) {
    const user_id = req.session.user.id;
    const cohorts = await db.listUserCohorts({ user_id });
    res.json({ cohorts });
});
