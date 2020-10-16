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
  OwnerDropdown,
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

test('OwnerDropdown', () => {
  expect(OwnerDropdown).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    options: [],
    categories: [],
    author: {
      id: null
    },
    onChange() {}
  };
  const mounted = mounter(reduxer(OwnerDropdown, props, state))();
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
    author: {
      id: null
    },
    onChange() {}
  };
  const mounted = mounter(reduxer(CategoriesDropdown, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
