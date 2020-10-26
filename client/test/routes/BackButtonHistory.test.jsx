import React from 'react';
import assert from 'assert';
import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshotter,
  state,
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';
import { mount, render, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import BackButtonHistory from '../../routes/BackButtonHistory.jsx';

const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  fetch.mockRestore();
});

beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  commonProps = {
    history: {
      push() {},
    },
  };

  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  fetch.mockReset();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('BackButtonHistory', () => {
  expect(BackButtonHistory).toBeDefined();
});

test('Snapshot 1 1', async (done) => {
  const Component = BackButtonHistory;

  const props = {
    ...commonProps,
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const mounted = mounter(ConnectedRoutedComponent);
  expect(snapshotter(mounted)).toMatchSnapshot();

  const component = mounted.findWhere((n) => {
    return n.type() === Component;
  });
  expect(snapshotter(component)).toMatchSnapshot();

  done();
});

/*{INJECTION}*/

