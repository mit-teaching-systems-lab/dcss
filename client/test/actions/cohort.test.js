import assert from 'assert';
import {
  createMockStore,
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/cohort';
import * as types from '../../actions/types';

import { cohortInitialState } from '../../reducers/initial-states';

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
  store = createPseudoRealStore({});
});

afterEach(() => {
  jest.resetAllMocks();
});

test('CREATE_COHORT_SUCCESS', async () => {
  let cohort = { ...state.cohort, name: 'Fake Cohort' };

  fetchImplementation(fetch, 200, { cohort });

  const returnValue = await store.dispatch(
    actions.createCohort({ name: 'Fake Cohort' })
  );

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts",
      Object {
        "body": "{\\"name\\":\\"Fake Cohort\\"}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "POST",
      },
    ]
  `);

  const cohortWithOwnerRole = {
    ...cohort,
    role: 'owner'
  };

  assert.deepEqual(store.getState().cohort, cohortWithOwnerRole);
  assert.deepEqual(store.getState().cohorts, [cohortWithOwnerRole]);
  assert.deepEqual(
    store.getState().cohortsById,
    makeById([cohortWithOwnerRole])
  );
  assert.deepEqual(returnValue, cohortWithOwnerRole);

  await mockStore.dispatch(actions.createCohort({ name: 'Fake Cohort' }));
  expect(mockStore.getActions()).toMatchSnapshot();
});

test('CREATE_COHORT_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(
    actions.createCohort({ name: 'Fake Cohort' })
  );

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts",
      Object {
        "body": "{\\"name\\":\\"Fake Cohort\\"}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "POST",
      },
    ]
  `);

  const {
    errors: { cohort }
  } = store.getState();

  // The current value of the errors.cohort property will
  // be whatever error info the server returned.
  assert.deepEqual(error, cohort.error);
  assert.equal(returnValue, null);

  await mockStore.dispatch(actions.createCohort({ name: 'Fake Cohort' }));
  expect(mockStore.getActions()).toMatchSnapshot();
});

