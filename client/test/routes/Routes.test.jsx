import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect
}));

import assert from 'assert';
import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import { mount, shallow } from 'enzyme';
import {
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Editor from '@components/Editor';
import Login from '@components/Login';
import LoginRoutePromptModal from '@components/Login/LoginRoutePromptModal';
import ScenariosList from '@components/ScenariosList';
jest.mock('@components/Editor', () => {
  return props => <div>@components/Editor</div>;
});
jest.mock('@components/Login', () => {
  return props => <div>@components/Login</div>;
});
jest.mock('@components/Login/LoginRoutePromptModal', () => {
  return props => <div>@components/Login/LoginRoutePromptModal</div>;
});
jest.mock('@components/ScenariosList', () => {
  return props => <div>@components/ScenariosList</div>;
});

import Routes from '../../routes/Routes.jsx';

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
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('Routes', () => {
  expect(Routes).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = Routes;

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

/*{INJECTION}*/
