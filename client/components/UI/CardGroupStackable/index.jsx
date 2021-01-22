import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Message } from 'semantic-ui-react';

class CardGroupStackable extends Component {
  render() {
    const { children, fallback, ...rest } = this.props;
    return children && children.length ? (
      <Card.Group doubling stackable {...rest}>
        {children}
      </Card.Group>
    ) : (
      <Message content={fallback || ''} />
    );
  }
}

CardGroupStackable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  fallback: PropTypes.string
};

export default CardGroupStackable;
