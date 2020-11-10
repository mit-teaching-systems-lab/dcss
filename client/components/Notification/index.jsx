import Identity from '@utils/Identity';
import {
  SemanticToastContainer as Notification,
  toast
} from 'react-semantic-toasts';
import './Notification.css';

// TODO: Wrap this in a functional component that
//       initiates a socket connection to /api/notifications
export default Notification;

const cache = new Set();

export function notify({
  color,
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

  if (color) {
    props.color = color;
    props.type = undefined;
  }

  if (type === 'warn') {
    props.color = 'orange';
    props.type = undefined;
  }

  const key = Identity.key(props);

  if (!cache.has(key)) {
    cache.add(key);
    toast(props, () => {
      cache.delete(key);
    });
  }
}
