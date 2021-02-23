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

const reconcileAndOr = (op, a, b) => {
  return op === '$and' ? a && b : a || b;
};

export default {
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
