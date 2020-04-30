import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Button,
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
import hash from 'object-hash';
import notify from '@components/Notification';
import Sortable from '@components/Sortable';
import generateResponseId from '@components/Slide/util/generate-response-id';
import SlideEditor from '@components/Slide/SlideEditor';
import SlideComponentList from '@components/SlideComponentList';
import { getSlides } from '@client/actions/scenario';
import './Slides.css';

class Slides extends React.Component {
    constructor(props) {
        super(props);

        const activeNonZeroSlideIndex =
            Number(
                this.props.match.params.activeNonZeroSlideIndex ||
                    this.props.activeNonZeroSlideIndex
            ) || 1;

        this.state = {
            activeSlideIndex: activeNonZeroSlideIndex - 1,
            loading: true,
            slides: []
        };

        this.slideRefs = [];
        this.debounceSlideUpdate = {};
        this.activateSlide = this.activateSlide.bind(this);
        this.addSlide = this.addSlide.bind(this);
        this.deleteSlide = this.deleteSlide.bind(this);
        this.duplicateSlide = this.duplicateSlide.bind(this);

        this.onSlideChange = this.onSlideChange.bind(this);
        this.onSlideOrderChange = this.onSlideOrderChange.bind(this);
    }

    async componentDidMount() {
        await this.fetchSlides();
    }

