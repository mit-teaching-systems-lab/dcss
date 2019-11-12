import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router';

import DescriptionSlide from './DescriptionSlide';
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
            this.props.match ? this.props.match.params : null
        );

        this.isScenarioRun = this.isScenarioRun.bind(this);
        this.getOnClickHandler = this.getOnClickHandler.bind(this);
        this.getSlideButton = this.getSlideButton.bind(this);
        this.getScenarioMetaData = this.getScenarioMetaData.bind(this);
        this.getScenarioContent = this.getScenarioContent.bind(this);
        this.getScenarioSlides = this.getScenarioSlides.bind(this);

        this.getScenarioSlides();
    }

    isScenarioRun() {
        return location.pathname.includes('/moment/') || this.props.runId;
    }

    getSlideButton(type) {
        const onClick = this.getOnClickHandler(type);

        return (
            <div className="scenario__card--button">
                <Button basic color="black" onClick={onClick}>
                    {type[0].toUpperCase() + type.slice(1)}
                </Button>
            </div>
        );
    }

    getOnClickHandler(type) {
        if (!this.isScenarioRun()) {
            return null;
        }

        switch (type) {
            case 'next':
                return () => {
                    let activeSlideIndex = this.state.activeSlideIndex;
                    activeSlideIndex++;
                    this.setState({ activeSlideIndex });
                };
            case 'finish':
                return () => {
                    this.props.history.push('/');
                };
            default:
                return null;
        }
    }

    async getScenarioMetaData() {
        let title, description;

        if (this.state.title && this.state.description) {
            this.props.setScenario({
                title: this.state.title,
                description: this.state.description
            });
            title = this.state.title;
            description = this.state.description;
        } else {
            const scenarioResponse = await (await fetch(
                `/api/scenarios/${this.state.scenarioId}`
            )).json();
            const scenario = scenarioResponse.scenario;

            if (scenarioResponse.status === 200) {
                this.props.setScenario({
                    title: scenario.title,
                    description: scenario.description
                });
                title = scenario.title;
                description = scenario.description;
            }
        }

        return { title, description };
    }

    async getScenarioContent() {
        if (this.state.scenarioId) {
            const res = await fetch(
                `/api/scenarios/${this.state.scenarioId}/slides`
            );
            const { slides } = await res.json();
            return slides;
        }
        return null;
    }

    async getScenarioSlides() {
        const cardClass = this.isScenarioRun()
            ? 'scenario__card--run'
            : 'scenario__card';
        const metaData = await this.getScenarioMetaData();
        const contentData = await this.getScenarioContent();
        // Check if the description slide is the last one
        const descriptionSlideButton = !contentData.length
            ? this.getSlideButton('finish')
            : this.getSlideButton('next');
        const descriptionSlide = DescriptionSlide(
            metaData,
            cardClass,
            descriptionSlideButton
        );
        const scenarioSlides = [];

        scenarioSlides.push(descriptionSlide);
        contentData.map((slide, index) => {
            const isLastSlide = index === contentData.length - 1;
            const slideButton = isLastSlide
                ? this.getSlideButton('finish')
                : this.getSlideButton('next');
            const displaySlide = ContentSlide(slide, cardClass, slideButton);
            scenarioSlides.push(displaySlide);
        });

        this.props.setSlides({
            slides: [...(scenarioSlides || [])]
        });
    }

    render() {
        const { slides } = this.props;
        return this.isScenarioRun() ? (
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
    const { title, description, slides } = state.scenario;
    return { title, description, slides };
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
    runId: PropTypes.number
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Scenario)
);
