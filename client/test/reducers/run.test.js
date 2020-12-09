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
    expect(reducer.run(undefined, {})).toEqual(runInitialState);
    expect(reducer.run(undefined, {})).toEqual(runInitialState);
  });

  test('SET_RUN_SUCCESS', () => {
    const action = {
      type: types.SET_RUN_SUCCESS,
      run
    };
    expect(reducer.run(undefined, action)).toEqual(run);
    expect(reducer.run(undefined, action)).toEqual(run);
  });
  test('GET_RUN_SUCCESS', () => {
    const action = {
      type: types.GET_RUN_SUCCESS,
      run
    };
    expect(reducer.run(undefined, action)).toEqual(run);
    expect(reducer.run(undefined, action)).toEqual(run);
  });
});

describe('runs', () => {
  test('initial state', () => {
    expect(reducer.runs(undefined, {})).toEqual([]);
  });

  test('GET_RUNS_SUCCESS', () => {
    const action = {
      type: types.GET_RUNS_SUCCESS,
      runs
    };
    expect(reducer.runs(undefined, action)).toEqual(runs);
    expect(reducer.runs(undefined, action)).toEqual(runs);
  });

  test('GET_RUNS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_RUNS_SUCCESS,
      runs: [...runs, ...runs, ...runs]
    };
    expect(reducer.runs(undefined, action)).toEqual(runs);
    expect(reducer.runs(undefined, action)).toEqual(runs);
  });
});

describe('runsById', () => {
  test('initial state', () => {
    expect(reducer.runsById(undefined, {})).toEqual({});
  });

  test('GET_RUNS_SUCCESS', () => {
    const action = {
      type: types.GET_RUNS_SUCCESS,
      runs
    };
    expect(reducer.runsById(undefined, action)).toEqual(runsById);
    expect(reducer.runsById(undefined, action)).toEqual(runsById);
  });
  test('GET_RUNS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_RUNS_SUCCESS,
      runs: [...runs, ...runs, ...runs]
    };
    expect(reducer.runsById(undefined, action)).toEqual(runsById);
    expect(reducer.runsById(undefined, action)).toEqual(runsById);
  });
});
