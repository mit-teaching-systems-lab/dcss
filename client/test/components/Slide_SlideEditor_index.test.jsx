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

import * as tlr from '@testing-library/react';
import {
  GET_AGENT_SUCCESS,
  GET_AGENTS_SUCCESS,
  GET_INTERACTIONS_SUCCESS,
  GET_INTERACTIONS_TYPES_SUCCESS
} from '../../actions/types';
import * as agentActions from '../../actions/agent';
jest.mock('../../actions/agent');

const expectUuidString = expect.stringMatching(
  /^(([0-9]{2}-[0-9A-F]{8})|([0-9A-F]{8}|[0-9]{2}))-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

let agent;
let agents;
let agentsById;
let personas;
let personasById;
let scenario;
let slides;
let usersById;
let users;

import SlideEditor from '../../components/Slide/SlideEditor/index.jsx';
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

  agent = {
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

  agents = [agent];

  agentsById = agents.reduce((accum, agent) => {
    accum[agent.id] = agent;
    return accum;
  }, {});

  personas = [
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
    },
    {
      id: 2,
      name: 'Teacher',
      description:
        'A non-specific teacher, participating in a multi person scenario.',
      color: '#3f59a9',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    },
    {
      id: 3,
      name: 'Student',
      description:
        'A non-specific student, participating in a multi person scenario.',
      color: '#e59235',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    }
  ];
  personasById = personas.reduce((accum, persona) => {
    accum[persona.id] = persona;
    return accum;
  }, {});
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
    consent: { id: 69, prose: '' },
    description: "This is the description of 'Some Other Scenario'",
    finish: {
      id: 11,
      title: '',
      components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
      is_finish: true
    },
    lock: {
      scenario_id: 99,
      user_id: 999,
      created_at: '2020-02-31T23:54:19.934Z',
      ended_at: null
    },
    slides: [
      {
        id: 11,
        title: '',
        components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
        is_finish: true
      },
      {
        id: 22,
        title: 'Slide 1',
        components: [
          {
            id: '22-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
            html: '<h1>Welcome to Slide 1</h1>',
            type: 'Text'
          },
          {
            agent: null,
            id: '22-aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: '22-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: ''
          },
          {
            id: '22-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      },
      {
        id: 33,
        title: 'Slide 2',
        components: [
          {
            id: '33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
            html: '<h1>Welcome to Slide 2</h1>',
            type: 'Text'
          },
          {
            agent: null,
            id: '33-aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: ''
          },
          {
            id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      },
      {
        id: 44,
        title: 'Slide 3',
        components: [
          {
            id: '44-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
            html: '<h1>Welcome to Slide 3</h1>',
            type: 'Text'
          },
          {
            agent: null,
            id: '44-aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: '44-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: ''
          },
          {
            id: '44-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      }
    ],
    status: 1,
    title: 'Some Other Scenario',
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
    id: 99,
    created_at: '2020-07-31T17:50:28.089Z',
    updated_at: null,
    deleted_at: null,
    labels: ['a'],
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
  slides = JSON.parse(
    JSON.stringify(scenario.slides.filter(slide => !slide.is_finish))
  );
  usersById = {
    999: {
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      id: 999,
      roles: ['participant', 'super_admin'],
      is_anonymous: false,
      is_super: true,
      progress: {
        completed: [1],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: true,
            event_id: 1909,
            created_at: 1602454306144,
            generic: 'arrived at a slide.',
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    },
    555: {
      username: 'facilitator',
      personalname: 'Facilitator User',
      email: 'facilitator@email.com',
      id: 555,
      roles: ['participant', 'facilitator', 'researcher', 'owner'],
      is_anonymous: false,
      is_super: false,
      is_owner: true,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: false,
            scenario_id: 99,
            event_id: 1905,
            created_at: 1602454306144,
            generic: 'arrived at a slide.',
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    },
    444: {
      username: 'researcher',
      personalname: 'Researcher User',
      email: 'researcher@email.com',
      id: 444,
      roles: ['participant', 'researcher'],
      is_anonymous: false,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: false,
            scenario_id: 99,
            event_id: 1904,
            created_at: 1602454306144,
            generic: 'arrived at a slide.',
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    },
    333: {
      username: 'participant',
      personalname: 'Participant User',
      email: 'participant@email.com',
      id: 333,
      roles: ['participant'],
      is_anonymous: false,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: false,
            is_complete: false,
            scenario_id: 99,
            event_id: 1903,
            created_at: 1602454306144,
            generic:
              'requested to join {scenario} as {persona}, and is waiting to be matched.',
            persona: { id: 1, name: 'Teacher' },
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    },
    222: {
      username: 'anonymous',
      personalname: '',
      email: '',
      id: 222,
      roles: ['participant'],
      is_anonymous: true,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: false,
            is_complete: false,
            scenario_id: 99,
            event_id: 1902,
            created_at: 1602454306144,
            generic:
              '{participant} canceled their request to join {scenario} as {persona}.',
            persona: { id: 2, name: 'Student' },
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    },
    111: {
      username: 'invited',
      personalname: '',
      email: '',
      id: 111,
      roles: [],
      is_anonymous: true,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: false,
            scenario_id: 99,
            event_id: 1901,
            created_at: 1602454306144,
            generic: 'arrived at a slide.',
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    }
  };
  users = [
    {
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      id: 999,
      roles: ['participant', 'super_admin'],
      is_anonymous: false,
      is_super: true,
      progress: {
        completed: [1],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: true,
            event_id: 1909,
            created_at: 1602454306144,
            generic: 'arrived at a slide.',
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    },
    {
      username: 'facilitator',
      personalname: 'Facilitator User',
      email: 'facilitator@email.com',
      id: 555,
      roles: ['participant', 'facilitator', 'researcher', 'owner'],
      is_anonymous: false,
      is_super: false,
      is_owner: true,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: false,
            scenario_id: 99,
            event_id: 1905,
            created_at: 1602454306144,
            generic: 'arrived at a slide.',
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    },
    {
      username: 'researcher',
      personalname: 'Researcher User',
      email: 'researcher@email.com',
      id: 444,
      roles: ['participant', 'researcher'],
      is_anonymous: false,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: false,
            scenario_id: 99,
            event_id: 1904,
            created_at: 1602454306144,
            generic: 'arrived at a slide.',
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    },
    {
      username: 'participant',
      personalname: 'Participant User',
      email: 'participant@email.com',
      id: 333,
      roles: ['participant'],
      is_anonymous: false,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: false,
            is_complete: false,
            scenario_id: 99,
            event_id: 1903,
            created_at: 1602454306144,
            generic:
              'requested to join {scenario} as {persona}, and is waiting to be matched.',
            persona: { id: 1, name: 'Teacher' },
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    },
    {
      username: 'anonymous',
      personalname: '',
      email: '',
      id: 222,
      roles: ['participant'],
      is_anonymous: true,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: false,
            is_complete: false,
            scenario_id: 99,
            event_id: 1902,
            created_at: 1602454306144,
            generic:
              '{participant} canceled their request to join {scenario} as {persona}.',
            persona: { id: 2, name: 'Student' },
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    }
  ];

  agentActions.getAgents.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_AGENTS_SUCCESS, agents });
    return agents;
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

test('SlideEditor', () => {
  expect(SlideEditor).toBeDefined();
});

/* INJECTION STARTS HERE */

test('Missing props', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario: {
      ...scenario,
      personas
    },
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn()
  };

  const state = {
    ...commonState,
    agents,
    agentsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Multiple personas', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario: {
      ...scenario,
      personas
    },
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState,
    agents,
    agentsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await screen.findAllByLabelText('Select a persona');
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Multiple personas, with an assigned component', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario: {
      ...scenario,
      personas
    },
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  props.components[0].persona = { id: personas[0].id };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await screen.findAllByLabelText('Select a persona');
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Multiple personas, assign a persona to a component', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario: {
      ...scenario,
      personas
    },
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  props.components[0].persona = { id: personas[0].id };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const listboxes = await screen.getAllByRole('listbox', {
    name: 'Select a persona'
  });
  expect(serialize()).toMatchSnapshot();

  const listbox = listboxes[0];

  // Open the persona selector
  userEvent.click(listbox);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  const personaOptions = await tlr.findAllByRole(listbox, 'option');

  // Select the first persona (item 0 is not a persona)
  userEvent.click(personaOptions[0]);
  expect(serialize()).toMatchSnapshot();
  await waitForPopper();

  jest.advanceTimersByTime(1000);
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "html": "<h1>Welcome to Slide 2</h1>",
            "id": "33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
            "persona": null,
            "type": "Text",
          },
          Object {
            "agent": null,
            "header": "TextResponse-1",
            "id": "33-aede9380-c7a3-4ef7-add7-838fd5ec854f",
            "placeholder": "",
            "prompt": "",
            "recallId": "",
            "required": true,
            "responseId": "33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
            "timeout": 0,
            "type": "TextResponse",
          },
          Object {
            "html": "<p>?</p>",
            "id": "33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
            "type": "Text",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "Slide 2",
      },
    ]
  `);

  done();
});

test('Multiple personas, toggle chat on', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario: {
      ...scenario,
      personas
    },
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const toggleChat = await screen.findByLabelText('Enable real-time chat');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(toggleChat);
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          disableDelete: true,
          disableDuplicate: true,
          disableEmbed: true,
          disableOrdering: true,
          disablePersona: true,
          header: 'Slide 2-ChatPrompt-0',
          id: expectUuidString,
          required: false,
          responseId: expectUuidString,
          timeout: 0,
          type: 'ChatPrompt'
        },
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: expectUuidString,
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: expectUuidString,
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        }
      ],
      has_chat_enabled: true,
      title: 'Slide 2'
    }
  ]);

  done();
});

test('Multiple personas, toggle chat off', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario: {
      ...scenario,
      personas
    },
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Enable real-time chat'));
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          disableDelete: true,
          disableDuplicate: true,
          disableEmbed: true,
          disableOrdering: true,
          disablePersona: true,
          header: 'Slide 2-ChatPrompt-0',
          id: expectUuidString,
          required: false,
          responseId: expectUuidString,
          timeout: 0,
          type: 'ChatPrompt'
        },
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: expectUuidString,
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: expectUuidString,
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        }
      ],
      has_chat_enabled: true,
      title: 'Slide 2'
    }
  ]);

  userEvent.click(await screen.findByLabelText('Disable real-time chat'));
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls[1]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: expectUuidString,
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: expectUuidString,
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        }
      ],
      has_chat_enabled: true,
      title: 'Slide 2'
    }
  ]);
  done();
});

test('Single persona', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('No slide components', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1],
    components: []
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Change title', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const title = await screen.findByPlaceholderText('Slide title');

  userEvent.clear(title);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.type(title, 'A new slide title');
  await waitForPopper();

  jest.advanceTimersByTime(1000);
  await waitForPopper();

  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "html": "<h1>Welcome to Slide 2</h1>",
            "id": "33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
            "type": "Text",
          },
          Object {
            "agent": null,
            "header": "TextResponse-1",
            "id": "33-aede9380-c7a3-4ef7-add7-838fd5ec854f",
            "placeholder": "",
            "prompt": "",
            "recallId": "",
            "required": true,
            "responseId": "33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
            "timeout": 0,
            "type": "TextResponse",
          },
          Object {
            "html": "<p>?</p>",
            "id": "33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
            "type": "Text",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "A new slide title",
      },
    ]
  `);

  done();
});

test('Save', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const saveSlide = await screen.findByLabelText('Save slide');

  userEvent.click(saveSlide);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "html": "<h1>Welcome to Slide 2</h1>",
            "id": "33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
            "type": "Text",
          },
          Object {
            "agent": null,
            "header": "TextResponse-1",
            "id": "33-aede9380-c7a3-4ef7-add7-838fd5ec854f",
            "placeholder": "",
            "prompt": "",
            "recallId": "",
            "required": true,
            "responseId": "33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
            "timeout": 0,
            "type": "TextResponse",
          },
          Object {
            "html": "<p>?</p>",
            "id": "33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
            "type": "Text",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "Slide 2",
      },
    ]
  `);

  done();
});

test('Save, onChange is missing', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: null,
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const saveSlide = await screen.findByLabelText('Save slide');

  userEvent.click(saveSlide);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Delete, yes', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const deleteSlide = await screen.findByLabelText('Delete this slide');

  userEvent.click(deleteSlide);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onDelete).toHaveBeenCalledTimes(1);
  expect(props.onDelete.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
    ]
  `);

  done();
});

