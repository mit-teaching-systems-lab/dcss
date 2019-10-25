import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Card } from 'semantic-ui-react';

import SlideList from '@components/SlideList';

class Scenario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.location.state,
            ...this.props.match.params
        };

        this.getScenarioData = this.getScenarioData.bind(this);
        this.getScenarioSlides = this.getScenarioSlides.bind(this);

        this.getScenarioSlides();

        // Get data if it hasn't been passed by the router
        if (!this.state.title) {
            this.getScenarioData();
        }
    }

    async getScenarioData() {
        const scenarioResponse = await (await fetch(
            `/api/scenarios/${this.state.id}`
        )).json();

        if (scenarioResponse.status === 200) {
            this.setState({
                title: scenarioResponse.scenario.title,
                description: scenarioResponse.scenario.description
            });
        }
    }

    async getScenarioSlides() {
        if (this.state.id) {
            const res = await fetch(`/api/scenarios/${this.state.id}/slides`);
            const { slides } = await res.json();

            this.setState({ slides });
        } else {
            this.setState({ slides: null });
        }
    }

    render() {
        const { title, description, slides } = this.state;
        return (
            <Grid columns={1}>
                <Grid.Column>
                    <Grid.Row key="meta">
                        <Card className="tm__scenario-card">
                            <Card.Header as="h2">{title}</Card.Header>
                            <Card.Content>{description}</Card.Content>
                        </Card>
                    </Grid.Row>

                    {slides &&
                        slides.map((slide, index) => {
                            return (
                                <Grid.Row key={index}>
                                    <Card className="tm__scenario-card">
                                        <Card.Header
                                            as="h3"
                                            key={`header${index}`}
                                        >
                                            {slide.title}
                                        </Card.Header>
                                        <Card.Content key={`content${index}`}>
                                            <SlideList
                                                components={slide.components}
                                            />
                                        </Card.Content>
                                    </Card>
                                </Grid.Row>
                            );
                        })}
                </Grid.Column>
            </Grid>
        );
    }
}

Scenario.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.object
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired
};

export default Scenario;
