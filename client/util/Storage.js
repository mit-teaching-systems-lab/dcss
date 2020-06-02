import storage from 'local-storage-fallback';

const Storage = {
  clear() {
    storage.clear();
  },
  delete(key) {
    return storage.removeItem(key);
  },
  get(key, defaults) {
    let persisted = JSON.parse(storage.getItem(key));

    if (!persisted && defaults) {
      Storage.set(key, defaults);
      persisted = defaults;
    }
    return persisted;
  },
  has(key) {
    return storage[key] !== undefined;
  },
  merge(key, dataOrFn) {
    let persisted = Storage.get(key, {});
    if (typeof dataOrFn === 'function') {
      return Storage.set(key, dataOrFn(persisted));
    } else {
      return Storage.set(key, {
        ...persisted,
        ...dataOrFn
      });
    }
  },
  set(key, data) {
    storage.setItem(key, JSON.stringify(data));
    return data;
  }
};

export default Storage;
