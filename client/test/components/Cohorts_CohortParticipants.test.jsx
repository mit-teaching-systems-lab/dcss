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

import {
  GET_COHORT_SUCCESS,
  SET_COHORT_SUCCESS,
  GET_RUNS_SUCCESS,
  GET_USER_SUCCESS,
  GET_USERS_SUCCESS
} from '../../actions/types';
import * as cohortActions from '../../actions/cohort';
import * as runActions from '../../actions/run';
import * as userActions from '../../actions/user';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/cohort');
jest.mock('../../actions/run');
jest.mock('../../actions/user');
jest.mock('../../actions/users');

import Layout from '@utils/Layout';
jest.mock('@utils/Layout', () => {
  return {
    ...jest.requireActual('@utils/Layout'),
    isForMobile: jest.fn(() => false),
    isNotForMobile: jest.fn(() => true)
  };
});

import copy from 'copy-text-to-clipboard';
jest.mock('copy-text-to-clipboard', () => {
  return jest.fn();
});

import Storage from '@utils/Storage';
jest.mock('@utils/Storage', () => {
  return {
    ...jest.requireActual('@utils/Storage'),
    get: jest.fn(),
    set: jest.fn()
  };
});

import { notify } from '@components/Notification';
jest.mock('@components/Notification', () => {
  return {
    ...jest.requireActual('@components/Notification'),
    notify: jest.fn()
  };
});

