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

test('Conditional.isLogicalOp()', () => {
  expect(Conditional.isLogicalOp('$and')).toBe(true);
  expect(Conditional.isLogicalOp('$or')).toBe(true);
  expect(Conditional.isLogicalOp('$between')).toBe(false);
  expect(Conditional.isLogicalOp('$includes')).toBe(false);
  expect(Conditional.isLogicalOp('$eq')).toBe(false);
  expect(Conditional.isLogicalOp('$gt')).toBe(false);
  expect(Conditional.isLogicalOp('$gte')).toBe(false);
  expect(Conditional.isLogicalOp('$in')).toBe(false);
  expect(Conditional.isLogicalOp('$lt')).toBe(false);
  expect(Conditional.isLogicalOp('$lte')).toBe(false);
  expect(Conditional.isLogicalOp('$ne')).toBe(false);
  expect(Conditional.isLogicalOp('$notBetween')).toBe(false);
});

test('Conditional.getTerm(key)', () => {
  expect(Conditional.getTerm('$and')).toMatchInlineSnapshot(`
    Object {
      "def": "Logical AND",
      "description": "Use this operation to chain two expressions. Both must evaluate to true for the condition to be met.",
      "key": "$and",
      "op": "left && right",
      "operator": "&&",
    }
  `);
  expect(Conditional.getTerm('$or')).toMatchInlineSnapshot(`
    Object {
      "def": "Logical OR",
      "description": "Use this operation to chain two expressions. One or the other must evaluate to true for the condition to be met. The \\"left\\" expression is evaluated first, if it is false, then the  \\"right\\" expression is evaluated. If it is true, then the condition is met. If both expressions evaluate to false, then the condition is not met.",
      "key": "$or",
      "op": "left || right",
      "operator": "||",
    }
  `);
  expect(Conditional.getTerm('$between')).toMatchInlineSnapshot(`undefined`);
  expect(Conditional.getTerm('$includes')).toMatchInlineSnapshot(`undefined`);
  expect(Conditional.getTerm('$eq')).toMatchInlineSnapshot(`
    Object {
      "def": "X equals Y",
      "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is equal to \\"Y\\", which is your comparison value.",
      "key": "$eq",
      "op": "X == Y",
      "operator": "==",
    }
  `);
  expect(Conditional.getTerm('$gt')).toMatchInlineSnapshot(`
    Object {
      "def": "X is greater than Y",
      "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is greater than \\"Y\\", which is your comparison value.",
      "key": "$gt",
      "op": "X > Y",
      "operator": ">",
    }
  `);
  expect(Conditional.getTerm('$gte')).toMatchInlineSnapshot(`
    Object {
      "def": "X is greater than or equal to Y",
      "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is greater than or equal to \\"Y\\", which is your comparison value.",
      "key": "$gte",
      "op": "X >= Y",
      "operator": ">=",
    }
  `);
  expect(Conditional.getTerm('$in')).toMatchInlineSnapshot(`undefined`);
  expect(Conditional.getTerm('$lt')).toMatchInlineSnapshot(`
    Object {
      "def": "X is less than Y",
      "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is less than \\"Y\\", which is your comparison value.",
      "key": "$lt",
      "op": "X < Y",
      "operator": "<",
    }
  `);
  expect(Conditional.getTerm('$lte')).toMatchInlineSnapshot(`
    Object {
      "def": "X is less than or equal to Y",
      "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is less than or equal to \\"Y\\", which is your comparison value.",
      "key": "$lte",
      "op": "X <= Y",
      "operator": "<=",
    }
  `);
  expect(Conditional.getTerm('$ne')).toMatchInlineSnapshot(`
    Object {
      "def": "X does not equal Y",
      "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is not equal to \\"Y\\", which is your comparison value.",
      "key": "$ne",
      "op": "X != Y",
      "operator": "!=",
    }
  `);
  expect(Conditional.getTerm('$notBetween')).toMatchInlineSnapshot(`undefined`);
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

test('Conditional.terms', () => {
  expect(Conditional.terms).toMatchInlineSnapshot(`
    Array [
      Object {
        "def": "Logical AND",
        "description": "Use this operation to chain two expressions. Both must evaluate to true for the condition to be met.",
        "key": "$and",
        "op": "left && right",
        "operator": "&&",
      },
      Object {
        "def": "Logical OR",
        "description": "Use this operation to chain two expressions. One or the other must evaluate to true for the condition to be met. The \\"left\\" expression is evaluated first, if it is false, then the  \\"right\\" expression is evaluated. If it is true, then the condition is met. If both expressions evaluate to false, then the condition is not met.",
        "key": "$or",
        "op": "left || right",
        "operator": "||",
      },
      Object {
        "def": "X equals Y",
        "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is equal to \\"Y\\", which is your comparison value.",
        "key": "$eq",
        "op": "X == Y",
        "operator": "==",
      },
      Object {
        "def": "X does not equal Y",
        "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is not equal to \\"Y\\", which is your comparison value.",
        "key": "$ne",
        "op": "X != Y",
        "operator": "!=",
      },
      Object {
        "def": "X is greater than Y",
        "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is greater than \\"Y\\", which is your comparison value.",
        "key": "$gt",
        "op": "X > Y",
        "operator": ">",
      },
      Object {
        "def": "X is greater than or equal to Y",
        "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is greater than or equal to \\"Y\\", which is your comparison value.",
        "key": "$gte",
        "op": "X >= Y",
        "operator": ">=",
      },
      Object {
        "def": "X is less than Y",
        "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is less than \\"Y\\", which is your comparison value.",
        "key": "$lt",
        "op": "X < Y",
        "operator": "<",
      },
      Object {
        "def": "X is less than or equal to Y",
        "description": "Use this operation to determine if \\"X\\", which is the sum of affirmative responses from this agent, is less than or equal to \\"Y\\", which is your comparison value.",
        "key": "$lte",
        "op": "X <= Y",
        "operator": "<=",
      },
    ]
  `);
});
