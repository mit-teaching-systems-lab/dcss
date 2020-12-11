import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createMockStore,
  createMockConnectedStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/persona';
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

describe('GET_PERSONA_SUCCESS', () => {
  describe('getPersona', () => {
    let persona = { ...state.personas[0], name: 'Fake Persona' };

    test('Receives a persona', async () => {
      fetchImplementation(fetch, 200, { persona });
      const returnValue = await store.dispatch(actions.getPersona(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas/1",
        ]
      `);
      expect(returnValue).toEqual(persona);

      await mockStore.dispatch(actions.getPersona(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('createPersona', () => {
    let persona = { ...state.personas[0], name: 'Fake Persona' };

    test('Receives a persona', async () => {
      fetchImplementation(fetch, 200, { persona });
      const returnValue = await store.dispatch(actions.createPersona(persona));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas",
          Object {
            "body": "{\\"name\\":\\"Fake Persona\\",\\"description\\":\\"The default user participating in a single person scenario.\\",\\"color\\":\\"#FFFFFF\\"}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(persona);

      await mockStore.dispatch(actions.createPersona(persona));
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { persona });
      const returnValue = await store.dispatch(actions.createPersona({}));
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setPersona(1, {}));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_PERSONA_ERROR', () => {
  let persona = { ...state.personas[0], name: 'Fake Persona' };

  describe('getPersona', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getPersona(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas/1",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getPersona(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('createPersona', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.createPersona(persona));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas",
          Object {
            "body": "{\\"name\\":\\"Fake Persona\\",\\"description\\":\\"The default user participating in a single person scenario.\\",\\"color\\":\\"#FFFFFF\\"}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.createPersona(persona));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('SET_PERSONA_SUCCESS', () => {
  let persona = { ...state.personas[0], name: 'Fake Persona' };

  describe('setPersona', () => {
    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { persona });
      const returnValue = await store.dispatch(actions.setPersona(1, {}));
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setPersona(1, {}));
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Receives a persona', async () => {
      fetchImplementation(fetch, 200, { persona });
      const returnValue = await store.dispatch(actions.setPersona(1, persona));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas/1",
          Object {
            "body": "{\\"id\\":1,\\"name\\":\\"Fake Persona\\",\\"description\\":\\"The default user participating in a single person scenario.\\",\\"color\\":\\"#FFFFFF\\",\\"created_at\\":\\"2020-12-01T15:49:04.962Z\\",\\"updated_at\\":null,\\"deleted_at\\":null,\\"author_id\\":3,\\"is_read_only\\":true,\\"is_shared\\":true}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(persona);

      await mockStore.dispatch(actions.setPersona(1, persona));
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Receives a persona, updates scenario', async () => {
      store = createMockConnectedStore({
        ...original,
        scenario: {
          ...original.scenario,
          personas: [...original.personas]
        }
      });

      fetchImplementation(fetch, 200, { persona });
      const returnValue = await store.dispatch(actions.setPersona(1, persona));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas/1",
          Object {
            "body": "{\\"id\\":1,\\"name\\":\\"Fake Persona\\",\\"description\\":\\"The default user participating in a single person scenario.\\",\\"color\\":\\"#FFFFFF\\",\\"created_at\\":\\"2020-12-01T15:49:04.962Z\\",\\"updated_at\\":null,\\"deleted_at\\":null,\\"author_id\\":3,\\"is_read_only\\":true,\\"is_shared\\":true}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(persona);

      await mockStore.dispatch(actions.setPersona(1, persona));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('SET_PERSONA_ERROR', () => {
  let persona = { ...state.personas[0], name: 'Fake Persona' };

  describe('setPersona', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.setPersona(1, persona));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas/1",
          Object {
            "body": "{\\"id\\":1,\\"name\\":\\"Fake Persona\\",\\"description\\":\\"The default user participating in a single person scenario.\\",\\"color\\":\\"#FFFFFF\\",\\"created_at\\":\\"2020-12-01T15:49:04.962Z\\",\\"updated_at\\":null,\\"deleted_at\\":null,\\"author_id\\":3,\\"is_read_only\\":true,\\"is_shared\\":true}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setPersona(1, persona));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_PERSONAS_SUCCESS', () => {
  describe('getPersonas', () => {
    let personas = [...state.personas];

    test('Receives personas', async () => {
      fetchImplementation(fetch, 200, { personas });
      const returnValue = await store.dispatch(actions.getPersonas());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas",
        ]
      `);
      expect(returnValue).toEqual(personas);

      await mockStore.dispatch(actions.getPersonas());
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { personas: undefined });
      const returnValue = await store.dispatch(actions.getPersonas());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`Array []`);

      await mockStore.dispatch(actions.getPersonas());
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('SET_SCENARIO', () => {
  describe('linkPersonaToScenario', () => {
    let personas = [...state.personas];

    test('Receives personas for scenario', async () => {
      fetchImplementation(fetch, 200, { personas });
      const returnValue = await store.dispatch(
        actions.linkPersonaToScenario(1, 2)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas/link/1/scenario/2",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`
        Object {
          "author": Object {
            "id": null,
            "username": "",
          },
          "categories": Array [],
          "consent": Object {
            "id": null,
            "prose": "",
          },
          "description": undefined,
          "finish": Object {
            "components": Array [],
            "is_finish": true,
            "title": "",
          },
          "labels": Array [],
          "lock": null,
          "personas": Array [
            Object {
              "author_id": 3,
              "color": "#FFFFFF",
              "created_at": "2020-12-01T15:49:04.962Z",
              "deleted_at": null,
              "description": "The default user participating in a single person scenario.",
              "id": 1,
              "is_read_only": true,
              "is_shared": true,
              "name": "Participant",
              "updated_at": null,
            },
            Object {
              "author_id": 3,
              "color": "#3f59a9",
              "created_at": "2020-12-01T15:49:04.962Z",
              "deleted_at": null,
              "description": "A non-specific teacher, participating in a multi person scenario.",
              "id": 2,
              "is_read_only": true,
              "is_shared": true,
              "name": "Teacher",
              "updated_at": null,
            },
            Object {
              "author_id": 3,
              "color": "#e59235",
              "created_at": "2020-12-01T15:49:04.962Z",
              "deleted_at": null,
              "description": "A non-specific student, participating in a multi person scenario.",
              "id": 3,
              "is_read_only": true,
              "is_shared": true,
              "name": "Student",
              "updated_at": null,
            },
            Object {
              "author_id": 3,
              "color": "#73b580",
              "created_at": "2020-12-01T15:49:04.962Z",
              "deleted_at": null,
              "description": "A non-specific facilitator, leading participation in a multi person scenario.",
              "id": 4,
              "is_read_only": true,
              "is_shared": true,
              "name": "Facilitator",
              "updated_at": null,
            },
          ],
          "slides": Array [],
          "status": 1,
          "title": "",
          "users": Array [],
        }
      `);

      await mockStore.dispatch(actions.linkPersonaToScenario(1, 2));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('unlinkPersonaFromScenario', () => {
    let personas = [...state.personas];

    test('Receives personas for scenario', async () => {
      fetchImplementation(fetch, 200, { personas });
      const returnValue = await store.dispatch(
        actions.unlinkPersonaFromScenario(1, 2)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas/unlink/1/scenario/2",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`
        Object {
          "author": Object {
            "id": null,
            "username": "",
          },
          "categories": Array [],
          "consent": Object {
            "id": null,
            "prose": "",
          },
          "description": undefined,
          "finish": Object {
            "components": Array [],
            "is_finish": true,
            "title": "",
          },
          "labels": Array [],
          "lock": null,
          "personas": Array [
            Object {
              "author_id": 3,
              "color": "#FFFFFF",
              "created_at": "2020-12-01T15:49:04.962Z",
              "deleted_at": null,
              "description": "The default user participating in a single person scenario.",
              "id": 1,
              "is_read_only": true,
              "is_shared": true,
              "name": "Participant",
              "updated_at": null,
            },
            Object {
              "author_id": 3,
              "color": "#3f59a9",
              "created_at": "2020-12-01T15:49:04.962Z",
              "deleted_at": null,
              "description": "A non-specific teacher, participating in a multi person scenario.",
              "id": 2,
              "is_read_only": true,
              "is_shared": true,
              "name": "Teacher",
              "updated_at": null,
            },
            Object {
              "author_id": 3,
              "color": "#e59235",
              "created_at": "2020-12-01T15:49:04.962Z",
              "deleted_at": null,
              "description": "A non-specific student, participating in a multi person scenario.",
              "id": 3,
              "is_read_only": true,
              "is_shared": true,
              "name": "Student",
              "updated_at": null,
            },
            Object {
              "author_id": 3,
              "color": "#73b580",
              "created_at": "2020-12-01T15:49:04.962Z",
              "deleted_at": null,
              "description": "A non-specific facilitator, leading participation in a multi person scenario.",
              "id": 4,
              "is_read_only": true,
              "is_shared": true,
              "name": "Facilitator",
              "updated_at": null,
            },
          ],
          "slides": Array [],
          "status": 1,
          "title": "",
          "users": Array [],
        }
      `);

      await mockStore.dispatch(actions.unlinkPersonaFromScenario(1, 2));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('LINK_PERSONA_TO_SCENARIO_ERROR', () => {
  describe('linkPersonaToScenario', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.linkPersonaToScenario(1, 2)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas/link/1/scenario/2",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.linkPersonaToScenario(1, 2));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('UNLINK_PERSONA_FROM_SCENARIO_ERROR', () => {
  describe('unlinkPersonaFromScenario', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(
        actions.unlinkPersonaFromScenario(1, 2)
      );
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/personas/unlink/1/scenario/2",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.unlinkPersonaFromScenario(1, 2));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_PERSONAS_ERROR', () => {
  describe('getPersonas', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getPersonas());
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getPersonas());
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('SET_PERSONAS_SUCCESS', () => {
  describe('getPersonas', () => {
    let personas = [...state.personas];
    test('Sets personas', async () => {
      const returnValue = await store.dispatch(actions.setPersonas(personas));
      expect(fetch.mock.calls.length).toBe(0);
      await mockStore.dispatch(actions.setPersonas(personas));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});
