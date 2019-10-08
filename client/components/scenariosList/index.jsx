import React, { Component } from 'react';
import { Container, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import 'semantic-ui-css/semantic.min.css';

const ScenarioEntries = ({ scenarioData }) => {
    if (!scenarioData.length) {
        return null;
    }

    return scenarioData.map(({ id, title, description }) => {
        return (
            <List.Item key={id}>
                <List.Header as="h3">{title}</List.Header>
                <List.Content>{description}</List.Content>
            </List.Item>
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
                <List relaxed>
                    <ScenarioEntries scenarioData={this.state.scenarioData} />
                </List>
            </Container>
        );
    }
}

ScenariosList.propTypes = {
    scenarioData: PropTypes.array
};

export default ScenariosList;
