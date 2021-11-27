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

jest.mock('@components/Chat', () => {
  return props => <div>@components/Chat</div>;
});

import {
  CREATE_CHAT_INVITE_SUCCESS,
  GET_CHAT_SUCCESS,
  GET_CHAT_USERS_SUCCESS,
  GET_CHATS_SUCCESS,
  GET_COHORT_SUCCESS,
  GET_INVITES_SUCCESS,
  GET_SCENARIO_SUCCESS,
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
let personaTeacher;
let personaStudent;
let scenario;
let users;
let usersById;

const expectDateString = expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}.*/i);

import CohortRoomSelector from '../../components/Cohorts/CohortRoomSelector.jsx';
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

  personaTeacher = {
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
  };
  personaStudent = {
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
  };

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
    users: [superUser, participantUser],
    usersById: {
      [superUser.id]: superUser,
      [participantUser.id]: participantUser
    }
  };

  chat.users[0].persona_id = personaTeacher.id;

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
    },
    partnering: { 99: 1 }
  };

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

  scenario.personas = [personaTeacher, personaStudent];

  invitesById = invites.reduce((accum, invite) => {
    accum[invite.id] = invite;
    return accum;
  }, {});

  chatActions.createChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatByIdentifiers.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    const users = chat.users;
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  chatActions.getChatUsersByChatId.mockImplementation(() => async dispatch => {
    const users = chat.users;
    dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
    return users;
  });

  chatActions.joinChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatsByCohortId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHATS_SUCCESS, chats });
    return chats;
  });

  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });

  scenarioActions.getScenario.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return scenario;
  });

  usersActions.getUsers.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_USERS_SUCCESS, users });
    return users;
  });

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

test('CohortRoomSelector', () => {
  expect(CohortRoomSelector).toBeDefined();
});

/* INJECTION STARTS HERE */

test('Emits CREATE_COHORT_CHANNEL on socket', async done => {
  const Component = CohortRoomSelector;

  const props = {
    ...commonProps,
    scenario
  };

  const state = {
    ...commonState,
    chat,
    chats,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.queryAllByTestId('cohort-chat-selector').length).toBe(1)
  );
  expect(serialize()).toMatchSnapshot();

  expect(globalThis.mockSocket.emit).toHaveBeenCalledTimes(1);

  expect(serialize()).toMatchSnapshot();

  done();
});

