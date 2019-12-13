import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
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
    Popup,
    Ref,
    Segment
} from 'semantic-ui-react';
import generateResponseId from '@components/Slide/util/generate-response-id';
import SlideEditor from '@components/Slide/SlideEditor';
import SlideComponentsList from '@components/SlideComponentsList';
import './Slides.css';

class Slides extends React.Component {
    constructor(props) {
        super(props);

        const activeSlideIndex =
            Number(
                this.props.match.params.activeSlideIndex ||
                    this.props.activeSlideIndex
            ) || 0;

        this.state = {
            activeSlideIndex,
            loading: true,
            slides: []
        };

        this.slideRefs = [];
        this.debounceSlideUpdate = {};

        this.onChangeSlide = this.onChangeSlide.bind(this);
        this.onChangeSlideOrder = this.onChangeSlideOrder.bind(this);
        this.addSlide = this.addSlide.bind(this);
        this.activateSlide = this.activateSlide.bind(this);
        this.deleteSlide = this.deleteSlide.bind(this);
        this.duplicateSlide = this.duplicateSlide.bind(this);
    }

    async componentDidMount() {
        await this.fetchSlides();

        this.activateSlide(this.state.activeSlideIndex);
    }

    async fetchSlides() {
        const { scenarioId } = this.props;
        const res = await fetch(`/api/scenarios/${scenarioId}/slides`);
        const { slides } = await res.json();
        return new Promise(resolve => {
            this.setState(
                {
                    loading: false,
                    slides: slides.filter(slide => !slide.is_finish)
                },
                resolve
            );
        });
    }

