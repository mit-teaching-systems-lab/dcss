const {
  // Use for restricting access to cohort-specific interactions
  requireCohortUserRole
} = require('./middleware');
const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const chatsdb = require('../chats/db');
const sessiondb = require('../session/db');
const scenariosdb = require('../scenarios/db');

const requiredSiteRoles = ['super_admin', 'admin', 'researcher', 'facilitator'];
const requiredCohortRoles = ['owner', 'facilitator'];

async function createCohort(req, res) {
  const scenario_id = null;
  const is_open = false;
  const user_id = req.session.user.id;
  const { name } = req.body;
  const cohort = await db.createCohort(name, user_id);
  // const chatCreated = await chatsdb.createChat(
  //   user_id,
  //   scenario_id,
  //   cohortCreated.id,
  //   is_open
  // );
  // const chat = await chatsdb.joinChat(chatCreated.id, user_id);
  // const cohort = await db.setCohort(cohortCreated.id, {
  //   chat_id: chatCreated.id
  // });
  res.json({ cohort });
}

async function getCohort(req, res) {
  const id = Number(req.params.id);
  const cohort = await db.getCohort(id);

  const { user } = req.session;

  let isUserSuperOwnerOrFacilitator = user.is_super;

  if (!isUserSuperOwnerOrFacilitator) {
    const cohortUser = cohort.usersById[user.id];

    if (cohortUser) {
      isUserSuperOwnerOrFacilitator =
        cohortUser.is_owner || cohortUser.roles.includes('facilitator');
    }
  }

  if (!isUserSuperOwnerOrFacilitator) {
    cohort.runs = cohort.runs.filter(run => run.user_id === user.id);
  }

  res.json({ cohort });
}

async function getCohortScenarios(req, res) {
  const id = Number(req.params.id);
  const scenarios = await db.getCohortScenarios(id);
  res.json({ scenarios });
}

async function getCohorts(req, res) {
  const user = req.session.user;
  const cohorts = await db.getCohorts(user);
  res.json({ cohorts });
}