describe('SET_COHORT_SUCCESS', () => {
  test('name, deleted_at', async () => {
    const params = {
      ...state.cohorts[1],
      name: 'Some other name',
      deleted_at: '2020-01-01T00:00:00.000Z'
    };

    const cohort = {
      ...state.cohorts[1],
      ...params
    };

    fetchImplementation(fetch, 200, { cohort });

    const returnValue = await store.dispatch(
      actions.setCohort(cohort.id, params)
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1",
        Object {
          "body": "{\\"name\\":\\"Some other name\\",\\"deleted_at\\":\\"2020-01-01T00:00:00.000Z\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "PUT",
        },
      ]
    `);

    assert.equal(store.getState().cohort.id, cohort.id);
    assert.deepEqual(returnValue, cohort);

    await mockStore.dispatch(actions.setCohort(cohort.id, cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('name', async () => {
    const params = {
      ...state.cohorts[1],
      name: 'A New Name!'
    };

    const cohort = {
      ...state.cohorts[1],
      ...params
    };

    fetchImplementation(fetch, 200, { cohort });

    const returnValue = await store.dispatch(
      actions.setCohort(cohort.id, params)
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1",
        Object {
          "body": "{\\"name\\":\\"A New Name!\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "PUT",
        },
      ]
    `);

    assert.equal(store.getState().cohort.id, cohort.id);
    assert.deepEqual(returnValue, cohort);

    await mockStore.dispatch(actions.setCohort(cohort.id, cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('deleted_at', async () => {
    const params = {
      id: state.cohorts[1].id,
      deleted_at: '2020-01-01T00:00:00.000Z'
    };

    const cohort = {
      ...state.cohorts[1],
      ...params
    };

    fetchImplementation(fetch, 200, { cohort });

    const returnValue = await store.dispatch(
      actions.setCohort(cohort.id, params)
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1",
        Object {
          "body": "{\\"deleted_at\\":\\"2020-01-01T00:00:00.000Z\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "PUT",
        },
      ]
    `);

    assert.deepEqual(returnValue, cohort);
    assert.deepEqual(store.getState().cohort, cohort);
    assert.deepEqual(store.getState().cohortsById[cohort.id], returnValue);
    assert.deepEqual(
      store.getState().cohorts.find(({ id }) => id === cohort.id),
      returnValue
    );

    await mockStore.dispatch(actions.setCohort(cohort.id, cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});

test('SET_COHORT_ERROR', async () => {
  const cohort = {
    ...state.cohorts[1],
    deleted_at: '2020-01-01T00:00:00.000Z'
  };

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(
    actions.setCohort(cohort.id, cohort)
  );
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/1",
      Object {
        "body": "{\\"name\\":\\"First Cohort\\",\\"deleted_at\\":\\"2020-01-01T00:00:00.000Z\\"}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "PUT",
      },
    ]
  `);
  assert.deepEqual(store.getState().errors.cohort.error, error);
  assert.deepEqual(returnValue, null);

  await mockStore.dispatch(actions.setCohort(cohort.id, cohort));
  expect(mockStore.getActions()).toMatchSnapshot();
});

test('SET_COHORT_SCENARIOS_SUCCESS', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { cohort });

  const returnValue = await store.dispatch(actions.setCohortScenarios(cohort));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/1/scenarios",
      Object {
        "body": "{\\"scenarios\\":[7,1,9,8]}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "PUT",
      },
    ]
  `);

  assert.equal(store.getState().cohort.id, cohort.id);
  assert.deepEqual(returnValue, cohort);

  await mockStore.dispatch(actions.setCohortScenarios(cohort));
  expect(mockStore.getActions()).toMatchSnapshot();
});

test('SET_COHORT_SCENARIOS_ERROR', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.setCohortScenarios(cohort));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/1/scenarios",
      Object {
        "body": "{\\"scenarios\\":[7,1,9,8]}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "PUT",
      },
    ]
  `);
  assert.deepEqual(store.getState().errors.cohort.error, error);
  assert.deepEqual(returnValue, null);

  await mockStore.dispatch(actions.setCohortScenarios(cohort));
  expect(mockStore.getActions()).toMatchSnapshot();
});

describe('GET_COHORT_SUCCESS', () => {
  test('Receives an undefined cohort', async () => {
    const cohort = undefined;
    fetchImplementation(fetch, 200, { cohort });
    const returnValue = await store.dispatch(actions.getCohort(1));
    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1",
      ]
    `);
    expect(returnValue).toEqual(cohort);

    await mockStore.dispatch(actions.getCohort(1));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('Receives a cohort missing an id', async () => {
    const cohort = {};
    const beforeCohorts = [...store.getState().cohorts];
    const beforeCohortsById = {
      ...store.getState().beforeCohortsById
    };

    fetchImplementation(fetch, 200, { cohort });
    const returnValue = await store.dispatch(actions.getCohort(1));

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1",
      ]
    `);
    assert.deepEqual(store.getState().cohort, cohortInitialState);
    assert.deepEqual(store.getState().cohorts, beforeCohorts);
    assert.deepEqual(store.getState().cohortsById, beforeCohortsById);
    expect(returnValue).toEqual(cohort);

    await mockStore.dispatch(actions.getCohort(1));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('Invalid Cohort id', async () => {
    const returnValue = await store.dispatch(actions.getCohort(NaN));
    assert.equal(fetch.mock.calls.length, 0);
    assert.equal(returnValue, undefined);

    await mockStore.dispatch(actions.getCohort(NaN));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('Valid Cohort id', async () => {
    const cohort = {
      ...state.cohorts[1]
    };

    fetchImplementation(fetch, 200, { cohort });

    const returnValue = await store.dispatch(actions.getCohort(2));

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/2",
      ]
    `);

    assert.deepEqual(store.getState().cohort.id, cohort.id);

    await mockStore.dispatch(actions.getCohort(2));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});

test('GET_COHORT_ERROR', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCohort(2));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/2",
    ]
  `);
  assert.deepEqual(store.getState().errors.cohort.error, error);
  assert.deepEqual(returnValue, null);

  await mockStore.dispatch(actions.getCohort(2));
  expect(mockStore.getActions()).toMatchSnapshot();
});

test('GET_COHORTS_COUNT_SUCCESS', async () => {
  const count = '1'; // The action expects to receive a string.

  fetchImplementation(fetch, 200, { count });

  const returnValue = await store.dispatch(actions.getCohortsCount());
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/count",
    ]
  `);

  assert.deepEqual(returnValue, Number(count));

  await mockStore.dispatch(actions.getCohortsCount());
  expect(mockStore.getActions()).toMatchSnapshot();
});

test('GET_COHORTS_COUNT_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCohortsCount());
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/count",
    ]
  `);

  assert.equal(returnValue, null);
});

