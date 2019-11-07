import React from 'react';
import PropTypes from 'prop-types';
import Sortable from 'react-sortablejs';
import {
    Card,
    Container,
    Dropdown,
    Grid,
    Icon,
    Loader,
    Menu,
    Message,
    Segment
} from 'semantic-ui-react';
import SlideEditor from '@components/Slide/Editor';
import SlideComponentsList from '@components/SlideComponentsList';
import './Slides.css';

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
        this.onChangeSlideOrder = this.onChangeSlideOrder.bind(this);
        this.addSlide = this.addSlide.bind(this);
        this.deleteSlide = this.deleteSlide.bind(this);
        this.duplicateSlide = this.duplicateSlide.bind(this);
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

        let currentSlideIndex;

        // The slide was at the end...
        if (index > slides.length) {
            currentSlideIndex = slides.length - 1;
        }

        // The slide was at the beginning...
        if (index === 0) {
            currentSlideIndex = 0;
        } else {
            // The slide was somewhere in between...
            currentSlideIndex = index - 1;
        }

        this.setState({ slides, currentSlideIndex });
        this.props.updateEditorMessage('Slide deleted');
    }

    async duplicateSlide(index) {
        const { title, components } = this.state.slides[index];
        await this.storeSlide({
            title,
            components
        });
    }

    async addSlide() {
        await this.storeSlide({
            title: '',
            components: []
        });
    }

    async storeSlide(slide) {
        this.props.updateEditorMessage('');
        const { scenarioId } = this.props;
        const res = await fetch(`/api/scenarios/${scenarioId}/slides`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(slide)
        });
        const {
            slide: { id }
        } = await res.json();
        this.props.updateEditorMessage('Slide added');
        await this.fetchSlides();
        const orderIndex = this.state.slides.findIndex(
            slide => slide.id === id
        );
        const correctedIndex = this.state.currentSlideIndex + 1;

        if (orderIndex !== correctedIndex) {
            this.moveSlide(orderIndex, correctedIndex);
        }
    }

    async onChangeSlideOrder(...args) {
        await this.moveSlide(
            args[2].oldDraggableIndex,
            args[2].newDraggableIndex
        );
    }

    render() {
        const {
            onChangeSlide,
            onChangeSlideOrder,
            addSlide,
            deleteSlide,
            duplicateSlide
        } = this;
        const { loading, slides, currentSlideIndex } = this.state;
        if (loading) {
            return (
                <Segment>
                    <Loader />
                </Segment>
            );
        }
        return (
            <Container fluid>
                <Grid>
                    <Grid.Column width={3}>
                        <Grid.Row>
                            <Menu icon>
                                <Menu.Item
                                    name="Add a slide"
                                    onClick={() => {
                                        addSlide(this.state.currentSlideIndex);
                                    }}
                                >
                                    <Icon
                                        name="plus square outline"
                                        size="large"
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    Add a slide
                                </Menu.Item>
                                <Menu.Menu
                                    key="menu-item-slide-options"
                                    position="right"
                                >
                                    <Dropdown item text="Options">
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                key={1}
                                                onClick={() => {
                                                    duplicateSlide(
                                                        this.state
                                                            .currentSlideIndex
                                                    );
                                                }}
                                            >
                                                <Icon name="copy outline" />
                                                Duplicate selected slide
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Menu.Menu>
                            </Menu>
                        </Grid.Row>
                        <Segment className="slides__list-container">
                            {slides.length === 0 && (
                                <Message size="big">
                                    Start creating a Teacher Moment by adding
                                    your first slide!
                                </Message>
                            )}
                            <Sortable onChange={onChangeSlideOrder}>
                                {slides.map((slide, index) => (
                                    <Grid.Row
                                        key={slide.id}
                                        className="slides__list-row"
                                    >
                                        <Card
                                            className={
                                                index ===
                                                this.state.currentSlideIndex
                                                    ? 'slides__list-row-selected'
                                                    : ''
                                            }
                                            onClick={() =>
                                                this.setState({
                                                    currentSlideIndex: index
                                                })
                                            }
                                        >
                                            <Card.Header>
                                                {slide.title}
                                            </Card.Header>
                                            <Card.Content>
                                                <SlideComponentsList
                                                    asSVG={true}
                                                    components={
                                                        slide.components
                                                    }
                                                />
                                            </Card.Content>
                                        </Card>
                                    </Grid.Row>
                                ))}
                            </Sortable>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={13}>
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