test('Delete, no', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const deleteSlide = await screen.findByLabelText('Delete this slide');

  userEvent.click(deleteSlide);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /No/ }));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onDelete).toHaveBeenCalledTimes(0);
  done();
});

test('Duplicate', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const duplicateSlide = await screen.findByLabelText('Duplicate slide');

  userEvent.click(duplicateSlide);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onDuplicate).toHaveBeenCalledTimes(1);
  expect(props.onDuplicate.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
    ]
  `);

  done();
});

test('Preview', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const previewSlide = await screen.findByLabelText('Preview slide');

  userEvent.click(previewSlide);
  await waitForPopper();

  // Preview mode
  expect(serialize()).toMatchSnapshot();

  userEvent.click(previewSlide);
  await waitForPopper();

  // Edit mode
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Component is missing an id', async done => {
  const Component = SlideEditor;

  delete slides[1].components[0].id;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Click to activate component', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const components = await screen.findAllByTestId('on-component-click');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(components[0]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Add a response-prompt component to a slide without a title', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  props.title = '';

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const button = await screen.findByRole('button', {
    name: /Prompt: Text Input/i
  });

  userEvent.click(button);
  await waitForPopper();

  jest.advanceTimersByTime(1000);

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: '33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: expectUuidString,
          persona: null,
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: expectUuidString,
          timeout: 0,
          type: 'TextResponse'
        },
        {
          header: 'TextResponse-1',
          id: '33-aede9380-c7a3-4ef7-add7-838fd5ec854f',
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        }
      ],
      title: ''
    }
  ]);

  done();
});

test('Add a non-response-prompt component', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const components = await screen.findAllByTestId('on-component-click');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(components[1]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  const rte = await screen.findByRole('button', { name: /Rich Text Editor/i });

  userEvent.click(rte);
  await waitForPopper();

  jest.advanceTimersByTime(1000);

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: '33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: '33-aede9380-c7a3-4ef7-add7-838fd5ec854f',
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '',
          id: expectUuidString,
          persona: null,
          type: 'Text'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        }
      ],
      title: 'Slide 2'
    }
  ]);

  done();
});

test('Add a response-prompt component that has disableRequireCheckbox', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const button = await screen.findByRole('button', {
    name: /Prompt: Choose Next Slide/i
  });

  userEvent.click(button);
  await waitForPopper();

  jest.advanceTimersByTime(1000);

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: '33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: '33-aede9380-c7a3-4ef7-add7-838fd5ec854f',
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        },
        {
          disableDefaultNavigation: true,
          disableRequireCheckbox: true,
          header: 'Slide 2-MultiPathResponse-3',
          id: expectUuidString,
          paths: [
            {
              display: '',
              value: null
            }
          ],
          persona: null,
          recallId: '',
          required: true,
          responseId: expectUuidString,
          timeout: 0,
          type: 'MultiPathResponse'
        }
      ],
      title: 'Slide 2'
    }
  ]);

  done();
});

test('Add a non-response-prompt component at the end', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const components = await screen.findAllByTestId('on-component-click');
  expect(serialize()).toMatchSnapshot();

  // Activate the component at the end of the slide
  userEvent.click(components[components.length - 1]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  const button = await screen.findByRole('button', {
    name: /Prompt: Text Input/i
  });
  expect(serialize()).toMatchSnapshot();

  userEvent.click(button);
  await waitForPopper();

  jest.advanceTimersByTime(1000);
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: '33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: '33-aede9380-c7a3-4ef7-add7-838fd5ec854f',
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        },
        {
          header: 'Slide 2-TextResponse-3',
          id: expectUuidString,
          persona: null,
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: expectUuidString,
          timeout: 0,
          type: 'TextResponse'
        }
      ],
      title: 'Slide 2'
    }
  ]);

  done();
});

test('Add a response-prompt component', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const button = await screen.findByRole('button', {
    name: /Prompt: Text Input/i
  });

  userEvent.click(button);
  await waitForPopper();

  jest.advanceTimersByTime(1000);

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: '33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: '33-aede9380-c7a3-4ef7-add7-838fd5ec854f',
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        },
        {
          header: 'Slide 2-TextResponse-4',
          id: expectUuidString,
          persona: null,
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: expectUuidString,
          timeout: 0,
          type: 'TextResponse'
        }
      ],
      title: 'Slide 2'
    }
  ]);

  done();
});

test('Edit a component', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const textarea = await screen.findByRole('textbox', {
    name: 'Optional prompt to display before the input:'
  });

  const input = await screen.findByRole('textbox', {
    name: 'Placeholder text displayed inside the input:'
  });

  userEvent.clear(textarea);
  await waitForPopper();
  userEvent.type(textarea, 'Tell us what you think');
  await waitForPopper();

  // Should trigger a change
  userEvent.click(input);
  await waitForPopper();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: expectUuidString,
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: expectUuidString,
          placeholder: '',
          prompt: 'Tell us what you think',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: expectUuidString,
          type: 'Text'
        }
      ],
      title: 'Slide 2'
    }
  ]);

  userEvent.clear(input);
  await waitForPopper();
  userEvent.type(input, 'Type stuff here');
  await waitForPopper();

  // Should trigger a change
  userEvent.click(textarea);
  await waitForPopper();

  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls[1]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: expectUuidString,
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: expectUuidString,
          placeholder: 'Type stuff here',
          prompt: 'Tell us what you think',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: expectUuidString,
          type: 'Text'
        }
      ],
      title: 'Slide 2'
    }
  ]);

  done();
});

test('Duplicate a non-response-prompt component', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const duplicateComponents = await screen.findAllByLabelText(
    'Duplicate this component'
  );

  userEvent.click(duplicateComponents[0]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: '33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
          type: 'Text'
        },
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: expectUuidString,
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: '33-aede9380-c7a3-4ef7-add7-838fd5ec854f',
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        }
      ],
      title: 'Slide 2'
    }
  ]);

  done();
});

test('Duplicate a response-prompt component', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const duplicateComponents = await screen.findAllByLabelText(
    'Duplicate this component'
  );

  userEvent.click(duplicateComponents[1]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchObject([
    1,
    {
      components: [
        {
          html: '<h1>Welcome to Slide 2</h1>',
          id: '33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
          type: 'Text'
        },
        {
          header: 'TextResponse-1',
          id: '33-aede9380-c7a3-4ef7-add7-838fd5ec854f',
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
          timeout: 0,
          type: 'TextResponse'
        },
        {
          header: 'TextResponse-1 (COPY)',
          id: expectUuidString,
          placeholder: '',
          prompt: '',
          recallId: '',
          required: true,
          responseId: expectUuidString,
          timeout: 0,
          type: 'TextResponse'
        },
        {
          html: '<p>?</p>',
          id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
          type: 'Text'
        }
      ],
      title: 'Slide 2'
    }
  ]);

  done();
});

test('Move a component up', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const movers = await screen.findAllByLabelText(/Move component 2/);
  expect(serialize()).toMatchSnapshot();

  // Move up
  userEvent.click(movers[0]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "agent": null,
            "header": "TextResponse-1",
            "id": "33-aede9380-c7a3-4ef7-add7-838fd5ec854f",
            "placeholder": "",
            "prompt": "",
            "recallId": "",
            "required": true,
            "responseId": "33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
            "timeout": 0,
            "type": "TextResponse",
          },
          Object {
            "html": "<h1>Welcome to Slide 2</h1>",
            "id": "33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
            "type": "Text",
          },
          Object {
            "html": "<p>?</p>",
            "id": "33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
            "type": "Text",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "Slide 2",
      },
    ]
  `);

  done();
});

