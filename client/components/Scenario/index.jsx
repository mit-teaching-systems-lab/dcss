import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Ref, Segment } from 'semantic-ui-react';

import scrollIntoView from '@components/util/scrollIntoView';
import ContentSlide from './ContentSlide';
import EntrySlide from './EntrySlide';
import FinishSlide from './FinishSlide';
import Loading from '@components/Loading';
import Storage from '@utils/Storage';
import { getSlides, getScenario, setScenario } from '@actions/scenario';
import './Scenario.css';

class Scenario extends Component {
  constructor(props) {
    super(props);

    const isReady = false;
    // Used in Run mode
    const activeRunSlideIndex =
      Number(this.props.match.params.activeRunSlideIndex) || 0;

    // Used in Editor preview mode
    const {
      baseurl,
      history,
      location,
      // eslint-disable-next-line no-unused-vars
      cohortId,
      // eslint-disable-next-line no-unused-vars
      scenarioId
    } = this.props;

    this.state = {
      isReady,
      activeRunSlideIndex,
      slides: []
    };

    this.slideRefs = [];
    this.slideRefIndex = -1;
    this.activateSlide = this.activateSlide.bind(this);

    // if (this.isCohortScenarioRun) {
    //   Storage.set(`cohort/${cohortId}/run/${scenarioId}`, {
    //     activeRunSlideIndex
    //   });
    //   const { pathname, search } = location;
    //   const pathToSlide = `${baseurl}/slide/${activeRunSlideIndex}${search}`;

    //   if (pathname !== pathToSlide) {
    //     history.push(pathToSlide, { search, activeRunSlideIndex });
    //   }
    // }

    if (this.isScenarioRun) {
      const { pathname, search } = location;
      const pathToSlide = `${baseurl}/slide/${activeRunSlideIndex}${search}`;

      if (pathname !== pathToSlide) {
        history.push(pathToSlide, { search, activeRunSlideIndex });
      }
    }
  }

  get isScenarioRun() {
    return location.pathname.includes('/run/');
  }

  get isCohortScenarioRun() {
    return this.isScenarioRun && location.pathname.includes('/cohort/');
  }

  getOnClickHandler(type) {
    if (!this.isScenarioRun) {
      return null;
    }

    const { baseurl, history, onSubmit } = this.props;
    switch (type) {
      case 'back':
        return event => {
          if (!this.isScenarioRun) {
            event.stopPropagation();
          }

          (async () => {
            if (onSubmit) {
              await onSubmit();
            }
            const activeRunSlideIndex = this.state.activeRunSlideIndex - 1;
            const pathToSlide = `${baseurl}/slide/${activeRunSlideIndex}`;

            this.setState({ activeRunSlideIndex }, () => {
              if (location.pathname !== pathToSlide) {
                history.push(pathToSlide);
              }
            });
          })();
        };
      case 'next':
      case 'finish':
        return event => {
          if (!this.isScenarioRun) {
            event.stopPropagation();
          }

          (async () => {
            if (onSubmit) {
              await onSubmit();
            }
            const activeRunSlideIndex = this.state.activeRunSlideIndex + 1;
            const pathToSlide = `${baseurl}/slide/${activeRunSlideIndex}`;

            this.setState({ activeRunSlideIndex }, () => {
              if (location.pathname !== pathToSlide) {
                history.push(pathToSlide);
              }
            });
          })();
        };
      default:
        return null;
    }
  }

  getRunSlidePathname(type, zeroIndex) {
    if (!this.isScenarioRun) {
      return null;
    }

    const { baseurl } = this.props;

    let runSlideIndex = type === 'back' ? zeroIndex - 1 : zeroIndex + 1;

    if (runSlideIndex < 0) {
      runSlideIndex = 0;
    }

    return `${baseurl}/slide/${runSlideIndex}`;
  }

  async getScenarioMetaData() {
    if (this.state.title && this.state.description) {
      // eslint-disable-next-line no-console
      console.log('getScenarioMetaData, if clause');
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
      // eslint-disable-next-line no-console
      console.log('getScenarioMetaData, else clause');
      const scenario = await this.props.getScenario(this.props.scenarioId);

      // TODO: determine if this actually does anything
      this.props.setScenario(scenario);

      return scenario;
    }
  }

  // TODO: remove this and use getSlides()
  async getScenarioContent() {
    if (this.props.scenarioId) {
      const response = await fetch(
        `/api/scenarios/${this.props.scenarioId}/slides`
      );
      const { slides } = await response.json();
      return slides;
    }
    return null;
  }

  async componentDidMount() {
    const {
      baseurl,
      cohortId,
      getScenario,
      getSlides,
      onResponseChange,
      onRunChange = () => {},
      scenarioId
    } = this.props;

    const scenario = await (this.props.scenario || getScenario(scenarioId));
    const contents = await getSlides(scenarioId);

    // Nice try! The requested scenario does not exist.
    if (!scenario) {
      this.props.history.push('/scenarios/');
      return;
    }

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
        cohortId={cohortId}
        scenarioId={scenarioId}
        scenario={scenario}
        onChange={onRunChange}
        onNextClick={this.getOnClickHandler('next')}
      />
    ];

