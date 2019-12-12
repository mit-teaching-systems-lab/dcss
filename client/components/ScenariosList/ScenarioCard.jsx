import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getScenarios } from '@client/actions/scenario';
import ConfirmAuth from '@client/components/ConfirmAuth';
import DeletedCard from './DeletedCard';
import './ScenariosList.css';

class ScenarioCard extends React.Component {
    constructor(props) {
        super(props);

        const { scenario } = this.props;

        this.state = {
            scenario
        };

        this.onClick = this.onClick.bind(this);
    }

    async onClick(event, { name }) {
        if (name === 'restore') {
            const originalScenario = this.state.scenario;
            originalScenario.deleted_at = null;

            const { scenario } = await (await fetch(
                `/api/scenarios/${originalScenario.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(originalScenario)
                }
            )).json();

            if (scenario.deleted_at === null) {
                this.setState({ scenario });
            }
        }
    }

    render() {
        const { onClick } = this;
        const { isLoggedIn } = this.props;
        const { scenario } = this.state;
        const {
            categories = [],
            id,
            description,
            deleted_at,
            title,
            user_is_author
        } = scenario;
        const officialCheckmark = categories.includes('official') ? (
            <Icon name="check" />
        ) : null;

        return deleted_at ? (
            <ConfirmAuth
                isAuthorized={user_is_author}
                requiredPermission="edit_scenario"
            >
                <DeletedCard
                    id={id}
                    title={title}
                    description={description}
                    onClick={onClick}
                />
            </ConfirmAuth>
        ) : (
            <Card className="scenario__entry" key={id}>
                <Card.Content>
                    <Card.Header>
                        {title} {officialCheckmark}
                    </Card.Header>
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
                            <ConfirmAuth requiredPermission="create_scenario">
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
                            </ConfirmAuth>
                        </Button.Group>
                    </Card.Content>
                )}
            </Card>
        );
    }
}

ScenarioCard.propTypes = {
    getScenarios: PropTypes.func,
    scenario: PropTypes.object,
    isLoggedIn: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    const {
        login: { isLoggedIn, username }
    } = state;
    return { isLoggedIn, username };
}

const mapDispatchToProps = {
    getScenarios
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScenarioCard);
