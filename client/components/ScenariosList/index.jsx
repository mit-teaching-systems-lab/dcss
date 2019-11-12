import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, Grid, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import 'semantic-ui-css/semantic.min.css';
import './ScenariosList.css';

const ScenarioEntries = ({ scenarioData, isLoggedIn }) => {
    if (!scenarioData.length) {
        return null;
    }

    // only filter out scenario if there is a path
    return scenarioData.map(({ id, title, description }) => {
        return (
            <Card key={id}>
                <Card.Content>
                    <Card.Header>{title}</Card.Header>
                    <Card.Description>{description}</Card.Description>
                </Card.Content>
                {isLoggedIn && (
                    <Card.Content extra>
                        <Button
                            basic
                            fluid
                            color="black"
                            push="true"
                            as={Link}
                            to={{ pathname: `/editor/${id}` }}
                        >
                            Edit
                        </Button>
                    </Card.Content>
                )}
                {isLoggedIn && (
                    <Card.Content extra>
                        <Button
                            basic
                            fluid
                            color="black"
                            push="true"
                            as={Link}
                            to={{ pathname: `/run/${id}` }}
                        >
                            Run
                        </Button>
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
            scenarioData: props.scenarioData || []
        };

        this.getScenarios = this.getScenarios.bind(this);

        if (!this.state.scenarioData.length) {
            this.getScenarios();
        }
    }

    async getScenarios() {
        const scenariosResponse = await (await fetch('api/scenarios')).json();
        if (scenariosResponse.status === 200) {
            this.setState({ scenarioData: scenariosResponse.scenarios });
        }
    }

    render() {
        const category = this.props.location.pathname.slice(1);
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
                            {this.state.scenarioData.length ? (
                                <Card.Group>
                                    <ScenarioEntries
                                        scenarioData={this.state.scenarioData.filter(
                                            result =>
                                                (!category && result) ||
                                                result.categories.includes(
                                                    category
                                                )
                                        )}
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
    scenarioData: PropTypes.array,
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
