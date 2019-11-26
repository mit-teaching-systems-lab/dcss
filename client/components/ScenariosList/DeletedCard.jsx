import React from 'react';
import { Button, Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const strike = { textDecoration: 'line-through' };

const DeletedCard = ({ id, title, description }) => {
    return (
        <Card className="scenario__entry" key={id}>
            <Card.Content>
                <Card.Header style={strike}>{title}</Card.Header>
                <Card.Description style={strike}>
                    {description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group className="scenario__entry--edit-buttons">
                    <Button>Restore</Button>
                </Button.Group>
            </Card.Content>
        </Card>
    );
};

DeletedCard.propTypes = {
    id: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};

export default DeletedCard;
