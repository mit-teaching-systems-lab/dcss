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
  GET_COHORT_SCENARIOS_SUCCESS,
  SET_COHORT_SUCCESS,
  GET_SCENARIOS_SUCCESS,
  GET_USER_SUCCESS,
  GET_USERS_SUCCESS
} from '../../actions/types';
import * as cohortActions from '../../actions/cohort';
import * as scenarioActions from '../../actions/scenario';
import * as userActions from '../../actions/user';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/cohort');
jest.mock('../../actions/scenario');
jest.mock('../../actions/user');
jest.mock('../../actions/users');

import Layout from '@utils/Layout';
jest.mock('@utils/Layout', () => {
  return {
    ...jest.requireActual('@utils/Layout'),
    isForMobile: jest.fn(() => false)
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

jest.mock('@utils/Layout', () => {
  return {
    ...jest.requireActual('@utils/Layout'),
    isForMobile: jest.fn(() => false)
  };
});

const facilitatorUser = {
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
const superUser = {
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

import CohortScenariosSelector from '../../components/Cohorts/CohortScenariosSelector.jsx';
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

  scenario.status = 2;
  scenario2.status = 2;

  scenarios = [scenario, scenario2];
  scenariosById = scenarios.reduce((accum, record) => {
    accum[record.id] = record;
    return accum;
  }, {});

  scenarioActions.getScenariosByStatus.mockImplementation(
    cohort => async dispatch => {
      dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
      return cohort;
    }
  );

  cohortActions.getCohortScenarios.mockImplementation(() => async dispatch => {
    const scenarios = [scenario, scenario2];
    dispatch({ type: GET_COHORT_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  });

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
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });

  cohortActions.setCohortScenarios.mockImplementation(
    cohort => async dispatch => {
      dispatch({ type: SET_COHORT_SUCCESS, cohort });
      return cohort;
    }
  );

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

test('CohortScenariosSelector', () => {
  expect(CohortScenariosSelector).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = CohortScenariosSelector;
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
  await screen.findByTestId('cohort-scenarios-selector');
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Has stepGroup', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    cohort: null,
    id: 1,
    stepGroup: <div>STEP GROUP PLACEHOLDER</div>
  };

  const state = {
    ...commonState,
    cohort: null
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();
  expect(cohortActions.getCohort).toHaveBeenCalledTimes(1);
  done();
});

test('No cohort in props', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    cohort: null,
    id: 1
  };

  const state = {
    ...commonState,
    cohort: null
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();
  expect(cohortActions.getCohort).toHaveBeenCalledTimes(1);
  done();
});

test('No scenarios in state', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    onSave: jest.fn(),
    onClose: jest.fn()
  };

  const state = {
    ...commonState,
    scenariosById: {},
    scenarios: []
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();
  expect(scenarioActions.getScenariosByStatus).toHaveBeenCalledTimes(1);
  done();
});

test('Has scenarios in state', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    onSave: jest.fn(),
    onClose: jest.fn()
  };

  const state = {
    ...commonState,
    scenariosById,
    scenarios
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();
  done();
});

test('User in scenario', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    onSave: jest.fn(),
    onClose: jest.fn()
  };

  const state = {
    ...commonState,
    scenariosById,
    scenarios,
    user: superUser
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();
  done();
});

test('Close', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    onSave: jest.fn(),
    onClose: jest.fn()
  };

  const state = {
    ...commonState,
    scenariosById,
    scenarios
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();

  const closeButton = screen.getByText(/close/i);

  userEvent.click(closeButton);
  expect(props.onClose).toHaveBeenCalledTimes(1);

  done();
});

test('Search for scenarios', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    onSave: jest.fn(),
    onClose: jest.fn()
  };

  const state = {
    ...commonState,
    scenariosById,
    scenarios
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();

  const searchInput = screen.getByLabelText('Search scenarios');

  userEvent.type(searchInput, 'Multiplayer');
  expect(serialize()).toMatchSnapshot();
  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(1);

  userEvent.clear(searchInput);
  expect(serialize()).toMatchSnapshot();
  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(2);

  userEvent.type(searchInput, 'm{backspace}');
  expect(serialize()).toMatchSnapshot();
  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(2);

  userEvent.type(searchInput, 'This is the description');
  expect(serialize()).toMatchSnapshot();
  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(2);

  done();
});

test('Select scenario', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    onSave: jest.fn(),
    onClose: jest.fn()
  };

  const state = {
    ...commonState,
    scenariosById,
    scenarios
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();
  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(2);

  const unselectedScenarioCards = screen.getAllByTestId(
    'unselected-scenario-card'
  );

  userEvent.click(unselectedScenarioCards[0]);

  expect(screen.getAllByTestId('selected-scenario-card').length).toBe(1);
  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(1);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Deselect scenario', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    onSave: jest.fn(),
    onClose: jest.fn()
  };

  const state = {
    ...commonState,
    scenariosById,
    scenarios
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();
  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(2);

  const unselectedScenarioCards = screen.getAllByTestId(
    'unselected-scenario-card'
  );

  userEvent.click(unselectedScenarioCards[0]);
  userEvent.click(unselectedScenarioCards[1]);

  const selectedScenarioCards = screen.getAllByTestId('selected-scenario-card');

  expect(selectedScenarioCards.length).toBe(2);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(selectedScenarioCards[0]);
  userEvent.click(selectedScenarioCards[1]);

  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(2);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Save selected scenarios', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    onSave: jest.fn(),
    onClose: jest.fn()
  };

  const state = {
    ...commonState,
    scenariosById,
    scenarios
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();
  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(2);

  const unselectedScenarioCards = screen.getAllByTestId(
    'unselected-scenario-card'
  );

  userEvent.click(unselectedScenarioCards[0]);
  userEvent.click(unselectedScenarioCards[1]);

  const selectedScenarioCards = screen.getAllByTestId('selected-scenario-card');

  expect(selectedScenarioCards.length).toBe(2);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(screen.getByText('Save'));

  expect(cohortActions.setCohortScenarios).toHaveBeenCalledTimes(1);
  expect(
    cohortActions.setCohortScenarios.mock.calls[0]
  ).toMatchInlineSnapshot();

  done();
});

test('Save and Close Buttons', async done => {
  const Component = CohortScenariosSelector;

  const props = {
    ...commonProps,
    onSave: jest.fn(),
    onClose: jest.fn(),
    buttons: {
      primary: {
        onClick: jest.fn()
      },
      secondary: {
        onClick: jest.fn()
      }
    }
  };

  const state = {
    ...commonState,
    scenariosById,
    scenarios
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await screen.findByTestId('cohort-scenarios-selector');
  expect(serialize()).toMatchSnapshot();
  expect(screen.getAllByTestId('unselected-scenario-card').length).toBe(2);

  const unselectedScenarioCards = screen.getAllByTestId(
    'unselected-scenario-card'
  );

  userEvent.click(unselectedScenarioCards[0]);
  userEvent.click(unselectedScenarioCards[1]);

  const selectedScenarioCards = screen.getAllByTestId('selected-scenario-card');

  expect(selectedScenarioCards.length).toBe(2);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(screen.getByText('Save'));
  userEvent.click(screen.getByText('Close'));

  await waitFor(() => {
    expect(props.buttons.primary.onClick).toHaveBeenCalledTimes(1);
    expect(props.buttons.secondary.onClick).toHaveBeenCalledTimes(1);
  });

  done();
});
