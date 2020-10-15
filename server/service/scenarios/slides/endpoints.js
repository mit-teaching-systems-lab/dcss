const { asyncMiddleware } = require('../../../util/api');

const { reqScenario } = require('../middleware');
const db = require('./db');

exports.getSlides = asyncMiddleware(async (req, res) => {
  const { id } = reqScenario(req);
  const slides = await db.getScenarioSlides(id);
  res.json({ slides });
});

exports.getPromptComponentsByScenarioId = asyncMiddleware(async (req, res) => {
  const { id } = reqScenario(req);
  const slides = await db.getScenarioSlides(id);
  const components = slides.reduce((accum, slide, index) => {
    if (slide.is_finish) {
      return accum;
    }
    if (slide.components && slide.components.length) {
      accum.push(
        ...slide.components.reduce((accum, component) => {
          if (component.responseId) {
            accum.push({
              index,
              slide,
              ...component
            });
          }
          return accum;
        }, [])
      );
    }
    return accum;
  }, []);
  res.json({ components });
});

exports.addSlide = asyncMiddleware(async (req, res) => {
  const { id: scenario_id } = reqScenario(req);
  const { title, order, components, is_finish = false } = req.body;
  res.json({
    slide: await db.addSlide({
      scenario_id,
      title,
      order,
      components,
      is_finish
    })
  });
});

exports.orderSlides = asyncMiddleware(async (req, res) => {
  const { id: scenario_id } = reqScenario(req);
  const slide_ids = req.body.slides.map(id => {
    if (typeof id === 'object') return id.id;
    return id;
  });
  res.json({
    slides: await db.setSlideOrder(scenario_id, slide_ids)
  });
});

exports.setSlide = asyncMiddleware(async (req, res) => {
  // TODO: ensure slide id is part of scenario / author permissions / etc
  const { slide_id } = req.params;
  const { title, order, components, is_finish = false } = req.body;
  res.json({
    result: await db.setSlide(slide_id, {
      title,
      order,
      components,
      is_finish
    })
  });
});

exports.setAllSlides = asyncMiddleware(async (req, res) => {
  const { id: scenario_id } = reqScenario(req);
  const { slides } = req.body;
  res.json({
    slides: await db.setAllSlides(scenario_id, slides)
  });
});

exports.deleteSlide = asyncMiddleware(async (req, res) => {
  // TODO: ensure slide id is part of scenario / author permissions / etc
  const { id: scenario_id } = reqScenario(req);
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
});
