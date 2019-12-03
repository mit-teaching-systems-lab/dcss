import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ConfirmAuth from '@client/components/ConfirmAuth';
import DeletedCard from './DeletedCard';
import './ScenariosList.css';

const ScenarioCard = ({ scenario, isLoggedIn }) => {
    const { id, title, description, deleted_at, user_is_author } = scenario;

    return deleted_at ? (
        <ConfirmAuth
            isAuthorized={user_is_author}
            requiredPermission="edit_scenario"
        >
            <DeletedCard id={id} title={title} description={description} />
        </ConfirmAuth>
    ) : (
        <Card className="scenario__entry" key={id}>
            <Card.Content>
                <Card.Header>{title}</Card.Header>
                <Card.Description className="scenario__entry--description">
                    {description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button
                    basic
                    fluid
                    color="black"
                    as={Link}
                    to={{ pathname: `/run/${id}` }}
                    className="scenario__entry--button"
                >
                    Run
                </Button>
            </Card.Content>
            {isLoggedIn && (
                <Card.Content extra>
                    <Button.Group className="scenario__entry--edit-buttons">
                        <ConfirmAuth
                            isAuthorized={user_is_author}
                            requiredPermission="edit_scenario"
                        >
                            <Button
                                basic
                                color="black"
                                className="scenario__entry--button"
                                as={Link}
                                to={{ pathname: `/editor/${id}` }}
                            >
                                Edit
                            </Button>
                        </ConfirmAuth>
                        <Button
                            basic
                            color="black"
                            className="scenario__entry--button"
                            as={Link}
                            to={{
                                pathname: `/editor/copy`,
                                state: {
                                    scenarioCopyId: id
                                }
                            }}
                        >
                            Copy
                        </Button>
                    </Button.Group>
                </Card.Content>
            )}
        </Card>
    );
};

ScenarioCard.propTypes = {
    scenario: PropTypes.object,
    isLoggedIn: PropTypes.bool.isRequired
};

export default ScenarioCard;
