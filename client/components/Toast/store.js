class Store {
  items = [];
  subscribers = [];

  subscribe(cb) {
    this.subscribers.push(cb);
  }

  unsubscribe(cb) {
    this.subscribers = this.subscribers.filter(subscriber =>
      subscriber !== cb ? subscriber : undefined
    );
  }

  notify() {
    this.subscribers.forEach(subscriber => subscriber(this.items));
  }

  add(item) {
    this.items.push(item);
    this.notify();
  }

  clear() {
    this.items.length = 0;
    this.notify();
  }

  remove(item) {
    this.items = this.items.filter(storeItem =>
      storeItem !== item ? storeItem : undefined
    );
    this.notify();
  }

  get data() {
    return this.items;
  }
}

export default Store;
