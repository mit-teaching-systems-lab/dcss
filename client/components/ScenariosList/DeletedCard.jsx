import './ScenariosList.css';

import { Button, Card, Text } from '@components/UI';

import PropTypes from 'prop-types';
import React from 'react';

const DeletedCard = ({ id, title, description, onClick }) => {
  return (
    <Card className="sc sc__margin-height deleted" key={id}>
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        <Text.Truncate lines={3}>{description}</Text.Truncate>
      </Card.Content>
      <Card.Content extra>
        <Button.Group className="sc__edit-buttons">
          <Button name="restore" onClick={onClick}>
            Restore
          </Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

DeletedCard.propTypes = {
  description: PropTypes.string.isRequired,
  id: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default DeletedCard;
