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

import * as tlr from '@testing-library/react';

import {
  CREATE_COHORT_SUCCESS,
  GET_CHATS_SUCCESS,
  SET_COHORT_USER_ROLE_SUCCESS,
  GET_COHORT_SUCCESS,
  GET_COHORT_SCENARIOS_SUCCESS,
  GET_USER_SUCCESS,
  GET_USERS_SUCCESS,
  SET_COHORT_SUCCESS
} from '../../actions/types';
import * as chatActions from '../../actions/chat';
import * as cohortActions from '../../actions/cohort';
import * as userActions from '../../actions/user';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/chat');
jest.mock('../../actions/cohort');
jest.mock('../../actions/user');
jest.mock('../../actions/users');
jest.mock('@components/Cohorts/DataTable', () => {
  return props => <div>@components/Cohorts/DataTable</div>;
});
jest.mock('@components/Cohorts/CohortParticipants', () => {
  return props => {
    return (
      <div>
        <button {...props}>@components/Cohorts/CohortParticipants</button>;
      </div>
    );
  };
});

jest.mock('@components/Cohorts/CohortScenarios', () => {
  return props => {
    return (
      <div>
        <button {...props}>@components/Cohorts/CohortScenarios</button>
      </div>
    );
  };
});

import Storage from '@utils/Storage';
jest.mock('@utils/Storage', () => {
  return {
    ...jest.requireActual('@utils/Storage'),
    get: jest.fn(),
    set: jest.fn()
  };
});

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

let chat;
let chats;
let chatsById;
let chatUsers;
let chatUsersById;
let cohort;

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
let scenarios;
let scenariosById;
let user;

import Cohort from '../../components/Cohorts/Cohort.jsx';
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

  scenario.status = 2;
  scenario2.status = 2;

  scenarios = [scenario, scenario2];
  scenariosById = scenarios.reduce((accum, record) => {
    accum[record.id] = record;
    return accum;
  }, {});

  user = {
    username: 'super',
    personalname: 'Super User',
    email: 'super@email.com',
    id: 999,
    roles: ['participant', 'super_admin'],
    is_anonymous: false,
    is_super: true
  };

  chatUsers = [
    user,
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
  ];

  chatUsersById = chatUsers.reduce((accum, chatUser) => {
    accum[chatUser.id] = chatUser;
    return accum;
  }, {});

  chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: null,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    users: chatUsers,
    usersById: chatUsersById
  };

  chats = [chat];

  chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  }, {});

  chatActions.getChatsByCohortId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHATS_SUCCESS, chats });
    return chats;
  });

  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });

  cohortActions.getCohortScenarios.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_COHORT_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  });

  cohortActions.setCohort.mockImplementation((id, params) => async dispatch => {
    const updatedCohort = {
      ...cohort,
      ...params
    };

    dispatch({
      type: SET_COHORT_SUCCESS,
      cohort: updatedCohort
    });
    return updatedCohort;
  });

  cohortActions.copyCohort.mockImplementation(id => async dispatch => {
    const newCohort = {
      ...cohort
    };

    newCohort.id++;
    newCohort.name += ' COPY';

    dispatch({
      type: CREATE_COHORT_SUCCESS,
      cohort: newCohort
    });
    return newCohort;
  });
  cohortActions.linkUserToCohort.mockImplementation(() => async dispatch => {
    dispatch({ type: SET_COHORT_USER_ROLE_SUCCESS, cohort });
    return cohort;
  });
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
    ];
    dispatch({ type: GET_USERS_SUCCESS, users });
    return users;
  });

  Storage.get.mockImplementation(key => {
    return {
      activeTabKey: 'cohort',
      tabs: []
    };
  });

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

