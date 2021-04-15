const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { runForRequest } = require('./middleware');
const scenariosdb = require('../scenarios/db');

async function newOrExistingRun(req, res) {
  const scenario_id = Number(req.params.scenario_id);
  const identifiers = {
    scenario_id
  };

  if (req.params.cohort_id) {
    identifiers.cohort_id = Number(req.params.cohort_id);
  }

  if (req.params.chat_id) {
    identifiers.chat_id = Number(req.params.chat_id);
  }

  try {
    let run = await db.getRunByIdentifiers(req.session.user.id, identifiers);

    if (!run) {
      const consent = await scenariosdb.getScenarioConsent(scenario_id);
      run = await db.createRun(req.session.user.id, scenario_id, consent.id);
    }
    res.json({ run });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getRunByIdentifiers(req, res) {
  const host_id = req.session.user.id;
  const scenario_id = Number(req.params.scenario_id || req.body.scenario_id);
  const cohort_id = Number(req.params.cohort_id || req.body.cohort_id) || null;
  const chat_id = Number(req.params.chat_id || req.body.chat_id) || null;

  const identifiers = {
    scenario_id
  };

  if (cohort_id) {
    identifiers.cohort_id = cohort_id;
  }

  if (chat_id) {
    identifiers.chat_id = chat_id;
  }

  let run = await db.getRunByIdentifiers(host_id, identifiers);

  res.json({ run });
}

async function upsertResponse(req, res) {
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

async function getResponse(req, res) {
  const { id: run_id, user_id } = await runForRequest(req);
  const { response_id } = req.params;

  try {
    const response = await db.getResponse({ run_id, response_id, user_id });

    if (!response) {
      return res.json({ response });
    }

    const transcriptRecord = await db.getResponseTranscript({
      run_id,
      response_id,
      user_id
    });

    const type = response.response.type;

    response.response.isEmpty = !response.response.value;
    response.response.isAudioPlayback =
      type === 'AudioPrompt' || type === 'ConversationPrompt';

    if (response.response.isAudioPlayback) {
      if (transcriptRecord) {
        response.response.transcript = transcriptRecord.transcript;

        if (
          transcriptRecord.response &&
          (!transcriptRecord.response.results.length &&
            !transcriptRecord.response.result_index)
        ) {
          response.response.isEmpty = true;
        }
      }
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getTranscriptionOutcome(req, res) {
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

async function getRunData(req, res) {
  const { run_id } = req.params;
  const responses = await db.getRunResponses(run_id);
  const prompts = {};

  try {
    for (const response of responses) {
      if (!prompts[response.scenario_id]) {
        // This was previously, and inexplicably, written as:
        // prompts[response.scenario_id] = [
        //   await scenariosdb.getScenarioPrompts(response.scenario_id)
        // ];
        //
        prompts[response.scenario_id] = await scenariosdb.getScenarioPrompts(
          response.scenario_id
        );
      }
    }

    res.json({ prompts, responses });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function setRun(req, res) {
  const { id } = await runForRequest(req);
  const body = req.body;
  try {
    const run = await db.setRun(id, body);
    res.json({ run });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function revokeConsentForRun(req, res) {
  const { id } = await runForRequest(req);
  try {
    const run = await db.setRun(id, { consent_granted_by_user: false });
    res.json({ run });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getReferrerParams(req, res) {
  try {
    const { referrer_params } = await runForRequest(req);
    res.json({ referrer_params });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// TODO: determin if this is in use.
async function finishRun(req, res) {
  try {
    const { id } = await runForRequest(req);
    res.json(await db.finishRun(id));
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function saveRunEvent(req, res) {
  const { id } = await runForRequest(req);
  const { name, context } = req.body;
  try {
    const event = await db.saveRunEvent(id, req.session.user.id, name, context);
    res.status(201).json({ event });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getRuns(req, res) {
  const { id: user_id } = req.session.user;
  try {
    const runs = await db.getRuns(user_id);
    res.json({ runs });
  } catch (error) {
    res.status(500).json({ error });
  }
}

exports.finishRun = asyncMiddleware(finishRun);
exports.getReferrerParams = asyncMiddleware(getReferrerParams);
exports.getResponse = asyncMiddleware(getResponse);
exports.getRunData = asyncMiddleware(getRunData);
exports.getTranscriptionOutcome = asyncMiddleware(getTranscriptionOutcome);
exports.getRuns = asyncMiddleware(getRuns);
exports.getRunByIdentifiers = asyncMiddleware(getRunByIdentifiers);
exports.newOrExistingRun = asyncMiddleware(newOrExistingRun);
exports.saveRunEvent = asyncMiddleware(saveRunEvent);
exports.revokeConsentForRun = asyncMiddleware(revokeConsentForRun);
exports.setRun = asyncMiddleware(setRun);
exports.upsertResponse = asyncMiddleware(upsertResponse);
