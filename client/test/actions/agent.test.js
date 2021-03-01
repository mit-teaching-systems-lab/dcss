import { v4 as uuid } from 'uuid';
import assert from 'assert';
import {
  createMockStore,
  createMockConnectedStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as actions from '../../actions/agent';
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

describe('GET_AGENT_SUCCESS', () => {
  describe('getAgent', () => {
    let agent = { ...state.agents[0], name: 'Fake Agent' };

    test('Receives a agent', async () => {
      fetchImplementation(fetch, 200, { agent });
      const returnValue = await store.dispatch(actions.getAgent(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents/1",
        ]
      `);
      expect(returnValue).toEqual(agent);

      await mockStore.dispatch(actions.getAgent(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('createAgent', () => {
    let agent = { ...state.agents[0], name: 'Fake Agent' };

    test('Receives a agent', async () => {
      fetchImplementation(fetch, 200, { agent });
      const returnValue = await store.dispatch(actions.createAgent(agent));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-25T20:09:04.999Z\\",\\"deleted_at\\":null,\\"is_active\\":true,\\"title\\":\\"Emoji Analysis\\",\\"name\\":\\"Fake Agent\\",\\"description\\":\\"Detects the presense of an emoji character in your text\\",\\"endpoint\\":\\"ws://emoji-analysis-production.herokuapp.com\\",\\"configuration\\":{\\"bar\\":\\"2\\",\\"baz\\":\\"c\\",\\"foo\\":\\"false\\"},\\"interaction\\":{\\"id\\":1,\\"name\\":\\"ChatPrompt\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"created_at\\":\\"2021-02-25T15:09:05.001302-05:00\\",\\"deleted_at\\":null,\\"updated_at\\":null},\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"},\\"self\\":{\\"id\\":148,\\"email\\":null,\\"roles\\":null,\\"is_super\\":false,\\"username\\":\\"ebe565050b31cbb4e7eacc39b23e2167\\",\\"lastseen_at\\":\\"2021-02-25T13:08:57.323-05:00\\",\\"is_anonymous\\":true,\\"personalname\\":\\"Emoji Analysis\\",\\"single_use_password\\":false}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(agent);

      await mockStore.dispatch(actions.createAgent(agent));
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { agent });
      const returnValue = await store.dispatch(actions.createAgent({}));
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setAgent(1, {}));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_AGENT_ERROR', () => {
  let agent = { ...state.agents[0], name: 'Fake Agent' };

  describe('getAgent', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getAgent(1));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents/1",
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.getAgent(1));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('createAgent', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.createAgent(agent));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-25T20:09:04.999Z\\",\\"deleted_at\\":null,\\"is_active\\":true,\\"title\\":\\"Emoji Analysis\\",\\"name\\":\\"Fake Agent\\",\\"description\\":\\"Detects the presense of an emoji character in your text\\",\\"endpoint\\":\\"ws://emoji-analysis-production.herokuapp.com\\",\\"configuration\\":{\\"bar\\":\\"2\\",\\"baz\\":\\"c\\",\\"foo\\":\\"false\\"},\\"interaction\\":{\\"id\\":1,\\"name\\":\\"ChatPrompt\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"created_at\\":\\"2021-02-25T15:09:05.001302-05:00\\",\\"deleted_at\\":null,\\"updated_at\\":null},\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"},\\"self\\":{\\"id\\":148,\\"email\\":null,\\"roles\\":null,\\"is_super\\":false,\\"username\\":\\"ebe565050b31cbb4e7eacc39b23e2167\\",\\"lastseen_at\\":\\"2021-02-25T13:08:57.323-05:00\\",\\"is_anonymous\\":true,\\"personalname\\":\\"Emoji Analysis\\",\\"single_use_password\\":false}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "POST",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.createAgent(agent));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('SET_AGENT_SUCCESS', () => {
  let agent = { ...state.agents[0], name: 'Fake Agent' };

  describe('setAgent', () => {
    test('Empty params', async () => {
      fetchImplementation(fetch, 200, { agent });
      const returnValue = await store.dispatch(actions.setAgent(1, {}));
      expect(fetch.mock.calls.length).toBe(0);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setAgent(1, {}));
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Receives a agent', async () => {
      fetchImplementation(fetch, 200, { agent });
      const returnValue = await store.dispatch(actions.setAgent(1, agent));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents/1",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-25T20:09:04.999Z\\",\\"deleted_at\\":null,\\"is_active\\":true,\\"title\\":\\"Emoji Analysis\\",\\"name\\":\\"Fake Agent\\",\\"description\\":\\"Detects the presense of an emoji character in your text\\",\\"endpoint\\":\\"ws://emoji-analysis-production.herokuapp.com\\",\\"configuration\\":{\\"bar\\":\\"2\\",\\"baz\\":\\"c\\",\\"foo\\":\\"false\\"},\\"interaction\\":{\\"id\\":1,\\"name\\":\\"ChatPrompt\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"created_at\\":\\"2021-02-25T15:09:05.001302-05:00\\",\\"deleted_at\\":null,\\"updated_at\\":null},\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"},\\"self\\":{\\"id\\":148,\\"email\\":null,\\"roles\\":null,\\"is_super\\":false,\\"username\\":\\"ebe565050b31cbb4e7eacc39b23e2167\\",\\"lastseen_at\\":\\"2021-02-25T13:08:57.323-05:00\\",\\"is_anonymous\\":true,\\"personalname\\":\\"Emoji Analysis\\",\\"single_use_password\\":false}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(agent);

      await mockStore.dispatch(actions.setAgent(1, agent));
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Receives a agent, updates scenario', async () => {
      store = createMockConnectedStore({
        ...original,
        scenario: {
          ...original.scenario,
          agents: [...original.agents]
        }
      });

      fetchImplementation(fetch, 200, { agent });
      const returnValue = await store.dispatch(actions.setAgent(1, agent));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents/1",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-25T20:09:04.999Z\\",\\"deleted_at\\":null,\\"is_active\\":true,\\"title\\":\\"Emoji Analysis\\",\\"name\\":\\"Fake Agent\\",\\"description\\":\\"Detects the presense of an emoji character in your text\\",\\"endpoint\\":\\"ws://emoji-analysis-production.herokuapp.com\\",\\"configuration\\":{\\"bar\\":\\"2\\",\\"baz\\":\\"c\\",\\"foo\\":\\"false\\"},\\"interaction\\":{\\"id\\":1,\\"name\\":\\"ChatPrompt\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"created_at\\":\\"2021-02-25T15:09:05.001302-05:00\\",\\"deleted_at\\":null,\\"updated_at\\":null},\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"},\\"self\\":{\\"id\\":148,\\"email\\":null,\\"roles\\":null,\\"is_super\\":false,\\"username\\":\\"ebe565050b31cbb4e7eacc39b23e2167\\",\\"lastseen_at\\":\\"2021-02-25T13:08:57.323-05:00\\",\\"is_anonymous\\":true,\\"personalname\\":\\"Emoji Analysis\\",\\"single_use_password\\":false}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(agent);

      await mockStore.dispatch(actions.setAgent(1, agent));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('SET_AGENT_ERROR', () => {
  let agent = { ...state.agents[0], name: 'Fake Agent' };

  describe('setAgent', () => {
    test('Receives an error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.setAgent(1, agent));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents/1",
          Object {
            "body": "{\\"id\\":1,\\"created_at\\":\\"2021-02-25T17:31:33.826Z\\",\\"updated_at\\":\\"2021-02-25T20:09:04.999Z\\",\\"deleted_at\\":null,\\"is_active\\":true,\\"title\\":\\"Emoji Analysis\\",\\"name\\":\\"Fake Agent\\",\\"description\\":\\"Detects the presense of an emoji character in your text\\",\\"endpoint\\":\\"ws://emoji-analysis-production.herokuapp.com\\",\\"configuration\\":{\\"bar\\":\\"2\\",\\"baz\\":\\"c\\",\\"foo\\":\\"false\\"},\\"interaction\\":{\\"id\\":1,\\"name\\":\\"ChatPrompt\\",\\"description\\":\\"It will appear as an option for scenario authors to include in chat discussions within multi-participant scenarios. It receives participant chat messages.\\",\\"created_at\\":\\"2021-02-25T15:09:05.001302-05:00\\",\\"deleted_at\\":null,\\"updated_at\\":null},\\"owner\\":{\\"id\\":999,\\"email\\":\\"super@email.com\\",\\"roles\\":[\\"participant\\",\\"super_admin\\",\\"facilitator\\",\\"researcher\\"],\\"is_super\\":true,\\"username\\":\\"superuser\\",\\"is_anonymous\\":false,\\"personalname\\":\\"Super User\\"},\\"self\\":{\\"id\\":148,\\"email\\":null,\\"roles\\":null,\\"is_super\\":false,\\"username\\":\\"ebe565050b31cbb4e7eacc39b23e2167\\",\\"lastseen_at\\":\\"2021-02-25T13:08:57.323-05:00\\",\\"is_anonymous\\":true,\\"personalname\\":\\"Emoji Analysis\\",\\"single_use_password\\":false}}",
            "headers": Object {
              "Content-Type": "application/json",
            },
            "method": "PUT",
          },
        ]
      `);
      expect(returnValue).toEqual(null);

      await mockStore.dispatch(actions.setAgent(1, agent));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_AGENTS_SUCCESS', () => {
  describe('getAgents', () => {
    let agents = [...state.agents];

    test('Receives agents', async () => {
      fetchImplementation(fetch, 200, { agents });
      const returnValue = await store.dispatch(actions.getAgents());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents",
        ]
      `);
      expect(returnValue).toEqual(agents);

      await mockStore.dispatch(actions.getAgents());
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { agents: undefined });
      const returnValue = await store.dispatch(actions.getAgents());
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`Array []`);

      await mockStore.dispatch(actions.getAgents());
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
  describe('getAgents, filtered', () => {
    let agents = [...state.agents];

    test('Receives agents', async () => {
      fetchImplementation(fetch, 200, { agents });
      const returnValue = await store.dispatch(actions.getAgents('is_active'));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents",
        ]
      `);
      expect(returnValue).toEqual(agents);

      await mockStore.dispatch(actions.getAgents());
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    test('Receives undefined', async () => {
      fetchImplementation(fetch, 200, { agents: undefined });
      const returnValue = await store.dispatch(actions.getAgents('is_active'));
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "/api/agents",
        ]
      `);
      expect(returnValue).toMatchInlineSnapshot(`Array []`);

      await mockStore.dispatch(actions.getAgents());
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});

describe('GET_AGENTS_ERROR', () => {
  describe('getAgents', () => {
    test('Receives error', async () => {
      fetchImplementation(fetch, 200, { error });
      const returnValue = await store.dispatch(actions.getAgents());
      expect(fetch.mock.calls.length).toBe(1);
      expect(returnValue).toEqual(null);
      await mockStore.dispatch(actions.getAgents());
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});
