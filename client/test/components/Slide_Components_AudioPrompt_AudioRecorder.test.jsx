/** @TEMPLATE: BEGIN **/
import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect
}));

import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import {
  act,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

async function waitForPopper() {
  // Popper update() - https://github.com/popperjs/react-popper/issues/350
  await act(async () => await null);
}

/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

import { mount, shallow } from 'enzyme';
import {
  GET_RESPONSE_SUCCESS,
  GET_TRANSCRIPTION_OUTCOME_SUCCESS
} from '../../actions/types';
import * as responseActions from '@actions/response';
jest.mock('../../actions/response');

globalThis.audioPlayerProps = {};
import AudioPlayer from '@components/Slide/Components/AudioPrompt/AudioPlayer';
jest.mock('@components/Slide/Components/AudioPrompt/AudioPlayer', () => {
  return props => {
    Object.assign(globalThis.audioPlayerProps, props);
    return <audio {...props} />;
  };
});
jest.mock('@components/Slide/Components/AudioPrompt/Transcript', () => {
  return props => {
    return <div>@components/Slide/Components/AudioPrompt/Transcript</div>;
  };
});

import Media, * as MediaConstants from '@utils/Media';
let audioNode;

import AudioRecorder from '../../components/Slide/Components/AudioPrompt/AudioRecorder.jsx';
/** @GENERATED: END **/

/** @TEMPLATE: BEGIN **/
const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;
/** @TEMPLATE: END **/

beforeAll(() => {
  /** @TEMPLATE: BEGIN **/
  (window || global).fetch = jest.fn();
  /** @TEMPLATE: END **/
});

afterAll(() => {
  /** @TEMPLATE: BEGIN **/
  jest.restoreAllMocks();
  /** @TEMPLATE: END **/
});

beforeEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);
  /** @TEMPLATE: END **/

  /** @GENERATED: BEGIN **/

  responseActions.getResponse = jest.fn();

  responseActions.getResponse.mockImplementation(() => async dispatch => {
    const response = {
      id: 457,
      run_id: 147,
      response: {
        type: 'AudioPrompt',
        value:
          'audio/147/719df986-9b4c-4dae-90b7-3227d82128b2/2/d1ca7580-3c87-4f88-89cf-32d68eb58a67.mp3',
        isSkip: false,
        content: '',
        response: { results: [], result_index: 0 },
        transcript: ''
      },
      created_at: '2020-04-25T18:03:38.384Z',
      ended_at: '2020-04-25T18:03:45.464Z',
      response_id: '719df986-9b4c-4dae-90b7-3227d82128b2',
      user_id: 2,
      updated_at: '2020-04-25T18:03:48.310Z'
    };
    dispatch({ type: GET_RESPONSE_SUCCESS, response });
    return response;
  });
  responseActions.getTranscriptionOutcome = jest.fn();

  responseActions.getTranscriptionOutcome.mockImplementation(
    () => async dispatch => {
      const outcome = {
        response: {},
        transcript: ''
      };
      dispatch({ type: GET_TRANSCRIPTION_OUTCOME_SUCCESS, outcome });
      return outcome;
    }
  );

  audioNode = {};

  Object.defineProperties(audioNode, {
    srcObject: {
      value: null,
      configurable: true,
      writable: true
    },
    muted: {
      value: false,
      configurable: true,
      writable: true
    },
    onpause: {
      value: null,
      configurable: true,
      writable: true
    },
    onvolumechange: {
      value: null,
      configurable: true,
      writable: true
    },
    captureStream: {
      value: jest.fn(),
      configurable: true,
      writable: true
    },
    pause: {
      value: jest.fn(),
      configurable: true,
      writable: true
    },
    play: {
      value: jest.fn(),
      configurable: true,
      writable: true
    }
  });

  jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime());

  /** @GENERATED: END **/

  /** @TEMPLATE: BEGIN **/
  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
  /** @TEMPLATE: END **/
});

afterEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
  /** @TEMPLATE: END **/
});

