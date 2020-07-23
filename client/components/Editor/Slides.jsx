import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Grid,
  Icon,
  Menu,
  Popup,
  Ref,
  Segment
} from '@components/UI';
import { v4 as uuid } from 'uuid';
import Storage from '@utils/Storage';
import AddSlideMessage from '@components/AddSlideMessage';
import Loading from '@components/Loading';
import { notify } from '@components/Notification';
import Sortable from '@components/Sortable';
import SlideEditor from '@components/Slide/SlideEditor';
import MultiPathNetworkGraphModal from '@components/Slide/Components/MultiPathResponse/MultiPathNetworkGraphModal';
import SlideComponents from '@components/SlideComponents';
import scrollIntoView from '@components/util/scrollIntoView';
import { deleteSlide, getSlides, setSlides } from '@actions/scenario';
import './Slides.css';

class Slides extends React.Component {
  constructor(props) {
    super(props);

    const activeNonZeroSlideIndex =
      Number(this.props.match.params.activeNonZeroSlideIndex) || 1;

    this.sessionKey = `slides/${this.props.scenario.id}`;

    const { activeSlideIndex, minimized } = Storage.merge(
      this.sessionKey,
      persisted => {
        const {
          activeSlideIndex = activeNonZeroSlideIndex - 1,
          minimized = false
        } = persisted;

        return {
          ...persisted,
          activeSlideIndex,
          minimized
        };
      }
    );

    const graphOpen = false;
    const isReady = false;
    const slides = [];

    this.state = {
      activeSlideIndex,
      graphOpen,
      isReady,
      minimized,
      slides
    };

    this.slideRefs = [];
    this.debouncers = {};
    this.activateSlide = this.activateSlide.bind(this);
    this.onSlideAdd = this.onSlideAdd.bind(this);
    this.onSlideChange = this.onSlideChange.bind(this);
    this.onSlideDelete = this.onSlideDelete.bind(this);
    this.onSlideDuplicate = this.onSlideDuplicate.bind(this);
    this.onSlideOrderChange = this.onSlideOrderChange.bind(this);
    this.onSlideMinMaxChange = this.onSlideMinMaxChange.bind(this);
  }

  async componentDidMount() {
    await this.fetchSlides();
  }

  async fetchSlides() {
    const { getSlides, scenarioId } = this.props;
    const { activeSlideIndex } = this.state;
    const slides = (await getSlides(scenarioId)).filter(
      slide => !slide.is_finish
    );

    if (slides.length === 0) {
      await this.onSlideAdd();
    } else {
      this.activateSlide({
        activeSlideIndex,
        slides,
        isReady: true
      });
    }
  }

  componentDidUpdate() {
    const { activeSlideIndex, minimized } = this.state;
    Storage.set(this.sessionKey, { activeSlideIndex, minimized });
  }

