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
  GET_COHORTS_SUCCESS,
  GET_RUNS_SUCCESS,
  GET_SCENARIOS_SUCCESS,
  GET_USER_SUCCESS,
  GET_USERS_SUCCESS
} from '../../actions/types';
import * as cohortActions from '../../actions/cohort';
import * as runActions from '../../actions/run';
import * as scenarioActions from '../../actions/scenario';
import * as userActions from '../../actions/user';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/cohort');
jest.mock('../../actions/run');
jest.mock('../../actions/scenario');
jest.mock('../../actions/user');
jest.mock('../../actions/users');

import History from '../../components/History/index.jsx';
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

  cohortActions.getCohorts = jest.fn();

  cohortActions.getCohorts.mockImplementation(() => async dispatch => {
    const cohorts = [
      {
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
      }
    ];
    dispatch({ type: GET_COHORTS_SUCCESS, cohorts });
    return cohorts;
  });

  runActions.getRuns = jest.fn();

  runActions.getRuns.mockImplementation(() => async dispatch => {
    const runs = [
      {
        id: 31,
        run_id: 31,
        run_created_at: '2020-03-31T17:07:15.447Z',
        run_ended_at: '2020-03-31T17:07:20.321Z',
        consent_acknowledged_by_user: true,
        consent_granted_by_user: true,
        cohort_id: 1,
        scenario_id: 7,
        scenario_title: 'Multi Button Prompt',
        scenario_description: '',
        user_id: 2
      },
      {
        id: 30,
        run_id: 30,
        run_created_at: '2020-03-31T17:05:34.501Z',
        run_ended_at: '2020-03-31T17:05:39.136Z',
        consent_acknowledged_by_user: true,
        consent_granted_by_user: true,
        cohort_id: 1,
        scenario_id: 7,
        scenario_title: 'Multi Button Prompt',
        scenario_description: '',
        user_id: 2
      },
      {
        id: 29,
        run_id: 29,
        run_created_at: '2020-03-31T17:02:51.357Z',
        run_ended_at: '2020-03-31T17:02:57.043Z',
        consent_acknowledged_by_user: true,
        consent_granted_by_user: true,
        cohort_id: 1,
        scenario_id: 7,
        scenario_title: 'Multi Button Prompt',
        scenario_description: '',
        user_id: 2
      },
      {
        id: 28,
        run_id: 28,
        run_created_at: '2020-03-31T17:01:52.902Z',
        run_ended_at: '2020-03-31T17:02:00.296Z',
        consent_acknowledged_by_user: true,
        consent_granted_by_user: true,
        cohort_id: 1,
        scenario_id: 7,
        scenario_title: 'Multi Button Prompt',
        scenario_description: '',
        user_id: 2
      }
    ];
    dispatch({ type: GET_RUNS_SUCCESS, runs });
    return runs;
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
        }
      ];
      dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
      return scenarios;
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

test('History', () => {
  expect(History).toBeDefined();
});

test('Render 1 1', async done => {
  /** @GENERATED: BEGIN **/
  const Component = History;
  const props = {
    ...commonProps,
    scenario: {
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
    }
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  /** @GENERATED: END **/

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  await screen.findByRole('columnheader', { name: /cohort name/i });

  expect(serialize()).toMatchSnapshot();

  done();
});
