import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshot,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import DataModal from '../../components/Cohorts/DataModal.jsx';

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

test('DataModal', () => {
  expect(DataModal).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    index: 0,
    isScenarioDataTable: false,
    prompts: [
      {
        header: '',
        prompt: '',
        slide: {}
      }
    ],
    rows: []
  };
  const mounted = mounter(reduxer(DataModal, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
