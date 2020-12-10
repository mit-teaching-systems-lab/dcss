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
  setChat,
  getChatMessagesByChatId,
  getChatMessagesCountByChatId,
  getChatUsersByChatId
} from '@actions/chat';
import { getUser } from '@actions/user';

import Identity from '@utils/Identity';
import Storage from '@utils/Storage';

// import { ResizableBox } from 'react-resizable';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
  Ref,
  Segment
} from '@components/UI';
import ChatMessages from '@components/Chat/ChatMessages';
import Loading from '@components/Loading';
import RichTextEditor from '@components/RichTextEditor';

import './Chat.css';

const TEMPORARY_CHAT_ID = 1;
const NEW_MESSAGE_CONTENT_HTML = `<p><br></p>`;

function isValidMessage(message) {
  const trimmed = message.trim();
  console.log('trimmed?', trimmed);

  if (!trimmed) {
    console.log('trimmed message is empty');
    return false;
  }

  if (trimmed === NEW_MESSAGE_CONTENT_HTML) {
    console.log('trimmed message equals NEW_MESSAGE_CONTENT_HTML');
    return false;
  }

  console.log('trimmed message does not match any invalid message states');
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

    const { chat, run, user } = this.props;

    this.storageKey = `chat/${chat.id || TEMPORARY_CHAT_ID}`;

    const { content } = Storage.get(this.storageKey, {
      content: NEW_MESSAGE_CONTENT_HTML
    });

    this.state = {
      isReady: false,
    };

    this.content = content;
    this.rte = null;

    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onJoinOrPart = this.onJoinOrPart.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMount = this.onMount.bind(this);
    this.onReply = this.onReply.bind(this);
    this.onNewMessage = this.onNewMessage.bind(this);
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

  onReply(details) {
    console.log("ON REPLY");
    // this.setState(
    //   {
    //     content
    //   },
    //   () => {
    //     Storage.merge(this.storageKey, { content });
    //   }
    // );
  }

  onChange(content) {
    console.log("onChange", content);
    this.content = content;
    Storage.merge(this.storageKey, { content })
    // this.setState(
    //   {
    //     content
    //   },
    //   () => {
    //     Storage.merge(this.storageKey, { content });
    //   }
    // );
  }

  clear() {
    const content = NEW_MESSAGE_CONTENT_HTML;

    Storage.merge(this.storageKey, { content })

    if (this.rte) {
      this.rte.setContents(content);
    }

    this.content = content;
  }

  onKeyDown(event, content) {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      this.onNewMessage();
      return false;
    }
    // TODO: possibly send "typing" message?
  }

  onMount(rte) {
    this.rte = rte;
  }

  onNewMessage() {
    console.log('onNewMessage');

    // const { content } = this.state;
    const { content } = this;

    console.log('isValidMessage?', isValidMessage(content));
    console.log('content:', content);

    if (isValidMessage(content)) {
      console.log('sending new message', content);
      this.props.socket.emit(
        NEW_MESSAGE,
        makeSocketPayload(this.props, {
          content
        })
      );

      this.onChange(NEW_MESSAGE_CONTENT_HTML);
      // console.log('next: ', NEW_MESSAGE_CONTENT_HTML);

      // this.content = NEW_MESSAGE_CONTENT_HTML;

      // Storage.merge(this.storageKey, { content: NEW_MESSAGE_CONTENT_HTML });

      // console.log('reseting state');
      // console.log('current: ', this.state.content);
      // this.setState(
      //   {
      //     content: NEW_MESSAGE_CONTENT_HTML
      //   },
      //   (...args) => {
      //     console.log(...args);
      //     Storage.merge(this.storageKey, { content: '' });
      //   }
      // );
    }
  }

  render() {
    const { content, onChange, onKeyDown, onMount, onReply, onNewMessage } = this;
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
            <Button icon="send" onClick={onNewMessage} />
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
  getUser: PropTypes.func,
  linkChatToRun: PropTypes.func,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object,
  socket: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
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
