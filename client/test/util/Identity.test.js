import objectHash from 'object-hash';
const actualObjectHash = jest.requireActual('object-hash');

jest.mock('object-hash', () => {
  const actual = jest.requireActual('object-hash');
  return {
    __esModule: true,
    default: jest.fn(actual)
  };
});

globalThis.SESSION_SECRET = '';

import Identity from '@utils/Identity';
// Repair @utils/Identity from the mocked version created
// in test.setup.js
jest.mock('@utils/Identity', () => {
  return {
    __esModule: true,
    default: {
      ...jest.requireActual('@utils/Identity').default
    }
  };
});

beforeEach(() => {
  globalThis.SESSION_SECRET = '';
});

afterAll(() => {
  jest.restoreAllMocks();
  jest.mock('@utils/Identity', () => {
    let count = 0;
    return {
      __esModule: true,
      default: {
        ...jest.requireActual('@utils/Identity').default,
        id() {
          return `x${++count}`;
        }
      }
    };
  });
});

afterEach(() => {
  jest.resetAllMocks();
  delete globalThis.SESSION_SECRET;
});

describe('Identity.id()', () => {
  test('random string of characters ends with a sequential number', () => {
    expect(Identity.id()).toEqual(expect.stringMatching(/(.+)1/));
    expect(Identity.id()).toEqual(expect.stringMatching(/(.+)2/));
    expect(Identity.id()).toEqual(expect.stringMatching(/(.+)3/));
    expect(Identity.id()).toEqual(expect.stringMatching(/(.+)4/));
  });
  test('random string of characters does not start with a number', () => {
    expect(Identity.id()).not.toEqual(expect.stringMatching(/^\d/));
  });
  test('minimum length', () => {
    expect(Identity.id().length).toBeGreaterThanOrEqual(10);
  });
});

describe('Identity.key()', () => {
  test('single object argument', () => {
    const a = Identity.key({});
    expect(Identity.key({})).toBe(a);

    expect(objectHash).toHaveBeenCalledTimes(2);
    expect(objectHash.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            Object {},
          ],
        ],
        Array [
          Array [
            Object {},
          ],
        ],
      ]
    `);
  });

  test('multiple object arguments', () => {
    const a = Identity.key({}, {}, {});
    expect(Identity.key({}, {}, {})).toBe(a);
    expect(objectHash).toHaveBeenCalledTimes(2);
    expect(objectHash.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            Object {},
            Object {},
            Object {},
          ],
        ],
        Array [
          Array [
            Object {},
            Object {},
            Object {},
          ],
        ],
      ]
    `);
  });

  test('single non-object argument', () => {
    const a = Identity.key('a');
    expect(Identity.key('a')).toBe(a);
    expect(objectHash).toHaveBeenCalledTimes(2);
    expect(objectHash.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "a",
          ],
        ],
        Array [
          Array [
            "a",
          ],
        ],
      ]
    `);

    const n = Identity.key(1);
    expect(Identity.key(1)).toBe(n);
    expect(objectHash).toHaveBeenCalledTimes(4);
    expect(objectHash.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "a",
          ],
        ],
        Array [
          Array [
            "a",
          ],
        ],
        Array [
          Array [
            1,
          ],
        ],
        Array [
          Array [
            1,
          ],
        ],
      ]
    `);
  });

  test('multiple non-object arguments', () => {
    const a = Identity.key('a', 'b', 'c');
    expect(Identity.key('a', 'b', 'c')).toBe(a);
    expect(objectHash).toHaveBeenCalledTimes(2);
    expect(objectHash.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "a",
            "b",
            "c",
          ],
        ],
        Array [
          Array [
            "a",
            "b",
            "c",
          ],
        ],
      ]
    `);

    const n = Identity.key(1, 2, 3);
    expect(Identity.key(1, 2, 3)).toBe(n);
    expect(objectHash).toHaveBeenCalledTimes(4);
    expect(objectHash.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "a",
            "b",
            "c",
          ],
        ],
        Array [
          Array [
            "a",
            "b",
            "c",
          ],
        ],
        Array [
          Array [
            1,
            2,
            3,
          ],
        ],
        Array [
          Array [
            1,
            2,
            3,
          ],
        ],
      ]
    `);
  });

  test('mixed', () => {
    const a = Identity.key(1, {}, 'a', []);
    expect(Identity.key(1, {}, 'a', [])).toBe(a);
    expect(objectHash).toHaveBeenCalledTimes(2);
    expect(objectHash.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            1,
            Object {},
            "a",
            Array [],
          ],
        ],
        Array [
          Array [
            1,
            Object {},
            "a",
            Array [],
          ],
        ],
      ]
    `);
  });

  test('null', () => {
    const a = Identity.key(null);
    expect(Identity.key(null)).toBe(a);
    expect(objectHash).toHaveBeenCalledTimes(2);
    expect(objectHash.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            null,
          ],
        ],
        Array [
          Array [
            null,
          ],
        ],
      ]
    `);
  });
});

