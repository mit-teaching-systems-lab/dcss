import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Ref, Segment } from '@components/UI';

import scrollIntoView from '@utils/scrollIntoView';
import ContentSlide from './ContentSlide';
import EntrySlide from './EntrySlide';
import FinishSlide from './FinishSlide';
import Boundary from '@components/Boundary';
import Loading from '@components/Loading';
import Media from '@utils/Media';
import Storage from '@utils/Storage';
import { getSlides, getScenario, setScenario } from '@actions/scenario';
import withRunEventCapturing, {
  SCENARIO_START,
  SLIDE_GOTO,
  SLIDE_NEXT,
  SLIDE_PREVIOUS
} from '@hoc/withRunEventCapturing';
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

    this.hasRequiredPrompts = false;
    this.slides = [];
    this.slideHistory = [];
    this.slideRefs = [];
    this.slideRefIndex = -1;
    this.activateSlide = this.activateSlide.bind(this);

    if (this.isScenarioRun) {
      this.runKey = cohortId
        ? `cohort/${cohortId}/run/${scenarioId}`
        : `run/${scenarioId}`;

      const { slideHistory } = Storage.merge(this.runKey, {
        slideHistory: [0]
      });

      this.slideHistory.push(...slideHistory);

      const { pathname, search } = location;
      const pathToSlide = `${baseurl}/slide/${activeRunSlideIndex}${search}`;

      if (pathname !== pathToSlide) {
        history.push(pathToSlide, {
          search,
          activeRunSlideIndex
        });
      }
    }
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
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

          const formerRunSlideIndex = this.state.activeRunSlideIndex;

          // Pop the last slide index from slide history, or get the
          // active slide index, minus 1, and go there.
          const activeRunSlideIndex =
            this.slideHistory.pop() || this.state.activeRunSlideIndex - 1;
          const pathToSlide = `${baseurl}/slide/${activeRunSlideIndex}`;

          this.props.saveRunEvent(SLIDE_PREVIOUS, {
            url: location.href,
            timestamp: Date.now(),
            from: {
              pathname: location.pathname,
              slide: this.slides[formerRunSlideIndex - 1]
            },
            to: {
              pathname: pathToSlide,
              slide: this.slides[activeRunSlideIndex - 1]
            }
          });

          (async () => {
            if (onSubmit) {
              await onSubmit();
            }

            this.setState({ activeRunSlideIndex }, () => {
              if (location.pathname !== pathToSlide) {
                history.push(pathToSlide);
              }
            });
          })();
        };
      case 'goto':
        return (event, { value: nextSlideId }) => {
          if (!this.isScenarioRun) {
            event.stopPropagation();
          }

          if (this.hasRequiredPrompts) {
            alert('You still have required prompts to respond to.');
            return;
          }

          const { slideHistory } = this;

          // Set the former run slide to the value stored for the active run slide
          const formerRunSlideIndex = this.state.activeRunSlideIndex;
          slideHistory.push(formerRunSlideIndex);
          Storage.merge(this.runKey, { slideHistory });

          // Set the active run slide to the next slide index + 1
          const nextSlideIndex = this.slides.findIndex(
            slide => slide.id === nextSlideId
          );

          const activeRunSlideIndex = nextSlideIndex + 1;
          const pathToSlide = `${baseurl}/slide/${activeRunSlideIndex}`;

          this.props.saveRunEvent(SLIDE_GOTO, {
            url: location.href,
            timestamp: Date.now(),
            from: {
              pathname: location.pathname,
              slide: this.slides[formerRunSlideIndex - 1]
            },
            to: {
              pathname: pathToSlide,
              slide: this.slides[activeRunSlideIndex - 1]
            }
          });

          (async () => {
            if (onSubmit) {
              await onSubmit();
            }

            this.setState({ activeRunSlideIndex }, () => {
              if (location.pathname !== pathToSlide) {
                history.push(pathToSlide);
              }
            });
          })();
        };
      case 'next':
      case 'start':
      case 'finish':
        return event => {
          if (!this.isScenarioRun) {
            event.stopPropagation();
          }

          const formerRunSlideIndex = this.state.activeRunSlideIndex;
          const activeRunSlideIndex = formerRunSlideIndex + 1;
          const pathToSlide = `${baseurl}/slide/${activeRunSlideIndex}`;
          this.slideHistory.push(formerRunSlideIndex);

          if (type === 'start') {
            this.props.saveRunEvent(SCENARIO_START, {
              scenario: this.props.scenario
            });
          } else {
            this.props.saveRunEvent(SLIDE_NEXT, {
              url: location.href,
              timestamp: Date.now(),
              from: {
                pathname: location.pathname,
                slide: this.slides[formerRunSlideIndex - 1]
              },
              to: {
                pathname: pathToSlide,
                slide: this.slides[activeRunSlideIndex - 1]
              }
            });
          }

          (async () => {
            if (onSubmit) {
              await onSubmit();
            }

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

  async componentDidMount() {
    const {
      cohortId,
      getScenario,
      getSlides,
      onResponseChange,
      onRunChange = () => {},
      saveRunEvent,
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

    // Create a backup of the raw slide contents for the click
    // handlers to access
    this.slides = contents.slice();

    this.slides.sort((a, b) => {
      return a.is_finish === b.is_finish ? 0 : a.is_finish ? 1 : -1;
    });

    if (finish) {
      // remove the "finish" slide from the returned slides,
      // to prevent it from being treated like a regular
      // content slide.
      contents.splice(contents.indexOf(finish), 1);
    }

    const microphone = this.slides.some(({ components }) =>
      components.some(c => Media.isAudioPrompt(c))
    );

    const permissions = {
      microphone
    };

    const slides = [
      <EntrySlide
        key="entry-slide"
        cohortId={cohortId}
        onChange={onRunChange}
        onNextClick={this.getOnClickHandler('start')}
        permissions={permissions}
        saveRunEvent={saveRunEvent}
        scenario={scenario}
        scenarioId={scenarioId}
      />
    ];

    contents.forEach((slide, index) => {
      const isLastSlide = index === contents.length - 1;
      slides.push(
        <ContentSlide
          key={index}
          cohortId={cohortId}
          isLastSlide={isLastSlide}
          onBackClick={this.getOnClickHandler('back')}
          onGotoClick={this.getOnClickHandler('goto')}
          onNextClick={this.getOnClickHandler(isLastSlide ? 'finish' : 'next')}
          onRequiredPromptChange={pending => {
            this.hasRequiredPrompts = !!pending;
          }}
          onResponseChange={onResponseChange}
          saveRunEvent={saveRunEvent}
          scenarioId={scenarioId}
          slide={slide}
        />
      );
    });

    // Add the "finish" slide to the very end of the scenario
    slides.push(
      <FinishSlide
        key="finish-slide"
        cohortId={cohortId}
        onBackClick={this.getOnClickHandler('back')}
        onChange={onRunChange}
        saveRunEvent={saveRunEvent}
        scenarioId={scenarioId}
        slide={finish}
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
    // This assignement only exists to keep modes separate below.
    const activeSlideIndex = activeRunSlideIndex;
    const classes = 'ui centered card scenario__slide-card';

    const loadingProps = {
      card: { cols: 1, rows: 1 },
      group: { style: { boxShadow: 'none' } }
    };

    if (!isReady) {
      return this.isScenarioRun ? (
        <div className={classes}>
          <Loading {...loadingProps} />
        </div>
      ) : null;
    }

    if (this.isScenarioRun) {
      const { run } = this.props;
      // As long as this run is unfinished, update the
      // the local state with the latest slide.
      if (!run.ended_at) {
        Storage.merge(this.runKey, { activeRunSlideIndex });
      } else {
        // Otherwise, delete the local state
        Storage.delete(this.runKey);
      }
    }

    return this.isScenarioRun ? (
      <Grid columns={1}>
        <Boundary top />
        <Grid.Column className="scenario__slide-column">
          {slides && slides[activeRunSlideIndex]}
        </Grid.Column>
      </Grid>
    ) : (
      <Segment className="scenario__slide-preview-viewport">
        {slides.map((slide, index) => {
          const isActiveSlide = activeSlideIndex === index;
          const className = isActiveSlide
            ? 'scenario__slide-preview scenario__slide-card-preview-selected'
            : 'scenario__slide-preview';

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
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object,
  scenarioId: PropTypes.node,
  setActiveSlide: PropTypes.func,
  setScenario: PropTypes.func.isRequired,
  slides: PropTypes.array,
  status: PropTypes.number,
  title: PropTypes.string,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const scenario =
    state.scenariosById[ownProps.scenarioId] || state.scenario || {};
  const { title, description, consent } = scenario;
  const { run, user } = state;
  return { title, description, consent, run, scenario, user };
};

const mapDispatchToProps = dispatch => ({
  getScenario: params => dispatch(getScenario(params)),
  getSlides: params => dispatch(getSlides(params)),
  setScenario
});

export default withRunEventCapturing(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(Scenario))
);
