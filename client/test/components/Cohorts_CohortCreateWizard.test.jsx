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
  SET_COHORT_SUCCESS,
  GET_USER_SUCCESS
} from '../../actions/types';
import * as cohortActions from '@actions/cohort';
import * as userActions from '@actions/user';
jest.mock('../../actions/cohort');
jest.mock('../../actions/user');

let cohort;
let user;

import CohortCreateWizard from '../../components/Cohorts/CohortCreateWizard.jsx';
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
  user = {
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

  cohortActions.getCohort.mockImplementation(
    (id, updates) => async dispatch => {
      const updatedCohort = {
        cohort,
        ...updates
      };
      dispatch({ type: SET_COHORT_SUCCESS, cohort: updatedCohort });
      return updatedCohort;
    }
  );

  userActions.getUser.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_USER_SUCCESS, user });
    return user;
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

test('CohortCreateWizard', () => {
  expect(CohortCreateWizard).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = CohortCreateWizard;
  const props = {
    ...commonProps,
    onCancel: jest.fn(),
    onCreate: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('cohort-create-wizard')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Click cancel', async done => {
  const Component = CohortCreateWizard;
  const props = {
    ...commonProps,
    onCancel: jest.fn(),
    onCreate: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  await waitFor(() =>
    expect(screen.getByTestId('cohort-create-wizard')).toBeInTheDocument()
  );
  expect(serialize()).toMatchSnapshot();

  const createButton = await screen.findByRole('button', {
    name: /Cancel/i
  });

  expect(serialize()).toMatchSnapshot();
  done();
});

// test('Create a cohort', async done => {
//   const Component = CohortCreateNewForm;

//   const props = {
//     ...commonProps
//   };

//   const state = {
//     ...commonState
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);
//   ConnectedRoutedComponent.history.push = jest.fn();
//   ConnectedRoutedComponent.history.push.mockImplementation(() => {});

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();

//   await waitFor(() =>
//     expect(screen.getByTestId('cohort-create-new-form')).toBeInTheDocument()
//   );

//   const nameInput = await screen.findByRole('textbox');

//   const createButton = await screen.findByRole('button', {
//     name: /Create/i
//   });

//   userEvent.type(nameInput, 'A New Cohort');
//   userEvent.click(createButton);

//   expect(cohortActions.createCohort).toHaveBeenCalledTimes(1);
//   expect(cohortActions.createCohort.mock.calls).toMatchInlineSnapshot(`
//     Array [
//       Array [
//         Object {
//           "name": "A New Cohort",
//         },
//       ],
//     ]
//   `);

//   expect(serialize()).toMatchSnapshot();

//   done();
// });

// test('Create a cohort, cancel', async done => {
//   const Component = CohortCreateNewForm;

//   const props = {
//     ...commonProps
//   };

//   const state = {
//     ...commonState
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);
//   ConnectedRoutedComponent.history.push = jest.fn();
//   ConnectedRoutedComponent.history.push.mockImplementation(() => {});

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();

//   await waitFor(() =>
//     expect(screen.getByTestId('cohort-create-new-form')).toBeInTheDocument()
//   );

//   const nameInput = await screen.findByRole('textbox');

//   const cancelButton = await screen.findByRole('button', {
//     name: /Cancel/i
//   });

//   userEvent.type(nameInput, 'A New Cohort');
//   userEvent.click(cancelButton);

//   expect(cohortActions.createCohort).toHaveBeenCalledTimes(0);
//   expect(cohortActions.createCohort.mock.calls).toMatchInlineSnapshot(
//     `Array []`
//   );

//   expect(serialize()).toMatchSnapshot();

//   done();
// });

// test('Create a cohort, click twice, only makes one cohort', async done => {
//   const Component = CohortCreateNewForm;

//   const props = {
//     ...commonProps
//   };

//   const state = {
//     ...commonState
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);
//   ConnectedRoutedComponent.history.push = jest.fn();
//   ConnectedRoutedComponent.history.push.mockImplementation(() => {});

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();

//   await waitFor(() =>
//     expect(screen.getByTestId('cohort-create-new-form')).toBeInTheDocument()
//   );

//   const nameInput = await screen.findByRole('textbox');

//   const createButton = await screen.findByRole('button', {
//     name: /Create/i
//   });

//   userEvent.type(nameInput, 'A New Cohort');
//   userEvent.click(createButton);
//   userEvent.click(createButton);

//   expect(cohortActions.createCohort).toHaveBeenCalledTimes(1);
//   expect(cohortActions.createCohort.mock.calls).toMatchInlineSnapshot(`
//     Array [
//       Array [
//         Object {
//           "name": "A New Cohort",
//         },
//       ],
//     ]
//   `);

//   expect(serialize()).toMatchSnapshot();

//   done();
// });

// test('Use a mock stepGroup', async done => {
//   const Component = CohortCreateNewForm;

//   const props = {
//     ...commonProps,
//     stepGroup: 'THIS SHOULD APPEAR IN THE RENDERED COMPONENT'
//   };

//   const state = {
//     ...commonState
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);
//   ConnectedRoutedComponent.history.push = jest.fn();
//   ConnectedRoutedComponent.history.push.mockImplementation(() => {});

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();

//   await waitFor(() =>
//     expect(screen.getByTestId('cohort-create-new-form')).toBeInTheDocument()
//   );

//   expect(serialize()).toMatchSnapshot();

//   done();
// });

// test('Create: custom buttons', async done => {
//   const Component = CohortCreateNewForm;

//   const buttons = {
//     primary: {
//       onClick: jest.fn()
//     }
//   };

//   const props = {
//     ...commonProps,
//     buttons
//   };

//   const state = {
//     ...commonState
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);
//   ConnectedRoutedComponent.history.push = jest.fn();
//   ConnectedRoutedComponent.history.push.mockImplementation(() => {});

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();

//   await waitFor(() =>
//     expect(screen.getByTestId('cohort-create-new-form')).toBeInTheDocument()
//   );

//   const nameInput = await screen.findByRole('textbox');

//   const createButton = await screen.findByRole('button', {
//     name: /Create/i
//   });

//   userEvent.type(nameInput, 'A New Cohort');
//   userEvent.click(createButton);

//   expect(buttons.primary.onClick).toHaveBeenCalledTimes(0);
//   expect(buttons.primary.onClick.mock.calls).toMatchInlineSnapshot(`Array []`);

//   expect(serialize()).toMatchSnapshot();
//   done();
// });

// test('Cancel: custom buttons', async done => {
//   const Component = CohortCreateNewForm;

//   const buttons = {
//     secondary: {
//       onClick: jest.fn()
//     }
//   };

//   const props = {
//     ...commonProps,
//     buttons
//   };

//   const state = {
//     ...commonState
//   };

//   const ConnectedRoutedComponent = reduxer(Component, props, state);
//   ConnectedRoutedComponent.history.push = jest.fn();
//   ConnectedRoutedComponent.history.push.mockImplementation(() => {});

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();

//   await waitFor(() =>
//     expect(screen.getByTestId('cohort-create-new-form')).toBeInTheDocument()
//   );

//   const nameInput = await screen.findByRole('textbox');

//   const cancelButton = await screen.findByRole('button', {
//     name: /Cancel/i
//   });

//   userEvent.type(nameInput, 'A New Cohort');
//   userEvent.click(cancelButton);

//   expect(buttons.secondary.onClick).toHaveBeenCalledTimes(1);
//   expect(buttons.secondary.onClick.mock.calls).toMatchInlineSnapshot(`
//     Array [
//       Array [],
//     ]
//   `);

//   expect(serialize()).toMatchSnapshot();
//   done();
// });
