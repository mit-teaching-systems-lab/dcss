/** @TEMPLATE: BEGIN **/
import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}));

import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state,
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import {
  act,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

async function waitForPopper() {
  // Popper update() - https://github.com/popperjs/react-popper/issues/350
  await act(async () => await null);
}

/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

let agents;
let agentsById;

import AgentSelect from '../../components/Admin/AgentSelect.jsx';
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

  agent = {
    id: 1,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: '2021-02-25T20:09:04.999Z',
    deleted_at: null,
    is_active: true,
    title: 'Emoji Analysis',
    name: 'emoji-analysis',
    description: 'Detects the presense of an emoji character in your text',
    endpoint: 'ws://emoji-analysis-production.herokuapp.com',
    configuration: {
      bar: '2',
      baz: 'c',
      foo: 'false',
    },
    interaction: {
      id: 1,
      name: 'ChatPrompt',
      description:
        'It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.',
      created_at: '2021-02-25T15:09:05.001302-05:00',
      deleted_at: null,
      updated_at: null,
      types: [],
    },
    owner: {
      id: 999,
      email: 'super@email.com',
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true,
      username: 'superuser',
      is_anonymous: false,
      personalname: 'Super User',
    },
    self: {
      id: 148,
      email: null,
      roles: null,
      is_super: false,
      username: 'ebe565050b31cbb4e7eacc39b23e2167',
      lastseen_at: '2021-02-25T13:08:57.323-05:00',
      is_anonymous: true,
      personalname: 'Emoji Analysis',
      single_use_password: false,
    },
    socket: {
      path: '/path/to/foo',
    },
  };

  agents = [agent];

  agentsById = agents.reduce((accum, agent) => {
    accum[agent.id] = agent;
    return accum;
  }, {});

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

test('AgentSelect', () => {
  expect(AgentSelect).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async (done) => {
  const Component = AgentSelect;
  const props = {
    ...commonProps,
    agents,
    onSelect: jest.fn(),
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