import CohortParticipants from '../../components/Cohorts/CohortParticipants.jsx';
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

  Layout.isForMobile = jest.fn();

  Layout.isForMobile.mockImplementation(() => false);

  Layout.isNotForMobile = jest.fn();

  Layout.isNotForMobile.mockImplementation(() => true);

  cohortActions.getCohort = jest.fn();

  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    const cohort = {
      id: 1,
      created_at: '2020-08-31T14:01:08.656Z',
      name: 'A New Cohort That Exists Within Inline Props',
      is_archived: false,
      runs: [
        {
          id: 11,
          user_id: 333,
          scenario_id: 99,
          created_at: '2020-03-28T19:44:03.069Z',
          updated_at: '2020-03-31T17:01:43.139Z',
          ended_at: '2020-03-31T17:01:43.128Z',
          consent_id: 8,
          consent_acknowledged_by_user: true,
          consent_granted_by_user: true,
          referrer_params: null,
          cohort_id: 1,
          run_id: 11
        }
      ],
      scenarios: [99],
      users: [
        {
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
                is_complete: true,
                event_id: 1909,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        },
        {
          username: 'facilitator',
          personalname: 'Facilitator User',
          email: 'facilitator@email.com',
          id: 555,
          roles: ['participant', 'facilitator', 'researcher', 'owner'],
          is_anonymous: false,
          is_super: false,
          is_owner: true,
          progress: {
            completed: [],
            latestByScenarioId: {
              1: {
                is_complete: false,
                scenario_id: 99,
                event_id: 1905,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        },
        {
          username: 'researcher',
          personalname: 'Researcher User',
          email: 'researcher@email.com',
          id: 444,
          roles: ['participant', 'researcher'],
          is_anonymous: false,
          is_super: false,
          progress: {
            completed: [],
            latestByScenarioId: {
              1: {
                is_complete: false,
                scenario_id: 99,
                event_id: 1904,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        },
        {
          username: 'participant',
          personalname: 'Participant User',
          email: 'participant@email.com',
          id: 333,
          roles: ['participant'],
          is_anonymous: false,
          is_super: false,
          progress: {
            completed: [],
            latestByScenarioId: {
              1: {
                is_complete: false,
                scenario_id: 99,
                event_id: 1903,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        },
        {
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
                is_complete: false,
                scenario_id: 99,
                event_id: 1902,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        }
      ],
      roles: ['super', 'facilitator'],
      usersById: {
        999: {
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
                is_complete: true,
                event_id: 1909,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        },
        555: {
          username: 'facilitator',
          personalname: 'Facilitator User',
          email: 'facilitator@email.com',
          id: 555,
          roles: ['participant', 'facilitator', 'researcher', 'owner'],
          is_anonymous: false,
          is_super: false,
          is_owner: true,
          progress: {
            completed: [],
            latestByScenarioId: {
              1: {
                is_complete: false,
                scenario_id: 99,
                event_id: 1905,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        },
        444: {
          username: 'researcher',
          personalname: 'Researcher User',
          email: 'researcher@email.com',
          id: 444,
          roles: ['participant', 'researcher'],
          is_anonymous: false,
          is_super: false,
          progress: {
            completed: [],
            latestByScenarioId: {
              1: {
                is_complete: false,
                scenario_id: 99,
                event_id: 1904,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        },
        333: {
          username: 'participant',
          personalname: 'Participant User',
          email: 'participant@email.com',
          id: 333,
          roles: ['participant'],
          is_anonymous: false,
          is_super: false,
          progress: {
            completed: [],
            latestByScenarioId: {
              1: {
                is_complete: false,
                scenario_id: 99,
                event_id: 1903,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        },
        222: {
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
                is_complete: false,
                scenario_id: 99,
                event_id: 1902,
                created_at: 1602454306144,
                generic: 'arrived at a slide.',
                name: 'slide-arrival',
                url: 'http://localhost:3000/cohort/1/run/99/slide/1'
              }
            }
          }
        }
      }
    };
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });
  usersActions.getUser = jest.fn();

  usersActions.getUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'facilitator',
      personalname: 'Facilitator User',
      email: 'facilitator@email.com',
      id: 555,
      roles: ['participant', 'facilitator', 'researcher', 'owner'],
      is_anonymous: false,
      is_super: false,
      is_owner: true,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            is_complete: false,
            scenario_id: 99,
            event_id: 1905,
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
  usersActions.getUsers = jest.fn();

  usersActions.getUsers.mockImplementation(() => async dispatch => {
    const users = [
      {
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
              is_complete: true,
              event_id: 1909,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      {
        username: 'facilitator',
        personalname: 'Facilitator User',
        email: 'facilitator@email.com',
        id: 555,
        roles: ['participant', 'facilitator', 'researcher', 'owner'],
        is_anonymous: false,
        is_super: false,
        is_owner: true,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1905,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      {
        username: 'researcher',
        personalname: 'Researcher User',
        email: 'researcher@email.com',
        id: 444,
        roles: ['participant', 'researcher'],
        is_anonymous: false,
        is_super: false,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1904,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      {
        username: 'participant',
        personalname: 'Participant User',
        email: 'participant@email.com',
        id: 333,
        roles: ['participant'],
        is_anonymous: false,
        is_super: false,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1903,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      {
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
              is_complete: false,
              scenario_id: 99,
              event_id: 1902,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      }
    ];
    dispatch({ type: GET_USERS_SUCCESS, users });
    return users;
  });

  Storage.get.mockImplementation(key => {
    return null;
  });

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

test('CohortParticipants', () => {
  expect(CohortParticipants).toBeDefined();
});

test('Render 1 1', async done => {
  /** @GENERATED: BEGIN **/
  const Component = CohortParticipants;
  const props = {
    ...commonProps,
    id: 1,
    authority: { isFacilitator: true, isParticipant: true }
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  /** @GENERATED: END **/

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByRole('navigation', { name: /pagination navigation/i });
  expect(asFragment()).toMatchSnapshot();

  done();
});

/* INJECTION STARTS HERE */

test('Search participants', async done => {
  const Component = CohortParticipants;

  const props = {
    ...commonProps,
    id: 1,
    authority: { isFacilitator: true, isParticipant: true }
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await screen.findByRole('navigation', { name: /pagination navigation/i });
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(serialize()).toMatchSnapshot();

  const searchInput = await screen.findByLabelText('Search participants');

  // "researcher"
  userEvent.type(searchInput, 'resea{enter}');
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1);
  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(serialize()).toMatchSnapshot();

  userEvent.type(searchInput, '{selectall}{backspace}');
  expect(serialize()).toMatchSnapshot();

  // "owner"
  userEvent.type(searchInput, 'owner{enter}');
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1);
  expect(setTimeout).toHaveBeenCalledTimes(3);
  expect(serialize()).toMatchSnapshot();

  // "researcher@email.com"
  userEvent.type(searchInput, '{selectall}{backspace}');
  userEvent.type(searchInput, 'researcher@email.com{enter}');
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1);
  expect(setTimeout).toHaveBeenCalledTimes(4);
  expect(serialize()).toMatchSnapshot();

  userEvent.type(
    searchInput,
    '{selectall}{backspace}nothing will match this{enter}'
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.type(searchInput, '{selectall}{backspace}');
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1);
  expect(setTimeout).toHaveBeenCalledTimes(5);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Pagination', async done => {
  const Component = CohortParticipants;

  const props = {
    ...commonProps,
    rowsPerPage: 2,
    id: 1,
    authority: { isFacilitator: true, isParticipant: true }
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  const pagination = await screen.findByRole('navigation', {
    name: /pagination navigation/i
  });
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.getByText('2'));
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.getByText('3'));
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.getByText('1'));
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Modal close', async done => {
  const Component = CohortParticipants;

  const onClose = jest.fn();
  const props = {
    ...commonProps,
    onClose,
    rowsPerPage: 2,
    id: 1,
    authority: { isFacilitator: true, isParticipant: true }
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await screen.findByRole('navigation', { name: /pagination navigation/i });
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Close'));

  expect(onClose).toHaveBeenCalledTimes(1);
  done();
});

test('Super admin', async done => {
  const Component = CohortParticipants;

  Storage.get.mockImplementation(key => {
    return {
      refresh: true
    };
  });

  const props = {
    ...commonProps,
    id: 1,
    authority: { isFacilitator: true, isParticipant: true }
  };

  const state = {
    ...commonState,
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

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await screen.findByRole('navigation', { name: /pagination navigation/i });
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Participant only', async done => {
  const Component = CohortParticipants;

  const props = {
    ...commonProps,
    id: 1,
    authority: { isFacilitator: false, isParticipant: true }
  };

  const state = {
    ...commonState,
    user: {
      username: 'participant',
      personalname: 'Participant User',
      email: 'participant@email.com',
      id: 333,
      roles: ['participant'],
      is_anonymous: false,
      is_super: false
    }
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Researcher only', async done => {
  const Component = CohortParticipants;

  const props = {
    ...commonProps,
    id: 1,
    authority: { isFacilitator: false, isParticipant: true }
  };

  const state = {
    ...commonState,
    user: {
      username: 'researcher',
      personalname: 'Researcher User',
      email: 'researcher@email.com',
      id: 444,
      roles: ['participant', 'researcher'],
      is_anonymous: false,
      is_super: false
    }
  };
  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});
