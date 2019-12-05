import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';

import ContentSlide from './ContentSlide';
import EntrySlide from './EntrySlide';
import FinishSlide from './FinishSlide';
import { getScenario, setScenario, setSlides } from '@client/actions/scenario';
import './Scenario.css';

class Scenario extends Component {
    constructor(props) {
        super(props);

        // Check for data from route or props
        this.state = Object.assign(
            {},
            {
                scenarioId: this.props.scenarioId,
                activeSlideIndex: 0
            },
            this.props.location ? this.props.location.state : null,

            // If there is an activeSlideIndex, it will be here
            this.props.match ? this.props.match.params : null
        );

        // ...but this.props.match.params.activeSlideIndex is
        // a string and we don't want that.
        this.state.activeSlideIndex = Number(this.state.activeSlideIndex);

        this.getScenarioSlides();

        if (this.isScenarioRun) {
            const pathToSlide = `/run/${this.props.scenarioId}/${this.state.activeSlideIndex}`;

            if (location.pathname !== pathToSlide) {
                this.props.history.push(pathToSlide);
            }
        }
    }

    get isScenarioRun() {
        return location.pathname.includes('/run/');
    }

    getOnClickHandler(type) {
        if (!this.isScenarioRun) {
            return null;
        }

        const { onSubmit } = this.props;
        switch (type) {
            case 'back':
                return () => {
                    if (onSubmit) {
                        onSubmit();
                    }
                    let activeSlideIndex = this.state.activeSlideIndex - 1;
                    this.setState({ activeSlideIndex });

                    const pathToSlide = `/run/${this.props.scenarioId}/${activeSlideIndex}`;

                    if (location.pathname !== pathToSlide) {
                        this.props.history.push(pathToSlide);
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

                    const pathToSlide = `/run/${this.props.scenarioId}/${activeSlideIndex}`;

                    if (location.pathname !== pathToSlide) {
                        this.props.history.push(pathToSlide);
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
        const { onResponseChange, onRunChange, scenarioId } = this.props;
        const metaData = await this.getScenarioMetaData();
        const contents = await this.getScenarioContent();
        const finish = contents.find(slide => slide.is_finish);
        // remove the "finish" slide from the returned slides,
        // to prevent it from being treated like a regular
        // content slide.
        contents.splice(contents.indexOf(finish), 1);

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
                back={`/run/${scenarioId}/${slides.length - 1}`}
                slide={finish}
                onChange={onRunChange}
            />
        );

        this.props.setSlides({ slides });
    }

    render() {
        const { slides } = this.props;
        return this.isScenarioRun ? (
            <Grid columns={1}>
                <Grid.Column>
                    {slides && slides[this.state.activeSlideIndex]}
                </Grid.Column>
            </Grid>
        ) : (
            <Segment className="scenario__slide-preview-pane">{slides}</Segment>
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
