let increment = 1;

const rando = () => {
  let returnValue;
  while (returnValue = Math.random().toString(36).slice(2)) {
    if (!/^\d/.test(returnValue)) {
      return returnValue;
    }
  }
};

export default function() {
  return `${rando()}${increment++}`;
}
