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
        calendar() {
          return 'HH:mm A';
        },
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
  CREATE_CHAT_INVITE_SUCCESS,
  GET_CHAT_SUCCESS,
  GET_CHAT_USERS_SUCCESS,
  GET_COHORT_SUCCESS,
  GET_COHORT_CHATS_OVERVIEW_SUCCESS,
  GET_INVITES_SUCCESS,
  GET_SCENARIO_SUCCESS,
  GET_SCENARIOS_SUCCESS,
  GET_USERS_COUNT_SUCCESS,
  GET_USERS_SUCCESS
} from '../../actions/types';
import * as chatActions from '../../actions/chat';
import * as cohortActions from '../../actions/cohort';
import * as inviteActions from '../../actions/invite';
import * as scenarioActions from '../../actions/scenario';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/chat');
jest.mock('../../actions/cohort');
jest.mock('../../actions/invite');
jest.mock('../../actions/scenario');
jest.mock('../../actions/users');

let user;
let superUser;
let facilitatorUser;
let researcherUser;
let participantUser;
let anonymousUser;
let chat;
let chats;
let chatsById;
let cohort;
let invites;
let invitesById;
let scenario;
let scenarios;
let users;
let usersById;

const expectDateString = expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}.*/i);

import Lobby from '../../components/Lobby/index.jsx';
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

  users = [
    superUser,
    facilitatorUser,
    researcherUser,
    participantUser,
    anonymousUser
  ];

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

  chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: null,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    users: [superUser],
    usersById: {
      [superUser.id]: superUser
    }
  };

  chats = [chat];

  chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  }, {});

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
  cohort.chat = null;

  invites = [
    {
      id: 1,
      sender_id: 999,
      receiver_id: 555,
      status_id: 1,
      props: {
        chat_id: 8,
        persona_id: null
      },
      code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc595',
      created_at: '2021-02-04T19:24:39.039Z',
      updated_at: null,
      expire_at: null
    }
  ];

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

  invitesById = invites.reduce((accum, invite) => {
    accum[invite.id] = invite;
    return accum;
  }, {});

  chatActions.getChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatByIdentifiers.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getLinkedChatUsersByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
      return users;
    }
  );

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  inviteActions.getInvites.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_INVITES_SUCCESS, invites });
    return invites;
  });

  usersActions.getUsers.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_USERS_SUCCESS, users });
    return users;
  });

  usersActions.getUsersCount.mockImplementation(() => async dispatch => {
    const count = users.length;
    dispatch({ type: GET_USERS_COUNT_SUCCESS, count });
    return count;
  });

  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });

  cohortActions.getCohortChatsOverview.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_COHORT_CHATS_OVERVIEW_SUCCESS, chats });
      return chats;
    }
  );

  scenarioActions.getScenario.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return scenario;
  });

  scenarioActions.getScenariosByStatus.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
      return scenarios;
    }
  );

  Storage.get.mockImplementation((key, defaultValue) => defaultValue);
  Storage.merge.mockImplementation((key, defaultValue) => defaultValue);

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

test('Lobby', () => {
  expect(Lobby).toBeDefined();
});

/* INJECTION STARTS HERE */

