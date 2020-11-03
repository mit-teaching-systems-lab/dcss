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

import { GET_USER_SUCCESS, SET_USER_SUCCESS } from '../../actions/types';
import * as userActions from '../../actions/user';
jest.mock('../../actions/user');

import * as Notification from '@components/Notification';
jest.mock('@components/Notification', () => ({
  notify: jest.fn()
}));

import UserSettings from '../../components/User/UserSettings.jsx';

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

  userActions.getUser = jest.fn();
  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      id: 999,
      roles: ['participant', 'super_admin'],
      is_anonymous: false,
      is_super: true
    };
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });
  userActions.setUser = jest.fn();
  userActions.setUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      id: 999,
      roles: ['participant', 'super_admin'],
      is_anonymous: false,
      is_super: true
    };
    dispatch({ type: SET_USER_SUCCESS, user });
    return user;
  });

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

test('UserSettings', () => {
  expect(UserSettings).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = UserSettings;

  const props = {
    ...commonProps,
    open: true,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const userName = await screen.findByRole('textbox', { name: /username/i });
  const personalName = await screen.findByRole('textbox', {
    name: /personal name/i
  });
  const emailAddress = await screen.findByRole('textbox', {
    name: /email address/i
  });
  const newPassword = await screen.findByLabelText('New password');
  const confirmNewPassword = await screen.findByLabelText(
    'Confirm new password'
  );

  expect(serialize()).toMatchSnapshot();

  userEvent.clear(personalName);
  userEvent.clear(emailAddress);
  userEvent.clear(newPassword);
  userEvent.clear(confirmNewPassword);

  userEvent.type(personalName, 'New Name');
  userEvent.type(emailAddress, 'new@email.com');
  userEvent.type(newPassword, '123456789');
  userEvent.type(confirmNewPassword, '123456789');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);

  expect(userActions.setUser.mock.calls.length).toBe(1);
  expect(userActions.setUser.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "email": "new@email.com",
        "password": "123456789",
        "personalname": "New Name",
      },
      undefined,
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Render 2 1', async done => {
  const Component = UserSettings;

  const props = {
    ...commonProps,
    open: false
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
