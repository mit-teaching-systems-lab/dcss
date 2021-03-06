import React from 'react';
// import { Container } from '@components/UI';
import PropTypes from 'prop-types';

const Boundary = ({ hidden = true, bottom = false, top = false, ...rest }) => {
  const style = {
    backgroundColor: 'red',
    height: '1px',
    width: '100vw',
    zIndex: Number.MAX_SAFE_INTEGER
  };

  const which = top ? 'top' : bottom ? 'bottom' : 'unknown';

  const id = `boundary-${which}`;

  const boundaryProps = {
    ...rest,
    hidden,
    id,
    style
  };

  return <div {...boundaryProps} />;
};

Boundary.propTypes = {
  hidden: PropTypes.bool,
  bottom: PropTypes.bool,
  top: PropTypes.bool
};

export default Boundary;
