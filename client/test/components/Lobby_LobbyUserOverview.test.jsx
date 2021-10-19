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

import { GET_COHORT_CHATS_OVERVIEW_SUCCESS } from '../../actions/types';
import * as cohortActions from '../../actions/cohort';
jest.mock('../../actions/cohort');

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
let users;
let usersById;

const expectDateString = expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}.*/i);

import LobbyUserOverview from '../../components/Lobby/LobbyUserOverview.jsx';
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

  invitesById = invites.reduce((accum, invite) => {
    accum[invite.id] = invite;
    return accum;
  }, {});

  cohortActions.getCohortChatsOverview.mockImplementation(
    () => async dispatch => {
      dispatch({ type: GET_COHORT_CHATS_OVERVIEW_SUCCESS, chats });
      return chats;
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

test('LobbyUserOverview', () => {
  expect(LobbyUserOverview).toBeDefined();
});

/* INJECTION STARTS HERE */

// test('Fallbacks for state.chat, state.scenario, state.cohort (missing)', async (done) => {
//   const Component = LobbyUserSelect;

//   const props = {
//     ...commonProps,
//     chat,
//     cohort,
//     scenario,
//     user,
//   };

//   const state = {
//     ...commonState,
//     chat: null,
//     cohort: null,
//     scenario: null,
//     user,
//     users,
//     usersById,
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();
//   done();
// });

// test('Fallbacks for state.chat, state.scenario, state.cohort (unloaded)', async (done) => {
//   const Component = LobbyUserSelect;

//   const props = {
//     ...commonProps,
//     chat,
//     cohort,
//     scenario,
//     user,
//   };

//   const state = {
//     ...commonState,
//     chat: { id: null },
//     cohort: { id: null },
//     scenario: { id: null },
//     user,
//     users,
//     usersById,
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();
//   done();
// });

// test('Fallbacks for state.chat, state.scenario, state.cohort (unavailable)', async (done) => {
//   const Component = LobbyUserSelect;

//   const props = {
//     ...commonProps,
//     chat: null,
//     cohort: null,
//     scenario: null,
//     user,
//   };

//   const state = {
//     ...commonState,
//     chat: { id: null },
//     cohort: { id: null },
//     scenario: { id: null },
//     user,
//     users,
//     usersById,
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();
//   done();
// });

// describe('With cohort', () => {
//   test('Both Send Invites buttons are disabled', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     const setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     done();
//   });

//   test('Click in search shows default list of available users', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const searchInput = await screen.getByRole('textbox');

//     userEvent.click(searchInput);

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const resultsContainer = participant.parentNode.parentNode;

//     expect(resultsContainer.classList.contains('visible')).toBe(true);
//     expect(resultsContainer.children.length).toBe(4);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Typing in search shows filtered list of available users', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const searchInput = await screen.getByRole('textbox');

//     userEvent.type(searchInput, 'facilitator');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const resultsContainer = participant.parentNode.parentNode;

//     expect(resultsContainer.classList.contains('visible')).toBe(true);
//     expect(resultsContainer.children.length).toBe(1);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Selecting from search results adds a participant', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     userEvent.type(searchInput, 'facilitator');

//     expect(selected.children.length).toBe(1);

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;
//     const resultsContainer = participant.parentNode.parentNode;

//     userEvent.click(participantClick);

//     expect(resultsContainer.classList.contains('visible')).toBe(false);
//     expect(serialize()).toMatchSnapshot();

//     expect(selected.children.length).toBe(2);

//     done();
//   });

//   test('Selecting too many shows a warning, remove an invite', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     userEvent.click(searchInput);
//     userEvent.clear(searchInput);
//     userEvent.type(searchInput, 'Facilitator');
//     expect(serialize()).toMatchSnapshot();

//     const facilitator = screen.getByLabelText(/Facilitator User/);
//     userEvent.click(facilitator.parentNode);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(searchInput);
//     userEvent.clear(searchInput);
//     userEvent.type(searchInput, 'Researcher');

//     const researcher = screen.getByLabelText(/Researcher User/);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(researcher.parentNode);
//     expect(serialize()).toMatchSnapshot();

//     const removeInviteButton = screen.getByText(/Remove a participant/);
//     userEvent.click(removeInviteButton);

//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Selecting too many shows a warning, discard selection', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     userEvent.click(searchInput);
//     userEvent.clear(searchInput);
//     userEvent.type(searchInput, 'Facilitator');
//     expect(serialize()).toMatchSnapshot();

//     const facilitator = screen.getByLabelText(/Facilitator User/);
//     userEvent.click(facilitator.parentNode);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(searchInput);
//     userEvent.clear(searchInput);
//     userEvent.type(searchInput, 'Researcher');

//     const researcher = screen.getByLabelText(/Researcher User/);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(researcher.parentNode);
//     expect(serialize()).toMatchSnapshot();

//     const removeInviteButton = screen.getByText(/Discard selection/);
//     userEvent.click(removeInviteButton);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Assigning roles enables Send Invites button', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     const setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;

//     userEvent.click(searchInput);
//     userEvent.click(participantClick);

//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');
//     expect(selected.children.length).toBe(2);

//     let roleSelectListboxes = await screen.getAllByRole('listbox');
//     expect(roleSelectListboxes.length).toBe(2);

//     expect(
//       roleSelectListboxes[0].lastElementChild.classList.contains('visible')
//     ).toBe(false);

//     userEvent.click(roleSelectListboxes[0].firstElementChild);

//     const rolesSelectOptionsContainer0 =
//       roleSelectListboxes[0].lastElementChild;
//     expect(rolesSelectOptionsContainer0.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer0.children.length).toBe(3);

//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer0.children[1]);

//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(roleSelectListboxes[1].firstElementChild);

//     const rolesSelectOptionsContainer1 =
//       roleSelectListboxes[1].lastElementChild;
//     expect(rolesSelectOptionsContainer1.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer1.children.length).toBe(2);

//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer1.children[1]);

//     expect(serialize()).toMatchSnapshot();

//     expect(sendInvitesButtons[0]).not.toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).not.toHaveAttribute('disabled');

//     done();
//   });

//   test('Assign & unassign roles', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     const setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;

//     userEvent.click(searchInput);
//     userEvent.click(participantClick);

//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');
//     expect(selected.children.length).toBe(2);

//     let roleSelectListboxes = await screen.getAllByRole('listbox');
//     expect(roleSelectListboxes.length).toBe(2);

//     expect(
//       roleSelectListboxes[0].lastElementChild.classList.contains('visible')
//     ).toBe(false);

//     userEvent.click(roleSelectListboxes[0].firstElementChild);

//     const rolesSelectOptionsContainer0 =
//       roleSelectListboxes[0].lastElementChild;
//     expect(rolesSelectOptionsContainer0.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer0.children.length).toBe(3);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer0.children[1]);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(roleSelectListboxes[0].firstElementChild);
//     // Select the first option, which is empty.
//     userEvent.click(rolesSelectOptionsContainer0.children[0]);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Select & unselect participant', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     const setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;

//     userEvent.click(searchInput);
//     userEvent.click(participantClick);
//     expect(serialize()).toMatchSnapshot();

//     const buttons = await screen.getAllByLabelText(/Remove /);
//     expect(buttons.length).toBe(1);

//     userEvent.click(buttons[0]);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Select, Assign a role, then Set roles & send invites', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     let sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     let setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;

//     userEvent.click(searchInput);
//     userEvent.click(participantClick);
//     expect(serialize()).toMatchSnapshot();

//     let roleSelectListboxes = await screen.getAllByRole('listbox');
//     expect(roleSelectListboxes.length).toBe(2);

//     expect(
//       roleSelectListboxes[0].lastElementChild.classList.contains('visible')
//     ).toBe(false);

//     userEvent.click(roleSelectListboxes[0].firstElementChild);

//     const rolesSelectOptionsContainer0 =
//       roleSelectListboxes[0].lastElementChild;
//     expect(rolesSelectOptionsContainer0.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer0.children.length).toBe(3);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer0.children[1]);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(roleSelectListboxes[0].firstElementChild);

//     sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(roleSelectListboxes[1].firstElementChild);

//     const rolesSelectOptionsContainer1 =
//       roleSelectListboxes[1].lastElementChild;
//     expect(rolesSelectOptionsContainer1.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer1.children.length).toBe(2);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer1.children[1]);
//     expect(serialize()).toMatchSnapshot();

//     sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).not.toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).not.toHaveAttribute('disabled');
//     expect(serialize()).toMatchSnapshot();

//     // Click the mini "Send invites" button
//     userEvent.click(sendInvitesButtons[0]);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() =>
//       expect(
//         screen.getByTestId('lobby-confirmation-dialog')
//       ).toBeInTheDocument()
//     );

//     // Then close the confirmation
//     const confirmationNoButton = await screen.findByRole('button', {
//       name: /no/i,
//     });
//     userEvent.click(confirmationNoButton);
//     expect(serialize()).toMatchSnapshot();

//     sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).not.toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).not.toHaveAttribute('disabled');
//     expect(serialize()).toMatchSnapshot();

//     // Click the "Set roles & send invites" button
//     userEvent.click(sendInvitesButtons[1]);
//     expect(serialize()).toMatchSnapshot();

//     // Confirm "Yes"
//     const confirmationYesButton = await screen.findByRole('button', {
//       name: /yes/i,
//     });
//     userEvent.click(confirmationYesButton);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() =>
//       expect(chatActions.createChatInvite).toHaveBeenCalled()
//     );

//     done();
//   });

//   test('Dismiss instructions', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const instructions = await screen.getByTestId(
//       'lobby-user-select-instructions'
//     );
//     const closeIcon = instructions.querySelector('.close.icon');
//     userEvent.click(closeIcon);
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });
// });

