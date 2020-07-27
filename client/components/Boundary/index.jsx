import React from 'react';
// import { Container } from '@components/UI';
import PropTypes from 'prop-types';

const Boundary = ({ hidden = true, bottom = false }) => {
  const style = {
    backgroundColor: 'red',
    height: '1px',
    width: '100vw',
    zIndex: Number.MAX_SAFE_INTEGER
  };

  const which = bottom ? 'bottom' : 'top';
  const id = `boundary-${which}`;

  const boundaryProps = {
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
