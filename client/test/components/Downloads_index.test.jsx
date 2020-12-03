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

import {
  GET_COHORTS_SUCCESS,
  GET_RUN_HISTORY_SUCCESS,
  GET_USER_SUCCESS,
  GET_SCENARIOS_SUCCESS
} from '../../actions/types';
import * as cohortActions from '../../actions/cohort';
import * as historyActions from '../../actions/history';
import * as scenarioActions from '../../actions/scenario';
import * as userActions from '../../actions/user';
jest.mock('../../actions/cohort');
jest.mock('../../actions/history');
jest.mock('../../actions/scenario');
jest.mock('../../actions/user');

jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime());

import Downloads from '../../components/Downloads/index.jsx';

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

  cohortActions.getCohorts = jest.fn();
  cohortActions.getCohorts.mockImplementation(() => async dispatch => {
    const cohorts = [
      {
        id: 1,
        created_at: '2020-08-31T14:01:08.656Z',
        name: 'A New Cohort That Exists Within Inline Props',
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
            is_super: true
          },
          {
            username: 'facilitator',
            personalname: 'Facilitator User',
            email: 'facilitator@email.com',
            id: 555,
            roles: ['participant', 'facilitator', 'researcher', 'owner'],
            is_anonymous: false,
            is_super: false,
            is_owner: true
          },
          {
            username: 'researcher',
            personalname: 'Researcher User',
            email: 'researcher@email.com',
            id: 444,
            roles: ['participant', 'researcher'],
            is_anonymous: false,
            is_super: false
          },
          {
            username: 'participant',
            personalname: 'Participant User',
            email: 'participant@email.com',
            id: 333,
            roles: ['participant'],
            is_anonymous: false,
            is_super: false
          },
          {
            username: 'anonymous',
            personalname: '',
            email: '',
            id: 222,
            roles: ['participant'],
            is_anonymous: true,
            is_super: false
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
            is_super: true
          },
          555: {
            username: 'facilitator',
            personalname: 'Facilitator User',
            email: 'facilitator@email.com',
            id: 555,
            roles: ['participant', 'facilitator', 'researcher', 'owner'],
            is_anonymous: false,
            is_super: false,
            is_owner: true
          },
          444: {
            username: 'researcher',
            personalname: 'Researcher User',
            email: 'researcher@email.com',
            id: 444,
            roles: ['participant', 'researcher'],
            is_anonymous: false,
            is_super: false
          },
          333: {
            username: 'participant',
            personalname: 'Participant User',
            email: 'participant@email.com',
            id: 333,
            roles: ['participant'],
            is_anonymous: false,
            is_super: false
          },
          222: {
            username: 'anonymous',
            personalname: '',
            email: '',
            id: 222,
            roles: ['participant'],
            is_anonymous: true,
            is_super: false
          }
        }
      }
    ];
    dispatch({ type: GET_COHORTS_SUCCESS, cohorts });
    return cohorts;
  });
  historyActions.getHistoryForScenario = jest.fn();
  historyActions.getHistoryForScenario.mockImplementation(
    () => async dispatch => {
      const history = {
        prompts: [
          {
            slide: {
              id: 38,
              title: '',
              components: [
                {
                  id: 'd28c0557-4301-41cb-b84c-3810e2a9e601',
                  type: 'MultiPathResponse',
                  paths: [
                    { value: 39, display: 'Go to Slide #2' },
                    { value: 37, display: 'Go to Finish' }
                  ],
                  header: 'MultiPathResponse-0',
                  prompt: '',
                  timeout: 0,
                  recallId: '',
                  required: true,
                  responseId: '91273087-c17a-4fff-b1a9-32e28942bd62',
                  disableRequireCheckbox: true,
                  disableDefaultNavigation: true
                }
              ],
              is_finish: false
            },
            id: 'd28c0557-4301-41cb-b84c-3810e2a9e601',
            type: 'MultiPathResponse',
            paths: [
              { value: 39, display: 'Go to Slide #2' },
              { value: 37, display: 'Go to Finish' }
            ],
            header: 'MultiPathResponse-0',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: '91273087-c17a-4fff-b1a9-32e28942bd62',
            disableRequireCheckbox: true,
            disableDefaultNavigation: true
          }
        ],
        responses: []
      };
      dispatch({ type: GET_RUN_HISTORY_SUCCESS, history });
      return { ...history };
    }
  );
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
  scenarioActions.getScenariosIncrementally = jest.fn();
  scenarioActions.getScenariosIncrementally.mockImplementation(
    () => async dispatch => {
      const scenarios = [
        {
          author: {
            id: 999,
            username: 'super',
            personalname: 'Super User',
            email: 'super@email.com',
            is_anonymous: false,
            roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
            is_super: true
          },
          categories: [],
          consent: { id: 57, prose: '' },
          description: "This is the description of 'A Multiplayer Scenario'",
          finish: {
            id: 1,
            title: '',
            components: [
              { html: '<h2>Thanks for participating!</h2>', type: 'Text' }
            ],
            is_finish: true
          },
          lock: {
            scenario_id: 42,
            user_id: 999,
            created_at: '2020-02-31T23:54:19.934Z',
            ended_at: null
          },
          slides: [
            {
              id: 1,
              title: '',
              components: [
                { html: '<h2>Thanks for participating!</h2>', type: 'Text' }
              ],
              is_finish: true
            },
            {
              id: 2,
              title: '',
              components: [
                {
                  id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
                  html: '<p>paragraph</p>',
                  type: 'Text'
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
                  placeholder: 'Your response'
                },
                {
                  id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
                  html: '<p>?</p>',
                  type: 'Text'
                }
              ],
              is_finish: false
            }
          ],
          status: 1,
          title: 'Multiplayer Scenario 2',
          users: [
            {
              id: 999,
              email: 'super@email.com',
              username: 'super',
              personalname: 'Super User',
              roles: ['super'],
              is_super: true,
              is_author: true,
              is_reviewer: false
            }
          ],
          id: 42,
          created_at: '2020-08-31T17:50:28.089Z',
          updated_at: null,
          deleted_at: null,
          labels: ['a', 'b'],
          personas: [
            {
              id: 1,
              name: 'Participant',
              description:
                'The default user participating in a single person scenario.',
              color: '#FFFFFF',
              created_at: '2020-12-01T15:49:04.962Z',
              updated_at: null,
              deleted_at: null,
              author_id: 3,
              is_read_only: true,
              is_shared: true
            }
          ]
        },
        {
          author: {
            id: 999,
            username: 'super',
            personalname: 'Super User',
            email: 'super@email.com',
            is_anonymous: false,
            roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
            is_super: true
          },
          categories: [],
          consent: { id: 69, prose: '' },
          description: "This is the description of 'Some Other Scenario'",
          finish: {
            id: 11,
            title: '',
            components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
            is_finish: true
          },
          lock: {
            scenario_id: 42,
            user_id: 999,
            created_at: '2020-02-31T23:54:19.934Z',
            ended_at: null
          },
          slides: [
            {
              id: 11,
              title: '',
              components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
              is_finish: true
            },
            {
              id: 22,
              title: '',
              components: [
                {
                  id: 'b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
                  html: '<p>HTML!</p>',
                  type: 'Text'
                },
                {
                  id: 'aede9380-c7a3-4ef7-add7-eb6677358c9e',
                  type: 'TextResponse',
                  header: 'TextResponse-1',
                  prompt: '',
                  timeout: 0,
                  recallId: '',
                  required: true,
                  responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
                  placeholder: 'Your response'
                },
                {
                  id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
                  html: '<p>?</p>',
                  type: 'Text'
                }
              ],
              is_finish: false
            }
          ],
          status: 1,
          title: 'Some Other Scenario',
          users: [
            {
              id: 999,
              email: 'super@email.com',
              username: 'super',
              personalname: 'Super User',
              roles: ['super'],
              is_super: true,
              is_author: true,
              is_reviewer: false
            }
          ],
          id: 99,
          created_at: '2020-07-31T17:50:28.089Z',
          updated_at: null,
          deleted_at: null,
          labels: ['a'],
          personas: [
            {
              id: 1,
              name: 'Participant',
              description:
                'The default user participating in a single person scenario.',
              color: '#FFFFFF',
              created_at: '2020-12-01T15:49:04.962Z',
              updated_at: null,
              deleted_at: null,
              author_id: 3,
              is_read_only: true,
              is_shared: true
            }
          ]
        }
      ];
      dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
      return scenarios;
    }
  );

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

test('Downloads', () => {
  expect(Downloads).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = Downloads;

  const props = {
    ...commonProps,
    onClick: jest.fn(() => {})
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(
    await screen.findByRole('button', {
      name: /download a csv file containing responses to only "multiplayer scenario 2"/i
    })
  );

  expect(serialize()).toMatchSnapshot();
  expect(asFragment()).toMatchSnapshot();

  expect(
    (await screen.findAllByRole('button', {
      name: /download a csv file containing responses to only "some other scenario"/i
    })).length
  ).toBe(1);

  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 2 1', async done => {
  const Component = Downloads;

  const props = {
    ...commonProps,
    onClick: jest.fn(() => {})
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  userActions.getUser = jest.fn();
  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'facilitator',
      personalname: 'Facilitator User',
      email: 'facilitator@email.com',
      id: 555,
      roles: ['participant', 'facilitator', 'researcher', 'owner'],
      is_anonymous: false,
      is_super: false,
      is_owner: true
    };
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
