import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import withSocket, {
  JOIN_OR_PART,
  NEW_MESSAGE,
  USER_JOIN,
  USER_PART
  // USER_IS_TYPING,
  // USER_NOT_TYPING
} from '@hoc/withSocket';
// This will be used when run event traces are added.
// import withRunEventCapturing, {
//   CHAT_JOIN,
//   CHAT_PART,
//   CHAT_MESSAGE
// } from '@hoc/withRunEventCapturing';
import {
  getChat,
  getChatUsersByChatId,
  setChatUsersByChatId
} from '@actions/chat';
import Identity from '@utils/Identity';
import Storage from '@utils/Storage';
import ChatMessages from '@components/Chat/ChatMessages';
import RichTextEditor from '@components/RichTextEditor';
import Layout from '@utils/Layout';

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

function makeSendButtonPlugin(onSendNewMessage) {
  return {
    name: 'sendButtonPlugin',
    display: 'command',
    title: 'Send',
    buttonClass: '',
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 20 500 500"><g><path id="c__send-icon" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path></g></svg>`,
    add(core, targetElement) {
      const context = core.context;
      context.sendButtonPlugin = {
        targetButton: targetElement
      };
    },
    active(element) {
      if (!element) {
        this.util.removeClass(
          this.context.sendButtonPlugin.targetButton,
          'active'
        );
      } else if (
        /^mark$/i.test(element.nodeName) &&
        element.style.backgroundColor.length > 0
      ) {
        this.util.addClass(
          this.context.sendButtonPlugin.targetButton,
          'active'
        );
        return true;
      }
      return false;
    },
    action() {
      onSendNewMessage();
    }
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

    this.hasUnmounted = false;
    this.hasUnloaded = false;
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
    this.onQuote = this.onQuote.bind(this);
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

    // Register Window events
    window.addEventListener('beforeunload', this.onBeforeUnload);

    // Register Socket events
    this.props.socket.on(JOIN_OR_PART, this.onJoinOrPart);
  }

  componentWillUnmount() {
    // Unregister Socket events
    this.props.socket.off(JOIN_OR_PART, this.onJoinOrPart);

    this.hasUnmounted = true;

    if (this.hasUnloaded) {
      // Unregister Window events
      window.removeEventListener('beforeunload', this.onBeforeUnload);
    } else {
      this.onBeforeUnload();
    }
  }

  onBeforeUnload() {
    this.props.socket.emit(USER_PART, makeSocketPayload(this.props));

    this.hasUnloaded = true;

    if (this.hasUnmounted) {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
    }
  }

  onJoinOrPart({ chat, user }) {
    const { users } = this.props.chat;

    /* istanbul ignore else */
    if (chat.id === this.props.chat.id) {
      this.props.setChatUsersByChatId(this.props.chat.id, [...users, user]);
    }
  }

  onQuote(message) {
    const user = this.props.chat.usersById[message.user_id];
    const content = `<p>${user.personalname ||
      user.username} wrote:<blockquote>${message.content}</blockquote></p>`;

    /* istanbul ignore else */
    if (this.rte) {
      this.hasPendingSend = false;
      this.rte.setContents(content);
      this.onChange(content);
    }
  }

  onChange(content) {
    this.content = content;
    Storage.merge(this.storageKey, { content });

    // This is impossible to reproduce programmatically. The
    // behavior being corrected is timing sensitive:
    //
    // User types a bunch of text really quickly and hits enter. Because
    // suneditor throttles "onChange" to provide meaningful
    // updates and not a call on every character, it may be too slow.
    // If {enter} is pressed before the onChange event is fired, and
    // handled by onKeyDown, then this.contents may be empty when
    // that occurs. In that case, onKeyDown will set this.hasPendingSend
    // to true, so that when onChange is called, it will know that
    // the message it receives should be immediately sent.
    //
    /* istanbul ignore if */
    if (this.hasPendingSend) {
      this.onSendNewMessage();
    }
  }

  clear() {
    const content = NEW_MESSAGE_CONTENT_HTML;

    Storage.merge(this.storageKey, { content });

    /* istanbul ignore else */
    if (this.rte) {
      this.rte.setContents(content);
      this.rte.core.focus();
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
      onQuote,
      onSendNewMessage
    } = this;
    const { chat } = this.props;
    const { id, isReady } = this.state;
    const defaultValue = content || '';

    if (!isReady) {
      return null;
    }

    const customPlugins = [makeSendButtonPlugin(onSendNewMessage)];

    // Options properties
    const autoFocus = true;
    const buttons = Layout.isForMobile() ? 'chat-mobile' : 'chat-desktop';
    const defaultStyle = 'font-family:Lato,"Helvetica Neue",Arial,Helvetica,sans-serif;font-size:1em;line-height:1em;';
    const height = 'auto';
    const maxHeight = Layout.isForMobile() ? '150px' : '250px';
    const minHeight = '50px';
    const resizingBar = false;
    const slice = Layout.isForMobile() ? -10 : -20;
    const showPathLabel = false;

    const options = {
      autoFocus,
      buttons,
      // This is used to match suneditor to the site's fonts
      defaultStyle,
      height,
      minHeight,
      maxHeight,
      resizingBar,
      showPathLabel,
    };

    // Layout.isForMobile()?
    const { position } = Storage.get(this.storageKey, {
      position: {
        x: 0,
        y: 100
      }
    });

    const onStop = (event, { x, y }) => {
      Storage.merge(this.storageKey, {
        position: { x, y }
      });
    };

    return (
      <Draggable
        handle=".handle"
        defaultPosition={position}
        position={null}
        scale={1}
        onStop={onStop}
      >
        <div
          role="dialog"
          className="ui modal transition visible active c__container-modal"
          data-testid="chat-draggable"
        >
          <div tabIndex="0" className="ui header handle">
            <i aria-hidden="true" className="comments outline icon"></i>
            <div className="content">
              scenario.title, slide.title Discussion
            </div>
          </div>
          <div tabIndex="0" className="content">
            <div className="cm__container-outer">
              <ChatMessages chat={chat} onQuote={onQuote} slice={slice} />
            </div>
            <div className="cc__container-outer">
              <RichTextEditor
                name="content"
                id={id}
                customPlugins={customPlugins}
                defaultValue={defaultValue}
                onChange={onChange}
                onInput={onInput}
                onKeyDown={onKeyDown}
                onMount={onMount}
                options={options}
              />
            </div>
          </div>
          <div data-testid="chat-main" />
        </div>
      </Draggable>
    );
  }
}

Chat.propTypes = {
  chat: PropTypes.object,
  cohort: PropTypes.object,
  getChat: PropTypes.func,
  getChatUsersByChatId: PropTypes.func,
  setChatUsersByChatId: PropTypes.func,
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
  getChat: id => dispatch(getChat(id)),
  getChatUsersByChatId: id => dispatch(getChatUsersByChatId(id)),
  setChatUsersByChatId: (id, users) => dispatch(setChatUsersByChatId(id, users))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
