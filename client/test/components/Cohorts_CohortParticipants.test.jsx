import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshot,
  state,
} from '../bootstrap';
import {
  unmountComponentAtNode
} from 'react-dom';
import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/react';
import CohortParticipants from '../../components/Cohorts/CohortParticipants.jsx';

import {
  GET_COHORT_SUCCESS,
  GET_USER_SUCCESS,
  GET_USERS_SUCCESS,
} from '../../actions/types';
import {
  getCohort
} from '../../actions/cohort';
import {
  getUser
} from '../../actions/user';
import {
  getUsers
} from '../../actions/users';
jest.mock('../../actions/cohort');
jest.mock('../../actions/user');
jest.mock('../../actions/users');

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  getCohort.mockImplementation(() => async (dispatch) => {
    const cohort = {
      id: 2,
      created_at: '2020-08-31T14:01:08.656Z',
      name: 'A New Cohort That Exists Within Inline Props',
      runs: [],
      scenarios: [],
      users: [{
        id: 2,
        email: 'owner@email.com',
        username: 'owner',
        cohort_id: 2,
        roles: ['owner', 'facilitator'],
        is_anonymous: false,
        is_owner: true,
      }, ],
      roles: ['owner', 'facilitator'],
      usersById: {
        2: {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          cohort_id: 2,
          roles: ['owner', 'facilitator'],
          is_anonymous: false,
          is_owner: true,
        },
      },
    };
    dispatch({
      type: GET_COHORT_SUCCESS,
      cohort
    });
    return cohort;
  });
  getUser.mockImplementation(() => async (dispatch) => {
    const user = {
      id: 2,
      email: 'owner@email.com',
      username: 'owner',
      personalname: 'Owner Account',
      roles: ['owner'],
      is_owner: true,
      is_author: true,
      is_reviewer: false,
    };
    dispatch({
      type: GET_USER_SUCCESS,
      user
    });
    return user;
  });
  getUsers.mockImplementation(() => async (dispatch) => {
    const users = [{
      id: 2,
      email: 'owner@email.com',
      username: 'owner',
      personalname: 'Owner Account',
      roles: ['owner'],
      is_owner: true,
      is_author: true,
      is_reviewer: false,
    }, ];
    dispatch({
      type: GET_USERS_SUCCESS,
      users
    });
    return users;
  });
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const sharedProps = {
  history: {
    push() {},
  },
};

test('CohortParticipants', () => {
  expect(CohortParticipants).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    authority: {},
  };
  const mounted = mounter(reduxer(CohortParticipants, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
