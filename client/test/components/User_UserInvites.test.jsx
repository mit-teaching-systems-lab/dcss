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

import Emitter from 'events';

import withSocket, * as SOCKET_EVENT_TYPES from '@hoc/withSocket';
jest.mock('@hoc/withSocket', () => {
  const socket = {
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  };

  globalThis.mockSocket = socket;

  return {
    __esModule: true,
    ...jest.requireActual('@hoc/withSocket'),
    default: function(Component) {
      Component.defaultProps = {
        ...Component.defaultProps,
        socket
      };
      return Component;
    }
  };
});

jest.mock('@utils/Moment', () => {
  return {
    __esModule: true,
    default: function(time) {
      return {
        format() {
          return 'HH:mm A';
        }
      };
    }
  };
});

import Storage from '@utils/Storage';
jest.mock('@utils/Storage', () => {
  return {
    ...jest.requireActual('@utils/Storage'),
    get: jest.fn(),
    set: jest.fn(),
    merge: jest.fn()
  };
});

import {
  SET_INVITE_SUCCESS,
  GET_INVITES_SUCCESS,
  GET_SCENARIOS_COUNT_SUCCESS,
  GET_SCENARIOS_SUCCESS,
  GET_USERS_SUCCESS
} from '../../actions/types';
import * as inviteActions from '../../actions/invite';
import * as scenarioActions from '../../actions/scenario';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/invite');
jest.mock('../../actions/scenario');
jest.mock('../../actions/users');

let user;
let superUser;
let facilitatorUser;
let researcherUser;
let participantUser;
let anonymousUser;
let cohort;
let pending;
let canceled;
let declined;
let accepted;
let invites;
let invitesById;
let personas;
let personasById;
let scenario;
let scenarios;
let scenariosById;
let users;
let usersById;

const expectDateString = expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}.*/i);

