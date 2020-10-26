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

import Identity from '@utils/Identity';
jest.mock('@utils/Identity', () => {
  let count = 0;
  return {
    ...jest.requireActual('@utils/Identity'),
    id() {
      return ++count;
    },
  };
});
import ScenariosList from '../../components/ScenariosList/index.jsx';

import {
  GET_COHORT_SUCCESS,
  GET_SCENARIOS_COUNT_SUCCESS,
  GET_SCENARIOS_SUCCESS,
  GET_USER_SUCCESS,
  GET_USERS_SUCCESS,
} from '../../actions/types';
import * as cohortActions from '../../actions/cohort';
import * as scenarioActions from '../../actions/scenario';
import * as userActions from '../../actions/user';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/cohort');
jest.mock('../../actions/scenario');
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
      scenarios: [42, 99],
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
  scenarioActions.getScenariosCount = jest.fn();
  scenarioActions.getScenariosCount.mockImplementation(
    () => async (dispatch) => {
      const count = 1;
      dispatch({ type: GET_SCENARIOS_COUNT_SUCCESS, count });
      return count;
    }
  );

  scenarioActions.getScenariosSlice = jest.fn();
  scenarioActions.getScenariosSlice.mockImplementation(
    () => async (dispatch) => {
      const scenarios = [
        {
          author: {
            id: 999,
            username: 'super',
            personalname: 'Super User',
            email: 'super@email.com',
            is_anonymous: false,
            roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
            is_super: true,
          },
          categories: [],
          consent: { id: 57, prose: '' },
          description: 'A Multiplayer Scenario',
          finish: {
            id: 1,
            title: '',
            components: [
              { html: '<h2>Thanks for participating!</h2>', type: 'Text' },
            ],
            is_finish: true,
          },
          lock: {
            scenario_id: 42,
            user_id: 999,
            created_at: '2020-02-31T23:54:19.934Z',
            ended_at: null,
          },
          slides: [
            {
              id: 1,
              title: '',
              components: [
                { html: '<h2>Thanks for participating!</h2>', type: 'Text' },
              ],
              is_finish: true,
            },
            {
              id: 2,
              title: '',
              components: [
                {
                  id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
                  html: '<p>paragraph</p>',
                  type: 'Text',
                },
                {
                  id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
                  type: 'TextResponse',
                  header: 'TextResponse-1',
                  prompt: '',
                  timeout: 0,
                  recallId: '',
                  required: true,
                  responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
                  placeholder: 'Your response',
                },
                {
                  id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
                  html: '<p>?</p>',
                  type: 'Text',
                },
              ],
              is_finish: false,
            },
          ],
          status: 1,
          title: 'Multiplayer Scenario',
          users: [
            {
              id: 999,
              email: 'super@email.com',
              username: 'super',
              personalname: 'Super User',
              roles: ['super'],
              is_super: true,
              is_author: true,
              is_reviewer: false,
            },
          ],
          id: 42,
          created_at: '2020-08-31T17:50:28.089Z',
          updated_at: null,
          deleted_at: null,
        },
      ];
      dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
      return scenarios;
    }
  );
  usersActions.getUser = jest.fn();
  usersActions.getUser.mockImplementation(() => async (dispatch) => {
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

test('ScenariosList', () => {
  expect(ScenariosList).toBeDefined();
});

test('Render 1 1', async (done) => {
  const Component = ScenariosList;

  const props = {
    ...commonProps,
    title: '',
    description: '',
    id: '',
    onClick() {},
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const mounted = mounter(ConnectedRoutedComponent);
  expect(snapshotter(mounted)).toMatchSnapshot();
  expect(
    snapshotter(mounted.findWhere((n) => n.type() === Component))
  ).toMatchSnapshot();

  const shallowRendered = shallow(<ConnectedRoutedComponent />);
  expect(snapshotter(shallowRendered)).toMatchSnapshot();

  done();
});

test('Render 2 1', async (done) => {
  const Component = ScenariosList;

  const props = {
    ...commonProps,
    title: '',
    description: '',
    id: '',
    onClick() {},
    scenarios: [
      {
        author: {
          id: 999,
          username: 'super',
          personalname: 'Super User',
          email: 'super@email.com',
          is_anonymous: false,
          roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
          is_super: true,
        },
        categories: [],
        consent: { id: 57, prose: '' },
        description: 'A Multiplayer Scenario',
        finish: {
          id: 1,
          title: '',
          components: [
            { html: '<h2>Thanks for participating!</h2>', type: 'Text' },
          ],
          is_finish: true,
        },
        lock: {
          scenario_id: 42,
          user_id: 999,
          created_at: '2020-02-31T23:54:19.934Z',
          ended_at: null,
        },
        slides: [
          {
            id: 1,
            title: '',
            components: [
              { html: '<h2>Thanks for participating!</h2>', type: 'Text' },
            ],
            is_finish: true,
          },
          {
            id: 2,
            title: '',
            components: [
              {
                id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
                html: '<p>paragraph</p>',
                type: 'Text',
              },
              {
                id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
                type: 'TextResponse',
                header: 'TextResponse-1',
                prompt: '',
                timeout: 0,
                recallId: '',
                required: true,
                responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
                placeholder: 'Your response',
              },
              {
                id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
                html: '<p>?</p>',
                type: 'Text',
              },
            ],
            is_finish: false,
          },
        ],
        status: 1,
        title: 'Multiplayer Scenario',
        users: [
          {
            id: 999,
            email: 'super@email.com',
            username: 'super',
            personalname: 'Super User',
            roles: ['super'],
            is_super: true,
            is_author: true,
            is_reviewer: false,
          },
        ],
        id: 42,
        created_at: '2020-08-31T17:50:28.089Z',
        updated_at: null,
        deleted_at: null,
      },
    ],
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const mounted = mounter(ConnectedRoutedComponent);
  expect(snapshotter(mounted)).toMatchSnapshot();
  expect(
    snapshotter(mounted.findWhere((n) => n.type() === Component))
  ).toMatchSnapshot();

  const shallowRendered = shallow(<ConnectedRoutedComponent />);
  expect(snapshotter(shallowRendered)).toMatchSnapshot();

  done();
});

/*{INJECTION}*/

