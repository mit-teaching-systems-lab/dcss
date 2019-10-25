import React, { Component } from 'react';
import { Container, Grid, Card } from 'semantic-ui-react';
import SlideList from '@components/SlideList';

class Scenario extends Component {
    constructor(props) {
        super(props);
        this.state = { ...this.props.location.state };

        this.getScenarioSlides = this.getScenarioSlides.bind(this);

        this.getScenarioSlides();
    }

    async getScenarioSlides() {
        const res = await fetch(`/api/scenarios/${this.state.id}/slides`);
        const { slides } = await res.json();

        this.setState({
            slides
        });
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

export default Scenario;
