import * as QS from 'query-string';
jest.mock('query-string', () => {
  const actual = jest.requireActual('query-string');
  return {
    parse: jest.fn((...args) => actual.parse(...args)),
    stringify: jest.fn((...args) => actual.stringify(...args))
  };
});

import QueryString from '@utils/QueryString';

describe('QueryString.parse', () => {
  test('default options', () => {
    expect(QueryString.parse('?a=1&b[]=1&b[]=2')).toMatchInlineSnapshot(`
      Object {
        "a": 1,
        "b": Array [
          1,
          2,
        ],
      }
    `);
    expect(QS.parse).toHaveBeenCalledTimes(1);
    expect(QS.parse.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "?a=1&b[]=1&b[]=2",
          Object {
            "arrayFormat": "bracket",
            "parseBooleans": true,
            "parseNumbers": true,
            "skipNull": true,
          },
        ],
      ]
    `);
  });
});

describe('QueryString.mergedStringify', () => {
  test('default options', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(
      QueryString.mergedStringify({ x: 1, y: [1, 2, 3] })
    ).toMatchInlineSnapshot(`"a=1&b[]=1&b[]=2&x=1&y[]=1&y[]=2&y[]=3"`);

    expect(QS.parse).toHaveBeenCalledTimes(1);
    expect(QS.parse.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "?a=1&b[]=1&b[]=2",
          Object {
            "arrayFormat": "bracket",
            "parseBooleans": true,
            "parseNumbers": true,
            "skipNull": true,
          },
        ],
      ]
    `);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "a": 1,
            "b": Array [
              1,
              2,
            ],
            "x": 1,
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });

  test('array is empty', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(QueryString.mergedStringify({ x: 2, y: [] })).toMatchInlineSnapshot(
      `"a=1&b[]=1&b[]=2&x=2"`
    );
    expect(QS.parse).toHaveBeenCalledTimes(1);
    expect(QS.parse.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "?a=1&b[]=1&b[]=2",
          Object {
            "arrayFormat": "bracket",
            "parseBooleans": true,
            "parseNumbers": true,
            "skipNull": true,
          },
        ],
      ]
    `);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "a": 1,
            "b": Array [
              1,
              2,
            ],
            "x": 2,
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });

  test('value is undefined', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(
      QueryString.mergedStringify({ x: undefined, y: [1, 2, 3] })
    ).toMatchInlineSnapshot(`"a=1&b[]=1&b[]=2&y[]=1&y[]=2&y[]=3"`);
    expect(QS.parse).toHaveBeenCalledTimes(1);
    expect(QS.parse.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "?a=1&b[]=1&b[]=2",
          Object {
            "arrayFormat": "bracket",
            "parseBooleans": true,
            "parseNumbers": true,
            "skipNull": true,
          },
        ],
      ]
    `);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "a": 1,
            "b": Array [
              1,
              2,
            ],
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });

  test('value is null', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(
      QueryString.mergedStringify({ x: null, y: [1, 2, 3] })
    ).toMatchInlineSnapshot(`"a=1&b[]=1&b[]=2&y[]=1&y[]=2&y[]=3"`);
    expect(QS.parse).toHaveBeenCalledTimes(1);
    expect(QS.parse.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "?a=1&b[]=1&b[]=2",
          Object {
            "arrayFormat": "bracket",
            "parseBooleans": true,
            "parseNumbers": true,
            "skipNull": true,
          },
        ],
      ]
    `);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "a": 1,
            "b": Array [
              1,
              2,
            ],
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });

  test('value is empty string', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(
      QueryString.mergedStringify({ x: '', y: [1, 2, 3] })
    ).toMatchInlineSnapshot(`"a=1&b[]=1&b[]=2&y[]=1&y[]=2&y[]=3"`);
    expect(QS.parse).toHaveBeenCalledTimes(1);
    expect(QS.parse.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "?a=1&b[]=1&b[]=2",
          Object {
            "arrayFormat": "bracket",
            "parseBooleans": true,
            "parseNumbers": true,
            "skipNull": true,
          },
        ],
      ]
    `);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "a": 1,
            "b": Array [
              1,
              2,
            ],
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });

  test('value is string', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(
      QueryString.mergedStringify({ x: 'x', y: [1, 2, 3] })
    ).toMatchInlineSnapshot(`"a=1&b[]=1&b[]=2&x=x&y[]=1&y[]=2&y[]=3"`);
    expect(QS.parse).toHaveBeenCalledTimes(1);
    expect(QS.parse.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "?a=1&b[]=1&b[]=2",
          Object {
            "arrayFormat": "bracket",
            "parseBooleans": true,
            "parseNumbers": true,
            "skipNull": true,
          },
        ],
      ]
    `);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "a": 1,
            "b": Array [
              1,
              2,
            ],
            "x": "x",
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });
});

describe('QueryString.stringify', () => {
  test('default options', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(QueryString.stringify({ x: 1, y: [1, 2, 3] })).toMatchInlineSnapshot(
      `"x=1&y[]=1&y[]=2&y[]=3"`
    );
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "x": 1,
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });

  test('value is undefined', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(
      QueryString.stringify({ x: undefined, y: [1, 2, 3] })
    ).toMatchInlineSnapshot(`"y[]=1&y[]=2&y[]=3"`);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "x": undefined,
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });

  test('value is null', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(
      QueryString.stringify({ x: null, y: [1, 2, 3] })
    ).toMatchInlineSnapshot(`"y[]=1&y[]=2&y[]=3"`);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "x": null,
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });

  test('value is empty string', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(
      QueryString.stringify({ x: '', y: [1, 2, 3] })
    ).toMatchInlineSnapshot(`"x=&y[]=1&y[]=2&y[]=3"`);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "x": "",
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });

  test('value is string', () => {
    delete window.location;
    // eslint-disable-next-line
    window.location = {
      search: '?a=1&b[]=1&b[]=2'
    };

    expect(
      QueryString.stringify({ x: 'x', y: [1, 2, 3] })
    ).toMatchInlineSnapshot(`"x=x&y[]=1&y[]=2&y[]=3"`);
    expect(QS.stringify).toHaveBeenCalledTimes(1);
    expect(QS.stringify.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "x": "x",
            "y": Array [
              1,
              2,
              3,
            ],
          },
          Object {
            "arrayFormat": "bracket",
            "skipNull": true,
          },
        ],
      ]
    `);
  });
});
