import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshot,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ScenarioStatusMenuItem from '../../components/EditorMenu/ScenarioStatusMenuItem.jsx';

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  const statusOptions = [
    {
      id: 1,
      name: 'draft',
      description: 'Visible only to author'
    },
    {
      id: 2,
      name: 'public',
      description: 'Visible to everyone'
    },
    {
      id: 3,
      name: 'private',
      description: 'Visible only to logged in users'
    }
  ];
  fetchImplementation(fetch, 200, statusOptions);
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

test('ScenarioStatusMenuItem', () => {
  expect(ScenarioStatusMenuItem).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    onChange() {},
    status: 1
  };
  const mounted = mounter(reduxer(ScenarioStatusMenuItem, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

test('Snapshot 2', () => {
  const props = {
    ...sharedProps,
    onChange() {},
    status: 2
  };
  const mounted = mounter(reduxer(ScenarioStatusMenuItem, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

test('Snapshot 3', () => {
  const props = {
    ...sharedProps,
    onChange() {},
    status: 3
  };
  const mounted = mounter(reduxer(ScenarioStatusMenuItem, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
