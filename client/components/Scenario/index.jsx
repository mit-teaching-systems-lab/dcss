import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

import EntrySlide from './EntrySlide';
import ContentSlide from './ContentSlide';
import { setScenario, setSlides } from '@client/actions';
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
                    let activeSlideIndex = this.state.activeSlideIndex - 1;
                    this.setState({ activeSlideIndex });

                    const pathToSlide = `/run/${this.props.scenarioId}/${activeSlideIndex}`;

                    if (location.pathname !== pathToSlide) {
                        this.props.history.push(pathToSlide);
                    }
                };
            case 'next':
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
            case 'finish':
                return () => {
                    alert('FINISHED!');
                    if (onSubmit) {
                        onSubmit();
                    }
                };
            default:
                return null;
        }
    }

    async getScenarioMetaData() {
        let title, description, consent, status;

        if (this.state.title && this.state.description) {
            this.props.setScenario({
                title: this.state.title,
                description: this.state.description,
                consent: this.state.consent
            });
            title = this.state.title;
            description = this.state.description;
            consent = this.state.consent;
            status = this.state.status;
        } else {
            const response = await (await fetch(
                `/api/scenarios/${this.state.scenarioId}`
            )).json();
            const scenario = response.scenario;

            if (response.status === 200) {
                this.props.setScenario(scenario);
                title = scenario.title;
                description = scenario.description;
                consent = scenario.consent;
                status = scenario.status;
            }
        }

        return { title, description, consent, status };
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
        const metaData = await this.getScenarioMetaData();
        const contents = await this.getScenarioContent();

        const slides = [
            <EntrySlide
                key="entry-slide"
                scenario={metaData}
                onChange={this.props.onRunChange}
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
                    onResponseChange={this.props.onResponseChange}
                />
            );
        });

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
            <Grid columns={1}>
                <Grid.Column>{slides}</Grid.Column>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    const { title, description, consent, slides } = state.scenario;
    return { title, description, consent, slides };
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
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }),
    scenarioId: PropTypes.node,
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

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Scenario)
);
