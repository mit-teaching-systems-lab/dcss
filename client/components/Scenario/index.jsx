import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Grid, Ref, Segment } from 'semantic-ui-react';

import ContentSlide from './ContentSlide';
import EntrySlide from './EntrySlide';
import FinishSlide from './FinishSlide';
import { getScenario, setScenario, setSlides } from '@client/actions/scenario';
import './Scenario.css';

class Scenario extends Component {
    constructor(props) {
        super(props);

        const activeSlideIndex =
            Number(
                this.props.match.params.activeSlideIndex ||
                    this.props.activeSlideIndex
            ) || 0;

        const { baseurl, history, scenarioId, location } = this.props;

        this.state = {
            activeSlideIndex,
            scenarioId
        };

        this.slideRefs = [];
        this.activateSlide = this.activateSlide.bind(this);

        this.getScenarioSlides();

        if (this.isScenarioRun) {
            const { pathname, search } = location;
            const pathToSlide = `${baseurl}/slide/${activeSlideIndex}${search}`;

            if (pathname !== pathToSlide) {
                history.push(pathToSlide);
            }
        }
    }

    get isScenarioRun() {
        return location.pathname.includes('/run/');
    }

    componentDidMount() {
        if (!this.isScenarioRun) {
            this.activateSlide(this.state.activeSlideIndex);
        }
    }

    getOnClickHandler(type) {
        if (!this.isScenarioRun) {
            return null;
        }

        const { baseurl, history, onSubmit } = this.props;
        switch (type) {
            case 'back':
                return () => {
                    if (onSubmit) {
                        onSubmit();
                    }
                    let activeSlideIndex = this.state.activeSlideIndex - 1;
                    this.setState({ activeSlideIndex });

                    const pathToSlide = `${baseurl}/slide/${activeSlideIndex}`;

                    if (location.pathname !== pathToSlide) {
                        history.push(pathToSlide);
                    }
                };
            case 'next':
            case 'finish':
                return () => {
                    if (onSubmit) {
                        onSubmit();
                    }

                    let activeSlideIndex = this.state.activeSlideIndex + 1;
                    this.setState({ activeSlideIndex });

                    const pathToSlide = `${baseurl}/slide/${activeSlideIndex}`;

                    if (location.pathname !== pathToSlide) {
                        history.push(pathToSlide);
                    }
                };
            default:
                return null;
        }
    }

    async getScenarioMetaData() {
        if (this.state.title && this.state.description) {
            const { title, description, consent, status } = this.state;

            this.props.setScenario({
                title,
                description,
                consent,
                status
            });

            return {
                title,
                description,
                consent,
                status
            };
        } else {
            const scenario = await this.props.getScenario(
                this.state.scenarioId
            );

            this.props.setScenario(scenario);

            return scenario;
        }
    }

    async getScenarioContent() {
        if (this.state.scenarioId) {
            const response = await fetch(
                `/api/scenarios/${this.state.scenarioId}/slides`
            );
            const { slides } = await response.json();
            return slides;
        }
        return null;
    }

    async getScenarioSlides() {
        const {
            baseurl,
            onResponseChange,
            onRunChange = () => {}
        } = this.props;

        const metaData = await this.getScenarioMetaData();
        const contents = await this.getScenarioContent();
        let finish = contents.find(slide => slide.is_finish) || null;

        if (finish) {
            // remove the "finish" slide from the returned slides,
            // to prevent it from being treated like a regular
            // content slide.
            contents.splice(contents.indexOf(finish), 1);
        }

        const slides = [
            <EntrySlide
                key="entry-slide"
                scenario={metaData}
                onChange={onRunChange}
                onClickNext={this.getOnClickHandler('next')}
            />
        ];

        contents.forEach((slide, index) => {
            const isLastSlide = index === contents.length - 1;
            slides.push(
                <ContentSlide
                    key={index}
                    slide={slide}
                    isLastSlide={isLastSlide}
                    onClickBack={this.getOnClickHandler('back')}
                    onClickNext={this.getOnClickHandler(
                        isLastSlide ? 'finish' : 'next'
                    )}
                    onResponseChange={onResponseChange}
                />
            );
        });

        // Add the "finish" slide to the very end of the scenario
        slides.push(
            <FinishSlide
                key="finish-slide"
                back={`${baseurl}/slide/${slides.length - 1}`}
                slide={finish}
                onChange={onRunChange}
            />
        );

        this.props.setSlides({ slides });
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

    render() {
        const { slides } = this.props;
        const { activeSlideIndex } = this.state;
        const classes = 'ui centered card scenario__card--run';
        return this.isScenarioRun ? (
            <Grid columns={1}>
                <Grid.Column>{slides && slides[activeSlideIndex]}</Grid.Column>
            </Grid>
        ) : (
            <Segment className="scenario__slide-preview-pane">
                {slides.map((slide, index) => {
                    const className =
                        activeSlideIndex === index - 1
                            ? `${classes} scenario__slide-preview--selected`
                            : classes;

                    return index === 0 || index === slides.length - 1 ? (
                        slide
                    ) : (
                        <div
                            className={className}
                            key={`div-${index}`}
                            onClick={() => this.activateSlide(index - 1)}
                        >
                            <Ref
                                key={`ref-${index}`}
                                innerRef={node =>
                                    (this.slideRefs[index - 1] = node)
                                }
                            >
                                {slide}
                            </Ref>
                        </div>
                    );
                })}
            </Segment>
        );
    }
}

Scenario.propTypes = {
    activeSlideIndex: PropTypes.number,
    setActiveSlide: PropTypes.func,
    baseurl: PropTypes.string,
    location: PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string,
        state: PropTypes.object
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            activeSlideIndex: PropTypes.node,
            id: PropTypes.node
        }).isRequired
    }),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }),
    scenarioId: PropTypes.node,
    getScenario: PropTypes.func.isRequired,
    setScenario: PropTypes.func.isRequired,
    setSlides: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    categories: PropTypes.array,
    slides: PropTypes.array,
    status: PropTypes.number,
    run: PropTypes.object,
    onResponseChange: PropTypes.func,
    onRunChange: PropTypes.func,
    onSubmit: PropTypes.func
};

function mapStateToProps(state) {
    const { title, description, consent, slides } = state.scenario;
    return { title, description, consent, slides };
}

const mapDispatchToProps = {
    getScenario,
    setScenario,
    setSlides
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Scenario)
);
