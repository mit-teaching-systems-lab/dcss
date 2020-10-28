import assert from 'assert';
import { state } from '../bootstrap';

import * as reducer from '../../reducers/scenarios';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('scenarios', () => {
  let state;
  let scenario;
  let scenarios;
  let scenariosById;

  beforeEach(() => {
    state = {
      id: Infinity,
      title: 'The Wrong One'
    };

    scenario = {
      ...original.scenario
    };

    scenarios = [...original.scenarios];

    scenariosById = {
      ...original.scenariosById
    };
  });

  test('initial state', () => {
    expect(reducer.scenarios(undefined, {})).toEqual(initialState);
    expect(reducer.scenarios(undefined, {})).toEqual(initialState);
    expect(reducer.scenariosById(undefined, {})).toEqual(initialStateById);
    expect(reducer.scenariosById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_SCENARIOS_SUCCESS', () => {
    const action = {
      type: types.GET_SCENARIOS_SUCCESS,
      scenarios
    };
    expect(reducer.scenarios(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "author": Object {
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
            "username": "super",
          },
          "categories": Array [],
          "consent": Object {
            "id": 57,
            "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
          },
          "created_at": "2020-02-31T17:50:28.029Z",
          "deleted_at": null,
          "description": "A scenario about \\"Multiplayer Scenario\\"",
          "finish": Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          "id": 42,
          "lock": Object {
            "created_at": "2020-01-01T23:54:19.934Z",
            "ended_at": null,
            "scenario_id": 42,
            "user_id": 999,
          },
          "status": 1,
          "title": "Multiplayer Scenario",
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_author": true,
              "is_reviewer": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "super",
              ],
              "username": "super",
            },
          ],
        },
      ]
    `);
    expect(reducer.scenarios(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "author": Object {
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
            "username": "super",
          },
          "categories": Array [],
          "consent": Object {
            "id": 57,
            "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
          },
          "created_at": "2020-02-31T17:50:28.029Z",
          "deleted_at": null,
          "description": "A scenario about \\"Multiplayer Scenario\\"",
          "finish": Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          "id": 42,
          "lock": Object {
            "created_at": "2020-01-01T23:54:19.934Z",
            "ended_at": null,
            "scenario_id": 42,
            "user_id": 999,
          },
          "status": 1,
          "title": "Multiplayer Scenario",
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_author": true,
              "is_reviewer": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "super",
              ],
              "username": "super",
            },
          ],
        },
      ]
    `);
  });

  test('SET_SCENARIOS', () => {
    const action = {
      type: types.SET_SCENARIOS,
      scenarios
    };
    expect(reducer.scenarios(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "author": Object {
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
            "username": "super",
          },
          "categories": Array [],
          "consent": Object {
            "id": 57,
            "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
          },
          "created_at": "2020-02-31T17:50:28.029Z",
          "deleted_at": null,
          "description": "A scenario about \\"Multiplayer Scenario\\"",
          "finish": Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          "id": 42,
          "lock": Object {
            "created_at": "2020-01-01T23:54:19.934Z",
            "ended_at": null,
            "scenario_id": 42,
            "user_id": 999,
          },
          "status": 1,
          "title": "Multiplayer Scenario",
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_author": true,
              "is_reviewer": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "super",
              ],
              "username": "super",
            },
          ],
        },
      ]
    `);
    expect(reducer.scenarios(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "author": Object {
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
            "username": "super",
          },
          "categories": Array [],
          "consent": Object {
            "id": 57,
            "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
          },
          "created_at": "2020-02-31T17:50:28.029Z",
          "deleted_at": null,
          "description": "A scenario about \\"Multiplayer Scenario\\"",
          "finish": Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          "id": 42,
          "lock": Object {
            "created_at": "2020-01-01T23:54:19.934Z",
            "ended_at": null,
            "scenario_id": 42,
            "user_id": 999,
          },
          "status": 1,
          "title": "Multiplayer Scenario",
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_author": true,
              "is_reviewer": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "super",
              ],
              "username": "super",
            },
          ],
        },
      ]
    `);
  });

  test('GET_SCENARIOS_SUCCESS', () => {
    const action = {
      type: types.GET_SCENARIOS_SUCCESS,
      scenarios
    };
    expect(reducer.scenariosById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "42": Object {
          "author": Object {
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
            "username": "super",
          },
          "categories": Array [],
          "consent": Object {
            "id": 57,
            "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
          },
          "created_at": "2020-02-31T17:50:28.029Z",
          "deleted_at": null,
          "description": "A scenario about \\"Multiplayer Scenario\\"",
          "finish": Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          "id": 42,
          "lock": Object {
            "created_at": "2020-01-01T23:54:19.934Z",
            "ended_at": null,
            "scenario_id": 42,
            "user_id": 999,
          },
          "status": 1,
          "title": "Multiplayer Scenario",
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_author": true,
              "is_reviewer": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "super",
              ],
              "username": "super",
            },
          ],
        },
      }
    `);
    expect(reducer.scenariosById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "42": Object {
          "author": Object {
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
            "username": "super",
          },
          "categories": Array [],
          "consent": Object {
            "id": 57,
            "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
          },
          "created_at": "2020-02-31T17:50:28.029Z",
          "deleted_at": null,
          "description": "A scenario about \\"Multiplayer Scenario\\"",
          "finish": Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          "id": 42,
          "lock": Object {
            "created_at": "2020-01-01T23:54:19.934Z",
            "ended_at": null,
            "scenario_id": 42,
            "user_id": 999,
          },
          "status": 1,
          "title": "Multiplayer Scenario",
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_author": true,
              "is_reviewer": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "super",
              ],
              "username": "super",
            },
          ],
        },
      }
    `);
  });

  test('SET_SCENARIOS', () => {
    const action = {
      type: types.SET_SCENARIOS,
      scenarios
    };
    expect(reducer.scenariosById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "42": Object {
          "author": Object {
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
            "username": "super",
          },
          "categories": Array [],
          "consent": Object {
            "id": 57,
            "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
          },
          "created_at": "2020-02-31T17:50:28.029Z",
          "deleted_at": null,
          "description": "A scenario about \\"Multiplayer Scenario\\"",
          "finish": Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          "id": 42,
          "lock": Object {
            "created_at": "2020-01-01T23:54:19.934Z",
            "ended_at": null,
            "scenario_id": 42,
            "user_id": 999,
          },
          "status": 1,
          "title": "Multiplayer Scenario",
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_author": true,
              "is_reviewer": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "super",
              ],
              "username": "super",
            },
          ],
        },
      }
    `);
    expect(reducer.scenariosById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "42": Object {
          "author": Object {
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
            "username": "super",
          },
          "categories": Array [],
          "consent": Object {
            "id": 57,
            "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
          },
          "created_at": "2020-02-31T17:50:28.029Z",
          "deleted_at": null,
          "description": "A scenario about \\"Multiplayer Scenario\\"",
          "finish": Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          "id": 42,
          "lock": Object {
            "created_at": "2020-01-01T23:54:19.934Z",
            "ended_at": null,
            "scenario_id": 42,
            "user_id": 999,
          },
          "status": 1,
          "title": "Multiplayer Scenario",
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_author": true,
              "is_reviewer": false,
              "is_super": true,
              "personalname": "Super User",
              "roles": Array [
                "super",
              ],
              "username": "super",
            },
          ],
        },
      }
    `);
  });

  test('DELETE_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.DELETE_SCENARIO_SUCCESS,
      scenarios
    };
    expect(reducer.scenarios(undefined, action)).toMatchInlineSnapshot(
      `Array []`
    );
    expect(reducer.scenarios(undefined, action)).toMatchInlineSnapshot(
      `Array []`
    );
  });

  test('UNLOCK_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.UNLOCK_SCENARIO_SUCCESS,
      scenarios
    };
    expect(reducer.scenarios(undefined, action)).toMatchInlineSnapshot(
      `Array []`
    );
    expect(reducer.scenarios(undefined, action)).toMatchInlineSnapshot(
      `Array []`
    );
  });

  test('DELETE_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.DELETE_SCENARIO_SUCCESS,
      scenarios
    };
    expect(reducer.scenariosById(undefined, action)).toMatchInlineSnapshot(
      `Object {}`
    );
    expect(reducer.scenariosById(undefined, action)).toMatchInlineSnapshot(
      `Object {}`
    );
  });

  test('UNLOCK_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.UNLOCK_SCENARIO_SUCCESS,
      scenarios
    };
    expect(reducer.scenariosById(undefined, action)).toMatchInlineSnapshot(
      `Object {}`
    );
    expect(reducer.scenariosById(undefined, action)).toMatchInlineSnapshot(
      `Object {}`
    );
  });
});
