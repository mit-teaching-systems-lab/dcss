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

const personas = [
  {
    id: 1,
    name: 'Participant',
    description: 'The default user participating in a single person scenario.',
    color: '#FFFFFF',
    created_at: '2020-12-01T15:49:04.962Z',
    updated_at: null,
    deleted_at: null,
    author_id: 3,
    is_read_only: true,
    is_shared: true
  },
  {
    id: 2,
    name: 'Teacher',
    description:
      'A non-specific teacher, participating in a multi person scenario.',
    color: '#3f59a9',
    created_at: '2020-12-01T15:49:04.962Z',
    updated_at: null,
    deleted_at: null,
    author_id: 3,
    is_read_only: true,
    is_shared: true
  },
  {
    id: 3,
    name: 'Student',
    description:
      'A non-specific student, participating in a multi person scenario.',
    color: '#e59235',
    created_at: '2020-12-01T15:49:04.962Z',
    updated_at: null,
    deleted_at: null,
    author_id: 3,
    is_read_only: true,
    is_shared: true
  }
];

import ScenarioPersonaSelect from '../../components/ScenarioEditor/ScenarioPersonaSelect.jsx';
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

test('ScenarioPersonaSelect', () => {
  expect(ScenarioPersonaSelect).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = ScenarioPersonaSelect;
  const props = {
    ...commonProps,
    personas,
    onSelect: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/
