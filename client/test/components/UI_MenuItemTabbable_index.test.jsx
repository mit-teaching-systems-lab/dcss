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

import MenuItemTabbable from '../../components/UI/MenuItemTabbable/index.jsx';
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

test('MenuItemTabbable', () => {
  expect(MenuItemTabbable).toBeDefined();
});

test('Render 1 1', async done => {
  /** @GENERATED: BEGIN **/
  const Component = MenuItemTabbable;
  const props = {
    ...commonProps,
    children: [React.createElement('div', { key: 'abcdef1' }, 'A')],
    onClick: jest.fn(),
    onKeyUp: jest.fn(),
    popup: '',
    tabIndex: 0
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  /** @GENERATED: END **/

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 2 1', async done => {
  /** @GENERATED: BEGIN **/
  const Component = MenuItemTabbable;
  const props = {
    ...commonProps,
    children: React.createElement('div', { key: 'abcdef2' }, 'B'),
    onClick: jest.fn(),
    onKeyUp: jest.fn(),
    popup: 'x',
    tabIndex: 0
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  /** @GENERATED: END **/

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 3 1', async done => {
  /** @GENERATED: BEGIN **/
  const Component = MenuItemTabbable;
  const props = {
    ...commonProps,
    children: [],
    onClick: jest.fn(),
    onKeyUp: jest.fn(),
    popup: 'x',
    tabIndex: 0
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  /** @GENERATED: END **/

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 4 1', async done => {
  /** @GENERATED: BEGIN **/
  const Component = MenuItemTabbable;
  const props = {
    ...commonProps,
    children: null,
    onClick: jest.fn(),
    onKeyUp: jest.fn(),
    popup: 'x',
    tabIndex: 0
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  /** @GENERATED: END **/

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 5 1', async done => {
  /** @GENERATED: BEGIN **/
  const Component = MenuItemTabbable;
  const props = {
    ...commonProps,
    onClick: jest.fn(),
    onKeyUp: jest.fn(),
    popup: 'x',
    tabIndex: 0
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  /** @GENERATED: END **/

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
