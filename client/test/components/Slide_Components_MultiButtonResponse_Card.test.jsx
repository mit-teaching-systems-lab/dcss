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
import Card from '../../components/Slide/Components/MultiButtonResponse/Card.jsx';

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

test('Card', () => {
  expect(Card).toBeDefined();
});

test('Snapshot 1 1', async () => {
  const Component = Card;

  const props = {
    ...commonProps,
  };

  const state = {
    ...{},
  };

  const reduxed = reduxer(Component, props, state);
  const mounted = mounter(reduxed, container);
  expect(snapshotter(mounted)).toMatchSnapshot();
});

test('Snapshot 1 2', async () => {
  const Component = Card;

  const props = {
    ...commonProps,
  };

  const state = {
    ...commonState,
  };

  const reduxed = reduxer(Component, props, state);
  const mounted = mounter(reduxed, container);
  expect(snapshotter(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/

