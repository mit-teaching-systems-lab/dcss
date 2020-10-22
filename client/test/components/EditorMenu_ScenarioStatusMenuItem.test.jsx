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
import toJson from 'enzyme-to-json';
import ScenarioStatusMenuItem from '../../components/EditorMenu/ScenarioStatusMenuItem.jsx';

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

  const statusOptions = [
    { id: 1, name: 'draft', description: 'Visible only to author' },
    { id: 2, name: 'public', description: 'Visible to everyone' },
    { id: 3, name: 'private', description: 'Visible only to logged in users' },
  ];
  fetchImplementation(fetch, 200, statusOptions);

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

test('ScenarioStatusMenuItem', () => {
  expect(ScenarioStatusMenuItem).toBeDefined();
});

test('Snapshot 1 1', async (done) => {
  const Component = ScenarioStatusMenuItem;

  const props = {
    ...commonProps,
    onChange() {},
    status: 1,
  };

  const state = {
    ...commonState,
  };

  const reduxed = reduxer(Component, props, state);
  const wrapper = mounter(reduxed);
  expect(snapshotter(reduxed)).toMatchSnapshot();
  expect(snapshotter(wrapper)).toMatchSnapshot();

  const component = wrapper.findWhere((n) => {
    return n.type() === Component;
  });
  expect(snapshotter(component)).toMatchSnapshot();

  done();
});

test('Snapshot 2 1', async (done) => {
  const Component = ScenarioStatusMenuItem;

  const props = {
    ...commonProps,
    onChange() {},
    status: 2,
  };

  const state = {
    ...commonState,
  };

  const reduxed = reduxer(Component, props, state);
  const wrapper = mounter(reduxed);
  expect(snapshotter(reduxed)).toMatchSnapshot();
  expect(snapshotter(wrapper)).toMatchSnapshot();

  const component = wrapper.findWhere((n) => {
    return n.type() === Component;
  });
  expect(snapshotter(component)).toMatchSnapshot();

  done();
});

test('Snapshot 3 1', async (done) => {
  const Component = ScenarioStatusMenuItem;

  const props = {
    ...commonProps,
    onChange() {},
    status: 3,
  };

  const state = {
    ...commonState,
  };

  const reduxed = reduxer(Component, props, state);
  const wrapper = mounter(reduxed);
  expect(snapshotter(reduxed)).toMatchSnapshot();
  expect(snapshotter(wrapper)).toMatchSnapshot();

  const component = wrapper.findWhere((n) => {
    return n.type() === Component;
  });
  expect(snapshotter(component)).toMatchSnapshot();

  done();
});

/*{INJECTION}*/

