import path from 'object-path';

export const Op = {
  $and: true,
  $or: true,
  $value: true,
  $between(a, b) {
    return a >= b[0] && a <= b[1];
  },
  $includes(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      return !a.filter(x => !b.includes(x)).length;
    }
    return a.includes(b);
  },
  $eq(a, b) {
    return a === b;
  },
  $gt(a, b) {
    return a > b;
  },
  $gte(a, b) {
    return a >= b;
  },
  $in(a, b) {
    if (Array.isArray(b) || typeof b === 'string') {
      return this.$includes(b, a);
    }

    if (typeof a === 'object' && a !== null) {
      return Object.entries(a).every(([key, value]) => b[key] === value);
    }

    return a in b;
  },
  $lt(a, b) {
    return a < b;
  },
  $lte(a, b) {
    return a <= b;
  },
  $ne(a, b) {
    return a !== b;
  },
  $notBetween(a, b) {
    return !this.$between(a, b);
  }
};

export const terms = [
  {
    def: 'Logical AND',
    description: 'Use this operation to chain two expressions. Both must evaluate to true for the condition to be met.',
    key: '$and',
    operator: '&&',
    op: 'expr1 && expr2',
  },
  {
    def: 'Logical OR',
    description: 'Use this operation to chain two expressions. One or the other must evaluate to true for the condition to be met. "expr1" is evaluated first, if it is false, then "expr2" is evaluated. If it is true, then the condition is met. If both expressions evaluate to false, then the condition is not met.',
    key: '$or',
    operator: '||',
    op: 'expr1 || expr2',
  },
  // {
  //   def: 'value is between two numbers a and b, inclusive',
  //   key: '$between',
  //   operator: '$between',
  //   op: '(between value a b)',
  // },
  // {
  //   def: 'String or array value a includes value b',
  //   key: '$includes',
  //   operator: '$includes',
  //   op: '(includes a b)',
  // },
  {
    def: 'X equals Y',
    description: 'Use this operation to determine if "X", which is the sum of affirmative responses from this agent, is equal to "Y", which is your comparison value.',
    key: '$eq',
    operator: '==',
    op: 'X == Y',
  },
  {
    def: 'X does not equal Y',
    description: 'Use this operation to determine if "X", which is the sum of affirmative responses from this agent, is not equal to "Y", which is your comparison value.',
    key: '$ne',
    operator: '!=',
    op: 'X != Y',
  },
  {
    def: 'X is greater than Y',
    description: 'Use this operation to determine if "X", which is the sum of affirmative responses from this agent, is greater than "Y", which is your comparison value.',
    key: '$gt',
    operator: '>',
    op: 'X > Y',
  },
  {
    def: 'X is greater than or equal to Y',
    description: 'Use this operation to determine if "X", which is the sum of affirmative responses from this agent, is greater than or equal to "Y", which is your comparison value.',
    key: '$gte',
    operator: '>=',
    op: 'X >= Y',
  },
  // {
  //   def: '',
  //   key: '$in',
  //   operator: '$in',
  //   op: '',
  // },
  {
    def: 'X is less than Y',
    description: 'Use this operation to determine if "X", which is the sum of affirmative responses from this agent, is less than "Y", which is your comparison value.',
    key: '$lt',
    operator: '<',
    op: 'X < Y',
  },
  {
    def: 'X is less than or equal to Y',
    description: 'Use this operation to determine if "X", which is the sum of affirmative responses from this agent, is less than or equal to "Y", which is your comparison value.',
    key: '$lte',
    operator: '<=',
    op: 'X <= Y',
  },
  // {
  //   def: '',
  //   key: '$notBetween',
  //   operator: '$notBetween',
  //   op: '',
  // },
];

const reconcileAndOr = (op, a, b) => {
  return op === '$and' ? a && b : a || b;
};

export default {
  terms,
  isLogicalOp(op) {
    return op === '$and' || op === '$or';
  },
  evaluate(data, where) {
    if (typeof where !== 'object') {
      return Boolean(where);
    }

    return Object.entries(where).reduce((accum, [key, query], index) => {
      if ((Op[key] && key === '$and') || key === '$or') {
        if (index === 0) {
          throw new Error(
            `Operator ${key} cannot appear in the leading position`
          );
        }
        return reconcileAndOr(key, accum, this.evaluate(data, query));
      }

      const aVal = path.get(data, key);
      const reducedResult = Object.entries(query).reduce(
        (accum, [op, expr]) => {
          const is$Value =
            !Array.isArray(expr) &&
            typeof expr === 'object' &&
            expr !== null &&
            '$value' in expr;
          const bVal = is$Value ? path.get(data, expr.$value) : expr;

          if (op === '$and' || op === '$or') {
            return reconcileAndOr(
              op,
              accum,
              this.evaluate(data, {
                [key]: expr
              })
            );
          } else {
            accum = bVal !== expr ? Op[op](bVal, aVal) : Op[op](aVal, bVal);
          }
          return accum;
        },
        false
      );
      return reducedResult;
    }, false);
  }
};