    onChangeSlide(val) {
        const { scenarioId } = this.props;
        const { slides, activeSlideIndex } = this.state;
        const slide = slides[activeSlideIndex];
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
            this.props.updateEditorMessage('Slide saved!');
        }, 250);
    }

    async moveSlide(fromIndex, toIndex) {
        this.props.updateEditorMessage('Moving slide...');

        const { scenarioId } = this.props;
        const slides = this.state.slides.slice();
        const from = slides[fromIndex];
        const to = slides[toIndex];
        if (from && to) {
            slides[toIndex] = from;
            slides[fromIndex] = to;
        }
        // This is to update the UI ASAP
        this.setState({ slides, activeSlideIndex: toIndex });
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
        this.setState({ slides, activeSlideIndex: toIndex }, () => {
            this.activateSlide(toIndex);
        });
        this.props.updateEditorMessage('Slide saved!');
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

        let activeSlideIndex;

        // The slide was at the end...
        if (index > slides.length) {
            activeSlideIndex = slides.length - 1;
        }

        // The slide was at the beginning...
        if (index === 0) {
            activeSlideIndex = 0;
        } else {
            // The slide was somewhere in between...
            activeSlideIndex = index - 1;
        }

        this.setState({ slides, activeSlideIndex }, () => {
            this.activateSlide(activeSlideIndex);
        });
        this.props.updateEditorMessage('Slide deleted');
    }

    async duplicateSlide(index) {
        const { title, components } = this.state.slides[index];

        // Check through all components of this slide
        // for any that are response components...
        for (const component of components) {
            // ...When a response component has been
            // found, assign it a newly generated responseId,
            // to prevent duplicate responseId values from
            // being created.
            if (Object.prototype.hasOwnProperty.call(component, 'responseId')) {
                component.responseId = generateResponseId(component.type);
            }
        }

        const activeSlideIndex = await this.storeSlide({
            title,
            components
        });

        this.activateSlide(activeSlideIndex);
    }

    async addSlide() {
        const activeSlideIndex = await this.storeSlide({
            title: '',
            components: []
        });

        this.activateSlide(activeSlideIndex);
    }

    activateSlide(activeSlideIndex) {
        this.setState({ activeSlideIndex }, () => {
            if (this.slideRefs[activeSlideIndex]) {
                this.slideRefs[activeSlideIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }

            this.props.setActiveSlide(activeSlideIndex);
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
        let activeSlideIndex = this.state.activeSlideIndex + 1;

        if (this.state.slides.length > 1 && orderIndex !== activeSlideIndex) {
            this.moveSlide(orderIndex, activeSlideIndex);
        } else {
            // If this is the very first slide, the activeSlideIndex
            // needs to be corrected to 0
            if (this.state.slides.length === 1) {
                activeSlideIndex = 0;
            }

            // This is necessary when adding a slide that doesn't need
            // any special ordering changes, but still must be highlighted.
            this.setState({ activeSlideIndex });
        }

        return activeSlideIndex;
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
        const { scenarioId, updateEditorMessage } = this.props;
        const { loading, slides, activeSlideIndex } = this.state;
        if (loading) {
            return (
                <Segment>
                    <Loader />
                </Segment>
            );
        }
        return (
            <Container fluid>
                <Grid className="slides__editor-all-outer-container">
                    <Grid.Column
                        width={3}
                        className="slides__list-outer-container"
                    >
                        <Grid.Row>
                            <Menu icon>
                                <Popup
                                    content="Add a slide"
                                    trigger={
                                        <Menu.Item
                                            name="Add a slide"
                                            onClick={() => {
                                                addSlide(activeSlideIndex);
                                            }}
                                        >
                                            <Icon
                                                name="plus square outline"
                                                size="large"
                                                style={{
                                                    marginRight: '0.5rem'
                                                }}
                                            />
                                            Add a slide
                                        </Menu.Item>
                                    }
                                />
                                {slides.length > 0 && (
                                    <Popup
                                        content="Slide options"
                                        trigger={
                                            <Menu.Menu
                                                key="menu-item-slide-options"
                                                position="right"
                                            >
                                                <Dropdown item icon="options">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            key={1}
                                                            onClick={() => {
                                                                duplicateSlide(
                                                                    this.state
                                                                        .activeSlideIndex
                                                                );
                                                            }}
                                                        >
                                                            <Icon name="copy outline" />
                                                            Duplicate selected
                                                            slide
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Menu.Menu>
                                        }
                                    />
                                )}
                            </Menu>
                        </Grid.Row>
                        <Segment className="slides__list-inner-container">
                            {slides.length === 0 && (
                                <Message
                                    floating
                                    icon={
                                        <Icon.Group
                                            size="huge"
                                            style={{ marginRight: '0.5rem' }}
                                        >
                                            <Icon name="plus square outline" />
                                            <Icon
                                                corner="top right"
                                                name="add"
                                                color="green"
                                            />
                                        </Icon.Group>
                                    }
                                    header="Add a slide!"
                                    content="Click the 'Add a slide' button to add your first slide!"
                                    onClick={() => {
                                        addSlide(activeSlideIndex);
                                    }}
                                />
                            )}
                            <Sortable
                                onChange={onChangeSlideOrder}
                                options={{
                                    direction: 'vertical',
                                    swapThreshold: 0.5,
                                    animation: 150
                                }}
                            >
                                {slides
                                    .filter(slide => !slide.is_finish)
                                    .map((slide, index) => {
                                        const isActiveSlide =
                                            index === activeSlideIndex;
                                        const className = isActiveSlide
                                            ? 'slides__list-row-selected'
                                            : '';
                                        const onClickActivateSlide = () => {
                                            this.activateSlide(index);
                                        };
                                        return (
                                            <Grid.Row
                                                key={slide.id}
                                                className="slides__list-row"
                                            >
                                                <Ref
                                                    innerRef={node =>
                                                        (this.slideRefs[
                                                            index
                                                        ] = node)
                                                    }
                                                >
                                                    <Card
                                                        className={className}
                                                        onClick={
                                                            onClickActivateSlide
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
                                                </Ref>
                                            </Grid.Row>
                                        );
                                    })}
                            </Sortable>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column
                        width={13}
                        className="slides__editor-outer-container"
                    >
                        {slides[activeSlideIndex] && (
                            <SlideEditor
                                key={activeSlideIndex}
                                scenarioId={scenarioId}
                                index={activeSlideIndex}
                                {...slides[activeSlideIndex]}
                                onChange={onChangeSlide}
                                deleteSlide={deleteSlide}
                                updateEditorMessage={updateEditorMessage}
                            />
                        )}
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

Slides.propTypes = {
    activeSlideIndex: PropTypes.number,
    match: PropTypes.shape({
        params: PropTypes.shape({
            activeSlideIndex: PropTypes.node,
            id: PropTypes.node
        }).isRequired
    }),
    scenarioId: PropTypes.node,
    setActiveSlide: PropTypes.func,
    updateEditorMessage: PropTypes.func.isRequired
};
export default withRouter(Slides);
