/** @TEMPLATE: BEGIN **/
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
/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

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
/** @GENERATED: END **/

/** @TEMPLATE: BEGIN **/
const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;
/** @TEMPLATE: END **/

beforeAll(() => {
  /** @TEMPLATE: BEGIN **/
  (window || global).fetch = jest.fn();
  /** @TEMPLATE: END **/
});

afterAll(() => {
  /** @TEMPLATE: BEGIN **/
  jest.restoreAllMocks();
  /** @TEMPLATE: END **/
});

beforeEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);
  /** @TEMPLATE: END **/

  /** @GENERATED: BEGIN **/

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

  /** @GENERATED: END **/

  /** @TEMPLATE: BEGIN **/
  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
  /** @TEMPLATE: END **/
});

afterEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
  /** @TEMPLATE: END **/
});

test('ScenarioLabelsFilter', () => {
  expect(ScenarioLabelsFilter).toBeDefined();
});

/** @GENERATED: BEGIN **/
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
/** @GENERATED: END **/

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

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(tagsActions.setLabelsInUse).toHaveBeenCalledTimes(2);

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(tagsActions.setLabelsInUse).toHaveBeenCalledTimes(3);

  done();
});