import UserInvites from '../../components/User/UserInvites.jsx';
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

  user = superUser = {
    username: 'super',
    personalname: 'Super User',
    email: 'super@email.com',
    id: 999,
    roles: ['participant', 'super_admin'],
    is_anonymous: false,
    is_super: true
  };

  facilitatorUser = {
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
          description: '',
          is_run: true,
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
  researcherUser = {
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
          description: '',
          is_run: true,
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
  };
  participantUser = {
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
          description: '',
          is_run: false,
          is_complete: false,
          scenario_id: 99,
          event_id: 1903,
          created_at: 1602454306144,
          generic:
            'requested to join {scenario} as {persona}, and is waiting to be matched.',
          persona: { id: 1, name: 'Teacher' },
          name: 'slide-arrival',
          url: 'http://localhost:3000/cohort/1/run/99/slide/1'
        }
      }
    }
  };
  anonymousUser = {
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

  users = [superUser];

  for (let user of users) {
    user.persona_id = null;
    user.is_present = true;
    user.is_muted = false;
  }

  usersById = users.reduce(
    (accum, user) => ({
      ...accum,
      [user.id]: user
    }),
    {}
  );

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
              description: '',
              is_run: true,
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
              description: '',
              is_run: true,
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
              description: '',
              is_run: false,
              is_complete: false,
              scenario_id: 99,
              event_id: 1903,
              created_at: 1602454306144,
              generic:
                'requested to join {scenario} as {persona}, and is waiting to be matched.',
              persona: { id: 1, name: 'Teacher' },
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
              description: '',
              is_run: true,
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
              description: '',
              is_run: true,
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
              description: '',
              is_run: false,
              is_complete: false,
              scenario_id: 99,
              event_id: 1903,
              created_at: 1602454306144,
              generic:
                'requested to join {scenario} as {persona}, and is waiting to be matched.',
              persona: { id: 1, name: 'Teacher' },
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
      }
    },
    chat: {
      id: 1,
      scenario_id: null,
      cohort_id: 1,
      host_id: 999,
      created_at: '2020-12-08T21:51:33.659Z',
      updated_at: null,
      deleted_at: null,
      ended_at: null,
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
        },
        {
          id: 4,
          username: 'credible-lyrebird',
          personalname: null,
          email: null,
          is_anonymous: true,
          single_use_password: false,
          roles: ['participant', 'facilitator'],
          is_super: false,
          updated_at: '2020-12-10T17:50:19.074Z',
          is_muted: false,
          is_present: true
        }
      ],
      usersById: {
        4: {
          id: 4,
          username: 'credible-lyrebird',
          personalname: null,
          email: null,
          is_anonymous: true,
          single_use_password: false,
          roles: ['participant', 'facilitator'],
          is_super: false,
          updated_at: '2020-12-10T17:50:19.074Z',
          is_muted: false,
          is_present: true
        },
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
      }
    }
  };

  pending = {
    id: 1,
    sender_id: 999,
    receiver_id: 777,
    scenario_id: 42,
    status: 'pending',
    chat_id: 8,
    persona_id: null,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc591',
    created_at: '2021-02-04T19:24:39.039Z',
    updated_at: null,
    expire_at: null
  };
  canceled = {
    id: 2,
    sender_id: 777,
    receiver_id: 555,
    scenario_id: 42,
    status: 'canceled',
    chat_id: 8,
    persona_id: null,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc592',
    created_at: '2021-02-04T19:24:39.039Z',
    updated_at: null,
    expire_at: null
  };

  declined = {
    id: 3,
    sender_id: 777,
    receiver_id: 555,
    scenario_id: 42,
    status: 'declined',
    chat_id: 8,
    persona_id: null,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc593',
    created_at: '2021-02-04T19:24:39.039Z',
    updated_at: null,
    expire_at: null
  };
  accepted = {
    id: 4,
    sender_id: 777,
    receiver_id: 555,
    scenario_id: 42,
    status: 'accepted',
    chat_id: 8,
    persona_id: null,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc594',
    created_at: '2021-02-04T19:24:39.039Z',
    updated_at: null,
    expire_at: null
  };

  invites = [pending];

  invitesById = invites.reduce((accum, invite) => {
    accum[invite.id] = invite;
    return accum;
  }, {});

  scenario = {
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
            agent: null,
            id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: ''
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

  scenario.personas = [
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

  scenarios = [scenario];

  scenariosById = scenarios.reduce((accum, scenario) => {
    accum[scenario.id] = scenario;
    return accum;
  }, {});

  personas = [
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

  inviteActions.setInvite.mockImplementation(
    (id, updates) => async dispatch => {
      const updated = {
        ...pending,
        ...updates
      };

      dispatch({ type: SET_INVITE_SUCCESS, invite: updated });
      return updated;
    }
  );

  inviteActions.getInvites.mockImplementation(() => async dispatch => {
    const invites = [pending, canceled, declined, accepted];
    dispatch({ type: GET_INVITES_SUCCESS, invites });
    return invites;
  });

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
                  agent: null,
                  id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
                  type: 'TextResponse',
                  header: 'TextResponse-1',
                  prompt: '',
                  timeout: 0,
                  recallId: '',
                  required: true,
                  responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
                  placeholder: ''
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
            scenario_id: 99,
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
                  agent: null,
                  id: 'aede9380-c7a3-4ef7-add7-eb6677358c9e',
                  type: 'TextResponse',
                  header: 'TextResponse-1',
                  prompt: '',
                  timeout: 0,
                  recallId: '',
                  required: true,
                  responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
                  placeholder: ''
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

  usersActions.getUsers.mockImplementation(() => async dispatch => {
    const users = [
      superUser,
      facilitatorUser,
      researcherUser,
      participantUser,
      anonymousUser
    ];
    dispatch({ type: GET_USERS_SUCCESS, users });
    return users;
  });

  Storage.get.mockImplementation((key, defaultValue) => defaultValue);
  Storage.merge.mockImplementation((key, defaultValue) => defaultValue);

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    href: ''
  };

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

test('UserInvites', () => {
  expect(UserInvites).toBeDefined();
});

/* INJECTION STARTS HERE */

test('Has redirect', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps,
    redirect: 'foo'
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has code, invite not present, accept', async done => {
  const Component = UserInvites;

  invites = [accepted];

  const props = {
    ...commonProps,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc591',
    redirect: 'foo',
    status: 4
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(inviteActions.setInvite).toHaveBeenCalled());

  expect(window.location.href).toMatchInlineSnapshot(`"foo"`);

  done();
});

test('Has code, invite is present, accept', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc591',
    redirect: 'foo',
    status: 4
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(inviteActions.setInvite).toHaveBeenCalled());

  done();
});

