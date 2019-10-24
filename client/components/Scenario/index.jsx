import React, { Component } from 'react';
import { Container, Card } from 'semantic-ui-react';
import * as Components from '@components/Slide/Components';

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
        console.log('slides', slides);
        return (
            <Container>
                <h1>{title}</h1>
                <p>{description}</p>
                {slides && slides.map((slide, index) => {
                    return (
                        <Card key={slide.id}>
                            <Card.Header>{slide.title}</Card.Header>
                            <Card.Content>
                                {slide.components.map(
                                    (value, index) => {
                                        console.log('Components[type]', Components[type]);
                                        const { type } = value;
                                        const { Display } = Components[type];
                                        return (
                                            <Display {...value} />
                                        );
                                    }
                                )}
                            </Card.Content>
                        </Card>
                    )
                })
                }
            </Container>
        );
    }
}

export default Scenario;
