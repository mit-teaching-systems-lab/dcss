import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshot,
  state,
} from '../bootstrap';
import {
  unmountComponentAtNode
} from 'react-dom';
import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/react';
import EditorMenu from '../../components/EditorMenu/index.jsx';

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
    push() {},
  },
};

test('EditorMenu', () => {
  expect(EditorMenu).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    items: {
      delete: {
        onConfirm() {}
      },
      editable: null,
      left: null,
      right: null,
      save: {
        onClick() {}
      },
    },
  };
  const mounted = mounter(reduxer(EditorMenu, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
