import assert from 'assert';
import { state } from '../bootstrap';

import { personaInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/persona';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};
const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('personas', () => {
  let state;
  let persona;
  let personas;
  let personasById;

  beforeEach(() => {
    state = [];
    persona = {
      id: 1,
      name: 'ABC',
      description: 'the first role'
    };
    personas = [
      { id: 1, name: 'ABC', description: 'the first role' },
      { id: 1, name: 'ABC', description: 'the first role' }, // this is intentional
      { id: 2, name: 'DEF', description: 'the second role' },
      { id: 3, name: 'GHI', description: 'the third role' }
    ];
    personasById = {
      ABC: { id: 1, name: 'ABC', description: 'the first role' },
      DEF: { id: 2, name: 'DEF', description: 'the second role' },
      GHI: { id: 3, name: 'GHI', description: 'the third role' }
    };
  });

  test('initial state', () => {
    expect(reducer.persona(undefined, {})).toEqual(personaInitialState);
    expect(reducer.persona(undefined, {})).toEqual(personaInitialState);
    expect(reducer.personas(undefined, {})).toEqual(initialState);
    expect(reducer.personas(undefined, {})).toEqual(initialState);
    expect(reducer.personasById(undefined, {})).toEqual(initialStateById);
    expect(reducer.personasById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_PERSONA_SUCCESS 1', () => {
    const action = {
      type: types.GET_PERSONA_SUCCESS,
      persona
    };
    const first = reducer.persona(undefined, action);
    const second = reducer.persona(undefined, action);
    expect(first).toMatchInlineSnapshot(`
      Object {
        "author_id": null,
        "color": "",
        "created_at": null,
        "deleted_at": null,
        "description": "the first role",
        "id": 1,
        "is_read_only": false,
        "is_shared": false,
        "name": "ABC",
        "updated_at": null,
      }
    `);
    expect(second).toMatchInlineSnapshot(`
      Object {
        "author_id": null,
        "color": "",
        "created_at": null,
        "deleted_at": null,
        "description": "the first role",
        "id": 1,
        "is_read_only": false,
        "is_shared": false,
        "name": "ABC",
        "updated_at": null,
      }
    `);
    expect(first).toEqual(second);
  });

  test('GET_PERSONA_SUCCESS 2', () => {
    const action = {
      type: types.GET_PERSONA_SUCCESS,
      persona
    };
    expect(reducer.personas(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "the first role",
          "id": 1,
          "name": "ABC",
        },
      ]
    `);
  });

  test('SET_PERSONA_SUCCESS 1', () => {
    const action = {
      type: types.SET_PERSONA_SUCCESS,
      persona
    };
    const first = reducer.persona(undefined, action);
    const second = reducer.persona(undefined, action);
    expect(first).toMatchInlineSnapshot(`
      Object {
        "author_id": null,
        "color": "",
        "created_at": null,
        "deleted_at": null,
        "description": "the first role",
        "id": 1,
        "is_read_only": false,
        "is_shared": false,
        "name": "ABC",
        "updated_at": null,
      }
    `);
    expect(second).toMatchInlineSnapshot(`
      Object {
        "author_id": null,
        "color": "",
        "created_at": null,
        "deleted_at": null,
        "description": "the first role",
        "id": 1,
        "is_read_only": false,
        "is_shared": false,
        "name": "ABC",
        "updated_at": null,
      }
    `);
    expect(first).toEqual(second);
  });

  test('SET_PERSONA_SUCCESS 2', () => {
    const action = {
      type: types.SET_PERSONA_SUCCESS,
      persona
    };
    expect(reducer.personas(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "the first role",
          "id": 1,
          "name": "ABC",
        },
      ]
    `);
  });

  test('GET_PERSONAS_SUCCESS 1', () => {
    const action = {
      type: types.GET_PERSONAS_SUCCESS,
      personas
    };
    expect(reducer.personas(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "the first role",
          "id": 1,
          "name": "ABC",
        },
        Object {
          "description": "the second role",
          "id": 2,
          "name": "DEF",
        },
        Object {
          "description": "the third role",
          "id": 3,
          "name": "GHI",
        },
      ]
    `);
    expect(reducer.personasById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "the first role",
          "id": 1,
          "name": "ABC",
        },
        "2": Object {
          "description": "the second role",
          "id": 2,
          "name": "DEF",
        },
        "3": Object {
          "description": "the third role",
          "id": 3,
          "name": "GHI",
        },
      }
    `);
  });

  test('GET_PERSONAS_SUCCESS 2', () => {
    const action = {
      type: types.GET_PERSONAS_SUCCESS,
      personas
    };
    expect(reducer.personasById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "the first role",
          "id": 1,
          "name": "ABC",
        },
        "2": Object {
          "description": "the second role",
          "id": 2,
          "name": "DEF",
        },
        "3": Object {
          "description": "the third role",
          "id": 3,
          "name": "GHI",
        },
      }
    `);
  });

  test('GET_PERSONAS_SUCCESS 3', () => {
    const action = {
      type: types.GET_PERSONAS_SUCCESS,
      personas: [
        { id: 1, description: 'the first role' },
        { id: 1, description: 'the first role' }, // this is intentional
        { id: 2, name: 'DEF', description: 'the second role' },
        { id: 3, name: 'GHI', description: 'the third role' }
      ]
    };
    expect(reducer.personas(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "the first role",
          "id": 1,
        },
        Object {
          "description": "the second role",
          "id": 2,
          "name": "DEF",
        },
        Object {
          "description": "the third role",
          "id": 3,
          "name": "GHI",
        },
      ]
    `);
    expect(reducer.personasById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "description": "the first role",
          "id": 1,
        },
        "2": Object {
          "description": "the second role",
          "id": 2,
          "name": "DEF",
        },
        "3": Object {
          "description": "the third role",
          "id": 3,
          "name": "GHI",
        },
      }
    `);
  });
});
