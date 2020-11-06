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
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Gate from '../../components/Gate/index.jsx';

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

test('Gate', () => {
  expect(Gate).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = Gate;

  const props = {
    ...commonProps,
    requiredPermission: 'not a real permission',
    children: React.createElement('div', null, '@components/Gate')
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 2 1', async done => {
  const Component = Gate;

  const props = {
    ...commonProps,
    isAuthorized: false,
    requiredPermission: 'create_cohort',
    children: React.createElement('div', null, '@components/Gate')
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 3 1', async done => {
  const Component = Gate;

  const props = {
    ...commonProps,
    isAuthorized: false,
    children: React.createElement('div', null, '@components/Gate')
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 4 1', async done => {
  const Component = Gate;

  const props = {
    ...commonProps,
    isAuthorized: false,
    requiredPermission: 'not a real permission',
    children: React.createElement('div', null, '@components/Gate')
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 5 1', async done => {
  const Component = Gate;

  const props = {
    ...commonProps,
    isAuthorized: true,
    requiredPermission: 'not a real permission',
    children: React.createElement('div', null, '@components/Gate')
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 6 1', async done => {
  const Component = Gate;

  const props = {
    ...commonProps,
    isAuthorized: true,
    children: React.createElement('div', null, '@components/Gate')
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  render(<ConnectedRoutedComponent {...props} />);
  await screen.findByText('@components/Gate');
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Render 7 1', async done => {
  const Component = Gate;

  const props = {
    ...commonProps,
    isAuthorized: true,
    requiredPermission: 'create_cohort',
    children: React.createElement('div', null, '@components/Gate')
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  render(<ConnectedRoutedComponent {...props} />);
  await screen.findByText('@components/Gate');
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Render 8 1', async done => {
  const Component = Gate;

  const props = {
    ...commonProps,
    requiredPermission: 'create_cohort',
    children: React.createElement('div', null, '@components/Gate')
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  render(<ConnectedRoutedComponent {...props} />);
  await screen.findByText('@components/Gate');
  expect(serialize()).toMatchSnapshot();

  done();
});
