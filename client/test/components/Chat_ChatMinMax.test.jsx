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

/** @GENERATED: BEGIN **/

import ChatMinMax from '../../components/Chat/ChatMinMax.jsx';
/** @GENERATED: END **/

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

  /** @GENERATED: BEGIN **/

  /** @GENERATED: END **/

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

test('ChatMinMax', () => {
  expect(ChatMinMax).toBeDefined();
});

/* INJECTION STARTS HERE */

test('Click to Minimize and Maximize', async done => {
  const Component = ChatMinMax;

  const props = {
    ...commonProps,
    onChange: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const button = await screen.findByRole('button');

  userEvent.click(button);
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "isMinimized": true,
        },
      ],
    ]
  `);

  userEvent.click(button);
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "isMinimized": true,
        },
      ],
      Array [
        Object {
          "isMinimized": false,
        },
      ],
    ]
  `);

  done();
});

test('No props.onChange', async done => {
  const Component = ChatMinMax;

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const button = await screen.findByRole('button');

  userEvent.click(button);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(button);
  expect(serialize()).toMatchSnapshot();

  done();
});
