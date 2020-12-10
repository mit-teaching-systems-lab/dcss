import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withSocket, {
  JOIN_OR_PART,
  NEW_MESSAGE,
  NOTIFICATION,
  USER_JOIN,
  USER_PART,
  USER_IS_TYPING,
  USER_NOT_TYPING
} from '@hoc/withSocket';
import withRunEventCapturing, {
  CHAT_JOIN,
  CHAT_PART,
  CHAT_MESSAGE
} from '@hoc/withRunEventCapturing';
import {
  getChat,
  getChatMessagesByChatId,
  getChatMessagesCountByChatId,
  getChatUsersByChatId
} from '@actions/chat';
import { getUser } from '@actions/user';

import Identity from '@utils/Identity';
import Storage from '@utils/Storage';

// import { ResizableBox } from 'react-resizable';
import { Button, Header, Modal } from '@components/UI';
import ChatMessages from '@components/Chat/ChatMessages';
import Loading from '@components/Loading';
import RichTextEditor from '@components/RichTextEditor';

import './Chat.css';

const TEMPORARY_CHAT_ID = 1;
const NEW_MESSAGE_CONTENT_HTML = `<p><br></p>`;

function isValidMessage(message) {
  if (!message) {
    return false;
  }

  const trimmed = message.trim();

  if (!trimmed) {
    return false;
  }

  if (trimmed === NEW_MESSAGE_CONTENT_HTML) {
    return false;
  }

  return true;
}

function makeSocketPayload(props, data = {}) {
  const { chat, user } = props;
  return {
    chat: {
      id: chat.id
    },
    user: {
      id: user.id
    },
    ...data
  };
}

class Chat extends Component {
  constructor(props) {
    super(props);

    const { chat } = this.props;

    this.storageKey = `chat/${chat.id || TEMPORARY_CHAT_ID}`;

    const { content } = Storage.get(this.storageKey, {
      content: NEW_MESSAGE_CONTENT_HTML
    });

    this.state = {
      id: Identity.id(),
      isReady: false
    };

    this.hasPendingSend = false;
    this.content = content;
    this.buffer = '';
    this.rte = null;

    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onJoinOrPart = this.onJoinOrPart.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMount = this.onMount.bind(this);
    this.onReply = this.onReply.bind(this);
    this.onSendNewMessage = this.onSendNewMessage.bind(this);
  }

  async componentDidMount() {
    // THIS IS ONLY NECESSARY FOR INITIAL DEVELOPMENT
    //
    //
    //
    if (!this.props.chat.id) {
      await this.props.getChat(TEMPORARY_CHAT_ID);
    }
    //
    //
    //
    //

    this.props.socket.emit(USER_JOIN, makeSocketPayload(this.props));

    await this.props.getChatUsersByChatId(this.props.chat.id);

    this.setState({
      isReady: true
    });

    // Register Socket events
    this.props.socket.on(JOIN_OR_PART, this.onJoinOrPart);

    // Register Window events
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  componentWillUnmount() {
    // Unregister Socket events
    this.props.socket.off(JOIN_OR_PART, this.onJoinOrPart);

    // Unregister Window events
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  onBeforeUnload() {
    this.props.socket.emit(USER_PART, makeSocketPayload(this.props));
  }

  async onJoinOrPart() {
    await this.props.getChatUsersByChatId(this.props.chat.id);
  }

  onReply() {
    // eslint-disable-next-line no-console
    console.log('ON REPLY');
  }

  onChange(content) {
    this.content = content;
    Storage.merge(this.storageKey, { content });

    if (this.hasPendingSend) {
      this.onSendNewMessage();
    }
  }

  clear() {
    const content = NEW_MESSAGE_CONTENT_HTML;

    Storage.merge(this.storageKey, { content });

    if (this.rte) {
      this.rte.setContents(content);
    }

    this.content = content;
    this.hasPendingSend = false;
  }

  onKeyDown(event) {
    const { content } = this;
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      if (isValidMessage(content)) {
        this.hasPendingSend = true;
        this.onSendNewMessage();
      }
      return false;
    }
    // TODO: possibly send "typing" message?
  }

  onInput(event, rte, content) {
    this.onChange(content);
  }

  onMount(rte) {
    this.rte = rte;
  }

  onSendNewMessage() {
    const { content } = this;

    if (isValidMessage(content)) {
      this.props.socket.emit(
        NEW_MESSAGE,
        makeSocketPayload(this.props, {
          content
        })
      );
      this.clear();
    }
  }

  render() {
    const {
      content,
      onChange,
      onInput,
      onKeyDown,
      onMount,
      onReply,
      onSendNewMessage
    } = this;
    const { chat, user } = this.props;
    const { id, isReady } = this.state;
    const defaultValue = content || '';
    const disable = !!isReady;

    return (
      <Modal.Accessible open>
        <Modal
          open
          role="dialog"
          aria-modal="true"
          size="small"
          className="c__container-modal"
        >
          <Header
            icon="comments outline"
            content="{scenario.title}, {slide.title} Discussion"
            tabIndex="0"
          />
          <Modal.Content tabIndex="0">
            <div className="cm__container-outer">
              {isReady ? (
                <ChatMessages chat={chat} onReply={onReply} />
              ) : (
                <Loading />
              )}
            </div>
            <div className="cc__container-outer">
              <RichTextEditor
                name="content"
                id={id}
                disable={disable}
                defaultValue={defaultValue}
                onChange={onChange}
                onInput={onInput}
                onKeyDown={onKeyDown}
                onMount={onMount}
                options={{
                  buttons: 'chat',
                  height: 'auto',
                  minHeight: '50px',
                  maxHeight: '250px',
                  showPathLabel: false,
                  defaultStyle: 'font-size: 1.2em; line-height: 1em;'
                }}
              />
            </div>
            <Button icon="send" onClick={onSendNewMessage} />
          </Modal.Content>
        </Modal>
      </Modal.Accessible>
    );
  }
}

Chat.propTypes = {
  chat: PropTypes.object,
  cohort: PropTypes.object,
  getChat: PropTypes.func,
  getChatMessagesByChatId: PropTypes.func,
  getChatMessagesCountByChatId: PropTypes.func,
  getChatUsersByChatId: PropTypes.func,
  getUser: PropTypes.func,
  linkChatToRun: PropTypes.func,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object,
  socket: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { chat, cohort, run, scenario, user } = state;
  return {
    chat,
    cohort,
    run,
    scenario,
    user
  };
};

const mapDispatchToProps = dispatch => ({
  getChat: params => dispatch(getChat(params)),
  getChatMessagesByChatId: params => dispatch(getChatMessagesByChatId(params)),
  getChatMessagesCountByChatId: params =>
    dispatch(getChatMessagesCountByChatId(params)),
  getChatUsersByChatId: params => dispatch(getChatUsersByChatId(params)),
  getUser: params => dispatch(getUser(params))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