test('Move a component down', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const movers = await screen.findAllByLabelText(/Move component 1/);
  expect(serialize()).toMatchSnapshot();

  // Move down
  userEvent.click(movers[1]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "agent": null,
            "header": "TextResponse-1",
            "id": "33-aede9380-c7a3-4ef7-add7-838fd5ec854f",
            "placeholder": "",
            "prompt": "",
            "recallId": "",
            "required": true,
            "responseId": "33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
            "timeout": 0,
            "type": "TextResponse",
          },
          Object {
            "html": "<h1>Welcome to Slide 2</h1>",
            "id": "33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
            "type": "Text",
          },
          Object {
            "html": "<p>?</p>",
            "id": "33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
            "type": "Text",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "Slide 2",
      },
    ]
  `);

  done();
});

test('Delete a component from the beginning', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const deleteComponents = await screen.findAllByLabelText(
    'Delete this component'
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(deleteComponents[0]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "agent": null,
            "header": "TextResponse-1",
            "id": "33-aede9380-c7a3-4ef7-add7-838fd5ec854f",
            "placeholder": "",
            "prompt": "",
            "recallId": "",
            "required": true,
            "responseId": "33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
            "timeout": 0,
            "type": "TextResponse",
          },
          Object {
            "html": "<p>?</p>",
            "id": "33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
            "type": "Text",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "Slide 2",
      },
    ]
  `);

  done();
});