test('Has code, invite is present, pending', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc591',
    redirect: 'foo',
    status: 1
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(inviteActions.setInvite).toHaveBeenCalled());

  expect(window.location.href).toMatchInlineSnapshot(`""`);

  done();
});

test('Has code, invite is present, cancel', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc591',
    redirect: 'foo',
    status: 2
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(inviteActions.setInvite).toHaveBeenCalled());

  expect(window.location.href).toMatchInlineSnapshot(`""`);

  done();
});

test('Has code, invite is present, decline', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc591',
    redirect: 'foo',
    status: 3
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(inviteActions.setInvite).toHaveBeenCalled());

  expect(window.location.href).toMatchInlineSnapshot(`""`);

  done();
});

test('Has code, invite is present, unknown', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps,
    code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc591',
    redirect: 'foo',
    status: 6
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(inviteActions.setInvite).toHaveBeenCalled());

  expect(window.location.href).toMatchInlineSnapshot(`""`);

  done();
});

test('Has 0 invites', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    invites: [],
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  inviteActions.getInvites.mockImplementation(() => async dispatch => {
    const invites = [];
    dispatch({ type: GET_INVITES_SUCCESS, invites });
    return invites;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has 1-99 invites', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has +99 invites', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    invites,
    personas,
    user,
    users,
    usersById
  };

  inviteActions.getInvites.mockImplementation(() => async dispatch => {
    const invites = Array.from({ length: 200 }, (_, id) => {
      return {
        ...pending,
        status: 'pending',
        id
      };
    });
    dispatch({ type: GET_INVITES_SUCCESS, invites });
    return invites;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has 1-99 invites, open: true', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps,
    open: true
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has 1-99 invites, open onClick', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByText(/invites/i));

  await waitFor(() =>
    expect(screen.queryByTestId('modal-user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has 1-99 invites, open onClick, close onClick', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByText(/invites/i));

  await waitFor(() =>
    expect(screen.queryByTestId('modal-user-invites')).toBeInTheDocument()
  );

  userEvent.click(await screen.findByText(/close/i));

  await waitFor(() =>
    expect(screen.queryByTestId('modal-user-invites')).not.toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has 1-99 invites, open: true, accept', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps,
    open: true
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const invites = await screen.queryAllByText(/invites/i);

  userEvent.click(invites[0]);

  await waitFor(() =>
    expect(screen.queryByTestId('user-invites-list')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('NEW_INVITATION, open: true', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps,
    open: true
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('new-invitation', {
    start_at: '2021-03-12T15:47:37.029023-05:00',
    expire_at: null,
    props: {
      title: 'New invitation!',
      html: `<strong>a-fulfilled-dachshund</strong> has invited you to join them in the scenario <strong>Racket Math, 2 Roles</strong>.`,
      className: '',
      color: '',
      icon: 'mail',
      time: 0
    },
    rules: { 'session.isLoggedIn': true, 'user.id': 999 },
    type: 'invite',
    invite: {
      id: 186,
      sender_id: 777,
      receiver_id: 999,
      chat_id: 275,
      persona_id: 83,
      code: '03ad2c9f-d801-4d83-aa93-b952087e2e45',
      created_at: '2021-03-12T15:47:37.029023-05:00',
      updated_at: null,
      expire_at: null,
      status: 'pending',
      cohort_id: null,
      scenario_id: 190
    }
  });

  expect(serialize()).toMatchSnapshot();
  done();
});

test('NEW_INVITATION, invalid rules', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('new-invitation', {
    start_at: '2021-03-12T15:47:37.029023-05:00',
    expire_at: null,
    props: {
      title: 'New invitation!',
      html: `<strong>a-fulfilled-dachshund</strong> has invited you to join them in the scenario <strong>Racket Math, 2 Roles</strong>.`,
      className: '',
      color: '',
      icon: 'mail',
      time: 0
    },
    rules: { 'session.isLoggedIn': true, 'user.id': 1 },
    type: 'invite',
    invite: {
      id: 186,
      sender_id: 777,
      receiver_id: 999,
      chat_id: 275,
      persona_id: 83,
      code: '03ad2c9f-d801-4d83-aa93-b952087e2e45',
      created_at: '2021-03-12T15:47:37.029023-05:00',
      updated_at: null,
      expire_at: null,
      status: 'pending',
      cohort_id: null,
      scenario_id: 190
    }
  });

  expect(serialize()).toMatchSnapshot();
  done();
});

test('NEW_INVITATION, valid rules', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('new-invitation', {
    start_at: '2021-03-12T15:47:37.029023-05:00',
    expire_at: null,
    props: {
      title: 'New invitation!',
      html: `<strong>a-fulfilled-dachshund</strong> has invited you to join them in the scenario <strong>Racket Math, 2 Roles</strong>.`,
      className: '',
      color: '',
      icon: 'mail',
      time: 0
    },
    rules: { 'session.isLoggedIn': true, 'user.id': 999 },
    type: 'invite',
    invite: {
      id: 186,
      sender_id: 777,
      receiver_id: 999,
      chat_id: 275,
      persona_id: 83,
      code: '03ad2c9f-d801-4d83-aa93-b952087e2e45',
      created_at: '2021-03-12T15:47:37.029023-05:00',
      updated_at: null,
      expire_at: null,
      status: 'pending',
      cohort_id: null,
      scenario_id: 190
    }
  });

  expect(serialize()).toMatchSnapshot();
  done();
});

test('NEW_INVITATION, valid rules, document.body is dimmed', async done => {
  const Component = UserInvites;

  document.body.classList.add('dimmed');

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('new-invitation', {
    start_at: '2021-03-12T15:47:37.029023-05:00',
    expire_at: null,
    props: {
      title: 'New invitation!',
      html: `<strong>a-fulfilled-dachshund</strong> has invited you to join them in the scenario <strong>Racket Math, 2 Roles</strong>.`,
      className: '',
      color: '',
      icon: 'mail',
      time: 0
    },
    rules: { 'session.isLoggedIn': true, 'user.id': 999 },
    type: 'invite',
    invite: {
      id: 186,
      sender_id: 777,
      receiver_id: 999,
      chat_id: 275,
      persona_id: 83,
      code: '03ad2c9f-d801-4d83-aa93-b952087e2e45',
      created_at: '2021-03-12T15:47:37.029023-05:00',
      updated_at: null,
      expire_at: null,
      status: 'pending',
      cohort_id: null,
      scenario_id: 190
    }
  });

  expect(serialize()).toMatchSnapshot();

  done();
});

test('NEW_INVITATION, valid rules, no html prop', async done => {
  const Component = UserInvites;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState,
    invites,
    invitesById,
    personas,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryByTestId('user-invites')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('new-invitation', {
    start_at: '2021-03-12T15:47:37.029023-05:00',
    expire_at: null,
    props: {
      title: 'New invitation!',
      html: '',
      className: '',
      color: '',
      icon: 'mail',
      time: 0
    },
    rules: { 'session.isLoggedIn': true, 'user.id': 999 },
    type: 'invite',
    invite: {
      id: 186,
      sender_id: 777,
      receiver_id: 999,
      chat_id: 275,
      persona_id: 83,
      code: '03ad2c9f-d801-4d83-aa93-b952087e2e45',
      created_at: '2021-03-12T15:47:37.029023-05:00',
      updated_at: null,
      expire_at: null,
      status: 'pending',
      cohort_id: null,
      scenario_id: 190
    }
  });

  expect(serialize()).toMatchSnapshot();

  done();
});
