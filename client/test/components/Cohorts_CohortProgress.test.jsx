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

import {
  GET_COHORT_SUCCESS,
  GET_COHORT_SCENARIOS_PROGRESS_SUCCESS
} from '../../actions/types';
import * as cohortActions from '../../actions/cohort';
jest.mock('../../actions/cohort');

import Layout from '@utils/Layout';
jest.mock('@utils/Layout', () => {
  return {
    ...jest.requireActual('@utils/Layout'),
    isForMobile: jest.fn(() => false),
    isNotForMobile: jest.fn(() => true)
  };
});

import copy from 'copy-text-to-clipboard';
jest.mock('copy-text-to-clipboard', () => {
  return jest.fn();
});

import Storage from '@utils/Storage';
jest.mock('@utils/Storage', () => {
  return {
    ...jest.requireActual('@utils/Storage'),
    get: jest.fn(),
    set: jest.fn()
  };
});

import { notify } from '@components/Notification';
jest.mock('@components/Notification', () => {
  return {
    ...jest.requireActual('@components/Notification'),
    notify: jest.fn()
  };
});

Storage.get.mockImplementation(key => {
  return {
    refresh: false
  };
});

let cohort;
let scenarios;
let scenariosById;

import CohortProgress from '../../components/Cohorts/CohortProgress.jsx';
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

  Layout.isForMobile = jest.fn();

  Layout.isForMobile.mockImplementation(() => false);

  Layout.isNotForMobile = jest.fn();

  Layout.isNotForMobile.mockImplementation(() => true);

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
              is_run: true,
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
              description: '',
              is_run: true,
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
              is_run: true,
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
              description: '',
              is_run: true,
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
  scenarios = [
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
  scenariosById = scenarios.reduce((accum, record) => {
    accum[record.id] = record;
    return accum;
  }, {});

  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
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

test('CohortProgress', () => {
  expect(CohortProgress).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = CohortProgress;
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

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Search participants', async done => {
  const Component = CohortProgress;

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

  expect(setTimeout).toHaveBeenCalledTimes(0);
  await screen.findByTestId('cohort-progress');
  expect(asFragment()).toMatchSnapshot();

  jest.advanceTimersByTime(10);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(asFragment()).toMatchSnapshot();

  const searchInput = await screen.findByLabelText('Search participants');

  // "researcher"
  userEvent.type(searchInput, 'resea{enter}');
  expect(asFragment()).toMatchSnapshot();

  jest.advanceTimersByTime(10);
  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(asFragment()).toMatchSnapshot();

  userEvent.type(searchInput, '{selectall}{backspace}');
  expect(asFragment()).toMatchSnapshot();

  // "owner"
  userEvent.type(searchInput, 'owner{enter}');
  expect(asFragment()).toMatchSnapshot();

  jest.advanceTimersByTime(10);
  expect(setTimeout).toHaveBeenCalledTimes(3);
  expect(asFragment()).toMatchSnapshot();

  // "researcher@email.com"
  userEvent.type(searchInput, '{selectall}{backspace}');
  userEvent.type(searchInput, 'researcher@email.com{enter}');
  expect(asFragment()).toMatchSnapshot();

  jest.advanceTimersByTime(10);
  expect(setTimeout).toHaveBeenCalledTimes(4);
  expect(asFragment()).toMatchSnapshot();

  userEvent.type(
    searchInput,
    '{selectall}{backspace}nothing will match this{enter}'
  );
  expect(asFragment()).toMatchSnapshot();

  userEvent.type(searchInput, '{selectall}{backspace}');
  expect(asFragment()).toMatchSnapshot();

  jest.advanceTimersByTime(10);
  expect(setTimeout).toHaveBeenCalledTimes(5);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Open Manage participants', async done => {
  const Component = CohortProgress;

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

  expect(setTimeout).toHaveBeenCalledTimes(0);
  await screen.findByTestId('cohort-progress');
  expect(asFragment()).toMatchSnapshot();

  jest.advanceTimersByTime(10);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Manage participants'));
  await screen.findByTestId('cohort-participants');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Close'));
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('All users complete', async done => {
  const Component = CohortProgress;

  cohort.users.forEach(user => {
    user.progress.completed.push(99);
  });

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
  done();
});

test('All users have not completed', async done => {
  const Component = CohortProgress;

  cohort.users.forEach(user => {
    user.progress.completed = [];
  });

  const props = {
    ...commonProps,
    id: 1,
    authority: { isFacilitator: true, isParticipant: true }
  };

  const state = {
    ...commonState,
    scenarios,
    scenariosById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  done();
});

test('All users have not started', async done => {
  const Component = CohortProgress;

  cohort.users.forEach(user => {
    user.progress.completed = [];
    user.progress.latestByScenarioId = {};
  });

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
  done();
});

test('Click to see all response', async done => {
  const Component = CohortProgress;

  const props = {
    ...commonProps,
    id: 1,
    authority: { isFacilitator: true, isParticipant: true },
    onClick: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const viewResponsesButtons = await screen.findAllByTestId(
    'view-participant-responses'
  );

  userEvent.click(viewResponsesButtons[0]);
  expect(props.onClick).toHaveBeenCalledTimes(1);
  expect(props.onClick.mock.calls[0][1]).toMatchInlineSnapshot(`
    Object {
      "as": "button",
      "children": "View responses",
      "className": "c__participant-card__responses",
      "data-testid": "view-participant-responses",
      "onClick": [Function],
      "primary": true,
      "size": "large",
      "source": Object {
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
          "status": "incomplete",
        },
        "roles": Array [
          "participant",
          "super_admin",
        ],
        "username": "super",
      },
      "type": "participant",
    }
  `);

  userEvent.click(viewResponsesButtons[1]);
  expect(props.onClick).toHaveBeenCalledTimes(2);
  expect(props.onClick.mock.calls[1][1]).toMatchInlineSnapshot(`
    Object {
      "as": "button",
      "children": "View responses",
      "className": "c__participant-card__responses",
      "data-testid": "view-participant-responses",
      "onClick": [Function],
      "primary": true,
      "size": "large",
      "source": Object {
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
          "status": "incomplete",
        },
        "roles": Array [
          "participant",
          "facilitator",
          "researcher",
          "owner",
        ],
        "username": "facilitator",
      },
      "type": "participant",
    }
  `);

  userEvent.click(viewResponsesButtons[2]);
  expect(props.onClick).toHaveBeenCalledTimes(3);
  expect(props.onClick.mock.calls[2][1]).toMatchInlineSnapshot(`
    Object {
      "as": "button",
      "children": "View responses",
      "className": "c__participant-card__responses",
      "data-testid": "view-participant-responses",
      "onClick": [Function],
      "primary": true,
      "size": "large",
      "source": Object {
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
          "status": "incomplete",
        },
        "roles": Array [
          "participant",
          "researcher",
        ],
        "username": "researcher",
      },
      "type": "participant",
    }
  `);

  userEvent.click(viewResponsesButtons[3]);
  expect(props.onClick).toHaveBeenCalledTimes(4);
  expect(props.onClick.mock.calls[3][1]).toMatchInlineSnapshot(`
    Object {
      "as": "button",
      "children": "View responses",
      "className": "c__participant-card__responses",
      "data-testid": "view-participant-responses",
      "onClick": [Function],
      "primary": true,
      "size": "large",
      "source": Object {
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
              "generic": "arrived at a slide.",
              "is_complete": false,
              "is_run": true,
              "name": "slide-arrival",
              "scenario_id": 99,
              "url": "http://localhost:3000/cohort/1/run/99/slide/1",
            },
          },
          "status": "incomplete",
        },
        "roles": Array [
          "participant",
        ],
        "username": "participant",
      },
      "type": "participant",
    }
  `);

  userEvent.click(viewResponsesButtons[4]);
  expect(props.onClick).toHaveBeenCalledTimes(5);
  expect(props.onClick.mock.calls[4][1]).toMatchInlineSnapshot(`
    Object {
      "as": "button",
      "children": "View responses",
      "className": "c__participant-card__responses",
      "data-testid": "view-participant-responses",
      "onClick": [Function],
      "primary": true,
      "size": "large",
      "source": Object {
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
              "generic": "arrived at a slide.",
              "is_complete": false,
              "is_run": true,
              "name": "slide-arrival",
              "scenario_id": 99,
              "url": "http://localhost:3000/cohort/1/run/99/slide/1",
            },
          },
          "status": "incomplete",
        },
        "roles": Array [
          "participant",
        ],
        "username": "anonymous",
      },
      "type": "participant",
    }
  `);

  done();
});
