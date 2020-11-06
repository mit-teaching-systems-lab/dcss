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

import Notification from '@components/Notification';
import BackButtonHistory from '@client/routes/BackButtonHistory';
import Navigation from '@client/routes/Navigation';
import Routes from '@client/routes/Routes';
jest.mock('@components/Notification', () => {
  return props => <div>@components/Notification</div>;
});
jest.mock('@client/routes/BackButtonHistory', () => {
  return props => <div>@client/routes/BackButtonHistory</div>;
});
jest.mock('@client/routes/Navigation', () => {
  return props => <div>@client/routes/Navigation</div>;
});
jest.mock('@client/routes/Routes', () => {
  return props => <div>@client/routes/Routes</div>;
});

import routes from '../../routes/index.jsx';

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

test('routes', () => {
  expect(routes).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = routes;

  const props = {
    ...commonProps,
    isLoggedIn: true,
    user: {
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      id: 999,
      roles: ['participant', 'super_admin'],
      is_anonymous: false,
      is_super: true
    }
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
