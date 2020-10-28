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
  SET_COHORT_USER_ROLE_SUCCESS,
  GET_COHORT_SUCCESS,
  GET_USER_SUCCESS,
  GET_USERS_SUCCESS,
} from '../../actions/types';
import * as cohortActions from '../../actions/cohort';
import * as userActions from '../../actions/user';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/cohort');
jest.mock('../../actions/user');
jest.mock('../../actions/users');
jest.mock('@components/Cohorts/DataTable', () => {
  return (props) => <div>@components/Cohorts/DataTable</div>;
});
jest.mock('@components/Cohorts/CohortParticipants', () => {
  return (props) => <div>@components/Cohorts/CohortParticipants</div>;
});
jest.mock('@components/Cohorts/CohortScenarios', () => {
  return (props) => <div>@components/Cohorts/CohortScenarios</div>;
});

import Cohort from '../../components/Cohorts/Cohort.jsx';

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

  cohortActions.getCohort = jest.fn();
  cohortActions.getCohort.mockImplementation(() => async (dispatch) => {
    const cohort = {
      id: 1,
      created_at: '2020-08-31T14:01:08.656Z',
      name: 'A New Cohort That Exists Within Inline Props',
      runs: [],
      scenarios: [99],
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true,
        },
        {
          id: 555,
          email: 'regs@email.com',
          username: 'regs',
          cohort_id: 1,
          roles: ['researcher'],
          is_anonymous: false,
          is_super: false,
        },
      ],
      roles: ['super', 'facilitator'],
      usersById: {
        999: {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true,
        },
        555: {
          id: 555,
          email: 'regs@email.com',
          username: 'regs',
          cohort_id: 1,
          roles: ['researcher'],
          is_anonymous: false,
          is_super: false,
        },
      },
    };
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });
  cohortActions.linkUserToCohort = jest.fn();
  cohortActions.linkUserToCohort.mockImplementation(() => async (dispatch) => {
    const cohort = {
      id: 1,
      created_at: '2020-08-31T14:01:08.656Z',
      name: 'A New Cohort That Exists Within Inline Props',
      runs: [],
      scenarios: [99],
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true,
        },
        {
          id: 555,
          email: 'regs@email.com',
          username: 'regs',
          cohort_id: 1,
          roles: ['researcher'],
          is_anonymous: false,
          is_super: false,
        },
      ],
      roles: ['super', 'facilitator'],
      usersById: {
        999: {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true,
        },
        555: {
          id: 555,
          email: 'regs@email.com',
          username: 'regs',
          cohort_id: 1,
          roles: ['researcher'],
          is_anonymous: false,
          is_super: false,
        },
      },
    };
    dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS, cohort });
    return cohort;
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
  usersActions.getUsers = jest.fn();
  usersActions.getUsers.mockImplementation(() => async (dispatch) => {
    const users = [
      {
        username: 'super',
        personalname: 'Super User',
        email: 'super@email.com',
        id: 999,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_anonymous: false,
        is_super: true,
      },
      {
        username: 'regs',
        personalname: 'Regs User',
        email: 'regs@email.com',
        id: 555,
        roles: ['participant', 'facilitator', 'researcher'],
        is_anonymous: false,
        is_super: false,
      },
    ];
    dispatch({ type: GET_USERS_SUCCESS, users });
    return users;
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

test('Cohort', () => {
  expect(Cohort).toBeDefined();
});

test('Render 1 1', async (done) => {
  const Component = Cohort;

  const props = {
    ...commonProps,
    id: 2,
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

/*{INJECTION}*/

