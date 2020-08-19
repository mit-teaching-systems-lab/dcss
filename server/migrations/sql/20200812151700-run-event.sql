CREATE TABLE event (
  name TEXT PRIMARY KEY,
  template TEXT,
  is_relevant BOOLEAN DEFAULT TRUE
);

INSERT INTO event (name, template)
VALUES
(
  'audio-record-permission-granted',
  '{participant} granted permission to use their microphone for recording audio prompt responses.'
),
(
  'audio-record-permission-denied',
  '{participant} denied permission to use their microphone for recording audio prompt responses.'
),
(
  'audio-playback-manual-pause',
  '{participant} paused the playback of a previously recorded {audio prompt response}.'
),
(
  'audio-playback-manual-play',
  '{participant} played a previously recorded {audio prompt response}.'
),
(
  'audio-record-instant-start',
  '{participant} experienced an {audio prompt response} automatically start recording.'
),
(
  'audio-record-instant-stop',
  '{participant} experienced an {audio prompt response} automatically stop recording.'
),
(
  'audio-record-manual-start',
  '{participant} clicked the "start recording" button to start recording an {audio prompt response}.'
),
(
  'audio-record-manual-stop',
  '{participant} clicked the "stop recording" button to stop recording an {audio prompt response}.'
),
(
  'button-press',
  '{participant} clicked a response button in a multiple button prompt.'
),
(
  'pointer-select',
  '{participant} selected something in the slide with their pointer.'
),
(
  'prompt-response-submitted',
  '{participant} submitted a response to {a prompt}.'
),
(
  'scenario-consent-arrival',
  '{participant} arrived at the consent slide for {the scenario}.'
),
(
  'scenario-consent-acknowledge',
  '{participant} acknowledged scenario consent screen by making a selection.'
),
(
  'scenario-consent-continue',
  '{participant} continued from the scenario consent screen, into {the scenario}.'
),
(
  'scenario-arrival',
  '{participant} arrived at {the scenario}.'
),
(
  'scenario-start',
  '{participant} start {the scenario}.'
),
(
  'scenario-complete',
  '{participant} completed {the scenario}.'
),
(
  'slide-arrival',
  '{participant} arrived at {a slide}.'
),
(
  'slide-continue',
  '{participant} clicked the "Continue" button on {a slide}.'
),
(
  'slide-next',
  '{participant} clicked the "Next" button on {a slide}.'
),
(
  'slide-goto',
  '{participant} clicked a button to choose the slide to navigate to.'
),
(
  'slide-previous',
  '{participant} clicked the "Previous" button {a slide}.'
),
(
  'slide-submit',
  '{participant} clicked the "Submit" button on {a slide}.'
),
(
  'suggestion-close',
  '{participant} clicked the "close" button on {a suggestion}.'
),
(
  'suggestion-open',
  '{participant} clicked the "open" button on {a suggestion}.'
),
(
  'text-input-change',
  '{participant} changed the text within a text input prompt.'
),
(
  'text-input-enter',
  '{participant} entered a text input prompt.'
),
(
  'text-input-exit',
  '{participant} exited a text input prompt.'
),
(
  'video-playback-instant-end',
  '{participant} experienced a video automatically end playback.'
),
(
  'video-playback-instant-interruption-pause',
  '{participant} clicked "pause" on a video that had played automatically.'
),
(
  'video-playback-instant-interruption-play',
  '{participant} clicked "play" on a paused video that had initially been played automatically.'
),
(
  'video-playback-instant-start',
  '{participant} experienced a video automatically start playback.'
),
(
  'video-playback-manual-pause',
  '{participant} clicked "pause" on a video to manually pause playback.'
),
(
  'video-playback-manual-start',
  '{participant} clicked "play" on a video to manually start playback.'
),

-- Placeholder --
(
  'event-name',
  'The description field will be used to store prose that illustrates how and when the event will occur.'
);

CREATE TABLE run_event (
  id SERIAL PRIMARY KEY,
  run_id INT NOT NULL REFERENCES run(id),
  name TEXT NOT NULL REFERENCES event(name),
  context JSONB
  /*
  context {
    url: location.href

    -- Event timestamp in milliseconds
    timestamp: TIMESTAMPTZ,

    -- A snapshot of the slide is included in the event context to
    -- ensure that this can be replayed exactly as the participant
    -- experienced it.
    slide: { ...slide }

    -- A snapshot of the component is included in the event context to
    -- ensure that this can be replayed exactly as the participant
    -- experienced it.
    component: { ...component }

    -- If the event is associated with a prompt response, then a response_id
    -- is included in the event context in order to link this event to
    -- an actual response record
    response_id: response_id | null

    -- If the event is associated with a prompt response reflecting on
    -- previous response, then a recall_id is included in the event
    -- context in order to link this event to an actual response record
    recall_id: recall_id | null,

  }
  */
);


-- Up above
---
-- Down below

DELETE FROM run_event;
DELETE FROM event;

DROP TABLE run_event;
DROP TABLE event;
