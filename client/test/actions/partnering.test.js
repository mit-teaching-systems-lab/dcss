import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createMockConnectedStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/partnering';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  store = createMockConnectedStore({});
  fetch.mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
});

test('GET_PARTNERING_SUCCESS', async () => {
  const partnering = [
    {
      id: 1,
      description:
        'Allow participants to create open or closed chat rooms. Participants will be able to create rooms and send invites to specific members of the cohort, or create rooms that are open to anyone in the cohort to join.',
      instruction:
        'Choose one of the following partnering options, then click on the role you will play in the scenario.'
    },
    {
      id: 2,
      description:
        'Allow participants to create only closed chat rooms. Participants create a room by first selecting their own role, then sending invites to one or more selected partners with assigned roles. Automatic partnering is disabled.',
      instruction:
        'Choose the role you will play in the scenario; you will then be prompted to select one or more partners, assign their roles and send invites for them to join you.'
    },
    {
      id: 3,
      description:
        "Allow participants to create only open chat rooms. Participants create a room by selecting a role, while other members of the cohort are free to choose any role. Once the scenario's role are filled, participants will be automatically partnered. Invitation partnering is disabled.",
      instruction:
        'Choose the role you will play in the scenario; another participant will be partnered with you automatically.'
    }
  ];

  fetchImplementation(fetch, 200, { partnering });

  await store.dispatch(actions.getPartnering());

  expect(fetch.mock.calls.length).toBe(1);
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/partnering",
    ]
  `);
  expect(store.getState().partnering).toMatchInlineSnapshot(`
    Array [
      Object {
        "description": "Allow participants to create open or closed chat rooms. Participants will be able to create rooms and send invites to specific members of the cohort, or create rooms that are open to anyone in the cohort to join.",
        "id": 1,
        "instruction": "Choose one of the following partnering options, then click on the role you will play in the scenario.",
      },
      Object {
        "description": "Allow participants to create only closed chat rooms. Participants create a room by first selecting their own role, then sending invites to one or more selected partners with assigned roles. Automatic partnering is disabled.",
        "id": 2,
        "instruction": "Choose the role you will play in the scenario; you will then be prompted to select one or more partners, assign their roles and send invites for them to join you.",
      },
      Object {
        "description": "Allow participants to create only open chat rooms. Participants create a room by selecting a role, while other members of the cohort are free to choose any role. Once the scenario's role are filled, participants will be automatically partnered. Invitation partnering is disabled.",
        "id": 3,
        "instruction": "Choose the role you will play in the scenario; another participant will be partnered with you automatically.",
      },
    ]
  `);

  // Ensure that the cached partnering options are returned
  await store.dispatch(actions.getPartnering());
  expect(fetch.mock.calls.length).toBe(1);
});

test('GET_PARTNERING_ERROR', async () => {
  fetchImplementation(fetch, 200, { error });

  const returnValue = await store.dispatch(actions.getPartnering());
  expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "/api/partnering",
    ]
  `);
  // assert.deepEqual(store.getState().errors.tags.error, error);
  expect(returnValue).toBe(null);
});
