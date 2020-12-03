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

import ConfirmableDeleteButton from '../../components/EditorMenu/ConfirmableDeleteButton.jsx';

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

test('ConfirmableDeleteButton', () => {
  expect(ConfirmableDeleteButton).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = ConfirmableDeleteButton;

  const props = {
    ...commonProps,
    itemType: 'disabled-false',
    disabled: false,
    onConfirm: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Delete this disabled-false'));
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));
  expect(asFragment()).toMatchSnapshot();

  expect(props.onConfirm.mock.calls.length).toBe(1);
  expect(props.onConfirm.mock.calls[0]).toMatchInlineSnapshot(`Array []`);

  userEvent.click(await screen.findByLabelText('Delete this disabled-false'));
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /No/ }));
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Render 2 1', async done => {
  const Component = ConfirmableDeleteButton;

  const props = {
    ...commonProps,
    itemType: 'disabled-true',
    disabled: true,
    onConfirm: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByLabelText('Delete this disabled-true'));
  expect(asFragment()).toMatchSnapshot();

  done();
});