describe('GET_COHORTS_SUCCESS', () => {
  let cohorts = [];

  beforeEach(() => {
    cohorts = Array.from({ length: 90 }, (_, id) => {
      return {
        ...original.cohorts[0],
        id
      };
    });

    store = createPseudoRealStore({
      cohorts: [],
      cohortsById: {},
      session: {
        isLoggedIn: true
      }
    });
  });

  describe('getCohorts', () => {
    test('get cohorts', async () => {
      fetchImplementation(fetch, 200, { cohorts });

      await store.dispatch(actions.getCohorts());

      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts",
        ]
      `);
      assert.deepEqual(store.getState().cohortsById, makeById(cohorts));
      assert.deepEqual(store.getState().cohorts, cohorts);
    });

    test('cohorts received is undefined, does not change empty cohorts state', async () => {
      const status = 200;
      const expected = [];

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1
            ? { count: 90 }
            : {
                /* cohorts missing here */
              };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      await store.dispatch(actions.getCohorts());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts",
        ]
      `);

      assert.deepEqual(store.getState().cohortsById, makeById(expected));
      assert.deepEqual(store.getState().cohorts, expected);
    });

    test('cohorts received is undefined, does not change existing cohorts state', async () => {
      store = createPseudoRealStore({
        cohorts: cohorts.slice(0, 1),
        cohortsById: makeById(cohorts.slice(0, 1)),
        session: {
          isLoggedIn: true
        }
      });

      const status = 200;
      const expected = cohorts.slice(0, 1);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1
            ? { count: 90 }
            : {
                /* cohorts missing here */
              };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      await store.dispatch(actions.getCohorts());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts",
        ]
      `);

      const afterRequestCohortsById = {
        ...store.getState().cohortsById
      };

      const afterRequestCohorts = [...store.getState().cohorts];

      assert.deepEqual(afterRequestCohortsById, makeById(expected));
      assert.deepEqual(afterRequestCohorts, expected);

      await store.dispatch(actions.getCohorts());

      assert.deepEqual(store.getState().cohortsById, afterRequestCohortsById);
      assert.deepEqual(store.getState().cohorts, afterRequestCohorts);
    });

    test('cohorts received are the same as existing cohorts, no duplicates', async () => {
      store = createPseudoRealStore({
        cohorts: cohorts.slice(0, 1),
        cohortsById: makeById(cohorts.slice(0, 1)),
        session: {
          isLoggedIn: true
        }
      });

      const status = 200;
      const expected = cohorts.slice(0, 1);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1 ? { count: 90 } : { cohorts: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      await store.dispatch(actions.getCohorts());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts",
        ]
      `);

      const afterRequestCohortsById = {
        ...store.getState().cohortsById
      };

      const afterRequestCohorts = [...store.getState().cohorts];

      assert.deepEqual(afterRequestCohortsById, makeById(expected));
      assert.deepEqual(afterRequestCohorts, expected);

      await store.dispatch(actions.getCohorts());

      assert.deepEqual(store.getState().cohortsById, afterRequestCohortsById);
      assert.deepEqual(store.getState().cohorts, afterRequestCohorts);
    });

    test('(state.session.isLoggedIn && count === state.cohorts.length) === true', async () => {
      store = createPseudoRealStore({
        cohorts: cohorts.slice(0, 90),
        cohortsById: makeById(cohorts.slice(0, 90)),
        session: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      const returnValue = await store.dispatch(actions.getCohorts());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);

      assert.deepEqual(fetch.mock.calls.length, 1);
    });
  });

  describe('getCohortsSlice', () => {
    test('default, store is empty', async () => {
      store = createPseudoRealStore({
        cohorts: [],
        cohortsById: {},
        session: {
          isLoggedIn: true
        }
      });

      const status = 200;
      const expected = cohorts.slice(0, 30);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1 ? { count: 90 } : { cohorts: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      const returnValue = await store.dispatch(actions.getCohortsSlice());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/slice/DESC/0/30",
        ]
      `);

      assert.deepEqual(store.getState().cohortsById, makeById(expected));
      assert.deepEqual(store.getState().cohorts, expected);
    });

    test('default, cache has entries, not full', async () => {
      store = createPseudoRealStore({
        cohorts: cohorts.slice(0, 30),
        cohortsById: makeById(cohorts.slice(0, 30)),
        session: {
          isLoggedIn: true
        }
      });

      const status = 200;
      const expected = cohorts.slice(0, 30);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1 ? { count: 90 } : { cohorts: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      const returnValue = await store.dispatch(actions.getCohortsSlice());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/slice/DESC/0/30",
        ]
      `);

      assert.deepEqual(store.getState().cohortsById, makeById(expected));
      assert.deepEqual(store.getState().cohorts, expected);
    });

    test('ASC, cache is empty', async () => {
      store = createPseudoRealStore({
        cohorts: [],
        cohortsById: {},
        session: {
          isLoggedIn: true
        }
      });

      const status = 200;
      const expected = cohorts.slice(0, 30);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1 ? { count: 90 } : { cohorts: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      const returnValue = await store.dispatch(actions.getCohortsSlice('ASC'));
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/slice/ASC/0/30",
        ]
      `);

      assert.deepEqual(store.getState().cohortsById, makeById(expected));
      assert.deepEqual(store.getState().cohorts, expected);
    });

    test('ASC, cache has entries, not full', async () => {
      store = createPseudoRealStore({
        cohorts: cohorts.slice(0, 30),
        cohortsById: makeById(cohorts.slice(0, 30)),
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;
      const expected = cohorts.slice(0, 30);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1 ? { count: 90 } : { cohorts: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      const returnValue = await store.dispatch(actions.getCohortsSlice('ASC'));
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/slice/ASC/0/30",
        ]
      `);

      assert.deepEqual(store.getState().cohortsById, makeById(expected));
      assert.deepEqual(store.getState().cohorts, expected);
    });

    test('cohorts received is undefined, does not change empty cohorts state', async () => {
      store = createPseudoRealStore({
        cohorts: [],
        cohortsById: {},
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;
      const expected = [];

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1
            ? { count: 90 }
            : {
                /* cohorts missing here */
              };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      const returnValue = await store.dispatch(actions.getCohortsSlice('ASC'));
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/slice/ASC/0/30",
        ]
      `);

      assert.deepEqual(store.getState().cohortsById, makeById(expected));
      assert.deepEqual(store.getState().cohorts, expected);
    });

    test('cohorts received is undefined, does not change existing cohorts state', async () => {
      store = createPseudoRealStore({
        cohorts: cohorts.slice(0, 1),
        cohortsById: makeById(cohorts.slice(0, 1)),
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;
      const expected = cohorts.slice(0, 1);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1
            ? { count: 90 }
            : {
                /* cohorts missing here */
              };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      const returnValue = await store.dispatch(actions.getCohortsSlice('ASC'));
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/slice/ASC/0/30",
        ]
      `);

      assert.deepEqual(store.getState().cohortsById, makeById(expected));
      assert.deepEqual(store.getState().cohorts, expected);
    });

    test('cohorts received are the same as existing cohorts, no duplicates', async () => {
      store = createPseudoRealStore({
        cohorts: cohorts.slice(0, 1),
        cohortsById: makeById(cohorts.slice(0, 1)),
        session: {
          isLoggedIn: false
        }
      });

      const status = 200;
      const expected = cohorts.slice(0, 1);

      fetch.mockImplementation(async () => {
        const resolveValue =
          fetch.mock.calls.length === 1 ? { count: 90 } : { cohorts: expected };

        return {
          status,
          async json() {
            return resolveValue;
          }
        };
      });

      const returnValue = await store.dispatch(actions.getCohortsSlice('ASC'));
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);
      expect(fetch.mock.calls[1]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/slice/ASC/0/30",
        ]
      `);

      assert.deepEqual(store.getState().cohortsById, makeById(expected));
      assert.deepEqual(store.getState().cohorts, expected);
    });

    test('(state.session.isLoggedIn && count === state.cohorts.length) === true', async () => {
      store = createPseudoRealStore({
        cohorts: cohorts.slice(0, 90),
        cohortsById: makeById(cohorts.slice(0, 90)),
        session: {
          isLoggedIn: true
        }
      });

      fetchImplementation(fetch, 200, { count: 90 });
      const returnValue = await store.dispatch(actions.getCohortsSlice());
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/cohorts/count",
        ]
      `);

      assert.deepEqual(fetch.mock.calls.length, 1);
    });
  });
});

