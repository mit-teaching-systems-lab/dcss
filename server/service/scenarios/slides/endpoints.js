const { asyncMiddleware } = require('../../../util/api');

const { reqScenario } = require('../middleware');
const db = require('./db');

exports.getSlides = asyncMiddleware(async (req, res) => {
    const { id } = reqScenario(req);
    const slides = await db.getSlidesForScenario(id);
    res.json({ slides, status: 200 });
});

exports.addSlide = asyncMiddleware(async (req, res) => {
    const { id: scenario_id } = reqScenario(req);
    const { title, order, components } = req.body;
    res.json({
        slide: await db.addSlide({ scenario_id, title, order, components }),
        status: 200
    });
});

exports.orderSlides = asyncMiddleware(async (req, res) => {
    const { id: scenario_id } = reqScenario(req);
    const slide_ids = req.body.slides;
    res.json({
        slides: await db.updateSlideOrder({
            scenario_id,
            slide_ids
        }),
        status: 200
    });
});

exports.updateSlide = asyncMiddleware(async (req, res) => {
    // TODO: ensure slide id is part of scenario / author permissions / etc
    const { slide_id } = req.params;
    const { title, order, components } = req.body;
    res.json({
        slide: await db.updateSlide(slide_id, { title, order, components }),
        status: 200
    });
});
