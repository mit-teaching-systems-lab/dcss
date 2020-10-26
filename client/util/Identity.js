import hash from 'object-hash';

let increment = 1;

const rando = () => {
  let returnValue;
  while (
    (returnValue = Math.random()
      .toString(36)
      .slice(2))
  ) {
    if (!/^\d/.test(returnValue)) {
      return returnValue;
    }
  }
};

export function key(...props) {
  return hash(...props);
}

export function id() {
  return `${rando()}${increment++}`;
}

export default {
  id,
  key
};
