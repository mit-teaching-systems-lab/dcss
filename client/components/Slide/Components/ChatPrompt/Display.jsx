import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { type } from './meta';
import { getAgent } from '@actions/agent';
import { getResponse } from '@actions/response';
import Chat from '@components/Chat';
import { Button, Dropdown, Header, Icon, Menu, Modal } from '@components/UI';
import Identity from '@utils/Identity';
import Media from '@utils/Media';
import Payload from '@utils/Payload';
import Storage from '@utils/Storage';
import Timer from './Timer';

import {
  CHAT_CLOSE_COMPLETE,
  CHAT_CLOSE_INCOMPLETE,
  CHAT_CLOSE_TIMEOUT
} from '@hoc/withRunEventCapturing';

import withSocket, {
  STATES,
  // Event Names
  CHAT_CLOSED_FOR_SLIDE,
  CHAT_STATE,
  CREATE_CHAT_CHANNEL,
  CREATE_CHAT_SLIDE_CHANNEL,
  CREATE_CHAT_USER_CHANNEL,
  CREATE_USER_CHANNEL,
  TIMER_START,
  USER_JOIN_SLIDE,
  USER_PART_SLIDE
} from '@hoc/withSocket';

import './ChatPrompt.css';

const resultValues = ['complete', 'incomplete'];

const resultToRunEventMap = {
  complete: CHAT_CLOSE_COMPLETE,
  incomplete: CHAT_CLOSE_INCOMPLETE,
  timeout: CHAT_CLOSE_TIMEOUT
};

const closeStateToResultMap = {
  [STATES.CHAT_IS_CLOSED_COMPLETE]: 'complete',
  [STATES.CHAT_IS_CLOSED_INCOMPLETE]: 'incomplete',
  [STATES.CHAT_IS_CLOSED_TIMEOUT]: 'timeout'
};

// This is used to fill in an expected event
// argument, but is otherwise a no-op;
const emptyEvent = {};

const needsToFetchAgent = agent => {
  return (
    agent && agent.id && !agent.title && !agent.description && !agent.created_at
  );
};

class Display extends Component {
  constructor(props) {
    super(props);

    const { persisted = { value: '' } } = this.props;

    this.state = {
      isReady: false,
      isRestart: false,
      isActive: false,
      hasSubmittedResponse: false,
      markComplete: {
        isOpen: false,
        result: null
      },
      value: persisted.value
    };

    this.created_at = new Date().toISOString(); // Maps to a database column
    this.ticks = 0;
    this.slideIndex = Number(
      location.href.slice(location.href.lastIndexOf('/') + 1)
    );

    this.hasUnmounted = false;
    this.hasUnloaded = false;

    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onChange = this.onChange.bind(this);

    this.storageKey = this.props.cohort.id
      ? `cohort/${this.props.cohort.id}/run/${this.props.scenario.id}`
      : `run/${this.props.scenario.id}`;
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    let { persisted = {}, responseId, run } = this.props;
    let { name = responseId, value = '' } = persisted;
    let hasSubmittedResponse = false;

    if (!value && run.id) {
      const previous = await this.props.getResponse(run.id, responseId);

      if (previous?.response?.value) {
        hasSubmittedResponse = true;
        value = previous.response.value;
      }
    }

    if (value) {
      this.props.onResponseChange(emptyEvent, {
        name,
        value,
        isFulfilled: true
      });
      this.setState({ hasSubmittedResponse, value });
    }

    if (needsToFetchAgent(this.props.agent)) {
      await this.props.getAgent(this.props.agent.id);
    }

    const slide = {
      index: this.slideIndex
    };

    // Register Window events
    window.addEventListener('beforeunload', this.onBeforeUnload);

    this.props.socket.on(CHAT_STATE, this.onStateChange);
    this.props.socket.on(CHAT_CLOSED_FOR_SLIDE, this.onChange);

    const basePayload = Payload.compose(this.props);
    const chatSlidePayload = {
      ...basePayload,
      slide
    };
    const userJoinPayload = {
      ...basePayload,
      run: Storage.get(this.storageKey),
      scenario: {
        id: this.props.scenario.id
      }
    };

    this.props.socket.emit(CREATE_USER_CHANNEL, basePayload);
    this.props.socket.emit(CREATE_CHAT_CHANNEL, basePayload);
    this.props.socket.emit(CREATE_CHAT_SLIDE_CHANNEL, chatSlidePayload);
    this.props.socket.emit(CREATE_CHAT_USER_CHANNEL, chatSlidePayload);
    this.props.socket.emit(USER_JOIN_SLIDE, userJoinPayload);

    this.setState({
      isReady: true
    });
  }

