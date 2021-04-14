import assert from 'assert';
import { makeById, state } from '../bootstrap';

import * as reducer from '../../reducers/traces';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};
const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('traces', () => {
  let state;
  let trace;
  let traces;
  let tracesById;

  beforeEach(() => {
    state = [];
    trace = {
      id: 1,
      run_id: 99,
      context: {
        url: 'http://localhost:3000/run/6/slide/0',
        scenario: {
          id: 6,
          lock: null,
          title: 'Audio Prompt',
          users: [
            {
              id: 2,
              email: 'admin@email.com',
              roles: ['owner'],
              is_owner: true,
              username: 'admin',
              is_author: true,
              is_reviewer: false,
              personalname: 'Admin User'
            }
          ],
          author: {
            id: 2,
            email: 'admin@email.com',
            roles: ['participant'],
            is_super: false,
            username: 'admin',
            is_anonymous: false,
            personalname: 'Admin User'
          },
          finish: {
            id: 31,
            title: '',
            is_finish: true,
            components: [
              {
                html: '<h2>Thanks for participating!</h2>',
                type: 'Text'
              }
            ]
          },
          status: 2,
          consent: {
            id: 7,
            prose: ''
          },
          categories: [],
          created_at: '2020-07-24T14:54:34.284Z',
          deleted_at: null,
          updated_at: '2020-07-24T15:14:25.149Z',
          description: ''
        },
        timestamp: 1600695980064
      },
      user_id: null
    };
    traces = [trace];
    tracesById = makeById(traces);
  });

  test('initial state', () => {
    expect(reducer.traces(undefined, {})).toEqual(initialState);
    expect(reducer.traces(undefined, {})).toEqual(initialState);
    expect(reducer.tracesById(undefined, {})).toEqual(initialStateById);
    expect(reducer.tracesById(undefined, {})).toEqual(initialStateById);
  });

  test('default action type, state', () => {
    expect(reducer.traces(undefined, {})).toEqual(initialState);
    expect(reducer.traces(undefined, {})).toEqual(initialState);
    expect(reducer.tracesById(undefined, {})).toEqual(initialStateById);
    expect(reducer.tracesById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_TRACES_SUCCESS 1', () => {
    const action = {
      type: types.GET_TRACES_SUCCESS,
      traces
    };
    expect(reducer.traces(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "context": Object {
            "scenario": Object {
              "author": Object {
                "email": "admin@email.com",
                "id": 2,
                "is_anonymous": false,
                "is_super": false,
                "personalname": "Admin User",
                "roles": Array [
                  "participant",
                ],
                "username": "admin",
              },
              "categories": Array [],
              "consent": Object {
                "id": 7,
                "prose": "",
              },
              "created_at": "2020-07-24T14:54:34.284Z",
              "deleted_at": null,
              "description": "",
              "finish": Object {
                "components": Array [
                  Object {
                    "html": "<h2>Thanks for participating!</h2>",
                    "type": "Text",
                  },
                ],
                "id": 31,
                "is_finish": true,
                "title": "",
              },
              "id": 6,
              "lock": null,
              "status": 2,
              "title": "Audio Prompt",
              "updated_at": "2020-07-24T15:14:25.149Z",
              "users": Array [
                Object {
                  "email": "admin@email.com",
                  "id": 2,
                  "is_author": true,
                  "is_owner": true,
                  "is_reviewer": false,
                  "personalname": "Admin User",
                  "roles": Array [
                    "owner",
                  ],
                  "username": "admin",
                },
              ],
            },
            "timestamp": 1600695980064,
            "url": "http://localhost:3000/run/6/slide/0",
          },
          "id": 1,
          "run_id": 99,
          "user_id": null,
        },
      ]
    `);
    expect(reducer.tracesById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "context": Object {
            "scenario": Object {
              "author": Object {
                "email": "admin@email.com",
                "id": 2,
                "is_anonymous": false,
                "is_super": false,
                "personalname": "Admin User",
                "roles": Array [
                  "participant",
                ],
                "username": "admin",
              },
              "categories": Array [],
              "consent": Object {
                "id": 7,
                "prose": "",
              },
              "created_at": "2020-07-24T14:54:34.284Z",
              "deleted_at": null,
              "description": "",
              "finish": Object {
                "components": Array [
                  Object {
                    "html": "<h2>Thanks for participating!</h2>",
                    "type": "Text",
                  },
                ],
                "id": 31,
                "is_finish": true,
                "title": "",
              },
              "id": 6,
              "lock": null,
              "status": 2,
              "title": "Audio Prompt",
              "updated_at": "2020-07-24T15:14:25.149Z",
              "users": Array [
                Object {
                  "email": "admin@email.com",
                  "id": 2,
                  "is_author": true,
                  "is_owner": true,
                  "is_reviewer": false,
                  "personalname": "Admin User",
                  "roles": Array [
                    "owner",
                  ],
                  "username": "admin",
                },
              ],
            },
            "timestamp": 1600695980064,
            "url": "http://localhost:3000/run/6/slide/0",
          },
          "id": 1,
          "run_id": 99,
          "user_id": null,
        },
      }
    `);
  });

  test('GET_TRACES_SUCCESS 2', () => {
    const action = {
      type: types.GET_TRACES_SUCCESS,
      traces
    };
    expect(reducer.tracesById(state, action)).toMatchInlineSnapshot(`
      Object {
        "1": Object {
          "context": Object {
            "scenario": Object {
              "author": Object {
                "email": "admin@email.com",
                "id": 2,
                "is_anonymous": false,
                "is_super": false,
                "personalname": "Admin User",
                "roles": Array [
                  "participant",
                ],
                "username": "admin",
              },
              "categories": Array [],
              "consent": Object {
                "id": 7,
                "prose": "",
              },
              "created_at": "2020-07-24T14:54:34.284Z",
              "deleted_at": null,
              "description": "",
              "finish": Object {
                "components": Array [
                  Object {
                    "html": "<h2>Thanks for participating!</h2>",
                    "type": "Text",
                  },
                ],
                "id": 31,
                "is_finish": true,
                "title": "",
              },
              "id": 6,
              "lock": null,
              "status": 2,
              "title": "Audio Prompt",
              "updated_at": "2020-07-24T15:14:25.149Z",
              "users": Array [
                Object {
                  "email": "admin@email.com",
                  "id": 2,
                  "is_author": true,
                  "is_owner": true,
                  "is_reviewer": false,
                  "personalname": "Admin User",
                  "roles": Array [
                    "owner",
                  ],
                  "username": "admin",
                },
              ],
            },
            "timestamp": 1600695980064,
            "url": "http://localhost:3000/run/6/slide/0",
          },
          "id": 1,
          "run_id": 99,
          "user_id": null,
        },
      }
    `);
  });

  test('GET_TRACES_SUCCESS 3', () => {
    const action = {
      type: types.GET_TRACES_SUCCESS,
      traces: [
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
    expect(reducer.traces(state, action)).toMatchInlineSnapshot(`
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
    expect(reducer.tracesById(state, action)).toMatchInlineSnapshot(`
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

  test('GET_TRACES_SUCCESS 4', () => {
    const action = {
      type: types.GET_TRACES_SUCCESS,
      traces: [
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
    expect(reducer.traces(state, action)).toMatchInlineSnapshot(`
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
    // This is intentional
    expect(reducer.traces(state, action)).toMatchInlineSnapshot(`
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
    expect(reducer.tracesById(state, action)).toMatchInlineSnapshot(`
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
    // This is intentional
    expect(reducer.tracesById(state, action)).toMatchInlineSnapshot(`
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
