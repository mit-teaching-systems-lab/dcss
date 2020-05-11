import hash from 'object-hash';
import { toast } from 'react-semantic-toasts';

const cache = new Set();

export default function notify({
  icon = '',
  message = '',
  size = 'tiny',
  time = 2000,
  type = 'info'
}) {
  const description = message;
  const props = {
    description,
    icon,
    size,
    time,
    type
  };
  const key = hash(props);

  if (!cache.has(key)) {
    cache.add(key);
    toast(props, () => {
      cache.delete(key);
    });
  }
}
