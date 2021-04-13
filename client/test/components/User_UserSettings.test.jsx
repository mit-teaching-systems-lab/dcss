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
  GET_USER_SUCCESS,
  SET_USER_SUCCESS,
  SET_USER_ERROR
} from '../../actions/types';
import * as userActions from '../../actions/user';
jest.mock('../../actions/user');

import { notify } from '@components/Notification';
jest.mock('@components/Notification', () => {
  return {
    ...jest.requireActual('@components/Notification'),
    notify: jest.fn()
  };
});

import UserSettings from '../../components/User/UserSettings.jsx';
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
  userActions.setUser = jest.fn();

  userActions.setUser.mockImplementation(() => async dispatch => {
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
    dispatch({ type: SET_USER_SUCCESS, user });
    return user;
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

test('UserSettings', () => {
  expect(UserSettings).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    id: 999,
    open: true,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, {
    ...state,
    user: {
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
    }
  });

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

  userEvent.clear(userName);
  userEvent.clear(personalName);
  userEvent.clear(emailAddress);
  userEvent.clear(newPassword);
  userEvent.clear(confirmNewPassword);

  userEvent.type(userName, 'new-user-name');
  userEvent.type(personalName, 'New Name');
  userEvent.type(emailAddress, 'new@email.com');
  userEvent.type(newPassword, '123456789');
  userEvent.type(confirmNewPassword, '123456789');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);
  await waitForPopper();

  await waitFor(() => {
    expect(userActions.setUser.mock.calls.length).toBe(1);
  });

  expect(userActions.setUser.mock.calls[0]).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 2 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    id: 222,
    open: true,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  userActions.getUser = jest.fn();

  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'anonymous',
      personalname: '',
      email: '',
      id: 222,
      roles: ['participant'],
      is_anonymous: true,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: false,
            is_complete: false,
            scenario_id: 99,
            event_id: 1902,
            created_at: 1602454306144,
            generic:
              '{participant} canceled their request to join {scenario} as {persona}.',
            persona: { id: 2, name: 'Student' },
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    };
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });
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

  userEvent.clear(userName);
  userEvent.clear(personalName);
  userEvent.clear(emailAddress);
  userEvent.clear(newPassword);
  userEvent.clear(confirmNewPassword);

  userEvent.type(userName, 'new-user-name');
  userEvent.type(personalName, 'New Name');
  userEvent.type(emailAddress, 'new@email.com');
  userEvent.type(newPassword, '123456789');
  userEvent.type(confirmNewPassword, '123456789');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);
  await waitForPopper();

  await waitFor(() => {
    expect(userActions.setUser.mock.calls.length).toBe(1);
  });

  expect(userActions.setUser.mock.calls[0]).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 3 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    id: 999,
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

  userEvent.clear(userName);
  userEvent.clear(personalName);
  userEvent.clear(emailAddress);
  userEvent.clear(newPassword);
  userEvent.clear(confirmNewPassword);

  userEvent.type(userName, 'new-user-name');
  userEvent.type(personalName, 'New Name');
  userEvent.type(emailAddress, 'new@email.com');
  userEvent.type(newPassword, '123456789');
  userEvent.type(confirmNewPassword, '987654321');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);
  await waitForPopper();

  expect(userActions.setUser.mock.calls.length).toBe(0);
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 4 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    id: 999,
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

  expect(serialize()).toMatchSnapshot();

  userEvent.clear(userName);
  userEvent.clear(personalName);
  userEvent.clear(emailAddress);
  userEvent.clear(newPassword);

  userEvent.type(userName, 'new-user-name');
  userEvent.type(personalName, 'New Name');
  userEvent.type(emailAddress, 'new@email.com');
  userEvent.type(newPassword, '123456789');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);
  await waitForPopper();

  expect(userActions.setUser.mock.calls.length).toBe(0);
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 5 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    id: 999,
    open: true,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  userActions.setUser = jest.fn();

  userActions.setUser.mockImplementation(() => async dispatch => {
    const error = { message: 'Username is already in use.' };
    dispatch({ type: SET_USER_ERROR, error });
    return null;
  });
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

  userEvent.clear(userName);
  userEvent.clear(personalName);
  userEvent.clear(emailAddress);
  userEvent.clear(newPassword);
  userEvent.clear(confirmNewPassword);

  userEvent.type(userName, 'new-user-name');
  userEvent.type(personalName, 'New Name');
  userEvent.type(emailAddress, 'new@email.com');
  userEvent.type(newPassword, '123456789');
  userEvent.type(confirmNewPassword, '123456789');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);
  await waitForPopper();

  await waitFor(() => {
    expect(userActions.setUser.mock.calls.length).toBe(1);
  });

  expect(userActions.setUser.mock.calls[0]).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 6 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    id: 999,
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
  const emailAddress = await screen.findByRole('textbox', {
    name: /email address/i
  });
  const newPassword = await screen.findByLabelText('New password');
  const confirmNewPassword = await screen.findByLabelText(
    'Confirm new password'
  );

  expect(serialize()).toMatchSnapshot();

  userEvent.clear(userName);
  userEvent.clear(emailAddress);
  userEvent.clear(newPassword);
  userEvent.clear(confirmNewPassword);

  userEvent.type(userName, 'new-user-name');
  userEvent.type(emailAddress, 'new@email.com');
  userEvent.type(newPassword, '123456789');
  userEvent.type(confirmNewPassword, '123456789');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);
  await waitForPopper();

  await waitFor(() => {
    expect(userActions.setUser.mock.calls.length).toBe(1);
  });

  expect(userActions.setUser.mock.calls[0]).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 7 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    id: 999,
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

  expect(serialize()).toMatchSnapshot();

  userEvent.clear(userName);
  userEvent.clear(personalName);
  userEvent.clear(emailAddress);

  userEvent.type(userName, 'new-user-name');
  userEvent.type(personalName, 'New Name');
  userEvent.type(emailAddress, 'new@email.com');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);
  await waitForPopper();

  expect(userActions.setUser.mock.calls.length).toBe(1);
  expect(userActions.setUser.mock.calls[0]).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  const closeButton = await screen.findByRole('button', { name: /close/i });
  userEvent.click(closeButton);
  await waitForPopper();
  expect(props.onCancel.mock.calls.length).toBe(1);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 8 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    id: 999,
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
  const newPassword = await screen.findByLabelText('New password');
  const confirmNewPassword = await screen.findByLabelText(
    'Confirm new password'
  );

  expect(serialize()).toMatchSnapshot();

  userEvent.clear(userName);
  userEvent.clear(personalName);
  userEvent.clear(newPassword);
  userEvent.clear(confirmNewPassword);

  userEvent.type(userName, 'new-user-name');
  userEvent.type(personalName, 'New Name');
  userEvent.type(newPassword, '123456789');
  userEvent.type(confirmNewPassword, '123456789');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);
  await waitForPopper();

  expect(userActions.setUser.mock.calls.length).toBe(0);
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 9 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    open: true,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  userActions.getUser = jest.fn();

  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'anonymous',
      personalname: '',
      email: '',
      id: 222,
      roles: ['participant'],
      is_anonymous: true,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: false,
            is_complete: false,
            scenario_id: 99,
            event_id: 1902,
            created_at: 1602454306144,
            generic:
              '{participant} canceled their request to join {scenario} as {persona}.',
            persona: { id: 2, name: 'Student' },
            name: 'slide-arrival',
            url: 'http://localhost:3000/cohort/1/run/99/slide/1'
          }
        }
      }
    };
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });
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
  await waitForPopper();

  expect(userActions.setUser.mock.calls.length).toBe(0);
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 10 1', async done => {
  const Component = UserSettings;
  const props = {
    ...commonProps,
    id: 999,
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
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Validation', async done => {
  const Component = UserSettings;

  const props = {
    ...commonProps,
    id: 999,
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

  expect(serialize()).toMatchSnapshot();

  userEvent.clear(userName);
  userEvent.clear(personalName);
  userEvent.clear(emailAddress);

  userEvent.type(userName, 'super');
  userEvent.type(personalName, 'Super User');
  userEvent.type(emailAddress, 'super@email.com');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);

  expect(userActions.setUser.mock.calls.length).toBe(1);
  expect(userActions.setUser.mock.calls[0]).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  const closeButton = await screen.findByRole('button', { name: /close/i });
  userEvent.click(closeButton);
  expect(props.onCancel.mock.calls.length).toBe(1);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Non-username error', async done => {
  const Component = UserSettings;

  const props = {
    ...commonProps,
    id: 999,
    open: true,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  userActions.setUser = jest.fn();
  userActions.setUser.mockImplementation(() => async dispatch => {
    const error = { message: 'Some other error' };
    dispatch({ type: SET_USER_ERROR, error });
    return null;
  });
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

  userEvent.clear(userName);
  userEvent.clear(personalName);
  userEvent.clear(emailAddress);
  userEvent.clear(newPassword);
  userEvent.clear(confirmNewPassword);

  userEvent.type(userName, 'new-user-name');
  userEvent.type(personalName, 'New Name');
  userEvent.type(emailAddress, 'new@email.com');
  userEvent.type(newPassword, '123456789');
  userEvent.type(confirmNewPassword, '123456789');

  const saveButton = await screen.findByRole('button', { name: /save/i });

  userEvent.click(saveButton);

  await waitFor(() => {
    expect(userActions.setUser.mock.calls.length).toBe(1);
  });

  expect(userActions.setUser.mock.calls[0]).toMatchSnapshot();
  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  done();
});