describe('GET_COHORTS_ERROR', () => {
  test('getCohorts', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getCohorts());

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/count",
      ]
    `);
    assert.deepEqual(store.getState().errors.cohorts.error, error);
    assert.deepEqual(returnValue, null);
  });

  test('getCohortsSlice', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getCohortsSlice());

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/count",
      ]
    `);
    assert.deepEqual(store.getState().errors.cohorts.error, error);
    assert.deepEqual(returnValue, null);
  });
});

test('GET_COHORT_PARTICIPANTS_SUCCESS', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { cohort });

  const returnValue = await store.dispatch(actions.getCohortParticipants(1));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/1",
    ]
  `);
  assert.deepEqual(store.getState().cohort.users, cohort.users);
  assert.deepEqual(returnValue, cohort.users);
});

test('GET_COHORT_PARTICIPANTS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCohortParticipants(1));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/1",
    ]
  `);
  assert.deepEqual(store.getState().errors.cohort.error, error);
  assert.deepEqual(returnValue, null);
});

test('LINK_RUN_TO_COHORT_SUCCESS', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { cohort });

  const returnValue = await store.dispatch(actions.linkRunToCohort(2, 29));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/2/run/29",
    ]
  `);
  assert.deepEqual(returnValue, cohort);
  assert.deepEqual(store.getState().cohort, cohort);
});

test('LINK_RUN_TO_COHORT_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.linkRunToCohort(2, 29));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/2/run/29",
    ]
  `);
  assert.deepEqual(store.getState().errors.cohortlink.error, error);
  assert.deepEqual(returnValue, null);
});

