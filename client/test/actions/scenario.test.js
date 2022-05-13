import * as actions from '../../actions/scenario';
import * as types from '../../actions/types';

import {
  createMockConnectedStore,
  createMockStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import assert from 'assert';
import { v4 as uuid } from 'uuid';

jest.mock('../../util/Storage');

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

let mockStore;
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  mockStore = createMockStore({});
  store = createMockConnectedStore({});
  fetch.mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
});

test('COPY_SCENARIO_SUCCESS', async () => {
  const scenario = {
    ...state.scenarios[0]
  };

  fetchImplementation(fetch, 200, { scenario });

  const returnValue = await store.dispatch(actions.copyScenario(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1/copy",
      Object {
        "method": "POST",
      },
    ]
  `);
  expect(returnValue).toEqual(scenario);

  await mockStore.dispatch(actions.copyScenario(1));
  expect(mockStore.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "scenario": Object {
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
        "type": "COPY_SCENARIO_SUCCESS",
      },
    ]
  `);
});

test('COPY_SCENARIO_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.copyScenario(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1/copy",
      Object {
        "method": "POST",
      },
    ]
  `);
  expect(returnValue).toBe(null);

  await mockStore.dispatch(actions.copyScenario(1));
  expect(mockStore.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "error": Object {
          "error": [Error: something unexpected happened on the server],
        },
        "type": "COPY_SCENARIO_ERROR",
      },
    ]
  `);
});

test('DELETE_SCENARIO_SUCCESS', async () => {
  const scenario = {
    ...state.scenarios[0]
  };

  fetchImplementation(fetch, 200, { scenario });

  const returnValue = await store.dispatch(actions.deleteScenario(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1",
      Object {
        "method": "DELETE",
      },
    ]
  `);
  expect(returnValue).toEqual(scenario);

  await mockStore.dispatch(actions.deleteScenario(1));
  expect(mockStore.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "scenario": Object {
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
        "type": "DELETE_SCENARIO_SUCCESS",
      },
    ]
  `);
});

test('DELETE_SCENARIO_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.deleteScenario(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1",
      Object {
        "method": "DELETE",
      },
    ]
  `);
  expect(returnValue).toBe(null);

  await mockStore.dispatch(actions.deleteScenario(1));
  expect(mockStore.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "error": Object {
          "error": [Error: something unexpected happened on the server],
        },
        "type": "DELETE_SCENARIO_ERROR",
      },
    ]
  `);
});

describe('GET_SCENARIO_SUCCESS', () => {
  test('getScenario, options.{}', async () => {
    const scenario = {
      ...state.scenarios[0]
    };

    fetchImplementation(fetch, 200, { scenario });

    const returnValue = await store.dispatch(actions.getScenario(1, {}));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/1",
      ]
    `);
    expect(returnValue).toEqual(scenario);

    await mockStore.dispatch(actions.getScenario(1, {}));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('getScenario, options.lock', async () => {
    const scenario = {
      ...state.scenarios[0]
    };

    fetchImplementation(fetch, 200, { scenario });

    const returnValue = await store.dispatch(
      actions.getScenario(1, { lock: true })
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/1/lock",
      ]
    `);
    expect(returnValue).toEqual(scenario);
  });

  test('getScenario, options.unlock', async () => {
    const scenario = {
      ...state.scenarios[0]
    };

    fetchImplementation(fetch, 200, { scenario });

    const returnValue = await store.dispatch(
      actions.getScenario(1, { unlock: true })
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/1/unlock",
      ]
    `);
    expect(returnValue).toEqual(scenario);
  });

  test('addScenarioUserRole', async () => {
    const scenario = {
      ...state.scenarios[0]
    };
    const addedCount = 1;
    const payload = {
      addedCount,
      scenario
    };

    fetchImplementation(fetch, 200, payload);

    const returnValue = await store.dispatch(
      actions.addScenarioUserRole(1, 2, 3)
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/1/roles/add",
        Object {
          "body": "{\\"scenario_id\\":1,\\"user_id\\":2,\\"roles\\":[3]}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(returnValue).toEqual(payload);
  });

  test('endScenarioUserRole', async () => {
    const scenario = {
      ...state.scenarios[0]
    };
    const endedCount = 1;
    const payload = {
      endedCount,
      scenario
    };

    fetchImplementation(fetch, 200, payload);

    const returnValue = await store.dispatch(
      actions.endScenarioUserRole(1, 2, 3)
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/1/roles/end",
        Object {
          "body": "{\\"scenario_id\\":1,\\"user_id\\":2,\\"roles\\":[3]}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(returnValue).toEqual(payload);
  });
});

describe('GET_SCENARIO_ERROR', () => {
  test('getScenario', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getScenario(1));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/1",
      ]
    `);
    expect(returnValue).toBe(null);
  });

  test('addScenarioUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(
      actions.addScenarioUserRole(1, 2, 3)
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/1/roles/add",
        Object {
          "body": "{\\"scenario_id\\":1,\\"user_id\\":2,\\"roles\\":[3]}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(returnValue).toBe(null);
  });

  test('endScenarioUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(
      actions.endScenarioUserRole(1, 2, 3)
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/1/roles/end",
        Object {
          "body": "{\\"scenario_id\\":1,\\"user_id\\":2,\\"roles\\":[3]}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    expect(returnValue).toBe(null);
  });
});