    contents.forEach((slide, index) => {
      const isLastSlide = index === contents.length - 1;
      slides.push(
        <ContentSlide
          key={index}
          slide={slide}
          cohortId={cohortId}
          scenarioId={scenarioId}
          isLastSlide={isLastSlide}
          onBackClick={this.getOnClickHandler('back')}
          onNextClick={this.getOnClickHandler(isLastSlide ? 'finish' : 'next')}
          onResponseChange={onResponseChange}
        />
      );
    });

    // Add the "finish" slide to the very end of the scenario
    slides.push(
      <FinishSlide
        key="finish-slide"
        slide={finish}
        cohortId={cohortId}
        scenarioId={scenarioId}
        back={`${baseurl}/slide/${slides.length - 1}`}
        onChange={onRunChange}
      />
    );

    this.setState({ slides, isReady: true });
  }

  activateSlide(activeRunSlideIndex) {
    this.setState({ activeRunSlideIndex }, () => {
      this.props.setActiveSlide(activeRunSlideIndex);
      if (
        this.slideRefs[activeRunSlideIndex] &&
        this.slideRefIndex !== activeRunSlideIndex
      ) {
        // This prevents attempts to rescroll the slide
        // when you're on a very long slide that the
        // browser thinks you need to scroll to. :eyeroll:
        this.slideRefIndex = activeRunSlideIndex;
        scrollIntoView(this.slideRefs[activeRunSlideIndex], {
          block: 'start'
        });
      }
    });
  }

  render() {
    const { activeRunSlideIndex, isReady, slides } = this.state;

    // const activeSlideIndex = activeRunSlideIndex - 1;
    const activeSlideIndex = activeRunSlideIndex;
    const classes = 'ui centered card scenario__card--run';

    if (!isReady) {
      return this.isScenarioRun ? (
        <div className={classes}>
          <Loading card={{ cols: 1, rows: 1, style: { boxShadow: 'none' } }} />
        </div>
      ) : null;
    }

    const { cohortId, scenarioId, run } = this.props;

    if (run) {
      const runScenarioKey = `run/${scenarioId}`;
      const runCohortKey = `cohort/${cohortId}/run/${scenarioId}`;
      // As long as this run is unfinished, update the
      // the local state with the latest slide.
      if (!run.ended_at) {
        if (this.isScenarioRun) {
          Storage.set(runScenarioKey, {
            activeRunSlideIndex
          });
        }
        if (this.isCohortScenarioRun) {
          Storage.set(runCohortKey, {
            activeRunSlideIndex
          });
        }
      } else {
        // Otherwise, delete the local state
        if (this.isScenarioRun) {
          Storage.delete(runScenarioKey);
        }
        if (this.isCohortScenarioRun) {
          Storage.delete(runCohortKey);
        }
      }
    }

    return this.isScenarioRun ? (
      <Grid columns={1}>
        <Grid.Column>{slides && slides[activeRunSlideIndex]}</Grid.Column>
      </Grid>
    ) : (
      <Segment className="scenario__slide-preview-pane">
        {slides.map((slide, index) => {
          const isActiveSlide = activeSlideIndex === index;
          const className = isActiveSlide
            ? `${classes} scenario__slide-preview-selected`
            : classes;

          return index === 0 || index === slides.length - 1 ? (
            slide
          ) : (
            <div
              className={className}
              key={`div-${index}`}
              onClick={() => this.activateSlide(index)}
            >
              <Ref
                key={`ref-${index}`}
                innerRef={node =>
                  isActiveSlide &&
                  scrollIntoView(node, {
                    behavior: 'auto',
                    block: 'start'
                  })
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
  activeRunSlideIndex: PropTypes.number,
  activeSlideIndex: PropTypes.number,
  baseurl: PropTypes.string,
  categories: PropTypes.array,
  cohortId: PropTypes.node,
  description: PropTypes.string,
  getScenario: PropTypes.func.isRequired,
  getSlides: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      activeRunSlideIndex: PropTypes.node,
      id: PropTypes.node
    }).isRequired
  }),
  onResponseChange: PropTypes.func,
  onRunChange: PropTypes.func,
  onSubmit: PropTypes.func,
  run: PropTypes.object,
  scenario: PropTypes.object,
  scenarioId: PropTypes.node,
  setActiveSlide: PropTypes.func,
  setScenario: PropTypes.func.isRequired,
  slides: PropTypes.array,
  status: PropTypes.number,
  title: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  const scenario =
    state.scenariosById[ownProps.scenarioId] || state.scenario || {};
  const { title, description, consent } = scenario;
  const { run } = state;
  return { title, description, consent, run };
};

const mapDispatchToProps = dispatch => ({
  getScenario: params => dispatch(getScenario(params)),
  getSlides: params => dispatch(getSlides(params)),
  setScenario
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Scenario)
);
