import React from 'react';
import PropTypes from 'prop-types';
import Sortable from 'react-sortablejs';
import { Container, Grid, Card, Dropdown } from 'semantic-ui-react';
import SlideEditor from '@components/Slide/Editor';
import SlideComponentsList from '@components/SlideComponentsList';
import './Slides.css';

const dropDownValues = [
    {
        key: 'empty',
        value: 'empty',
        text: 'Empty'
    },
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
        this.onChangeSlideOrder = this.onChangeSlideOrder.bind(this);
        this.deleteSlide = this.deleteSlide.bind(this);
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
        this.props.updateEditorMessage('');
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
            this.props.updateEditorMessage('Slide saved');
        }, 250);
    }

    async moveSlide(fromIndex, toIndex) {
        this.props.updateEditorMessage('Moving slides...');

        const { scenarioId } = this.props;
        const slides = this.state.slides.slice();
        const from = slides[fromIndex];
        const to = slides[toIndex];
        if (from && to) {
            slides[toIndex] = from;
            slides[fromIndex] = to;
        }
        // This is to update the UI ASAP
        this.setState({ slides, currentSlideIndex: toIndex });
        this.props.updateEditorMessage('Slide moved');
        const result = await fetch(
            `/api/scenarios/${scenarioId}/slides/order`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ slides })
            }
        );
        await result.json();
        this.setState({ slides, currentSlideIndex: toIndex });
        this.props.updateEditorMessage('');
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
        this.props.updateEditorMessage('Slide deleted');
    }

    async onChangeAddSlide(event, data) {
        this.props.updateEditorMessage('');
        const { scenarioId } = this.props;
        const title = data.value === 'empty' ? '' : data.value;
        const newSlide = { title, components: [] };
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
        this.props.updateEditorMessage('Slide added');
        await this.fetchSlides();
        const currentSlideIndex = this.state.slides.findIndex(
            slide => slide.id === id
        );
        this.setState({ currentSlideIndex });
    }

    async onChangeSlideOrder(...args) {
        await this.moveSlide(
            args[2].oldDraggableIndex,
            args[2].newDraggableIndex
        );
    }

    renderLoading() {
        return <div>Loading...</div>;
    }

    render() {
        const {
            onChangeSlide,
            onChangeAddSlide,
            onChangeSlideOrder,
            deleteSlide
        } = this;
        const { loading, slides, currentSlideIndex } = this.state;
        if (loading) return this.renderLoading();
        return (
            <Container fluid className="tm__editor-tab">
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
                        <Sortable onChange={onChangeSlideOrder}>
                            {slides.map((slide, index) => (
                                <Grid.Row
                                    key={slide.id}
                                    className="Slides-slide-sidebar-container"
                                >
                                    <Card
                                        className="Slides-slide-sidebar-card"
                                        onClick={() =>
                                            this.setState({
                                                currentSlideIndex: index
                                            })
                                        }
                                    >
                                        <Card.Header>{slide.title}</Card.Header>
                                        <Card.Content>
                                            <SlideComponentsList
                                                asSVG={true}
                                                components={slide.components}
                                            />
                                        </Card.Content>
                                    </Card>
                                </Grid.Row>
                            ))}
                        </Sortable>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {slides[currentSlideIndex] && (
                            <SlideEditor
                                key={currentSlideIndex}
                                index={currentSlideIndex}
                                {...slides[currentSlideIndex]}
                                onChange={onChangeSlide}
                                deleteSlide={deleteSlide}
                            />
                        )}
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

Slides.propTypes = {
    scenarioId: PropTypes.string,
    updateEditorMessage: PropTypes.func.isRequired
};
export default Slides;
