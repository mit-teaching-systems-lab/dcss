import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createMockStore,
  createMockConnectedStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/invite';
import * as types from '../../actions/types';
import Storage from '../../util/Storage';
jest.mock('../../util/Storage');

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));
let mockStore;
let store;

beforeAll(() => {
  (window || global).fetch = jest.fn();
  Storage.has = jest.fn();
  Storage.delete = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
  Storage.has.mockRestore();
  Storage.delete.mockRestore();
});

beforeEach(() => {
  mockStore = createMockStore({});
  store = createMockConnectedStore({});
  fetch.mockImplementation(() => {});
  Storage.has.mockImplementation(() => true);
  Storage.delete.mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
  Storage.has.mockReset();
  Storage.delete.mockReset();
});

describe('SET_INVITE_SUCCESS', () => {
  let invites = [...state.invites];

  describe('setInvite', () => {
    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { invites });
      const returnValue = await store.dispatch(actions.setInvite(1, {}));
      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "/api/invites/1",
            Object {
              "body": "{}",
              "headers": Object {
                "Content-Type": "application/json",
              },
              "method": "PUT",
            },
          ],
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`
        Object {
          "code": "b7f21ab4-aa95-4f48-aee8-19f7176bc595",
          "created_at": "2021-02-04T19:24:39.039Z",
          "expire_at": null,
          "id": 1,
          "props": Object {
            "chat_id": 8,
            "persona_id": null,
          },
          "receiver_id": 555,
          "sender_id": 999,
          "status_id": 1,
          "updated_at": null,
        }
      `);

      await mockStore.dispatch(actions.setInvite(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "invite": Object {
              "code": "b7f21ab4-aa95-4f48-aee8-19f7176bc595",
              "created_at": "2021-02-04T19:24:39.039Z",
              "expire_at": null,
              "id": 1,
              "props": Object {
                "chat_id": 8,
                "persona_id": null,
              },
              "receiver_id": 555,
              "sender_id": 999,
              "status_id": 1,
              "updated_at": null,
            },
            "type": "SET_INVITE_SUCCESS",
          },
        ]
      `);
    });

    test('Update status', async () => {
      fetchImplementation(fetch, 200, { invites });
      const returnValue = await store.dispatch(
        actions.setInvite(1, { status: 'ACCEPTED' })
      );
      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "/api/invites/1",
            Object {
              "body": "{\\"status\\":\\"ACCEPTED\\"}",
              "headers": Object {
                "Content-Type": "application/json",
              },
              "method": "PUT",
            },
          ],
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`
        Object {
          "code": "b7f21ab4-aa95-4f48-aee8-19f7176bc595",
          "created_at": "2021-02-04T19:24:39.039Z",
          "expire_at": null,
          "id": 1,
          "props": Object {
            "chat_id": 8,
            "persona_id": null,
          },
          "receiver_id": 555,
          "sender_id": 999,
          "status_id": 1,
          "updated_at": null,
        }
      `);

      await mockStore.dispatch(actions.setInvite(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "invite": Object {
              "code": "b7f21ab4-aa95-4f48-aee8-19f7176bc595",
              "created_at": "2021-02-04T19:24:39.039Z",
              "expire_at": null,
              "id": 1,
              "props": Object {
                "chat_id": 8,
                "persona_id": null,
              },
              "receiver_id": 555,
              "sender_id": 999,
              "status_id": 1,
              "updated_at": null,
            },
            "type": "SET_INVITE_SUCCESS",
          },
        ]
      `);
    });

    test('Receives an invite', async () => {
      fetchImplementation(fetch, 200, { invites });
      const returnValue = await store.dispatch(
        actions.setInvite(1, invites[0])
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/invites/1",
          Object {
            "body": "{}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`
        Object {
          "code": "b7f21ab4-aa95-4f48-aee8-19f7176bc595",
          "created_at": "2021-02-04T19:24:39.039Z",
          "expire_at": null,
          "id": 1,
          "props": Object {
            "chat_id": 8,
            "persona_id": null,
          },
          "receiver_id": 555,
          "sender_id": 999,
          "status_id": 1,
          "updated_at": null,
        }
      `);

      await mockStore.dispatch(actions.setInvite(1, invites[0]));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "invite": Object {
              "code": "b7f21ab4-aa95-4f48-aee8-19f7176bc595",
              "created_at": "2021-02-04T19:24:39.039Z",
              "expire_at": null,
              "id": 1,
              "props": Object {
                "chat_id": 8,
                "persona_id": null,
              },
              "receiver_id": 555,
              "sender_id": 999,
              "status_id": 1,
              "updated_at": null,
            },
            "type": "SET_INVITE_SUCCESS",
          },
        ]
      `);
    });
  });
});

describe('SET_INVITE_ERROR', () => {
  let invites = [...state.invites];

  describe('setInvite', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.setInvite(1, invites[0])
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/invites/1",
          Object {
            "body": "{}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setInvite(1, invites[0]));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "SET_INVITE_ERROR",
          },
        ]
      `);
    });
  });
});

describe('GET_INVITES_SUCCESS', () => {
  describe('getInvites', () => {
    let invites = [...state.invites];

    test('Receives invites', async () => {
      fetchImplementation(fetch, 200, { invites });
      const returnValue = await store.dispatch(actions.getInvites());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/invites",
        ]
      `);
      expect(returnValue).toEqual(invites);

      await mockStore.dispatch(actions.getInvites());
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "invites": Array [
              Object {
                "code": "b7f21ab4-aa95-4f48-aee8-19f7176bc595",
                "created_at": "2021-02-04T19:24:39.039Z",
                "expire_at": null,
                "id": 1,
                "props": Object {
                  "chat_id": 8,
                  "persona_id": null,
                },
                "receiver_id": 555,
                "sender_id": 999,
                "status_id": 1,
                "updated_at": null,
              },
            ],
            "type": "GET_INVITES_SUCCESS",
          },
        ]
      `);
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { invites: undefined });
      const returnValue = await store.dispatch(actions.getInvites());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/invites",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`null`);

      await mockStore.dispatch(actions.getInvites());
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "invites": undefined,
            "type": "GET_INVITES_SUCCESS",
          },
        ]
      `);
    });
  });
});

describe('GET_INVITES_ERROR', () => {
  describe('getInvites', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getInvites());
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getInvites());
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_INVITES_ERROR",
          },
        ]
      `);
    });
  });
});
