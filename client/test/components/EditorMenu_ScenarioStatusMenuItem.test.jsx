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
    onClick() {}
  };
  const mounted = mounter(reduxer(ScenarioStatusMenuItem, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
