import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect
}));

import assert from 'assert';
import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshotter,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import { mount, shallow } from 'enzyme';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  type,
  name,
  description
} from '@components/Slide/Components/AudioPrompt/meta';
import Card from '@components/Slide/Components/AudioPrompt/Card';
import Display from '@components/Slide/Components/AudioPrompt/Display';
import Editor from '@components/Slide/Components/AudioPrompt/Editor';
import * as component from '../../components/Slide/Components/AudioPrompt/index.js';

let container = null;

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
});

afterEach(() => {
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('type', () => {
  expect(component.type).toBe(type);
});

test('name', () => {
  expect(component.name).toBe(name);
});

test('description', () => {
  expect(component.description).toBe(description);
});

test('Display', () => {
  expect(component.Display).toBe(Display);
});

test('Editor', () => {
  expect(component.Editor).toBe(Editor);
});

test('Card', async () => {
  expect(component.Card).toBe(Card);
  expect(snapshotter(mounter(component.Card))).toMatchSnapshot();
  expect(snapshotter(mounter(Card))).toMatchSnapshot();
  expect(snapshotter(mounter(Card))).toBe(snapshotter(mounter(component.Card)));

  const { Card: ComponentCard } = component;

  const ConnectedRoutedComponent = reduxer(ComponentCard);
  const { asFragment } = render(<ConnectedRoutedComponent />);
  await screen.getByLabelText(component.name);
  expect(asFragment()).toMatchSnapshot();
});

test('Render 1', async () => {
  const params = {};

  expect(component.defaultValue(params)).toMatchInlineSnapshot(`
    Object {
      "header": "",
      "id": "",
      "prompt": "",
      "recallId": "",
      "required": true,
      "responseId": undefined,
      "timeout": 0,
      "type": "AudioPrompt",
    }
  `);
});

test('Render 2', async () => {
  const params = { recallId: 'ABC' };

  expect(component.defaultValue(params)).toMatchInlineSnapshot(`
    Object {
      "header": "",
      "id": "",
      "prompt": "",
      "recallId": "",
      "required": true,
      "responseId": undefined,
      "timeout": 0,
      "type": "AudioPrompt",
    }
  `);
});

test('Render 3', async () => {
  const params = { recallId: 'ABC', responseId: 'XYZ' };

  expect(component.defaultValue(params)).toMatchInlineSnapshot(`
    Object {
      "header": "",
      "id": "",
      "prompt": "",
      "recallId": "",
      "required": true,
      "responseId": "XYZ",
      "timeout": 0,
      "type": "AudioPrompt",
    }
  `);
});

/*{INJECTION}*/
