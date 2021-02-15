import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as HTMLParser from 'node-html-parser';
import { connect } from 'react-redux';
import { paramCase } from 'change-case';
import withSocket, {
  JOIN_OR_PART,
  CHAT_MESSAGE_CREATED,
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
  getChatById,
  getChatUsersByChatId,
  setChatUsersByChatId
} from '@actions/chat';
import Identity from '@utils/Identity';
import Storage from '@utils/Storage';
import ChatComposer from '@components/Chat/ChatComposer';
import ChatDraggableResizableDialog from '@components/Chat/ChatDraggableResizableDialog';
import ChatMessages from '@components/Chat/ChatMessages';
import ChatMinMax from '@components/Chat/ChatMinMax';
import { Ref } from '@components/UI';
import Layout from '@utils/Layout';

import './Chat.css';

const TEMPORARY_CHAT_ID = 1;
const NEW_MESSAGE_CONTENT_HTML = `<p><br></p>`;

const innerMinClassName = 'content hidden';
const innerMaxClassName = 'content inner visible';

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

  const parsed = HTMLParser.parse(message);
  const hasValidNonTextContent = /img|math/.test(message);

  if (!hasValidNonTextContent && !parsed.rawText) {
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

function getAvailableHeightForComposer(totalHeight) {
  // top + gap + button tray + bottom
  const totalPaddingSpace = 82 + 14 + 47 + 26;
  const displayableHeight = totalHeight - totalPaddingSpace;
  const availableHeight = displayableHeight * 0.325 - 27;
  return availableHeight;
}

function makeDimensionsForComposer({ width: w, height: h } = {}) {
  const width = parseInt(w, 10);
  const height = Layout.isNotForMobile()
    ? getAvailableHeightForComposer(parseInt(h, 10))
    : 80;

  return {
    width: `${width}px`,
    height: `${height}px`,
    minHeight: `${height}px`,
    maxHeight: `${height}px`
  };
}

class Chat extends Component {
  constructor(props) {
    super(props);

    const { chat } = this.props;

    this.sessionKey = `chat/${chat.id || TEMPORARY_CHAT_ID}`;

    const { content } = Storage.get(this.sessionKey, {
      content: NEW_MESSAGE_CONTENT_HTML
    });

    this.state = {
      id: Identity.id(),
      isMinimized: false,
      isPulsing: false,
      isReady: false,
      tick: false
    };

    this.hasUnmounted = false;
    this.hasUnloaded = false;
    this.hasPendingSend = false;
    this.content = content;
    this.buffer = '';
    this.rte = null;
    this.cRef = null;

    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onJoinOrPart = this.onJoinOrPart.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.onMinMaxClick = this.onMinMaxClick.bind(this);
    this.onMount = this.onMount.bind(this);
    this.onQuote = this.onQuote.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);
    this.forceComposerHeightWithoutRerender = this.forceComposerHeightWithoutRerender.bind(
      this
    );
  }

  async componentDidMount() {
    // THIS IS ONLY NECESSARY FOR INITIAL DEVELOPMENT
    //
    //
    //
    if (!this.props.chat.id) {
      await this.props.getChatById(TEMPORARY_CHAT_ID);
    }
    //
    //
    //
    //

    // TODO: determine if this is the best way to indicate that a
    // user has joined
    // this.props.socket.emit(USER_JOIN, makeSocketPayload(this.props));

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
    // TODO: determine if this is the best way to indicate that a
    // user has parted
    // this.props.socket.emit(USER_PART, makeSocketPayload(this.props));

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
    Storage.merge(this.sessionKey, { content });

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
      this.sendNewMessage();
    }
  }

  clear() {
    const content = NEW_MESSAGE_CONTENT_HTML;

    Storage.merge(this.sessionKey, { content });

    /* istanbul ignore else */
    if (this.rte) {
      this.rte.setContents(content);
      this.rte.core.focus();
    }

    this.content = content;
    this.hasPendingSend = false;
  }

  onInput(event, rte, content) {
    this.onChange(content);
  }

  onKeyDown(event) {
    const { content } = this;
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      if (isValidMessage(content)) {
        this.hasPendingSend = true;
        this.sendNewMessage();
      }
      return false;
    }
    // TODO: possibly send "typing" message?
  }

  onMessageReceived() {
    if (this.state.isMinimized) {
      this.setState({
        isPulsing: true
      });

      if (Layout.isForMobile()) {
        document.body.scrollIntoView(true);
      }
    }
  }

  onMinMaxClick() {
    this.setState({
      isMinimized: !this.state.isMinimized,
      isPulsing: false
    });
  }

  onMount(rte) {
    this.rte = rte;
  }

  sendNewMessage() {
    const { content } = this;
    if (isValidMessage(content)) {
      this.props.socket.emit(
        CHAT_MESSAGE_CREATED,
        makeSocketPayload(this.props, {
          content
        })
      );
      this.clear();
    }
  }

  forceComposerHeightWithoutRerender(props) {
    /* istanbul ignore else */
    if (this.cRef) {
      // This ridiculous hack allows us to resize the composer box without fully
      // rerendering it via React. If there is a page reload, the box will be
      // rendered from either persisted dimensions, or with the defaults. The
      // persisted dimensions will match whatever the last dimensions this
      // function assigned.
      const sewrapper = this.cRef.querySelector('.se-wrapper');
      const dimensions = Object.entries(makeDimensionsForComposer(props));
      Array.from(sewrapper.children).forEach(child => {
        for (let [key, value] of dimensions) {
          if (key.toLowerCase().includes('height')) {
            child.style.setProperty(paramCase(key), value);
          }
        }
      });
    }
  }

  render() {
    const {
      content,
      onChange,
      onInput,
      onKeyDown,
      onMessageReceived,
      onMinMaxClick,
      onMount,
      onQuote,
      sendNewMessage
    } = this;
    const { chat } = this.props;
    const { id, isMinimized, isReady } = this.state;
    const defaultValue = content || '';

    if (!isReady) {
      return null;
    }

    // Layout.isForMobile()?
    const { dimensions, position } = Storage.get(this.sessionKey, {
      dimensions: {
        width: 430,
        height: 410
      },
      position: {
        x: 0,
        y: 100
      }
    });

    const onDragResizeStop = ({ width, height, x, y }) => {
      if (!width || !height) {
        return;
      }

      Storage.merge(this.sessionKey, {
        dimensions: { width, height },
        position: { x, y }
      });

      this.forceComposerHeightWithoutRerender({ width, height, x, y });

      // scrollIntoView
    };

    const onDragResize = ({ width, height, x, y }) => {
      // This is used only to adjust the composer height during a resize.
      // The changes will be persisted in onDragResizeStop
      if (!width || !height) {
        return;
      }
      this.forceComposerHeightWithoutRerender({ width, height, x, y });
    };

    const innerMinMaxClassName = isMinimized
      ? innerMinClassName
      : innerMaxClassName;
    const disableDragging = isMinimized;
    const draggableResizableProps = {
      isMinimized,
      dimensions,
      disableDragging,
      onDragResize,
      onDragResizeStop,
      position
    };

    // ChatMessage props
    const slice = Layout.isForMobile() ? -10 : -20;
    const cmProps = {
      chat,
      isMinimized,
      onQuote,
      onMessageReceived,
      slice
    };

    const options = {
      ...makeDimensionsForComposer(dimensions)
    };

    // ChatComposer props
    const name = 'content';
    const ccProps = {
      name,
      id,
      defaultValue,
      onChange,
      onInput,
      onKeyDown,
      onMount,
      options,
      sendNewMessage
    };

    const style = {
      width: 'calc(${dimensions.width}px)'
    };

    const draggableClassName = isMinimized
      ? 'ui header'
      : 'ui header c__drag-handle';

    return (
      <ChatDraggableResizableDialog {...draggableResizableProps}>
        <ChatMinMax onChange={onMinMaxClick} />
        <div tabIndex="0" className={draggableClassName}>
          {this.state.isPulsing ? (
            <i aria-hidden="true" className="icon c__pulse"></i>
          ) : (
            <i aria-hidden="true" className="comments outline icon"></i>
          )}
          <div className="content">scenario.title, slide.title</div>
        </div>
        <Ref innerRef={node => (this.cRef = node)}>
          <div tabIndex="0" className={innerMinMaxClassName}>
            <div className="cm__container-outer" style={style}>
              <ChatMessages {...cmProps} />
            </div>
            <div className="cc__container-outer" style={style}>
              <ChatComposer {...ccProps} />
            </div>
          </div>
        </Ref>
        <div data-testid="chat-main" />
      </ChatDraggableResizableDialog>
    );
  }
}

Chat.propTypes = {
  chat: PropTypes.object,
  cohort: PropTypes.object,
  getChatById: PropTypes.func,
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
  getChatById: id => dispatch(getChatById(id)),
  getChatUsersByChatId: id => dispatch(getChatUsersByChatId(id)),
  setChatUsersByChatId: (id, users) => dispatch(setChatUsersByChatId(id, users))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
