import assert from 'assert';
import { state } from '../bootstrap';

import { runInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/run';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

let run;
let runs;
let runsById;

beforeEach(() => {
  run = {
    ...original.run
  };

  runs = [run];
  runsById = {
    [run.id]: run
  };
});

afterEach(() => {
  run = null;
  runs = null;
  runsById = null;
});

describe('run', () => {
  test('initial state', () => {
    assert.deepEqual(reducer.run(undefined, {}), runInitialState);
    assert.deepEqual(reducer.run(undefined, {}), runInitialState);
  });

  test('SET_RUN_SUCCESS', () => {
    const action = {
      type: types.SET_RUN_SUCCESS,
      run
    };
    assert.deepEqual(reducer.run(undefined, action), run);
    assert.deepEqual(reducer.run(undefined, action), run);
  });
  test('GET_RUN_SUCCESS', () => {
    const action = {
      type: types.GET_RUN_SUCCESS,
      run
    };
    assert.deepEqual(reducer.run(undefined, action), run);
    assert.deepEqual(reducer.run(undefined, action), run);
  });
});

describe('runs', () => {
  test('initial state', () => {
    assert.deepEqual(reducer.runs(undefined, {}), []);
  });

  test('GET_RUNS_SUCCESS', () => {
    const action = {
      type: types.GET_RUNS_SUCCESS,
      runs
    };
    assert.deepEqual(reducer.runs(undefined, action), runs);
    assert.deepEqual(reducer.runs(undefined, action), runs);
  });

  test('GET_RUNS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_RUNS_SUCCESS,
      runs: [...runs, ...runs, ...runs]
    };
    assert.deepEqual(reducer.runs(undefined, action), runs);
    assert.deepEqual(reducer.runs(undefined, action), runs);
  });
});

describe('runsById', () => {
  test('initial state', () => {
    assert.deepEqual(reducer.runsById(undefined, {}), {});
  });

  test('GET_RUNS_SUCCESS', () => {
    const action = {
      type: types.GET_RUNS_SUCCESS,
      runs
    };
    assert.deepEqual(reducer.runsById(undefined, action), runsById);
    assert.deepEqual(reducer.runsById(undefined, action), runsById);
  });
  test('GET_RUNS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_RUNS_SUCCESS,
      runs: [...runs, ...runs, ...runs]
    };
    assert.deepEqual(reducer.runsById(undefined, action), runsById);
    assert.deepEqual(reducer.runsById(undefined, action), runsById);
  });
});
