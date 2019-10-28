import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Card } from 'semantic-ui-react';

import SlideList from '@components/SlideList';
import { setScenario, setSlides } from '@client/actions';

class Scenario extends Component {
    constructor(props) {
        super(props);

        // Check for data from route or props
        this.state = Object.assign(
            {},
            { scenarioId: this.props.scenarioId },
            this.props.location ? this.props.location.state : null,
            this.props.match ? this.props.match.params : null
        );

        this.getScenarioData = this.getScenarioData.bind(this);
        this.getScenarioSlides = this.getScenarioSlides.bind(this);

        // Get data that hasn't been passed by the router
        this.getScenarioData();
        this.getScenarioSlides();
    }

    async getScenarioData() {
        if (this.state.title && this.state.description) {
            this.props.setScenario({
                title: this.state.title,
                description: this.state.description
            });
            return;
        }

        const scenarioResponse = await (await fetch(
            `/api/scenarios/${this.state.scenarioId}`
        )).json();
        const scenario = scenarioResponse.scenario;

        if (scenarioResponse.status === 200) {
            this.props.setScenario({
                title: scenario.title,
                description: scenario.description
            });
        }
    }

    async getScenarioSlides() {
        if (this.state.scenarioId) {
            const res = await fetch(
                `/api/scenarios/${this.state.scenarioId}/slides`
            );
            const { slides } = await res.json();
            this.props.setSlides({ slides });
        } else {
            this.props.setSlides({ slides: null });
        }
    }

    render() {
        const { title, description, slides } = this.props;
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

function mapStateToProps(state) {
    const { title, description, slides } = state.scenario;
    return { title, description, slides };
}

const mapDispatchToProps = {
    setScenario,
    setSlides
};

Scenario.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.object
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }),
    scenarioId: PropTypes.node,
    setScenario: PropTypes.func.isRequired,
    setSlides: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    slides: PropTypes.array
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Scenario);
