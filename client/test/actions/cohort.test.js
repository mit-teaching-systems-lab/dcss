import assert from 'assert';
import {
  createStore,
  fetchImplementation,
  makeById,
  state,
} from '../bootstrap';

import * as actions from '../../actions/cohort';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  fetch.mockRestore();
});

beforeEach(() => {
  store = createStore({});
});

afterEach(() => {
  fetch.mockReset();
});

test('CREATE_COHORT_SUCCESS', async () => {
  let cohort = { ...state.cohort, name: 'Fake Cohort' };

  fetchImplementation(fetch, 200, { cohort });

  const returnValue = await store.dispatch(actions.createCohort({ name: 'Fake Cohort' }));

  assert.deepEqual(fetch.mock.calls[0], [
    '/api/cohort',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name":"Fake Cohort"}'
    }
  ]);

  const cohortWithOwnerRole = {
    ...cohort,
    role: 'owner',
  };

  assert.deepEqual(store.getState().cohort, cohortWithOwnerRole, 1);
  assert.deepEqual(returnValue, cohortWithOwnerRole, 2);
});

test('CREATE_COHORT_ERROR', async () => {

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.createCohort({ name: 'Fake Cohort' }));

  assert.deepEqual(fetch.mock.calls[0], [
    '/api/cohort',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name":"Fake Cohort"}'
    }
  ]);

  const { errors: { cohort } } = store.getState();

  // The current value of the errors.cohort property will
  // be whatever error info the server returned.
  assert.deepEqual(error, cohort.error);
  assert.equal(returnValue, null);
});


test('SET_COHORT_SUCCESS', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { cohort });


  const returnValue = await store.dispatch(actions.setCohort(cohort));

  assert.deepEqual(fetch.mock.calls[0], [
    '/api/cohort/1/scenarios',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"scenarios":[7,1,9,8]}'
    }
  ]);

  assert.equal(store.getState().cohort.id, cohort.id);
  assert.deepEqual(returnValue, cohort);
});

test('SET_COHORT_ERROR', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.setCohort(cohort));

  assert.deepEqual(fetch.mock.calls[0], [
    '/api/cohort/1/scenarios',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"scenarios":[7,1,9,8]}'
    }
  ]);
  assert.deepEqual(store.getState().errors.cohort.error, error);
  assert.deepEqual(returnValue, null);
});

describe('GET_COHORT_SUCCESS', () => {
  test('Invalid Cohort ID', async () => {
    const returnValue = await store.dispatch(actions.getCohort(NaN));
    assert.equal(fetch.mock.calls.length, 0);
    assert.equal(returnValue, undefined);
  });

  test('Valid Cohort ID', async () => {
    const cohort = {
      ...state.cohorts[1]
    };

    fetchImplementation(fetch, 200, { cohort });

    const returnValue = await store.dispatch(actions.getCohort(2));

    assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/2' ]);
    assert.deepEqual(store.getState().cohort.id, cohort.id);
  });
});


test('GET_COHORT_ERROR', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCohort(2));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/2' ]);
  assert.deepEqual(store.getState().errors.cohort.error, error);
  assert.deepEqual(returnValue, null);
});

test('GET_ALL_COHORTS_SUCCESS', async () => {
  const cohorts = state.cohorts.slice();

  fetchImplementation(fetch, 200, { cohorts });

  const returnValue = await store.dispatch(actions.getAllCohorts());

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/all' ]);
  assert.deepEqual(store.getState().cohorts, cohorts);
  assert.deepEqual(store.getState().cohortsById, makeById(cohorts));
});

test('GET_ALL_COHORTS_ERROR', async () => {

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getAllCohorts());

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/all' ]);
  assert.deepEqual(store.getState().errors.cohorts.error, error);
  assert.deepEqual(returnValue, null);
});

test('GET_COHORT_PARTICIPANTS_SUCCESS', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { cohort });

  const returnValue = await store.dispatch(actions.getCohortParticipants(1));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/1' ]);
  assert.deepEqual(store.getState().cohort.users, cohort.users);
  assert.deepEqual(returnValue, cohort.users);
});

test('GET_COHORT_PARTICIPANTS_ERROR', async () => {

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCohortParticipants(1));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/1' ]);
  assert.deepEqual(store.getState().errors.cohort.error, error);
  assert.deepEqual(returnValue, null);
});

