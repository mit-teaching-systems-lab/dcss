import assert from 'assert';
import { state } from '../bootstrap';

import { interactionInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/interaction';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};
const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('interactions', () => {
  let state;
  let interaction;
  let interactions;
  let interactionsById;

  beforeEach(() => {
    state = [];
    interaction = {
      id: 1,
      name: 'ABC',
      description: 'This is a bot',
      endpoint: 'ws://'
    };
    interactions = [
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
    interactionsById = {
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
    expect(reducer.interaction(undefined, {})).toEqual(interactionInitialState);
    expect(reducer.interaction(undefined, {})).toEqual(interactionInitialState);
    expect(reducer.interactions(undefined, {})).toEqual(initialState);
    expect(reducer.interactions(undefined, {})).toEqual(initialState);
    expect(reducer.interactionsById(undefined, {})).toEqual(initialStateById);
    expect(reducer.interactionsById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_INTERACTION_SUCCESS 1', () => {
    const action = {
      type: types.GET_INTERACTION_SUCCESS,
      interaction
    };
    const first = reducer.interaction(undefined, action);
    const second = reducer.interaction(undefined, action);
    expect(first).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "description": "This is a bot",
        "endpoint": "ws://",
        "id": 1,
        "name": "ABC",
        "owner": null,
        "types": Array [],
        "updated_at": null,
      }
    `);
    expect(second).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "description": "This is a bot",
        "endpoint": "ws://",
        "id": 1,
        "name": "ABC",
        "owner": null,
        "types": Array [],
        "updated_at": null,
      }
    `);
    expect(first).toEqual(second);
  });

  test('GET_INTERACTION_SUCCESS 2', () => {
    const action = {
      type: types.GET_INTERACTION_SUCCESS,
      interaction
    };
    expect(reducer.interactions(state, action)).toMatchInlineSnapshot(`
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

  test('GET_INTERACTION_SUCCESS 3', () => {
    const action = {
      type: types.GET_INTERACTION_SUCCESS,
      interaction
    };
    expect(
      reducer.interactionsById(
        {
          [interaction.id]: interaction
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

  test('GET_INTERACTION_SUCCESS 4', () => {
    const different = JSON.parse(JSON.stringify(interaction));
    different.id = 2;
    const action = {
      type: types.SET_INTERACTION_SUCCESS,
      interaction: different
    };
    expect(
      reducer.interactionsById(
        {
          [interaction.id]: interaction
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

  test('SET_INTERACTION_SUCCESS 1', () => {
    const action = {
      type: types.SET_INTERACTION_SUCCESS,
      interaction
    };
    const first = reducer.interaction(undefined, action);
    const second = reducer.interaction(undefined, action);
    expect(first).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "description": "This is a bot",
        "endpoint": "ws://",
        "id": 1,
        "name": "ABC",
        "owner": null,
        "types": Array [],
        "updated_at": null,
      }
    `);
    expect(second).toMatchInlineSnapshot(`
      Object {
        "created_at": null,
        "deleted_at": null,
        "description": "This is a bot",
        "endpoint": "ws://",
        "id": 1,
        "name": "ABC",
        "owner": null,
        "types": Array [],
        "updated_at": null,
      }
    `);
    expect(first).toEqual(second);
  });

  test('SET_INTERACTION_SUCCESS 2', () => {
    const different = JSON.parse(JSON.stringify(interaction));
    different.id = 2;

    const action = {
      type: types.SET_INTERACTION_SUCCESS,
      interaction: different
    };

    expect(reducer.interactions([interaction], action)).toMatchInlineSnapshot(`
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

  test('SET_INTERACTION_SUCCESS 3', () => {
    const action = {
      type: types.SET_INTERACTION_SUCCESS,
      interaction
    };

    expect(reducer.interactions([interaction], action)).toMatchInlineSnapshot(`
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

  test('SET_INTERACTION_SUCCESS 4', () => {
    const action = {
      type: types.SET_INTERACTION_SUCCESS,
      interaction
    };
    expect(
      reducer.interactionsById(
        {
          [interaction.id]: interaction
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

  test('SET_INTERACTION_SUCCESS 5', () => {
    const different = JSON.parse(JSON.stringify(interaction));
    different.id = 2;
    const action = {
      type: types.SET_INTERACTION_SUCCESS,
      interaction: different
    };
    expect(
      reducer.interactionsById(
        {
          [interaction.id]: interaction
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

  test('GET_INTERACTIONS_SUCCESS 1', () => {
    const action = {
      type: types.GET_INTERACTIONS_SUCCESS,
      interactions
    };
    expect(reducer.interactions(state, action)).toMatchInlineSnapshot(`
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
    expect(reducer.interactionsById(state, action)).toMatchInlineSnapshot(`
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

  test('GET_INTERACTIONS_SUCCESS 2', () => {
    const action = {
      type: types.GET_INTERACTIONS_SUCCESS,
      interactions
    };
    expect(reducer.interactionsById(state, action)).toMatchInlineSnapshot(`
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

  test('GET_INTERACTIONS_SUCCESS 3', () => {
    const action = {
      type: types.GET_INTERACTIONS_SUCCESS,
      interactions: [
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
    expect(reducer.interactions(state, action)).toMatchInlineSnapshot(`
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
    expect(reducer.interactionsById(state, action)).toMatchInlineSnapshot(`
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
