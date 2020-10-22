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
import History from '../../components/History/index.jsx';

import {
  GET_RUNS_SUCCESS,
  GET_SCENARIOS_SUCCESS,
  GET_USER_SUCCESS,
  GET_USERS_SUCCESS,
} from '../../actions/types';
import * as runActions from '../../actions/run';
import * as scenarioActions from '../../actions/scenario';
import * as userActions from '../../actions/user';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/run');
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
  fetch.mockRestore();
});

beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  runActions.getRuns = jest.fn();
  runActions.getRuns.mockImplementation(() => async (dispatch) => {
    const runs = [
      {
        id: 60,
        user_id: 999,
        scenario_id: 42,
        created_at: '2020-09-01T15:59:39.571Z',
        updated_at: '2020-09-01T15:59:47.121Z',
        ended_at: null,
        consent_id: 57,
        consent_acknowledged_by_user: true,
        consent_granted_by_user: true,
        referrer_params: null,
      },
    ];
    dispatch({ type: GET_RUNS_SUCCESS, runs });
    return runs;
  });

  scenarioActions.getScenariosIncrementally = jest.fn();
  scenarioActions.getScenariosIncrementally.mockImplementation(
    () => async (dispatch) => {
      const scenarios = [
        {
          author: {
            id: 999,
            username: 'owner',
            personalname: 'Owner Account',
            email: 'owner@email.com',
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
            created_at: '2020-10-10T23:54:19.934Z',
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
                  prompt: ',timeout: 0,recallId: ',
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
              email: 'owner@email.com',
              username: 'owner',
              personalname: 'Owner Account',
              roles: ['owner'],
              is_owner: true,
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

  userActions.getUser = jest.fn();
  userActions.getUser.mockImplementation(() => async (dispatch) => {
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

test('History', () => {
  expect(History).toBeDefined();
});

test('Snapshot 1 1', async () => {
  const Component = History;

  const props = {
    ...commonProps,
    scenario: {
      author: {
        id: 999,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
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
        created_at: '2020-10-10T23:54:19.934Z',
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
              prompt: ',timeout: 0,recallId: ',
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
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false,
        },
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null,
    },
  };

  const state = {
    ...{},
  };

  const reduxed = reduxer(Component, props, state);
  const mounted = mounter(reduxed, container);
  expect(snapshotter(mounted)).toMatchSnapshot();
});

test('Snapshot 1 2', async () => {
  const Component = History;

  const props = {
    ...commonProps,
    scenario: {
      author: {
        id: 999,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
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
        created_at: '2020-10-10T23:54:19.934Z',
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
              prompt: ',timeout: 0,recallId: ',
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
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false,
        },
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null,
    },
  };

  const state = {
    ...commonState,
  };

  const reduxed = reduxer(Component, props, state);
  const mounted = mounter(reduxed, container);
  expect(snapshotter(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/

