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
  GET_COHORT_SUCCESS,
  GET_COHORT_SCENARIOS_SUCCESS,
  SET_COHORT_SUCCESS,
  GET_RUNS_SUCCESS,
  GET_SCENARIOS_SUCCESS,
  GET_SCENARIOS_COUNT_SUCCESS,
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

import copy from 'copy-text-to-clipboard';
jest.mock('copy-text-to-clipboard', () => {
  return jest.fn();
});

import { notify } from '@components/Notification';
jest.mock('@components/Notification', () => {
  return {
    ...jest.requireActual('@components/Notification'),
    notify: jest.fn()
  };
});

import Layout from '@utils/Layout';
jest.mock('@utils/Layout', () => {
  return {
    ...jest.requireActual('@utils/Layout'),
    isForMobile: jest.fn(() => false)
  };
});

jest.mock('@components/Gate', () => {
  return function({ children }) {
    return children;
  };
});

let cohort = null;
const scenario = {
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
    components: [{ html: '<h2>Thanks for participating!</h2>', type: 'Text' }],
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
};
const scenario2 = {
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
};

scenario.status = 2;
scenario2.status = 2;

const personas = [
  {
    id: 1,
    name: 'Participant',
    description: 'The default user participating in a single person scenario.',
    color: '#FFFFFF',
    created_at: '2020-12-01T15:49:04.962Z',
    updated_at: null,
    deleted_at: null,
    author_id: 3,
    is_read_only: true,
    is_shared: true
  },
  {
    id: 2,
    name: 'Teacher',
    description:
      'A non-specific teacher, participating in a multi person scenario.',
    color: '#3f59a9',
    created_at: '2020-12-01T15:49:04.962Z',
    updated_at: null,
    deleted_at: null,
    author_id: 3,
    is_read_only: true,
    is_shared: true
  },
  {
    id: 3,
    name: 'Student',
    description:
      'A non-specific student, participating in a multi person scenario.',
    color: '#e59235',
    created_at: '2020-12-01T15:49:04.962Z',
    updated_at: null,
    deleted_at: null,
    author_id: 3,
    is_read_only: true,
    is_shared: true
  }
];

scenario2.personas = personas;