const socketEvents = [
  'CHAT_CREATED',
  'CHAT_ENDED',
  'HOST_JOIN',
  'JOIN_OR_PART',
  'RUN_CHAT_LINK'
];
test(`Adds ${socketEvents.join(', ')} handlers`, async done => {
  const Component = CohortRoomSelector;

  const props = {
    ...commonProps,
    scenario
  };

  const state = {
    ...commonState,
    chat,
    chats,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(globalThis.mockSocket.on).toHaveBeenCalledTimes(5)
  );

  expect(globalThis.mockSocket.on.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "chat-created",
      [Function],
    ]
  `);
  expect(globalThis.mockSocket.on.mock.calls[1]).toMatchInlineSnapshot(`
    Array [
      "chat-ended",
      [Function],
    ]
  `);
  expect(globalThis.mockSocket.on.mock.calls[2]).toMatchInlineSnapshot(`
    Array [
      "host-join",
      [Function],
    ]
  `);
  expect(globalThis.mockSocket.on.mock.calls[3]).toMatchInlineSnapshot(`
    Array [
      "join-or-part",
      [Function],
    ]
  `);
  expect(globalThis.mockSocket.on.mock.calls[4]).toMatchInlineSnapshot(`
    Array [
      "run-chat-link",
      [Function],
    ]
  `);

  expect(serialize()).toMatchSnapshot();

  done();
});

test('Has chats in state', async done => {
  const Component = CohortRoomSelector;

  const props = {
    ...commonProps,
    scenario
  };

  const state = {
    ...commonState,
    chat,
    chats,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has no chats in state', async done => {
  const Component = CohortRoomSelector;

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
    chats: [],
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has lobby prop, but not lobby.chat, chat is found through heuristic search', async done => {
  const Component = CohortRoomSelector;

  const lobby = {};

  chat.cohort_id = cohort.id;
  chat.host_id = superUser.id;
  chat.scenario_id = scenario.id;

  const props = {
    ...commonProps,
    chat,
    cohort,
    lobby,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    chats: [chat],
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Has lobby prop, but not lobby.chat, chat is NOT found through heuristic search', async done => {
  const Component = CohortRoomSelector;

  const lobby = {};

  chat.cohort_id = -1;
  chat.host_id = -1;
  chat.scenario_id = -1;

  const props = {
    ...commonProps,
    chat,
    cohort,
    lobby,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    chats: [chat],
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Close default', async done => {
  const Component = CohortRoomSelector;

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
    chats: [chat],
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const closeButton = await screen.findByRole('button', { name: /close/i });

  userEvent.click(closeButton);

  expect(serialize()).toMatchSnapshot();

  done();
});

test('Close provided', async done => {
  const Component = CohortRoomSelector;

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    chats: [chat],
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const closeButton = await screen.findByRole('button', { name: /close/i });

  userEvent.click(closeButton);

  expect(serialize()).toMatchSnapshot();
  done();
});

test('Create a room for this scenario, cancel', async done => {
  const Component = CohortRoomSelector;

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    chats,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const createButton = await screen.findByRole('button', {
    name: /create a room/i
  });
  userEvent.click(createButton);

  await waitFor(async () =>
    expect(await screen.findByTestId('cohort-chat-creator')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const cancelButton = await screen.findByRole('button', { name: /cancel/i });

  userEvent.click(cancelButton);

  expect(serialize()).toMatchSnapshot();
  done();
});

test('Create a room for this scenario, user will invite, proceed', async done => {
  const Component = CohortRoomSelector;

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    href: '',
    pathname: ''
  };

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    chats,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const createButton = await screen.findByRole('button', {
    name: /create a room/i
  });
  userEvent.click(createButton);

  await waitFor(async () =>
    expect(await screen.findByTestId('cohort-chat-creator')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const checkbox = await screen.findByLabelText(
    'No, I will invite participants.'
  );

  const createAndGoButton = await screen.findByRole('button', {
    name: /create and/i
  });

  userEvent.click(checkbox);
  userEvent.click(createAndGoButton);

  await waitFor(async () => {
    expect(chatActions.getChatsByCohortId).toHaveBeenCalled();
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
  });
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.createChat).toHaveBeenCalled();

  await waitFor(async () =>
    expect(await screen.findByTestId('lobby-main')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const joinButton = await screen.findByRole('button', {
    name: /join/i
  });

  userEvent.click(joinButton);

  expect(window.location.href).toMatchInlineSnapshot(`""`);

  done();
});

test('Create a room for this scenario, open to cohort, proceed', async done => {
  const Component = CohortRoomSelector;

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    chats,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const createButton = await screen.findByRole('button', {
    name: /create a room/i
  });
  userEvent.click(createButton);

  await waitFor(async () =>
    expect(await screen.findByTestId('cohort-chat-creator')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const checkbox = await screen.findByLabelText(
    'Yes, let anyone in my cohort join.'
  );

  chatActions.getChatsByCohortId.mockClear();
  chatActions.getChatUsersByChatId.mockClear();

  const createAndGoButton = await screen.findByRole('button', {
    name: /create/i
  });

  userEvent.click(checkbox);
  userEvent.click(createAndGoButton);

  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );

  await waitFor(async () => {
    expect(chatActions.getChatsByCohortId).toHaveBeenCalled();
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
  });

  expect(chatActions.createChat).toHaveBeenCalled();
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Create a room for this scenario, open to cohort, close', async done => {
  const Component = CohortRoomSelector;

  chatActions.createChat.mockImplementation(params => async dispatch => {
    const chat = {
      ...params,
      id: 2,
      scenario_id: 42,
      cohort_id: 1,
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
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    chats,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const createButton = await screen.findByRole('button', {
    name: /create a room/i
  });
  userEvent.click(createButton);

  await waitFor(async () =>
    expect(await screen.findByTestId('cohort-chat-creator')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const checkbox = await screen.findByLabelText(
    'Yes, let anyone in my cohort join.'
  );

  chatActions.getChatsByCohortId.mockClear();
  chatActions.getChatUsersByChatId.mockClear();

  const createAndGoButton = await screen.findByRole('button', {
    name: /create/i
  });

  userEvent.click(checkbox);
  userEvent.click(createAndGoButton);

  await waitFor(async () => {
    expect(chatActions.getChatsByCohortId).toHaveBeenCalled();
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
  });
  expect(serialize()).toMatchSnapshot();

  expect(chatActions.createChat).toHaveBeenCalled();

  // const allButtons = await screen.findAllByRole('button');
  // console.log(allButtons);

  const selectStudentRoleButton = await screen.getByText('Student');

  userEvent.click(selectStudentRoleButton);

  expect(serialize()).toMatchSnapshot();
  done();
});

test('Create a room for this scenario, open to cohort, close', async done => {
  const Component = CohortRoomSelector;

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    chats,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const createButton = await screen.findByRole('button', {
    name: /create a room/i
  });
  userEvent.click(createButton);

  await waitFor(async () =>
    expect(await screen.findByTestId('cohort-chat-creator')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const checkbox = await screen.findByLabelText(
    'Yes, let anyone in my cohort join.'
  );

  chatActions.getChatsByCohortId.mockClear();
  chatActions.getChatUsersByChatId.mockClear();

  const createAndGoButton = await screen.findByRole('button', {
    name: /create/i
  });

  userEvent.click(checkbox);
  userEvent.click(createAndGoButton);

  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );

  await waitFor(async () => {
    expect(chatActions.getChatsByCohortId).toHaveBeenCalled();
    expect(chatActions.getChatUsersByChatId).toHaveBeenCalled();
  });

  expect(chatActions.createChat).toHaveBeenCalled();

  const closeButton = await screen.findByRole('button', { name: /close/i });

  userEvent.click(closeButton);

  expect(serialize()).toMatchSnapshot();
  done();
});

test('User is not host, host does not have role', async done => {
  const Component = CohortRoomSelector;

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const host = {
    ...superUser,
    persona_id: null
  };

  const chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: 1,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    is_open: true,
    users: [host, participantUser],
    usersById: {
      [host.id]: host,
      [participantUser.id]: participantUser
    }
  };

  const chats = [chat];
  const chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  }, {});

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario
  };

  const state = {
    ...commonState,
    chat,
    chats,
    chatsById,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  state.user = {
    ...user,
    id: 333,
    persona_id: null
  };

  chatActions.getChatsByCohortId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHATS_SUCCESS, chats });
    return chats;
  });

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('User is not host, host does have role', async done => {
  const Component = CohortRoomSelector;

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: 1,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    is_open: true,
    users: [superUser, participantUser],
    usersById: {
      [superUser.id]: superUser,
      [participantUser.id]: participantUser
    }
  };

  const chats = [chat];
  const chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  }, {});

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario
  };

  const state = {
    ...commonState,
    chat,
    chats,
    chatsById,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  state.user = {
    ...user,
    id: 333,
    persona_id: null
  };

  chatActions.getChatsByCohortId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHATS_SUCCESS, chats });
    return chats;
  });

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('User is not host, host does have role, no roles remain', async done => {
  const Component = CohortRoomSelector;

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: 1,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    is_open: true,
    users: [superUser, participantUser],
    usersById: {
      [superUser.id]: superUser,
      [participantUser.id]: participantUser
    }
  };

  const altScenario = {
    ...scenario,
    personas: []
  };

  const chats = [chat];
  const chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  }, {});

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario: altScenario
  };

  const state = {
    ...commonState,
    chat,
    chats,
    chatsById,
    cohort,
    scenario: altScenario,
    user,
    users,
    usersById
  };

  state.user = {
    ...user,
    id: 333,
    persona_id: null
  };

  chatActions.getChatsByCohortId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHATS_SUCCESS, chats });
    return chats;
  });

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Scenario is missing personas', async done => {
  const Component = CohortRoomSelector;

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: 1,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    is_open: true,
    users: [superUser, participantUser],
    usersById: {
      [superUser.id]: superUser,
      [participantUser.id]: participantUser
    }
  };

  const altScenario = {
    ...scenario,
    personas: []
  };

  const chats = [chat];
  const chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  }, {});

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario: altScenario
  };

  const state = {
    ...commonState,
    chat,
    chats,
    chatsById,
    cohort,
    user,
    users,
    usersById
  };

  state.user = {
    ...user,
    id: 333,
    persona_id: null
  };

  chatActions.getChatsByCohortId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHATS_SUCCESS, chats });
    return chats;
  });

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Cohort does not match', async done => {
  const Component = CohortRoomSelector;

  const buttons = {
    secondary: {
      onClick: jest.fn()
    }
  };

  const chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: 9001,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    is_open: true,
    users: [superUser, participantUser],
    usersById: {
      [superUser.id]: superUser,
      [participantUser.id]: participantUser
    }
  };

  const altScenario = {
    ...scenario,
    personas: []
  };

  const chats = [chat];
  const chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  }, {});

  const props = {
    ...commonProps,
    buttons,
    chat,
    cohort,
    scenario: altScenario
  };

  const state = {
    ...commonState,
    chat,
    chats,
    chatsById,
    cohort,
    user,
    users,
    usersById
  };

  state.user = {
    ...user,
    id: 333,
    persona_id: null
  };

  chatActions.getChatsByCohortId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHATS_SUCCESS, chats });
    return chats;
  });

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  await waitFor(async () =>
    expect(
      await screen.findByTestId('cohort-chat-selector')
    ).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});