describe('Identity.fromHash/toHash()', () => {
  describe('Identity.fromHash(...)', () => {
    test('Missing arg returns null', () => {
      expect(Identity.fromHash()).toBe(null);
    });

    test('Undefined arg returns null', () => {
      expect(Identity.fromHash(undefined)).toBe(null);
    });

    test('Null arg returns null', () => {
      expect(Identity.fromHash(null)).toBe(null);
    });
  });

  describe('Identity.toHash(...)', () => {
    test('Missing arg returns null', () => {
      expect(Identity.toHash()).toBe(null);
    });

    test('Undefined arg returns null', () => {
      expect(Identity.toHash(undefined)).toBe(null);
    });

    test('Null arg returns null', () => {
      expect(Identity.toHash(null)).toBe(null);
    });
  });

  describe('Conversions', () => {
    beforeEach(() => {
      objectHash.mockImplementation(input => actualObjectHash(input));
    });

    test('id -> hash -> id', () => {
      expect(Identity.toHash(0)).toMatchInlineSnapshot(`"e766cee69a"`);
      expect(Identity.fromHash(Identity.toHash(0))).toBe(0);
      expect(objectHash).toHaveBeenCalledTimes(1);

      expect(Identity.toHash(1)).toMatchInlineSnapshot(`"c5de82e702"`);
      expect(Identity.fromHash(Identity.toHash(1))).toBe(1);
      expect(objectHash).toHaveBeenCalledTimes(2);
    });

    test('hash -> id -> hash', () => {
      const zeroHash = 'e766cee69a';

      expect(Identity.fromHash(zeroHash)).toBe(0);
      expect(Identity.toHash(Identity.fromHash(zeroHash))).toBe(zeroHash);
      expect(objectHash).toHaveBeenCalledTimes(0);

      const oneHash = 'c5de82e702';
      expect(Identity.fromHash(oneHash)).toBe(1);
      expect(Identity.toHash(Identity.fromHash(oneHash))).toBe(oneHash);
      expect(objectHash).toHaveBeenCalledTimes(0);
    });

    test('cfcdb2b442 -> 100', () => {
      const hash = 'cfcdb2b442';

      expect(Identity.fromHash(hash)).toBe(100);
      expect(objectHash).toHaveBeenCalledTimes(99);

      expect(Identity.getMaps()).toMatchInlineSnapshot(`
        Object {
          "hashToIdMap": Object {
            "00038e7835": 53,
            "0b39963c5b": 46,
            "0d9a4ef81c": 84,
            "0e14cdfa43": 6,
            "0e1858e79e": 26,
            "0f507008cf": 11,
            "123c18b8f3": 36,
            "1477b7f652": 25,
            "1d94d3ee8d": 82,
            "1f75bd7007": 4,
            "217a8e891a": 32,
            "2352dd8955": 88,
            "26b72f4f52": 78,
            "26d1a8e88e": 98,
            "2743931fda": 63,
            "28d5d9f5a7": 16,
            "2c3d14ec14": 21,
            "2d35a0c169": 60,
            "2d6c49f415": 9,
            "2e44e6838b": 79,
            "30ccb2a266": 51,
            "30df7f3412": 54,
            "31fc299746": 33,
            "33379f8e90": 13,
            "34b313094e": 43,
            "3a8d95a033": 2,
            "3eb3d3ed49": 22,
            "42db91b808": 37,
            "469790fe80": 72,
            "479c29f0ce": 7,
            "481c746a80": 80,
            "4961b96c34": 94,
            "49635ab22e": 49,
            "4c5f01dac0": 90,
            "4e19d76791": 75,
            "4eb041e98d": 97,
            "4ecfbe955f": 28,
            "58b384524a": 41,
            "5e8ee9d0e4": 48,
            "5fdab3bbcd": 58,
            "60d70b9425": 24,
            "651c9059ea": 45,
            "66bbe2607a": 19,
            "6b8018084b": 99,
            "6caf53f291": 57,
            "6d25c027f3": 35,
            "6f48383753": 95,
            "770c64aa1b": 86,
            "7bcc8d3307": 30,
            "7c9eab7496": 55,
            "7cb61e936c": 64,
            "7fbaee9bca": 3,
            "800850c505": 44,
            "877e186e66": 8,
            "88d4e0cfe8": 59,
            "925f96b1eb": 70,
            "95a6e7bbc0": 92,
            "95e91580eb": 77,
            "9685d731a7": 89,
            "96dfe83a8f": 96,
            "9a54f0cea7": 10,
            "9a9aec4fde": 61,
            "9db6622023": 76,
            "9dc344944c": 29,
            "a016279dad": 47,
            "a47833cd1b": 91,
            "a4985eff1e": 83,
            "aa1e66756f": 87,
            "ac04c9cc18": 81,
            "b40e38796c": 23,
            "b629477983": 68,
            "b8fd62c1b5": 34,
            "bc6aa18741": 69,
            "bdef65a569": 12,
            "be3f030390": 71,
            "c15b5f4621": 65,
            "c5de82e702": 1,
            "c90860f953": 18,
            "c9e990f9e1": 31,
            "c9f81392b0": 5,
            "ca22a03e1f": 67,
            "cc78c21590": 14,
            "cfa062e43a": 27,
            "cfcdb2b442": 100,
            "d692c141cc": 73,
            "dd334a63f0": 66,
            "e020ab46fa": 17,
            "e289e8c4f5": 62,
            "e3074544c3": 42,
            "e378bfa6a7": 38,
            "e766cee69a": 0,
            "edff14fa54": 39,
            "f06232c048": 93,
            "f2705d47b8": 74,
            "f6c8f0bd01": 15,
            "f7b37e96bb": 20,
            "f818f953dc": 40,
            "fcf60bd0c5": 85,
            "fd932d2a15": 52,
            "fe756d4550": 50,
            "ffafe72dfd": 56,
          },
          "idToHashMap": Object {
            "0": "e766cee69a",
            "1": "c5de82e702",
            "10": "9a54f0cea7",
            "100": "cfcdb2b442",
            "11": "0f507008cf",
            "12": "bdef65a569",
            "13": "33379f8e90",
            "14": "cc78c21590",
            "15": "f6c8f0bd01",
            "16": "28d5d9f5a7",
            "17": "e020ab46fa",
            "18": "c90860f953",
            "19": "66bbe2607a",
            "2": "3a8d95a033",
            "20": "f7b37e96bb",
            "21": "2c3d14ec14",
            "22": "3eb3d3ed49",
            "23": "b40e38796c",
            "24": "60d70b9425",
            "25": "1477b7f652",
            "26": "0e1858e79e",
            "27": "cfa062e43a",
            "28": "4ecfbe955f",
            "29": "9dc344944c",
            "3": "7fbaee9bca",
            "30": "7bcc8d3307",
            "31": "c9e990f9e1",
            "32": "217a8e891a",
            "33": "31fc299746",
            "34": "b8fd62c1b5",
            "35": "6d25c027f3",
            "36": "123c18b8f3",
            "37": "42db91b808",
            "38": "e378bfa6a7",
            "39": "edff14fa54",
            "4": "1f75bd7007",
            "40": "f818f953dc",
            "41": "58b384524a",
            "42": "e3074544c3",
            "43": "34b313094e",
            "44": "800850c505",
            "45": "651c9059ea",
            "46": "0b39963c5b",
            "47": "a016279dad",
            "48": "5e8ee9d0e4",
            "49": "49635ab22e",
            "5": "c9f81392b0",
            "50": "fe756d4550",
            "51": "30ccb2a266",
            "52": "fd932d2a15",
            "53": "00038e7835",
            "54": "30df7f3412",
            "55": "7c9eab7496",
            "56": "ffafe72dfd",
            "57": "6caf53f291",
            "58": "5fdab3bbcd",
            "59": "88d4e0cfe8",
            "6": "0e14cdfa43",
            "60": "2d35a0c169",
            "61": "9a9aec4fde",
            "62": "e289e8c4f5",
            "63": "2743931fda",
            "64": "7cb61e936c",
            "65": "c15b5f4621",
            "66": "dd334a63f0",
            "67": "ca22a03e1f",
            "68": "b629477983",
            "69": "bc6aa18741",
            "7": "479c29f0ce",
            "70": "925f96b1eb",
            "71": "be3f030390",
            "72": "469790fe80",
            "73": "d692c141cc",
            "74": "f2705d47b8",
            "75": "4e19d76791",
            "76": "9db6622023",
            "77": "95e91580eb",
            "78": "26b72f4f52",
            "79": "2e44e6838b",
            "8": "877e186e66",
            "80": "481c746a80",
            "81": "ac04c9cc18",
            "82": "1d94d3ee8d",
            "83": "a4985eff1e",
            "84": "0d9a4ef81c",
            "85": "fcf60bd0c5",
            "86": "770c64aa1b",
            "87": "aa1e66756f",
            "88": "2352dd8955",
            "89": "9685d731a7",
            "9": "2d6c49f415",
            "90": "4c5f01dac0",
            "91": "a47833cd1b",
            "92": "95a6e7bbc0",
            "93": "f06232c048",
            "94": "4961b96c34",
            "95": "6f48383753",
            "96": "96dfe83a8f",
            "97": "4eb041e98d",
            "98": "26d1a8e88e",
            "99": "6b8018084b",
          },
        }
      `);
    });

    test('100 -> cfcdb2b442', () => {
      const hash = 'cfcdb2b442';

      expect(Identity.fromHash(hash)).toBe(100);
      // objectHash is called 0 times because it's already been called 100 times
      // and therefore the cache contains the mapped values that we're looking for.
      expect(objectHash).toHaveBeenCalledTimes(0);
    });
  });
});

describe('Identity.isHash(...)', () => {
  test('input is a hash', () => {
    expect(Identity.isHash('6b8018084b')).toBe(true);
    expect(Identity.isHash('a47833cd1b')).toBe(true);
    expect(Identity.isHash('877e186e66')).toBe(true);
    expect(Identity.isHash('2d6c49f415')).toBe(true);
  });
  test('input is not a hash', () => {
    expect(Identity.isHash('1')).toBe(false);
    expect(Identity.isHash(1)).toBe(false);
    expect(Identity.isHash('6z8018084z')).toBe(false);
  });
});

describe('Identity.fromHashOrId(...)', () => {
  test('input is a hash', () => {
    expect(Identity.fromHashOrId('6b8018084b')).toBe(99);
    expect(Identity.fromHashOrId('a47833cd1b')).toBe(91);
    expect(Identity.fromHashOrId('877e186e66')).toBe(8);
    expect(Identity.fromHashOrId('2d6c49f415')).toBe(9);
  });
  test('input is not a hash', () => {
    expect(Identity.fromHashOrId('1')).toBe(1);
    expect(Identity.fromHashOrId(1)).toBe(1);
    expect(Identity.fromHashOrId('6z8018084z')).toBe(null);
  });
});
