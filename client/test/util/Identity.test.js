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
      expect(Identity.toHash(0)).toMatchInlineSnapshot(
        `"e766cee69a1f6f439fa11fece638415a38762ee4"`
      );
      expect(Identity.fromHash(Identity.toHash(0))).toBe(0);
      expect(objectHash).toHaveBeenCalledTimes(1);

      expect(Identity.toHash(1)).toMatchInlineSnapshot(
        `"c5de82e702883b81afc273a1e893555540f8ed03"`
      );
      expect(Identity.fromHash(Identity.toHash(1))).toBe(1);
      expect(objectHash).toHaveBeenCalledTimes(2);
    });

    test('hash -> id -> hash', () => {
      const zeroHash = 'e766cee69a1f6f439fa11fece638415a38762ee4';

      expect(Identity.fromHash(zeroHash)).toBe(0);
      expect(Identity.toHash(Identity.fromHash(zeroHash))).toBe(zeroHash);
      expect(objectHash).toHaveBeenCalledTimes(0);

      const oneHash = 'c5de82e702883b81afc273a1e893555540f8ed03';
      expect(Identity.fromHash(oneHash)).toBe(1);
      expect(Identity.toHash(Identity.fromHash(oneHash))).toBe(oneHash);
      expect(objectHash).toHaveBeenCalledTimes(0);
    });

    test('cfcdb2b44211317315e46aa4b37af5544a23b55a -> 100', () => {
      const hash = 'cfcdb2b44211317315e46aa4b37af5544a23b55a';

      expect(Identity.fromHash(hash)).toBe(100);
      expect(objectHash).toHaveBeenCalledTimes(99);

      expect(Identity.getMaps()).toMatchInlineSnapshot(`
        Object {
          "hashToIdMap": Object {
            "00038e783512c2fc6b58386a2f48eab365d3c819": 53,
            "0b39963c5be2b0083b449e634310c3d7262b113e": 46,
            "0d9a4ef81c47fe8585ecf748492d857e0ff6dea2": 84,
            "0e14cdfa434611c5d0d203ac736c0192153c528c": 6,
            "0e1858e79e7ee3cfb3db6a240a0d4de786024a2f": 26,
            "0f507008cf94cb77698dbf729a6c68660e476d4a": 11,
            "123c18b8f3c07975804e5bc882f6717f84396f8b": 36,
            "1477b7f652548c66372bd60f25a62aaf244b59b9": 25,
            "1d94d3ee8d8c6c3d8e0926627fac889fab99387c": 82,
            "1f75bd70070ced584256b4cee6c82f76fde35b85": 4,
            "217a8e891a0345c2353a44b90b0e48105b4b2434": 32,
            "2352dd8955170ca40e75ad353cf35c0422420e13": 88,
            "26b72f4f52d97a077b01b202fe7da3f11a349b03": 78,
            "26d1a8e88e312fe155f135a51bf4ffd6fc6a625b": 98,
            "2743931fda6a365c516c8ebfc9d543ced3d35b07": 63,
            "28d5d9f5a79af4e7471558293b31347539627f1d": 16,
            "2c3d14ec147f8922c515ca384d667ede311275b1": 21,
            "2d35a0c16970c8d73bb91b57eb8a0d07c24357f3": 60,
            "2d6c49f415d20916f13d2d59876b4f74d55723f9": 9,
            "2e44e6838bf9d6d971a83d2674982e48730a823b": 79,
            "30ccb2a2669faa4c4f45eee74dcbee633b891ded": 51,
            "30df7f341217c24ea7a14bb7f4c884d586367cb2": 54,
            "31fc299746ac2feac776d6931cfbb0f9899c08c5": 33,
            "33379f8e90ad4e2262f7ff320e04fc73e599b65f": 13,
            "34b313094e5c582a6d07d6920c9d3e6742dee5f6": 43,
            "3a8d95a033c08437e24da6138bbf8565bf74d685": 2,
            "3eb3d3ed49ebb1a77591188add9dfe5d5e1ad685": 22,
            "42db91b808213e3bb79579628ea1130bb868765d": 37,
            "469790fe80da3d349f1a1801ebebb07b8c934e4f": 72,
            "479c29f0ce19e64b498c0703b8327f7170bff50d": 7,
            "481c746a8028a2148727ef8aa6577619853e7f3a": 80,
            "4961b96c343b23c69dd95c50d1cb1bf5f2a9336f": 94,
            "49635ab22e09522e90149be14bb422d23ceb8430": 49,
            "4c5f01dac0bf8ee0e3c46b7fad398205c1b4179b": 90,
            "4e19d7679122bbab6bb25367fbc6ecf1c163d9ee": 75,
            "4eb041e98d8f5364b368478ed15aa2992aa44e82": 97,
            "4ecfbe955f595cb0bd781343f89a92b9bf86482a": 28,
            "58b384524ad149f5a81b2bc9821a10ad7fb0ed4b": 41,
            "5e8ee9d0e48a8f83374db590de546dd0454dcd90": 48,
            "5fdab3bbcd69d76d07240fa441ced6912ad3b552": 58,
            "60d70b942574762e5d4f968be3dc3b6ec3ef4a02": 24,
            "651c9059ea5afe3852ced6642daa00f344423786": 45,
            "66bbe2607a30a2b875e5a2f636c6cda16c9fc253": 19,
            "6b8018084bfdad95e30bf5aab95c5e50200018f8": 99,
            "6caf53f291d3e5e898ca05f53ad9f9ff61ee7ef9": 57,
            "6d25c027f3b071294513087656e9fdcd6287167e": 35,
            "6f48383753b5dbf7cb7f0de3d1e3103da01a5bfc": 95,
            "770c64aa1b489f63ca011124e4dab4b9d449e3e7": 86,
            "7bcc8d3307611fbf5d8c80db029bb3a33096592f": 30,
            "7c9eab7496b00fb5e13e5d7f9f19fc0e016998da": 55,
            "7cb61e936c0ffd0035e666a1d9501085fa503b90": 64,
            "7fbaee9bcaba4bd8936824152474ececc44aff65": 3,
            "800850c50595a067e0034ecaa7c0a7dfb6c0a4b1": 44,
            "877e186e66662fdddfb7c8871646a841bb0554c9": 8,
            "88d4e0cfe8d6265e0c2ce8ba23067ab3f81160b6": 59,
            "925f96b1eb473692538afbab3b5855c55a82635b": 70,
            "95a6e7bbc0f35f1839af3e6437fa498fee31c136": 92,
            "95e91580ebc44795c7e33189cd3675b100238622": 77,
            "9685d731a786db16efc78e7f82e99e963f28892b": 89,
            "96dfe83a8f92e255175a783f8dddf0cf81eea680": 96,
            "9a54f0cea75b0db92a3339d159ad7000b03b74da": 10,
            "9a9aec4fde0665727eb67211a7392c37eca65848": 61,
            "9db6622023653ab8224865749394ae6eb127afe5": 76,
            "9dc344944c44718196b40a6bd976c17d7f6ee6d3": 29,
            "a016279dad36c1b5b052022d1d87411f423904e8": 47,
            "a47833cd1b22887a8e23a3c3ac01540238d9a1c8": 91,
            "a4985eff1e7f193c161d45f418d9092e39ae18d5": 83,
            "aa1e66756fe89281c82792e5eee2c7a120c1de9f": 87,
            "ac04c9cc18b02d6c9b52962d2ccedb4fb0aa5747": 81,
            "b40e38796ced98ca5c575a8c231a393639df911e": 23,
            "b62947798332d8ace8b8122d0aaf7568530049f0": 68,
            "b8fd62c1b503d5e894c9cb3be0a8aafa3b3238ab": 34,
            "bc6aa1874141397f7c9796be2a9c8896061b45db": 69,
            "bdef65a56984a18c1d259c28057336a6394ee843": 12,
            "be3f030390e15057f5e0c03577f62ba52738d472": 71,
            "c15b5f46213ed021a3fd5924740aa6d4ce6af8c0": 65,
            "c5de82e702883b81afc273a1e893555540f8ed03": 1,
            "c90860f95395d052d14fa2e706c25ac08536a42c": 18,
            "c9e990f9e14eb5edbff605977376a03b22e0a8dc": 31,
            "c9f81392b0c87c46b0a16f08406748601b1576ca": 5,
            "ca22a03e1f56fe1300d65f8534af7b6367862207": 67,
            "cc78c21590da17b2171e2f279c549edbbe7af299": 14,
            "cfa062e43a61724f0922ec3b1f84feccb20b65cc": 27,
            "cfcdb2b44211317315e46aa4b37af5544a23b55a": 100,
            "d692c141cc294a7aa3b5e4e12e92e772b5e254c6": 73,
            "dd334a63f0f916597ca0b15b7d9dcb6e30cdbd13": 66,
            "e020ab46fabe9e565304aec54ff444205233879f": 17,
            "e289e8c4f5d494574b2cbf07426c755b35bf4b1d": 62,
            "e3074544c373c82a54214b101840f2623702150c": 42,
            "e378bfa6a7c585b240b22a2f811f9f840e5f0b13": 38,
            "e766cee69a1f6f439fa11fece638415a38762ee4": 0,
            "edff14fa540658f0ffad583f42c9f082d86e0c88": 39,
            "f06232c048d967a8d4525dc3ec51b501d2eafa44": 93,
            "f2705d47b894ed0b156070988a1fe72cda5d3139": 74,
            "f6c8f0bd01b41d02350485d57056a47a9a92f5a9": 15,
            "f7b37e96bb9a78bca39d39d14e939906c97f6369": 20,
            "f818f953dc1fe23626acc5043e664be2b93122df": 40,
            "fcf60bd0c5c6625b0fb05d5457e33c1cfde2a7d6": 85,
            "fd932d2a15e22dd4789a165a4646756f21eb4d3a": 52,
            "fe756d455099768c0ca6e93dfb294bf05a141c8f": 50,
            "ffafe72dfd18622491f10738ed0289cb22bba0eb": 56,
          },
          "idToHashMap": Object {
            "0": "e766cee69a1f6f439fa11fece638415a38762ee4",
            "1": "c5de82e702883b81afc273a1e893555540f8ed03",
            "10": "9a54f0cea75b0db92a3339d159ad7000b03b74da",
            "100": "cfcdb2b44211317315e46aa4b37af5544a23b55a",
            "11": "0f507008cf94cb77698dbf729a6c68660e476d4a",
            "12": "bdef65a56984a18c1d259c28057336a6394ee843",
            "13": "33379f8e90ad4e2262f7ff320e04fc73e599b65f",
            "14": "cc78c21590da17b2171e2f279c549edbbe7af299",
            "15": "f6c8f0bd01b41d02350485d57056a47a9a92f5a9",
            "16": "28d5d9f5a79af4e7471558293b31347539627f1d",
            "17": "e020ab46fabe9e565304aec54ff444205233879f",
            "18": "c90860f95395d052d14fa2e706c25ac08536a42c",
            "19": "66bbe2607a30a2b875e5a2f636c6cda16c9fc253",
            "2": "3a8d95a033c08437e24da6138bbf8565bf74d685",
            "20": "f7b37e96bb9a78bca39d39d14e939906c97f6369",
            "21": "2c3d14ec147f8922c515ca384d667ede311275b1",
            "22": "3eb3d3ed49ebb1a77591188add9dfe5d5e1ad685",
            "23": "b40e38796ced98ca5c575a8c231a393639df911e",
            "24": "60d70b942574762e5d4f968be3dc3b6ec3ef4a02",
            "25": "1477b7f652548c66372bd60f25a62aaf244b59b9",
            "26": "0e1858e79e7ee3cfb3db6a240a0d4de786024a2f",
            "27": "cfa062e43a61724f0922ec3b1f84feccb20b65cc",
            "28": "4ecfbe955f595cb0bd781343f89a92b9bf86482a",
            "29": "9dc344944c44718196b40a6bd976c17d7f6ee6d3",
            "3": "7fbaee9bcaba4bd8936824152474ececc44aff65",
            "30": "7bcc8d3307611fbf5d8c80db029bb3a33096592f",
            "31": "c9e990f9e14eb5edbff605977376a03b22e0a8dc",
            "32": "217a8e891a0345c2353a44b90b0e48105b4b2434",
            "33": "31fc299746ac2feac776d6931cfbb0f9899c08c5",
            "34": "b8fd62c1b503d5e894c9cb3be0a8aafa3b3238ab",
            "35": "6d25c027f3b071294513087656e9fdcd6287167e",
            "36": "123c18b8f3c07975804e5bc882f6717f84396f8b",
            "37": "42db91b808213e3bb79579628ea1130bb868765d",
            "38": "e378bfa6a7c585b240b22a2f811f9f840e5f0b13",
            "39": "edff14fa540658f0ffad583f42c9f082d86e0c88",
            "4": "1f75bd70070ced584256b4cee6c82f76fde35b85",
            "40": "f818f953dc1fe23626acc5043e664be2b93122df",
            "41": "58b384524ad149f5a81b2bc9821a10ad7fb0ed4b",
            "42": "e3074544c373c82a54214b101840f2623702150c",
            "43": "34b313094e5c582a6d07d6920c9d3e6742dee5f6",
            "44": "800850c50595a067e0034ecaa7c0a7dfb6c0a4b1",
            "45": "651c9059ea5afe3852ced6642daa00f344423786",
            "46": "0b39963c5be2b0083b449e634310c3d7262b113e",
            "47": "a016279dad36c1b5b052022d1d87411f423904e8",
            "48": "5e8ee9d0e48a8f83374db590de546dd0454dcd90",
            "49": "49635ab22e09522e90149be14bb422d23ceb8430",
            "5": "c9f81392b0c87c46b0a16f08406748601b1576ca",
            "50": "fe756d455099768c0ca6e93dfb294bf05a141c8f",
            "51": "30ccb2a2669faa4c4f45eee74dcbee633b891ded",
            "52": "fd932d2a15e22dd4789a165a4646756f21eb4d3a",
            "53": "00038e783512c2fc6b58386a2f48eab365d3c819",
            "54": "30df7f341217c24ea7a14bb7f4c884d586367cb2",
            "55": "7c9eab7496b00fb5e13e5d7f9f19fc0e016998da",
            "56": "ffafe72dfd18622491f10738ed0289cb22bba0eb",
            "57": "6caf53f291d3e5e898ca05f53ad9f9ff61ee7ef9",
            "58": "5fdab3bbcd69d76d07240fa441ced6912ad3b552",
            "59": "88d4e0cfe8d6265e0c2ce8ba23067ab3f81160b6",
            "6": "0e14cdfa434611c5d0d203ac736c0192153c528c",
            "60": "2d35a0c16970c8d73bb91b57eb8a0d07c24357f3",
            "61": "9a9aec4fde0665727eb67211a7392c37eca65848",
            "62": "e289e8c4f5d494574b2cbf07426c755b35bf4b1d",
            "63": "2743931fda6a365c516c8ebfc9d543ced3d35b07",
            "64": "7cb61e936c0ffd0035e666a1d9501085fa503b90",
            "65": "c15b5f46213ed021a3fd5924740aa6d4ce6af8c0",
            "66": "dd334a63f0f916597ca0b15b7d9dcb6e30cdbd13",
            "67": "ca22a03e1f56fe1300d65f8534af7b6367862207",
            "68": "b62947798332d8ace8b8122d0aaf7568530049f0",
            "69": "bc6aa1874141397f7c9796be2a9c8896061b45db",
            "7": "479c29f0ce19e64b498c0703b8327f7170bff50d",
            "70": "925f96b1eb473692538afbab3b5855c55a82635b",
            "71": "be3f030390e15057f5e0c03577f62ba52738d472",
            "72": "469790fe80da3d349f1a1801ebebb07b8c934e4f",
            "73": "d692c141cc294a7aa3b5e4e12e92e772b5e254c6",
            "74": "f2705d47b894ed0b156070988a1fe72cda5d3139",
            "75": "4e19d7679122bbab6bb25367fbc6ecf1c163d9ee",
            "76": "9db6622023653ab8224865749394ae6eb127afe5",
            "77": "95e91580ebc44795c7e33189cd3675b100238622",
            "78": "26b72f4f52d97a077b01b202fe7da3f11a349b03",
            "79": "2e44e6838bf9d6d971a83d2674982e48730a823b",
            "8": "877e186e66662fdddfb7c8871646a841bb0554c9",
            "80": "481c746a8028a2148727ef8aa6577619853e7f3a",
            "81": "ac04c9cc18b02d6c9b52962d2ccedb4fb0aa5747",
            "82": "1d94d3ee8d8c6c3d8e0926627fac889fab99387c",
            "83": "a4985eff1e7f193c161d45f418d9092e39ae18d5",
            "84": "0d9a4ef81c47fe8585ecf748492d857e0ff6dea2",
            "85": "fcf60bd0c5c6625b0fb05d5457e33c1cfde2a7d6",
            "86": "770c64aa1b489f63ca011124e4dab4b9d449e3e7",
            "87": "aa1e66756fe89281c82792e5eee2c7a120c1de9f",
            "88": "2352dd8955170ca40e75ad353cf35c0422420e13",
            "89": "9685d731a786db16efc78e7f82e99e963f28892b",
            "9": "2d6c49f415d20916f13d2d59876b4f74d55723f9",
            "90": "4c5f01dac0bf8ee0e3c46b7fad398205c1b4179b",
            "91": "a47833cd1b22887a8e23a3c3ac01540238d9a1c8",
            "92": "95a6e7bbc0f35f1839af3e6437fa498fee31c136",
            "93": "f06232c048d967a8d4525dc3ec51b501d2eafa44",
            "94": "4961b96c343b23c69dd95c50d1cb1bf5f2a9336f",
            "95": "6f48383753b5dbf7cb7f0de3d1e3103da01a5bfc",
            "96": "96dfe83a8f92e255175a783f8dddf0cf81eea680",
            "97": "4eb041e98d8f5364b368478ed15aa2992aa44e82",
            "98": "26d1a8e88e312fe155f135a51bf4ffd6fc6a625b",
            "99": "6b8018084bfdad95e30bf5aab95c5e50200018f8",
          },
        }
      `);
    });

    test('100 -> cfcdb2b44211317315e46aa4b37af5544a23b55a', () => {
      const hash = 'cfcdb2b44211317315e46aa4b37af5544a23b55a';

      expect(Identity.fromHash(hash)).toBe(100);
      // objectHash is called 0 times because it's already been called 100 times
      // and therefore the cache contains the mapped values that we're looking for.
      expect(objectHash).toHaveBeenCalledTimes(0);
    });
  });
});

