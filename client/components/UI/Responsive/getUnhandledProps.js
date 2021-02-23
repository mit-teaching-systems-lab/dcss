// From semantic-ui-react@1.3.1
/**
 * Returns an object consisting of props beyond the scope of the Component.
 * Useful for getting and spreading unknown props from the user.
 * @param {function} Component A function or ReactClass.
 * @param {object} props A ReactElement props object
 * @returns {{}} A shallow copy of the prop object
 */
export default function getUnhandledProps(Component, props) {
  const handledProps = Object.keys(Component.propTypes);

  return Object.entries(props).reduce((accum, [key, value]) => {
    if (key === 'childKey') {
      return accum;
    }
    if (!handledProps.includes(key)) {
      accum[key] = value;
    }
    return accum;
  }, {});
}
