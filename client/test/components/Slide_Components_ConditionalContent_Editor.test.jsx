/** @TEMPLATE: BEGIN **/
import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}));

import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state,
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import {
  act,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

async function waitForPopper() {
  // Popper update() - https://github.com/popperjs/react-popper/issues/350
  await act(async () => await null);
}

/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

import { GET_SCENARIO_PROMPT_COMPONENTS_SUCCESS } from '../../actions/types';
import * as scenarioActions from '../../actions/scenario';
jest.mock('../../actions/scenario');

let prompt;
let prompts;
let scenario;
let slideIndex;
let value;

import Editor from '../../components/Slide/Components/ConditionalContent/Editor.jsx';
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

  prompts = [
    {
      agent: {
        id: 23,
        name: 'base-agent',
        title: 'All Your Base Are Belong To Us',
        description: 'All Your Base Are Belong To Us',
      },
      header: 'TextResponse-0',
      id: 'f5ad3049-5dc0-4855-83fd-f76050be4ef5',
      index: 1,
      persona: null,
      placeholder: '',
      prompt: 'Say hi',
      recallId: '',
      required: true,
      responseId: '2fe89809-2b7c-432a-9fbb-8dbb0b574a58',
      timeout: 0,
      type: 'TextResponse',
    },
    {
      agent: {
        id: 23,
        name: 'base-agent',
        title: 'All Your Base Are Belong To Us',
        description: 'All Your Base Are Belong To Us',
      },
      buttons: [
        { color: '#ff00ff', display: 'Yes', value: 'Yes' },
        { color: '#ff0000', display: 'No', value: 'No' },
      ],
      header: 'MultiButtonResponse-1',
      id: 'b5de9c84-d9b8-4654-9291-5c5683df240c',
      index: 1,
      persona: null,
      prompt: '',
      recallId: '',
      required: true,
      responseId: 'b4de2abc-6d48-4c6f-b8bf-830b88e1c09e',
      timeout: 0,
      type: 'MultiButtonResponse',
    },
    {
      agent: {
        id: 23,
        name: 'base-agent',
        title: 'All Your Base Are Belong To Us',
        description: 'All Your Base Are Belong To Us',
      },
      header: 'AudioPrompt-2',
      id: 'bbc156a0-5885-4a9e-9810-d0fecbff17e6',
      index: 1,
      persona: null,
      prompt: '',
      recallId: '',
      required: true,
      responseId: '4f8c934d-c95f-4c95-ad41-64bdb36edde2',
      timeout: 0,
      type: 'AudioPrompt',
    },
  ];
  scenario = {
    author: {
      id: 999,
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      is_anonymous: false,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true,
    },
    categories: [],
    consent: { id: 57, prose: '' },
    description: "This is the description of 'A Multiplayer Scenario'",
    finish: {
      id: 1,
      title: '',
      components: [
        { html: '<h2>Thanks for participating!</h2>', type: 'Text' },
      ],
      is_finish: true,
    },
    lock: {
      scenario_id: 42,
      user_id: 999,
      created_at: '2020-02-31T23:54:19.934Z',
      ended_at: null,
    },
    slides: [
      {
        id: 1,
        title: '',
        components: [
          { html: '<h2>Thanks for participating!</h2>', type: 'Text' },
        ],
        is_finish: true,
      },
      {
        id: 2,
        title: '',
        components: [
          {
            id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
            html: '<p>paragraph</p>',
            type: 'Text',
          },
          {
            agent: null,
            id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: '',
          },
          {
            id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text',
          },
        ],
        is_finish: false,
      },
    ],
    status: 1,
    title: 'Multiplayer Scenario 2',
    users: [
      {
        id: 999,
        email: 'super@email.com',
        username: 'super',
        personalname: 'Super User',
        roles: ['super'],
        is_super: true,
        is_author: true,
        is_reviewer: false,
      },
    ],
    id: 42,
    created_at: '2020-08-31T17:50:28.089Z',
    updated_at: null,
    deleted_at: null,
    labels: ['a', 'b'],
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
        is_shared: true,
      },
    ],
  };
  scenario.agent = {
    id: 1,
    created_at: '2021-02-25T17:31:33.826Z',
    updated_at: '2021-02-25T20:09:04.999Z',
    deleted_at: null,
    is_active: true,
    title: 'Emoji Analysis',
    name: 'emoji-analysis',
    description: 'Detects the presense of an emoji character in your text',
    endpoint: 'ws://emoji-analysis-production.herokuapp.com',
    configuration: {
      bar: '2',
      baz: 'c',
      foo: 'false',
    },
    interaction: {
      id: 1,
      name: 'TextResponse',
      description:
        'It will appear as an option for scenario authors to select for TextResponse.',
      created_at: '2021-02-25T15:09:05.001302-05:00',
      deleted_at: null,
      updated_at: null,
      types: [],
    },
    owner: {
      id: 999,
      email: 'super@email.com',
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true,
      username: 'superuser',
      is_anonymous: false,
      personalname: 'Super User',
    },
    self: {
      id: 148,
      email: null,
      roles: null,
      is_super: false,
      username: 'ebe565050b31cbb4e7eacc39b23e2167',
      lastseen_at: '2021-02-25T13:08:57.323-05:00',
      is_anonymous: true,
      personalname: 'Emoji Analysis',
      single_use_password: false,
    },
    socket: {
      path: '/path/to/foo',
    },
  };
  slideIndex = 0;
  value = {
    agent: null,
    disableRequireCheckbox: true,
    header: '',
    id: 'XYZ',
    rules: [
      { key: '$gt', value: 1 },
      { key: '$and', value: undefined },
      { key: '$lt', value: 10 },
    ],
    persona: null,
    recallId: 'xyz-recallId',
    required: false,
    responseId: 'xyz-responseId',
    component: null,
    type: 'ConditionalContent',
  };

  scenarioActions.getScenarioPromptComponents.mockImplementation(
    () => async (dispatch) => {
      dispatch({ type: GET_SCENARIO_PROMPT_COMPONENTS_SUCCESS, prompts });
      return prompts;
    }
  );

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
test('Render 1 1', async (done) => {
  const Component = Editor;
  const props = {
    ...commonProps,
    slideIndex,
    type: 'ConditionalContent',
    value,
    scenario,
    onChange: jest.fn(),
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Missing props', async (done) => {
  const Component = Editor;

  value.persona = null;
  value.rules = undefined;
  value.header = undefined;
  value.prompt = undefined;
  value.recallId = undefined;
  value.responseId = undefined;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value,
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Rules empty', async (done) => {
  const Component = Editor;

  value.rules = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value,
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});

test('Save single rule', async (done) => {
  const Component = Editor;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value,
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const saveRules = await screen.findAllByLabelText('Save rule');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(saveRules[0]);
  await waitForPopper();

  jest.advanceTimersByTime(1000);

  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "agent": null,
        "component": null,
        "disableRequireCheckbox": true,
        "header": "",
        "id": "XYZ",
        "persona": null,
        "recallId": "xyz-recallId",
        "required": false,
        "responseId": "xyz-responseId",
        "rules": Array [
          Object {
            "key": "$gt",
            "value": 1,
          },
          Object {
            "key": "$and",
            "value": undefined,
          },
          Object {
            "key": "$lt",
            "value": 10,
          },
        ],
        "type": "ConditionalContent",
      },
    ]
  `);

  done();
});

test('Delete single rule', async (done) => {
  const Component = Editor;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value,
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const deleteRules = await screen.findAllByLabelText('Delete this rule');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(deleteRules[0]);
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
        "agent": null,
        "component": null,
        "disableRequireCheckbox": true,
        "header": "",
        "id": "XYZ",
        "persona": null,
        "recallId": "xyz-recallId",
        "required": false,
        "responseId": "xyz-responseId",
        "rules": Array [
          Object {
            "key": "$and",
            "value": undefined,
          },
          Object {
            "key": "$lt",
            "value": 10,
          },
        ],
        "type": "ConditionalContent",
      },
    ]
  `);

  done();
});

