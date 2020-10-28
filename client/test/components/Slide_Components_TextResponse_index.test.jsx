import React from 'react';
import assert from 'assert';
import { mounter, snapshotter } from '../bootstrap';

import {
  type,
  name,
  description
} from '@components/Slide/Components/TextResponse/meta';
import Card from '@components/Slide/Components/TextResponse/Card';
import Display from '@components/Slide/Components/TextResponse/Display';
import Editor from '@components/Slide/Components/TextResponse/Editor';
import * as component from '../../components/Slide/Components/TextResponse/index.js';

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
  const params = { responseId: 'XYZ' };

  expect(component.defaultValue(params)).toMatchSnapshot();
});

/*{INJECTION}*/
