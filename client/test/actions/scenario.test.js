import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/scenario';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
  Storage.has = jest.fn();
  Storage.delete = jest.fn();
});

afterAll(() => {
  fetch.mockRestore();
  Storage.has.mockRestore();
  Storage.delete.mockRestore();
});

beforeEach(() => {
  store = createStore({});
  fetch.mockImplementation(() => {});
  Storage.has.mockImplementation(() => true);
  Storage.delete.mockImplementation(() => {});
});

afterEach(() => {
  fetch.mockReset();
  Storage.has.mockReset();
  Storage.delete.mockReset();
});

test('COPY_SCENARIO_SUCCESS', async () => {
  const scenario = {
    ...state.scenarios[0]
  };

  fetchImplementation(fetch, 200, { scenario });

  const returnValue = await store.dispatch(actions.copyScenario(1));
  assert.deepEqual(fetch.mock.calls[0], [
    '/api/scenarios/1/copy',
    { method: 'POST' }
  ]);
  assert.deepEqual(returnValue, scenario);
});

test('COPY_SCENARIO_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.copyScenario(1));
  assert.deepEqual(fetch.mock.calls[0], [
    '/api/scenarios/1/copy',
    { method: 'POST' }
  ]);
  assert.equal(returnValue, null);
});

test('DELETE_SCENARIO_SUCCESS', async () => {
  const scenario = {
    ...state.scenarios[0]
  };

  fetchImplementation(fetch, 200, { scenario });

  const returnValue = await store.dispatch(actions.deleteScenario(1));
  assert.deepEqual(fetch.mock.calls[0], [
    '/api/scenarios/1',
    { method: 'DELETE' }
  ]);
  assert.deepEqual(returnValue, scenario);
});

test('DELETE_SCENARIO_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.deleteScenario(1));
  assert.deepEqual(fetch.mock.calls[0], [
    '/api/scenarios/1',
    { method: 'DELETE' }
  ]);
  assert.equal(returnValue, null);
});

describe('GET_SCENARIO_SUCCESS', () => {
  test('getScenario, options.{}', async () => {
    const scenario = {
      ...state.scenarios[0]
    };

    fetchImplementation(fetch, 200, { scenario });

    const returnValue = await store.dispatch(actions.getScenario(1, {}));
    assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/1']);
    assert.deepEqual(returnValue, scenario);
  });

  test('getScenario, options.lock', async () => {
    const scenario = {
      ...state.scenarios[0]
    };

    fetchImplementation(fetch, 200, { scenario });

    const returnValue = await store.dispatch(
      actions.getScenario(1, { lock: true })
    );
    assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/1/lock']);
    assert.deepEqual(returnValue, scenario);
  });

  test('getScenario, options.unlock', async () => {
    const scenario = {
      ...state.scenarios[0]
    };

    fetchImplementation(fetch, 200, { scenario });

    const returnValue = await store.dispatch(
      actions.getScenario(1, { unlock: true })
    );
    assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/1/unlock']);
    assert.deepEqual(returnValue, scenario);
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
    assert.deepEqual(fetch.mock.calls[0], [
      '/api/scenarios/1/roles/add',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"scenario_id":1,"user_id":2,"roles":[3]}'
      }
    ]);
    assert.deepEqual(returnValue, payload);
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
    assert.deepEqual(fetch.mock.calls[0], [
      '/api/scenarios/1/roles/end',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"scenario_id":1,"user_id":2,"roles":[3]}'
      }
    ]);
    assert.deepEqual(returnValue, payload);
  });
});

describe('GET_SCENARIO_ERROR', () => {
  test('getScenario', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getScenario(1));
    assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/1']);
    assert.equal(returnValue, null);
  });

  test('addScenarioUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(
      actions.addScenarioUserRole(1, 2, 3)
    );
    assert.deepEqual(fetch.mock.calls[0], [
      '/api/scenarios/1/roles/add',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"scenario_id":1,"user_id":2,"roles":[3]}'
      }
    ]);
    assert.equal(returnValue, null);
  });

  test('endScenarioUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(
      actions.endScenarioUserRole(1, 2, 3)
    );
    assert.deepEqual(fetch.mock.calls[0], [
      '/api/scenarios/1/roles/end',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"scenario_id":1,"user_id":2,"roles":[3]}'
      }
    ]);
    assert.equal(returnValue, null);
  });
});

test('UNLOCK_SCENARIO_SUCCESS', async () => {
  const scenario = {
    ...state.scenarios[0]
  };

  fetchImplementation(fetch, 200, { scenario });

  const returnValue = await store.dispatch(actions.endScenarioLock(1));
  assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/1/unlock']);
  assert.deepEqual(returnValue, scenario);
});

