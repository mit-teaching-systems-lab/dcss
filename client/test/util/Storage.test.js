import storage from 'local-storage-fallback';
const actualStorage = jest.requireActual('local-storage-fallback');

jest.mock('local-storage-fallback', () => {
  const actual = jest.requireActual('local-storage-fallback');
  return {
    clear: jest.fn(actual.clear),
    getItem: jest.fn(actual.getItem),
    removeItem: jest.fn(actual.removeItem),
    setItem: jest.fn(actual.setItem)
  };
});

import Storage from '@utils/Storage';

beforeEach(() => {});

afterAll(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('Storage.clear()', () => {
  test('Calls through', () => {
    expect(Storage.clear()).toBe();
    expect(storage.clear).toHaveBeenCalledTimes(1);
  });
});

describe('Storage.delete(key)', () => {
  test('Calls through', () => {
    expect(Storage.delete('x')).toBe();
    expect(storage.removeItem).toHaveBeenCalledTimes(1);
    expect(storage.removeItem.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "x",
        ],
      ]
    `);
  });
});

describe('Storage.get(key)', () => {
  beforeEach(() => {
    jest.spyOn(Storage, 'set');
  });

  afterEach(() => {
    Storage.set.mockRestore();
  });

  test('Get without defaults', () => {
    storage.getItem.mockImplementation(() => '9');
    expect(Storage.get('x')).toBe(9);
    expect(Storage.set).toHaveBeenCalledTimes(0);
    // call through
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledTimes(0);
  });

  test('Get with defaults', () => {
    storage.getItem.mockImplementation(() => 'null');
    expect(Storage.get('x', {})).toMatchInlineSnapshot(`Object {}`);
    expect(Storage.set).toHaveBeenCalledTimes(1);
    // call through
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });
});

describe('Storage.set(key, data)', () => {
  test('Any', () => {
    expect(Storage.set('x', { x: 1 })).toMatchInlineSnapshot(`
      Object {
        "x": 1,
      }
    `);
  });
});

describe('Storage.has(key)', () => {
  test('Not undefined', () => {
    let calls = 0;

    Object.defineProperty(storage, 'x', {
      configurable: true,
      get() {
        calls++;
        return undefined;
      }
    });

    expect(Storage.has('x')).toBe(false);
    expect(calls).toBe(1);
  });
});

describe('Storage.merge(key, dataOrFn)', () => {
  test('Storage.merge(key, dataOrFn), data', () => {
    storage.getItem.mockImplementation(() => '{"x":1}');
    expect(Storage.merge('x', { x: 2 })).toMatchInlineSnapshot(`
      Object {
        "x": 2,
      }
    `);
  });

  test('Storage.merge(key, dataOrFn), function', () => {
    storage.getItem.mockImplementation(() => '{"x":1}');
    expect(Storage.merge('x', () => ({ x: 2 }))).toMatchInlineSnapshot(`
      Object {
        "x": 2,
      }
    `);
  });
});
