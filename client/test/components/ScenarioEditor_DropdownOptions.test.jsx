import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshot,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import {
  AuthorDropdown,
  CategoriesDropdown
} from '../../components/ScenarioEditor/DropdownOptions.jsx';

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const sharedProps = {
  history: {
    push() {}
  }
};

test('AuthorDropdown', () => {
  expect(AuthorDropdown).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    options: [],
    categories: [],
    authors: [],
    onChange() {}
  };
  const mounted = mounter(reduxer(AuthorDropdown, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

test('CategoriesDropdown', () => {
  expect(CategoriesDropdown).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    options: [],
    categories: [],
    authors: [],
    onChange() {}
  };
  const mounted = mounter(reduxer(CategoriesDropdown, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
