import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshot,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import Activity from '../../components/Admin/Activity.jsx';

import { getLogs } from '../../actions/logs';
jest.mock('../../actions/logs');

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  getLogs.mockReturnValue(async () => []);
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

test('Activity', () => {
  expect(Activity).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    logs: []
  };
  const mounted = mounter(reduxer(Activity, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