import CohortScenarios from '../../components/Cohorts/CohortScenarios.jsx';

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

  cohort = {
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

  Layout.isForMobile = jest.fn();
  Layout.isForMobile.mockImplementation(() => false);

  scenarioActions.getScenariosByStatus = jest.fn();
  scenarioActions.getScenariosByStatus.mockImplementation(
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

  runActions.getRuns = jest.fn();
  runActions.getRuns.mockImplementation(() => async dispatch => {
    const runs = [
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
    ];
    dispatch({ type: GET_RUNS_SUCCESS, runs });
    return runs;
  });
  cohortActions.getCohortScenarios = jest.fn();
  cohortActions.getCohortScenarios.mockImplementation(() => async dispatch => {
    const scenarios = [scenario, scenario2];
    dispatch({ type: GET_COHORT_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  });
  cohortActions.getCohort = jest.fn();
  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });
  cohortActions.setCohortScenarios = jest.fn();
  cohortActions.setCohortScenarios.mockImplementation(
    cohort => async dispatch => {
      dispatch({ type: SET_COHORT_SUCCESS, cohort });
      return cohort;
    }
  );
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

test('CohortScenarios', () => {
  expect(CohortScenarios).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    authority: { isFacilitator: true, isParticipant: true }
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 2 1', async done => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    id: 1,
    authority: { isFacilitator: true, isParticipant: true }
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  done();
});

/* INJECTION STARTS HERE */

test('No scenarios returned from request', async done => {
  const Component = CohortScenarios;

  cohortActions.getCohortScenarios.mockImplementation(() => async dispatch => {
    const scenarios = [];
    dispatch({ type: GET_COHORT_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  });

  const props = {
    ...commonProps,
    id: 1,
    authority: {
      isFacilitator: true,
      isParticipant: true
    }
  };

  const state = {
    ...commonState
  };

  state.scenariosById = state.scenarios.reduce((accum, scenario) => {
    accum[scenario.id] = scenario;
    return accum;
  }, {});

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  const button = await screen.findByRole('button', {
    name: /edit selected scenarios/i
  });
  expect(asFragment()).toMatchSnapshot();
  done();
});

test('No scenarios in cohort', async done => {
  const Component = CohortScenarios;

  cohortActions.getCohortScenarios.mockImplementation(() => async dispatch => {
    const scenarios = [];
    dispatch({ type: GET_COHORT_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  });

  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    cohort.scenarios = [];
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });

  const props = {
    ...commonProps,
    id: 1,
    authority: {
      isFacilitator: true,
      isParticipant: true
    }
  };

  const state = {
    ...commonState
  };

  state.scenariosById = state.scenarios.reduce((accum, scenario) => {
    accum[scenario.id] = scenario;
    return accum;
  }, {});

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  const button = await screen.findByRole('button', {
    name: /edit selected scenarios/i
  });
  expect(asFragment()).toMatchSnapshot();
  done();
});

test('Facilitator has an option to open scenarios selector', async done => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    id: 1,
    authority: {
      isFacilitator: true,
      isParticipant: true
    }
  };

  const state = {
    ...commonState
  };

  state.scenariosById = state.scenarios.reduce((accum, scenario) => {
    accum[scenario.id] = scenario;
    return accum;
  }, {});

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  const button = await screen.findByRole('button', {
    name: /edit selected scenarios/i
  });
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(button);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Scenarios have multi-participant/single-participant icons', async done => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    id: 1,
    authority: {
      isFacilitator: true,
      isParticipant: true
    }
  };

  const state = {
    ...commonState
  };

  state.scenariosById = state.scenarios.reduce((accum, scenario) => {
    accum[scenario.id] = scenario;
    return accum;
  }, {});

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  const button = await screen.findByRole('button', {
    name: /edit selected scenarios/i
  });
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(button);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Participant does not have an option to open scenarios selector', async done => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    id: 1,
    authority: {
      isFacilitator: false,
      isParticipant: true
    }
  };

  const state = {
    ...commonState
  };

  state.scenariosById = state.scenarios.reduce((accum, scenario) => {
    accum[scenario.id] = scenario;
    return accum;
  }, {});

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  const buttons = await screen.queryAllByRole('button', {
    name: /Edit selected scenarios/i
  });

  expect(buttons.length).toBe(0);

  done();
});

