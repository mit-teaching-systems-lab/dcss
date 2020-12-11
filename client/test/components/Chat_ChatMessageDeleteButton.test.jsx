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

import ChatMessageDeleteButton from '../../components/Chat/ChatMessageDeleteButton.jsx';

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

test('ChatMessageDeleteButton', () => {
  expect(ChatMessageDeleteButton).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = ChatMessageDeleteButton;

  const props = {
    ...commonProps,
    'aria-label': 'Delete this thing',
    onCancel: jest.fn(),
    onConfirm: jest.fn()
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

test('Delete, No, then Yes', async done => {
  const Component = ChatMessageDeleteButton;

  const props = {
    ...commonProps,
    'aria-label': 'Delete this thing',
    onCancel: jest.fn(),
    onConfirm: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const deletables = screen.queryAllByLabelText('Delete this thing');

  expect(deletables.length).toBe(1);
  const deletable = deletables[0];

  userEvent.click(deletable);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /No/i }));
  await waitFor(() => expect(props.onCancel).toHaveBeenCalled());
  expect(serialize()).toMatchSnapshot();

  userEvent.click(deletable);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/i }));
  await waitFor(() => expect(props.onConfirm).toHaveBeenCalled());
  expect(serialize()).toMatchSnapshot();

  done();
});
