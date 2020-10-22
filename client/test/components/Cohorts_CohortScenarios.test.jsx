import React from 'react';
import assert from 'assert';
import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshotter,
  state,
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';
import { mount, render, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CohortScenarios from '../../components/Cohorts/CohortScenarios.jsx';

import {
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

const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  fetch.mockRestore();
});

beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  cohortActions.getCohort = jest.fn();
  cohortActions.getCohort.mockImplementation(() => async (dispatch) => {
    const cohort = {
      id: 2,
      created_at: '2020-08-31T14:01:08.656Z',
      name: 'A New Cohort That Exists Within Inline Props',
      runs: [],
      scenarios: [],
      users: [
        {
          id: 999,
          email: 'owner@email.com',
          username: 'owner',
          cohort_id: 2,
          roles: ['owner', 'facilitator'],
          is_anonymous: false,
          is_owner: true,
        },
      ],
      roles: ['owner', 'facilitator'],
      usersById: {
        999: {
          id: 999,
          email: 'owner@email.com',
          username: 'owner',
          cohort_id: 2,
          roles: ['owner', 'facilitator'],
          is_anonymous: false,
          is_owner: true,
        },
      },
    };
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });
  cohortActions.setCohort = jest.fn();
  cohortActions.setCohort.mockImplementation((cohort) => async (dispatch) => {
    dispatch({ type: SET_COHORT_SUCCESS, cohort });
    return cohort;
  });
  usersActions.getUser = jest.fn();
  usersActions.getUser.mockImplementation(() => async (dispatch) => {
    const user = {
      id: 999,
      email: 'owner@email.com',
      username: 'owner',
      personalname: 'Owner Account',
      roles: ['owner'],
      is_owner: true,
      is_author: true,
      is_reviewer: false,
    };
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });
  usersActions.getUsers = jest.fn();
  usersActions.getUsers.mockImplementation(() => async (dispatch) => {
    const users = [
      {
        id: 999,
        email: 'owner@email.com',
        username: 'owner',
        personalname: 'Owner Account',
        roles: ['owner'],
        is_owner: true,
        is_author: true,
        is_reviewer: false,
      },
    ];
    dispatch({ type: GET_USERS_SUCCESS, users });
    return users;
  });

  commonProps = {
    history: {
      push() {},
    },
  };

  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  fetch.mockReset();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('CohortScenarios', () => {
  expect(CohortScenarios).toBeDefined();
});

test('Snapshot 1 1', async (done) => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    authority: {},
  };

  const state = {
    ...commonState,
  };

  const reduxed = reduxer(Component, props, state);
  const wrapper = mounter(reduxed);
  expect(snapshotter(reduxed)).toMatchSnapshot();
  expect(snapshotter(wrapper)).toMatchSnapshot();

  const component = wrapper.findWhere((n) => {
    return n.type() === Component;
  });
  expect(snapshotter(component)).toMatchSnapshot();

  // console.log(component.props());
  // console.log(component.html());

  expect(snapshotter(component)).toMatchSnapshot();
  done();
});

/*{INJECTION}*/

