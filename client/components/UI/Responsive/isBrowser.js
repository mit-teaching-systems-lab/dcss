// From semantic-ui-react@1.3.1

const hasDocument = typeof document === 'object' && document !== null;
const hasWindow =
  typeof window === 'object' && window !== null && window.self === window;

// eslint-disable-next-line no-confusing-arrow
export default function isBrowser() {
  return hasDocument && hasWindow;
}