test('UNLOCK_SCENARIO_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.endScenarioLock(1));
  assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/1/unlock']);
  assert.equal(returnValue, null);
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

    store = createStore({
      scenarios: [],
      login: {
        isLoggedIn: false
      }
    });
  });

  describe('getScenarios', () => {
    test('default', async () => {
      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(actions.getScenarios());
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios']);
      assert.deepEqual(store.getState().scenariosById, makeById(scenarios));
      assert.deepEqual(store.getState().scenarios, scenarios);
      assert.deepEqual(returnValue, scenarios);
    });

    test('(state.login.isLoggedIn && count === state.scenarios.length) === false', async () => {
      store = createStore({
        scenarios,
        login: {
          isLoggedIn: false
        }
      });

      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(actions.getScenarios());
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios']);
      assert.deepEqual(store.getState().scenariosById, makeById(scenarios));
      assert.deepEqual(store.getState().scenarios, scenarios);
      assert.deepEqual(returnValue, scenarios);
    });

    test('(state.login.isLoggedIn && count === state.scenarios.length) === true', async () => {
      store = createStore({
        scenarios,
        login: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      const returnValue = await store.dispatch(actions.getScenarios());
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls.length, 1);
      assert.deepEqual(store.getState().scenariosById, makeById(scenarios));
      assert.deepEqual(store.getState().scenarios, scenarios);
      assert.deepEqual(returnValue, scenarios);
    });
  });

  describe('getScenariosIncrementally', () => {
    test('(state.login.isLoggedIn && count === state.scenarios.length) === false', async () => {
      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(
        actions.getScenariosIncrementally()
      );
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/DESC/0/30']);
      assert.deepEqual(store.getState().scenariosById, makeById(scenarios));
      assert.deepEqual(store.getState().scenarios, scenarios);
      assert.deepEqual(returnValue, scenarios);
    });

    test('(state.login.isLoggedIn && count === state.scenarios.length) === true', async () => {
      store = createStore({
        scenarios,
        login: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      const returnValue = await store.dispatch(
        actions.getScenariosIncrementally()
      );
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls.length, 1);
      assert.deepEqual(store.getState().scenariosById, makeById(scenarios));
      assert.deepEqual(store.getState().scenarios, scenarios);
      assert.deepEqual(returnValue, scenarios);
    });

    test('(state.login.isLoggedIn) === false', async () => {
      store = createStore({
        scenarios,
        login: {
          isLoggedIn: false
        }
      });

      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(
        actions.getScenariosIncrementally()
      );
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/DESC/0/30']);
      assert.deepEqual(store.getState().scenariosById, makeById(scenarios));
      assert.deepEqual(store.getState().scenarios, scenarios);
      assert.deepEqual(returnValue, scenarios);
    });

    test('getScenariosIncrementallyFirst', async () => {
      store = createStore({
        scenarios,
        login: {
          isLoggedIn: false
        }
      });

      fetchImplementation(fetch, 200, { scenarios });

      const returnValue = await store.dispatch(
        actions.getScenariosIncrementally()
      );
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/DESC/0/30']);
      assert.deepEqual(store.getState().scenariosById, makeById(scenarios));
      assert.deepEqual(store.getState().scenarios, scenarios);
      assert.deepEqual(returnValue, scenarios);
    });
  });

  describe('getScenariosSlice', () => {
    test('default, cache is empty', async () => {
      store = createStore({
        scenarios: [],
        login: {
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

      const returnValue = await store.dispatch(actions.getScenariosSlice());
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/slice/DESC/0/30']);
      assert.deepEqual(store.getState().scenariosById, makeById(expected));
      assert.deepEqual(store.getState().scenarios, expected);
      assert.deepEqual(returnValue, expected);
    });

    test('default, cache has entries, not full', async () => {
      store = createStore({
        scenarios: scenarios.slice(0, 30),
        login: {
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

      const returnValue = await store.dispatch(actions.getScenariosSlice());
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/slice/DESC/0/30']);
      assert.deepEqual(store.getState().scenariosById, makeById(expected));
      assert.deepEqual(store.getState().scenarios, expected);
      assert.deepEqual(returnValue, expected);
    });

    test('ASC, cache is empty', async () => {
      store = createStore({
        scenarios: [],
        login: {
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

      const returnValue = await store.dispatch(
        actions.getScenariosSlice('ASC')
      );
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/slice/ASC/0/30']);
      assert.deepEqual(store.getState().scenariosById, makeById(expected));
      assert.deepEqual(store.getState().scenarios, expected);
      assert.deepEqual(returnValue, expected);
    });

    test('ASC, cache has entries, not full', async () => {
      store = createStore({
        scenarios: scenarios.slice(0, 30),
        login: {
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

      const returnValue = await store.dispatch(
        actions.getScenariosSlice('ASC')
      );
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/slice/ASC/0/30']);
      assert.deepEqual(store.getState().scenariosById, makeById(expected));
      assert.deepEqual(store.getState().scenarios, expected);
      assert.deepEqual(returnValue, expected);
    });

    test('(state.login.isLoggedIn && count === state.scenarios.length) === true', async () => {
      store = createStore({
        scenarios,
        login: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      const returnValue = await store.dispatch(actions.getScenariosSlice());
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls.length, 1);
      assert.deepEqual(returnValue, scenarios);
    });
  });

  describe('getScenariosByStatus', () => {
    test('default', async () => {
      store = createStore({
        scenarios,
        login: {
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
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/status/1']);
      assert.deepEqual(store.getState().scenariosById, makeById(scenarios));
      assert.deepEqual(store.getState().scenarios, scenarios);
      assert.deepEqual(returnValue, scenarios);
    });

    test('(state.login.isLoggedIn && count === state.scenarios.length) === true', async () => {
      scenarios = Array.from({ length: 90 }, (_, id) => {
        const status = id % 3 === 0 ? 3 : id % 2 === 0 ? 2 : 1;

        return {
          ...original.scenarios[0],
          id,
          status
        };
      });

      store = createStore({
        scenarios,
        login: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      const expected = scenarios.filter(scenario => scenario.status === 1);
      const returnValue = await store.dispatch(actions.getScenariosByStatus(1));
      assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
      assert.deepEqual(fetch.mock.calls.length, 1);
      assert.deepEqual(returnValue, expected);
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

    store = createStore({
      scenarios: [],
      login: {
        isLoggedIn: false
      }
    });
  });

  test('getScenarios', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getScenarios());
    assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
    assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios']);
    assert.equal(returnValue, null);
  });

  test('getScenariosByStatus', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getScenariosByStatus(1));
    assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
    assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/status/1']);
    assert.equal(returnValue, null);
  });

  test('getScenariosSlice', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getScenariosSlice());
    assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
    assert.deepEqual(fetch.mock.calls[1], ['/api/scenarios/slice/DESC/0/30']);
    assert.equal(returnValue, null);
  });
});

test('GET_SCENARIOS_COUNT_SUCCESS', async () => {
  const count = '1'; // The action expects to receive a string.

  fetchImplementation(fetch, 200, { count });

  const returnValue = await store.dispatch(actions.getScenariosCount());
  assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
  assert.deepEqual(returnValue, Number(count));
});

test('GET_SCENARIOS_COUNT_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getScenariosCount());
  assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/count']);
  assert.equal(returnValue, null);
});

test('GET_SLIDES_SUCCESS', async () => {
  const slides = state.scenario.slides.slice();

  fetchImplementation(fetch, 200, { slides });

  const returnValue = await store.dispatch(actions.getSlides(1));
  assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/1/slides']);
  assert.deepEqual(returnValue, slides);
});

test('GET_SLIDES_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getSlides(1));
  assert.deepEqual(fetch.mock.calls[0], ['/api/scenarios/1/slides']);
  assert.equal(returnValue, null);
});

test('DELETE_SLIDE_SUCCESS', async () => {
  const slides = state.scenario.slides.slice();

  fetchImplementation(fetch, 200, { slides });

  const returnValue = await store.dispatch(actions.deleteSlide(42, 1));
  assert.deepEqual(fetch.mock.calls[0], [
    '/api/scenarios/42/slides/1',
    { method: 'DELETE' }
  ]);
  assert.deepEqual(returnValue, slides);
});

test('DELETE_SLIDE_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.deleteSlide(42, 1));
  assert.deepEqual(fetch.mock.calls[0], [
    '/api/scenarios/42/slides/1',
    { method: 'DELETE' }
  ]);
  assert.equal(returnValue, null);
});

// DEPRECATED SYNC ACTIONS THAT ARE STILL USED
test('SET_SCENARIO', async () => {
  fetchImplementation(fetch, 200, { error });

  // Default, empty
  const action1 = await actions.setScenario(null);
  const action2 = await actions.setScenario(action1.scenario);
  const action3 = await actions.setScenario(action2.scenario);

  assert.deepEqual(action1, action2);
  assert.deepEqual(action2, action3);
});

test('SET_SCENARIOS', async () => {
  fetchImplementation(fetch, 200, { error });

  // Default, empty
  const action1 = await actions.setScenarios([]);
  const action2 = await actions.setScenarios(action1.scenarios);
  const action3 = await actions.setScenarios(action2.scenarios);

  assert.deepEqual(action1, action2);
  assert.deepEqual(action2, action3);
});

test('SET_SLIDES', async () => {
  fetchImplementation(fetch, 200, { error });

  // Default, empty
  const action1 = await actions.setSlides([]);
  const action2 = await actions.setSlides(action1.slides);
  const action3 = await actions.setSlides(action2.slides);

  assert.deepEqual(action1, action2);
  assert.deepEqual(action2, action3);
});