test('Copy cohort scenario url', async done => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    id: 1,
    authority: {
      isFacilitator: true,
      isParticipant: true
    }
  };

  const state = {
    ...commonState
  };

  state.scenariosById = state.scenarios.reduce((accum, scenario) => {
    accum[scenario.id] = scenario;
    return accum;
  }, {});

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  const button = await screen.findByTestId('copy-cohort-scenario-link');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(button);
  expect(copy.mock.calls.length).toBe(1);
  expect(notify.mock.calls.length).toBe(1);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Run as participant', async done => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    id: 1,
    authority: {
      isFacilitator: true,
      isParticipant: true
    }
  };

  const state = {
    ...commonState
  };

  state.scenariosById = state.scenarios.reduce((accum, scenario) => {
    accum[scenario.id] = scenario;
    return accum;
  }, {});

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    href: ''
  };

  userEvent.click(await screen.getAllByTestId('run-cohort-as-participant')[0]);
  expect(window.location.href).toMatchInlineSnapshot(
    `"http://localhost/cohort/6e4213d8d326545c23b5a8b052641fb29b729131/run/99/slide/0"`
  );
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Click to see all response', async done => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    id: 1,
    authority: {
      isFacilitator: true,
      isParticipant: true
    },
    onClick: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const viewResponsesButtons = await screen.findAllByTestId(
    'view-cohort-responses'
  );

  userEvent.click(viewResponsesButtons[0]);
  expect(props.onClick).toHaveBeenCalledTimes(1);
  expect(props.onClick.mock.calls[0][1]).toMatchInlineSnapshot(`
    Object {
      "source": Object {
        "author": Object {
          "email": "super@email.com",
          "id": 999,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "super",
        },
        "categories": Array [],
        "consent": Object {
          "id": 69,
          "prose": "",
        },
        "created_at": "2020-07-31T17:50:28.089Z",
        "deleted_at": null,
        "description": "This is the description of 'Some Other Scenario'",
        "finish": Object {
          "components": Array [
            Object {
              "html": "<h2>Bye!</h2>",
              "type": "Text",
            },
          ],
          "id": 11,
          "is_finish": true,
          "title": "",
        },
        "id": 99,
        "labels": Array [
          "a",
        ],
        "lock": Object {
          "created_at": "2020-02-31T23:54:19.934Z",
          "ended_at": null,
          "scenario_id": 42,
          "user_id": 999,
        },
        "personas": Array [
          Object {
            "author_id": 3,
            "color": "#FFFFFF",
            "created_at": "2020-12-01T15:49:04.962Z",
            "deleted_at": null,
            "description": "The default user participating in a single person scenario.",
            "id": 1,
            "is_read_only": true,
            "is_shared": true,
            "name": "Participant",
            "updated_at": null,
          },
          Object {
            "author_id": 3,
            "color": "#3f59a9",
            "created_at": "2020-12-01T15:49:04.962Z",
            "deleted_at": null,
            "description": "A non-specific teacher, participating in a multi person scenario.",
            "id": 2,
            "is_read_only": true,
            "is_shared": true,
            "name": "Teacher",
            "updated_at": null,
          },
          Object {
            "author_id": 3,
            "color": "#e59235",
            "created_at": "2020-12-01T15:49:04.962Z",
            "deleted_at": null,
            "description": "A non-specific student, participating in a multi person scenario.",
            "id": 3,
            "is_read_only": true,
            "is_shared": true,
            "name": "Student",
            "updated_at": null,
          },
        ],
        "slides": Array [
          Object {
            "components": Array [
              Object {
                "html": "<h2>Bye!</h2>",
                "type": "Text",
              },
            ],
            "id": 11,
            "is_finish": true,
            "title": "",
          },
          Object {
            "components": Array [
              Object {
                "html": "<p>HTML!</p>",
                "id": "b7e7a3f1-eb4e-4afa-8569-838fd5ec854f",
                "type": "Text",
              },
              Object {
                "header": "TextResponse-1",
                "id": "aede9380-c7a3-4ef7-add7-eb6677358c9e",
                "placeholder": "Your response",
                "prompt": "",
                "recallId": "",
                "required": true,
                "responseId": "be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
                "timeout": 0,
                "type": "TextResponse",
              },
              Object {
                "html": "<p>?</p>",
                "id": "f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
                "type": "Text",
              },
            ],
            "id": 22,
            "is_finish": false,
            "title": "",
          },
        ],
        "status": 2,
        "title": "Some Other Scenario",
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_author": true,
            "is_reviewer": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "super",
            ],
            "username": "super",
          },
        ],
      },
      "type": "scenario",
    }
  `);

  done();
});

test('Open Edit scenarios', async done => {
  const Component = CohortScenarios;

  const props = {
    ...commonProps,
    id: 1,
    authority: {
      isFacilitator: true,
      isParticipant: true
    },
    onClick: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  await screen.findByTestId('cohort-scenarios');
  expect(asFragment()).toMatchSnapshot();

  const editScenariosButton = screen.getByText(/Edit selected scenarios/i);

  userEvent.click(editScenariosButton);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(asFragment()).toMatchSnapshot();

  const closeButton = screen.getByText(/Close/i);
  userEvent.click(closeButton);
  expect(asFragment()).toMatchSnapshot();

  done();
});
