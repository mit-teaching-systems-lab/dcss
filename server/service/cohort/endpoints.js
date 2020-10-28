const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { getUserById } = require('../auth/db');
const { getScenarioPrompts } = require('../scenarios/db');

async function createCohortAsync(req, res) {
  const user_id = req.session.user.id;
  const { name } = req.body;
  const cohort = await db.createCohort({ name, user_id });
  res.json({ cohort });
}

async function getCohortAsync(req, res) {
  const { id } = req.params;
  const cohort = await db.getCohort(id);
  res.json({ cohort });
}

async function getMyCohortsAsync(req, res) {
  const user_id = req.session.user.id;
  const cohorts = await db.getMyCohorts(user_id);
  res.json({ cohorts });
}

async function getAllCohortsAsync(req, res) {
  const cohorts = await db.getAllCohorts();
  res.json({ cohorts });
}

async function linkCohortToRunAsync(req, res) {
  const { id, run_id } = req.params;

  await db.linkCohortToRun(id, run_id);

  const cohort = await db.getCohort(id);

  res.json({ cohort });
}

async function joinCohortAsync(req, res) {
  const user_id = req.session.user.id;
  const { id: cohort_id, role } = req.params;
  const cohortUsers = await db.linkUserToCohort(
    cohort_id,
    user_id,
    role,
    'join'
  );
  res.json(cohortUsers);
}

async function quitCohortAsync(req, res) {
  const user_id = req.session.user.id;
  const { id: cohort_id, role } = req.params;
  const cohortUsers = await db.linkUserToCohort(
    cohort_id,
    user_id,
    role,
    'quit'
  );
  res.json(cohortUsers);
}

async function doneCohortAsync(req, res) {
  const user_id = req.session.user.id;
  const { id: cohort_id, role } = req.params;
  const cohortUsers = await db.linkUserToCohort(
    cohort_id,
    user_id,
    role,
    'done'
  );
  res.json(cohortUsers);
}

async function setCohort(req, res) {
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
}

async function setCohortScenariosAsync(req, res) {
  const { id } = req.params;
  const { scenarios } = req.body;

  await db.setCohortScenarios(id, scenarios);
  res.json({ scenarios });
}

async function getCohortDataAsync(req, res) {
  const { id, scenario_id } = req.params;

  const prompts = await getScenarioPrompts(scenario_id);
  const responses = await db.getCohortRunResponses({ id, scenario_id });

  res.json({ prompts, responses });
}

async function getCohortParticipantDataAsync(req, res) {
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

async function listUserCohortsAsync(req, res) {
  const cohorts = await db.listUserCohorts(req.session.user.id);
  res.json({ cohorts });
}

async function addCohortUserRoleAsync(req, res) {
  const { cohort_id, user_id, roles } = req.body;
  const user = await getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined');
    error.status = 409;
    throw error;
  }

  // TODO: Further Permissions Checks - can this user edit these roles?

  try {
    const result = await db.addCohortUserRole(cohort_id, user_id, roles);
    const cohort = await db.getCohort(cohort_id);
    res.json({
      cohort,
      ...result
    });
  } catch (apiError) {
    const error = new Error('Error while adding roles');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function deleteCohortUserRoleAsync(req, res) {
  const { cohort_id, user_id, roles } = req.body;
  const user = await getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined');
    error.status = 409;
    throw error;
  }

  // TODO: Further Permissions Checks - can this user edit these roles?

  try {
    const result = await db.deleteCohortUserRole(cohort_id, user_id, roles);
    const cohort = await db.getCohort(cohort_id);
    res.json({
      cohort,
      ...result
    });
  } catch (apiError) {
    const error = new Error('Error while deleting roles');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

exports.createCohort = asyncMiddleware(createCohortAsync);
exports.getCohort = asyncMiddleware(getCohortAsync);
exports.getMyCohorts = asyncMiddleware(getMyCohortsAsync);
exports.getAllCohorts = asyncMiddleware(getAllCohortsAsync);
exports.linkCohortToRun = asyncMiddleware(linkCohortToRunAsync);
exports.joinCohort = asyncMiddleware(joinCohortAsync);
exports.quitCohort = asyncMiddleware(quitCohortAsync);
exports.doneCohort = asyncMiddleware(doneCohortAsync);
exports.setCohort = asyncMiddleware(setCohort);
exports.setCohortScenarios = asyncMiddleware(setCohortScenariosAsync);
exports.getCohortData = asyncMiddleware(getCohortDataAsync);
exports.getCohortParticipantData = asyncMiddleware(
  getCohortParticipantDataAsync
);
exports.listUserCohorts = asyncMiddleware(listUserCohortsAsync);
exports.addCohortUserRole = asyncMiddleware(addCohortUserRoleAsync);
exports.deleteCohortUserRole = asyncMiddleware(deleteCohortUserRoleAsync);
