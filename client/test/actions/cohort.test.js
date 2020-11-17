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
      "/api/cohort",
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

  assert.deepEqual(store.getState().cohort, cohortWithOwnerRole, 1);
  assert.deepEqual(returnValue, cohortWithOwnerRole, 2);

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
      "/api/cohort",
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

    const returnValue = await store.dispatch(actions.setCohort(params));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohort/1",
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

    await mockStore.dispatch(actions.setCohort(cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('name', async () => {
    const params = {
      ...state.cohorts[1],
      name: 'A New Name!',
      deleted_at: '2020-01-01T00:00:00.000Z'
    };

    const cohort = {
      ...state.cohorts[1],
      ...params
    };

    fetchImplementation(fetch, 200, { cohort });

    const returnValue = await store.dispatch(actions.setCohort(params));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohort/1",
        Object {
          "body": "{\\"name\\":\\"A New Name!\\",\\"deleted_at\\":\\"2020-01-01T00:00:00.000Z\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "PUT",
        },
      ]
    `);

    assert.equal(store.getState().cohort.id, cohort.id);
    assert.deepEqual(returnValue, cohort);

    await mockStore.dispatch(actions.setCohort(cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('deleted_at', async () => {
    const params = {
      ...state.cohorts[1],
      deleted_at: '2020-01-01T00:00:00.000Z'
    };

    const cohort = {
      ...state.cohorts[1],
      ...params
    };

    fetchImplementation(fetch, 200, { cohort });

    const returnValue = await store.dispatch(actions.setCohort(params));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohort/1",
        Object {
          "body": "{\\"name\\":\\"First Cohort\\",\\"deleted_at\\":\\"2020-01-01T00:00:00.000Z\\"}",
          "headers": Object {
            "Content-Type": "application/json",
          },
          "method": "PUT",
        },
      ]
    `);

    assert.equal(store.getState().cohort.id, cohort.id);
    assert.deepEqual(returnValue, cohort);

    await mockStore.dispatch(actions.setCohort(cohort));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});

test('SET_COHORT_ERROR', async () => {
  const cohort = {
    ...state.cohorts[1],
    deleted_at: '2020-01-01T00:00:00.000Z'
  };

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.setCohort(cohort));
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohort/1",
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

  await mockStore.dispatch(actions.setCohort(cohort));
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
      "/api/cohort/1/scenarios",
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
      "/api/cohort/1/scenarios",
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
  test('Invalid Cohort ID', async () => {
    const returnValue = await store.dispatch(actions.getCohort(NaN));
    assert.equal(fetch.mock.calls.length, 0);
    assert.equal(returnValue, undefined);

    await mockStore.dispatch(actions.getCohort(NaN));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  test('Valid Cohort ID', async () => {
    const cohort = {
      ...state.cohorts[1]
    };

    fetchImplementation(fetch, 200, { cohort });

    const returnValue = await store.dispatch(actions.getCohort(2));

    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohort/2",
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
      "/api/cohort/2",
    ]
  `);
  assert.deepEqual(store.getState().errors.cohort.error, error);
  assert.deepEqual(returnValue, null);

  await mockStore.dispatch(actions.getCohort(2));
  expect(mockStore.getActions()).toMatchSnapshot();
});

test('GET_ALL_COHORTS_SUCCESS', async () => {
  const cohorts = state.cohorts.slice();

  fetchImplementation(fetch, 200, { cohorts });

  const returnValue = await store.dispatch(actions.getAllCohorts());

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohort/all",
    ]
  `);
  assert.deepEqual(store.getState().cohorts, cohorts);
  assert.deepEqual(store.getState().cohortsById, makeById(cohorts));

  await mockStore.dispatch(actions.getAllCohorts());
  expect(mockStore.getActions()).toMatchSnapshot();
});

test('GET_ALL_COHORTS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getAllCohorts());

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohort/all",
    ]
  `);
  assert.deepEqual(store.getState().errors.cohorts.error, error);
  assert.deepEqual(returnValue, null);
});

test('GET_COHORT_PARTICIPANTS_SUCCESS', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { cohort });

  const returnValue = await store.dispatch(actions.getCohortParticipants(1));

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohort/1",
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
      "/api/cohort/1",
    ]
  `);
  assert.deepEqual(store.getState().errors.cohort.error, error);
  assert.deepEqual(returnValue, null);
});

test('GET_USER_COHORTS_SUCCESS', async () => {
  const cohorts = state.cohorts.slice();

  fetchImplementation(fetch, 200, { cohorts });

  const returnValue = await store.dispatch(actions.getCohorts());

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohort/my",
    ]
  `);
  assert.deepEqual(store.getState().cohorts, cohorts);
  assert.deepEqual(store.getState().cohortsById, makeById(cohorts));
});

test('GET_USER_COHORTS_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCohorts());

  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/cohort/my",
    ]
  `);
  assert.deepEqual(store.getState().errors.cohorts.error, error);
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
      "/api/cohort/2/run/29",
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
      "/api/cohort/2/run/29",
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
        "/api/cohort/1/scenario/3",
      ]
    `);
    assert.deepEqual(returnValue, payload);
  });

  test('Participant', async () => {
    fetchImplementation(fetch, 200, payload);

    const returnValue = await store.dispatch(actions.getCohortData(1, 2));
    expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/api/cohort/1/participant/2",
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
        "/api/cohort/1/scenario/3",
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
        "/api/cohort/1/participant/2",
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
        "/api/cohort/1/join/boss",
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
        "/api/cohort/\${cohort_id}/roles/add",
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
        "/api/cohort/\${cohort_id}/roles/delete",
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
    assert.deepEqual(store.getState().errors.cohortuser.error, error);
    assert.deepEqual(returnValue, null);
  });

  test('addCohortUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(
      actions.addCohortUserRole(1, 2, 'boss')
    );
    assert.deepEqual(store.getState().errors.cohortuser.error, error);
    assert.deepEqual(returnValue, null);
  });

  test('deleteCohortUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(
      actions.deleteCohortUserRole(1, 2, 'boss')
    );
    assert.deepEqual(store.getState().errors.cohortuser.error, error);
    assert.deepEqual(returnValue, null);
  });
});
