import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, Icon, Popup } from '@components/UI';
import Storage from '@utils/Storage';
import SlideComponents from '@components/SlideComponents';
import { getResponse } from '@actions/response';

const hasValidNavigationOverrider = component => {
  return component.disableDefaultNavigation && component.paths.length;
};

const hasValidPromptOptions = component => {
  if (component.paths && component.paths.length === 0) {
    return false;
  }
  if (component.buttons && component.buttons.length === 0) {
    return false;
  }
  if (Reflect.has(component, 'url') && !component.url) {
    return false;
  }
  return true;
};

const hasValidPrompt = component => {
  return component.responseId && hasValidPromptOptions(component);
};

class ContentSlide extends React.Component {
  constructor(props) {
    super(props);

    const {
      slide: { components }
    } = this.props;

    const required = components.reduce((accum, component) => {
      if (component.required) {
        let mustTrackRequiredPrompt = true;

        if (!hasValidNavigationOverrider(component)) {
          const isValidPrompt = hasValidPromptOptions(component);

          if (isValidPrompt !== mustTrackRequiredPrompt) {
            mustTrackRequiredPrompt = isValidPrompt;
          }
        }

        if (hasValidNavigationOverrider(component)) {
          mustTrackRequiredPrompt = false;
        }

        if (mustTrackRequiredPrompt) {
          accum.push(component.responseId);
        }
      }
      return accum;
    }, []);

    this.state = {
      isReady: false,
      // Provides a reference to compare
      // prompt responseIds as the value
      // changes.
      required,
      // Tracks prompt input, but must be a copy
      pending: required.slice(),
      // Skip button display
      skipButton: 'Choose to Skip',
      skipOrKeep: 'skip'
    };

    this.onSkip = this.onSkip.bind(this);
    this.onInterceptResponseChange = this.onInterceptResponseChange.bind(this);
  }

  get isScenarioRun() {
    return location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      this.setState({
        isReady: true
      });
      return;
    }

    let {
      getResponse,
      responsesById,
      run: { id },
      slide: { components }
    } = this.props;

    for (let { responseId } of components) {
      if (responseId && !responsesById[responseId]) {
        await getResponse({ id, responseId });
      }
    }

    const pending = this.state.pending.filter(
      responseId => !this.props.responsesById[responseId]
    );

    this.setState({
      isReady: true,
      hasChanged: false,
      pending
    });