    async fetchSlides() {
        const { getSlides, scenarioId } = this.props;
        const slides = (await getSlides(scenarioId)).filter(
            slide => !slide.is_finish
        );

        this.setState({ slides, loading: false }, () => {
            this.activateSlide(this.state.activeSlideIndex);
        });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     let status = false;
    //     console.group('Slides: shouldComponentUpdate()?');

    //     if (nextProps.slides.length === 0 && nextState.slides.length === 0) {
    //         // console.log("SLIDES HAVE BEEN DELETED");
    //         status = true;
    //     }

    //     if (
    //         !status &&
    //         this.state.activeSlideIndex !== nextState.activeSlideIndex
    //     ) {
    //         // console.log("SLIDE METADATA HAS CHANGED");
    //         status = true;
    //     }

    //     if (
    //         !status &&
    //         (this.props.slides.length !== nextProps.slides.length ||
    //             this.state.slides.length !== nextState.slides.length)
    //     ) {
    //         // console.log("SLIDE LENGTH HAS CHANGED");
    //         status = true;
    //     }

    //     if (this.props.slides.length === nextProps.slides.length) {
    //         let same = 0;
    //         for (let slide of this.props.slides) {
    //             let index = this.props.slides.indexOf(slide);
    //             if (hash(slide) === hash(nextProps.slides[index])) {
    //                 same++;
    //             }
    //         }
    //         if (same === this.props.slides.length) {
    //             status = false;
    //         }
    //     }

    //     if (this.state.slides.length === nextState.slides.length) {
    //         let same = 0;
    //         for (let slide of this.state.slides) {
    //             let index = this.state.slides.indexOf(slide);
    //             if (hash(slide) === hash(nextState.slides[index])) {
    //                 same++;
    //             }
    //         }

    //         if (same === this.state.slides.length) {
    //             status = false;
    //         }
    //     }

    //     if (
    //         !status &&
    //         (this.props.slides.length === 1 && this.props.slides[0].is_finish)
    //     ) {
    //         console.log('NO SCENARIO SLIDES CREATED');
    //         status = true;
    //     }

    //     if (!status && this.props.slides.length !== this.state.slides.length) {
    //         status = true;
    //     }

    //     console.log('props', this.props, nextProps);
    //     console.log('state', this.state, nextState);
    //     console.log('props.slides', this.props.slides, nextProps.slides);
    //     console.log('state.slides', this.state.slides, nextState.slides);
    //     console.log('Updating component?', status);
    //     console.groupEnd('Slides: shouldComponentUpdate()?');

    //     return status;
    // }

    onSlideChange(val) {
        const { scenarioId } = this.props;
        const { slides, activeSlideIndex } = this.state;
        const slide = slides[activeSlideIndex];

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
            notify({ type: 'success', message: 'Slide saved' });
        }, 200);
    }

    async moveSlide(fromIndex, toIndex) {
        notify({ message: 'Moving slide...' });

        const { scenarioId } = this.props;
        const slides = this.state.slides.slice();
        const from = slides[fromIndex];
        const to = slides[toIndex];
        if (from && to) {
            console.log(from, to);
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
        await this.fetchSlides();

        this.setState({ activeSlideIndex: toIndex }, () => {
            this.activateSlide(toIndex);
        });
        notify({ type: 'success', message: 'Slide saved' });
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
        await this.fetchSlides();
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
            notify({ type: 'success', message: 'Slide deleted' });
            this.activateSlide(activeSlideIndex);
        });
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
                    block: 'nearest',
                    inline: 'nearest'
                });
            }

            this.props.setActiveSlide(activeSlideIndex);
        });
    }

    async storeSlide(slide) {
        const res = await fetch(
            `/api/scenarios/${this.props.scenarioId}/slides`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(slide)
            }
        );
        const {
            slide: { id }
        } = await res.json();
        notify({ type: 'info', message: 'Slide added' });
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

    async onSlideOrderChange(fromIndex, toIndex) {
        await this.moveSlide(fromIndex, toIndex);
    }

    render() {
        const {
            onSlideChange,
            onSlideOrderChange,
            addSlide,
            deleteSlide,
            duplicateSlide
        } = this;
        const { scenarioId } = this.props;
        const { loading, activeSlideIndex } = this.state;
        if (loading) {
            return (
                <Segment>
                    <Loader />
                </Segment>
            );
        }

        const slides = this.state.slides.filter(slide => !slide.is_finish);
        const slideEditorKey = hash(slides[activeSlideIndex]);

        return (
            <Container fluid>
                <Grid className="slides__editor-all-outer-container">
                    <Grid.Column
                        width={3}
                        className="slides__list-outer-container"
                    >
                        <Grid.Row>
                            <Menu icon borderless>
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
                                    <Menu.Menu
                                        key="menu-item-slide-options"
                                        position="right"
                                    >
                                        {/*
                                        <Popup
                                            content="Minimize slides"
                                            trigger={
                                                <Menu.Item
                                                    onClick={() => alert('No yet implemented')}
                                                >
                                                    <Icon name="minimize" />
                                                </Menu.Item>

                                            }
                                        />
                                        */}
                                        <Popup
                                            content="Slide options"
                                            trigger={
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
                                            }
                                        />
                                    </Menu.Menu>
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
                                            className="editormenu__icon-group"
                                        >
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
                            <Sortable onChange={onSlideOrderChange}>
                                {slides.map((slide, index) => {
                                    const isActiveSlide =
                                        index === activeSlideIndex;
                                    const className = isActiveSlide
                                        ? 'slides__list-card sortable__selected'
                                        : 'slides__list-card';
                                    const onActivateSlideClick = () => {
                                        this.activateSlide(index);
                                    };

                                    const description = '';
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
                                                        onActivateSlideClick
                                                    }
                                                >
                                                    <Card.Content className="slides__list-card-content">
                                                        <Card.Header>
                                                            <Menu
                                                                size="mini"
                                                                className="slides__list-card-header-menu-items"
                                                                secondary
                                                            >
                                                                <Menu.Item
                                                                    name={`${index +
                                                                        1}`}
                                                                />

                                                                {slide.title && (
                                                                    <Menu.Item
                                                                        className="slides__list-card-header-title"
                                                                        name={
                                                                            slide.title
                                                                        }
                                                                    />
                                                                )}

                                                                <Menu.Menu
                                                                    key="menu-slides-order-change"
                                                                    position="right"
                                                                >
                                                                    <Button
                                                                        key="menu-slides-order-change-up"
                                                                        icon="caret up"
                                                                        aria-label={`Move slide ${description} up`}
                                                                        disabled={
                                                                            index ===
                                                                            0
                                                                        }
                                                                        onClick={event => {
                                                                            event.stopPropagation();
                                                                            onSlideOrderChange(
                                                                                index,
                                                                                index -
                                                                                    1
                                                                            );
                                                                        }}
                                                                    />
                                                                    <Button
                                                                        key="menu-slides-order-change-down"
                                                                        icon="caret down"
                                                                        aria-label={`Move slide ${description} down`}
                                                                        disabled={
                                                                            index ===
                                                                            slides.length -
                                                                                1
                                                                        }
                                                                        onClick={event => {
                                                                            event.stopPropagation();
                                                                            onSlideOrderChange(
                                                                                index,
                                                                                index +
                                                                                    1
                                                                            );
                                                                        }}
                                                                    />
                                                                </Menu.Menu>
                                                            </Menu>
                                                        </Card.Header>
                                                    </Card.Content>
                                                    <Card.Content className="slides__list-card-content">
                                                        <SlideComponentList
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
                                key={slideEditorKey}
                                scenarioId={scenarioId}
                                index={activeSlideIndex}
                                {...slides[activeSlideIndex]}
                                onChange={onSlideChange}
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
    activeNonZeroSlideIndex: PropTypes.number,
    activeSlideIndex: PropTypes.number,
    getSlides: PropTypes.func,
    match: PropTypes.shape({
        params: PropTypes.shape({
            activeNonZeroSlideIndex: PropTypes.node,
            activeSlideIndex: PropTypes.node,
            id: PropTypes.node
        }).isRequired
    }),
    slides: PropTypes.array,
    scenarioId: PropTypes.node,
    setActiveSlide: PropTypes.func
};

const mapStateToProps = state => {
    const { slides } = state.scenario;
    return {
        slides
    };
};

const mapDispatchToProps = dispatch => ({
    getSlides: params => dispatch(getSlides(params))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Slides)
);
