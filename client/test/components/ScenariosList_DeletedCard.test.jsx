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
import DeletedCard from '../../components/ScenariosList/DeletedCard.jsx';

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

test('DeletedCard', () => {
  expect(DeletedCard).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    title: '',
    description: '',
    id: '',
    onClick() {},
  };
  const mounted = mounter(reduxer(DeletedCard, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
