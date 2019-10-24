import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import 'semantic-ui-css/semantic.min.css';
import './ScenariosList.css';

const ScenarioEntries = ({ scenarioData, isLoggedIn }) => {
    if (!scenarioData.length) {
        return null;
    }

    return scenarioData.map(({ id, title, description }) => {
        return (
            <Grid.Column
                mobile={16}
                tablet={8}
                computer={5}
                key={id}
                className="tm__scenario-entry"
            >
                <Header as="h3">
                    <Link
                        to={{
                            pathname: `/moment/${id}`,
                            state: { id, title, description }
                        }}
                    >
                        {title}
                    </Link>
                </Header>
                <p className="tm__scenario-desc">{description}</p>
                {isLoggedIn && (
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
                )}
            </Grid.Column>
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
        return (
            <Container>
                <h2>Practice spaces for teacher preparation programs</h2>
                <Grid stackable>
                    <ScenarioEntries
                        scenarioData={this.state.scenarioData}
                        isLoggedIn={this.props.isLoggedIn}
                    />
                </Grid>
            </Container>
        );
    }
}

ScenariosList.propTypes = {
    scenarioData: PropTypes.array,
    isLoggedIn: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    const { isLoggedIn, username } = state.login;
    return { isLoggedIn, username };
}

export default connect(
    mapStateToProps,
    null
)(ScenariosList);
