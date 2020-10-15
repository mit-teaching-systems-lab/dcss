const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { runForRequest } = require('./middleware');
const { getScenarioConsent, getScenarioPrompts } = require('../scenarios/db');

async function newOrExistingRunAsync(req, res) {
  const { scenario_id } = req.params;
  const { id: user_id } = req.session.user;

  // TODO: investigate using ON CONFLICT RETURN *
  let run = await db.getRunByScenarioAndUserId(scenario_id, user_id);

  try {
    if (!run) {
      const { id: consent_id } = await getScenarioConsent(scenario_id);
      run = await db.createRun(scenario_id, user_id, consent_id);
    }
    res.json({ run });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function upsertResponseAsync(req, res) {
  const { id: run_id, user_id } = await runForRequest(req);
  const { response_id } = req.params;
  const { created_at, ended_at, ...response } = req.body;
  const newResponse = {
    run_id,
    response_id,
    response,
    user_id,
    created_at,
    ended_at
  };

  try {
    const response = await db.upsertResponse(newResponse);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getResponseAsync(req, res) {
  const { id: run_id, user_id } = await runForRequest(req);
  const { response_id } = req.params;

  try {
    const response = await db.getResponse({ run_id, response_id, user_id });
    const transcript = await db.getResponseTranscript({
      run_id,
      response_id,
      user_id
    });

    if (response && transcript) {
      Object.assign(response.response, transcript);
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getTranscriptionOutcomeAsync(req, res) {
  const { id: run_id, user_id } = await runForRequest(req);
  const { response_id } = req.params;

  try {
    // This returns a transcript record, not a response
    // object with a transcript!
    const outcome = await db.getTranscriptionOutcome({
      run_id,
      response_id,
      user_id
    });

    res.json({ outcome });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getRunDataAsync(req, res) {
  const { run_id } = req.params;
  const responses = await db.getRunResponses({ run_id });
  const prompts = {};

  try {
    for (const response of responses) {
      if (!prompts[response.scenario_id]) {
        prompts[response.scenario_id] = [
          await getScenarioPrompts(response.scenario_id)
        ];
      }
    }

    res.json({ prompts, responses });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function updateRunAsync(req, res) {
  const { id } = await runForRequest(req);
  const body = req.body;
  try {
    const run = await db.updateRun(id, body);
    res.json({ run });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function revokeConsentForRunAsync(req, res) {
  const { id } = await runForRequest(req);
  try {
    const run = await db.updateRun(id, { consent_granted_by_user: false });
    res.json({ run });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getReferrerParamsAsync(req, res) {
  try {
    const { referrer_params } = await runForRequest(req);
    res.json({ referrer_params });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function finishRunAsync(req, res) {
  try {
    const { id } = await runForRequest(req);
    res.json(await db.finishRun(id));
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function saveRunEventAsync(req, res) {
  const { id } = await runForRequest(req);
  const { name, context } = req.body;
  try {
    const event = await db.saveRunEvent(id, name, context);
    res.status(201).json({ event });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getRunsAsync(req, res) {
  const { id: user_id } = req.session.user;
  try {
    const runs = await db.getRuns(user_id);
    res.json({ runs });
  } catch (error) {
    res.status(500).json({ error });
  }
}

exports.finishRun = asyncMiddleware(finishRunAsync);
exports.getReferrerParams = asyncMiddleware(getReferrerParamsAsync);
exports.getResponse = asyncMiddleware(getResponseAsync);
exports.getRunData = asyncMiddleware(getRunDataAsync);
exports.getTranscriptionOutcome = asyncMiddleware(getTranscriptionOutcomeAsync);
exports.getRuns = asyncMiddleware(getRunsAsync);
exports.newOrExistingRun = asyncMiddleware(newOrExistingRunAsync);
exports.saveRunEvent = asyncMiddleware(saveRunEventAsync);
exports.revokeConsentForRun = asyncMiddleware(revokeConsentForRunAsync);
exports.updateRun = asyncMiddleware(updateRunAsync);
exports.upsertResponse = asyncMiddleware(upsertResponseAsync);
