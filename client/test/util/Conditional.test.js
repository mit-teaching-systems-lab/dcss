import * as OP from 'object-path';
jest.mock('object-path', () => {
  const actual = jest.requireActual('object-path');
  return {
    get: jest.fn((...args) => actual.get(...args))
  };
});

import Conditional from '@utils/Conditional';

test('Conditional.evaluate(data, boolean)', () => {
  expect(Conditional.evaluate({}, true)).toBe(true);
  expect(Conditional.evaluate({}, false)).toBe(false);
});

[
  {
    where: {
      timer: {
        $eq: 0
      }
    },
    data: {
      timer: 0
    },
    expected: true
  },
  {
    where: {
      timer: {
        $gt: 0,
        $and: {
          $lt: 100
        }
      }
    },
    data: {
      timer: 5
    },
    expected: true
  },
  {
    where: {
      timer: {
        $lt: 10,
        $or: {
          $gt: 20
        }
      }
    },
    data: {
      timer: 9
    },
    expected: true
  },
  {
    where: {
      timer: {
        $lt: 10,
        $or: {
          $gt: 20
        }
      }
    },
    data: {
      timer: 21
    },
    expected: true
  },
  {
    where: {
      timer: {
        $lt: 10,
        $or: {
          $gt: 20
        },
        $and: {
          $ne: 22
        }
      }
    },
    data: {
      timer: 21
    },
    expected: true
  },
  {
    where: {
      'foo.timer': {
        $lt: 10,
        $or: {
          $gt: 20
        },
        $and: {
          $ne: 22
        }
      }
    },
    data: {
      foo: {
        timer: 21
      }
    },
    expected: true
  },
  {
    where: {
      'foo.timer': {
        $lt: 10,
        $or: {
          $gt: 20
        },
        $and: {
          $ne: 22
        }
      },
      $or: {
        'bar.timer': {
          $eq: 99
        }
      }
    },
    data: {
      foo: {
        timer: 21
      },
      bar: {
        timer: 99
      }
    },
    expected: true
  },
  {
    where: {
      foo: {
        $between: [0, 2]
      },
      bar: {
        $notBetween: [0, 2]
      }
    },
    data: {
      foo: 1,
      bar: 10
    },
    expected: true
  },
  {
    where: {
      bar: {
        $includes: {
          $value: 'foo'
        }
      }
    },
    data: {
      foo: [1, 2],
      bar: [0, 1, 2, 3]
    },
    expected: true
  },
  {
    where: {
      foo: {
        $in: {
          $value: 'bar'
        }
      }
    },
    data: {
      foo: [1, 2],
      bar: [0, 1, 2, 3]
    },
    expected: true
  },
  {
    where: {
      foo: {
        $includes: 1
      }
    },
    data: {
      foo: [1, 2]
    },
    expected: true
  },
  {
    where: {
      foo: {
        $in: {
          x: 1,
          y: 2
        }
      }
    },
    data: {
      foo: 'x'
    },
    expected: true
  },
  {
    where: {
      foo: {
        $in: {
          x: 1,
          y: 2
        }
      }
    },
    data: {
      foo: {
        x: 1
      }
    },
    expected: true
  }
].forEach(({ where, data, expected }) => {
  test(`Conditional.evaluate(${JSON.stringify(data)}, ${JSON.stringify(
    where
  )}) === ${expected}`, () => {
    expect(Conditional.evaluate(data, where)).toBe(expected);
  });
});

test('Conditional.evaluate, $and in leading position is invalid', () => {
  expect(() => {
    Conditional.evaluate(
      {},
      {
        $and: {}
      }
    );
  }).toThrow();
});

test('Conditional.evaluate, $or in leading position is invalid', () => {
  expect(() => {
    Conditional.evaluate(
      {},
      {
        $or: {}
      }
    );
  }).toThrow();
});