  componentWillUnmount() {
    if (!this.isScenarioRun) {
      return;
    }

    this.props.socket.off(CHAT_STATE, this.onStateChange);
    this.props.socket.off(CHAT_CLOSED_FOR_SLIDE, this.onChange);

    this.hasUnmounted = true;

    if (this.hasUnloaded) {
      // Unregister Window events
      window.removeEventListener('beforeunload', this.onBeforeUnload);
    } else {
      this.onBeforeUnload();
    }
  }

  onBeforeUnload() {
    this.props.socket.emit(
      USER_PART_SLIDE,
      Payload.compose(
        this.props,
        {
          run: Storage.get(this.storageKey)
        }
      )
    );

    this.hasUnloaded = true;

    if (this.hasUnmounted) {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
    }
  }

  onStateChange({ chat, slide, state }) {
    const result = closeStateToResultMap[state];

    // If the current state of this chat, on this slide,
    // matches any of the known closed states, we need
    // to forward this on to the response change mechanism.
    if (result) {
      this.onChange({ chat, slide, result });
    } else {
      if (state === STATES.CHAT_IS_ACTIVE) {
        const { chat, auto, timeout } = this.props;

        const slide = {
          index: this.slideIndex
        };

        this.setState({
          isActive: true
        }, () => {
          if (auto && timeout) {
            this.props.socket.emit(TIMER_START, { chat, slide, timeout });
          }
        });
      }
    }
  }

  onChange({ chat, slide, result }) {
    const { responseId: name } = this.props;
    const { created_at } = this;
    const ended_at = new Date().toISOString();
    const time = this.ticks;

    const value = {
      result,
      time
    };

    this.props.saveRunEvent(resultToRunEventMap[result], {
      prompt: this.props.prompt,
      responseId: this.props.responseId,
      content: chat,
      value: slide
    });

    this.props.onResponseChange(emptyEvent, {
      created_at,
      ended_at,
      name,
      type,
      value
    });

    this.setState({
      value
    });
  }

