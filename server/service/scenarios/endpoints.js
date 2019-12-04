const uuid = require('uuid/v4');
const { asyncMiddleware } = require('../../util/api');

const { reqScenario } = require('./middleware');
const { getSlidesForScenario, setAllSlides } = require('./slides/db');
const db = require('./db');

exports.getScenario = asyncMiddleware(async function getScenarioAsync(
    req,
    res
) {
    res.send({ scenario: reqScenario(req), status: 200 });
});

exports.getAllScenarios = asyncMiddleware(async function getAllScenariosAsync(
    req,
    res
) {
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
});

exports.addScenario = asyncMiddleware(async function addScenarioAsync(
    req,
    res
) {
    const userId = req.session.user.id;
    const { title, description, categories } = req.body;

    if (!userId || !title || !description) {
        const scenarioCreateError = new Error(
            "The scenario's title and description must be provided by a valid user"
        );
        scenarioCreateError.status = 409;
        throw scenarioCreateError;
    }

    try {
        const scenario = await db.addScenario(userId, title, description);
        await db.setScenarioCategories(scenario.id, categories);
        const result = { scenario, status: 201 };

        res.send(result);
    } catch (apiError) {
        const error = new Error('Error while creating scenario');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
});

async function setScenarioAsync(req, res) {
    const {
        author_id,
        deleted_at,
        description,
        categories,
        consent,
        status,
        title
    } = req.body;
    const scenarioId = req.params.scenario_id;

    if (!author_id && !title && !description) {
        const scenarioUpdateError = new Error(
            'Must provide author_id, title, or description to update'
        );
        scenarioUpdateError.status = 409;
        throw scenarioUpdateError;
    }

    try {
        const scenario = await db.setScenario(scenarioId, {
            author_id,
            deleted_at,
            description,
            status,
            title
        });

        await db.setScenarioCategories(scenarioId, categories);

        // If the client set the id to null, that indicates that
        // this is a new consent agreement and the new prose
        // must be stored, then linked to the scenario.
        if (consent.id === null) {
            const { id, prose } = await db.addConsent(consent);

            await db.setScenarioConsent(
                scenarioId,
                Object.assign(consent, { id, prose })
            );
        }

        Object.assign(scenario, {
            consent
        });

        res.send({ scenario, status: 200 });
    } catch (apiError) {
        const error = new Error('Error while updating scenario');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
}

exports.setScenario = asyncMiddleware(setScenarioAsync);

exports.deleteScenario = asyncMiddleware(async function deleteScenarioAsync(
    req,
    res
) {
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
});

exports.softDeleteScenario = asyncMiddleware(
    async function softDeleteScenarioAsync(req, res) {
        const scenarioId = req.params.scenario_id;

        if (!scenarioId) {
            const scenarioDeleteError = new Error(
                'Scenario id required for scenario deletion'
            );
            scenarioDeleteError.status = 409;
            throw scenarioDeleteError;
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
);

exports.copyScenario = asyncMiddleware(async function copyScenarioAsync(
    req,
    res
) {
    const scenarioId = req.params.scenario_id;

    if (!scenarioId) {
        const scenarioCopyError = new Error(
            'Original scenario id required for creating a copy'
        );
        scenarioCopyError.status = 409;
        throw scenarioCopyError;
    }

    try {
        const userId = req.session.user.id;
        const { title, description, categories } = reqScenario(req);
        const originalSlides = await getSlidesForScenario(scenarioId);
        const scenario = await db.addScenario(
            userId,
            `${title} COPY`,
            description
        );

        await db.setScenarioCategories(scenario.id, categories);

        // Check through all components of this slide
        // for any that are response components...
        for (const slide of originalSlides) {
            for (const component of slide.components) {
                // ...When a response component has been
                // found, assign it a newly generated responseId,
                // to prevent duplicate responseId values from
                // being created.
                if (
                    Object.prototype.hasOwnProperty.call(
                        component,
                        'responseId'
                    )
                ) {
                    component.responseId = `${component.type}-${uuid()}`;
                }
            }
        }

        await setAllSlides(scenario.id, originalSlides);

        const consent = await db.getScenarioConsent(scenarioId);
        const { id, prose } = await db.addConsent(consent);

        await db.setScenarioConsent(
            scenario.id,
            Object.assign(consent, { id, prose })
        );

        Object.assign(scenario, {
            consent,
            categories
        });
        res.send({ scenario, status: 201 });
    } catch (apiError) {
        const error = new Error('Error while copying scenario');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
});

exports.getScenarioDataResearcher = asyncMiddleware(async function(req, res) {
    const scenarioId = req.params.scenario_id;
    const data = await db.getScenarioResearchData(scenarioId);
    res.send({ data });
});

exports.getScenarioByRun = asyncMiddleware(async function(req, res) {
    const userId = req.session.user.id;
    const scenarios = await db.getScenarioByRun(userId);
    res.send({ scenarios, status: 200 });
});