    if (this.isScenarioRun) {
      window.scrollTo(0, 0);
    }
  }

  onSkip(event, { name }) {
    const { onNextClick, onResponseChange, slide } = this.props;
    const isSkip = true;
    const value = '';

    if (!this.props.run || (this.props.run && !this.props.run.id)) {
      // TODO: implement some kind of feedback to
      // make previewer aware that Preview mode
      // does not function like Run mode.
      // alert('Slides cannot be skipped in Preview');
      return null;
    }

    if (name === 'skip') {
      slide.components.forEach(({ responseId, type }) => {
        if (responseId) {
          const name = responseId;
          onResponseChange(event, {
            created_at: new Date().toISOString(),
            ended_at: new Date().toISOString(),
            isSkip,
            name,
            type,
            value
          });
        }
      });
    }

    onNextClick();
  }

  onInterceptResponseChange(event, data) {
    const { name, value } = data;
    const { pending, required } = this.state;
    if (!this.props.run || (this.props.run && !this.props.run.id)) {
      // TODO: implement some kind of feedback to
      // make previewer aware that Preview mode
      // does not function like Run mode.
      // alert('Slides cannot accept responses in Preview');
      return null;
    }

    const { run } = this.props;

    // If we have a response change for a responseId that
    // was marked required, and the value isn't empty,
    // then it can be removed from the list.
    if (required.includes(name)) {
      if (value !== '') {
        if (pending.includes(name)) {
          pending.splice(pending.indexOf(name), 1);
        }
      } else {
        // Otherwise, if it is not empty, but was
        // previously removed, add it back.
        pending.push(name);
      }
    }

    this.props.onRequiredPromptChange(pending.length);

    if (!data.isFulfilled) {
      this.props.onResponseChange(event, data);
      if (run && run.id) {
        Storage.set(`run/${run.id}/${name}`, data);
      }
      this.setState({
        hasChanged: true,
        pending,
        skipButton: 'Choose to skip',
        skipOrKeep: 'skip'
      });
    } else {
      this.setState({
        pending,
        skipButton: 'Keep and continue',
        skipOrKeep: 'keep'
      });
    }
  }

  render() {
    const {
      isReady,
      hasChanged,
      pending,
      required,
      skipButton,
      skipOrKeep
    } = this.state;
    const {
      isContextual,
      isLastSlide,
      onBackClick,
      onGotoClick,
      onNextClick,
      run,
      slide
    } = this.props;
    const { onInterceptResponseChange, onSkip } = this;

    if (!isReady) {
      return null;
    }
    const cardClass = this.isScenarioRun
      ? 'scenario__slide-card'
      : 'scenario__slide-card-preview';
    const runOnly = run ? { run } : {};
    const hasPrompt = slide.components.some(hasValidPrompt);
    const hasOwnNavigation = slide.components.some(hasValidNavigationOverrider);

    const proceedButtonLabel = hasPrompt ? 'Submit' : 'Next';
    const submitNextOrFinish = isLastSlide ? 'Finish' : proceedButtonLabel;

    const awaitingRequiredPrompts = (
      <React.Fragment>
        <Icon name="asterisk" /> Required
      </React.Fragment>
    );

    const hasPendingRequiredFields = !!required.length && !!pending.length;
    const onClick = hasPendingRequiredFields ? () => {} : onNextClick;
    const color = hasPendingRequiredFields ? 'red' : 'green';
    const content = hasPendingRequiredFields
      ? awaitingRequiredPrompts
      : submitNextOrFinish;
    let ariaLabel = hasPendingRequiredFields
      ? `There are ${pending.length} pending prompts that require a response`
      : 'Click to submit your responses to these prompts';

    if (!hasPrompt && !pending.length) {
      ariaLabel = 'Click to proceed to the next slide';
    }

    const fwdButtonProps = {
      'aria-label': ariaLabel,
      color,
      content,
      onClick
    };

    let fwdButtonTip = hasPrompt
      ? 'Submit and go to next slide'
      : 'Go to the next slide';

    let skipButtonTip =
      skipOrKeep === 'skip'
        ? 'Skip these prompts and continue'
        : 'Keep these responses and continue';

    let requiredReponses = ` (${pending.length} required response${
      pending.length > 1 ? 's are' : ' is'
    } not complete)`;
    fwdButtonTip += pending.length ? requiredReponses : '';

    let skipButtonContent = skipButton;

    if (isLastSlide) {
      skipButtonContent =
        skipOrKeep === 'skip' ? 'Skip and finish' : 'Keep and finish';
      skipButtonTip = 'Skip these prompts and finish';
      fwdButtonTip = 'Finish';
    }

    const onResponseChange = (event, data) => {
      if (this.isScenarioRun) {
        onInterceptResponseChange(event, data);

        // Both must agree!!
        if (hasOwnNavigation && data.hasOwnNavigation) {
          onGotoClick(event, data);
        }
      }
    };

    let scenarioCardContentClass = this.isScenarioRun
      ? 'scenario__slide-card-content'
      : 'scenario__slide-card-content-preview';

    if (!slide.title) {
      scenarioCardContentClass += ` no-title`;
    }

    return (
      <Card id={slide.id} key={slide.id} centered className={cardClass}>
        {slide.title ? (
          <Card.Content className="scenario__slide-card-header">
            <Card.Header tabIndex="0">{slide.title}</Card.Header>
          </Card.Content>
        ) : null}
        <Card.Content
          tabIndex="0"
          className={scenarioCardContentClass}
          key={`content${slide.id}`}
        >
          <SlideComponents
            {...runOnly}
            components={slide.components}
            onResponseChange={onResponseChange}
          />
        </Card.Content>
        {!isContextual ? (
          <Card.Content extra>
            <Popup
              size="small"
              content="Go back to the previous slide"
              trigger={
                <Button
                  color="grey"
                  content="Previous"
                  floated="left"
                  onClick={onBackClick}
                />
              }
            />
            {!hasOwnNavigation ? (
              <Button.Group floated="right">
                {hasPrompt && !hasPendingRequiredFields && !hasChanged ? (
                  <Popup
                    size="small"
                    content={skipButtonTip}
                    trigger={
                      <Button
                        color="yellow"
                        aria-label={skipButtonTip}
                        name={skipOrKeep}
                        onClick={onSkip}
                        content={skipButtonContent}
                      />
                    }
                  />
                ) : (
                  <Popup
                    size="small"
                    content={fwdButtonTip}
                    trigger={<Button {...fwdButtonProps} />}
                  />
                )}
              </Button.Group>
            ) : null}
          </Card.Content>
        ) : null}
      </Card>
    );
  }
}

ContentSlide.propTypes = {
  getResponse: PropTypes.func,
  isContextual: PropTypes.bool,
  isLastSlide: PropTypes.bool,
  onGotoClick: PropTypes.func,
  onBackClick: PropTypes.func,
  onNextClick: PropTypes.func,
  onRequiredPromptChange: PropTypes.func,
  onResponseChange: PropTypes.func,
  responsesById: PropTypes.object,
  run: PropTypes.object,
  slide: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { run, responsesById } = state;
  const isContextual = ownProps.isContextual || false;
  return { isContextual, run, responsesById };
};

const mapDispatchToProps = dispatch => ({
  getResponse: params => dispatch(getResponse(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentSlide);
