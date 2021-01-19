import assert from 'assert';
import {
  createMockStore,
  createMockConnectedStore,
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
  store = createMockConnectedStore({});
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

  expect(store.getState().cohort).toEqual(cohortWithOwnerRole);
  expect(store.getState().cohorts).toEqual([cohortWithOwnerRole]);
  expect(store.getState().cohortsById).toEqual(makeById([cohortWithOwnerRole]));
  expect(returnValue).toEqual(cohortWithOwnerRole);

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
  expect(error).toEqual(cohort.error);
  expect(returnValue).toBe(null);

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

    expect(store.getState().cohort.id).toBe(cohort.id);
    expect(returnValue).toEqual(cohort);

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
          "body": "{\\"name\\":\\"A New Name!\\",\\"deleted_at\\":null}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "PUT",
        },
      ]
    `);

    expect(store.getState().cohort.id).toBe(cohort.id);
    expect(returnValue).toEqual(cohort);

    await mockStore.dispatch(actions.setCohort(cohort.id, cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('deleted_at', async () => {
    const params = {
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

    expect(returnValue).toEqual(cohort);
    expect(store.getState().cohort).toEqual(cohort);
    expect(store.getState().cohortsById[cohort.id]).toEqual(returnValue);
    expect(store.getState().cohorts.find(({ id }) => id === cohort.id)).toEqual(
      returnValue
    );

    await mockStore.dispatch(actions.setCohort(cohort.id, cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('deleted_at is null (restores cohort)', async () => {
    const params = {
      deleted_at: null
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
          "body": "{\\"deleted_at\\":null}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "PUT",
        },
      ]
    `);

    expect(returnValue).toEqual(cohort);
    expect(store.getState().cohort).toEqual(cohort);
    expect(store.getState().cohortsById[cohort.id]).toEqual(returnValue);
    expect(store.getState().cohorts.find(({ id }) => id === cohort.id)).toEqual(
      returnValue
    );

    await mockStore.dispatch(actions.setCohort(cohort.id, cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('deleted_at is undefined no-op', async () => {
    const params = {
      deleted_at: undefined
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
          "body": "{\\"deleted_at\\":null}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "PUT",
        },
      ]
    `);

    expect(returnValue).toEqual(cohort);
    expect(store.getState().cohort).toEqual(cohort);
    expect(store.getState().cohortsById[cohort.id]).toEqual(returnValue);
    expect(store.getState().cohorts.find(({ id }) => id === cohort.id)).toEqual(
      returnValue
    );

    await mockStore.dispatch(actions.setCohort(cohort.id, cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('is_archived', async () => {
    const params = {
      id: state.cohorts[1].id,
      is_archived: true
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
          "body": "{\\"deleted_at\\":null,\\"is_archived\\":true}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "PUT",
        },
      ]
    `);

    expect(returnValue).toEqual(cohort);
    expect(store.getState().cohort).toEqual(cohort);
    expect(store.getState().cohortsById[cohort.id]).toEqual(returnValue);
    expect(store.getState().cohorts.find(({ id }) => id === cohort.id)).toEqual(
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
  expect(store.getState().errors.cohort.error).toEqual(error);
  expect(returnValue).toEqual(null);

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

  expect(store.getState().cohort.id).toBe(cohort.id);
  expect(returnValue).toEqual(cohort);

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
  expect(store.getState().errors.cohort.error).toEqual(error);
  expect(returnValue).toEqual(null);

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
    expect(store.getState().cohort).toEqual(cohortInitialState);
    expect(store.getState().cohorts).toEqual(beforeCohorts);
    expect(store.getState().cohortsById).toEqual(beforeCohortsById);
    expect(returnValue).toEqual(cohort);

    await mockStore.dispatch(actions.getCohort(1));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('Invalid Cohort id', async () => {
    const returnValue = await store.dispatch(actions.getCohort(NaN));
    expect(fetch.mock.calls.length).toBe(0);
    expect(returnValue).toBe(undefined);

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

    expect(store.getState().cohort.id).toEqual(cohort.id);

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
  expect(store.getState().errors.cohort.error).toEqual(error);
  expect(returnValue).toEqual(null);

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

  expect(returnValue).toEqual(Number(count));

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

  expect(returnValue).toBe(null);
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

    store = createMockConnectedStore({
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
      expect(store.getState().cohortsById).toEqual(makeById(cohorts));
      expect(store.getState().cohorts).toEqual(cohorts);
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

      expect(store.getState().cohortsById).toEqual(makeById(expected));
      expect(store.getState().cohorts).toEqual(expected);
    });

    test('cohorts received is undefined, does not change existing cohorts state', async () => {
      store = createMockConnectedStore({
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

      expect(afterRequestCohortsById).toEqual(makeById(expected));
      expect(afterRequestCohorts).toEqual(expected);

      await store.dispatch(actions.getCohorts());

      expect(store.getState().cohortsById).toEqual(afterRequestCohortsById);
      expect(store.getState().cohorts).toEqual(afterRequestCohorts);
    });

    test('cohorts received are the same as existing cohorts, no duplicates', async () => {
      store = createMockConnectedStore({
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

      expect(afterRequestCohortsById).toEqual(makeById(expected));
      expect(afterRequestCohorts).toEqual(expected);

      await store.dispatch(actions.getCohorts());

      expect(store.getState().cohortsById).toEqual(afterRequestCohortsById);
      expect(store.getState().cohorts).toEqual(afterRequestCohorts);
    });

    test('(state.session.isLoggedIn && count === state.cohorts.length) === true', async () => {
      store = createMockConnectedStore({
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

      expect(fetch.mock.calls.length).toEqual(1);
    });
  });

  describe('getCohortsSlice', () => {
    test('default, store is empty', async () => {
      store = createMockConnectedStore({
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

      expect(store.getState().cohortsById).toEqual(makeById(expected));
      expect(store.getState().cohorts).toEqual(expected);
    });

    test('default, cache has entries, not full', async () => {
      store = createMockConnectedStore({
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

      expect(store.getState().cohortsById).toEqual(makeById(expected));
      expect(store.getState().cohorts).toEqual(expected);
    });

    test('ASC, cache is empty', async () => {
      store = createMockConnectedStore({
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

      expect(store.getState().cohortsById).toEqual(makeById(expected));
      expect(store.getState().cohorts).toEqual(expected);
    });

    test('ASC, cache has entries, not full', async () => {
      store = createMockConnectedStore({
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

      expect(store.getState().cohortsById).toEqual(makeById(expected));
      expect(store.getState().cohorts).toEqual(expected);
    });

    test('cohorts received is undefined, does not change empty cohorts state', async () => {
      store = createMockConnectedStore({
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

      expect(store.getState().cohortsById).toEqual(makeById(expected));
      expect(store.getState().cohorts).toEqual(expected);
    });

    test('cohorts received is undefined, does not change existing cohorts state', async () => {
      store = createMockConnectedStore({
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

      expect(store.getState().cohortsById).toEqual(makeById(expected));
      expect(store.getState().cohorts).toEqual(expected);
    });

    test('cohorts received are the same as existing cohorts, no duplicates', async () => {
      store = createMockConnectedStore({
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

      expect(store.getState().cohortsById).toEqual(makeById(expected));
      expect(store.getState().cohorts).toEqual(expected);
    });

    test('(state.session.isLoggedIn && count === state.cohorts.length) === true', async () => {
      store = createMockConnectedStore({
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

      expect(fetch.mock.calls.length).toEqual(1);
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
    expect(store.getState().errors.cohorts.error).toEqual(error);
    expect(returnValue).toEqual(null);
  });

  test('getCohortsSlice', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getCohortsSlice());

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/count",
      ]
    `);
    expect(store.getState().errors.cohorts.error).toEqual(error);
    expect(returnValue).toEqual(null);
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
  expect(store.getState().cohort.users).toEqual(cohort.users);
  expect(returnValue).toEqual(cohort.users);
});

test('GET_COHORT_PARTICIPANTS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCohortParticipants(1));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/1",
    ]
  `);
  expect(store.getState().errors.cohort.error).toEqual(error);
  expect(returnValue).toEqual(null);
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
  expect(returnValue).toEqual(cohort);
  expect(store.getState().cohort).toEqual(cohort);
});

test('LINK_RUN_TO_COHORT_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.linkRunToCohort(2, 29));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/2/run/29",
    ]
  `);
  expect(store.getState().errors.cohortlink.error).toEqual(error);
  expect(returnValue).toEqual(null);
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
    expect(returnValue).toEqual(payload);
  });

  test('Participant', async () => {
    fetchImplementation(fetch, 200, payload);

    const returnValue = await store.dispatch(actions.getCohortData(1, 2));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/participant/2",
      ]
    `);
    expect(returnValue).toEqual(payload);
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
    expect(store.getState().errors.cohortdata.error).toEqual(error);
    expect(returnValue).toEqual(null);
  });

  test('Participant', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getCohortData(1, 2));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/participant/2",
      ]
    `);
    expect(store.getState().errors.cohortdata.error).toEqual(error);
    expect(returnValue).toEqual(null);
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
    expect(store.getState().cohort.users).toEqual(cohortUsers.users);
    expect(store.getState().cohort.usersById).toEqual(cohortUsers.usersById);
    expect(returnValue).toEqual(cohortUsers);
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

    expect(store.getState().cohort.users).toEqual(cohort.users);
    expect(returnValue.addedCount).toBe(1);
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

    expect(store.getState().cohort.users).toEqual(cohort.users);
    expect(returnValue.deletedCount).toBe(1);
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
    expect(store.getState().errors.cohortuser.error).toEqual(error);
    expect(returnValue).toEqual(null);
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
    expect(store.getState().errors.cohortuser.error).toEqual(error);
    expect(returnValue).toEqual(null);
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
    expect(store.getState().errors.cohortuser.error).toEqual(error);
    expect(returnValue).toEqual(null);
  });
});

describe('GET_COHORT_SCENARIOS_SUCCESS', () => {
  test('Receives scenarios', async () => {
    const scenarios = [
      state.scenarios[0]
    ];

    fetchImplementation(fetch, 200, { scenarios });

    const returnValue = await store.dispatch(actions.getCohortScenarios(1));
    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohorts/1/scenarios",
      ]
    `);
    expect(returnValue).toEqual(scenarios);

    await mockStore.dispatch(actions.getCohortScenarios(1));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});

test('GET_COHORT_SCENARIOS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });
  const returnValue = await store.dispatch(actions.getCohortScenarios(2));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohorts/2/scenarios",
    ]
  `);
  await mockStore.dispatch(actions.getCohortScenarios(2));
  expect(mockStore.getActions()).toMatchSnapshot();
});
