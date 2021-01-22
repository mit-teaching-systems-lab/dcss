import * as QS from 'query-string';

const defaultParseOptions = {
  arrayFormat: 'bracket',
  parseBooleans: true,
  parseNumbers: true,
  skipNull: true
};

function parse(input, options = defaultParseOptions) {
  return QS.parse(input, options);
}

const defaultStringifyOptions = {
  arrayFormat: 'bracket',
  skipNull: true
};

function stringify(keyVals, options = defaultStringifyOptions) {
  return QS.stringify(keyVals, options);
}

function mergedStringify(keyVals, options = defaultStringifyOptions) {
  const currentKeyVals = parse(window.location.search);
  const rawMerged = {
    ...currentKeyVals,
    ...keyVals
  };

  const merged = Object.entries(rawMerged).reduce((accum, [key, value]) => {
    if (!value) {
      return accum;
    }

    if (Array.isArray(value) && !value.length) {
      return accum;
    }

    accum[key] = value;

    return accum;
  }, {});

  return QS.stringify(merged, options);
}

export default {
  mergedStringify,
  parse,
  stringify
};
