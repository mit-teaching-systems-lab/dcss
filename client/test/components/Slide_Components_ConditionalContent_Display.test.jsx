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

import { GET_AGENT_RESPONSES_SUCCESS } from '../../actions/types';
import * as agentActions from '../../actions/agent';
jest.mock('../../actions/agent');

import Storage from '@utils/Storage';
jest.mock('@utils/Storage', () => {
  return {
    ...jest.requireActual('@utils/Storage'),
    get: jest.fn(),
    set: jest.fn(),
    merge: jest.fn()
  };
});

let responses;
let run;
let scenario;
let slideIndex;
let value;

import Display from '../../components/Slide/Components/ConditionalContent/Display.jsx';
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

  responses = [
    {
      id: 43,
      run_id: 527,
      chat_id: null,
      agent_id: 23,
      response: {
        id: 904,
        auth: {
          run: {
            id: 527
          },
          chat: {},
          user: {
            id: 2
          },
          agent: {
            id: 23,
            name: 'base-agent',
            configuration: {}
          }
        },
        value:
          'audio/527/52f01bd3-dade-4234-9f5d-a31eb9be9558/2/4da5d201-a9b1-42f7-b4db-defde02a5fd6.mp3',
        result: false,
        transcript: 'this is Rick again ',
        response_id: '52f01bd3-dade-4234-9f5d-a31eb9be9558'
      },
      created_at: '2021-03-07T17:10:10.79867-05:00',
      deleted_at: null,
      updated_at: null,
      response_id: 904,
      recipient_id: 2,
      interaction_id: 11,
      prompt_response_id: '52f01bd3-dade-4234-9f5d-a31eb9be9558'
    },
    {
      id: 38,
      run_id: 527,
      chat_id: null,
      agent_id: 23,
      response: {
        id: 899,
        auth: {
          run: {
            id: 527
          },
          chat: {},
          user: {
            id: 2
          },
          agent: {
            id: 23,
            name: 'base-agent',
            configuration: {}
          },
          response: {}
        },
        value: '🎂🎂🎂',
        result: true,
        transcript: null,
        response_id: '16b011f7-62cc-47bb-a33f-4cb292d285bd'
      },
      created_at: '2021-03-07T16:58:51.711856-05:00',
      deleted_at: null,
      updated_at: null,
      response_id: 899,
      recipient_id: 2,
      interaction_id: 11,
      prompt_response_id: '16b011f7-62cc-47bb-a33f-4cb292d285bd'
    }
  ];
  run = {
    id: 60,
    user_id: 999,
    scenario_id: 42,
    created_at: '2020-09-01T15:59:39.571Z',
    updated_at: '2020-09-01T15:59:47.121Z',
    ended_at: null,
    consent_id: 57,
    consent_acknowledged_by_user: true,
    consent_granted_by_user: true,
    referrer_params: null
  };
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
            agent: null,
            id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: ''
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
  scenario.agent = {
    id: 1,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: '2021-02-25T20:09:04.999Z',
    deleted_at: null,
    is_active: true,
    title: 'Emoji Analysis',
    name: 'emoji-analysis',
    description: 'Detects the presense of an emoji character in your text',
    endpoint: 'ws://emoji-analysis-production.herokuapp.com',
    configuration: {
      bar: '2',
      baz: 'c',
      foo: 'false'
    },
    interaction: {
      id: 1,
      name: 'ChatPrompt',
      description:
        'It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.',
      created_at: '2021-02-25T15:09:05.001302-05:00',
      deleted_at: null,
      updated_at: null,
      types: []
    },
    owner: {
      id: 999,
      email: 'super@email.com',
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true,
      username: 'superuser',
      is_anonymous: false,
      personalname: 'Super User'
    },
    self: {
      id: 148,
      email: null,
      roles: null,
      is_super: false,
      username: 'ebe565050b31cbb4e7eacc39b23e2167',
      lastseen_at: '2021-02-25T13:08:57.323-05:00',
      is_anonymous: true,
      personalname: 'Emoji Analysis',
      single_use_password: false
    },
    socket: {
      path: '/path/to/foo'
    }
  };
  slideIndex = 0;
  value = {
    agent: scenario.agent,
    disableRequireCheckbox: true,
    header: '',
    id: 'XYZ',
    rules: [
      { key: '$gte', value: 1 },
      { key: '$and', value: undefined },
      { key: '$lt', value: 10 }
    ],
    persona: null,
    recallId: 'xyz-recallId',
    required: false,
    responseId: 'xyz-responseId',
    component: {
      type: 'Text',
      html: '',
      id: '1'
    },
    type: 'ConditionalContent'
  };

  agentActions.getAgentResponses.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_AGENT_RESPONSES_SUCCESS, responses });
    return responses;
  });

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

test('Display', () => {
  expect(Display).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = Display;
  const props = {
    ...commonProps,
    ...value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Not a scenario run', async done => {
  const Component = Display;

  const props = {
    ...commonProps,
    ...value,
    run, // shouldn't matter!
    onResponseChange: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('run object missing', async done => {
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

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('No agent', async done => {
  const Component = Display;

  value.agent = null;

  const props = {
    ...commonProps,
    ...value,
    run,
    onResponseChange: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('No agent id', async done => {
  const Component = Display;

  value.agent.id = null;

  const props = {
    ...commonProps,
    ...value,
    run,
    onResponseChange: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Invalid/missing component', async done => {
  const Component = Display;

  value.component = null;

  const props = {
    ...commonProps,
    ...value,
    run,
    onResponseChange: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('No rules', async done => {
  const Component = Display;

  value.rules.length = 0;

  const props = {
    ...commonProps,
    ...value,
    run,
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

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Rules complete', async done => {
  const Component = Display;

  const props = {
    ...commonProps,
    ...value,
    run,
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

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(
      screen.getByTestId('conditional-content-display')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});
