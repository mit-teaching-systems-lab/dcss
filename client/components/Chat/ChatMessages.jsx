import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import { generateAvatar } from 'robohash-avatars';
import { connect } from 'react-redux';
import withSocket, {
  CHAT_AGENT_PAUSE,
  CHAT_AGENT_START,
  CHAT_MESSAGE_CREATED,
  CHAT_MESSAGE_UPDATED
} from '@hoc/withSocket';
import {
  getChatMessagesByChatId,
  getChatMessagesCountByChatId,
  getChatUsersByChatId,
  setMessageById
} from '@actions/chat';

import {
  Button,
  Comment,
  Divider,
  Popup,
  Ref,
  ResizeDetector
} from '@components/UI';
import ChatMessageDeleteButton from '@components/Chat/ChatMessageDeleteButton';
import { RichTextRenderer } from '@components/RichTextEditor';
import Username from '@components/User/Username';

import Avatar from '@utils/Avatar';
import Identity from '@utils/Identity';
import Layout from '@utils/Layout';
import Moment from '@utils/Moment';
import Payload from '@utils/Payload';
import scrollIntoView from '@utils/scrollIntoView';

import './Chat.css';

function isVisibleInScrollingContainer(element, isVisible, childRect) {
  if (!element) {
    return false;
  }
  /* istanbul ignore if */
  if (element.tagName === 'HTML') {
    return true;
  }
  const parentRect = element.parentNode.getBoundingClientRect();
  const rect = childRect || element.getBoundingClientRect();
  return (
    (isVisible ? rect.top >= parentRect.top : rect.bottom > parentRect.top) &&
    (isVisible ? rect.left >= parentRect.left : rect.right > parentRect.left) &&
    (isVisible
      ? rect.bottom <= parentRect.bottom
      : rect.top < parentRect.bottom) &&
    (isVisible
      ? rect.right <= parentRect.right
      : rect.left < parentRect.right) &&
    isVisibleInScrollingContainer(element.parentNode, isVisible, rect)
  );
}

function isVisibleOnScreen(container, element) {
  if (!container || !element) {
    return true;
  }

  let cTop = container.scrollTop;
  let cBottom = cTop + container.clientHeight;
  let eTop = element.offsetTop - container.offsetTop;
  let eBottom = eTop + element.clientHeight;
  let isTotal = eTop >= cTop && eBottom <= cBottom;
  let isPartial =
    (eTop < cTop && eBottom > cTop) || (eBottom > cBottom && eTop < cBottom);
  return isTotal || isPartial;
}

const deleteAriaLabel = 'Delete this message';
const quoteAriaLabel = 'Quote this message';

class ChatMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      isViewingNewest: true,
      hasNewMessages: true,
      messages: [],
      slice: this.props.slice || -20
    };

    this.wasPreviouslyMinimized = false;
    this.isComponentMounted = false;
    this.onMessageDelete = this.onMessageDelete.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.onMessageUpdated = this.onMessageUpdated.bind(this);
  }

  shouldComponentUpdate(newProps) {
    this.wasPreviouslyMinimized =
      this.props.isMinimized && !newProps.isMinimized;
    return true;
  }

  async componentDidMount() {
    const { agent, chat, run, user } = this.props;
    const messages = [];
    const count = await this.props.getChatMessagesCountByChatId(chat.id);

    if (count) {
      const received = await this.props.getChatMessagesByChatId(chat.id);
      messages.push(
        ...received.filter(message => {
          if (message.recipient_id && message.recipient_id !== user.id) {
            return false;
          }
          return true;
        })
      );
    }

    this.isComponentMounted = true;
    this.props.socket.on(CHAT_MESSAGE_CREATED, this.onMessageReceived);
    this.props.socket.on(CHAT_MESSAGE_UPDATED, this.onMessageUpdated);

    if (agent) {
      this.props.socket.emit(
        CHAT_AGENT_START,
        Payload.compose(
          this.props,
          { agent, run, user }
        )
      );
    }

    this.setState({
      isReady: true,
      messages
    });
  }

  componentWillUnmount() {
    const { agent } = this.props;
    this.isComponentMounted = false;
    this.props.socket.off(CHAT_MESSAGE_CREATED, this.onMessageReceived);
    this.props.socket.off(CHAT_MESSAGE_UPDATED, this.onMessageUpdated);

    if (agent && agent.id) {
      this.props.socket.emit(
        CHAT_AGENT_PAUSE,
        Payload.compose(
          this.props,
          { agent }
        )
      );
    }
  }

  async onMessageReceived(data) {
    if (!this.isComponentMounted) {
      return;
    }

    if (data.chat_id === this.props.chat.id) {
      const { messages } = this.state;

      if (data.deleted_at) {
        const messageIndex = messages.findIndex(message => {
          return message.id === data.id;
        });

        messages[messageIndex] = {
          ...messages[messageIndex],
          ...data
        };

        if (this.isComponentMounted) {
          this.setState({
            hasNewMessages: false,
            messages
          });
        }

        return;
      }

      if (!this.props.chat.usersById[data.user_id]) {
        await this.props.getChatUsersByChatId(this.props.chat.id);
      }

      messages.push(data);

      if (this.isComponentMounted) {
        this.setState({
          hasNewMessages: true,
          messages
        });
      }

      if (this.props.onMessageReceived) {
        this.props.onMessageReceived(data);
      }
    }
  }

  async onMessageUpdated(data) {
    if (!this.isComponentMounted) {
      return;
    }

    if (data.chat_id === this.props.chat.id) {
      const messages = this.state.messages.slice().map(message => {
        if (message.id === data.id) {
          return {
            ...message,
            ...data
          };
        }
        return message;
      });

      if (this.isComponentMounted) {
        this.setState({
          messages
        });
      }
    }
  }

  async onMessageDelete({ id }) {
    const message = await this.props.setMessageById(id, {
      deleted_at: new Date().toISOString()
    });

    await this.onMessageReceived(message);
  }

  render() {
    const { chat, isMinimized } = this.props;
    const { hasNewMessages, isReady, messages, slice } = this.state;
    const messagesSlice = messages.slice(slice);
    const isHidingMessages = messages.length > messagesSlice.length;
    let scrollingContainer = null;

    const scrollIntoViewIfViewingNewest = node => {
      if (!scrollingContainer && node) {
        scrollingContainer = node;
      }
      const hasNewMessages = false;

      // This is NOT an "else" to the previous condition.
      /* istanbul ignore else */
      if (scrollingContainer) {
        if (process.env.JEST_WORKER_ID) {
          const { isViewingNewest } = this.state;
          if (
            (isViewingNewest && this.state.hasNewMessages) ||
            this.wasPreviouslyMinimized
          ) {
            this.wasPreviouslyMinimized = false;
            scrollIntoView(scrollingContainer, false);
            this.setState({
              isViewingNewest,
              hasNewMessages
            });
          }
        } else {
          //
          // TODO: determine if this is more efficient than
          //        the current checks above
          //
          const isViewingNewest = isVisibleOnScreen(
            scrollingContainer,
            scrollingContainer.lastElementChild
          );

          if (
            (isViewingNewest && this.state.hasNewMessages) ||
            this.wasPreviouslyMinimized
          ) {
            this.wasPreviouslyMinimized = false;
            scrollIntoView(scrollingContainer, false);
            this.setState({
              isViewingNewest,
              hasNewMessages
            });
          }
        }
      }
    };

    const scrollIntoViewIfResized = node => {
      /* istanbul ignore if */
      if (!scrollingContainer && node) {
        scrollingContainer = node;
      }
      // This is NOT an "else" to the previous condition.
      if (scrollingContainer && Layout.isNotForMobile()) {
        scrollIntoView(scrollingContainer, false);
      }
    };

    const onScroll = () => {
      /* istanbul ignore else */
      if (scrollingContainer) {
        let isViewingNewest = isVisibleInScrollingContainer(
          scrollingContainer.lastElementChild
        );
        /* istanbul ignore else */
        if (this.state.isViewingNewest !== isViewingNewest) {
          this.setState({
            isViewingNewest
          });
        }
      }
    };

    const onResize = () => {
      /* istanbul ignore else */
      if (this.state.isViewingNewest) {
        scrollIntoViewIfResized();
      }
    };

    return isReady ? (
      <Fragment>
        {/*
            NOTE: data-testid="scrolling-container-outer" is used in testing
            the scrolling behavior when receiving new messages
        */}
        <ResizeDetector onResize={onResize}>
          <div
            data-testid="scrolling-container-outer"
            className="cm__container-inner"
            onScroll={onScroll}
          >
            {isHidingMessages ? (
              <Divider horizontal>
                <Button
                  aria-label="See more messages"
                  onClick={() => this.setState({ slice: slice - 10 })}
                >
                  See more
                </Button>
              </Divider>
            ) : null}
            {!isMinimized ? (
              <Ref innerRef={scrollIntoViewIfViewingNewest}>
                <Comment.Group
                  size="large"
                  style={{ marginTop: '1.4em !important' }}
                >
                  {messagesSlice.reduce((accum, message) => {
                    const user = chat.usersById[message.user_id];

                    if (!user) {
                      return accum;
                    }

                    if (message.deleted_at) {
                      return accum;
                    }

                    const key = Identity.key(message);
                    const defaultValue = message.content;
                    const avatar = new Avatar(user);

                    const rteProps = {
                      defaultValue,
                      options: {
                        width: '100%'
                      }
                    };

                    //
                    // NOTE: in this scope, "user" is the result of
                    //       "chat.usersById[message.user_id]"
                    //
                    const isDeletable =
                      message.is_quotable && user.id === this.props.user.id;
                    const deleteTrigger = (
                      <ChatMessageDeleteButton
                        aria-label={deleteAriaLabel}
                        onConfirm={() => {
                          this.onMessageDelete(message);
                        }}
                      />
                    );

                    const isQuotable = message.is_quotable;
                    const quoteTrigger = (
                      <Button
                        size="mini"
                        icon="quote left"
                        className="icon-primary"
                        aria-label={quoteAriaLabel}
                        onClick={() => {
                          this.props.onQuote(message);
                        }}
                      />
                    );

                    //
                    // NOTE: data-testid="comment" is used when testing
                    // for the number of messages rendered before
                    // and after pressing "See more" or receiving new
                    // messages
                    //
                    accum.push(
                      <Comment data-testid="comment" key={key}>
                        <Comment.Avatar src={avatar.src} />
                        <Comment.Content className="cmm__content">
                          <Comment.Author as="span" tabIndex="0">
                            <Username user={user} />
                          </Comment.Author>
                          <Comment.Metadata>
                            <span tabIndex="0" aria-label={message.created_at}>
                              {Moment(message.created_at).format('LT')}
                            </span>
                          </Comment.Metadata>
                          <Comment.Actions>
                            <Button.Group size="mini">
                              {isQuotable ? (
                                <Popup
                                  inverted
                                  position="top right"
                                  size="tiny"
                                  content={quoteAriaLabel}
                                  trigger={quoteTrigger}
                                />
                              ) : null}
                              {isDeletable ? (
                                <Popup
                                  inverted
                                  position="top right"
                                  size="tiny"
                                  content={deleteAriaLabel}
                                  trigger={deleteTrigger}
                                />
                              ) : null}
                            </Button.Group>
                          </Comment.Actions>
                          <Comment.Text>
                            <RichTextRenderer {...rteProps} />
                          </Comment.Text>
                        </Comment.Content>
                      </Comment>
                    );
                    return accum;
                  }, [])}
                </Comment.Group>
              </Ref>
            ) : null}
          </div>
        </ResizeDetector>
        {!this.state.isViewingNewest && hasNewMessages ? (
          <div className="cm__new-message">
            <Button
              aria-label="See new message"
              onClick={() => {
                this.setState({
                  isViewingNewest: true
                });
              }}
            >
              New message
            </Button>
          </div>
        ) : null}
      </Fragment>
    ) : null;
  }
}

ChatMessages.propTypes = {
  // This must always come from ChatPrompt/Display -> Chat
  agent: PropTypes.object,
  chat: PropTypes.object,
  getChatMessagesByChatId: PropTypes.func,
  getChatMessagesCountByChatId: PropTypes.func,
  getChatUsersByChatId: PropTypes.func,
  getUser: PropTypes.func,
  isMinimized: PropTypes.bool,
  messages: PropTypes.array,
  onMessageReceived: PropTypes.func,
  onQuote: PropTypes.func,
  run: PropTypes.object,
  scenario: PropTypes.object,
  setMessageById: PropTypes.func,
  slice: PropTypes.number,
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
  getChatMessagesByChatId: id => dispatch(getChatMessagesByChatId(id)),
  getChatMessagesCountByChatId: id =>
    dispatch(getChatMessagesCountByChatId(id)),
  getChatUsersByChatId: id => dispatch(getChatUsersByChatId(id)),
  setMessageById: (id, params) => dispatch(setMessageById(id, params))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChatMessages)
);
