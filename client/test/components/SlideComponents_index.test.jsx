import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshot,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import SlideComponents from '../../components/SlideComponents/index.jsx';

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

test('SlideComponents', () => {
  expect(SlideComponents).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    components: [],
    onResponseChange() {},
    run: {
      id: 2
    },
    saveRunEvent() {}
  };
  const mounted = mounter(reduxer(SlideComponents, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
