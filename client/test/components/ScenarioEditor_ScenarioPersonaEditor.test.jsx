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

import {
  GET_PERSONA_SUCCESS,
  SET_SCENARIO,
  SET_PERSONA_SUCCESS
} from '../../actions/types';
import * as personaActions from '../../actions/persona';
jest.mock('../../actions/persona');

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
    is_super: true
  },
  555: {
    username: 'facilitator',
    personalname: 'Facilitator User',
    email: 'facilitator@email.com',
    id: 555,
    roles: ['participant', 'facilitator', 'researcher', 'owner'],
    is_anonymous: false,
    is_super: false,
    is_owner: true
  },
  444: {
    username: 'researcher',
    personalname: 'Researcher User',
    email: 'researcher@email.com',
    id: 444,
    roles: ['participant', 'researcher'],
    is_anonymous: false,
    is_super: false
  },
  333: {
    username: 'participant',
    personalname: 'Participant User',
    email: 'participant@email.com',
    id: 333,
    roles: ['participant'],
    is_anonymous: false,
    is_super: false
  },
  222: {
    username: 'anonymous',
    personalname: '',
    email: '',
    id: 222,
    roles: ['participant'],
    is_anonymous: true,
    is_super: false
  },
  111: {
    username: 'invited',
    personalname: '',
    email: '',
    id: 111,
    roles: [],
    is_anonymous: true,
    is_super: false
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
    is_super: true
  },
  {
    username: 'facilitator',
    personalname: 'Facilitator User',
    email: 'facilitator@email.com',
    id: 555,
    roles: ['participant', 'facilitator', 'researcher', 'owner'],
    is_anonymous: false,
    is_super: false,
    is_owner: true
  },
  {
    username: 'researcher',
    personalname: 'Researcher User',
    email: 'researcher@email.com',
    id: 444,
    roles: ['participant', 'researcher'],
    is_anonymous: false,
    is_super: false
  },
  {
    username: 'participant',
    personalname: 'Participant User',
    email: 'participant@email.com',
    id: 333,
    roles: ['participant'],
    is_anonymous: false,
    is_super: false
  },
  {
    username: 'anonymous',
    personalname: '',
    email: '',
    id: 222,
    roles: ['participant'],
    is_anonymous: true,
    is_super: false
  }
];

import ScenarioPersonaEditor from '../../components/ScenarioEditor/ScenarioPersonaEditor.jsx';

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

test('ScenarioPersonaEditor', () => {
  expect(ScenarioPersonaEditor).toBeDefined();
});

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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const name = await screen.findByLabelText('Persona name');
  const description = await screen.findByLabelText('Persona description');

  userEvent.clear(name);
  userEvent.clear(description);

  userEvent.type(name, 'A new persona name');
  userEvent.type(description, 'Some description');

  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(asFragment()).toMatchSnapshot();

  expect(personaActions.setPersona.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      1,
      Object {
        "author_id": 3,
        "color": "#FFFFFF",
        "created_at": "2020-12-01T15:49:04.962Z",
        "deleted_at": null,
        "description": "Some description",
        "id": 1,
        "is_read_only": true,
        "is_shared": true,
        "name": "A new persona name",
        "updated_at": null,
      },
    ]
  `);

  done();
});

test('Render 2 1', async done => {
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  userEvent.click(await screen.findByRole('button', { name: /Close/ }));
  expect(asFragment()).toMatchSnapshot();

  done();
});

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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const name = await screen.findByLabelText('Persona name');
  const description = await screen.findByLabelText('Persona description');

  // Try with no name
  userEvent.clear(name);
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(asFragment()).toMatchSnapshot();

  // Then add a name
  userEvent.type(name, 'A new persona name');
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(asFragment()).toMatchSnapshot();

  // Then add a description
  userEvent.type(description, 'Some description');
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Close color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Re-open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Click on a color
    userEvent.click(await screen.findByTitle('#781c81'));
  });

  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(asFragment()).toMatchSnapshot();

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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const name = await screen.findByLabelText('Persona name');
  const description = await screen.findByLabelText('Persona description');

  // Try with no name
  userEvent.clear(name);
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(asFragment()).toMatchSnapshot();

  // Then add a name
  userEvent.type(name, 'A new persona name');
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(asFragment()).toMatchSnapshot();

  // Then add a description
  userEvent.type(description, 'Some description');
  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Close color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Re-open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Click on a color
    userEvent.click(await screen.findByTitle('#781c81'));
  });

  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Create/ }));
  expect(asFragment()).toMatchSnapshot();

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

test('Edit a persona', async done => {
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

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const name = await screen.findByLabelText('Persona name');
  const description = await screen.findByLabelText('Persona description');

  // Try with no name
  userEvent.clear(name);
  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(asFragment()).toMatchSnapshot();

  // Then add a name
  userEvent.type(name, 'A new persona name');
  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(asFragment()).toMatchSnapshot();

  // Then add a description
  userEvent.type(description, 'Some description');
  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Close color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Re-open color picker
    userEvent.click(
      await screen.findByRole('button', { name: /Click to select a color/i })
    );
  });

  expect(asFragment()).toMatchSnapshot();

  await act(async () => {
    // Click on a color
    userEvent.click(await screen.findByTitle('#781c81'));
  });

  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Save/ }));
  expect(asFragment()).toMatchSnapshot();

  expect(personaActions.createPersona.mock.calls[0]).toMatchInlineSnapshot(
    `undefined`
  );

  done();
});