test('Add a rule, scenario.agent', async (done) => {
  const Component = Editor;

  value.rules = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value,
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const add = await screen.findByLabelText('Add a rule');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(add);
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "agent": null,
        "component": null,
        "disableRequireCheckbox": true,
        "header": "",
        "id": "XYZ",
        "persona": null,
        "recallId": "xyz-recallId",
        "required": false,
        "responseId": "xyz-responseId",
        "rules": Array [
          Object {
            "key": "",
            "value": "",
          },
        ],
        "type": "ConditionalContent",
      },
    ]
  `);

  expect(
    await screen.findByLabelText('Select the operator for expression 1')
  ).toBeInTheDocument();
  expect(
    await screen.findByLabelText('Enter the value for expression 1')
  ).toBeInTheDocument();

  expect(serialize()).toMatchSnapshot();

  done();
});

test('Add a rule, prompts', async (done) => {
  const Component = Editor;

  value.rules = [];
  scenario.agent = null;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value,
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const add = await screen.findByLabelText('Add a rule');
  expect(serialize()).toMatchSnapshot();

  userEvent.click(add);
  expect(serialize()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "agent": null,
        "component": null,
        "disableRequireCheckbox": true,
        "header": "",
        "id": "XYZ",
        "persona": null,
        "recallId": "xyz-recallId",
        "required": false,
        "responseId": "xyz-responseId",
        "rules": Array [
          Object {
            "key": "",
            "value": "",
          },
        ],
        "type": "ConditionalContent",
      },
    ]
  `);

  expect(
    await screen.findByLabelText('Select the operator for expression 1')
  ).toBeInTheDocument();
  expect(
    await screen.findByLabelText('Enter the value for expression 1')
  ).toBeInTheDocument();

  expect(serialize()).toMatchSnapshot();

  done();
});

