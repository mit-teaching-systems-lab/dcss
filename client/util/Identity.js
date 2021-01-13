import objectHash from 'object-hash';

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

let i = 1;

export function id() {
  return `${rando()}${i++}`;
}

export function key(...props) {
  return objectHash(...props);
}

let zeroHash = objectHash(0);
let hashToIdMap = {
  [zeroHash]: 0
};
let idToHashMap = {
  0: zeroHash
};
let k = 1;

function updateMaps(n) {
  let h = objectHash(n);
  hashToIdMap[h] = n;
  idToHashMap[n] = h;
}

export function fromHash(hash) {
  if (hashToIdMap[hash]) {
    return hashToIdMap[hash];
  }

  while (!hashToIdMap[hash]) {
    updateMaps(k);
    k++;
  }

  return hashToIdMap[hash];
}

export function toHash(id) {
  if (idToHashMap[id]) {
    return idToHashMap[id];
  }

  while (!idToHashMap[id]) {
    updateMaps(k);
    k++;
  }

  return idToHashMap[id];
}

export default {
  id,
  key,
  fromHash,
  toHash
};
