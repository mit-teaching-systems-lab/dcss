let prefix = 'id';
let counter = 0;

export default function nextKey(oneShotPrefix = '') {
  counter++;
  return `${oneShotPrefix || prefix}${counter}`;
}

export function resetKeys() {
  counter = 0;
}

export function setKeyPrefix(newPrefix) {
  prefix = newPrefix;
}