// describe('Without cohort', () => {
//   test('Both Send Invites buttons are disabled', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     const setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     done();
//   });

//   test('Click in search shows default list of available users', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const searchInput = await screen.getByRole('textbox');

//     userEvent.click(searchInput);

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const resultsContainer = participant.parentNode.parentNode;

//     expect(resultsContainer.classList.contains('visible')).toBe(true);
//     expect(resultsContainer.children.length).toBe(4);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Typing in search shows filtered list of available users', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const searchInput = await screen.getByRole('textbox');

//     userEvent.type(searchInput, 'facilitator');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const resultsContainer = participant.parentNode.parentNode;

//     expect(resultsContainer.classList.contains('visible')).toBe(true);
//     expect(resultsContainer.children.length).toBe(1);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Selecting from search results adds a participant', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     userEvent.type(searchInput, 'facilitator');

//     expect(selected.children.length).toBe(1);

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;
//     const resultsContainer = participant.parentNode.parentNode;

//     userEvent.click(participantClick);

//     expect(resultsContainer.classList.contains('visible')).toBe(false);
//     expect(serialize()).toMatchSnapshot();

//     expect(selected.children.length).toBe(2);

//     done();
//   });

//   test('Selecting too many shows a warning, remove an invite', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     userEvent.click(searchInput);
//     userEvent.clear(searchInput);
//     userEvent.type(searchInput, 'Facilitator');
//     expect(serialize()).toMatchSnapshot();