test('AudioRecorder', () => {
  expect(AudioRecorder).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    autostart: false,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: true,
    isRecording: false,
    onChange: jest.fn(),
    prompt: '',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 2 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: false,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: true,
    isRecording: true,
    onChange: jest.fn(),
    persisted: {},
    prompt: '',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  Object.defineProperty(MediaConstants, 'IS_AUDIO_RECORDING_SUPPORTED', {
    value: false,
    configurable: true
  });

  const component = mount(<ConnectedRoutedComponent {...props} />);
  expect(snapshotter(component)).toMatchSnapshot();

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();

  fireEvent.focus(screen.getByRole('textbox'));
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'something the user typed' }
  });

  expect(serialize()).toMatchSnapshot();

  expect(props.onChange.mock.calls.length).toBe(1);
  expect(props.onChange.mock.calls[0][1]).toMatchSnapshot();

  Object.defineProperty(MediaConstants, 'IS_AUDIO_RECORDING_SUPPORTED', {
    value: true,
    configurable: true
  });

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 3 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: true,
    onChange: jest.fn(),
    persisted: {},
    prompt: '',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  responseActions.getResponse = jest.fn();

  responseActions.getResponse.mockImplementation(() => async dispatch => {
    const response = {};
    dispatch({ type: GET_RESPONSE_SUCCESS, response });
    return response;
  });

  const component = mount(<ConnectedRoutedComponent {...props} />);
  expect(snapshotter(component)).toMatchSnapshot();

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(screen.getByRole('button', { name: /start recording/i }));
  await waitForPopper();

  await waitFor(() => typeof audioNode.onpause === 'function');

  expect(serialize()).toMatchSnapshot();

  audioNode.onpause();

  expect(audioNode.play.mock.calls.length).not.toBe(0);

  audioNode.onvolumechange();
  expect(audioNode.muted).toBe(true);

  expect(serialize()).toMatchSnapshot();

  userEvent.click(screen.getByRole('button', { name: /stop recording/i }));
  await waitForPopper();

  expect(serialize()).toMatchSnapshot();

  expect(audioNode.pause.mock.calls.length).not.toBe(0);
  expect(audioNode.onpause).toBe(null);
  expect(audioNode.onvolumechange).toBe(null);
  expect(audioNode.muted).toBe(false);
  expect(audioNode.srcObject).toBe(null);

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 4 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: {},
    prompt: '',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  responseActions.getResponse = jest.fn();

  responseActions.getResponse.mockImplementation(() => async dispatch => {
    const response = {};
    dispatch({ type: GET_RESPONSE_SUCCESS, response });
    return response;
  });

  const component = mount(<ConnectedRoutedComponent {...props} />);
  expect(snapshotter(component)).toMatchSnapshot();

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 5 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: false,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: true,
    onChange: jest.fn(),
    persisted: {},
    prompt: '',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 6 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: true,
    isRecording: false,
    onChange: jest.fn(),
    persisted: {},
    prompt: '',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 7 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: false,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: true,
    isRecording: false,
    onChange: jest.fn(),
    persisted: {},
    prompt: '',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 8 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: false,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: {},
    prompt: '',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 9 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: {},
    prompt: '',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 10 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: {},
    prompt: 'record now',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 11 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: {},
    prompt: 'record now',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: 'hi',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 12 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: {},
    prompt: 'record now',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: 'hi',
    value: 'hi.mp3'
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 13 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: { reponse: { value: 'blob://hi', transcript: 'hi!' } },
    prompt: 'record now',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  responseActions.getResponse = jest.fn();

  responseActions.getResponse.mockImplementation(() => async dispatch => {
    const response = {};
    dispatch({ type: GET_RESPONSE_SUCCESS, response });
    return response;
  });

  const component = mount(<ConnectedRoutedComponent {...props} />);
  expect(snapshotter(component)).toMatchSnapshot();

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 14 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: {},
    prompt: 'record now',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 15 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: { value: 'blob://hi' },
    prompt: 'record now',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn(),
    transcript: '',
    value: ''
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 16 1', async done => {
  const Component = AudioRecorder;
  const props = {
    ...commonProps,
    audioNode,
    autostart: true,
    getResponse: jest.fn(),
    instructions: '',
    isEmbeddedInSVG: false,
    isRecording: false,
    onChange: jest.fn(),
    persisted: { value: 'blob://hi' },
    prompt: 'record now',
    responseId: 'ABC',
    run: {},
    saveRunEvent: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/