test('Delete a component from the middle', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const deleteComponents = await screen.findAllByLabelText(
    'Delete this component'
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(deleteComponents[1]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "html": "<h1>Welcome to Slide 2</h1>",
            "id": "33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
            "type": "Text",
          },
          Object {
            "html": "<p>?</p>",
            "id": "33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
            "type": "Text",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "Slide 2",
      },
    ]
  `);

  done();
});

test('Delete a component from the end', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const deleteComponents = await screen.findAllByLabelText(
    'Delete this component'
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(deleteComponents[2]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "html": "<h1>Welcome to Slide 2</h1>",
            "id": "33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
            "type": "Text",
          },
          Object {
            "agent": null,
            "header": "TextResponse-1",
            "id": "33-aede9380-c7a3-4ef7-add7-838fd5ec854f",
            "placeholder": "",
            "prompt": "",
            "recallId": "",
            "required": true,
            "responseId": "33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
            "timeout": 0,
            "type": "TextResponse",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "Slide 2",
      },
    ]
  `);

  done();
});

test('Toggle required on a prompt-response component', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: false,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.getByLabelText('Required?'));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1000);
  await waitForPopper();

  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "html": "<h1>Welcome to Slide 2</h1>",
            "id": "33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
            "type": "Text",
          },
          Object {
            "agent": null,
            "header": "TextResponse-1",
            "id": "33-aede9380-c7a3-4ef7-add7-838fd5ec854f",
            "placeholder": "",
            "prompt": "",
            "recallId": "",
            "required": false,
            "responseId": "33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
            "timeout": 0,
            "type": "TextResponse",
          },
          Object {
            "html": "<p>?</p>",
            "id": "33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
            "type": "Text",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "Slide 2",
      },
    ]
  `);

  userEvent.click(await screen.getByLabelText('Required?'));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1000);

  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls[1]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "components": Array [
          Object {
            "html": "<h1>Welcome to Slide 2</h1>",
            "id": "33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
            "type": "Text",
          },
          Object {
            "agent": null,
            "header": "TextResponse-1",
            "id": "33-aede9380-c7a3-4ef7-add7-838fd5ec854f",
            "placeholder": "",
            "prompt": "",
            "recallId": "",
            "required": true,
            "responseId": "33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
            "timeout": 0,
            "type": "TextResponse",
          },
          Object {
            "html": "<p>?</p>",
            "id": "33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
            "type": "Text",
          },
        ],
        "has_chat_enabled": undefined,
        "title": "Slide 2",
      },
    ]
  `);

  done();
});

test('noSlide', async done => {
  const Component = SlideEditor;

  scenario.slides = [];

  const props = {
    ...commonProps,
    scenario,
    slides: [],
    index: 1,
    promptToAddSlide: '',
    noSlide: true,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Component type is unknown', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: true,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  props.components[0].type = 'unknown';

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Component does not have an id property', async done => {
  const Component = SlideEditor;

  const props = {
    ...commonProps,
    scenario,
    slides,
    index: 1,
    promptToAddSlide: '',
    noSlide: true,
    onChange: jest.fn(),
    onDelete: jest.fn(),
    onDuplicate: jest.fn(),
    ...slides[1]
  };

  props.components[0].id = null;

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});
