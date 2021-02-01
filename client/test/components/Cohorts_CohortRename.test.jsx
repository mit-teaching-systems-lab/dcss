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

import { SET_COHORT_SUCCESS } from '../../actions/types';
import * as cohortActions from '../../actions/cohort';
jest.mock('../../actions/cohort');

let cohort;

import CohortRename from '../../components/Cohorts/CohortRename.jsx';

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

test('CohortRename', () => {
  expect(CohortRename).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = CohortRename;

  const props = {
    ...commonProps,
    cohort,
    onClose: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

/* INJECTION STARTS HERE */

test('Save name when type and hit {enter}, or click Save', async done => {
  const Component = CohortRename;

  window.confirm = jest.fn();
  window.confirm.mockImplementation(() => true);

  const props = {
    ...commonProps,
    cohort,
    onClose: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const renameInput = await screen.getByLabelText(/Rename .+/i);

  userEvent.type(renameInput, 'blah{enter}');
  expect(asFragment()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.setCohort).toHaveBeenCalledTimes(1);
  });

  const saveButton = await screen.getByLabelText('Save');

  userEvent.type(renameInput, 'glarb');
  userEvent.click(saveButton);
  expect(asFragment()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.setCohort).toHaveBeenCalledTimes(2);
  });
  done();
});

test('Cannot save empty name when type and hit {enter}, or click Save', async done => {
  const Component = CohortRename;

  window.confirm = jest.fn();
  window.confirm.mockImplementation(() => true);

  const props = {
    ...commonProps,
    cohort,
    onClose: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const renameInput = await screen.getByLabelText(/Rename .+/i);

  userEvent.clear(renameInput);
  userEvent.type(renameInput, '{enter}');
  expect(asFragment()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.setCohort).toHaveBeenCalledTimes(0);
  });

  const saveButton = await screen.getByLabelText('Save');

  userEvent.type(renameInput, '');
  userEvent.click(saveButton);
  expect(asFragment()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.setCohort).toHaveBeenCalledTimes(0);
  });
  done();
});

test('Will not save if confirm is "no"', async done => {
  const Component = CohortRename;

  window.confirm = jest.fn();
  window.confirm.mockImplementation(() => false);

  const props = {
    ...commonProps,
    cohort,
    onClose: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const renameInput = await screen.getByLabelText(/Rename .+/i);

  userEvent.type(renameInput, 'blah{enter}');
  expect(asFragment()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.setCohort).toHaveBeenCalledTimes(0);
  });

  const saveButton = await screen.getByLabelText('Save');

  userEvent.type(renameInput, 'glarb');
  userEvent.click(saveButton);
  expect(asFragment()).toMatchSnapshot();

  await waitFor(() => {
    expect(cohortActions.setCohort).toHaveBeenCalledTimes(0);
  });
  done();
});
