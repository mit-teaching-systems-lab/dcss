import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { type } from './meta';
import { getAgent } from '@actions/agent';
import { getResponse } from '@actions/response';
import Chat from '@components/Chat';
import { Dropdown, Icon, Menu } from '@components/UI';
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
  CHAT_CLOSED_FOR_SLIDE,
  CHAT_QUORUM_FOR_SLIDE,
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
      hasAQuorum: false,
      hasSubmittedResponse: false,
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
    this.onChange = this.onChange.bind(this);
    this.onQuorum = this.onQuorum.bind(this);

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
      const previous = await this.props.getResponse({
        id: run.id,
        responseId
      });

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

    this.props.socket.on(CHAT_CLOSED_FOR_SLIDE, this.onChange);
    this.props.socket.on(CHAT_QUORUM_FOR_SLIDE, this.onQuorum);

    const basePayload = Payload.compose(this.props);
    const chatSlidePayload = {
      ...basePayload,
      slide
    };
    const userJoinPayload = {
      ...basePayload,
      run: Storage.get(this.storageKey)
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

    this.props.socket.off(CHAT_CLOSED_FOR_SLIDE, this.onChange);
    this.props.socket.off(CHAT_QUORUM_FOR_SLIDE, this.onQuorum);

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

  onQuorum() {
    const { chat, auto, timeout } = this.props;

    const slide = {
      index: this.slideIndex
    };

    if (auto && timeout) {
      this.props.socket.emit(TIMER_START, { chat, slide, timeout });
    }

    this.setState({
      hasAQuorum: true
    });
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
      responseId,
      timeout,
      user
    } = this.props;
    const { isReady, isRestart, hasAQuorum, hasSubmittedResponse } = this.state;

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

    const onChatCompleteChange = (event, { name, value }) => {
      const time = this.ticks;
      if (value) {
        this.props.socket.emit(CHAT_CLOSED_FOR_SLIDE, {
          chat,
          slide,
          [name]: value
        });
        this.setState({
          value: {
            [name]: value,
            time
          }
        });
      }
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
    ) : (
      <Menu.Item>
        <Icon name="discussions" />
        Discussion
      </Menu.Item>
    );

    const dropdownOrResultOfDiscussion = !defaultValue ? (
      <Dropdown
        item
        className="cpd__dropdown"
        name="result"
        placeholder="Close discussion as..."
        disabled={!hasAQuorum}
        closeOnChange={true}
        defaultValue={defaultValue}
        options={options}
        onChange={onChatCompleteChange}
      />
    ) : (
      resultOfDiscussion
    );

    const discussionIsOpen = !hasSubmittedResponse && !defaultValue;

    return (
      <Menu borderless>
        {discussionIsOpen && isUserHost && timeout ? timerRender : null}
        {isUserHost ? dropdownOrResultOfDiscussion : null}
        {!isUserHost ? resultOfDiscussion : null}
        {!isUserHost && !defaultValue && timeout ? timerRender : null}
        <Menu.Menu position="right">
          {discussionIsOpen && chat && isReady ? <Chat {...chatProps} /> : null}
        </Menu.Menu>
      </Menu>
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
  getResponse: params => dispatch(getResponse(params))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Display)
);
