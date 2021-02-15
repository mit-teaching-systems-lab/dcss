import Store from './store';

const store = new Store();
let id = 0;

function notifier(item, onClose, onClick, onDismiss) {
  id += 1;
  store.add({ id, onClose, onClick, onDismiss, ...item });
}

export { notifier, store };
