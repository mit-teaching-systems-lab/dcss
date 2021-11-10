import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getChat, getLinkedChatUsersByChatId, setChat } from '@actions/chat';
import { setRun } from '@actions/run';
import { getResponse } from '@actions/response';
import SlideComponents from '@components/SlideComponents';
import {
  Button,
  Card,
  Dropdown,
  Header,
  Icon,
  Menu,
  Modal,
  Popup,
  Text
} from '@components/UI';
import { POINTER_SELECT, SLIDE_ARRIVAL } from '@hoc/withRunEventCapturing';
import Identity from '@utils/Identity';
import Layout from '@utils/Layout';
import Storage from '@utils/Storage';

const hasValidNavigationOverrider = component => {
  return component.disableDefaultNavigation && component.paths.length;
};

const hasNonmatchingPersonaId = (component, chatUser) => {
  return component.persona && component.persona.id !== chatUser.persona_id;
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

const hasChatPrompt = component => {
  return component.type === 'ChatPrompt';
};

const slideContainsOnlyNonRequiredChatPrompt = components => {
  let returnValue = false;

  for (const component of components) {
    if (component.type === 'ChatPrompt' && !component.required) {
      returnValue = true;
    } else {
      // If there are any other prompts, then return false
      if (component.responseId) {
        return false;
      }
    }
  }

  return returnValue;
};

class ContentSlide extends React.Component {
  constructor(props) {
    super(props);

    const {
      chat,
      run,
      slide: { components }
    } = this.props;

    const chatUser =
      chat && chat.id === run.chat_id && chat.users && chat.users.length
        ? chat.usersById[this.props.user.id]
        : null;

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

        if (hasNonmatchingPersonaId(component, chatUser)) {
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
      runWillEndConfirmation: {
        isOpen: false
      },
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

    this.previousSelection = '';
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onSkip = this.onSkip.bind(this);
    this.onInterceptResponseChange = this.onInterceptResponseChange.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  get isCohortScenarioRun() {
    return window.location.pathname.includes('/cohort/');
  }

  get isMultiparticipant() {
    return this.props.scenario.personas.length > 1;
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      this.setState({
        isReady: true
      });
      return;
    }

    let {
      responsesById,
      run,
      slide,
      slide: { components }
    } = this.props;

    for (let { responseId } of components) {
      if (responseId && !responsesById[responseId]) {
        await this.props.getResponse(run.id, responseId);
      }
    }

    const pending = this.state.pending.filter(
      responseId => !this.props.responsesById[responseId]
    );

    if (this.isMultiparticipant) {
      await this.props.getChat(this.props.chat.id);
      await this.props.getLinkedChatUsersByChatId(this.props.chat.id);
    }

    this.setState({
      isReady: true,
      hasChanged: false,
      pending
    });

    if (this.isScenarioRun) {
      window.scrollTo(0, 0);
    }

    this.props.saveRunEvent(SLIDE_ARRIVAL, { slide });
  }

  onPointerUp(/*event*/) {
    if (this.isScenarioRun) {
      const selection = (window.getSelection() || '').toString();
      if (selection) {
        if (selection !== this.previousSelection) {
          this.props.saveRunEvent(POINTER_SELECT, { selection });
        } else {
          // This was a "deselect", so clear the previous selection
          this.previousSelection = '';
        }
      }
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
    const { isFulfillmentOverride, name, value } = data;
    const { pending, required } = this.state;
    if (!this.props.run || (this.props.run && !this.props.run.id)) {
      // TODO: implement some kind of feedback to
      // make previewer aware that Preview mode
      // does not function like Run mode.
      // alert('Slides cannot accept responses in Preview');
      return null;
    }

    const { run } = this.props;

    // console.log("onInterceptResponseChange required:", required);
    // console.log("onInterceptResponseChange isFulfillmentOverride:", isFulfillmentOverride);

    // If we have a response change for a responseId that
    // was marked required, and the value isn't empty,
    // then it can be removed from the list.
    if (required.includes(name)) {
      if (value !== '' || isFulfillmentOverride) {
        if (pending.includes(name)) {
          pending.splice(pending.indexOf(name), 1);
        }
      } else {
        // If intercepted response change was NOT
        // a fulfillment signal, then we need to add
        // the response prompt id back, because for whatever
        // reason, it's now empty.
        //
        if (!data.isFulfilled) {
          // Otherwise, if it is not empty, but was
          // previously removed, add it back.
          pending.push(name);
        }
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
      saveRunEvent,
      slide
    } = this.props;
    const { onInterceptResponseChange, onPointerUp, onSkip } = this;

    if (!isReady) {
      return null;
    }

    const centeredCardClass = this.isScenarioRun
      ? 'scenario__slide-card unset-position'
      : 'scenario__slide-card-preview';

    const slideComponentsProps = run ? { run, saveRunEvent } : {};
    const hasChat = slide.components.some(hasChatPrompt);
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
      ? 'Submit and continue'
      : 'Go to the next slide';

    let skipButtonColor = 'yellow';
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
      if (slideContainsOnlyNonRequiredChatPrompt(slide.components)) {
        skipButtonColor = 'green';
        skipButtonContent = 'Finish';
        skipButtonTip = 'Finish';
      }
    } else {
      if (slideContainsOnlyNonRequiredChatPrompt(slide.components)) {
        skipButtonColor = 'green';
        skipButtonContent = 'Continue';
        skipButtonTip = 'Click here to continue to the next slide';
        fwdButtonTip = 'Continue';
      }
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

    const centeredOrMarginOverrideCardClass = hasChat
      ? `${centeredCardClass} margin-override`
      : centeredCardClass;

    const resolvedCardClass = Layout.isNotForMobile()
      ? centeredOrMarginOverrideCardClass
      : centeredCardClass;

    const onRunEndConfirm = async () => {
      const time = new Date().toISOString();
      const { chat, run, user } = this.props;
      const url = this.isCohortScenarioRun
        ? `/cohort/${Identity.toHash(this.props.cohort.id)}`
        : `/scenarios`;

      // Ensure that any pending responses are captured.
      await this.props.onSubmit();

      // This is used by Run to determine who ended the run
      Storage.set(`run/${run.id}/ender`, {
        ...user
      });

      // Close the chat for everyone
      if (this.isMultiparticipant) {
        await this.props.setChat(chat.id, {
          deleted_at: time,
          ended_at: time
        });
      }

      // Close this run (which will prompt other participants to
      // either end or continue alone)
      if (run) {
        await this.props.setRun(run.id, {
          ended_at: time
        });
      }

      // Redirect to either cohort or scenarios lists
      // Previously:
      // this.props.history.push(url);
      location.href = url;
    };

    const onRunEndClose = () => {
      this.setState({
        runWillEndConfirmation: {
          isOpen: false
        }
      });
    };

    return (
      <Fragment>
        <Card
          centered
          id={slide.id}
          key={slide.id}
          className={resolvedCardClass}
          onPointerUp={onPointerUp}
        >
          <Card.Content className="scenario__slide-card-header">
            <Card.Header tabIndex="0">
              {this.isScenarioRun ? (
                <Button.Group floated="right">
                  <Dropdown item icon="bars" tabIndex={0}>
                    <Dropdown.Menu>
                      {this.isCohortScenarioRun ? (
                        <Menu.Item.Tabbable
                          tabIndex={0}
                          onClick={() => {
                            this.props.history.push(
                              `/cohort/${Identity.toHash(this.props.cohort.id)}`
                            );
                          }}
                        >
                          Return to cohort
                        </Menu.Item.Tabbable>
                      ) : null}
                      <Menu.Item.Tabbable
                        tabIndex={0}
                        onClick={() => {
                          this.setState({
                            runWillEndConfirmation: {
                              isOpen: true
                            }
                          });
                        }}
                      >
                        End scenario run
                      </Menu.Item.Tabbable>
                    </Dropdown.Menu>
                  </Dropdown>
                </Button.Group>
              ) : null}
              {slide.title || null}
            </Card.Header>
          </Card.Content>

          <Card.Content
            tabIndex="0"
            className={scenarioCardContentClass}
            key={`content${slide.id}`}
          >
            <SlideComponents
              {...slideComponentsProps}
              components={slide.components}
              onResponseChange={onResponseChange}
            />
          </Card.Content>
          {!isContextual ? (
            <Card.Content extra>
              <Popup
                inverted
                size="tiny"
                content="Go to the previous slide"
                trigger={
                  <Button
                    aria-label="Go to the previous slide"
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
                      inverted
                      size="tiny"
                      content={skipButtonTip}
                      trigger={
                        <Button
                          aria-label={skipButtonTip}
                          color={skipButtonColor}
                          name={skipOrKeep}
                          onClick={onSkip}
                          content={skipButtonContent}
                        />
                      }
                    />
                  ) : (
                    <Popup
                      inverted
                      size="tiny"
                      content={fwdButtonTip}
                      trigger={<Button {...fwdButtonProps} />}
                    />
                  )}
                </Button.Group>
              ) : null}
            </Card.Content>
          ) : null}
        </Card>
        {this.state.runWillEndConfirmation.isOpen ? (
          <Modal.Accessible open>
            <Modal
              closeIcon
              open
              aria-modal="true"
              role="dialog"
              size="small"
              onClose={onRunEndClose}
            >
              <Header icon="group" content="End this scenario?" />
              <Modal.Content>
                <Text>
                  Are you sure you want to end this scenario run?{' '}
                  {this.isMultiparticipant ? (
                    <Fragment>
                      <br />
                      <br />
                      If you are currently in an active chat, ending this
                      scenario will close the chat for all other participants.
                    </Fragment>
                  ) : null}
                </Text>
              </Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button primary aria-label="Yes" onClick={onRunEndConfirm}>
                    Yes
                  </Button>
                  <Button.Or />
                  <Button aria-label="No" onClick={onRunEndClose}>
                    No
                  </Button>
                </Button.Group>
              </Modal.Actions>
              <div data-testid="end-scenario-dialog" />
            </Modal>
          </Modal.Accessible>
        ) : null}
      </Fragment>
    );
  }
}

ContentSlide.propTypes = {
  chat: PropTypes.object,
  cohort: PropTypes.object,
  getChat: PropTypes.func,
  setChat: PropTypes.func,
  getLinkedChatUsersByChatId: PropTypes.func,
  getResponse: PropTypes.func,
  history: PropTypes.object,
  isContextual: PropTypes.bool,
  isLastSlide: PropTypes.bool,
  onGotoClick: PropTypes.func,
  onBackClick: PropTypes.func,
  onNextClick: PropTypes.func,
  onRequiredPromptChange: PropTypes.func,
  onResponseChange: PropTypes.func,
  onSubmit: PropTypes.func,
  responsesById: PropTypes.object,
  run: PropTypes.object,
  scenario: PropTypes.object,
  setRun: PropTypes.func,
  slide: PropTypes.object,
  saveRunEvent: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { chat, cohort, run, responsesById, scenario, user } = state;
  const isContextual = ownProps.isContextual || false;
  return { chat, cohort, isContextual, run, responsesById, scenario, user };
};

const mapDispatchToProps = dispatch => ({
  getChat: id => dispatch(getChat(id)),
  getLinkedChatUsersByChatId: id => dispatch(getLinkedChatUsersByChatId(id)),
  getResponse: (...params) => dispatch(getResponse(...params)),
  setChat: (id, params) => dispatch(setChat(id, params)),
  setRun: (...params) => dispatch(setRun(...params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ContentSlide)
);