  render() {
    const {
      agent,
      chat,
      auto,
      isEmbeddedInSVG,
      required,
      responseId,
      timeout,
      user
    } = this.props;
    const { isReady, isRestart, isActive, hasSubmittedResponse } = this.state;

    if (isEmbeddedInSVG || !this.isScenarioRun) {
      return (
        <Menu borderless>
          <Menu.Item>
            <Icon name="discussions" />
            Discussion
          </Menu.Item>
        </Menu>
      );
    }

    const isUserHost = chat.host_id === user.id;
    const key = Identity.key(chat);
    const { result: defaultValue, time } = this.state.value;
    const slide = {
      index: this.slideIndex
    };

    const isComplete = !!defaultValue;
    const timerProps = {
      auto,
      isComplete,
      isRestart,
      slide,
      timeout,
      isAllowedToStartTimer: isActive,
      onTimerEnd: params => {
        this.props.socket.emit(CHAT_CLOSED_FOR_SLIDE, params);
      },
      onTimerStart: () => {
        this.created_at = new Date().toISOString();
        this.setState({
          value: {}
        });
      },
      onTimerTick: () => {
        this.ticks++;
      }
    };
    const timerRender = (
      <Timer key={Identity.key(timerProps)} {...timerProps} />
    );

    const header = !defaultValue && timeout ? timerRender : null;

    const chatProps = {
      agent,
      chat,
      header,
      key,
      responseId
    };

    const seconds = Number(time);
    const options = resultValues.map(resultValue => {
      let text = sentenceCase(resultValue);
      if (defaultValue && seconds) {
        text += ` (${Media.secToTime(seconds)})`;
      }
      return {
        key: resultValue,
        value: resultValue,
        text
      };
    });

    options.unshift({
      key: '',
      value: null,
      text: ''
    });

    const onChatCompleteChange = () => {
      const time = this.ticks;
      const { result } = this.state.markComplete;

      if (result) {
        this.props.socket.emit(CHAT_CLOSED_FOR_SLIDE, {
          chat,
          slide,
          result
        });
        this.setState({
          value: {
            result,
            time
          },
          markComplete: {
            isOpen: false,
            result: null
          }
        });
      }
    };

    const onMarkCompleteChange = (event, { name, value }) => {
      this.setState({
        markComplete: {
          isOpen: true,
          [name]: value
        }
      });
    };

    const onMarkCompleteClose = () => {
      this.setState({
        markComplete: {
          isOpen: false,
          result: null
        }
      });
    };

    const whatHappened =
      defaultValue === 'timeout' ? 'ended in a' : 'was marked';

    // Inexplicably, the usual "{' '}" is not working
    // to create a space between {whatHappened} and
    // <strong>{defaultValue}</strong>
    const resultOfDiscussion = defaultValue ? (
      <Menu.Item>
        <Icon name="discussions" />
        The discussion {whatHappened}&nbsp;
        <strong>{defaultValue}</strong>.
      </Menu.Item>
    ) : null;

    //
    // TODO: This is guarded by the "isActive" flag
    //
    // const dropdownOrResultOfDiscussion = !defaultValue ? (
    //   <Dropdown
    //     item
    //     className="cpd__dropdown"
    //     name="result"
    //     placeholder="Mark discussion as..."
    //     disabled={!isActive}
    //     closeOnChange={true}
    //     defaultValue={defaultValue}
    //     options={options}
    //     onChange={onMarkCompleteChange}
    //   />
    // ) : (
    //   resultOfDiscussion
    // );
    //

    const dropdownOrResultOfDiscussion = !defaultValue ? (
      <Dropdown
        item
        className="cpd__dropdown"
        name="result"
        placeholder="Mark discussion as..."
        closeOnChange={true}
        defaultValue={defaultValue}
        options={options}
        onChange={onMarkCompleteChange}
      />
    ) : (
      resultOfDiscussion
    );

    const discussionIsOpen = !hasSubmittedResponse && !defaultValue;

    const discussionNotRequired = !required ? (
      <Menu.Item>&nbsp;</Menu.Item>
    ) : null;

    return (
      <Fragment>
        <Menu borderless>
          {required ? dropdownOrResultOfDiscussion : discussionNotRequired}
          {discussionIsOpen && timeout ? timerRender : null}
          {/*!isUserHost && !defaultValue && timeout ? timerRender : null*/}
          <Menu.Menu position="right">
            {discussionIsOpen && chat && isReady ? (
              <Chat {...chatProps} />
            ) : null}
          </Menu.Menu>
        </Menu>
        {this.state.markComplete.isOpen ? (
          <Modal.Accessible open>
            <Modal
              closeIcon
              open
              aria-modal="true"
              role="dialog"
              size="small"
              onClose={onMarkCompleteClose}
            >
              <Header icon="checkmark" content={`Close this discussion as ${this.state.markComplete.result}?`} />
              <Modal.Content>
                Are you sure you want to mark this discussion{' '}
                {this.state.markComplete.result}? Doing so will end the
                discussion on this slide for all active participants.
              </Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button
                    primary
                    aria-label="Yes"
                    onClick={() => {
                      onChatCompleteChange();
                    }}
                  >
                    Yes
                  </Button>
                  <Button.Or />
                  <Button aria-label="No" onClick={onMarkCompleteClose}>
                    No
                  </Button>
                </Button.Group>
              </Modal.Actions>
              <div data-testid="confirm-chat-complete" />
            </Modal>
          </Modal.Accessible>
        ) : null}
      </Fragment>
    );
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  agent: PropTypes.object,
  chat: PropTypes.object,
  cohort: PropTypes.object,
  getAgent: PropTypes.func,
  getResponse: PropTypes.func,
  auto: PropTypes.bool,
  isEmbeddedInSVG: PropTypes.bool,
  onResponseChange: PropTypes.func,
  persisted: PropTypes.object,
  prompt: PropTypes.string,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object,
  socket: PropTypes.object,
  timeout: PropTypes.number,
  type: PropTypes.oneOf([type]).isRequired,
  welcome: PropTypes.string,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { agentsById, cohort, chat, run, scenario, user } = state;
  const ownAgent = ownProps.agent || {};
  const stateAgent = agentsById[(ownProps?.agent?.id)] || {};
  const agent = {
    ...ownAgent,
    ...stateAgent
  };
  // console.log('agent', agent);

  return { agent, cohort, chat, run, scenario, user };
};

const mapDispatchToProps = dispatch => ({
  getAgent: id => dispatch(getAgent(id)),
  getResponse: (...params) => dispatch(getResponse(...params))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Display)
);
