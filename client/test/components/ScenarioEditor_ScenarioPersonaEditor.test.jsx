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
/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

import {
  GET_PERSONA_SUCCESS,
  SET_SCENARIO,
  SET_PERSONA_SUCCESS
} from '../../actions/types';
import * as personaActions from '../../actions/persona';
jest.mock('../../actions/persona');

import { notify } from '@components/Notification';
jest.mock('@components/Notification', () => {
  return {
    ...jest.requireActual('@components/Notification'),
    notify: jest.fn()
  };
});

const persona = {
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
};
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
const personasById = personas.reduce((accum, persona) => {
  accum[persona.id] = persona;
  return accum;
}, {});

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
const usersById = {
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
  },
  111: {
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
  }
};
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

import ScenarioPersonaEditor from '../../components/ScenarioEditor/ScenarioPersonaEditor.jsx';
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

  personaActions.setPersona = jest.fn();

  personaActions.setPersona.mockImplementation(
    (id, persona) => async dispatch => {
      dispatch({ type: SET_PERSONA_SUCCESS, persona });
      return persona;
    }
  );
  personaActions.createPersona = jest.fn();

  personaActions.createPersona.mockImplementation(persona => async dispatch => {
    dispatch({ type: GET_PERSONA_SUCCESS, persona });
    return persona;
  });
  personaActions.linkPersonaToScenario = jest.fn();

  personaActions.linkPersonaToScenario.mockImplementation(
    (persona_id, scenario_id) => async (dispatch, getState) => {
      const { scenario } = getState();
      Object.assign(scenario, { personas });
      dispatch({ type: SET_SCENARIO, scenario });
      return scenario;
    }
  );
  personaActions.unlinkPersonaFromScenario = jest.fn();

  personaActions.unlinkPersonaFromScenario.mockImplementation(
    (persona_id, scenario_id) => async (dispatch, getState) => {
      const { scenario } = getState();
      Object.assign(scenario, { personas });
      dispatch({ type: SET_SCENARIO, scenario });
      return scenario;
    }
  );

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

test('ScenarioPersonaEditor', () => {
  expect(ScenarioPersonaEditor).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = ScenarioPersonaEditor;
  const props = {
    ...commonProps,
    persona: {
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
    },
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  userEvent.click(await screen.findByRole('button', { name: /Close/ }));
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Errors', async done => {
  const Component = ScenarioPersonaEditor;

  const props = {
    ...commonProps,
    persona: null,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const name = await screen.findByLabelText('Persona name');
  const description = await screen.findByLabelText('Persona description');

  // Try with no name
  userEvent.clear(name);
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(serialize()).toMatchSnapshot();

  // Then add a name
  userEvent.type(name, 'A new persona name');
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(serialize()).toMatchSnapshot();

  // Then add a description
  userEvent.type(description, 'Some description');
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Close color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Re-open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Click on a color
    userEvent.click(await screen.findByTitle('#781c81'));
  });

  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(serialize()).toMatchSnapshot();

  expect(personaActions.createPersona.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "author_id": null,
        "color": "#781c81",
        "created_at": null,
        "deleted_at": null,
        "description": "Some description",
        "id": null,
        "is_read_only": false,
        "is_shared": false,
        "name": "A new persona name",
        "updated_at": null,
      },
    ]
  `);

  done();
});

test('Create a persona', async done => {
  const Component = ScenarioPersonaEditor;

  const props = {
    ...commonProps,
    persona: null,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const name = await screen.findByLabelText('Persona name');
  const description = await screen.findByLabelText('Persona description');

  // Try with no name
  userEvent.clear(name);
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(serialize()).toMatchSnapshot();

  // Then add a name
  userEvent.type(name, 'A new persona name');
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(serialize()).toMatchSnapshot();

  // Then add a description
  userEvent.type(description, 'Some description');
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Close color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Re-open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Click on a color
    userEvent.click(await screen.findByTitle('#781c81'));
  });

  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(serialize()).toMatchSnapshot();

  expect(personaActions.createPersona.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "author_id": null,
        "color": "#781c81",
        "created_at": null,
        "deleted_at": null,
        "description": "Some description",
        "id": null,
        "is_read_only": false,
        "is_shared": false,
        "name": "A new persona name",
        "updated_at": null,
      },
    ]
  `);

  done();
});

test('Edit a readonly persona (results in create)', async done => {
  const Component = ScenarioPersonaEditor;

  const props = {
    ...commonProps,
    persona,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const name = await screen.findByLabelText('Persona name');
  const description = await screen.findByLabelText('Persona description');

  userEvent.clear(name);
  userEvent.clear(description);

  // Try with no name
  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(serialize()).toMatchSnapshot();

  // Then add a name
  userEvent.type(name, 'A new persona name');
  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(serialize()).toMatchSnapshot();

  // Then add a description
  userEvent.type(description, 'Some description');
  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(personaActions.createPersona).toHaveBeenCalledTimes(1)
  );
  await waitFor(() =>
    expect(personaActions.unlinkPersonaFromScenario).toHaveBeenCalledTimes(1)
  );
  await waitFor(() =>
    expect(personaActions.linkPersonaToScenario).toHaveBeenCalledTimes(1)
  );

  await act(async () => {
    // Open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Close color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Re-open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Click on a color
    userEvent.click(await screen.findByTitle('#781c81'));
  });

  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(serialize()).toMatchSnapshot();

  // await waitFor(() => expect(personaActions.createPersona).toHaveBeenCalledTimes(2));

  done();
});

test('Edit a persona', async done => {
  const Component = ScenarioPersonaEditor;

  persona.is_read_only = false;

  const props = {
    ...commonProps,
    persona,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const name = await screen.findByLabelText('Persona name');
  const description = await screen.findByLabelText('Persona description');

  userEvent.clear(name);
  userEvent.clear(description);

  // Try with no name
  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(serialize()).toMatchSnapshot();

  // Then add a name
  userEvent.type(name, 'A new persona name');
  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(serialize()).toMatchSnapshot();

  // Then add a description
  userEvent.type(description, 'Some description');
  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(personaActions.setPersona).toHaveBeenCalledTimes(1)
  );

  await act(async () => {
    // Open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Close color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Re-open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(serialize()).toMatchSnapshot();

  await act(async () => {
    // Click on a color
    userEvent.click(await screen.findByTitle('#781c81'));
  });

  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(serialize()).toMatchSnapshot();

  await waitFor(() =>
    expect(personaActions.setPersona).toHaveBeenCalledTimes(2)
  );

  expect(notify.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "color": "green",
          "message": "Persona updated!",
        },
      ],
      Array [
        Object {
          "color": "green",
          "message": "Persona updated!",
        },
      ],
    ]
  `);

  done();
});

test('Persona name is too long', async done => {
  const Component = ScenarioPersonaEditor;

  persona.name =
    'Something that is longer than 40 characters and will be truncated';
  const props = {
    ...commonProps,
    persona,
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const name = await screen.findByLabelText('Persona name');
  const description = await screen.findByLabelText('Persona description');

  expect(serialize()).toMatchSnapshot();

  done();
});
