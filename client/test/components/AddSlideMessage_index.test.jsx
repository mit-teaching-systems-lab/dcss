import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}));

import assert from 'assert';
import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshotter,
  state,
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import { mount, shallow } from 'enzyme';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Identity from '@utils/Identity';
jest.mock('@utils/Identity', () => {
  let count = 0;
  return {
    ...jest.requireActual('@utils/Identity'),
    id() {
      return ++count;
    },
  };
});
import AddSlideMessage from '../../components/AddSlideMessage/index.jsx';

import { Icon, Message } from '@components/UI';

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
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('AddSlideMessage', () => {
  expect(AddSlideMessage).toBeDefined();
});

test('Render 1 1', async (done) => {
  const Component = AddSlideMessage;

  const props = {
    ...commonProps,
    onClick: jest.fn(() => {}),
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const mounted = mounter(ConnectedRoutedComponent);
  expect(snapshotter(mounted)).toMatchSnapshot();
  expect(
    snapshotter(mounted.findWhere((n) => n.type() === Component))
  ).toMatchSnapshot();

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(screen.getByLabelText('Add a slide'));

  expect(asFragment()).toMatchSnapshot();

  expect(props.onClick.mock.calls.length).toBe(1);

  done();
});

/*{INJECTION}*/