test('UNLOCK_SCENARIO_SUCCESS', async () => {
  const scenario = {
    ...state.scenarios[0]
  };

  fetchImplementation(fetch, 200, { scenario });

  const returnValue = await store.dispatch(actions.endScenarioLock(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1/unlock",
    ]
  `);
  expect(returnValue).toEqual(scenario);
});

test('UNLOCK_SCENARIO_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.endScenarioLock(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1/unlock",
    ]
  `);
  expect(returnValue).toBe(null);
});

describe('GET_SCENARIOS_SUCCESS', () => {
  let scenarios = [];

  beforeEach(() => {
    scenarios = Array.from({ length: 90 }, (_, id) => {
      return {
        ...original.scenarios[0],
        id
      };
    });

    store = createMockConnectedStore({
      scenarios: [],
      session: {
        isLoggedIn: false
      }
    });
  });

  describe('getScenarios', () => {
    test('default', async () => {
      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(actions.getScenarios());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(scenarios));
      expect(store.getState().scenarios).toEqual(scenarios);
      expect(returnValue).toEqual(scenarios);
    });

    test('(state.session.isLoggedIn && count === state.scenarios.length) === false', async () => {
      store = createMockConnectedStore({
        scenarios,
        session: {
          isLoggedIn: false
        }
      });

      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(actions.getScenarios());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(scenarios));
      expect(store.getState().scenarios).toEqual(scenarios);
      expect(returnValue).toEqual(scenarios);
    });

    test('(state.session.isLoggedIn && count === state.scenarios.length) === true', async () => {
      store = createMockConnectedStore({
        scenarios,
        session: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      const returnValue = await store.dispatch(actions.getScenarios());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);

      expect(fetch.mock.calls.length).toEqual(1);
      expect(store.getState().scenariosById).toEqual(makeById(scenarios));
      expect(store.getState().scenarios).toEqual(scenarios);
      expect(returnValue).toEqual(scenarios);
    });
  });

  describe('getScenariosIncrementally', () => {
    test('(state.session.isLoggedIn && count === state.scenarios.length) === false', async () => {
      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(
        actions.getScenariosIncrementally()
      );
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/slice/DESC/0/30",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(scenarios));
      expect(store.getState().scenarios).toEqual(scenarios);
      expect(returnValue).toEqual(scenarios);
    });

    test('(state.session.isLoggedIn && count === state.scenarios.length) === true', async () => {
      store = createMockConnectedStore({
        scenarios,
        session: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      const returnValue = await store.dispatch(
        actions.getScenariosIncrementally()
      );
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);

      expect(fetch.mock.calls.length).toEqual(1);
      expect(store.getState().scenariosById).toEqual(makeById(scenarios));
      expect(store.getState().scenarios).toEqual(scenarios);
      expect(returnValue).toEqual(scenarios);
    });

    test('(state.session.isLoggedIn) === false', async () => {
      store = createMockConnectedStore({
        scenarios,
        session: {
          isLoggedIn: false
        }
      });

      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(
        actions.getScenariosIncrementally()
      );
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/slice/DESC/0/30",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(scenarios));
      expect(store.getState().scenarios).toEqual(scenarios);
      expect(returnValue).toEqual(scenarios);
    });

    test('getScenariosIncrementallyFirst', async () => {
      store = createMockConnectedStore({
        scenarios,
        session: {
          isLoggedIn: false
        }
      });

      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(
        actions.getScenariosIncrementally()
      );
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/slice/DESC/0/30",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(scenarios));
      expect(store.getState().scenarios).toEqual(scenarios);
      expect(returnValue).toEqual(scenarios);
    });
  });

  describe('getScenariosSlice', () => {
    test('default, cache is empty', async () => {
      store = createMockConnectedStore({
        scenarios: [],
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;
      const expected = scenarios.slice(0, 30);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1
            ? { count: 90 }
            : { scenarios: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      // Requires calling getScenariosCount first
      await store.dispatch(actions.getScenariosCount({ refresh: true }));
      const returnValue = await store.dispatch(actions.getScenariosSlice());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/slice/DESC/0/30",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(expected));
      expect(store.getState().scenarios).toEqual(expected);
      expect(returnValue).toEqual(expected);
    });

    test('scenarios is undefined', async () => {
      store = createMockConnectedStore({
        scenarios: [],
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1
            ? { count: 90 }
            : { scenarios: undefined };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      await store.dispatch(actions.getScenariosCount({ refresh: true }));
      const returnValue = await store.dispatch(actions.getScenariosSlice());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/slice/DESC/0/30",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById([]));
      expect(store.getState().scenarios).toEqual([]);
      expect(returnValue).toEqual([]);
    });
    test('default, cache has entries, not full', async () => {
      store = createMockConnectedStore({
        scenarios: scenarios.slice(0, 30),
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;
      const expected = scenarios.slice(0, 30);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1
            ? { count: 90 }
            : { scenarios: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      await store.dispatch(actions.getScenariosCount({ refresh: true }));
      const returnValue = await store.dispatch(actions.getScenariosSlice());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/slice/DESC/0/30",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(expected));
      expect(store.getState().scenarios).toEqual(expected);
      expect(returnValue).toEqual(expected);
    });

    test('ASC, cache is empty', async () => {
      store = createMockConnectedStore({
        scenarios: [],
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;
      const expected = scenarios.slice(0, 30);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1
            ? { count: 90 }
            : { scenarios: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      await store.dispatch(actions.getScenariosCount({ refresh: true }));
      const returnValue = await store.dispatch(
        actions.getScenariosSlice('ASC')
      );
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/slice/ASC/0/30",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(expected));
      expect(store.getState().scenarios).toEqual(expected);
      expect(returnValue).toEqual(expected);
    });

    test('ASC, cache has entries, not full', async () => {
      store = createMockConnectedStore({
        scenarios: scenarios.slice(0, 30),
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;
      const expected = scenarios.slice(0, 30);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1
            ? { count: 90 }
            : { scenarios: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      await store.dispatch(actions.getScenariosCount({ refresh: true }));
      const returnValue = await store.dispatch(
        actions.getScenariosSlice('ASC')
      );
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/slice/ASC/0/30",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(expected));
      expect(store.getState().scenarios).toEqual(expected);
      expect(returnValue).toEqual(expected);
    });

    test('(state.session.isLoggedIn && count === state.scenarios.length) === true', async () => {
      store = createMockConnectedStore({
        scenarios,
        session: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      await store.dispatch(actions.getScenariosCount({ refresh: true }));
      const returnValue = await store.dispatch(actions.getScenariosSlice());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);

      expect(fetch.mock.calls.length).toEqual(1);
      expect(returnValue).toEqual(scenarios);
    });
  });

  describe('getRecentScenarios', () => {
    test('isLoggedIn == true', async () => {
      store = createMockConnectedStore({
        scenarios,
        session: {
          isLoggedIn: true
        }
      });
      const recentScenarios = scenarios.slice(-4);
      
      fetch.mockImplementation(async () => {
        return {
          status: 200,
          async json() {
            return { recentScenarios };
          }
        };
      });

      const returnValue = await store.dispatch(actions.getRecentScenarios());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/recent/updated_at/4",
        ]
      `);

      expect(fetch.mock.calls.length).toEqual(1);
      expect(returnValue).toEqual(recentScenarios);
    });
  });

  describe('getScenariosByStatus', () => {
    test('default', async () => {
      store = createMockConnectedStore({
        scenarios,
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1 ? { count: 90 } : { scenarios };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      const returnValue = await store.dispatch(actions.getScenariosByStatus(1));
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/status/1",
        ]
      `);

      expect(store.getState().scenariosById).toEqual(makeById(scenarios));
      expect(store.getState().scenarios).toEqual(scenarios);
      expect(returnValue).toEqual(scenarios);
    });

    test('(state.session.isLoggedIn && count === state.scenarios.length) === true', async () => {
      scenarios = Array.from({ length: 90 }, (_, id) => {
        const status = id % 3 === 0 ? 3 : id % 2 === 0 ? 2 : 1;

        return {
          ...original.scenarios[0],
          id,
          status
        };
      });

      store = createMockConnectedStore({
        scenarios,
        session: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      const expected = scenarios.filter(scenario => scenario.status === 1);
      const returnValue = await store.dispatch(actions.getScenariosByStatus(1));
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/scenarios/count",
        ]
      `);

      expect(fetch.mock.calls.length).toEqual(1);
      expect(returnValue).toEqual(expected);
    });
  });

  describe('getScenariosIncrementallyRequest', () => {
    test('scenarios', async () => {
      fetchImplementation(fetch, 200, { scenarios });
      await expect(
        actions.getScenariosIncrementallyRequest('DESC', 0, 10, store.dispatch)
      ).resolves.toMatchObject(scenarios);
    });

    test('scenarios is empty', async () => {
      fetchImplementation(fetch, 200, { scenarios: [] });
      await expect(
        actions.getScenariosIncrementallyRequest('DESC', 0, 10, store.dispatch)
      ).resolves.toMatchObject([]);
    });

    test('scenarios is undefined', async () => {
      fetchImplementation(fetch, 200, { scenarios: undefined });
      await expect(
        actions.getScenariosIncrementallyRequest('DESC', 0, 10, store.dispatch)
      ).resolves.toMatchObject([]);
    });
  });

  describe('getScenariosIncrementallyNext', () => {
    let updater = jest.fn();

    test('scenarios', async () => {
      fetchImplementation(fetch, 200, { scenarios });
      await expect(
        actions.getScenariosIncrementallyNext(
          'DESC',
          0,
          10,
          store.dispatch,
          updater
        )
      ).resolves.toMatchObject(scenarios);

      expect(updater).toHaveBeenCalledTimes(1);
    });

    test('scenarios is empty', async () => {
      fetchImplementation(fetch, 200, { scenarios: [] });
      await expect(
        actions.getScenariosIncrementallyNext(
          'DESC',
          0,
          10,
          store.dispatch,
          updater
        )
      ).resolves.toMatchObject([]);
      expect(updater).toHaveBeenCalledTimes(1);
    });

    test('scenarios is undefined', async () => {
      fetchImplementation(fetch, 200, { scenarios: undefined });
      await expect(
        actions.getScenariosIncrementallyNext(
          'DESC',
          0,
          10,
          store.dispatch,
          updater
        )
      ).resolves.toMatchObject([]);
      expect(updater).toHaveBeenCalledTimes(1);
    });

    test('no updater', async () => {
      fetchImplementation(fetch, 200, { scenarios: undefined });
      await expect(
        actions.getScenariosIncrementallyNext('DESC', 0, 10, store.dispatch)
      ).resolves.toMatchObject([]);
      expect(updater).toHaveBeenCalledTimes(0);
    });
  });

  describe('getScenariosIncrementallyFirst', () => {
    let updater = jest.fn();

    test('scenarios', async () => {
      let trimmed = scenarios.slice(0, 10);
      fetchImplementation(fetch, 200, { scenarios: trimmed });
      await expect(
        actions.getScenariosIncrementallyFirst(
          'DESC',
          0,
          10,
          store.dispatch,
          updater
        )
      ).resolves.toMatchObject(trimmed);

      expect(updater).toHaveBeenCalledTimes(0);
    });

    test('scenarios is empty', async () => {
      fetchImplementation(fetch, 200, { scenarios: [] });
      await expect(
        actions.getScenariosIncrementallyFirst(
          'DESC',
          0,
          10,
          store.dispatch,
          updater
        )
      ).resolves.toMatchObject([]);
      expect(updater).toHaveBeenCalledTimes(0);
    });

    test('scenarios is undefined', async () => {
      fetchImplementation(fetch, 200, { scenarios: undefined });
      await expect(
        actions.getScenariosIncrementallyFirst(
          'DESC',
          0,
          10,
          store.dispatch,
          updater
        )
      ).resolves.toMatchObject([]);
      expect(updater).toHaveBeenCalledTimes(0);
    });

    test('no updater', async () => {
      fetchImplementation(fetch, 200, { scenarios: undefined });
      await expect(
        actions.getScenariosIncrementallyFirst('DESC', 0, 10, store.dispatch)
      ).resolves.toMatchObject([]);
      expect(updater).toHaveBeenCalledTimes(0);
    });
  });
});

describe('GET_SCENARIOS_ERROR', () => {
  let scenarios = [];

  beforeEach(() => {
    scenarios = Array.from({ length: 90 }, (_, id) => {
      return {
        ...original.scenarios[0],
        id
      };
    });

    store = createMockConnectedStore({
      scenarios: [],
      session: {
        isLoggedIn: false
      }
    });
  });

  test('getScenarios', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getScenarios());
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/count",
      ]
    `);
    expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios",
      ]
    `);
    expect(returnValue).toBe(null);
  });

  test('getScenariosByStatus', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getScenariosByStatus(1));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/count",
      ]
    `);
    expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/status/1",
      ]
    `);
    expect(returnValue).toBe(null);
  });

  test('getScenariosSlice', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getScenariosSlice());
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/count",
      ]
    `);
    expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        "/api/scenarios/slice/DESC/0/30",
      ]
    `);
    expect(returnValue).toBe(null);
  });

  test('getScenariosIncrementallyRequest', async () => {
    fetchImplementation(fetch, 200, { error });
    await expect(
      actions.getScenariosIncrementallyRequest()
    ).rejects.toMatchObject({ error });
  });
});

test('GET_SCENARIOS_COUNT_SUCCESS', async () => {
  const count = '1'; // The action expects to receive a string.

  fetchImplementation(fetch, 200, { count });

  const returnValue = await store.dispatch(
    actions.getScenariosCount({ refresh: true })
  );
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/count",
    ]
  `);

  expect(returnValue).toEqual(Number(count));
});

test('GET_SCENARIOS_COUNT_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(
    actions.getScenariosCount({ refresh: true })
  );
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/count",
    ]
  `);

  expect(returnValue).toBe(null);
});

test('GET_SLIDES_SUCCESS', async () => {
  const slides = state.scenario.slides.slice();

  fetchImplementation(fetch, 200, { slides });

  const returnValue = await store.dispatch(actions.getSlides(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1/slides",
    ]
  `);
  expect(returnValue).toEqual(slides);
});

test('GET_SLIDES_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getSlides(1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1/slides",
    ]
  `);
  expect(returnValue).toBe(null);
});

test('DELETE_SLIDE_SUCCESS', async () => {
  const slides = state.scenario.slides.slice();

  fetchImplementation(fetch, 200, { slides });

  const returnValue = await store.dispatch(actions.deleteSlide(42, 1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/42/slides/1",
      Object {
        "method": "DELETE",
      },
    ]
  `);
  expect(returnValue).toEqual(slides);
});

test('DELETE_SLIDE_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.deleteSlide(42, 1));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/42/slides/1",
      Object {
        "method": "DELETE",
      },
    ]
  `);
  expect(returnValue).toBe(null);
});

// DEPRECATED SYNC ACTIONS THAT ARE STILL USED
test('SET_SCENARIO', async () => {
  fetchImplementation(fetch, 200, { error });

  // Default, empty
  const action1 = await actions.setScenario(null);
  const action2 = await actions.setScenario(action1.scenario);
  const action3 = await actions.setScenario(action2.scenario);

  expect(action1).toEqual(action2);
  expect(action2).toEqual(action3);
});

test('SET_SCENARIOS', async () => {
  fetchImplementation(fetch, 200, { error });

  // Default, empty
  const action1 = await actions.setScenarios([]);
  const action2 = await actions.setScenarios(action1.scenarios);
  const action3 = await actions.setScenarios(action2.scenarios);

  expect(action1).toEqual(action2);
  expect(action2).toEqual(action3);
});

test('SET_SLIDES', async () => {
  fetchImplementation(fetch, 200, { error });

  // Default, empty
  const action1 = await actions.setSlides([]);
  const action2 = await actions.setSlides(action1.slides);
  const action3 = await actions.setSlides(action2.slides);

  expect(action1).toEqual(action2);
  expect(action2).toEqual(action3);
});

test('GET_SCENARIO_PROMPT_COMPONENTS_SUCCESS', async () => {
  const slides = state.scenario.slides.slice();
  const components = slides[0].components.slice();

  fetchImplementation(fetch, 200, { components });

  const returnValue = await store.dispatch(
    actions.getScenarioPromptComponents(1)
  );
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1/slides/prompt-components",
    ]
  `);
  expect(returnValue).toEqual(components);
});

test('GET_SCENARIO_PROMPT_COMPONENTS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(
    actions.getScenarioPromptComponents(1)
  );
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/scenarios/1/slides/prompt-components",
    ]
  `);
  expect(returnValue).toBe(null);
});