test('Lobby visited by a non-facilitator user', async done => {
  const Component = Lobby;

  user = {
    ...participantUser
  };

  const props = {
    ...commonProps,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    user,
    users,
    usersById
  };

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "participant@email.com",
            "id": 333,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": false,
            "persona_id": null,
            "personalname": "Participant User",
            "progress": Object {
              "completed": Array [],
              "latestByScenarioId": Object {
                "1": Object {
                  "created_at": 1602454306144,
                  "description": "",
                  "event_id": 1903,
                  "generic": "requested to join {scenario} as {persona}, and is waiting to be matched.",
                  "is_complete": false,
                  "is_run": false,
                  "name": "slide-arrival",
                  "persona": Object {
                    "id": 1,
                    "name": "Teacher",
                  },
                  "scenario_id": 99,
                  "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                },
              },
            },
            "roles": Array [
              "participant",
            ],
            "username": "participant",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  await waitFor(() => {
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
    expect(chatActions.getLinkedChatUsersByChatId).not.toHaveBeenCalled();
  });
  done();
});

test('Lobby visited in a cohort', async done => {
  const Component = Lobby;

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    pathname: '/cohort/'
  };

  user = {
    ...participantUser
  };

  const props = {
    ...commonProps,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    user,
    users,
    usersById
  };

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "participant@email.com",
            "id": 333,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": false,
            "persona_id": null,
            "personalname": "Participant User",
            "progress": Object {
              "completed": Array [],
              "latestByScenarioId": Object {
                "1": Object {
                  "created_at": 1602454306144,
                  "description": "",
                  "event_id": 1903,
                  "generic": "requested to join {scenario} as {persona}, and is waiting to be matched.",
                  "is_complete": false,
                  "is_run": false,
                  "name": "slide-arrival",
                  "persona": Object {
                    "id": 1,
                    "name": "Teacher",
                  },
                  "scenario_id": 99,
                  "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                },
              },
            },
            "roles": Array [
              "participant",
            ],
            "username": "participant",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  await waitFor(() => {
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
    expect(chatActions.getLinkedChatUsersByChatId).not.toHaveBeenCalled();
  });
  done();
});

test('Lobby visited in a cohort, asCard: true', async done => {
  const Component = Lobby;

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    pathname: '/cohort/'
  };

  user = {
    ...participantUser
  };

  const props = {
    ...commonProps,
    asCard: true,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    user,
    users,
    usersById
  };

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "participant@email.com",
            "id": 333,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": false,
            "persona_id": null,
            "personalname": "Participant User",
            "progress": Object {
              "completed": Array [],
              "latestByScenarioId": Object {
                "1": Object {
                  "created_at": 1602454306144,
                  "description": "",
                  "event_id": 1903,
                  "generic": "requested to join {scenario} as {persona}, and is waiting to be matched.",
                  "is_complete": false,
                  "is_run": false,
                  "name": "slide-arrival",
                  "persona": Object {
                    "id": 1,
                    "name": "Teacher",
                  },
                  "scenario_id": 99,
                  "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                },
              },
            },
            "roles": Array [
              "participant",
            ],
            "username": "participant",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  await waitFor(() => {
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
    expect(chatActions.getLinkedChatUsersByChatId).not.toHaveBeenCalled();
  });
  done();
});

test('Lobby visited in a run', async done => {
  const Component = Lobby;

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    pathname: '/run/'
  };

  user = {
    ...participantUser
  };

  const props = {
    ...commonProps,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    user,
    users,
    usersById
  };

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "participant@email.com",
            "id": 333,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": false,
            "persona_id": null,
            "personalname": "Participant User",
            "progress": Object {
              "completed": Array [],
              "latestByScenarioId": Object {
                "1": Object {
                  "created_at": 1602454306144,
                  "description": "",
                  "event_id": 1903,
                  "generic": "requested to join {scenario} as {persona}, and is waiting to be matched.",
                  "is_complete": false,
                  "is_run": false,
                  "name": "slide-arrival",
                  "persona": Object {
                    "id": 1,
                    "name": "Teacher",
                  },
                  "scenario_id": 99,
                  "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                },
              },
            },
            "roles": Array [
              "participant",
            ],
            "username": "participant",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  await waitFor(() => {
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
    expect(chatActions.getLinkedChatUsersByChatId).not.toHaveBeenCalled();
  });
  done();
});

test('Lobby visited in a run, asCard: true', async done => {
  const Component = Lobby;

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    pathname: '/run/'
  };

  user = {
    ...participantUser
  };

  const props = {
    ...commonProps,
    asCard: true,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    user,
    users,
    usersById
  };

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "participant@email.com",
            "id": 333,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": false,
            "persona_id": null,
            "personalname": "Participant User",
            "progress": Object {
              "completed": Array [],
              "latestByScenarioId": Object {
                "1": Object {
                  "created_at": 1602454306144,
                  "description": "",
                  "event_id": 1903,
                  "generic": "requested to join {scenario} as {persona}, and is waiting to be matched.",
                  "is_complete": false,
                  "is_run": false,
                  "name": "slide-arrival",
                  "persona": Object {
                    "id": 1,
                    "name": "Teacher",
                  },
                  "scenario_id": 99,
                  "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                },
              },
            },
            "roles": Array [
              "participant",
            ],
            "username": "participant",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  await waitFor(() => {
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
    expect(chatActions.getLinkedChatUsersByChatId).not.toHaveBeenCalled();
  });
  done();
});

test('Fallback: chat, scenario, cohort are not yet loaded, use provided props', async done => {
  const Component = Lobby;

  const created_at = chat.created_at;

  chat.created_at = null;

  const props = {
    ...commonProps,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat: null,
    cohort: null,
    scenario: null,
    user,
    users,
    usersById
  };

  chatActions.getChatByIdentifiers.mockImplementation(() => async dispatch => {
    chat = {
      ...chat,
      created_at
    };

    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "persona_id": null,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
            ],
            "username": "super",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => {
    expect(chatActions.getChat).toHaveBeenCalled();
  });
  expect(chatActions.getChatByIdentifiers.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
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
            "scenario_id": 99,
            "user_id": 999,
          },
          "personas": Array [
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
                  "agent": null,
                  "header": "TextResponse-1",
                  "id": "aede9380-c7a3-4ef7-add7-eb6677358c9e",
                  "placeholder": "",
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
          "status": 1,
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
        Object {
          "chat": null,
          "created_at": "2020-08-31T14:01:08.656Z",
          "id": 1,
          "is_archived": false,
          "name": "A New Cohort That Exists Within Inline Props",
          "roles": Array [
            "super",
            "facilitator",
          ],
          "runs": Array [
            Object {
              "cohort_id": 1,
              "consent_acknowledged_by_user": true,
              "consent_granted_by_user": true,
              "consent_id": 8,
              "created_at": "2020-03-28T19:44:03.069Z",
              "ended_at": "2020-03-31T17:01:43.128Z",
              "id": 11,
              "referrer_params": null,
              "run_id": 11,
              "scenario_id": 99,
              "updated_at": "2020-03-31T17:01:43.139Z",
              "user_id": 333,
            },
          ],
          "scenarios": Array [
            99,
          ],
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "personalname": "Super User",
              "progress": Object {
                "completed": Array [
                  1,
                ],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1909,
                    "generic": "arrived at a slide.",
                    "is_complete": true,
                    "is_run": true,
                    "name": "slide-arrival",
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
                "super_admin",
              ],
              "username": "super",
            },
            Object {
              "email": "facilitator@email.com",
              "id": 555,
              "is_anonymous": false,
              "is_owner": true,
              "is_super": false,
              "personalname": "Facilitator User",
              "progress": Object {
                "completed": Array [],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1905,
                    "generic": "arrived at a slide.",
                    "is_complete": false,
                    "is_run": true,
                    "name": "slide-arrival",
                    "scenario_id": 99,
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
                "facilitator",
                "researcher",
                "owner",
              ],
              "username": "facilitator",
            },
            Object {
              "email": "researcher@email.com",
              "id": 444,
              "is_anonymous": false,
              "is_super": false,
              "personalname": "Researcher User",
              "progress": Object {
                "completed": Array [],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1904,
                    "generic": "arrived at a slide.",
                    "is_complete": false,
                    "is_run": true,
                    "name": "slide-arrival",
                    "scenario_id": 99,
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
                "researcher",
              ],
              "username": "researcher",
            },
            Object {
              "email": "participant@email.com",
              "id": 333,
              "is_anonymous": false,
              "is_super": false,
              "personalname": "Participant User",
              "progress": Object {
                "completed": Array [],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1903,
                    "generic": "requested to join {scenario} as {persona}, and is waiting to be matched.",
                    "is_complete": false,
                    "is_run": false,
                    "name": "slide-arrival",
                    "persona": Object {
                      "id": 1,
                      "name": "Teacher",
                    },
                    "scenario_id": 99,
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
              ],
              "username": "participant",
            },
            Object {
              "email": "",
              "id": 222,
              "is_anonymous": true,
              "is_super": false,
              "personalname": "",
              "progress": Object {
                "completed": Array [],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1902,
                    "generic": "{participant} canceled their request to join {scenario} as {persona}.",
                    "is_complete": false,
                    "is_run": false,
                    "name": "slide-arrival",
                    "persona": Object {
                      "id": 2,
                      "name": "Student",
                    },
                    "scenario_id": 99,
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
              ],
              "username": "anonymous",
            },
          ],
          "usersById": Object {
            "222": Object {
              "email": "",
              "id": 222,
              "is_anonymous": true,
              "is_super": false,
              "personalname": "",
              "progress": Object {
                "completed": Array [],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1902,
                    "generic": "{participant} canceled their request to join {scenario} as {persona}.",
                    "is_complete": false,
                    "is_run": false,
                    "name": "slide-arrival",
                    "persona": Object {
                      "id": 2,
                      "name": "Student",
                    },
                    "scenario_id": 99,
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
              ],
              "username": "anonymous",
            },
            "333": Object {
              "email": "participant@email.com",
              "id": 333,
              "is_anonymous": false,
              "is_super": false,
              "personalname": "Participant User",
              "progress": Object {
                "completed": Array [],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1903,
                    "generic": "requested to join {scenario} as {persona}, and is waiting to be matched.",
                    "is_complete": false,
                    "is_run": false,
                    "name": "slide-arrival",
                    "persona": Object {
                      "id": 1,
                      "name": "Teacher",
                    },
                    "scenario_id": 99,
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
              ],
              "username": "participant",
            },
            "444": Object {
              "email": "researcher@email.com",
              "id": 444,
              "is_anonymous": false,
              "is_super": false,
              "personalname": "Researcher User",
              "progress": Object {
                "completed": Array [],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1904,
                    "generic": "arrived at a slide.",
                    "is_complete": false,
                    "is_run": true,
                    "name": "slide-arrival",
                    "scenario_id": 99,
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
                "researcher",
              ],
              "username": "researcher",
            },
            "555": Object {
              "email": "facilitator@email.com",
              "id": 555,
              "is_anonymous": false,
              "is_owner": true,
              "is_super": false,
              "personalname": "Facilitator User",
              "progress": Object {
                "completed": Array [],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1905,
                    "generic": "arrived at a slide.",
                    "is_complete": false,
                    "is_run": true,
                    "name": "slide-arrival",
                    "scenario_id": 99,
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
                "facilitator",
                "researcher",
                "owner",
              ],
              "username": "facilitator",
            },
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "personalname": "Super User",
              "progress": Object {
                "completed": Array [
                  1,
                ],
                "latestByScenarioId": Object {
                  "1": Object {
                    "created_at": 1602454306144,
                    "description": "",
                    "event_id": 1909,
                    "generic": "arrived at a slide.",
                    "is_complete": true,
                    "is_run": true,
                    "name": "slide-arrival",
                    "url": "http://localhost:3000/cohort/1/run/99/slide/1",
                  },
                },
              },
              "roles": Array [
                "participant",
                "super_admin",
              ],
              "username": "super",
            },
          },
        },
      ],
    ]
  `);

  done();
});

test('Fallback: cohort expected, but not yet loaded', async done => {
  const Component = Lobby;

  cohort.created_at = null;

  const props = {
    ...commonProps,
    chat,
    cohort,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "persona_id": null,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
            ],
            "username": "super",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Fallback: scenario missing', async done => {
  const Component = Lobby;

  const props = {
    ...commonProps,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    scenario: null,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "persona_id": null,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
            ],
            "username": "super",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Fallback: scenario object present, unloaded', async done => {
  const Component = Lobby;

  scenario.created_at = null;

  const props = {
    ...commonProps,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    scenario: null,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "persona_id": null,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
            ],
            "username": "super",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Fallback: chat missing, use scenario and cohort to request chat', async done => {
  const Component = Lobby;

  chat = {
    ...chat,
    users,
    usersById
  };

  const props = {
    ...commonProps,
    chat: { created_at: null, id: 1 },
    user
  };

  const state = {
    ...commonState,
    chat: null,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  chatActions.getChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatByIdentifiers.mockImplementation(() => async dispatch => {
    const chat = null;
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "persona_id": null,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
            ],
            "username": "super",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => {
    expect(chatActions.getLinkedChatUsersByChatId).not.toHaveBeenCalled();
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
  });

  done();
});

test('Fallback: chat missing, use scenario to request chat', async done => {
  const Component = Lobby;

  chat = {
    ...chat,
    users,
    usersById
  };

  const props = {
    ...commonProps,
    chat: { created_at: null, id: 1 },
    user
  };

  const state = {
    ...commonState,
    chat: null,
    cohort: null,
    scenario,
    user,
    users,
    usersById
  };

  chatActions.getChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatByIdentifiers.mockImplementation(() => async dispatch => {
    const chat = null;
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "persona_id": null,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
            ],
            "username": "super",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => {
    expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled();
    expect(chatActions.getChatUsersByChatId).not.toHaveBeenCalled();
  });

  done();
});

test('props.asCard', async done => {
  const Component = Lobby;

  const props = {
    ...commonProps,
    asCard: true,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "persona_id": null,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
            ],
            "username": "super",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Without cohort, Receives RUN_CHAT_LINK, calls getLinkedChatUsersByChatId', async done => {
  const Component = Lobby;

  // Make sure there are no users in the chat yet
  chat = {
    ...chat,
    users: [],
    usersById: {}
  };

  const props = {
    ...commonProps,
    chat,
    cohort: null,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort: null,
    scenario,
    user
  };

  chatActions.getChatByIdentifiers.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  chatActions.getLinkedChatUsersByChatId.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
      return users;
    }
  );

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "persona_id": null,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
            ],
            "username": "super",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('run-chat-link', {});

  await waitFor(() => {
    expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled();
    expect(chatActions.getChatUsersByChatId).not.toHaveBeenCalled();
  });

  done();
});

test('With cohort, Receives RUN_CHAT_LINK, calls getChatUsersByChatId', async done => {
  const Component = Lobby;

  // Make sure there are no users in the chat yet
  chat = {
    ...chat,
    users: [],
    usersById: {}
  };

  const props = {
    ...commonProps,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    cohort,
    scenario,
    user
  };

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    users[1].persona_id = 2;

    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  expect(chatActions.getChatUsersByChatId).not.toHaveBeenCalled();
  expect(chatActions.getLinkedChatUsersByChatId).not.toHaveBeenCalled();

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);
  globalThis.mockSocket.on.mockImplementation(emitter.on);
  globalThis.mockSocket.off.mockImplementation(emitter.off);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
  expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "create-user-channel",
        Object {
          "user": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_muted": false,
            "is_present": true,
            "is_super": true,
            "persona_id": null,
            "personalname": "Super User",
            "roles": Array [
              "participant",
              "super_admin",
            ],
            "username": "super",
          },
        },
      ],
    ]
  `);
  await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
  expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "run-chat-link",
        [Function],
      ],
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  globalThis.mockSocket.emit('run-chat-link', {});

  await waitFor(() => {
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
    expect(chatActions.getLinkedChatUsersByChatId).not.toHaveBeenCalled();
  });

  done();
});