describe('GET_COHORT_RUN_DATA_SUCCESS', () => {
  const payload = { prompts: [], responses: [] };

  test('Scenario', async () => {
    fetchImplementation(fetch, 200, payload);

    const returnValue = await store.dispatch(actions.getCohortData(1, 2, 3));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/scenario/3",
      ]
    `);
    assert.deepEqual(returnValue, payload);
  });

  test('Participant', async () => {
    fetchImplementation(fetch, 200, payload);

    const returnValue = await store.dispatch(actions.getCohortData(1, 2));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/participant/2",
      ]
    `);
    assert.deepEqual(returnValue, payload);
  });
});

describe('GET_COHORT_RUN_DATA_ERROR', () => {
  test('Scenario', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getCohortData(1, 2, 3));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/scenario/3",
      ]
    `);
    assert.deepEqual(store.getState().errors.cohortdata.error, error);
    assert.deepEqual(returnValue, null);
  });

  test('Participant', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getCohortData(1, 2));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/participant/2",
      ]
    `);
    assert.deepEqual(store.getState().errors.cohortdata.error, error);
    assert.deepEqual(returnValue, null);
  });
});

describe('SET_COHORT_USER_ROLE_SUCCESS', () => {
  test('linkUserToCohort', async () => {
    let users = state.cohort.users.slice();
    let usersById = {
      ...state.cohort.usersById
    };
    let cohortUsers = { users, usersById };

    fetchImplementation(fetch, 200, cohortUsers);

    const returnValue = await store.dispatch(
      actions.linkUserToCohort(1, 'boss')
    );

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/join/boss",
      ]
    `);
    assert.deepEqual(store.getState().cohort.users, cohortUsers.users);
    assert.deepEqual(store.getState().cohort.usersById, cohortUsers.usersById);
    assert.deepEqual(returnValue, cohortUsers);
  });

  test('addCohortUserRole', async () => {
    let cohort = {
      ...state.cohorts[1],
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          cohort_id: 1,
          roles: ['boss'],
          is_anonymous: false,
          is_owner: true
        }
      ]
    };

    fetchImplementation(fetch, 200, { cohort, addedCount: 1 });

    const returnValue = await store.dispatch(
      actions.addCohortUserRole(cohort.id, 2, 'boss')
    );

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/roles/add",
        Object {
          "body": "{\\"cohort_id\\":1,\\"user_id\\":2,\\"roles\\":[\\"boss\\"]}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);

    assert.deepEqual(store.getState().cohort.users, cohort.users);
    assert.equal(returnValue.addedCount, 1);
  });

  test('deleteCohortUserRole', async () => {
    let cohort = {
      ...state.cohorts[1],
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          cohort_id: 1,
          roles: [],
          is_anonymous: false,
          is_owner: true
        }
      ]
    };

    fetchImplementation(fetch, 200, { cohort, deletedCount: 1 });

    const returnValue = await store.dispatch(
      actions.deleteCohortUserRole(cohort.id, 2, 'boss')
    );

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/roles/delete",
        Object {
          "body": "{\\"cohort_id\\":1,\\"user_id\\":2,\\"roles\\":[\\"boss\\"]}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);

    assert.deepEqual(store.getState().cohort.users, cohort.users);
    assert.equal(returnValue.deletedCount, 1);
  });
});

describe('SET_COHORT_USER_ROLE_ERROR', () => {
  test('linkUserToCohort', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(
      actions.linkUserToCohort(1, 'boss')
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/join/boss",
      ]
    `);
    assert.deepEqual(store.getState().errors.cohortuser.error, error);
    assert.deepEqual(returnValue, null);
  });

  test('addCohortUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(
      actions.addCohortUserRole(1, 2, 'boss')
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/roles/add",
        Object {
          "body": "{\\"cohort_id\\":1,\\"user_id\\":2,\\"roles\\":[\\"boss\\"]}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    assert.deepEqual(store.getState().errors.cohortuser.error, error);
    assert.deepEqual(returnValue, null);
  });

  test('deleteCohortUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(
      actions.deleteCohortUserRole(1, 2, 'boss')
    );
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/roles/delete",
        Object {
          "body": "{\\"cohort_id\\":1,\\"user_id\\":2,\\"roles\\":[\\"boss\\"]}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "POST",
        },
      ]
    `);
    assert.deepEqual(store.getState().errors.cohortuser.error, error);
    assert.deepEqual(returnValue, null);
  });
});
