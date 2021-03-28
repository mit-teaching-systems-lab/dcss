import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveRunEvent } from '@actions/run';

export const ANSWER_ANNOTATION = 'answer-annotation';
export const AUDIO_RECORD_PERMISSION_GRANTED =
  'audio-record-permission-granted';
export const AUDIO_RECORD_PERMISSION_DENIED = 'audio-record-permission-denied';
export const AUDIO_PLAYBACK_MANUAL_PAUSE = 'audio-playback-manual-pause';
export const AUDIO_PLAYBACK_MANUAL_PLAY = 'audio-playback-manual-play';
export const AUDIO_RECORD_INSTANT_START = 'audio-record-instant-start';
export const AUDIO_RECORD_INSTANT_STOP = 'audio-record-instant-stop';
export const AUDIO_RECORD_MANUAL_START = 'audio-record-manual-start';
export const AUDIO_RECORD_MANUAL_STOP = 'audio-record-manual-stop';
export const BUTTON_PRESS = 'button-press';
export const CHAT_JOIN = 'chat-join';
export const CHAT_PART = 'chat-part';
export const CHAT_MESSAGE = 'chat-message';
export const CHAT_CLOSE_COMPLETE = 'chat-close-complete';
export const CHAT_CLOSE_INCOMPLETE = 'chat-close-incomplete';
export const CHAT_CLOSE_TIMEOUT = 'chat-close-timeout';
export const POINTER_SELECT = 'pointer-select';
export const PROMPT_RESPONSE_SUBMITTED = 'prompt-response-submitted';
export const SCENARIO_CONSENT_ARRIVAL = 'scenario-consent-arrival';
export const SCENARIO_CONSENT_ACKNOWLEDGE = 'scenario-consent-acknowledge';
export const SCENARIO_CONSENT_CONTINUE = 'scenario-consent-continue';
export const SCENARIO_ARRIVAL = 'scenario-arrival';
export const SCENARIO_START = 'scenario-start';
export const SCENARIO_COMPLETE = 'scenario-complete';
export const SLIDE_ARRIVAL = 'slide-arrival';
export const SLIDE_CONTINUE = 'slide-continue';
export const SLIDE_NEXT = 'slide-next';
export const SLIDE_GOTO = 'slide-goto';
export const SLIDE_PREVIOUS = 'slide-previous';
export const SLIDE_SUBMIT = 'slide-submit';
export const SUGGESTION_CLOSE = 'suggestion-close';
export const SUGGESTION_OPEN = 'suggestion-open';
export const TEXT_INPUT_CHANGE = 'text-input-change';
export const TEXT_INPUT_ENTER = 'text-input-enter';
export const TEXT_INPUT_EXIT = 'text-input-exit';
export const VIDEO_PLAYBACK_INSTANT_END = 'video-playback-instant-end';
export const VIDEO_PLAYBACK_INSTANT_INTERRUPTION_PAUSE =
  'video-playback-instant-interruption-pause';
export const VIDEO_PLAYBACK_INSTANT_INTERRUPTION_PLAY =
  'video-playback-instant-interruption-play';
export const VIDEO_PLAYBACK_INSTANT_START = 'video-playback-instant-start';
export const VIDEO_PLAYBACK_MANUAL_PAUSE = 'video-playback-manual-pause';
export const VIDEO_PLAYBACK_MANUAL_START = 'video-playback-manual-start';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function(Component) {
  function WithRunEventCapturing(props) {
    return <Component {...props} />;
  }

  WithRunEventCapturing.displayName = `WithRunEventCapturing(${getDisplayName(
    Component
  )})`;

  WithRunEventCapturing.propTypes = {
    saveRunEvent: PropTypes.func,
    run: PropTypes.object
  };

  const mapStateToProps = state => {
    const { run } = state;
    return { run };
  };

  const mapDispatchToProps = dispatch => ({
    saveRunEvent(event, context) {
      if (location.pathname.includes('/run/')) {
        // this === this.props
        // eslint-disable-next-line no-console
        // console.log(event, context);
        dispatch(saveRunEvent(this.run.id, event, context));
      }
    }
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(WithRunEventCapturing);
}
