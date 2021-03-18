const { asyncMiddleware } = require('../../../util/api');

const { requestScenario } = require('../middleware');
const db = require('./db');

async function getSlides(req, res) {
  const { id } = requestScenario(req);
  const slides = await db.getScenarioSlides(id);
  res.json({ slides });
}

async function getPromptComponentsByScenarioId(req, res) {
  const { id } = requestScenario(req);
  const slides = await db.getScenarioSlides(id);
  const components = slides.reduce((accum, slide, index) => {
    if (slide.is_finish) {
      return accum;
    }
    if (slide.components && slide.components.length) {
      accum.push(
        ...slide.components.reduce((accum, component) => {
          // If the component itself is a prompt (identified by a responseId)
          // OR, if the component embeds another component which is a prompt.
          if (
            component.responseId ||
            (component.component && component.component.responseId)
          ) {
            const pushable =
              component.component && component.component.responseId
                ? component.component
                : component;

            const isConditional = pushable === component.component;

            accum.push({
              index,
              slide,
              isConditional,
              ...pushable
            });
          }
          return accum;
        }, [])
      );
    }
    return accum;
  }, []);
  res.json({ components });
}

async function addSlide(req, res) {
  const { id: scenario_id } = requestScenario(req);
  const { title, order, components, is_finish = false } = req.body;
  res.json({
    slide: await db.createSlide({
      scenario_id,
      title,
      order,
      components,
      is_finish
    })
  });
}

async function orderSlides(req, res) {
  const { id: scenario_id } = requestScenario(req);
  const slide_ids = req.body.slides.map(id => {
    if (typeof id === 'object') return id.id;
    return id;
  });
  res.json({
    slides: await db.setSlideOrder(scenario_id, slide_ids)
  });
}

async function setSlide(req, res) {
  // TODO: ensure slide id is part of scenario / author permissions / etc
  const { slide_id } = req.params;
  const {
    title,
    order,
    components,
    is_finish = false,
    has_chat_enabled = false
  } = req.body;
  res.json({
    result: await db.setSlide(slide_id, {
      title,
      order,
      components,
      is_finish,
      has_chat_enabled
    })
  });
}

async function setAllSlides(req, res) {
  const { id: scenario_id } = requestScenario(req);
  const { slides } = req.body;
  res.json({
    slides: await db.setAllSlides(scenario_id, slides)
  });
}

async function deleteSlide(req, res) {
  // TODO: ensure slide id is part of scenario / author permissions / etc
  const { id: scenario_id } = requestScenario(req);
  const id = Number(req.params.slide_id);

  try {
    const count = await db.deleteSlide(scenario_id, id);

    if (count === 1) {
      const slides = await db.getScenarioSlides(scenario_id);
      res.json({ slides });
    }
  } catch (apiError) {
    const error = new Error('Error while deleting slide');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

exports.getSlides = asyncMiddleware(getSlides);
exports.getPromptComponentsByScenarioId = asyncMiddleware(
  getPromptComponentsByScenarioId
);
exports.addSlide = asyncMiddleware(addSlide);
exports.orderSlides = asyncMiddleware(orderSlides);
exports.setSlide = asyncMiddleware(setSlide);
exports.setAllSlides = asyncMiddleware(setAllSlides);
exports.deleteSlide = asyncMiddleware(deleteSlide);