test('Cohort', () => {
  expect(Cohort).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = Cohort;
  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  // 0
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 2 1', async done => {
  const Component = Cohort;
  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  state.cohortsById = {};
  state.cohorts = [];
  const ConnectedRoutedComponent = reduxer(Component, props, state);

  // 1
  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    const cohort = {
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
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 3 1', async done => {
  const Component = Cohort;
  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  // 2
  state.cohortsById = {};
  state.cohorts = [];
  state.cohort = { id: null, name: '' };
  const ConnectedRoutedComponent = reduxer(Component, props, state);

  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    const cohort = {
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
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 4 1', async done => {
  const Component = Cohort;
  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  // 3
  userActions.getUser = jest.fn();

  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'invited',
      personalname: '',
      email: '',
      id: 111,
      roles: [],
      is_anonymous: true,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: false,
            scenario_id: 99,
            event_id: 1901,
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
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 5 1', async done => {
  const Component = Cohort;
  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  // 4
  userActions.getUser = jest.fn();

  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'invited',
      personalname: '',
      email: '',
      id: 111,
      roles: [],
      is_anonymous: true,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: false,
            scenario_id: 99,
            event_id: 1901,
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
  userActions.getCohort = jest.fn();

  userActions.getCohort.mockImplementation(() => async dispatch => {
    const cohort = {
      id: 1,
      created_at: '2020-06-31T14:01:08.656Z',
      deleted_at: '2020-07-28T15:42:23.898Z',
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
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 6 1', async done => {
  const Component = Cohort;
  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const history = {
    initialEntries: ['?ref=1']
  };
  const ConnectedRoutedComponent = reduxer(Component, props, state, history);

  // 5
  userActions.getUser = jest.fn();

  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = {
      username: 'invited',
      personalname: '',
      email: '',
      id: 111,
      roles: [],
      is_anonymous: true,
      is_super: false,
      progress: {
        completed: [],
        latestByScenarioId: {
          1: {
            description: '',
            is_run: true,
            is_complete: false,
            scenario_id: 99,
            event_id: 1901,
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
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);

  await screen.findByTestId('cohort-boundary-bottom');
  expect(asFragment()).toMatchSnapshot();

  // screen.debug();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 7 1', async done => {
  const Component = Cohort;
  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  // 6
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
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(asFragment()).toMatchSnapshot();

  // screen.debug();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 8 1', async done => {
  const Component = Cohort;
  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  // 8
  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    const cohort = {
      id: 1,
      created_at: '2020-06-31T14:01:08.656Z',
      deleted_at: '2020-07-28T15:42:23.898Z',
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
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });
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
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  expect(asFragment()).toMatchSnapshot();

  // screen.debug();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 9 1', async done => {
  const Component = Cohort;
  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  // 9
  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    const cohort = {
      id: 1,
      created_at: '2020-06-31T14:01:08.656Z',
      deleted_at: '2020-07-28T15:42:23.898Z',
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
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });
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
    };
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(asFragment()).toMatchSnapshot();

  // screen.debug();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('User missing, direct to /logout', async done => {
  const Component = Cohort;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  ConnectedRoutedComponent.history.push = jest.fn();
  ConnectedRoutedComponent.history.push.mockImplementation(() => {});

  userActions.getUser = jest.fn();
  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = {};
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });
  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  await screen.findByRole('status', { busy: true, live: 'polite' });
  expect(serialize()).toMatchSnapshot();

  expect(ConnectedRoutedComponent.history.push.mock.calls.length).toBe(1);
  expect(ConnectedRoutedComponent.history.push.mock.calls[0])
    .toMatchInlineSnapshot(`
    Array [
      "/logout",
    ]
  `);

  done();
});

test('Cohort is deleted, user is not super, direct to /cohorts', async done => {
  const Component = Cohort;

  const cohort = {
    id: 1,
    created_at: '2020-06-31T14:01:08.656Z',
    deleted_at: '2020-07-28T15:42:23.898Z',
    name: 'A New Cohort That Exists Within Inline Props',
    runs: [],
    scenarios: [99],
    users: [
      {
        username: 'facilitator',
        personalname: 'Facilitator User',
        email: 'facilitator@email.com',
        id: 555,
        roles: ['participant', 'facilitator', 'researcher', 'owner'],
        is_anonymous: false,
        is_super: false,
        is_owner: true
      }
    ],
    roles: ['facilitator'],
    usersById: {
      555: {
        username: 'facilitator',
        personalname: 'Facilitator User',
        email: 'facilitator@email.com',
        id: 555,
        roles: ['participant', 'facilitator', 'researcher', 'owner'],
        is_anonymous: false,
        is_super: false,
        is_owner: true
      }
    }
  };

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState,
    cohort
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  ConnectedRoutedComponent.history.push = jest.fn();
  ConnectedRoutedComponent.history.push.mockImplementation(() => {});

  userActions.getUser = jest.fn();
  userActions.getUser.mockImplementation(() => async dispatch => {
    const user = { id: 555, is_super: false };
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
  });
  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  expect(Storage.get.mock.calls.length).toBe(1);
  expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "cohort/1",
      Object {
        "activeTabKey": "cohort",
        "tabs": Array [],
      },
    ]
  `);
  expect(serialize()).toMatchSnapshot();

  await screen.findByRole('status', { busy: true, live: 'polite' });
  expect(serialize()).toMatchSnapshot();

  expect(ConnectedRoutedComponent.history.push.mock.calls.length).toBe(1);
  expect(ConnectedRoutedComponent.history.push.mock.calls[0])
    .toMatchInlineSnapshot(`
    Array [
      "/cohorts",
    ]
  `);

  done();
});

// test('Mock CohortScenarios', async done => {

//   const Component = Cohort;

//   const props = {
//     ...commonProps,
//     id: 1
//   };

//   const state = {
//     ...commonState
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);

//   cohortActions.getCohort = jest.fn();
//   cohortActions.getCohort.mockImplementation(() => async dispatch => {
//     const cohort = {
//       id: 1,
//       created_at: '2020-06-31T14:01:08.656Z',
//       deleted_at: '2020-07-28T15:42:23.898Z',
//       name: 'A New Cohort That Exists Within Inline Props',
//       runs: [
//         {
//           id: 11,
//           user_id: 333,
//           scenario_id: 99,
//           created_at: '2020-03-28T19:44:03.069Z',
//           updated_at: '2020-03-31T17:01:43.139Z',
//           ended_at: '2020-03-31T17:01:43.128Z',
//           consent_id: 8,
//           consent_acknowledged_by_user: true,
//           consent_granted_by_user: true,
//           referrer_params: null,
//           cohort_id: 1,
//           run_id: 11
//         }
//       ],
//       scenarios: [99],
//       users: [
//         {
//           username: 'super',
//           personalname: 'Super User',
//           email: 'super@email.com',
//           id: 999,
//           roles: ['participant', 'super_admin'],
//           is_anonymous: false,
//           is_super: true
//         },
//         {
//           username: 'facilitator',
//           personalname: 'Facilitator User',
//           email: 'facilitator@email.com',
//           id: 555,
//           roles: ['participant', 'facilitator', 'researcher', 'owner'],
//           is_anonymous: false,
//           is_super: false,
//           is_owner: true
//         },
//         {
//           username: 'researcher',
//           personalname: 'Researcher User',
//           email: 'researcher@email.com',
//           id: 444,
//           roles: ['participant', 'researcher'],
//           is_anonymous: false,
//           is_super: false
//         },
//         {
//           username: 'participant',
//           personalname: 'Participant User',
//           email: 'participant@email.com',
//           id: 333,
//           roles: ['participant'],
//           is_anonymous: false,
//           is_super: false
//         },
//         {
//           username: 'anonymous',
//           personalname: '',
//           email: '',
//           id: 222,
//           roles: ['participant'],
//           is_anonymous: true,
//           is_super: false
//         }
//       ],
//       roles: ['super', 'facilitator'],
//       usersById: {
//         999: {
//           username: 'super',
//           personalname: 'Super User',
//           email: 'super@email.com',
//           id: 999,
//           roles: ['participant', 'super_admin'],
//           is_anonymous: false,
//           is_super: true
//         },
//         555: {
//           username: 'facilitator',
//           personalname: 'Facilitator User',
//           email: 'facilitator@email.com',
//           id: 555,
//           roles: ['participant', 'facilitator', 'researcher', 'owner'],
//           is_anonymous: false,
//           is_super: false,
//           is_owner: true
//         },
//         444: {
//           username: 'researcher',
//           personalname: 'Researcher User',
//           email: 'researcher@email.com',
//           id: 444,
//           roles: ['participant', 'researcher'],
//           is_anonymous: false,
//           is_super: false
//         },
//         333: {
//           username: 'participant',
//           personalname: 'Participant User',
//           email: 'participant@email.com',
//           id: 333,
//           roles: ['participant'],
//           is_anonymous: false,
//           is_super: false
//         },
//         222: {
//           username: 'anonymous',
//           personalname: '',
//           email: '',
//           id: 222,
//           roles: ['participant'],
//           is_anonymous: true,
//           is_super: false
//         }
//       }
//     };
//     dispatch({ type: GET_COHORT_SUCCESS, cohort });
//     return cohort;
//   });
//   userActions.getUser = jest.fn();
//   userActions.getUser.mockImplementation(() => async dispatch => {
//     const user = {
//       username: 'facilitator',
//       personalname: 'Facilitator User',
//       email: 'facilitator@email.com',
//       id: 555,
//       roles: ['participant', 'facilitator', 'researcher', 'owner'],
//       is_anonymous: false,
//       is_super: false,
//       is_owner: true
//     };
//     dispatch({ type: GET_USER_SUCCESS, user });
//     return user;
//   });

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();
//   expect(Storage.get.mock.calls.length).toBe(1);
//   expect(Storage.get.mock.calls[0]).toMatchInlineSnapshot(`
//     Array [
//       "cohort/1",
//       Object {
//         "activeTabKey": "cohort",
//         "tabs": Array [],
//       },
//     ]
//   `);
//   expect(serialize()).toMatchSnapshot();

//   const button = await screen.findByRole('button', {
//     name: /@components\/Cohorts\/CohortScenarios/i
//   });

//   expect(serialize()).toMatchSnapshot();

//   userEvent.click(button);

//   expect(serialize()).toMatchSnapshot();

//   done();
// });

test('Copy cohort url', async done => {
  const Component = Cohort;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState,
    scenariosById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(serialize()).toMatchSnapshot();

  const button = await screen.findByText('Copy cohort link to clipboard');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(button);
  expect(serialize()).toMatchSnapshot();
  expect(copy).toHaveBeenCalledTimes(1);
  expect(copy.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "http://localhost/cohort/6e4213d8d3",
      ],
    ]
  `);
  expect(notify).toHaveBeenCalledTimes(1);
  expect(notify.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "icon": "linkify",
          "message": "http://localhost/cohort/6e4213d8d3",
          "title": "Copied",
        },
      ],
    ]
  `);

  done();
});

test('Cohort is archived', async done => {
  const Component = Cohort;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState,
    scenariosById
  };

  state.cohort.is_archived = true;

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Rename cohort', async done => {
  const Component = Cohort;

  window.confirm = jest.fn();
  window.confirm.mockImplementation(() => true);

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState,
    scenariosById
  };

  state.cohort.is_archived = true;

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(serialize()).toMatchSnapshot();

  const dropdown = (await screen.findAllByRole('listbox'))[0];

  userEvent.click(dropdown);
  expect(serialize()).toMatchSnapshot();

  const options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[1]);
  expect(serialize()).toMatchSnapshot();

  const renameInput = await screen.getByLabelText(/Rename .+/i);
  const saveButton = await screen.getByLabelText('Save');

  userEvent.type(renameInput, 'blah');
  userEvent.click(saveButton);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.setCohort).toHaveBeenCalledTimes(1);
  });

  done();
});

