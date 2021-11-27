const uuid = require('uuid/v4');
const { asyncMiddleware } = require('../../util/api');
const { requestScenario } = require('./middleware');
const { getUserById } = require('../session/db');
// const {
//   createSlide,
//   deleteSlide,
//   getScenarioSlides,
//   setSlide,
//   setSlideOrder
// } = require('./slides/db');

const personasdb = require('../personas/db');
const slidesdb = require('./slides/db');
const db = require('./db');

async function getScenario(req, res) {
  res.send({ scenario: requestScenario(req) });
}

async function getScenarioLock(req, res) {
  const scenario = db.getScenarioLock(req.params.scenario_id, req.params.lock);

  res.send({ scenario });
}

async function getScenarios(req, res) {
  try {
    const scenarios = await db.getScenarios();
    res.send({ scenarios });
  } catch (apiError) {
    const error = new Error('Error while getting all scenarios.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function getScenariosCount(req, res) {
  try {
    const count = await db.getScenariosCount();
    res.send({ count });
  } catch (apiError) {
    const error = new Error('Error while getting scenarios count.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function getScenariosByStatus(req, res) {
  const { status } = req.params;
  try {
    const scenarios = await db.getScenariosByStatus(Number(status));
    res.send({ scenarios });
  } catch (apiError) {
    const error = new Error('Error while getting scenarios by status.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function getScenariosSlice(req, res) {
  const { direction, offset, limit } = req.params;
  try {
    const scenarios = await db.getScenariosSlice(direction, offset, limit);
    res.send({ scenarios });
  } catch (apiError) {
    const error = new Error('Error while getting scenarios in range.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function createScenario(req, res) {
  const { author, title, description, categories } = req.body;
  const author_id = (author && author.id) || req.session.user.id;
  let message = '';

  if (!message && !title) {
    message = 'A title must be provided to create a new scenario.';
  }

  if (!author_id) {
    message = 'Permission denied.';
  }

  if (message) {
    const error = new Error(message);
    error.status = 422;
    throw error;
  }

  try {
    const scenario = await db.createScenario(author_id, title, description);
    await db.setScenarioCategories(scenario.id, categories);
    res.status(201).json({ scenario });
  } catch (apiError) {
    const error = new Error('Error while creating scenario.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function setScenario(req, res) {
  let user = req.session.user;
  const {
    author,
    deleted_at,
    description,
    categories,
    consent,
    finish,
    labels,
    personas,
    status,
    title
  } = req.body;
  const scenario_id = Number(req.params.scenario_id);
  let author_id = user.id;

  if (author && author.id) {
    author_id = author.id;
  }

  try {
    const scenario = await db.setScenario(scenario_id, {
      author_id,
      deleted_at,
      description,
      status,
      title
    });

    await db.setScenarioCategories(scenario_id, categories);
    await db.setScenarioLabels(scenario_id, labels);
    await db.setScenarioPersonas(scenario_id, personas);

    // If the client set the id to null, that indicates that
    // this is a new consent agreement and the new prose
    // must be stored, then linked to the scenario.
    if (!consent.id) {
      const { id, prose } = await db.createScenarioConsent(consent);

      await db.setScenarioConsent(
        scenario_id,
        Object.assign(consent, { id, prose })
      );
    }

    if (!finish.id) {
      const { components, id, is_finish } = await slidesdb.createSlide({
        scenario_id,
        components:
          finish.components ||
          '[{"html": "<h2>Thanks for participating!</h2>","type": "Text"}]',
        is_finish: true,
        title: finish.title || ''
      });

      Object.assign(finish, {
        components,
        id,
        is_finish
      });
    } else {
      await slidesdb.setSlide(finish.id, finish);
    }

    Object.assign(scenario, {
      categories,
      consent,
      finish,
      labels,
      personas
    });

    res.status(200).send({ scenario });
  } catch (apiError) {
    const error = new Error('Error while updating scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function deleteScenario(req, res) {
  const scenario_id = Number(req.params.scenario_id);

  if (!scenario_id) {
    const error = new Error('Scenario id required for scenario deletion');
    error.status = 409;
    throw error;
  }

  try {
    const scenario = await db.deleteScenario(scenario_id);
    res.send({ scenario });
  } catch (apiError) {
    const error = new Error('Error while deleting scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function createScenarioLock(req, res) {
  const scenario_id = Number(req.params.scenario_id);
  const user_id = Number(req.session.user.id);
  try {
    let lock = await db.getScenarioLock(scenario_id);
    if (!lock) {
      await db.createScenarioLock(scenario_id, user_id);
    }
    const scenario = await db.getScenario(scenario_id);
    res.send({ scenario });
  } catch (apiError) {
    const error = new Error('Error while unlocking scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function endScenarioLock(req, res) {
  const scenario_id = Number(req.params.scenario_id);
  const user_id = Number(req.session.user.id);
  try {
    const scenario = await db.getScenario(scenario_id);
    const lock = await db.getScenarioLock(scenario_id);
    if (!lock) {
      res.send({ scenario });
    } else {
      const unlock = await db.endScenarioLock(scenario_id, user_id);
      if (unlock) {
        res.send({ scenario });

        const slides = await slidesdb.getScenarioSlides(scenario_id);
        await db.createScenarioSnapshot(scenario_id, user_id, {
          ...scenario,
          slides
        });
      } else {
        throw new Error('Could not unlock scenario');
      }
    }
  } catch (apiError) {
    const error = new Error('Error while unlocking scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function softDeleteScenario(req, res) {
  if (!req.params.scenario_id) {
    const error = new Error('Scenario id required for scenario deletion');
    error.status = 409;
    throw error;
  }

  try {
    const scenario = await db.softDeleteScenario(req.params.scenario_id);

    res.send({ scenario });
  } catch (apiError) {
    const error = new Error('Error while soft deleting scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function copyScenario(req, res) {
  if (!req.params.scenario_id) {
    const error = new Error(
      'Original scenario id required for creating a copy'
    );
    error.status = 409;
    throw error;
  }

  try {
    const {
      title,
      description,
      categories,
      labels,
      personas
    } = requestScenario(req);
    const scenario = await db.createScenario(
      req.session.user.id,
      `${title} COPY`,
      description
    );
    const sourceSlides = await slidesdb.getScenarioSlides(
      req.params.scenario_id
    );
    const consent = await db.getScenarioConsent(req.params.scenario_id);

    await slidesdb.deleteSlide(scenario.id, scenario.finish.id);

    // When copying a scenario, not only do new responseIds need to be set,
    // but any recallIds that refer to old responseIds must be mapped to
    // the copy's responseId
    const slidesNeedRecallIdUpdate = [];
    // When copying a scenario, Annotation prompts need to have their
    // prompts list updated to whatever the new prompt id is for
    // the associated response prompt.
    const slidesNeedPromptIdUpdate = [];
    // Additionally, multipath ids need to be remapped.
    const slidesNeedPathSlideIdUpdate = [];
    const responsePromptIdMap = {};
    const slideIdMap = {};
    const slides = [];
    // 1. Find all response components and assign each one a new responseId,
    //    while saving a mapping of "old response id" => "new response id"
    //    to be used in remapping the recallIds.
    for (let sourceSlide of sourceSlides) {
      const slide = await slidesdb.createSlide({
        scenario_id: scenario.id,
        title: sourceSlide.title,
        components: sourceSlide.components,
        is_finish: sourceSlide.is_finish
      });

      slideIdMap[sourceSlide.id] = slide.id;

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
          responsePromptIdMap[component.responseId] = uuid();
          component.responseId = responsePromptIdMap[component.responseId];

          // If we encounter a MultiPathPrompt component...
          if (component.paths) {
            // Add the slide to an update list.
            slidesNeedPathSlideIdUpdate.push(slide);
          }

          // If we encounter an AnnotationPrompt component...
          if (
            component.prompts &&
            Array.isArray(component.prompts) &&
            !slidesNeedPromptIdUpdate.includes(slide)
          ) {
            // Add the slide to an update list.
            slidesNeedPromptIdUpdate.push(slide);
          }
        }

        // If any slide uses a ResponseRecall component, add the slide
        // to an update list.
        if (component.recallId && !slidesNeedRecallIdUpdate.includes(slide)) {
          slidesNeedRecallIdUpdate.push(slide);
        }

        // Make sure that all components have a new id
        component.id = uuid();
      }

      slides.push(slide);
    }

    // 2. If any slide has been flagged for recallId remapping, update them.
    for (const slide of slidesNeedRecallIdUpdate) {
      for (const component of slide.components) {
        component.recallId = responsePromptIdMap[component.recallId];
      }
    }

    // 3. If any slide has been flagged for prompt id remapping, update them.
    for (const slide of slidesNeedPromptIdUpdate) {
      for (const component of slide.components) {
        if (component.prompts && Array.isArray(component.prompts)) {
          component.prompts = component.prompts.map(
            oldResponsePromptId => responsePromptIdMap[oldResponsePromptId]
          );
        }
      }
    }

    // 4. If any slide contains a multipath component, the paths need to be updated.
    for (const slide of slidesNeedPathSlideIdUpdate) {
      if (!slide.is_finish) {
        for (const component of slide.components) {
          if (component.paths) {
            for (let componentPath of component.paths) {
              componentPath.value = slideIdMap[componentPath.value];
            }
          }
        }
      }
    }

    // const ids = [];
    for (let { id, components } of slides) {
      await slidesdb.setSlide(id, { components });
      // ids.push(id);
    }
    // await slidesdb.setSlideOrder(scenario.id, ids);

    await db.setScenarioCategories(scenario.id, categories);
    await db.setScenarioLabels(scenario.id, labels);

    // Personas must be duplicated as well.
    for (const persona of personas) {
      const index = personas.indexOf(persona);
      const { name, description, color } = persona;
      const author_id = req.session.user.id;

      const created = await personasdb.createPersona({
        author_id,
        name,
        description,
        color
      });

      personas[index] = created;

      for (const slide of slides) {
        let needsUpdate = false;
        for (const component of slide.components) {
          if (component.persona && component.persona.id === persona.id) {
            component.persona.id = created.id;
            needsUpdate = true;
          }
        }
        if (needsUpdate) {
          await slidesdb.setSlide(slide.id, slide);
        }
      }
    }

    await db.setScenarioPersonas(scenario.id, personas);

    {
      const { id, prose } = await db.createScenarioConsent(consent);
      Object.assign(consent, { id, prose });
      await db.setScenarioConsent(scenario.id, consent);
    }

    const finish = slides.find(({ is_finish }) => is_finish);

    Object.assign(scenario, {
      consent,
      categories,
      finish,
      labels,
      personas
    });
    res.send({ scenario, status: 201 });
  } catch (apiError) {
    const error = new Error('Error while copying scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function getScenarioByRun(req, res) {
  const userId = req.session.user.id;
  const scenarios = await db.getScenarioByRun(userId);
  res.send({ scenarios });
}

async function setScenarioUserRole(req, res) {
  const { scenario_id, user_id, roles } = req.body;
  const user = await getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined');
    error.status = 409;
    throw error;
  }

  try {
    const result = await db.setScenarioUserRole(scenario_id, user_id, roles);
    const scenario = await db.getScenario(scenario_id);
    res.json({
      scenario,
      ...result
    });
  } catch (apiError) {
    const error = new Error('Error while adding roles');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function endScenarioUserRole(req, res) {
  const { scenario_id, user_id, roles } = req.body;
  const user = await getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined');
    error.status = 409;
    throw error;
  }

  try {
    const result = await db.endScenarioUserRole(scenario_id, user_id, roles);
    const scenario = await db.getScenario(scenario_id);
    res.json({
      scenario,
      ...result
    });
  } catch (apiError) {
    const error = new Error('Error while deleting roles');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

exports.getScenario = asyncMiddleware(getScenario);
exports.getScenarioLock = asyncMiddleware(getScenarioLock);
exports.createScenarioLock = asyncMiddleware(createScenarioLock);
exports.endScenarioLock = asyncMiddleware(endScenarioLock);
exports.getScenarios = asyncMiddleware(getScenarios);
exports.getScenariosByStatus = asyncMiddleware(getScenariosByStatus);
exports.getScenariosCount = asyncMiddleware(getScenariosCount);
exports.getScenariosSlice = asyncMiddleware(getScenariosSlice);
exports.createScenario = asyncMiddleware(createScenario);
exports.setScenario = asyncMiddleware(setScenario);
exports.deleteScenario = asyncMiddleware(deleteScenario);
exports.softDeleteScenario = asyncMiddleware(softDeleteScenario);
exports.copyScenario = asyncMiddleware(copyScenario);
exports.getScenarioByRun = asyncMiddleware(getScenarioByRun);
exports.setScenarioUserRole = asyncMiddleware(setScenarioUserRole);
exports.endScenarioUserRole = asyncMiddleware(endScenarioUserRole);
