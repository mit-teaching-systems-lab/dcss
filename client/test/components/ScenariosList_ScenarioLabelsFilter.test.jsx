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

import { SET_LABELS_IN_USE_SUCCESS } from '../../actions/types';
import * as tagsActions from '../../actions/tags';
jest.mock('../../actions/tags');

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

  tagsActions.setLabelsInUse = jest.fn();
  tagsActions.setLabelsInUse.mockImplementation(
    labelsInUse => async dispatch => {
      dispatch({ type: SET_LABELS_IN_USE_SUCCESS, labelsInUse });
      return labelsInUse;
    }
  );

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

  userEvent.click(await screen.findByRole('listbox'));
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('listbox'));
  expect(asFragment()).toMatchSnapshot();

  done();
});
