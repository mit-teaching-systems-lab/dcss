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

import ChatMinMax from '../../components/Chat/ChatMinMax.jsx';
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
