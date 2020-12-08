import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect
}));

import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import {
  act,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as tlr from '@testing-library/react';

import {
  GET_LABELS_SUCCESS,
  SET_LABELS_IN_USE_SUCCESS
} from '../../actions/types';
import * as tagsActions from '../../actions/tags';
jest.mock('../../actions/tags');

import * as QueryString from 'query-string';
jest.mock('query-string');

const labelA = { key: 1, text: 'a', value: 'a', count: 10 };
const labelB = { key: 2, text: 'b', value: 'b', count: 20 };
const labelC = { key: 3, text: 'c', value: 'c', count: 30 };

let labels;
let labelsByOccurrence;

import ScenarioLabelsFilter from '../../components/ScenariosList/ScenarioLabelsFilter.jsx';

const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  labels = [labelA, labelB, labelC];

  labelsByOccurrence = [labelC, labelB, labelA];

  tagsActions.getLabels = jest.fn();
  tagsActions.getLabels.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_LABELS_SUCCESS, labels });
    return labels;
  });
  tagsActions.getLabelsByOccurrence = jest.fn();
  tagsActions.getLabelsByOccurrence.mockImplementation(() => async dispatch => {
    const labels = labelsByOccurrence;
    dispatch({ type: GET_LABELS_SUCCESS, labels });
    return labels;
  });
  tagsActions.setLabelsInUse = jest.fn();
  tagsActions.setLabelsInUse.mockImplementation(labels => async dispatch => {
    dispatch({ type: SET_LABELS_IN_USE_SUCCESS, labels });
    return labels;
  });

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    search: ''
  };

  QueryString.parse.mockImplementation(() => {
    return {
      l: ['a'],
      search: 'x'
    };
  });

  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('ScenarioLabelsFilter', () => {
  expect(ScenarioLabelsFilter).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = ScenarioLabelsFilter;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

/* INJECTION STARTS HERE */

test('Selected labelsInUse', async done => {
  const Component = ScenarioLabelsFilter;

  const props = {
    ...(commonProps || {})
  };

  const tags = {
    categories: [],
    labels: labelsByOccurrence,
    labelsInUse: ['a']
  };

  const state = {
    ...commonState,
    tags
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('No selected labelsInUse', async done => {
  const Component = ScenarioLabelsFilter;

  QueryString.parse.mockImplementation(() => {
    return {
      l: [],
      search: 'x'
    };
  });

  const props = {
    ...(commonProps || {})
  };

  const tags = {
    categories: [],
    labels: labelsByOccurrence,
    labelsInUse: []
  };

  const state = {
    ...commonState,
    tags
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Add and remove a label', async done => {
  const Component = ScenarioLabelsFilter;

  const props = {
    ...(commonProps || {})
  };

  const tags = {
    categories: [],
    labels: labelsByOccurrence,
    labelsInUse: ['a']
  };

  const state = {
    ...commonState,
    tags
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const dropdown = await screen.getByRole('combobox');
  expect(asFragment()).toMatchSnapshot();

  const input = await tlr.findAllByDisplayValue(dropdown, '');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(dropdown);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(input[0]);
  userEvent.type(input[0], 'a{enter}');
  expect(asFragment()).toMatchSnapshot();

  let options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(tagsActions.setLabelsInUse).toHaveBeenCalledTimes(1);

  userEvent.clear(input[0]);

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[1]);
  expect(asFragment()).toMatchSnapshot();
  expect(tagsActions.setLabelsInUse).toHaveBeenCalledTimes(2);

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(tagsActions.setLabelsInUse).toHaveBeenCalledTimes(3);

  done();
});