describe('Identity.isHash(...)', () => {
  test('input is a hash', () => {
    expect(Identity.isHash('6b8018084bfdad95e30bf5aab95c5e50200018f8')).toBe(true);
    expect(Identity.isHash('a47833cd1b22887a8e23a3c3ac01540238d9a1c8')).toBe(true);
    expect(Identity.isHash('877e186e66662fdddfb7c8871646a841bb0554c9')).toBe(true);
    expect(Identity.isHash('2d6c49f415d20916f13d2d59876b4f74d55723f9')).toBe(true);
  });
  test('input is not a hash', () => {
    expect(Identity.isHash('1')).toBe(false);
    expect(Identity.isHash(1)).toBe(false);
    expect(Identity.isHash('6z8018084zfdad95e30zf5aaz95c5e50200018f8')).toBe(false);
  });
});

describe('Identity.fromHashOrId(...)', () => {
  test('input is a hash', () => {
    expect(Identity.fromHashOrId('6b8018084bfdad95e30bf5aab95c5e50200018f8')).toBe(99);
    expect(Identity.fromHashOrId('a47833cd1b22887a8e23a3c3ac01540238d9a1c8')).toBe(91);
    expect(Identity.fromHashOrId('877e186e66662fdddfb7c8871646a841bb0554c9')).toBe(8);
    expect(Identity.fromHashOrId('2d6c49f415d20916f13d2d59876b4f74d55723f9')).toBe(9);
  });
  test('input is not a hash', () => {
    expect(Identity.fromHashOrId('1')).toBe(1);
    expect(Identity.fromHashOrId(1)).toBe(1);
    expect(Identity.fromHashOrId('6z8018084zfdad95e30zf5aaz95c5e50200018f8')).toBe(null);
  });
});
