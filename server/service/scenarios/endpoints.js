const uuid = require('uuid/v4');
const { asyncMiddleware } = require('../../util/api');
const { getUserForClientByProps } = require('../auth/db');
const { reqScenario } = require('./middleware');

const {
  addSlide,
  getScenarioSlides,
  setAllSlides,
  setScenarioCategories,
  setSlide
} = require('./slides/db');
const db = require('./db');

async function getScenarioAsync(req, res) {
  res.send({ scenario: reqScenario(req), status: 200 });
}

async function getAllScenariosAsync(req, res) {
  try {
    const scenarios = await db.getAllScenarios();
    scenarios.forEach(scenario => {
      scenario.user_is_author = req.session.user
        ? scenario.author_id === req.session.user.id
        : false;
    });
    const result = { scenarios, status: 200 };
    res.send(result);
  } catch (apiError) {
    const error = new Error('Error while getting all scenarios');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function addScenarioAsync(req, res) {
  const userId = req.session.user.id;
  const { author, title, description, categories } = req.body;
  let authorId = userId;

  if (!userId || !title || !description) {
    const scenarioCreateError = new Error(
      "The scenario's title and description must be provided by a valid user"
    );
    scenarioCreateError.status = 409;
    throw scenarioCreateError;
  }

  if (author && author.id) {
    authorId = author.id;
  }

  try {
    const scenario = await db.addScenario(authorId, title, description);
    await db.setScenarioCategories(scenario.id, categories);
    const result = { scenario, status: 201 };

    res.send(result);
  } catch (apiError) {
    const error = new Error('Error while creating scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function setScenarioAsync(req, res) {
  const {
    author,
    author_id,
    deleted_at,
    description,
    categories,
    consent,
    finish,
    status,
    title
  } = req.body;
  const scenarioId = req.params.scenario_id;
  let authorId = author_id;

  if (author && author.id) {
    authorId = author.id || author_id;
  }

  if (!authorId && !title && !description) {
    const scenarioUpdateError = new Error(
      'Must provide author, author_id, title, or description to update'
    );
    scenarioUpdateError.status = 409;
    throw scenarioUpdateError;
  }

  try {
    const scenario = await db.setScenario(scenarioId, {
      author_id: authorId,
      deleted_at,
      description,
      status,
      title
    });

    await db.setScenarioCategories(scenarioId, categories);

    // If the client set the id to null, that indicates that
    // this is a new consent agreement and the new prose
    // must be stored, then linked to the scenario.
    if (!consent.id) {
      const { id, prose } = await db.addConsent(consent);

      await db.setScenarioConsent(
        scenarioId,
        Object.assign(consent, { id, prose })
      );
    }

    if (!finish.id) {
      const { components, id, is_finish } = await addSlide({
        components:
          finish.components ||
          '[{"html": "<h2>Thanks for participating!</h2>","type": "Text"}]',
        is_finish: true,
        scenario_id: scenarioId,
        title: finish.title || ''
      });

      Object.assign(finish, {
        components,
        id,
        is_finish
      });
    } else {
      await setSlide(finish.id, finish);
    }

    Object.assign(scenario, {
      categories,
      consent,
      finish
    });

    res.send({ scenario, status: 200 });
  } catch (apiError) {
    const error = new Error('Error while updating scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function deleteScenarioAsync(req, res) {
  const scenarioId = req.params.scenario_id;

  if (!scenarioId) {
    const scenarioDeleteError = new Error(
      'Scenario id required for scenario deletion'
    );
    scenarioDeleteError.status = 409;
    throw scenarioDeleteError;
  }

  try {
    const scenario = await db.deleteScenario(scenarioId);
    const result = { scenario, status: 200 };

    res.send(result);
  } catch (apiError) {
    const error = new Error('Error while deleting scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function softDeleteScenarioAsync(req, res) {
  const scenarioId = req.params.scenario_id;

  if (!scenarioId) {
    const error = new Error('Scenario id required for scenario deletion');
    error.status = 409;
    throw error;
  }

  try {
    const scenario = await db.softDeleteScenario(scenarioId);

    res.send({ scenario, status: 200 });
  } catch (apiError) {
    const error = new Error('Error while soft deleting scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function copyScenarioAsync(req, res) {
  const scenarioId = req.params.scenario_id;

  if (!scenarioId) {
    const error = new Error(
      'Original scenario id required for creating a copy'
    );
    error.status = 409;
    throw error;
  }

  try {
    const userId = req.session.user.id;
    const { title, description, categories, finish } = reqScenario(req);
    const scenario = await db.addScenario(userId, `${title} COPY`, description);
    const slides = (await getScenarioSlides(scenarioId)).filter(
      ({ is_finish }) => !is_finish
    );

    // When copying a scenario, not only do new responseIds need to be set,
    // but any recallIds that refer to old responseIds must be mapped to
    // the copy's responseId
    const slidesNeedRecallIdUpdate = [];
    const responseIdMap = {};

    // 1. Find all response components and assign each one a new responseId,
    //    while saving a mapping of "old response id" => "new response id"
    //    to be used in remapping the recallIds.
    for (const slide of slides) {
      for (const component of slide.components) {
        // When a response component has been
        // found, assign it a newly generated responseId,
        // to prevent duplicate responseId values from
        // being created.
        //
        // This check used to use:
        //
        // Object.prototype.hasOwnProperty.call(component, 'responseId')
        //
        // But no longer needs to, since responseId cannot be empty.
        //
        if (component.responseId) {
          // Save the original responseId, so we can use
          // it for mapping to recallId in a second pass.
          responseIdMap[component.responseId] = `${component.type}-${uuid()}`;
          component.responseId = responseIdMap[component.responseId];
        }

        // If any slide uses a ResponseRecall component, add the slide
        // to an update list.
        if (component.recallId && !slidesNeedRecallIdUpdate.includes(slide)) {
          slidesNeedRecallIdUpdate.push(slide);
        }
      }
    }

    console.log('slidesNeedRecallIdUpdate:', slidesNeedRecallIdUpdate);

    // 2. If any slide has been flagged for recallId remapping, update them.
    for (const slide of slidesNeedRecallIdUpdate) {
      for (const component of slide.components) {
        component.recallId = responseIdMap[component.recallId];
      }
    }

    await db.setScenarioCategories(scenario.id, categories);
    await setAllSlides(scenario.id, slides);

    const consent = await db.getScenarioConsent(scenarioId);
    const { id, prose } = await db.addConsent(consent);

    await db.setScenarioConsent(
      scenario.id,
      Object.assign(consent, { id, prose })
    );

    Object.assign(scenario, {
      consent,
      categories,
      finish
    });
    res.send({ scenario, status: 201 });
  } catch (apiError) {
    const error = new Error('Error while copying scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function getScenarioRunHistoryAsync(req, res) {
  const history = await db.getScenarioRunHistory(req.params);
  res.send({ history, status: 200 });
}

async function getScenarioByRunAsync(req, res) {
  const userId = req.session.user.id;
  const scenarios = await db.getScenarioByRun(userId);
  res.send({ scenarios, status: 200 });
}

exports.getScenario = asyncMiddleware(getScenarioAsync);
exports.getAllScenarios = asyncMiddleware(getAllScenariosAsync);
exports.addScenario = asyncMiddleware(addScenarioAsync);
exports.setScenario = asyncMiddleware(setScenarioAsync);
exports.deleteScenario = asyncMiddleware(deleteScenarioAsync);
exports.softDeleteScenario = asyncMiddleware(softDeleteScenarioAsync);
exports.copyScenario = asyncMiddleware(copyScenarioAsync);
exports.getScenarioRunHistory = asyncMiddleware(getScenarioRunHistoryAsync);
exports.getScenarioByRun = asyncMiddleware(getScenarioByRunAsync);
