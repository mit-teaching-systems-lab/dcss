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

import {
  GET_RESPONSE_SUCCESS,
  GET_TRANSCRIPTION_OUTCOME_SUCCESS,
  SAVE_RUN_EVENT_SUCCESS
} from '../../actions/types';
import * as responseActions from '@actions/response';
import * as runActions from '@actions/run';
jest.mock('../../actions/response');
jest.mock('../../actions/run');

let scenario;
let slideIndex;
let value;

const expectDateString = expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}.*/i);

import Display from '../../components/Slide/Components/MultiButtonResponse/Display.jsx';

const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

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
  responseActions.getResponse = jest.fn();
  responseActions.getResponse.mockImplementation(() => async dispatch => {
    const response = {
      id: 457,
      run_id: 147,
      response: {
        type: 'MultiButtonResponse',
        value: 'Yes',
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
  runActions.saveRunEvent = jest.fn();
  runActions.saveRunEvent.mockImplementation(
    (run_id, name, data) => async dispatch => {
      const timestamp = Date.now();
      const url = location.href;
      const event = {
        timestamp,
        url,
        ...data
      };
      dispatch({ type: SAVE_RUN_EVENT_SUCCESS, name, event });
      return event;
    }
  );

  scenario = {
    author: {
      id: 999,
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      is_anonymous: false,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true
    },
    categories: [],
    consent: { id: 57, prose: '' },
    description: "This is the description of 'A Multiplayer Scenario'",
    finish: {
      id: 1,
      title: '',
      components: [
        { html: '<h2>Thanks for participating!</h2>', type: 'Text' }
      ],
      is_finish: true
    },
    lock: {
      scenario_id: 42,
      user_id: 999,
      created_at: '2020-02-31T23:54:19.934Z',
      ended_at: null
    },
    slides: [
      {
        id: 1,
        title: '',
        components: [
          { html: '<h2>Thanks for participating!</h2>', type: 'Text' }
        ],
        is_finish: true
      },
      {
        id: 2,
        title: '',
        components: [
          {
            id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
            html: '<p>paragraph</p>',
            type: 'Text'
          },
          {
            id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: 'Your response'
          },
          {
            id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      }
    ],
    status: 1,
    title: 'Multiplayer Scenario 2',
    users: [
      {
        id: 999,
        email: 'super@email.com',
        username: 'super',
        personalname: 'Super User',
        roles: ['super'],
        is_super: true,
        is_author: true,
        is_reviewer: false
      }
    ],
    id: 42,
    created_at: '2020-08-31T17:50:28.089Z',
    updated_at: null,
    deleted_at: null,
    labels: ['a', 'b'],
    personas: [
      {
        id: 1,
        name: 'Participant',
        description:
          'The default user participating in a single person scenario.',
        color: '#FFFFFF',
        created_at: '2020-12-01T15:49:04.962Z',
        updated_at: null,
        deleted_at: null,
        author_id: 3,
        is_read_only: true,
        is_shared: true
      }
    ]
  };
  slideIndex = 0;
  value = {
    id: 'XYZ',
    buttons: [
      { color: '#ff00ff', display: 'Yes', value: 'Yes' },
      { color: '#ff0000', display: 'No', value: 'No' }
    ],
    header: 'xyz-header',
    prompt: 'xyz-prompt',
    recallId: 'xyz-recallId',
    required: true,
    responseId: 'xyz-responseId',
    type: 'MultiButtonResponse'
  };

  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('Display', () => {
  expect(Display).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = Display;

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 2 1', async done => {
  const Component = Display;

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn()
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

/* INJECTION STARTS HERE */

test('Buttons undefined', async done => {
  const Component = Display;

  value.buttons.length = 0;

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn()
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

test('Buttons empty', async done => {
  const Component = Display;

  value.buttons.length = 0;

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn()
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

test('No color', async done => {
  const Component = Display;

  delete value.buttons[0].color;

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn()
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

test('Previously selected value is checked', async done => {
  const Component = Display;

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn(),
    persisted: {
      value: 'Yes'
    }
  };

  const state = {
    ...commonState
  };

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Previous response value is checked', async done => {
  const Component = Display;

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn(),
    persisted: {
      value: 'Yes'
    }
  };

  const state = {
    ...commonState
  };

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('No value stored', async done => {
  const Component = Display;

  responseActions.getResponse.mockImplementation(() => async dispatch => {
    return { response: undefined };
  });

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn(),
    persisted: {
      value: ''
    }
  };

  const state = {
    ...commonState
  };

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Click a button', async done => {
  const Component = Display;

  responseActions.getResponse.mockImplementation(() => async dispatch => {
    return { response: undefined };
  });

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn(),
    saveRunEvent: jest.fn(),
    persisted: {
      value: ''
    }
  };

  const state = {
    ...commonState
  };

  delete window.location;
  window.location = {
    pathname: '/run/'
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));

  expect(asFragment()).toMatchSnapshot();

  expect(props.saveRunEvent).toHaveBeenCalledTimes(1);
  expect(props.saveRunEvent.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "button-press",
      Object {
        "content": "Yes",
        "prompt": "xyz-prompt",
        "responseId": "xyz-responseId",
        "value": "Yes",
      },
    ]
  `);

  expect(props.onResponseChange).toHaveBeenCalledTimes(1);
  expect(props.onResponseChange.mock.calls[0][1]).toMatchObject({
    content: 'Yes',
    created_at: expectDateString,
    ended_at: expectDateString,
    name: 'xyz-responseId',
    recallId: 'xyz-recallId',
    type: 'MultiButtonResponse',
    value: 'Yes'
  });

  done();
});

test('Click a button, not in run', async done => {
  const Component = Display;

  responseActions.getResponse.mockImplementation(() => async dispatch => {
    return { response: undefined };
  });

  const props = {
    ...commonProps,
    ...value,
    onResponseChange: jest.fn(),
    saveRunEvent: jest.fn(),
    persisted: {
      value: ''
    }
  };

  const state = {
    ...commonState
  };

  delete window.location;
  window.location = {
    pathname: '/'
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));
  expect(asFragment()).toMatchSnapshot();

  done();
});
