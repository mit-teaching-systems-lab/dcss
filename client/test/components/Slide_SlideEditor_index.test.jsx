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
import SlideEditor from '../../components/Slide/SlideEditor/index.jsx';

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

test('SlideEditor', () => {
  expect(SlideEditor).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    slides: [{
        id: 1,
        title: '',
        components: [{
          html: '<h2>Bye!</h2>',
          type: 'Text'
        }],
        is_finish: true,
      },
      {
        id: 2,
        title: '',
        components: [{
          id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
          html: '<p>Hi!</p>',
          type: 'Text',
        }, ],
      },
    ],
  };
  const mounted = mounter(reduxer(SlideEditor, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
