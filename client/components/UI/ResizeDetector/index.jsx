import React, { Fragment, useEffect, useRef } from 'react';
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