  onSlideChange(activeSlideIndex, value) {
    const { scenarioId } = this.props;
    const { slides } = this.state;
    const slide = slides[activeSlideIndex];
    const slideId = slide.id;

    const newSlide = {
      ...slide,
      ...value
    };

    slides[activeSlideIndex] = newSlide;

    this.setState({ slides, activeSlideIndex });

    clearTimeout(this.debouncers[slideId]);
    this.debouncers[slideId] = setTimeout(async () => {
      // TODO: Move to own async action
      const result = await fetch(
        `/api/scenarios/${scenarioId}/slides/${slideId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newSlide)
        }
      );
      await result.json();
      notify({ type: 'success', message: 'Slide saved' });
    }, 200);
  }

  moveSlide(fromIndex, activeSlideIndex) {
    const { scenarioId } = this.props;
    const { slides } = this.state;
    const moving = slides[fromIndex];
    slides.splice(fromIndex, 1);
    slides.splice(activeSlideIndex, 0, moving);
    this.activateSlide({ slides, activeSlideIndex }, async () => {
      const result = await fetch(`/api/scenarios/${scenarioId}/slides/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slides })
      });
      await result.json();
      notify({ type: 'success', message: 'Slide moved' });
    });
  }

  onSlideDelete(index) {
    const { scenarioId } = this.props;
    const slide = this.state.slides[index];

    if (!slide || !slide.id) {
      // There's no slide to delete, so quietly ignore
      return;
    }

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

    if (activeSlideIndex < 0) {
      activeSlideIndex = 0;
    }

    this.activateSlide({ slides, activeSlideIndex }, async () => {
      await this.props.deleteSlide(scenarioId, slide.id);
      notify({ type: 'success', message: 'Slide deleted' });
    });
  }

  async onSlideDuplicate(index) {
    const { title, components: sourceComponents } = this.state.slides[index];
    // Map source slide's components to a set of new components.
    const components = sourceComponents.map(sourceComponent => {
      const newProps = {};

      // If the "sourceComponent" is a prompt/response component, assign it a
      // newly generated "responseId" and "header" to prevent duplicate
      // "responseId" values from being created.
      //
      // NOTE: the "header" can be changed by the user in the component editor
      if (sourceComponent.responseId) {
        newProps.responseId = uuid();
        newProps.header = `${sourceComponent.header} (COPY)`;
      }

      return Object.assign({}, sourceComponent, newProps);
    });

    const activeSlideIndex = await this.storeSlide({
      title,
      components
    });

    this.activateSlide(activeSlideIndex);
  }

  async onSlideAdd() {
    const activeSlideIndex = await this.storeSlide({
      title: '',
      components: []
    });

    this.activateSlide(activeSlideIndex);
  }

  activateSlide(state, callback = async () => {}) {
    let updatedState = state;

    if (Array.isArray(state)) {
      updatedState = {
        slides: state
      };
    }
    if (typeof state === 'number') {
      updatedState = {
        activeSlideIndex: state
      };
    }
    if (updatedState.activeSlideIndex !== -1) {
      this.setState(updatedState, () => {
        const { activeSlideIndex, minimized } = this.state;

        if (this.slideRefs[activeSlideIndex]) {
          scrollIntoView(this.slideRefs[activeSlideIndex]);
        }
        // Don't let the initial state.isReady call trigger this
        // slide activator
        if (!state.isReady) {
          this.props.setActiveSlide(activeSlideIndex);
        }

        Storage.set(this.sessionKey, { activeSlideIndex, minimized });
        callback();
      });
    }
  }

  async storeSlide(slide) {
    // TODO: Move this into own async action
    const res = await fetch(`/api/scenarios/${this.props.scenarioId}/slides`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(slide)
    });
    const {
      slide: { id }
    } = await res.json();
    notify({ type: 'info', message: 'Slide added' });
    await this.fetchSlides();
    const orderIndex = this.state.slides.findIndex(slide => slide.id === id);
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

  onSlideOrderChange(fromIndex, toIndex) {
    this.moveSlide(fromIndex, toIndex);
  }

  onSlideMinMaxChange() {
    const { minimized } = this.state;

    this.setState({ minimized: !minimized });
  }

  render() {
    const {
      onSlideAdd,
      onSlideChange,
      onSlideDelete,
      onSlideDuplicate,
      onSlideMinMaxChange,
      onSlideOrderChange
    } = this;
    const { scenario } = this.props;
    const { activeSlideIndex, graphOpen, isReady, minimized } = this.state;
    const slides = this.state.slides.filter(slide => !slide.is_finish);
    const minMaxIcon = `window ${minimized ? 'maximize' : 'minimize'} outline`;
    const minMaxText = `Slides ${minimized ? 'preview' : 'outline'}`;
    const minMaxHide = minimized ? { hidden: true } : {};

    const noSlide = !slides[activeSlideIndex];
    const promptToAddSlide = noSlide ? (
      <AddSlideMessage onClick={onSlideAdd} />
    ) : null;

    const multiPathNetworkGraphModal = graphOpen ? (
      <MultiPathNetworkGraphModal
        onClose={() => this.setState({ graphOpen: false })}
        open={graphOpen}
        scenario={scenario}
      />
    ) : null;

    return (
      <Container fluid>
        <Grid className="slides__editor-all-outer-container">
          <Grid.Column className="slides__list-outer-container" width={3}>
            {isReady ? (
              <>
                <Grid.Row>
                  <Menu icon borderless className="em__height">
                    <Popup
                      size="small"
                      content="Add a slide"
                      trigger={
                        <Menu.Item name="Add a slide" onClick={onSlideAdd}>
                          <Icon
                            size="large"
                            name="plus square outline"
                            className="em__icon-group-margin"
                          />
                        </Menu.Item>
                      }
                    />
                    {slides.length > 0 && (
                      <Menu.Menu
                        className="movers"
                        key="menu-item-slide-column-right"
                        position="right"
                      >
                        <Popup
                          size="small"
                          content="View slides graph"
                          trigger={
                            <Menu.Item
                              name="Add a slide"
                              onClick={() => this.setState({ graphOpen: true })}
                            >
                              <Icon
                                name="fork"
                                style={{ transform: 'rotate(90deg)' }}
                              />
                            </Menu.Item>
                          }
                        />
                        <Popup
                          size="small"
                          content={minMaxText}
                          trigger={
                            <Menu.Item
                              key="menu-item-slide-min-max-toggler"
                              onClick={onSlideMinMaxChange}
                            >
                              <Icon name={minMaxIcon} />
                            </Menu.Item>
                          }
                        />
                      </Menu.Menu>
                    )}
                  </Menu>
                  {multiPathNetworkGraphModal}
                </Grid.Row>

                <Segment className="slides__list-inner-container">
                  {slides.length === 0 && promptToAddSlide}
                  <Sortable onChange={onSlideOrderChange}>
                    {slides.map((slide, index) => {
                      const isActiveSlide = index === activeSlideIndex;
                      const className = isActiveSlide
                        ? 'slides__list-card sortable__selected'
                        : 'slides__list-card';
                      const onActivateSlideClick = () => {
                        // Update the UI as soon as possible
                        this.setState({
                          activeSlideIndex: index
                        });
                        this.activateSlide(index);
                      };
                      const description = index + 1;
                      return (
                        <Grid.Row key={slide.id} className="slides__list-row">
                          <Ref
                            innerRef={node => (this.slideRefs[index] = node)}
                          >
                            <Card
                              className={className}
                              onClick={onActivateSlideClick}
                            >
                              <Card.Content className="slides__list-card-content-header">
                                <Card.Header>
                                  <Menu
                                    size="mini"
                                    secondary
                                    className="slides__list-card-header-menu-items"
                                    style={{ margin: '0 !important' }}
                                  >
                                    <Menu.Item name={`${index + 1}`} />

                                    {slide.title && (
                                      <Menu.Item
                                        className="slides__list-card-header-title"
                                        name={slide.title}
                                        content={slide.title}
                                      />
                                    )}

                                    {isActiveSlide ? (
                                      <Menu.Menu
                                        key="menu-slides-order-change"
                                        position="right"
                                      >
                                        <Button
                                          key="menu-slides-move-up"
                                          icon="caret up"
                                          aria-label={`Move slide ${description} up`}
                                          disabled={index === 0}
                                          onClick={event => {
                                            event.stopPropagation();
                                            onSlideOrderChange(
                                              index,
                                              index - 1
                                            );
                                          }}
                                        />
                                        <Button
                                          key="menu-slides-move-down"
                                          icon="caret down"
                                          aria-label={`Move slide ${description} down`}
                                          disabled={index === slides.length - 1}
                                          onClick={event => {
                                            event.stopPropagation();
                                            onSlideOrderChange(
                                              index,
                                              index + 1
                                            );
                                          }}
                                        />
                                      </Menu.Menu>
                                    ) : null}
                                  </Menu>
                                </Card.Header>
                              </Card.Content>
                              {!minimized ? (
                                <Card.Content
                                  {...minMaxHide}
                                  className="slides__list-card-content"
                                >
                                  <SlideComponents
                                    asSVG={true}
                                    components={slide.components}
                                  />
                                </Card.Content>
                              ) : null}
                            </Card>
                          </Ref>
                        </Grid.Row>
                      );
                    })}
                  </Sortable>
                </Segment>
              </>
            ) : (
              <Loading
                group={{
                  style: {
                    marginTop: '0.5em',
                    marginLeft: '0.1em',
                    marginRight: '0'
                  }
                }}
                card={{
                  cols: 1,
                  rows: 4,
                  style: {
                    height: '11.8em',
                    marginTop: '0',
                    marginRight: '0',
                    marginBottom: '0.5em',
                    marginLeft: '0'
                  }
                }}
              />
            )}
          </Grid.Column>
          <Grid.Column className="slides__editor-outer-container">
            {isReady ? (
              <SlideEditor
                key={`slide-editor-${activeSlideIndex}`}
                index={activeSlideIndex}
                noSlide={noSlide}
                promptToAddSlide={promptToAddSlide}
                onChange={onSlideChange}
                onDelete={onSlideDelete}
                onDuplicate={onSlideDuplicate}
                scenario={scenario}
                slides={slides}
                {...slides[activeSlideIndex]}
              />
            ) : (
              <Loading
                card={{
                  cols: 1,
                  rows: 1,
                  style: { height: 'calc(100% - 10px)', marginTop: '0.5em' }
                }}
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
  deleteSlide: PropTypes.func,
  getSlides: PropTypes.func,
  setSlides: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      activeNonZeroSlideIndex: PropTypes.node,
      activeSlideIndex: PropTypes.node,
      id: PropTypes.node
    }).isRequired
  }),
  scenario: PropTypes.object,
  scenarioId: PropTypes.node,
  setActiveSlide: PropTypes.func
};

const mapStateToProps = state => {
  const { scenario } = state;
  return {
    scenario
  };
};

const mapDispatchToProps = dispatch => ({
  deleteSlide: (...params) => dispatch(deleteSlide(...params)),
  getSlides: params => dispatch(getSlides(params)),
  setSlides: params => dispatch(setSlides(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Slides)
);
