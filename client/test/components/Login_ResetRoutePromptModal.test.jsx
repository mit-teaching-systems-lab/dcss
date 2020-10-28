import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}));

import assert from 'assert';
import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshotter,
  state,
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import { mount, shallow } from 'enzyme';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  LOG_OUT,
  GET_USER_SUCCESS,
  SET_USER_SUCCESS,
} from '../../actions/types';
import * as loginActions from '../../actions/login';
import * as userActions from '../../actions/user';
jest.mock('../../actions/login');
jest.mock('../../actions/user');

jest.mock('../../components/UI/ModalAccessible', () => {
  return ({ children }) => <div>{children}</div>;
});

import ResetRoutePromptModal from '../../components/Login/ResetRoutePromptModal.jsx';

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

  loginActions.logOut = jest.fn();
  loginActions.logOut.mockImplementation(() => async (dispatch) => {
    dispatch({ type: LOG_OUT, login: null });
    dispatch({ type: SET_USER_SUCCESS, user: null });
  });

  userActions.getUser = jest.fn();
  userActions.getUser.mockImplementation(() => async (dispatch) => {
    const user = {
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      id: 999,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_anonymous: false,
      is_super: true,
    };
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });

  userActions.resetPassword = jest.fn();
  userActions.resetPassword.mockImplementation(() => async (dispatch) => {
    return true;
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

test('ResetRoutePromptModal', () => {
  expect(ResetRoutePromptModal).toBeDefined();
});

test('Render 1 1', async (done) => {
  const Component = ResetRoutePromptModal;

  const props = {
    ...commonProps,
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  await screen.findByRole('button', {
    name: /click to reset your password and recieve a single-use password by email./i,
  });

  expect(asFragment()).toMatchSnapshot();

  done();
});

/*{INJECTION}*/

