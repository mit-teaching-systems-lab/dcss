import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Dropdown, Button } from 'semantic-ui-react';
import * as Components from '@components/Slide/Components';
import SlideEditor from '@components/Slide/Editor';
import './Slides.css';

const dropDownValues = [
    {
        key: 'context',
        value: 'context',
        text: 'Context'
    },
    {
        key: 'anticipate',
        value: 'anticipate',
        text: 'Anticipate'
    },
    {
        key: 'enact',
        value: 'enact',
        text: 'Enact'
    },
    {
        key: 'reflect',
        value: 'reflect',
        text: 'Reflect'
    }
];

class Slides extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            slides: [],
            currentSlideIndex: 0
        };

        this.debounceSlideUpdate = {};

        this.onChangeSlide = this.onChangeSlide.bind(this);
        this.onChangeAddSlide = this.onChangeAddSlide.bind(this);
    }

    componentDidMount() {
        this.fetchSlides();
    }

    async fetchSlides() {
        const { scenarioId } = this.props;
        const res = await fetch(`/api/scenarios/${scenarioId}/slides`);
        const { slides } = await res.json();
        return new Promise(resolve =>
            this.setState({ loading: false, slides }, resolve)
        );
    }

    onChangeSlide(val) {
        const { scenarioId } = this.props;
        const { slides, currentSlideIndex } = this.state;
        const slide = slides[currentSlideIndex];
        clearTimeout(this.debounceSlideUpdate[slide.id]);
        this.debounceSlideUpdate[slide.id] = setTimeout(async () => {
            const newSlide = {
                ...slide,
                ...val
            };
            const result = await fetch(
                `/api/scenarios/${scenarioId}/slides/${slide.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newSlide)
                }
            );
            const { slide: savedSlide } = await result.json();
            const slides = this.state.slides.map(currSlide =>
                currSlide.id === savedSlide.id ? savedSlide : currSlide
            );
            this.setState({ slides });
        }, 250);
    }

    async deleteSlide(index) {
        const { scenarioId } = this.props;
        const slide = this.state.slides[index];
        const result = await fetch(
            `/api/scenarios/${scenarioId}/slides/${slide.id}`,
            {
                method: 'DELETE'
            }
        );
        await result.json();
        const slides = this.state.slides.filter(({ id }) => id !== slide.id);
        this.setState({ slides, currentSlideIndex: -1 });
    }

    async onChangeAddSlide(event, data) {
        const { scenarioId } = this.props;
        const newSlide = { title: data.value, components: [] };
        const res = await fetch(`/api/scenarios/${scenarioId}/slides`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSlide)
        });
        const {
            slide: { id }
        } = await res.json();
        await this.fetchSlides();
        const currentSlideIndex = this.state.slides.findIndex(
            slide => slide.id === id
        );
        this.setState({ currentSlideIndex });
    }

    renderLoading() {
        return <div>Loading...</div>;
    }

    render() {
        const { onChangeSlide, onChangeAddSlide } = this;
        const { loading, slides, currentSlideIndex } = this.state;
        if (loading) return this.renderLoading();
        return (
            <Grid>
                <Grid.Column width={3}>
                    <Grid.Row>
                        <Dropdown
                            selection
                            placeholder="Add +"
                            options={dropDownValues}
                            onChange={onChangeAddSlide}
                        />
                    </Grid.Row>
                    {slides.map((slide, index) => (
                        <Grid.Row key={slide.id}>
                            <Card
                                onClick={() =>
                                    this.setState({ currentSlideIndex: index })
                                }
                            >
                                <Card.Header>{slide.title}</Card.Header>
                                <Card.Content>
                                    {slide.components.map(({ type }, index) => {
                                        const {
                                            Card = () => <b>{type}</b>
                                        } = Components[type];
                                        return <Card key={index} />;
                                    })}
                                    <p>
                                        <Button
                                            icon="trash alternate outline"
                                            aria-label="Delete Slide"
                                            className="Slides-delete-button"
                                            onClick={() =>
                                                this.deleteSlide(index)
                                            }
                                        />
                                    </p>
                                </Card.Content>
                            </Card>
                        </Grid.Row>
                    ))}
                </Grid.Column>
                <Grid.Column width={8}>
                    {slides[currentSlideIndex] && (
                        <SlideEditor
                            key={currentSlideIndex}
                            {...slides[currentSlideIndex]}
                            onChange={onChangeSlide}
                        />
                    )}
                </Grid.Column>
            </Grid>
        );
    }
}

Slides.propTypes = {
    scenarioId: PropTypes.string
};
export default Slides;