//     const facilitator = screen.getByLabelText(/Facilitator User/);
//     userEvent.click(facilitator.parentNode);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(searchInput);
//     userEvent.clear(searchInput);
//     userEvent.type(searchInput, 'Researcher');

//     const researcher = screen.getByLabelText(/Researcher User/);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(researcher.parentNode);
//     expect(serialize()).toMatchSnapshot();

//     const removeInviteButton = screen.getByText(/Remove a participant/);
//     userEvent.click(removeInviteButton);

//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Selecting too many shows a warning, discard selection', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     userEvent.click(searchInput);
//     userEvent.clear(searchInput);
//     userEvent.type(searchInput, 'Facilitator');
//     expect(serialize()).toMatchSnapshot();

//     const facilitator = screen.getByLabelText(/Facilitator User/);
//     userEvent.click(facilitator.parentNode);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(searchInput);
//     userEvent.clear(searchInput);
//     userEvent.type(searchInput, 'Researcher');

//     const researcher = screen.getByLabelText(/Researcher User/);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(researcher.parentNode);
//     expect(serialize()).toMatchSnapshot();

//     const removeInviteButton = screen.getByText(/Discard selection/);
//     userEvent.click(removeInviteButton);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Assigning roles enables Send Invites button', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     const setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;

//     userEvent.click(searchInput);
//     userEvent.click(participantClick);

//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');
//     expect(selected.children.length).toBe(2);

//     let roleSelectListboxes = await screen.getAllByRole('listbox');
//     expect(roleSelectListboxes.length).toBe(2);

//     expect(
//       roleSelectListboxes[0].lastElementChild.classList.contains('visible')
//     ).toBe(false);

//     userEvent.click(roleSelectListboxes[0].firstElementChild);

//     const rolesSelectOptionsContainer0 =
//       roleSelectListboxes[0].lastElementChild;
//     expect(rolesSelectOptionsContainer0.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer0.children.length).toBe(3);

//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer0.children[1]);

//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(roleSelectListboxes[1].firstElementChild);

//     const rolesSelectOptionsContainer1 =
//       roleSelectListboxes[1].lastElementChild;
//     expect(rolesSelectOptionsContainer1.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer1.children.length).toBe(2);

//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer1.children[1]);

//     expect(serialize()).toMatchSnapshot();

//     expect(sendInvitesButtons[0]).not.toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).not.toHaveAttribute('disabled');

//     done();
//   });

//   test('Assign & unassign roles', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     const setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;

//     userEvent.click(searchInput);
//     userEvent.click(participantClick);

//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');
//     expect(selected.children.length).toBe(2);

//     let roleSelectListboxes = await screen.getAllByRole('listbox');
//     expect(roleSelectListboxes.length).toBe(2);

