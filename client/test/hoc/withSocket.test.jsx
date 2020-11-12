import React from 'react';
import PropTypes from 'prop-types';
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
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SocketIO from 'socket.io-client';
jest.mock('socket.io-client');

const event = {};
globalThis.PORT = 1234;

import withSocket from '../../hoc/withSocket.jsx';

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

test('withSocket', () => {
  expect(withSocket).toBeDefined();
});

test('Render 1 1', async done => {
  const data = {};
  const Component = withSocket(
    class extends React.Component {
      render() {
        this.props.socket.emit('FOO', data);
        return <div></div>;
      }

      static get propTypes() {
        return {
          socket: PropTypes.object
        };
      }
    }
  );

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState
  };

  delete window.location;
  window.location = {
    origin: `http://localhost:3000`
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);

  expect(asFragment()).toMatchSnapshot();
  done();
});

test('Render 2 1', async done => {
  const data = {};
  const Component = withSocket(props => {
    props.socket.emit('FOO', data);
    return <div></div>;
  });

  const props = {
    ...commonProps
  };

  const state = {
    ...commonState
  };

  delete window.location;
  window.location = {
    origin: `http://localhost:3000`
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);

  expect(asFragment()).toMatchSnapshot();
  done();
});
