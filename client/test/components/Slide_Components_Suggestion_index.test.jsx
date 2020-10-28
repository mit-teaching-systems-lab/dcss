import React from 'react';
import assert from 'assert';
import { mounter, snapshotter } from '../bootstrap';

import {
  type,
  name,
  description
} from '@components/Slide/Components/Suggestion/meta';
import Card from '@components/Slide/Components/Suggestion/Card';
import Display from '@components/Slide/Components/Suggestion/Display';
import Editor from '@components/Slide/Components/Suggestion/Editor';
import * as component from '../../components/Slide/Components/Suggestion/index.js';

beforeEach(() => {});

afterEach(() => {});

test('type', () => {
  assert.equal(component.type, type);
});

test('name', () => {
  assert.equal(component.name, name);
});

test('description', () => {
  assert.equal(component.description, description);
});

test('Display', () => {
  assert.equal(component.Display, Display);
});

test('Editor', () => {
  assert.equal(component.Editor, Editor);
});

test('Card', () => {
  assert.equal(component.Card, Card);

  expect(snapshotter(mounter(component.Card))).toMatchSnapshot();
  expect(snapshotter(mounter(Card))).toMatchSnapshot();
  assert.equal(
    snapshotter(mounter(Card)),
    snapshotter(mounter(component.Card))
  );
});

test('Snapshot 1', () => {
  const params = {};

  expect(component.defaultValue(params)).toMatchSnapshot();
});

test('Snapshot 2', () => {
  const params = { recallId: 'ABC' };

  expect(component.defaultValue(params)).toMatchSnapshot();
});

test('Snapshot 3', () => {
  const params = { recallId: 'ABC', responseId: 'XYZ' };

  expect(component.defaultValue(params)).toMatchSnapshot();
});

/*{INJECTION}*/