test('Archive cohort', async done => {
  const Component = Cohort;

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(serialize()).toMatchSnapshot();

  const dropdown = (await screen.findAllByRole('listbox'))[0];

  userEvent.click(dropdown);
  expect(serialize()).toMatchSnapshot();

  let options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(serialize()).toMatchSnapshot();

  const no = await screen.findByLabelText('No');

  userEvent.click(no);
  expect(serialize()).toMatchSnapshot();

  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(serialize()).toMatchSnapshot();

  const yes = await screen.findByLabelText('Yes');
  userEvent.click(yes);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.setCohort).toHaveBeenCalledTimes(1);
  });

  done();
});

test('Delete cohort', async done => {
  const Component = Cohort;

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    href: ''
  };

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(serialize()).toMatchSnapshot();

  const dropdown = (await screen.findAllByRole('listbox'))[0];

  userEvent.click(dropdown);
  expect(serialize()).toMatchSnapshot();

  let options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[3]);
  expect(serialize()).toMatchSnapshot();

  const no = await screen.findByLabelText('No');

  userEvent.click(no);
  expect(serialize()).toMatchSnapshot();

  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[3]);
  expect(serialize()).toMatchSnapshot();

  const yes = await screen.findByLabelText('Yes');
  userEvent.click(yes);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.setCohort).toHaveBeenCalledTimes(1);
  });

  expect(window.location.href).toMatchInlineSnapshot(`"/cohorts"`);
  done();
});

test('Copy cohort', async done => {
  const Component = Cohort;

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    href: ''
  };

  const props = {
    ...commonProps,
    id: 1
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-boundary-bottom');
  expect(serialize()).toMatchSnapshot();

  const dropdown = (await screen.findAllByRole('listbox'))[0];

  userEvent.click(dropdown);
  expect(serialize()).toMatchSnapshot();

  let options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[2]);
  expect(serialize()).toMatchSnapshot();

  const no = await screen.findByLabelText('No');

  userEvent.click(no);
  expect(serialize()).toMatchSnapshot();

  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[2]);
  expect(serialize()).toMatchSnapshot();

  const yes = await screen.findByLabelText('Yes');
  userEvent.click(yes);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.copyCohort).toHaveBeenCalledTimes(1);
  });

  expect(window.location.href).toMatchInlineSnapshot(`"/cohort/6c4adee67a"`);
  done();
});
