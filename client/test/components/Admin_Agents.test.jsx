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

import Emitter from 'events';

import withSocket, * as SOCKET_EVENT_TYPES from '@hoc/withSocket';
jest.mock('@hoc/withSocket', () => {
  const socket = {
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  };

  globalThis.mockSocket = socket;

  return {
    __esModule: true,
    ...jest.requireActual('@hoc/withSocket'),
    default: function(Component) {
      Component.defaultProps = {
        ...Component.defaultProps,
        socket
      };
      return Component;
    }
  };
});

jest.mock('@utils/Moment', () => {
  return {
    __esModule: true,
    default: function(time) {
      return {
        calendar() {
          return 'HH:mm A';
        },
        format() {
          return 'HH:mm A';
        }
      };
    }
  };
});

import Storage from '@utils/Storage';
jest.mock('@utils/Storage', () => {
  return {
    ...jest.requireActual('@utils/Storage'),
    get: jest.fn(),
    set: jest.fn(),
    merge: jest.fn()
  };
});

import {
  GET_AGENT_SUCCESS,
  SET_AGENT_SUCCESS,
  GET_AGENTS_SUCCESS,
  GET_INTERACTIONS_SUCCESS,
  GET_INTERACTIONS_TYPES_SUCCESS
} from '../../actions/types';
import * as agentActions from '../../actions/agent';
import * as interactionActions from '../../actions/interaction';
jest.mock('../../actions/agent');
jest.mock('../../actions/interaction');

let user;
let agent;
let agents;
let agentsById;

let interactionChatPrompt;
let interactionAudioPrompt;
let interactionTextPrompt;

let interaction;
let interactions;
let interactionsById;
let superUser;
let agentUser;

let interactionsTypes = [
  {
    id: 1,
    name: 'AudioPrompt'
  },
  {
    id: 2,
    name: 'ChatPrompt'
  },
  {
    id: 3,
    name: 'ConversationPrompt'
  },
  {
    id: 4,
    name: 'TextResponse'
  }
];

const expectDateString = expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}.*/i);

import Agents from '../../components/Admin/Agents.jsx';
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

  let interactionChatPrompt = {
    id: 1,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: '2021-02-27T20:38:53.774Z',
    deleted_at: null,
    name: 'ChatPrompt',
    description:
      'It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.'
  };

  let interactionAudioPrompt = {
    id: 2,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: '2021-02-27T20:38:53.774Z',
    deleted_at: null,
    name: 'AudioPrompt',
    description:
      'It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Audio Prompt Responses.'
  };

  let interactionTextPrompt = {
    id: 3,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: '2021-02-27T20:38:53.774Z',
    deleted_at: null,
    name: 'TextPrompt',
    description:
      'It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Text Prompt Responses.'
  };

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

  user = superUser = {
    username: 'super',
    personalname: 'Super User',
    email: 'super@email.com',
    id: 999,
    roles: ['participant', 'super_admin'],
    is_anonymous: false,
    is_super: true
  };

  agentUser = agent.self;

  interaction = interactionChatPrompt;

  interactions = [
    interactionChatPrompt,
    interactionAudioPrompt,
    interactionTextPrompt
  ];

  interactionsById = interactions.reduce((accum, interaction) => {
    accum[interaction.id] = interaction;
    return accum;
  }, {});

  agentActions.createAgent.mockImplementation(newAgent => async dispatch => {
    const agent = {
      newAgent,
      id: 2
    };

    dispatch({ type: GET_AGENT_SUCCESS, agent });
    return agent;
  });

  agentActions.getAgent.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_AGENT_SUCCESS, agent });
    return agent;
  });

  agentActions.setAgent.mockImplementation((id, agent) => async dispatch => {
    dispatch({ type: SET_AGENT_SUCCESS, agent });
    return agent;
  });

  agentActions.getAgents.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_AGENTS_SUCCESS, agents });
    return agents;
  });

  interactionActions.getInteractions.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_INTERACTIONS_SUCCESS, interactions });
      return interactions;
    }
  );

  interactionActions.getInteractionsTypes.mockImplementation(
    () => async dispatch => {
      const types = interactionsTypes;
      dispatch({ type: GET_INTERACTIONS_TYPES_SUCCESS, types });
      return types;
    }
  );

  Storage.get.mockImplementation((key, defaultValue) => defaultValue);
  Storage.merge.mockImplementation((key, defaultValue) => defaultValue);

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