test('GET_USER_COHORTS_SUCCESS', async () => {
  const cohorts = state.cohorts.slice();

  fetchImplementation(fetch, 200, { cohorts });

  const returnValue = await store.dispatch(actions.getCohorts());

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/my' ]);
  assert.deepEqual(store.getState().cohorts, cohorts);
  assert.deepEqual(store.getState().cohortsById, makeById(cohorts));
});

test('GET_USER_COHORTS_ERROR', async () => {

  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getCohorts());

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/my' ]);
  assert.deepEqual(store.getState().errors.cohorts.error, error);
  assert.deepEqual(returnValue, null);
});

test('LINK_RUN_TO_COHORT_SUCCESS', async () => {
  const cohort = {
    ...state.cohorts[1]
  };

  fetchImplementation(fetch, 200, { cohort });

  const returnValue = await store.dispatch(actions.linkRunToCohort(2, 29));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/2/run/29' ]);
  assert.deepEqual(returnValue, cohort);
  assert.deepEqual(store.getState().cohort, cohort);
});

test('LINK_RUN_TO_COHORT_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.linkRunToCohort(2, 29));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/2/run/29' ]);
  assert.deepEqual(store.getState().errors.cohortlink.error, error);
  assert.deepEqual(returnValue, null);
});

describe('GET_COHORT_RUN_DATA_SUCCESS', () => {

  const payload = { prompts: [], responses: [] };

  test('Scenario', async () => {
    fetchImplementation(fetch, 200, payload);

    const returnValue = await store.dispatch(actions.getCohortData(1, 2, 3));
    assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/1/scenario/3' ]);
    assert.deepEqual(returnValue, payload);
  });

  test('Participant', async () => {
    fetchImplementation(fetch, 200, payload);

    const returnValue = await store.dispatch(actions.getCohortData(1, 2));
    assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/1/participant/2' ]);
    assert.deepEqual(returnValue, payload);
  });
});

describe('GET_COHORT_RUN_DATA_ERROR', () => {
  test('Scenario', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getCohortData(1, 2, 3));
    assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/1/scenario/3' ]);
    assert.deepEqual(store.getState().errors.cohortdata.error, error);
    assert.deepEqual(returnValue, null);
  });

  test('Participant', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.getCohortData(1, 2));
    assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/1/participant/2' ]);
    assert.deepEqual(store.getState().errors.cohortdata.error, error);
    assert.deepEqual(returnValue, null);
  });
});

describe('SET_COHORT_USER_ROLE_SUCCESS', () => {


  test('linkUserToCohort', async () => {
    let users = state.users.slice();

    fetchImplementation(fetch, 200, { users });

    const returnValue = await store.dispatch(actions.linkUserToCohort(1, 'boss'));
    assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/1/join/boss' ]);
    assert.deepEqual(store.getState().cohort.users, users);
    assert.equal(returnValue, users);
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
          roles: [ 'boss' ],
          is_anonymous: false,
          is_owner: true
        }
      ]
    };

    fetchImplementation(fetch, 200, { cohort, addedCount: 1 });

    const returnValue = await store.dispatch(actions.addCohortUserRole(cohort.id, 2, 'boss'));

    assert.deepEqual(fetch.mock.calls[0], [
      '/api/cohort/${cohort_id}/roles/add',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"cohort_id":1,"user_id":2,"roles":["boss"]}'
      }
    ]);
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

    const returnValue = await store.dispatch(actions.deleteCohortUserRole(cohort.id, 2, 'boss'));

    assert.deepEqual(fetch.mock.calls[0], [
      '/api/cohort/${cohort_id}/roles/delete',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"cohort_id":1,"user_id":2,"roles":["boss"]}'
      }
    ]);
    assert.deepEqual(store.getState().cohort.users, cohort.users);
    assert.equal(returnValue.deletedCount, 1);
  });
});

describe('SET_COHORT_USER_ROLE_ERROR', () => {

  test('linkUserToCohort', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.linkUserToCohort(1, 'boss'));
    assert.deepEqual(store.getState().errors.cohortuser.error, error);
    assert.deepEqual(returnValue, null);
  });

  test('addCohortUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.addCohortUserRole(1, 2, 'boss'));
    assert.deepEqual(store.getState().errors.cohortuser.error, error);
    assert.deepEqual(returnValue, null);
  });

  test('deleteCohortUserRole', async () => {
    fetchImplementation(fetch, 200, { error });

    const returnValue = await store.dispatch(actions.deleteCohortUserRole(1, 2, 'boss'));
    assert.deepEqual(store.getState().errors.cohortuser.error, error);
    assert.deepEqual(returnValue, null);
  });
});