async function getCohortsCount(req, res) {
  try {
    const user = req.session.user;
    const count = await db.getCohortsCount(user);
    res.send({ count });
  } catch (apiError) {
    const error = new Error('Error while getting cohorts count.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function getCohortsSlice(req, res) {
  const user = req.session.user;
  const { direction, offset, limit } = req.params;
  try {
    const cohorts = await db.getCohortsSlice(user, direction, offset, limit);
    res.send({ cohorts });
  } catch (apiError) {
    const error = new Error('Error while getting cohorts in range.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function getRecentCohorts(req, res) {
  const user = req.session.user;
  const { orderBy, limit } = req.params;
  try {
    const cohorts = await db.getRecentCohorts(user, orderBy, limit);
    res.send({ cohorts });
  } catch (apiError) {
    const error = new Error('Error while getting recent cohorts.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function getCohortChatsOverview(req, res) {
  const chats = await db.getCohortChatsOverview(Number(req.params.id));
  res.send({ chats });
}

// async function getMyCohorts(req, res) {
//   const user_id = req.session.user.id;
//   const cohorts = await db.getMyCohorts(user_id);
//   res.json({ cohorts });
// }

// async function getAllCohorts(req, res) {
//   const cohorts = await db.getAllCohorts();
//   res.json({ cohorts });
// }

async function linkCohortToRun(req, res) {
  const id = Number(req.params.id);
  const run_id = Number(req.params.run_id);
  await db.linkCohortToRun(id, run_id);
  const cohort = await db.getCohort(id);
  res.json({ cohort });
}

async function joinCohort(req, res) {
  const user_id = req.session.user.id;
  const id = Number(req.params.id);
  const role = req.params.role;
  const cohortUsers = await db.linkUserToCohort(id, user_id, role, 'join');
  res.json(cohortUsers);
}

async function quitCohort(req, res) {
  const user_id = req.session.user.id;
  const id = Number(req.params.id);
  const role = req.params.role;
  const cohortUsers = await db.linkUserToCohort(id, user_id, role, 'quit');
  res.json(cohortUsers);
}

async function doneCohort(req, res) {
  const user_id = req.session.user.id;
  const id = Number(req.params.id);
  const role = req.params.role;
  const cohortUsers = await db.linkUserToCohort(id, user_id, role, 'done');
  res.json(cohortUsers);
}

async function setCohort(req, res) {
  //
  // NOTE: this endpoint is not guarded by validateRequestBody
  //
  const id = Number(req.params.id);
  const { name = null, deleted_at = null, is_archived = null } = req.body;

  const updates = {
    updated_at: new Date().toISOString()
  };

  if (name) {
    updates.name = name;
  }

  // When restoring a cohort, deleted_at will be set to null.
  if (deleted_at !== undefined) {
    updates.deleted_at = deleted_at;
  }

  if (is_archived !== null) {
    updates.is_archived = is_archived;
  }

  let cohort;

  if (Object.entries(req.body).length && Object.entries(updates).length) {
    cohort = await db.setCohort(id, updates);
  } else {
    cohort = await db.getCohort(id);
  }

  res.json({ cohort });
}

async function setCohortScenarios(req, res) {
  const id = Number(req.params.id);
  const { scenarios } = req.body;
  await db.setCohortScenarios(id, scenarios);
  res.json({ scenarios });
}

async function getCohortScenarioPartnering(req, res) {
  const id = Number(req.params.id);
  const partnering = await db.getCohortScenarioPartnering(id);
  res.json({ partnering });
}

async function setCohortScenarioPartnering(req, res) {
  const id = Number(req.params.id);
  const { partnering } = req.body;
  for (const { scenario_id, partnering_id } of partnering) {
    await db.setCohortScenarioPartnering(id, scenario_id, partnering_id);
  }
  res.json({ partnering });
}

async function getCohortData(req, res) {
  const { id, scenario_id } = req.params;
  const prompts = await scenariosdb.getScenarioPrompts(scenario_id);
  const responses = await db.getCohortRunResponses({ id, scenario_id });
  res.json({ prompts, responses });
}

async function getCohortParticipantData(req, res) {
  const { id, participant_id } = req.params;
  const responses = await db.getCohortRunResponses({
    id,
    participant_id
  });

  const prompts = {};

  for (const response of responses) {
    if (!prompts[response.scenario_id]) {
      prompts[response.scenario_id] = [
        ...(await scenariosdb.getScenarioPrompts(response.scenario_id))
      ];
    }
  }
  res.json({ prompts, responses });
}

async function addCohortUserRole(req, res) {
  const { cohort_id, user_id, roles } = req.body;
  const user = await sessiondb.getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined.');
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
    const error = new Error('Error while adding roles.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function deleteCohortUserRole(req, res) {
  const { cohort_id, user_id, roles } = req.body;
  const user = await sessiondb.getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined.');
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
    const error = new Error('Error while deleting roles.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function copyCohort(req, res) {
  const user_id = req.session.user.id;
  const { name, scenarios } = await db.getCohort(Number(req.params.id));

  const cohort = await db.createCohort(`${name} COPY`, user_id);

  await db.setCohortScenarios(cohort.id, scenarios);

  res.json({
    cohort: {
      ...cohort,
      scenarios
    }
  });
}

exports.createCohort = asyncMiddleware(createCohort);
exports.copyCohort = asyncMiddleware(copyCohort);
exports.getCohort = asyncMiddleware(getCohort);
exports.getCohortScenarios = asyncMiddleware(getCohortScenarios);
exports.getCohortScenarioPartnering = asyncMiddleware(getCohortScenarioPartnering);
exports.getCohorts = asyncMiddleware(getCohorts);
exports.getCohortsCount = asyncMiddleware(getCohortsCount);
exports.getCohortsSlice = asyncMiddleware(getCohortsSlice);
// exports.getMyCohorts = asyncMiddleware(getMyCohorts);
// exports.getAllCohorts = asyncMiddleware(getAllCohorts);
exports.linkCohortToRun = asyncMiddleware(linkCohortToRun);
exports.joinCohort = asyncMiddleware(joinCohort);
exports.quitCohort = asyncMiddleware(quitCohort);
exports.doneCohort = asyncMiddleware(doneCohort);
exports.setCohort = asyncMiddleware(setCohort);
exports.setCohortScenarios = asyncMiddleware(setCohortScenarios);
exports.setCohortScenarioPartnering = asyncMiddleware(setCohortScenarioPartnering);
exports.getCohortData = asyncMiddleware(getCohortData);
exports.getRecentCohorts = asyncMiddleware(getRecentCohorts);
exports.getCohortParticipantData = asyncMiddleware(getCohortParticipantData);
exports.addCohortUserRole = asyncMiddleware(addCohortUserRole);
exports.deleteCohortUserRole = asyncMiddleware(deleteCohortUserRole);
exports.getCohortChatsOverview = asyncMiddleware(getCohortChatsOverview);