test('Agents', () => {
  expect(Agents).toBeDefined();
});

/* INJECTION STARTS HERE */

test('Load without agents', async done => {
  const Component = Agents;
  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    agents: []
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(agentActions.getAgents).toHaveBeenCalled());

  done();
});

test('Load without correct agents', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    id: 2
  };

  const state = {
    ...commonState,
    agents,
    agentsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(agentActions.getAgent).toHaveBeenCalled());

  done();
});

test('Load without interactions', async done => {
  const Component = Agents;
  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    interactions: []
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Load without activePage', async done => {
  const Component = Agents;
  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Load with an activePage', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Load with an activePage and id', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1,
    id: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Select an agent', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const listIems = await screen.findAllByRole('listitem');

  userEvent.click(listIems[0]);

  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const closeButton = await screen.findByRole('button', { name: /close/i });

  userEvent.click(closeButton);

  await waitFor(() =>
    expect(screen.getByTestId('agent-is-not-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Select and edit an agent', async done => {
  jest.setTimeout(30000);

  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const listItems = await screen.findAllByRole('listitem');

  userEvent.click(listItems[0]);

  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent).toHaveBeenCalled();
  expect(agentActions.setAgent.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "configuration": Object {
          "bar": "2",
          "baz": "c",
          "foo": "false",
        },
        "created_at": "2021-02-25T17:31:33.826Z",
        "deleted_at": null,
        "description": "Detects the presense of an emoji character in your text",
        "endpoint": "ws://emoji-analysis-production.herokuapp.com",
        "id": 1,
        "interaction": Object {
          "created_at": "2021-02-25T15:09:05.001302-05:00",
          "deleted_at": null,
          "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
          "id": 1,
          "name": "ChatPrompt",
          "types": Array [],
          "updated_at": null,
        },
        "is_active": true,
        "name": "emoji-analysis",
        "owner": Object {
          "email": "super@email.com",
          "id": 999,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "superuser",
        },
        "self": Object {
          "email": null,
          "id": 148,
          "is_anonymous": true,
          "is_super": false,
          "lastseen_at": "2021-02-25T13:08:57.323-05:00",
          "personalname": "Emoji Analysis",
          "roles": null,
          "single_use_password": false,
          "username": "ebe565050b31cbb4e7eacc39b23e2167",
        },
        "socket": Object {
          "path": "/path/to/foo",
        },
        "title": "Emoji Analysis",
        "updated_at": "2021-02-25T20:09:04.999Z",
      },
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  const titleInput = await screen.getByLabelText(/title/i);
  const descriptionInput = await screen.getByLabelText(/description/i);
  const endpointInput = await screen.getByLabelText(/endpoint/i);

  userEvent.clear(titleInput);

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent.mock.calls.length).toBe(1);
  expect(serialize()).toMatchSnapshot();

  userEvent.type(titleInput, 'A different agent');

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent.mock.calls[1]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "configuration": Object {
          "bar": "2",
          "baz": "c",
          "foo": "false",
        },
        "created_at": "2021-02-25T17:31:33.826Z",
        "deleted_at": null,
        "description": "Detects the presense of an emoji character in your text",
        "endpoint": "ws://emoji-analysis-production.herokuapp.com",
        "id": 1,
        "interaction": Object {
          "created_at": "2021-02-25T15:09:05.001302-05:00",
          "deleted_at": null,
          "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
          "id": 1,
          "name": "ChatPrompt",
          "types": Array [],
          "updated_at": null,
        },
        "is_active": true,
        "name": "emoji-analysis",
        "owner": Object {
          "email": "super@email.com",
          "id": 999,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "superuser",
        },
        "self": Object {
          "email": null,
          "id": 148,
          "is_anonymous": true,
          "is_super": false,
          "lastseen_at": "2021-02-25T13:08:57.323-05:00",
          "personalname": "Emoji Analysis",
          "roles": null,
          "single_use_password": false,
          "username": "ebe565050b31cbb4e7eacc39b23e2167",
        },
        "socket": Object {
          "path": "/path/to/foo",
        },
        "title": "A different agent",
        "updated_at": "2021-02-25T20:09:04.999Z",
      },
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  userEvent.clear(descriptionInput);

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent.mock.calls.length).toBe(2);
  expect(serialize()).toMatchSnapshot();

  userEvent.type(descriptionInput, 'A different description');

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent.mock.calls[2]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "configuration": Object {
          "bar": "2",
          "baz": "c",
          "foo": "false",
        },
        "created_at": "2021-02-25T17:31:33.826Z",
        "deleted_at": null,
        "description": "A different description",
        "endpoint": "ws://emoji-analysis-production.herokuapp.com",
        "id": 1,
        "interaction": Object {
          "created_at": "2021-02-25T15:09:05.001302-05:00",
          "deleted_at": null,
          "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
          "id": 1,
          "name": "ChatPrompt",
          "types": Array [],
          "updated_at": null,
        },
        "is_active": true,
        "name": "emoji-analysis",
        "owner": Object {
          "email": "super@email.com",
          "id": 999,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "superuser",
        },
        "self": Object {
          "email": null,
          "id": 148,
          "is_anonymous": true,
          "is_super": false,
          "lastseen_at": "2021-02-25T13:08:57.323-05:00",
          "personalname": "Emoji Analysis",
          "roles": null,
          "single_use_password": false,
          "username": "ebe565050b31cbb4e7eacc39b23e2167",
        },
        "socket": Object {
          "path": "/path/to/foo",
        },
        "title": "A different agent",
        "updated_at": "2021-02-25T20:09:04.999Z",
      },
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  userEvent.clear(endpointInput);

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent.mock.calls.length).toBe(3);
  expect(serialize()).toMatchSnapshot();

  userEvent.type(endpointInput, 'A different endpoint');

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent.mock.calls[3]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "configuration": Object {
          "bar": "2",
          "baz": "c",
          "foo": "false",
        },
        "created_at": "2021-02-25T17:31:33.826Z",
        "deleted_at": null,
        "description": "A different description",
        "endpoint": "A different endpoint",
        "id": 1,
        "interaction": Object {
          "created_at": "2021-02-25T15:09:05.001302-05:00",
          "deleted_at": null,
          "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
          "id": 1,
          "name": "ChatPrompt",
          "types": Array [],
          "updated_at": null,
        },
        "is_active": true,
        "name": "emoji-analysis",
        "owner": Object {
          "email": "super@email.com",
          "id": 999,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "superuser",
        },
        "self": Object {
          "email": null,
          "id": 148,
          "is_anonymous": true,
          "is_super": false,
          "lastseen_at": "2021-02-25T13:08:57.323-05:00",
          "personalname": "Emoji Analysis",
          "roles": null,
          "single_use_password": false,
          "username": "ebe565050b31cbb4e7eacc39b23e2167",
        },
        "socket": Object {
          "path": "/path/to/foo",
        },
        "title": "A different agent",
        "updated_at": "2021-02-25T20:09:04.999Z",
      },
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.getByRole('option', { name: /AudioPrompt/i }));
  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent.mock.calls[4]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "configuration": Object {
          "bar": "2",
          "baz": "c",
          "foo": "false",
        },
        "created_at": "2021-02-25T17:31:33.826Z",
        "deleted_at": null,
        "description": "A different description",
        "endpoint": "A different endpoint",
        "id": 1,
        "interaction": Object {
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Audio Prompt Responses.",
          "id": 2,
          "name": "AudioPrompt",
          "updated_at": "2021-02-27T20:38:53.774Z",
        },
        "is_active": true,
        "name": "emoji-analysis",
        "owner": Object {
          "email": "super@email.com",
          "id": 999,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "superuser",
        },
        "self": Object {
          "email": null,
          "id": 148,
          "is_anonymous": true,
          "is_super": false,
          "lastseen_at": "2021-02-25T13:08:57.323-05:00",
          "personalname": "Emoji Analysis",
          "roles": null,
          "single_use_password": false,
          "username": "ebe565050b31cbb4e7eacc39b23e2167",
        },
        "socket": Object {
          "path": "/path/to/foo",
        },
        "title": "A different agent",
        "updated_at": "2021-02-25T20:09:04.999Z",
      },
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(
    await screen.getByRole('checkbox', { name: /agent is active/i })
  );
  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent.mock.calls[5]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "configuration": Object {
          "bar": "2",
          "baz": "c",
          "foo": "false",
        },
        "created_at": "2021-02-25T17:31:33.826Z",
        "deleted_at": null,
        "description": "A different description",
        "endpoint": "A different endpoint",
        "id": 1,
        "interaction": Object {
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Audio Prompt Responses.",
          "id": 2,
          "name": "AudioPrompt",
          "updated_at": "2021-02-27T20:38:53.774Z",
        },
        "is_active": false,
        "name": "emoji-analysis",
        "owner": Object {
          "email": "super@email.com",
          "id": 999,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "superuser",
        },
        "self": Object {
          "email": null,
          "id": 148,
          "is_anonymous": true,
          "is_super": false,
          "lastseen_at": "2021-02-25T13:08:57.323-05:00",
          "personalname": "Emoji Analysis",
          "roles": null,
          "single_use_password": false,
          "username": "ebe565050b31cbb4e7eacc39b23e2167",
        },
        "socket": Object {
          "path": "/path/to/foo",
        },
        "title": "A different agent",
        "updated_at": "2021-02-25T20:09:04.999Z",
      },
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Add a new agent', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.getByText(/create a new agent/i));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent).not.toHaveBeenCalled();
  expect(serialize()).toMatchSnapshot();

  const titleInput = await screen.getByLabelText(/title/i);
  const descriptionInput = await screen.getByLabelText(/description/i);
  const endpointInput = await screen.getByLabelText(/endpoint/i);

  userEvent.type(titleInput, 'A new agent');

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent).not.toHaveBeenCalled();
  expect(serialize()).toMatchSnapshot();

  userEvent.type(descriptionInput, 'A new agent description');

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent).not.toHaveBeenCalled();
  expect(serialize()).toMatchSnapshot();

  userEvent.type(endpointInput, 'ws:...');

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent).not.toHaveBeenCalled();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.getByRole('option', { name: /ChatPrompt/i }));

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );

  expect(agentActions.setAgent).not.toHaveBeenCalled();
  expect(agentActions.createAgent).toHaveBeenCalled();
  expect(agentActions.createAgent.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "configuration": Object {},
          "created_at": null,
          "deleted_at": null,
          "description": "A new agent description",
          "endpoint": "ws:...",
          "id": null,
          "interaction": Object {
            "created_at": "2021-02-25T17:31:33.826Z",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "updated_at": "2021-02-27T20:38:53.774Z",
          },
          "is_active": false,
          "name": "",
          "owner": Object {},
          "self": null,
          "socket": Object {},
          "title": "A new agent",
          "updated_at": null,
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Search agents', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const searchInput = await screen.findByLabelText('Search agents');

  // "emoji"
  userEvent.type(searchInput, 'emoji{enter}');
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.clear(searchInput);

  // "emoji analysis"
  userEvent.type(searchInput, ' analysis{enter}');
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.clear(searchInput);
  userEvent.type(searchInput, '{enter}');
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.clear(searchInput);
  // "analysis"
  userEvent.type(searchInput, 'analysis{enter}');
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Delete an agent', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const listItems = await screen.findAllByRole('listitem');

  userEvent.click(listItems[0]);

  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Delete this agent'));
  await waitForPopper();
  await waitFor(() =>
    expect(screen.getByTestId('agent-confirm-delete')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('No'));
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Delete this agent'));
  await waitForPopper();
  await waitFor(() =>
    expect(screen.getByTestId('agent-confirm-delete')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Yes'));
  expect(serialize()).toMatchSnapshot();

  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent).toHaveBeenCalledTimes(1);
  expect(agentActions.setAgent.mock.calls).toMatchObject([
    [
      1,
      {
        configuration: {
          bar: '2',
          baz: 'c',
          foo: 'false'
        },
        created_at: '2021-02-25T17:31:33.826Z',
        deleted_at: expectDateString,
        description: 'Detects the presense of an emoji character in your text',
        endpoint: 'ws://emoji-analysis-production.herokuapp.com',
        id: 1,
        interaction: {
          created_at: '2021-02-25T15:09:05.001302-05:00',
          deleted_at: null,
          description:
            'It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.',
          id: 1,
          name: 'ChatPrompt',
          updated_at: null,
          types: []
        },
        is_active: true,
        name: 'emoji-analysis',
        owner: {
          email: 'super@email.com',
          id: 999,
          is_anonymous: false,
          is_super: true,
          personalname: 'Super User',
          roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
          username: 'superuser'
        },
        self: {
          email: null,
          id: 148,
          is_anonymous: true,
          is_super: false,
          lastseen_at: '2021-02-25T13:08:57.323-05:00',
          personalname: 'Emoji Analysis',
          roles: null,
          single_use_password: false,
          username: 'ebe565050b31cbb4e7eacc39b23e2167'
        },
        socket: {
          path: '/path/to/foo'
        },
        title: 'Emoji Analysis',
        updated_at: '2021-02-25T20:09:04.999Z'
      }
    ]
  ]);

  done();
});

test('Duplicate an agent', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const listItems = await screen.findAllByRole('listitem');

  userEvent.click(listItems[0]);

  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Duplicate this agent'));
  await waitForPopper();
  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );

  userEvent.click(await screen.getByRole('button', { name: /save/i }));
  await waitFor(() => {
    expect(agentActions.createAgent).toHaveBeenCalled();
  });
  expect(agentActions.createAgent.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "configuration": Object {
            "bar": "2",
            "baz": "c",
            "foo": "false",
          },
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "Detects the presense of an emoji character in your text",
          "endpoint": "ws://emoji-analysis-production.herokuapp.com",
          "id": null,
          "interaction": Object {
            "created_at": "2021-02-25T15:09:05.001302-05:00",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "types": Array [],
            "updated_at": null,
          },
          "is_active": true,
          "name": "emoji-analysis",
          "owner": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
          "self": Object {
            "email": null,
            "id": 148,
            "is_anonymous": true,
            "is_super": false,
            "lastseen_at": "2021-02-25T13:08:57.323-05:00",
            "personalname": "Emoji Analysis",
            "roles": null,
            "single_use_password": false,
            "username": "ebe565050b31cbb4e7eacc39b23e2167",
          },
          "socket": Object {
            "path": "/path/to/foo",
          },
          "title": "Emoji Analysis",
          "updated_at": "2021-02-25T20:09:04.999Z",
        },
      ],
    ]
  `);
  expect(agentActions.setAgent).not.toHaveBeenCalled();
  done();
});

test('Change a socket configuration', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const listItems = await screen.findAllByRole('listitem');

  userEvent.click(listItems[0]);

  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const configKeys = await screen.findAllByLabelText(
    'Socket configuration key'
  );
  const configVals = await screen.findAllByLabelText(
    'Socket configuration value'
  );
  const configDeleteButtons = await screen.findAllByLabelText(
    'Delete socket configuration'
  );

  userEvent.clear(configKeys[0]);
  userEvent.type(configKeys[0], 'key');

  userEvent.clear(configVals[0]);
  userEvent.type(configVals[0], 'value');

  userEvent.click(configDeleteButtons[0]);

  await waitForPopper();
  await waitFor(() =>
    expect(screen.getByTestId('agent-confirm-delete')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('No'));
  expect(serialize()).toMatchSnapshot();

  userEvent.click(configDeleteButtons[0]);
  await waitForPopper();
  await waitFor(() =>
    expect(screen.getByTestId('agent-confirm-delete')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Yes'));
  expect(serialize()).toMatchSnapshot();

  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent).toHaveBeenCalledTimes(2);
  expect(agentActions.setAgent.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
        Object {
          "configuration": Object {
            "bar": "2",
            "baz": "c",
            "foo": "false",
          },
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "Detects the presense of an emoji character in your text",
          "endpoint": "ws://emoji-analysis-production.herokuapp.com",
          "id": 1,
          "interaction": Object {
            "created_at": "2021-02-25T15:09:05.001302-05:00",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "types": Array [],
            "updated_at": null,
          },
          "is_active": true,
          "name": "emoji-analysis",
          "owner": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
          "self": Object {
            "email": null,
            "id": 148,
            "is_anonymous": true,
            "is_super": false,
            "lastseen_at": "2021-02-25T13:08:57.323-05:00",
            "personalname": "Emoji Analysis",
            "roles": null,
            "single_use_password": false,
            "username": "ebe565050b31cbb4e7eacc39b23e2167",
          },
          "socket": Object {
            "key": "value",
          },
          "title": "Emoji Analysis",
          "updated_at": "2021-02-25T20:09:04.999Z",
        },
      ],
      Array [
        1,
        Object {
          "configuration": Object {
            "bar": "2",
            "baz": "c",
            "foo": "false",
          },
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "Detects the presense of an emoji character in your text",
          "endpoint": "ws://emoji-analysis-production.herokuapp.com",
          "id": 1,
          "interaction": Object {
            "created_at": "2021-02-25T15:09:05.001302-05:00",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "types": Array [],
            "updated_at": null,
          },
          "is_active": true,
          "name": "emoji-analysis",
          "owner": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
          "self": Object {
            "email": null,
            "id": 148,
            "is_anonymous": true,
            "is_super": false,
            "lastseen_at": "2021-02-25T13:08:57.323-05:00",
            "personalname": "Emoji Analysis",
            "roles": null,
            "single_use_password": false,
            "username": "ebe565050b31cbb4e7eacc39b23e2167",
          },
          "socket": Object {
            "key": "value",
          },
          "title": "Emoji Analysis",
          "updated_at": "2021-02-25T20:09:04.999Z",
        },
      ],
    ]
  `);

  done();
});

