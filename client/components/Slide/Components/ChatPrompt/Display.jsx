import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { type } from './meta';
import { getResponse } from '@actions/response';
import Chat from '@components/Chat';
import { Dropdown, Icon, Menu } from '@components/UI';
import Identity from '@utils/Identity';
import Media from '@utils/Media';
import Timer from './Timer';

import {
  CHAT_CLOSE_COMPLETE,
  CHAT_CLOSE_INCOMPLETE,
  CHAT_CLOSE_TIMEOUT
} from '@hoc/withRunEventCapturing';

import withSocket, {
  CHAT_CLOSED_FOR_SLIDE,
  CREATE_CHAT_CHANNEL,
  CREATE_CHAT_SLIDE_CHANNEL
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

class Display extends Component {
  constructor(props) {
    super(props);

    const { persisted = { value: '' } } = this.props;

    this.state = {
      isActive: false,
      isReady: false,
      isRestart: false,
      hasSubmittedResponse: false,
      value: persisted.value
    };

    this.created_at = new Date().toISOString(); // Maps to a database column
    this.ticks = 0;
    this.slideIndex = Number(
      location.href.slice(location.href.lastIndexOf('/') + 1)
    );
    this.onChange = this.onChange.bind(this);
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

    const { chat } = this.props;

    const slide = {
      index: this.slideIndex
    };

    this.props.socket.emit(CREATE_CHAT_CHANNEL, { chat });
    this.props.socket.emit(CREATE_CHAT_SLIDE_CHANNEL, { chat, slide });
    this.props.socket.on(CHAT_CLOSED_FOR_SLIDE, this.onChange);

    this.setState({
      isReady: true
    });
  }

  componentWillUnmount() {
    this.props.socket.off(CHAT_CLOSED_FOR_SLIDE, this.onChange);
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
      isActive: false,
      value
    });
  }

  render() {
    const {
      chat,
      isAutostart,
      isEmbeddedInSVG,
      responseId,
      timer,
      user
    } = this.props;
    const { isActive, isReady, isRestart, hasSubmittedResponse } = this.state;

    if (isEmbeddedInSVG || !this.isScenarioRun) {
      return null;
    }

    const isUserHost = chat.host_id === user.id;
    const key = Identity.key(chat);
    const { result: defaultValue, time } = this.state.value;
    const slide = {
      index: this.slideIndex
    };

    const isComplete = !!defaultValue;
    const timerProps = {
      isAutostart,
      isComplete,
      isRestart,
      slide,
      timer,
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

    const header = !defaultValue && timer ? timerRender : null;

    const chatProps = {
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
          isActive: false,
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
    ) : null;

    const dropdownOrResultOfDiscussion = !defaultValue ? (
      <Dropdown
        item
        className="cpd__dropdown"
        name="result"
        placeholder="Close discussion as..."
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
        {discussionIsOpen && isUserHost && timer ? (
          <Timer {...timerProps} />
        ) : null}

        {isUserHost ? dropdownOrResultOfDiscussion : null}

        {!isUserHost ? resultOfDiscussion : null}

        {!isUserHost && !defaultValue && timer ? (
          <Timer {...timerProps} />
        ) : null}

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
  chat: PropTypes.object,
  getResponse: PropTypes.func,
  isAutostart: PropTypes.bool,
  isEmbeddedInSVG: PropTypes.bool,
  onResponseChange: PropTypes.func,
  persisted: PropTypes.object,
  prompt: PropTypes.string,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  socket: PropTypes.object,
  timer: PropTypes.number,
  type: PropTypes.oneOf([type]).isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { chat, run, user } = state;
  return { chat, run, user };
};

const mapDispatchToProps = dispatch => ({
  getResponse: params => dispatch(getResponse(params))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Display)
);
