import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createMockStore,
  createMockConnectedStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/interaction';
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

describe('GET_INTERACTION_SUCCESS', () => {
  describe('getInteraction', () => {
    let interaction = { ...state.interactions[0], name: 'Fake Interaction' };

    test('Receives a interaction', async () => {
      fetchImplementation(fetch, 200, { interaction });
      const returnValue = await store.dispatch(actions.getInteraction(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions/1",
        ]
      `);
      expect(returnValue).toEqual(interaction);

      await mockStore.dispatch(actions.getInteraction(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "interaction": Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
              "id": 1,
              "name": "Fake Interaction",
              "owner": Object {
                "email": "super@email.com",
                "id": 999,
                "is_anonymous": false,
                "is_super": true,
                "personalname": "Super User",
                "roles": Array [
                  "participant",
                  "super_admin",
                  "facilitator",
                  "researcher",
                ],
                "username": "superuser",
              },
              "updated_at": "2021-02-27T20:38:53.774Z",
            },
            "type": "GET_INTERACTION_SUCCESS",
          },
        ]
      `);
    });
  });

  describe('createInteraction', () => {
    let interaction = { ...state.interactions[0], name: 'Fake Interaction' };

    test('Receives a interaction', async () => {
      fetchImplementation(fetch, 200, { interaction });
      const returnValue = await store.dispatch(
        actions.createInteraction(interaction)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-27T20:38:53.774Z\\",\\"deleted_at\\":null,\\"name\\":\\"Fake Interaction\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(interaction);

      await mockStore.dispatch(actions.createInteraction(interaction));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "interaction": Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
              "id": 1,
              "name": "Fake Interaction",
              "owner": Object {
                "email": "super@email.com",
                "id": 999,
                "is_anonymous": false,
                "is_super": true,
                "personalname": "Super User",
                "roles": Array [
                  "participant",
                  "super_admin",
                  "facilitator",
                  "researcher",
                ],
                "username": "superuser",
              },
              "updated_at": "2021-02-27T20:38:53.774Z",
            },
            "type": "GET_INTERACTION_SUCCESS",
          },
        ]
      `);
    });

    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { interaction });
      const returnValue = await store.dispatch(actions.createInteraction({}));
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setInteraction(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`Array []`);
    });
  });
});

describe('GET_INTERACTION_ERROR', () => {
  let interaction = { ...state.interactions[0], name: 'Fake Interaction' };

  describe('getInteraction', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getInteraction(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions/1",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getInteraction(1));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_INTERACTION_ERROR",
          },
        ]
      `);
    });
  });

  describe('createInteraction', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.createInteraction(interaction)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-27T20:38:53.774Z\\",\\"deleted_at\\":null,\\"name\\":\\"Fake Interaction\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.createInteraction(interaction));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_INTERACTION_ERROR",
          },
        ]
      `);
    });
  });
});

describe('SET_INTERACTION_SUCCESS', () => {
  let interaction = { ...state.interactions[0], name: 'Fake Interaction' };

  describe('setInteraction', () => {
    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { interaction });
      const returnValue = await store.dispatch(actions.setInteraction(1, {}));
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setInteraction(1, {}));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`Array []`);
    });

    test('Receives a interaction', async () => {
      fetchImplementation(fetch, 200, { interaction });
      const returnValue = await store.dispatch(
        actions.setInteraction(1, interaction)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions/1",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-27T20:38:53.774Z\\",\\"deleted_at\\":null,\\"name\\":\\"Fake Interaction\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(interaction);

      await mockStore.dispatch(actions.setInteraction(1, interaction));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "interaction": Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
              "id": 1,
              "name": "Fake Interaction",
              "owner": Object {
                "email": "super@email.com",
                "id": 999,
                "is_anonymous": false,
                "is_super": true,
                "personalname": "Super User",
                "roles": Array [
                  "participant",
                  "super_admin",
                  "facilitator",
                  "researcher",
                ],
                "username": "superuser",
              },
              "updated_at": "2021-02-27T20:38:53.774Z",
            },
            "type": "SET_INTERACTION_SUCCESS",
          },
        ]
      `);
    });

    test('Receives a interaction, updates scenario', async () => {
      store = createMockConnectedStore({
        ...original,
        scenario: {
          ...original.scenario,
          interactions: [...original.interactions]
        }
      });

      fetchImplementation(fetch, 200, { interaction });
      const returnValue = await store.dispatch(
        actions.setInteraction(1, interaction)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions/1",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-27T20:38:53.774Z\\",\\"deleted_at\\":null,\\"name\\":\\"Fake Interaction\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(interaction);

      await mockStore.dispatch(actions.setInteraction(1, interaction));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "interaction": Object {
              "created_at": "2021-02-25T17:31:33.826Z",
              "deleted_at": null,
              "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
              "id": 1,
              "name": "Fake Interaction",
              "owner": Object {
                "email": "super@email.com",
                "id": 999,
                "is_anonymous": false,
                "is_super": true,
                "personalname": "Super User",
                "roles": Array [
                  "participant",
                  "super_admin",
                  "facilitator",
                  "researcher",
                ],
                "username": "superuser",
              },
              "updated_at": "2021-02-27T20:38:53.774Z",
            },
            "type": "SET_INTERACTION_SUCCESS",
          },
        ]
      `);
    });
  });
});

describe('SET_INTERACTION_ERROR', () => {
  let interaction = { ...state.interactions[0], name: 'Fake Interaction' };

  describe('setInteraction', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.setInteraction(1, interaction)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions/1",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-27T20:38:53.774Z\\",\\"deleted_at\\":null,\\"name\\":\\"Fake Interaction\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setInteraction(1, interaction));
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "SET_INTERACTION_ERROR",
          },
        ]
      `);
    });
  });
});

