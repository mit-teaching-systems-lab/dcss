import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import useResizeAware from 'react-resize-aware';

export function ResizeDetector({ children, onResize }) {
  const [resizeListener, sizes] = useResizeAware();
  onResize(sizes);
  return (
    <Fragment>
      {resizeListener}
      {children}
    </Fragment>
  );
}

ResizeDetector.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  onResize: PropTypes.func
};
