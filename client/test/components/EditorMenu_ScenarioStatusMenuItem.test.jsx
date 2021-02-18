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

/** @GENERATED: BEGIN **/

import ScenarioStatusMenuItem from '../../components/EditorMenu/ScenarioStatusMenuItem.jsx';
/** @GENERATED: END **/

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

  /** @GENERATED: BEGIN **/

  const statusOptions = [
    { id: 1, name: 'draft', description: 'Visible only to author' },
    { id: 2, name: 'public', description: 'Visible to everyone' },
    { id: 3, name: 'private', description: 'Visible only to logged in users' }
  ];

  fetchImplementation(fetch, 200, statusOptions);

  /** @GENERATED: END **/

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

test('ScenarioStatusMenuItem', () => {
  expect(ScenarioStatusMenuItem).toBeDefined();
});

test('Render 1 1', async done => {
  /** @GENERATED: BEGIN **/
  const Component = ScenarioStatusMenuItem;
  const props = {
    ...commonProps,
    onChange: jest.fn(),
    status: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  /** @GENERATED: END **/

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('listbox'));
  expect(serialize()).toMatchSnapshot();

  userEvent.click(
    await screen.findByText('Private (Visible only to logged in users)')
  );
  expect(props.onChange.mock.calls.length).toBe(1);
  expect(serialize()).toMatchSnapshot();

  done();
});
