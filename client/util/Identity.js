import objectHash from 'object-hash';

const rando = () => {
  let returnValue;
  while (
    (returnValue = Math.random()
      .toString(36)
      .slice(2))
  ) {
    /* istanbul ignore else */
    if (!/^\d/.test(returnValue)) {
      return returnValue.slice(0, 10);
    }
  }
};

let hashToIdMap = {};
let idToHashMap = {};
let k = 0;
let i = 1;

const updateMaps = n => {
  /* SESSION_SECRET is "embedded" by webpack */
  let h = objectHash({ n, SESSION_SECRET });
  hashToIdMap[h] = n;
  idToHashMap[n] = h;
};

const rishash = /^[0-9a-f]{40}$/i;

const Identity = {
  id() {
    return `${rando()}${i++}`;
  },
  key(...props) {
    return objectHash(props);
  },
  isHash(input) {
    return rishash.test(input);
  },
  fromHash(hash) {
    // intentional ==
    if (hash == null) {
      return null;
    }

    if (hashToIdMap[hash] || hashToIdMap[hash] === 0) {
      return hashToIdMap[hash];
    }

    while (!hashToIdMap[hash]) {
      updateMaps(k++);
    }

    return hashToIdMap[hash];
  },
  fromHashOrId(input) {
    if (!Identity.isHash(input)) {
      const id = Number(input);
      return Number.isNaN(id) ? null : id;
    }
    return Identity.fromHash(input);
  },
  toHash(id) {
    // intentional ==
    if (id == null) {
      return null;
    }

    if (idToHashMap[id]) {
      return idToHashMap[id];
    }

    while (!idToHashMap[id]) {
      updateMaps(k++);
    }

    return idToHashMap[id];
  },
  getMaps() {
    /* istanbul ignore else */
    if (process.env.JEST_WORKER_ID) {
      return {
        hashToIdMap,
        idToHashMap
      };
    }
  }
};

// test/util/Identity.test.js

export default Identity;
