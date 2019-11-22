import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, Grid, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import 'semantic-ui-css/semantic.min.css';
import './ScenariosList.css';

const ScenarioEntries = ({ scenarios, isLoggedIn }) => {
    if (!scenarios.length) {
        return null;
    }

    // only filter out scenario if there is a path
    return scenarios.map(({ id, title, description, deleted_at }) => {
        const strike = deleted_at ? { textDecoration: 'line-through' } : {};
        return (
            <Card key={id}>
                <Card.Content>
                    <Card.Header style={strike}>{title}</Card.Header>
                    <Card.Description style={strike}>
                        {description}
                    </Card.Description>
                </Card.Content>
                {!deleted_at && isLoggedIn && (
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
                )}
                {!deleted_at && isLoggedIn && (
                    <Card.Content extra>
                        <Button.Group className="scenario__entry--edit-buttons">
                            <Button
                                basic
                                color="black"
                                className="scenario__entry--button"
                                as={Link}
                                to={{ pathname: `/editor/${id}` }}
                            >
                                Edit
                            </Button>
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
                {deleted_at && isLoggedIn && (
                    <Card.Content extra>
                        <Button.Group className="scenario__entry--edit-buttons">
                            <Button>Restore</Button>
                        </Button.Group>
                    </Card.Content>
                )}
            </Card>
        );
    });
};

class ScenariosList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scenarios: props.scenarios || []
        };

        this.getScenarios = this.getScenarios.bind(this);

        if (!this.state.scenarios.length) {
            this.getScenarios();
        }
    }

    async getScenarios() {
        const { scenarios, status } = await (await fetch(
            'api/scenarios'
        )).json();

        if (status === 200) {
            this.setState({ scenarios });
        }
    }

    render() {
        const category = this.props.location.pathname.slice(1);
        let scenarios = this.state.scenarios.filter(({ categories }) => {
            return !category || categories.includes(category);
        });

        // TODO: Expose deleted scenarios these to Admin only
        // This pushes "deleted" scenarios to the end of the list of Scenarios,
        // as a temporary means of addressing the display of "deleted"
        // scenarios.
        scenarios.forEach((scenario, index, scenarios) => {
            if (scenario.deleted_at) {
                scenarios.splice(index, 1);
                scenarios.push(scenario);
            }
        });

        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column stretched>
                            <h2>
                                Practice spaces for teacher preparation programs
                            </h2>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column stretched>
                            {this.state.scenarios.length ? (
                                <Card.Group>
                                    <ScenarioEntries
                                        scenarios={scenarios}
                                        isLoggedIn={this.props.isLoggedIn}
                                    />
                                </Card.Group>
                            ) : (
                                <Loader inverted content="Loading" />
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

ScenariosList.propTypes = {
    scenarios: PropTypes.array,
    isLoggedIn: PropTypes.bool.isRequired,
    location: PropTypes.object
};

function mapStateToProps(state) {
    const { isLoggedIn, username } = state.login;
    return { isLoggedIn, username };
}

export default connect(
    mapStateToProps,
    null
)(ScenariosList);
