import {
  mounter,
  reduxer,
  snapshot,
  state
} from '../bootstrap';
import {
  unmountComponentAtNode
} from 'react-dom';
import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/react';
import ConfirmableLogout from '../../components/Login/ConfirmableLogout.jsx';

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({});
      },
    });
  });
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const sharedProps = {
  history: {
    push() {},
  },
};

test('ConfirmableLogout', () => {
  expect(ConfirmableLogout).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    user: {
      username: 'owner'
    },
  };
  const mounted = mounter(reduxer(ConfirmableLogout, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/