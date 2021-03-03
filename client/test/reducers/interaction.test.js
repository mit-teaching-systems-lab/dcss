import assert from 'assert';
import { state } from '../bootstrap';

import { agentInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/agent';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};
const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('agents', () => {
  let state;
  let agent;
  let agents;
  let agentsById;

  beforeEach(() => {
    state = [];
    agent = {
      id: 1,
      name: 'ABC',
      description: 'This is a bot',
      endpoint: 'ws://'
    };
    agents = [
      { id: 1, name: 'ABC', endpoint: 'ws://', description: 'This is a bot' },
      { id: 1, name: 'ABC', endpoint: 'ws://', description: 'This is a bot' }, // this is intentional
      {
        id: 2,
        name: 'DEF',
        endpoint: 'ws://',
        description: 'This is a different bot'
      },
      {
        id: 3,
        name: 'GHI',
        endpoint: 'ws://',
        description: 'This is a third bot'
      }
    ];
    agentsById = {
      ABC: {
        id: 1,
        name: 'ABC',
        endpoint: 'ws://',
        description: 'This is a bot'
      },
      DEF: {
        id: 2,
        name: 'DEF',
        endpoint: 'ws://',
        description: 'This is a different bot'
      },
      GHI: {
        id: 3,
        name: 'GHI',
        endpoint: 'ws://',
        description: 'This is a third bot'
      }
    };
  });

  test('initial state', () => {
    expect(reducer.agent(undefined, {})).toEqual(agentInitialState);
    expect(reducer.agent(undefined, {})).toEqual(agentInitialState);
    expect(reducer.agents(undefined, {})).toEqual(initialState);
    expect(reducer.agents(undefined, {})).toEqual(initialState);
    expect(reducer.agentsById(undefined, {})).toEqual(initialStateById);
    expect(reducer.agentsById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_AGENT_SUCCESS 1', () => {
    const action = {
      type: types.GET_AGENT_SUCCESS,
      agent
    };
    const first = reducer.agent(undefined, action);
    const second = reducer.agent(undefined, action);
    expect(first).toMatchInlineSnapshot(`
      Object {
        "configuration": Object {},
        "created_at": null,
        "deleted_at": null,
        "description": "This is a bot",
        "endpoint": "ws://",
        "id": 1,
        "interaction": Object {
          "id": null,
        },
        "is_active": false,
        "name": "ABC",
        "owner": Object {},
        "self": null,
        "socket": Object {},
        "title": "",
        "updated_at": null,
      }
    `);
    expect(second).toMatchInlineSnapshot(`
      Object {
        "configuration": Object {},
        "created_at": null,
        "deleted_at": null,
        "description": "This is a bot",
        "endpoint": "ws://",
        "id": 1,
        "interaction": Object {
          "id": null,
        },
        "is_active": false,
        "name": "ABC",
        "owner": Object {},
        "self": null,
        "socket": Object {},
        "title": "",
        "updated_at": null,
      }
    `);
    expect(first).toEqual(second);
  });

  test('GET_AGENT_SUCCESS 2', () => {
    const action = {
      type: types.GET_AGENT_SUCCESS,
      agent
    };
    expect(reducer.agents(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
      ]
    `);
  });

  test('GET_AGENT_SUCCESS 3', () => {
    const action = {
      type: types.GET_AGENT_SUCCESS,
      agent
    };
    expect(
      reducer.agentsById(
        {
          [agent.id]: agent
        },
        action
      )
    ).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
      }
    `);
  });

  test('GET_AGENT_SUCCESS 4', () => {
    const different = JSON.parse(JSON.stringify(agent));
    different.id = 2;
    const action = {
      type: types.SET_AGENT_SUCCESS,
      agent: different
    };
    expect(
      reducer.agentsById(
        {
          [agent.id]: agent
        },
        action
      )
    ).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
        "2": Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 2,
          "name": "ABC",
        },
      }
    `);
  });

  test('SET_AGENT_SUCCESS 1', () => {
    const action = {
      type: types.SET_AGENT_SUCCESS,
      agent
    };
    const first = reducer.agent(undefined, action);
    const second = reducer.agent(undefined, action);
    expect(first).toMatchInlineSnapshot(`
      Object {
        "configuration": Object {},
        "created_at": null,
        "deleted_at": null,
        "description": "This is a bot",
        "endpoint": "ws://",
        "id": 1,
        "interaction": Object {
          "id": null,
        },
        "is_active": false,
        "name": "ABC",
        "owner": Object {},
        "self": null,
        "socket": Object {},
        "title": "",
        "updated_at": null,
      }
    `);
    expect(second).toMatchInlineSnapshot(`
      Object {
        "configuration": Object {},
        "created_at": null,
        "deleted_at": null,
        "description": "This is a bot",
        "endpoint": "ws://",
        "id": 1,
        "interaction": Object {
          "id": null,
        },
        "is_active": false,
        "name": "ABC",
        "owner": Object {},
        "self": null,
        "socket": Object {},
        "title": "",
        "updated_at": null,
      }
    `);
    expect(first).toEqual(second);
  });

  test('SET_AGENT_SUCCESS 2', () => {
    const different = JSON.parse(JSON.stringify(agent));
    different.id = 2;

    const action = {
      type: types.SET_AGENT_SUCCESS,
      agent: different
    };

    expect(reducer.agents([agent], action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
        Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 2,
          "name": "ABC",
        },
      ]
    `);
  });

  test('SET_AGENT_SUCCESS 3', () => {
    const action = {
      type: types.SET_AGENT_SUCCESS,
      agent
    };

    expect(reducer.agents([agent], action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
      ]
    `);
  });

  test('SET_AGENT_SUCCESS 4', () => {
    const action = {
      type: types.SET_AGENT_SUCCESS,
      agent
    };
    expect(
      reducer.agentsById(
        {
          [agent.id]: agent
        },
        action
      )
    ).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
      }
    `);
  });

  test('SET_AGENT_SUCCESS 5', () => {
    const different = JSON.parse(JSON.stringify(agent));
    different.id = 2;
    const action = {
      type: types.SET_AGENT_SUCCESS,
      agent: different
    };
    expect(
      reducer.agentsById(
        {
          [agent.id]: agent
        },
        action
      )
    ).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
        "2": Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 2,
          "name": "ABC",
        },
      }
    `);
  });

  test('GET_AGENTS_SUCCESS 1', () => {
    const action = {
      type: types.GET_AGENTS_SUCCESS,
      agents
    };
    expect(reducer.agents(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
        Object {
          "description": "This is a different bot",
          "endpoint": "ws://",
          "id": 2,
          "name": "DEF",
        },
        Object {
          "description": "This is a third bot",
          "endpoint": "ws://",
          "id": 3,
          "name": "GHI",
        },
      ]
    `);
    expect(reducer.agentsById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
        "2": Object {
          "description": "This is a different bot",
          "endpoint": "ws://",
          "id": 2,
          "name": "DEF",
        },
        "3": Object {
          "description": "This is a third bot",
          "endpoint": "ws://",
          "id": 3,
          "name": "GHI",
        },
      }
    `);
  });

  test('GET_AGENTS_SUCCESS 2', () => {
    const action = {
      type: types.GET_AGENTS_SUCCESS,
      agents
    };
    expect(reducer.agentsById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
          "name": "ABC",
        },
        "2": Object {
          "description": "This is a different bot",
          "endpoint": "ws://",
          "id": 2,
          "name": "DEF",
        },
        "3": Object {
          "description": "This is a third bot",
          "endpoint": "ws://",
          "id": 3,
          "name": "GHI",
        },
      }
    `);
  });

  test('GET_AGENTS_SUCCESS 3', () => {
    const action = {
      type: types.GET_AGENTS_SUCCESS,
      agents: [
        { id: 1, endpoint: 'ws://', description: 'This is a bot' },
        { id: 1, endpoint: 'ws://', description: 'This is a bot' }, // this is intentional
        {
          id: 2,
          name: 'DEF',
          endpoint: 'ws://',
          description: 'This is a different bot'
        },
        {
          id: 3,
          name: 'GHI',
          endpoint: 'ws://',
          description: 'This is a third bot'
        }
      ]
    };
    expect(reducer.agents(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
        },
        Object {
          "description": "This is a different bot",
          "endpoint": "ws://",
          "id": 2,
          "name": "DEF",
        },
        Object {
          "description": "This is a third bot",
          "endpoint": "ws://",
          "id": 3,
          "name": "GHI",
        },
      ]
    `);
    expect(reducer.agentsById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "This is a bot",
          "endpoint": "ws://",
          "id": 1,
        },
        "2": Object {
          "description": "This is a different bot",
          "endpoint": "ws://",
          "id": 2,
          "name": "DEF",
        },
        "3": Object {
          "description": "This is a third bot",
          "endpoint": "ws://",
          "id": 3,
          "name": "GHI",
        },
      }
    `);
  });
});
