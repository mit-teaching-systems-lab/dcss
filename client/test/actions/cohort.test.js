import assert from 'assert';
import {
  state,
  createStore
} from '../bootstrap';

import * as actions from '../../actions/cohort';
import * as types from '../../actions/types';

let original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  fetch.mockRestore();
});

beforeEach(() => {
  store = createStore(original);
});

afterEach(() => {
  fetch.mockReset();
});

test('CREATE_COHORT_SUCCESS', async () => {
  const state = store.getState();
  const diff = {
    name: 'Fake Cohort',
    id: 42
  };
  let newCohort;

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        newCohort = Object.assign({}, state.cohort, diff);
        const cohort = newCohort;
        return Promise.resolve({ cohort });
      },
    });
  });

  const returnValue = await store.dispatch(actions.createCohort({ name: 'Fake Cohort' }));

  assert.deepEqual(fetch.mock.calls[0], [
    '/api/cohort',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name":"Fake Cohort"}'
    }
  ]);

  const { cohort } = store.getState();

  // The current cohort that's now in state, should look like the "newCohort",
  // but must have a "role": "owner", which was added in the process.
  assert.deepEqual(cohort, Object.assign(newCohort, { role: 'owner'}));
  assert.deepEqual(returnValue, Object.assign(newCohort, { role: 'owner'}));
});

test('CREATE_COHORT_ERROR', async () => {
  const error = new Error('something unexpected happened on the server');

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ error });
      },
    });
  });

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
  const state = store.getState();
  const cohort = state.cohorts[1];

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ cohort });
      },
    });
  });

  assert.notDeepEqual(cohort.id, state.cohort.id);

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
  const cohort = state.cohorts[1];
  const error = new Error('something unexpected happened on the server');

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ error });
      },
    });
  });

  const returnValue = await store.dispatch(actions.setCohort(cohort));

  assert.deepEqual(fetch.mock.calls[0], [
    '/api/cohort/1/scenarios',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"scenarios":[7,1,9,8]}'
    }
  ]);

  {
    const { errors: { cohort } } = store.getState();
    // The current value of the errors.cohort property will
    // be whatever error info the server returned.
    assert.deepEqual(error, cohort.error);
    assert.deepEqual(returnValue, null);
  }
});

test('GET_COHORT_SUCCESS', async () => {
  const state = store.getState();
  const cohort = state.cohorts[1];

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ cohort });
      },
    });
  });

  assert.notDeepEqual(cohort.id, state.cohort.id);

  const returnValue = await store.dispatch(actions.getCohort(2));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/2' ]);
  assert.deepEqual(store.getState().cohort.id, cohort.id);
});

test('GET_COHORT_ERROR', async () => {
  const cohort = state.cohorts[1];
  const error = new Error('something unexpected happened on the server');

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ error });
      },
    });
  });

  const returnValue = await store.dispatch(actions.getCohort(2));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/2' ]);

  {
    const { errors: { cohort } } = store.getState();
    // The current value of the errors.cohort property will
    // be whatever error info the server returned.
    assert.deepEqual(error, cohort.error);
    assert.deepEqual(returnValue, null);
  }
});

test('GET_ALL_COHORTS_SUCCESS', async () => {
  const cohorts = state.cohorts.slice();
  const store = createStore({
    cohorts: []
  });

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ cohorts });
      },
    });
  });

  const returnValue = await store.dispatch(actions.getAllCohorts());

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/all' ]);
  assert.deepEqual(store.getState().cohorts.length, 2);
});

test('GET_ALL_COHORTS_ERROR', async () => {
  const cohort = state.cohorts[1];
  const error = new Error('something unexpected happened on the server');

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ error });
      },
    });
  });

  const returnValue = await store.dispatch(actions.getAllCohorts());

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/all' ]);

  {
    const { errors: { cohorts } } = store.getState();
    // The current value of the errors.cohort property will
    // be whatever error info the server returned.
    assert.deepEqual(error, cohorts.error);
    assert.deepEqual(returnValue, null);
  }
});

test('GET_COHORT_PARTICIPANTS_SUCCESS', async () => {
  const state = store.getState();
  const cohort = state.cohorts[1];

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ cohort });
      },
    });
  });

  assert.notDeepEqual(cohort, state.cohort);

  const returnValue = await store.dispatch(actions.getCohortParticipants(1));
  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/1' ]);

  assert.deepEqual(store.getState().cohort.users, cohort.users);
  assert.deepEqual(returnValue, cohort.users);
});

test('GET_COHORT_PARTICIPANTS_ERROR', async () => {
  const error = new Error('something unexpected happened on the server');

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ error });
      },
    });
  });

  const returnValue = await store.dispatch(actions.getCohortParticipants(1));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/1' ]);

  {
    const { errors: { cohort } } = store.getState();
    // The current value of the errors.cohort property will
    // be whatever error info the server returned.
    assert.deepEqual(error, cohort.error);
    assert.deepEqual(returnValue, null);
  }
});

test('GET_USER_COHORTS_SUCCESS', async () => {
  const cohorts = state.cohorts.slice();
  const store = createStore({
    cohorts: []
  });

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ cohorts });
      },
    });
  });

  const returnValue = await store.dispatch(actions.getCohorts());

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/my' ]);
  assert.deepEqual(store.getState().cohorts.length, 2);
});

test('GET_USER_COHORTS_ERROR', async () => {
  const cohort = state.cohorts[1];
  const error = new Error('something unexpected happened on the server');

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ error });
      },
    });
  });

  const returnValue = await store.dispatch(actions.getCohorts());

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/my' ]);

  {
    const { errors: { cohorts } } = store.getState();
    // The current value of the errors.cohort property will
    // be whatever error info the server returned.
    assert.deepEqual(error, cohorts.error);
    assert.deepEqual(returnValue, null);
  }
});
test('LINK_RUN_TO_COHORT_SUCCESS', async () => {
  const state = store.getState();
  const cohort = state.cohorts[1];

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ cohort });
      },
    });
  });

  assert.notDeepEqual(cohort, state.cohort);

  const returnValue = await store.dispatch(actions.linkRunToCohort(2, 29));

  assert.deepEqual(fetch.mock.calls[0], [ '/api/cohort/2/run/29' ]);
  assert.deepEqual(returnValue, cohort);
  assert.deepEqual(store.getState().cohort.id, cohort.id);
});

test('SET_COHORT_USER_ROLE_SUCCESS', async () => {
  const state = store.getState();
  const cohort = state.cohorts[1];

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ cohort, addedCount: 1 });
      },
    });
  });

  assert.notDeepEqual(cohort, state.cohort);

  {
    const returnValue = await store.dispatch(actions.addCohortUserRole(cohort.id, 2, 'boss'));

    assert.deepEqual(fetch.mock.calls[0], [
      '/api/cohort/${cohort_id}/roles/add',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"cohort_id":1,"user_id":2,"roles":["boss"]}'
      }
    ]);

    assert.notDeepEqual(state.cohort, cohort);
    assert.equal(returnValue.addedCount, 1);
  }

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({ cohort, deletedCount: 1 });
      },
    });
  });

  {
    const returnValue = await store.dispatch(actions.deleteCohortUserRole(cohort.id, 2, 'boss'));

    assert.deepEqual(fetch.mock.calls[1], [
      '/api/cohort/${cohort_id}/roles/delete',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{"cohort_id":1,"user_id":2,"roles":["boss"]}'
      }
    ]);

    assert.notDeepEqual(state.cohort, cohort);
    assert.equal(returnValue.deletedCount, 1);
  }
});