//     expect(
//       roleSelectListboxes[0].lastElementChild.classList.contains('visible')
//     ).toBe(false);

//     userEvent.click(roleSelectListboxes[0].firstElementChild);

//     const rolesSelectOptionsContainer0 =
//       roleSelectListboxes[0].lastElementChild;
//     expect(rolesSelectOptionsContainer0.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer0.children.length).toBe(3);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer0.children[1]);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(roleSelectListboxes[0].firstElementChild);
//     // Select the first option, which is empty.
//     userEvent.click(rolesSelectOptionsContainer0.children[0]);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Select & unselect participant', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     const setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;

//     userEvent.click(searchInput);
//     userEvent.click(participantClick);
//     expect(serialize()).toMatchSnapshot();

//     const buttons = await screen.getAllByLabelText(/Remove /);
//     expect(buttons.length).toBe(1);

//     userEvent.click(buttons[0]);
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

//   test('Select, Assign a role, then Set roles & send invites', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     let sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');

//     let setRolesAndSendInvitesButton = await screen.getAllByText(
//       /Set roles & send invites/i
//     );
//     expect(setRolesAndSendInvitesButton.length).toBe(1);
//     expect(setRolesAndSendInvitesButton[0]).toHaveAttribute('disabled');

//     const selected = await screen.getByTestId('lobby-user-select-invitees');
//     const searchInput = await screen.getByRole('textbox');

//     const participant = screen.getByLabelText(/Facilitator User/);
//     const participantClick = participant.parentNode;

//     userEvent.click(searchInput);
//     userEvent.click(participantClick);
//     expect(serialize()).toMatchSnapshot();

//     let roleSelectListboxes = await screen.getAllByRole('listbox');
//     expect(roleSelectListboxes.length).toBe(2);

//     expect(
//       roleSelectListboxes[0].lastElementChild.classList.contains('visible')
//     ).toBe(false);

//     userEvent.click(roleSelectListboxes[0].firstElementChild);

//     const rolesSelectOptionsContainer0 =
//       roleSelectListboxes[0].lastElementChild;
//     expect(rolesSelectOptionsContainer0.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer0.children.length).toBe(3);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer0.children[1]);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(roleSelectListboxes[0].firstElementChild);

//     sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).toHaveAttribute('disabled');
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(roleSelectListboxes[1].firstElementChild);

//     const rolesSelectOptionsContainer1 =
//       roleSelectListboxes[1].lastElementChild;
//     expect(rolesSelectOptionsContainer1.classList.contains('visible')).toBe(
//       true
//     );
//     expect(rolesSelectOptionsContainer1.children.length).toBe(2);
//     expect(serialize()).toMatchSnapshot();

//     userEvent.click(rolesSelectOptionsContainer1.children[1]);
//     expect(serialize()).toMatchSnapshot();

//     sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).not.toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).not.toHaveAttribute('disabled');
//     expect(serialize()).toMatchSnapshot();

//     // Click the mini "Send invites" button
//     userEvent.click(sendInvitesButtons[0]);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() =>
//       expect(
//         screen.getByTestId('lobby-confirmation-dialog')
//       ).toBeInTheDocument()
//     );

//     // Then close the confirmation
//     const confirmationNoButton = await screen.findByRole('button', {
//       name: /no/i,
//     });
//     userEvent.click(confirmationNoButton);
//     expect(serialize()).toMatchSnapshot();

//     sendInvitesButtons = await screen.getAllByText(/send invites/i);
//     expect(sendInvitesButtons.length).toBe(2);
//     expect(sendInvitesButtons[0]).not.toHaveAttribute('disabled');
//     expect(sendInvitesButtons[1]).not.toHaveAttribute('disabled');
//     expect(serialize()).toMatchSnapshot();

//     // Click the "Set roles & send invites" button
//     userEvent.click(sendInvitesButtons[1]);
//     expect(serialize()).toMatchSnapshot();

//     // Confirm "Yes"
//     const confirmationYesButton = await screen.findByRole('button', {
//       name: /yes/i,
//     });
//     userEvent.click(confirmationYesButton);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() =>
//       expect(chatActions.createChatInvite).toHaveBeenCalled()
//     );

//     done();
//   });

//   test('Dismiss instructions', async (done) => {
//     const Component = LobbyUserSelect;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//     };

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();
//     await waitFor(() =>
//       expect(screen.getByTestId('lobby-user-select')).toBeInTheDocument()
//     );
//     expect(serialize()).toMatchSnapshot();

//     const instructions = await screen.getByTestId(
//       'lobby-user-select-instructions'
//     );
//     const closeIcon = instructions.querySelector('.close.icon');
//     userEvent.click(closeIcon);
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });
// });