describe('GET_INTERACTIONS_SUCCESS', () => {
  describe('getInteractions', () => {
    let interactions = [...state.interactions];

    test('Receives interactions', async () => {
      fetchImplementation(fetch, 200, { interactions });
      const returnValue = await store.dispatch(actions.getInteractions());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions",
        ]
      `);
      expect(returnValue).toEqual(interactions);

      await mockStore.dispatch(actions.getInteractions());
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "interactions": Array [
              Object {
                "created_at": "2021-02-25T17:31:33.826Z",
                "deleted_at": null,
                "description": "It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.",
                "id": 1,
                "name": "ChatPrompt",
                "owner": Object {
                  "email": "super@email.com",
                  "id": 999,
                  "is_anonymous": false,
                  "is_super": true,
                  "personalname": "Super User",
                  "roles": Array [
                    "participant",
                    "super_admin",
                    "facilitator",
                    "researcher",
                  ],
                  "username": "superuser",
                },
                "updated_at": "2021-02-27T20:38:53.774Z",
              },
              Object {
                "created_at": "2021-02-25T17:31:33.826Z",
                "deleted_at": null,
                "description": "It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Audio Prompt Responses.",
                "id": 2,
                "name": "AudioPrompt",
                "owner": Object {
                  "email": "super@email.com",
                  "id": 999,
                  "is_anonymous": false,
                  "is_super": true,
                  "personalname": "Super User",
                  "roles": Array [
                    "participant",
                    "super_admin",
                    "facilitator",
                    "researcher",
                  ],
                  "username": "superuser",
                },
                "updated_at": "2021-02-27T20:38:53.774Z",
              },
              Object {
                "created_at": "2021-02-25T17:31:33.826Z",
                "deleted_at": null,
                "description": "It will appear as an option for scenario authors to use in conditional content components within scenarios. It receives participant Text Prompt Responses.",
                "id": 3,
                "name": "TextPrompt",
                "owner": Object {
                  "email": "super@email.com",
                  "id": 999,
                  "is_anonymous": false,
                  "is_super": true,
                  "personalname": "Super User",
                  "roles": Array [
                    "participant",
                    "super_admin",
                    "facilitator",
                    "researcher",
                  ],
                  "username": "superuser",
                },
                "updated_at": "2021-02-27T20:38:53.774Z",
              },
            ],
            "type": "GET_INTERACTIONS_SUCCESS",
          },
        ]
      `);
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { interactions: undefined });
      const returnValue = await store.dispatch(actions.getInteractions());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`null`);

      await mockStore.dispatch(actions.getInteractions());
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "interactions": undefined,
            "type": "GET_INTERACTIONS_SUCCESS",
          },
        ]
      `);
    });
  });
});

describe('GET_INTERACTIONS_ERROR', () => {
  describe('getInteractions', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getInteractions());
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getInteractions());
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_INTERACTIONS_ERROR",
          },
        ]
      `);
    });
  });
});

describe('GET_INTERACTIONS_TYPES_SUCCESS', () => {
  describe('getInteractionsTypes', () => {
    let types = [{ name: 'A' }, { name: 'B' }];

    test('Receives types', async () => {
      fetchImplementation(fetch, 200, { types });
      const returnValue = await store.dispatch(actions.getInteractionsTypes());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions/types",
        ]
      `);
      expect(returnValue).toEqual(types);

      await mockStore.dispatch(actions.getInteractionsTypes());
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "GET_INTERACTIONS_TYPES_SUCCESS",
            "types": Array [
              Object {
                "name": "A",
              },
              Object {
                "name": "B",
              },
            ],
          },
        ]
      `);
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { types: undefined });
      const returnValue = await store.dispatch(actions.getInteractionsTypes());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/interactions/types",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`null`);

      await mockStore.dispatch(actions.getInteractionsTypes());
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "GET_INTERACTIONS_TYPES_SUCCESS",
            "types": undefined,
          },
        ]
      `);
    });
  });
});

describe('GET_INTERACTIONS_TYPES_ERROR', () => {
  describe('getInteractionsTypes', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getInteractionsTypes());
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getInteractionsTypes());
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "error": Object {
              "error": [Error: something unexpected happened on the server],
            },
            "type": "GET_INTERACTIONS_TYPES_ERROR",
          },
        ]
      `);
    });
  });
});
