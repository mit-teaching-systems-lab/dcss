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

async function waitForPopper() {
  // Popper update() - https://github.com/popperjs/react-popper/issues/350
  await act(async () => await null);
}

/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

import {
  LOG_OUT,
  GET_USER_SUCCESS,
  SET_USER_SUCCESS
} from '../../actions/types';
import * as sessionActions from '../../actions/session';
import * as userActions from '../../actions/user';
jest.mock('../../actions/session');
jest.mock('../../actions/user');

jest.mock('../../components/UI/ModalAccessible', () => {
  // eslint-disable-next-line react/prop-types
  return ({ children }) => <div>{children}</div>;
});

import ResetRoutePromptModal from '../../components/Login/ResetRoutePromptModal.jsx';
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

  sessionActions.logOut = jest.fn();

  sessionActions.logOut.mockImplementation(() => async dispatch => {
    dispatch({ type: LOG_OUT, session: null });
    dispatch({ type: SET_USER_SUCCESS, user: null });
  });

  userActions.getUser = jest.fn();

  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      id: 999,
      roles: ['participant', 'super_admin'],
      is_anonymous: false,
      is_super: true,
      progress: {
        completed: [1],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: true,
            event_id: 1909,
            created_at: 1602454306144,
            generic: 'arrived at a slide.',
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    };
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });

  userActions.resetPassword = jest.fn();

  userActions.resetPassword.mockImplementation(() => async dispatch => {
    return true;
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

test('ResetRoutePromptModal', () => {
  expect(ResetRoutePromptModal).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = ResetRoutePromptModal;
  const props = {
    ...commonProps
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  await screen.findByRole('button', {
    name: /click to reset your password and recieve a single-use password by email./i
  });

  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/
