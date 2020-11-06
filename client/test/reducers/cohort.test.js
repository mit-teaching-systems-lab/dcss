import assert from 'assert';
import { state } from '../bootstrap';

import { cohortInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/cohort';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

let cohort;
let cohorts;
let cohortsById;
let users;
let usersById;

beforeEach(() => {
  cohort = {
    ...original.cohort
  };

  cohorts = [cohort];
  cohortsById = {
    [cohort.id]: cohort
  };

  users = cohort.users.slice();
  usersById = { ...cohort.usersById };
});

afterEach(() => {
  cohort = null;
  cohorts = null;
  cohortsById = null;
  users = null;
  usersById = null;
});

describe('cohort', () => {
  test('initial state', () => {
    assert.deepEqual(reducer.cohort(undefined, {}), cohortInitialState);
    assert.deepEqual(reducer.cohort(undefined, {}), cohortInitialState);
  });

  test('CREATE_COHORT_SUCCESS', () => {
    const action = {
      type: types.CREATE_COHORT_SUCCESS,
      cohort
    };
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
  });
  test('SET_COHORT_SUCCESS', () => {
    const action = {
      type: types.SET_COHORT_SUCCESS,
      cohort
    };
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
  });
  test('SET_COHORT_SCENARIOS_SUCCESS', () => {
    const action = {
      type: types.SET_COHORT_SCENARIOS_SUCCESS,
      cohort
    };
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
  });
  test('GET_COHORT_SUCCESS', () => {
    const action = {
      type: types.GET_COHORT_SUCCESS,
      cohort
    };
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
  });
  test('GET_COHORT_PARTICIPANTS_SUCCESS', () => {
    const action = {
      type: types.GET_COHORT_PARTICIPANTS_SUCCESS,
      cohort
    };
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
    assert.deepEqual(reducer.cohort(undefined, action), cohort);
  });

  describe('SET_COHORT_USER_ROLE_SUCCESS', () => {
    test('with users', () => {
      const action = {
        type: types.SET_COHORT_USER_ROLE_SUCCESS,
        users,
        usersById
      };
      const expect = {
        ...cohortInitialState,
        users,
        usersById
      };
      assert.deepEqual(reducer.cohort(undefined, action), expect);
      assert.deepEqual(reducer.cohort(undefined, action), expect);
    });

    test('without users', () => {
      const action = {
        type: types.SET_COHORT_USER_ROLE_SUCCESS
      };
      const expect = {
        ...cohortInitialState
      };
      assert.deepEqual(reducer.cohort(undefined, action), expect);
      assert.deepEqual(reducer.cohort(undefined, action), expect);
    });
  });
});

describe('cohorts', () => {
  test('initial state', () => {
    assert.deepEqual(reducer.cohorts(undefined, {}), []);
  });

  test('GET_USER_COHORTS_SUCCESS', () => {
    const action = {
      type: types.GET_USER_COHORTS_SUCCESS,
      cohorts
    };
    assert.deepEqual(reducer.cohorts(undefined, action), cohorts);
    assert.deepEqual(reducer.cohorts(undefined, action), cohorts);
  });
  test('GET_ALL_COHORTS_SUCCESS', () => {
    const action = {
      type: types.GET_ALL_COHORTS_SUCCESS,
      cohorts
    };
    assert.deepEqual(reducer.cohorts(undefined, action), cohorts);
    assert.deepEqual(reducer.cohorts(undefined, action), cohorts);
  });
});

describe('cohortsById', () => {
  test('initial state', () => {
    assert.deepEqual(reducer.cohortsById(undefined, {}), {});
  });

  test('GET_USER_COHORTS_SUCCESS', () => {
    const action = {
      type: types.GET_USER_COHORTS_SUCCESS,
      cohorts
    };
    assert.deepEqual(reducer.cohortsById(undefined, action), cohortsById);
    assert.deepEqual(reducer.cohortsById(undefined, action), cohortsById);
  });
  test('GET_USER_COHORTS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_USER_COHORTS_SUCCESS,
      cohorts: [...cohorts, ...cohorts, ...cohorts]
    };
    assert.deepEqual(reducer.cohortsById(undefined, action), cohortsById);
    assert.deepEqual(reducer.cohortsById(undefined, action), cohortsById);
  });
  test('GET_ALL_COHORTS_SUCCESS', () => {
    const action = {
      type: types.GET_ALL_COHORTS_SUCCESS,
      cohorts
    };
    assert.deepEqual(reducer.cohortsById(undefined, action), cohortsById);
    assert.deepEqual(reducer.cohortsById(undefined, action), cohortsById);
  });
  test('GET_ALL_COHORTS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_ALL_COHORTS_SUCCESS,
      cohorts: [...cohorts, ...cohorts, ...cohorts]
    };
    assert.deepEqual(reducer.cohortsById(undefined, action), cohortsById);
    assert.deepEqual(reducer.cohortsById(undefined, action), cohortsById);
  });
});
