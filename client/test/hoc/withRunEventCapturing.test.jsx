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

import { SAVE_RUN_EVENT_SUCCESS } from '../../actions/types';
import * as runActions from '../../actions/run';
jest.mock('../../actions/run');
const event = {};

import withRunEventCapturing from '../../hoc/withRunEventCapturing.jsx';

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

  runActions.saveRunEvent = jest.fn();
  runActions.saveRunEvent.mockImplementation(() => async dispatch => {
    const name = 'name';
    dispatch({ type: SAVE_RUN_EVENT_SUCCESS, name, event });
    return event;
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

test('withRunEventCapturing', () => {
  expect(withRunEventCapturing).toBeDefined();
});

test('Render 1 1', async done => {
  const data = {};
  const Component = withRunEventCapturing(
    class extends React.Component {
      render() {
        this.props.saveRunEvent(1, 'name', data);
        return <div></div>;
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
    pathname: '/run/'
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);

  expect(asFragment()).toMatchSnapshot();
  expect(runActions.saveRunEvent.mock.calls.length).toBe(1);
  expect(runActions.saveRunEvent.mock.calls[0]).toMatchSnapshot();
  done();
});

test('Render 2 1', async done => {
  const data = {};
  const Component = withRunEventCapturing(
    class extends React.Component {
      render() {
        this.props.saveRunEvent(1, 'name', data);
        return <div></div>;
      }
      static get propTypes() {
        return {
          saveRunEvent: PropTypes.func
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
    pathname: '/anything/'
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(runActions.saveRunEvent.mock.calls.length).toBe(0);
  done();
});

test('Render 3 1', async done => {
  const data = {};
  const Component = withRunEventCapturing(props => {
    props.saveRunEvent(1, 'name', data);
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
    pathname: '/anything/'
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();
  expect(runActions.saveRunEvent.mock.calls.length).toBe(0);
  done();
});
