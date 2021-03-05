/** @TEMPLATE: BEGIN **/
import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect
}));

import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import {
  act,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

async function waitForPopper() {
  // Popper update() - https://github.com/popperjs/react-popper/issues/350
  await act(async () => await null);
}

/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

import * as tlr from '@testing-library/react';

jest.mock(
  '@components/Slide/Components/MultiPathResponse/MultiPathNetworkGraphModal',
  () => {
    return props => {
      return <div>MultiPathNetworkGraphModal</div>;
    };
  }
);

let scenario;
let slides;
let slideIndex;
let value;

import Editor from '../../components/Slide/Components/MultiPathResponse/Editor.jsx';
/** @GENERATED: END **/

/** @TEMPLATE: BEGIN **/
const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;
/** @TEMPLATE: END **/

beforeAll(() => {
  /** @TEMPLATE: BEGIN **/
  (window || global).fetch = jest.fn();
  /** @TEMPLATE: END **/
});

afterAll(() => {
  /** @TEMPLATE: BEGIN **/
  jest.restoreAllMocks();
  /** @TEMPLATE: END **/
});

beforeEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);
  /** @TEMPLATE: END **/

  /** @GENERATED: BEGIN **/

  scenario = {
    author: {
      id: 999,
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      is_anonymous: false,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true
    },
    categories: [],
    consent: { id: 69, prose: '' },
    description: "This is the description of 'Some Other Scenario'",
    finish: {
      id: 11,
      title: '',
      components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
      is_finish: true
    },
    lock: {
      scenario_id: 99,
      user_id: 999,
      created_at: '2020-02-31T23:54:19.934Z',
      ended_at: null
    },
    slides: [
      {
        id: 11,
        title: '',
        components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
        is_finish: true
      },
      {
        id: 22,
        title: 'Slide 1',
        components: [
          {
            id: '22-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
            html: '<h1>Welcome to Slide 1</h1>',
            type: 'Text'
          },
          {
            agent: null,
            id: '22-aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: '22-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: 'Your response'
          },
          {
            id: '22-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      },
      {
        id: 33,
        title: 'Slide 2',
        components: [
          {
            id: '33-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
            html: '<h1>Welcome to Slide 2</h1>',
            type: 'Text'
          },
          {
            agent: null,
            id: '33-aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: '33-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: 'Your response'
          },
          {
            id: '33-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      },
      {
        id: 44,
        title: 'Slide 3',
        components: [
          {
            id: '44-b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
            html: '<h1>Welcome to Slide 3</h1>',
            type: 'Text'
          },
          {
            agent: null,
            id: '44-aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: '44-be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: 'Your response'
          },
          {
            id: '44-f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      }
    ],
    status: 1,
    title: 'Some Other Scenario',
    users: [
      {
        id: 999,
        email: 'super@email.com',
        username: 'super',
        personalname: 'Super User',
        roles: ['super'],
        is_super: true,
        is_author: true,
        is_reviewer: false
      }
    ],
    id: 99,
    created_at: '2020-07-31T17:50:28.089Z',
    updated_at: null,
    deleted_at: null,
    labels: ['a'],
    personas: [
      {
        id: 1,
        name: 'Participant',
        description:
          'The default user participating in a single person scenario.',
        color: '#FFFFFF',
        created_at: '2020-12-01T15:49:04.962Z',
        updated_at: null,
        deleted_at: null,
        author_id: 3,
        is_read_only: true,
        is_shared: true
      }
    ]
  };
  slides = scenario.slides.slice();
  slideIndex = 0;
  value = {
    id: 'XYZ',
    paths: [
      { color: '#ff00ff', display: 'Goto 1', value: 1 },
      { color: '#ff0000', display: 'Goto 2', value: 2 }
    ],
    header: 'xyz-header',
    prompt: 'xyz-prompt',
    recallId: 'xyz-recallId',
    required: true,
    responseId: 'xyz-responseId',
    type: 'MultiPathResponse'
  };

  fetchImplementation(fetch, 200, {
    slides
  });

  /** @GENERATED: END **/

  /** @TEMPLATE: BEGIN **/
  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
  /** @TEMPLATE: END **/
});

afterEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
  /** @TEMPLATE: END **/
});

test('Editor', () => {
  expect(Editor).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = Editor;
  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Missing props', async done => {
  const Component = Editor;

  value.paths = undefined;
  value.header = undefined;
  value.prompt = undefined;
  value.recallId = undefined;
  value.responseId = undefined;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Paths empty', async done => {
  const Component = Editor;

  value.paths = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Slides empty', async done => {
  const Component = Editor;

  fetchImplementation(fetch, 200, {
    slides: []
  });

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Slide has title', async done => {
  const Component = Editor;

  const slides = scenario.slides.filter(slide => !slide.is_finish);
  slides[1].title = 'foo';

  fetchImplementation(fetch, 200, {
    slides
  });

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Add prompt', async done => {
  const Component = Editor;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const prompt = await screen.findByLabelText(
    'Optional prompt to display before the navigation buttons:'
  );
  expect(serialize()).toMatchSnapshot();

  userEvent.type(prompt, 'A prompt');

  jest.advanceTimersByTime(1000);

  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "color": "#ff00ff",
            "display": "Goto 1",
            "value": 1,
          },
          Object {
            "color": "#ff0000",
            "display": "Goto 2",
            "value": 2,
          },
        ],
        "prompt": "xyz-promptA prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  done();
});

test('Save choice', async done => {
  const Component = Editor;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const savePaths = await screen.findAllByLabelText('Save choice');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(savePaths[0]);

  await waitForPopper();

  jest.advanceTimersByTime(1000);

  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "color": "#ff00ff",
            "display": "Goto 1",
            "value": 1,
          },
          Object {
            "color": "#ff0000",
            "display": "Goto 2",
            "value": 2,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  done();
});

test('Delete choice', async done => {
  const Component = Editor;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const deletePaths = await screen.findAllByLabelText('Delete this choice');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(deletePaths[0]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1000);

  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "color": "#ff0000",
            "display": "Goto 2",
            "value": 2,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  done();
});

test('Add another slide choice empty fields', async done => {
  const Component = Editor;

  value.paths = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const add = await screen.findByLabelText('Add another slide choice');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(add);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "display": "",
            "value": null,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  const displayInput = await screen.findByLabelText(
    'Enter the display for choice 1'
  );

  const dropdowns = await screen.getAllByRole('listbox');
  expect(dropdowns.length).toBe(1);

  const dropdown = dropdowns[0];
  const options = await tlr.findAllByRole(dropdown, 'option');
  expect(options.length).toBe(3);

  userEvent.click(dropdown);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(options[1]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "display": "Go to Slide #3  \\"Slide 3\\"",
            "value": 44,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  userEvent.click(displayInput);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.type(displayInput, 'A new display');
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1000);

  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls[1]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "display": "Go to Slide #3  \\"Slide 3\\"A new display",
            "value": 44,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  done();
});

test('Prevent empty fields', async done => {
  const Component = Editor;

  value.paths = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const add = await screen.findByLabelText('Add another slide choice');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(add);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "display": "",
            "value": null,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  const displayInput = await screen.findByLabelText(
    'Enter the display for choice 1'
  );

  const dropdowns = await screen.getAllByRole('listbox');
  expect(dropdowns.length).toBe(1);

  const dropdown = dropdowns[0];
  const options = await tlr.findAllByRole(dropdown, 'option');
  expect(options.length).toBe(3);

  userEvent.click(dropdown);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(options[1]);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "display": "Go to Slide #3  \\"Slide 3\\"",
            "value": 44,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  userEvent.click(displayInput);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.type(displayInput, 'A new display');
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1000);

  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls[1]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "display": "Go to Slide #3  \\"Slide 3\\"A new display",
            "value": 44,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  userEvent.clear(displayInput);
  expect(serialize()).toMatchSnapshot();

  userEvent.click(displayInput);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  jest.advanceTimersByTime(1000);

  expect(props.onChange).toHaveBeenCalledTimes(3);
  expect(props.onChange.mock.calls[2]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "display": "Go to Slide #3  \\"Slide 3\\"",
            "value": 44,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  done();
});

test('Search for slide', async done => {
  const Component = Editor;

  value.paths = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const add = await screen.findByLabelText('Add another slide choice');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(add);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "display": "",
            "value": null,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  const dropdowns = await screen.getAllByRole('combobox');
  expect(dropdowns.length).toBe(1);

  const dropdown = dropdowns[0];
  const input = await tlr.findAllByDisplayValue(dropdown, '');
  expect(input.length).toBe(3);

  userEvent.click(dropdown);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(input[0]);
  await waitForPopper();
  userEvent.type(input[0], 'Slide');
  userEvent.type(input[0], '{enter}');
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "header": "xyz-header",
        "paths": Array [
          Object {
            "display": "Go to Slide #2  \\"Slide 2\\"",
            "value": 33,
          },
        ],
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiPathResponse",
      },
    ]
  `);

  done();
});

test('View Graph', async done => {
  const Component = Editor;

  value.paths = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const view = await screen.findByLabelText('View slides sequence graph');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(view);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  done();
});
