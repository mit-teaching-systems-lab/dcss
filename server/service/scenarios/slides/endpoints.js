const { asyncMiddleware } = require('../../../util/api');

const { reqScenario } = require('../middleware');
const db = require('./db');

exports.getSlides = asyncMiddleware(async (req, res) => {
    const { id } = reqScenario(req);
    const slides = await db.getSlidesForScenario(id);
    res.json({ slides, status: 200 });
});

exports.getSlidesResponseComponents = asyncMiddleware(async (req, res) => {
    const { id } = reqScenario(req);
    const slides = await db.getSlidesForScenario(id);
    const components = slides.reduce((accum, slide) => {
        if (slide.components && slide.components.length) {
            accum.push(
                ...slide.components.reduce((accum, component) => {
                    if (component.responseId) {
                        accum.push({
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
    res.json({ components, status: 200 });
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
        }),
        status: 200
    });
});

exports.orderSlides = asyncMiddleware(async (req, res) => {
    const { id: scenario_id } = reqScenario(req);
    const slide_ids = req.body.slides.map(id => {
        if (typeof id === 'object') return id.id;
        return id;
    });
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
    const { title, order, components, is_finish = false } = req.body;
    res.json({
        slide: await db.updateSlide(slide_id, {
            title,
            order,
            components,
            is_finish
        }),
        status: 200
    });
});

exports.setAllSlides = asyncMiddleware(async (req, res) => {
    const { id: scenario_id } = reqScenario(req);
    const { slides } = req.body;
    res.json({
        slides: await db.setAllSlides(scenario_id, slides),
        status: 200
    });
});

exports.deleteSlide = asyncMiddleware(async (req, res) => {
    // TODO: ensure slide id is part of scenario / author permissions / etc
    const { id: scenario_id } = reqScenario(req);
    const { slide_id: id } = req.params;
    res.json({
        result: await db.deleteSlide({ id, scenario_id }),
        status: 200
    });
});
