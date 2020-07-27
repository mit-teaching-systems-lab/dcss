import hash from 'object-hash';

let increment = 1;

const rando = (...props) => {
  if (props) {
    if (props.length === 1) {
      return hash(props);
    }
    return hash({ ...props });
  }

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
  return `${rando(...props)}${increment++}`;
}

export function id() {
  return `${rando()}${increment++}`;
}

export default {
  id,
  key
};
