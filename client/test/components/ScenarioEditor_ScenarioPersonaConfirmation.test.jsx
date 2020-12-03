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

import ScenarioPersonaConfirmation from '../../components/ScenarioEditor/ScenarioPersonaConfirmation.jsx';

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

test('ScenarioPersonaConfirmation', () => {
  expect(ScenarioPersonaConfirmation).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = ScenarioPersonaConfirmation;

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
    onConfirm: jest.fn(),
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('No', async done => {
  const Component = ScenarioPersonaConfirmation;

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
    onConfirm: jest.fn(),
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /No/ }));

  expect(asFragment()).toMatchSnapshot();

  expect(props.onConfirm.mock.calls.length).toBe(0);
  expect(props.onCancel.mock.calls.length).toBe(1);

  done();
});

test('Yes', async done => {
  const Component = ScenarioPersonaConfirmation;

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
    onConfirm: jest.fn(),
    onCancel: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));

  expect(asFragment()).toMatchSnapshot();

  expect(props.onCancel.mock.calls.length).toBe(0);
  expect(props.onConfirm.mock.calls.length).toBe(1);
  expect(props.onConfirm.mock.calls[0][1]).toMatchInlineSnapshot(`
    Object {
      "persona": Object {
        "author_id": 3,
        "color": "#FFFFFF",
        "created_at": "2020-12-01T15:49:04.962Z",
        "deleted_at": null,
        "description": "The default user participating in a single person scenario.",
        "id": 1,
        "is_read_only": true,
        "is_shared": true,
        "name": "Participant",
        "updated_at": null,
      },
    }
  `);

  done();
});