test('Add a socket configuration', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const listItems = await screen.findAllByRole('listitem');

  userEvent.click(listItems[0]);

  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const configKey = await screen.findByLabelText(
    'New socket configuration key'
  );
  const configVal = await screen.findByLabelText(
    'New socket configuration value'
  );

  userEvent.clear(configKey);
  userEvent.type(configKey, 'key');

  userEvent.clear(configVal);
  userEvent.type(configVal, 'value');

  userEvent.click(await screen.findByLabelText('Add socket configuration'));

  expect(agentActions.setAgent).toHaveBeenCalledTimes(1);

  userEvent.click(await screen.getByRole('button', { name: /save/i }));

  await waitFor(() => {
    expect(agentActions.setAgent).toHaveBeenCalledTimes(2);
  });

  expect(agentActions.setAgent.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
        Object {
          "configuration": Object {
            "bar": "2",
            "baz": "c",
            "foo": "false",
          },
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "Detects the presense of an emoji character in your text",
          "endpoint": "ws://emoji-analysis-production.herokuapp.com",
          "id": 1,
          "interaction": Object {
            "created_at": "2021-02-25T15:09:05.001302-05:00",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "types": Array [],
            "updated_at": null,
          },
          "is_active": true,
          "name": "emoji-analysis",
          "owner": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
          "self": Object {
            "email": null,
            "id": 148,
            "is_anonymous": true,
            "is_super": false,
            "lastseen_at": "2021-02-25T13:08:57.323-05:00",
            "personalname": "Emoji Analysis",
            "roles": null,
            "single_use_password": false,
            "username": "ebe565050b31cbb4e7eacc39b23e2167",
          },
          "socket": Object {
            "key": "value",
            "path": "/path/to/foo",
          },
          "title": "Emoji Analysis",
          "updated_at": "2021-02-25T20:09:04.999Z",
        },
      ],
      Array [
        1,
        Object {
          "configuration": Object {
            "bar": "2",
            "baz": "c",
            "foo": "false",
          },
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "Detects the presense of an emoji character in your text",
          "endpoint": "ws://emoji-analysis-production.herokuapp.com",
          "id": 1,
          "interaction": Object {
            "created_at": "2021-02-25T15:09:05.001302-05:00",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "types": Array [],
            "updated_at": null,
          },
          "is_active": true,
          "name": "emoji-analysis",
          "owner": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
          "self": Object {
            "email": null,
            "id": 148,
            "is_anonymous": true,
            "is_super": false,
            "lastseen_at": "2021-02-25T13:08:57.323-05:00",
            "personalname": "Emoji Analysis",
            "roles": null,
            "single_use_password": false,
            "username": "ebe565050b31cbb4e7eacc39b23e2167",
          },
          "socket": Object {
            "key": "value",
            "path": "/path/to/foo",
          },
          "title": "Emoji Analysis",
          "updated_at": "2021-02-25T20:09:04.999Z",
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Change an agent configuration', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const listItems = await screen.findAllByRole('listitem');

  userEvent.click(listItems[0]);

  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const configKeys = await screen.findAllByLabelText('Agent configuration key');
  const configVals = await screen.findAllByLabelText(
    'Agent configuration value'
  );
  const configDeleteButtons = await screen.findAllByLabelText(
    'Delete agent configuration'
  );

  userEvent.clear(configKeys[0]);
  userEvent.type(configKeys[0], 'key');

  userEvent.clear(configVals[0]);
  userEvent.type(configVals[0], 'value');

  userEvent.click(configDeleteButtons[0]);

  await waitForPopper();
  await waitFor(() =>
    expect(screen.getByTestId('agent-confirm-delete')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('No'));
  expect(serialize()).toMatchSnapshot();

  userEvent.click(configDeleteButtons[0]);
  await waitForPopper();
  await waitFor(() =>
    expect(screen.getByTestId('agent-confirm-delete')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Yes'));
  expect(serialize()).toMatchSnapshot();

  expect(agentActions.createAgent).not.toHaveBeenCalled();
  expect(agentActions.setAgent).toHaveBeenCalledTimes(2);
  expect(agentActions.setAgent.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
        Object {
          "configuration": Object {
            "baz": "c",
            "foo": "false",
            "key": "value",
          },
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "Detects the presense of an emoji character in your text",
          "endpoint": "ws://emoji-analysis-production.herokuapp.com",
          "id": 1,
          "interaction": Object {
            "created_at": "2021-02-25T15:09:05.001302-05:00",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "types": Array [],
            "updated_at": null,
          },
          "is_active": true,
          "name": "emoji-analysis",
          "owner": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
          "self": Object {
            "email": null,
            "id": 148,
            "is_anonymous": true,
            "is_super": false,
            "lastseen_at": "2021-02-25T13:08:57.323-05:00",
            "personalname": "Emoji Analysis",
            "roles": null,
            "single_use_password": false,
            "username": "ebe565050b31cbb4e7eacc39b23e2167",
          },
          "socket": Object {
            "path": "/path/to/foo",
          },
          "title": "Emoji Analysis",
          "updated_at": "2021-02-25T20:09:04.999Z",
        },
      ],
      Array [
        1,
        Object {
          "configuration": Object {
            "baz": "c",
            "foo": "false",
            "key": "value",
          },
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "Detects the presense of an emoji character in your text",
          "endpoint": "ws://emoji-analysis-production.herokuapp.com",
          "id": 1,
          "interaction": Object {
            "created_at": "2021-02-25T15:09:05.001302-05:00",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "types": Array [],
            "updated_at": null,
          },
          "is_active": true,
          "name": "emoji-analysis",
          "owner": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
          "self": Object {
            "email": null,
            "id": 148,
            "is_anonymous": true,
            "is_super": false,
            "lastseen_at": "2021-02-25T13:08:57.323-05:00",
            "personalname": "Emoji Analysis",
            "roles": null,
            "single_use_password": false,
            "username": "ebe565050b31cbb4e7eacc39b23e2167",
          },
          "socket": Object {
            "path": "/path/to/foo",
          },
          "title": "Emoji Analysis",
          "updated_at": "2021-02-25T20:09:04.999Z",
        },
      ],
    ]
  `);

  done();
});

test('Add an agent configuration', async done => {
  const Component = Agents;
  const props = {
    ...commonProps,
    activePage: 1
  };

  const state = {
    ...commonState,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('agents-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const listItems = await screen.findAllByRole('listitem');

  userEvent.click(listItems[0]);

  await waitFor(() =>
    expect(screen.getByTestId('agent-is-selected')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const configKey = await screen.findByLabelText('New agent configuration key');
  const configVal = await screen.findByLabelText(
    'New agent configuration value'
  );
  const configDeleteButton = await screen.findByLabelText(
    'Add agent configuration'
  );

  expect(agentActions.setAgent).toHaveBeenCalledTimes(0);

  userEvent.clear(configKey);
  userEvent.type(configKey, 'key');

  userEvent.clear(configVal);
  userEvent.type(configVal, 'value');

  userEvent.click(configDeleteButton);

  expect(agentActions.setAgent).toHaveBeenCalledTimes(1);

  userEvent.click(await screen.getByRole('button', { name: /save/i }));

  await waitFor(() => {
    expect(agentActions.setAgent).toHaveBeenCalledTimes(2);
  });

  expect(agentActions.setAgent.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        1,
        Object {
          "configuration": Object {
            "bar": "2",
            "baz": "c",
            "foo": "false",
            "key": "value",
          },
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "Detects the presense of an emoji character in your text",
          "endpoint": "ws://emoji-analysis-production.herokuapp.com",
          "id": 1,
          "interaction": Object {
            "created_at": "2021-02-25T15:09:05.001302-05:00",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "types": Array [],
            "updated_at": null,
          },
          "is_active": true,
          "name": "emoji-analysis",
          "owner": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
          "self": Object {
            "email": null,
            "id": 148,
            "is_anonymous": true,
            "is_super": false,
            "lastseen_at": "2021-02-25T13:08:57.323-05:00",
            "personalname": "Emoji Analysis",
            "roles": null,
            "single_use_password": false,
            "username": "ebe565050b31cbb4e7eacc39b23e2167",
          },
          "socket": Object {
            "path": "/path/to/foo",
          },
          "title": "Emoji Analysis",
          "updated_at": "2021-02-25T20:09:04.999Z",
        },
      ],
      Array [
        1,
        Object {
          "configuration": Object {
            "bar": "2",
            "baz": "c",
            "foo": "false",
            "key": "value",
          },
          "created_at": "2021-02-25T17:31:33.826Z",
          "deleted_at": null,
          "description": "Detects the presense of an emoji character in your text",
          "endpoint": "ws://emoji-analysis-production.herokuapp.com",
          "id": 1,
          "interaction": Object {
            "created_at": "2021-02-25T15:09:05.001302-05:00",
            "deleted_at": null,
            "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
            "id": 1,
            "name": "ChatPrompt",
            "types": Array [],
            "updated_at": null,
          },
          "is_active": true,
          "name": "emoji-analysis",
          "owner": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
              "facilitator",
              "researcher",
            ],
            "username": "superuser",
          },
          "self": Object {
            "email": null,
            "id": 148,
            "is_anonymous": true,
            "is_super": false,
            "lastseen_at": "2021-02-25T13:08:57.323-05:00",
            "personalname": "Emoji Analysis",
            "roles": null,
            "single_use_password": false,
            "username": "ebe565050b31cbb4e7eacc39b23e2167",
          },
          "socket": Object {
            "path": "/path/to/foo",
          },
          "title": "Emoji Analysis",
          "updated_at": "2021-02-25T20:09:04.999Z",
        },
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  done();
});
