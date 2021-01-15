import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';
import { connect } from 'react-redux';
import withSocket, { NEW_MESSAGE } from '@hoc/withSocket';
import {
  getChatMessagesByChatId,
  getChatMessagesCountByChatId,
  getChatUsersByChatId,
  setMessageById
} from '@actions/chat';

import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import scrollIntoView from '@utils/scrollIntoView';

import { Button, Comment, Divider, Popup, Ref } from '@components/UI';
import ChatMessageDeleteButton from '@components/Chat/ChatMessageDeleteButton';
import RichTextEditor from '@components/RichTextEditor';
import Username from '@components/User/Username';

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

const deleteAriaLabel = 'Delete this message';
const quoteAriaLabel = 'Quote this message';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      isViewingNewest: true,
      hasNewMessages: true,
      messages: [],
      slice: this.props.slice || -20
    };

    this.isComponentMounted = false;
    this.onMessageDelete = this.onMessageDelete.bind(this);
    this.onMessageReceive = this.onMessageReceive.bind(this);
  }

  async componentDidMount() {
    const messages = [];
    const count = await this.props.getChatMessagesCountByChatId(
      this.props.chat.id
    );

    if (count) {
      messages.push(
        ...(await this.props.getChatMessagesByChatId(this.props.chat.id))
      );
    }

    this.setState({
      isReady: true,
      messages
    });

    this.isComponentMounted = true;
    this.props.socket.on(NEW_MESSAGE, this.onMessageReceive);
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
    this.props.socket.off(NEW_MESSAGE, this.onMessageReceive);
  }

  async onMessageReceive(data) {
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

        this.setState({
          hasNewMessages: false,
          messages
        });

        return;
      }

      if (!this.props.chat.usersById[data.user_id]) {
        await this.props.getChatUsersByChatId(this.props.chat.id);
      }

      messages.push(data);

      this.setState({
        hasNewMessages: true,
        messages
      });
    }
  }

  async onMessageDelete({ id }) {
    const message = await this.props.setMessageById(id, {
      deleted_at: new Date().toISOString()
    });

    await this.onMessageReceive(message);
  }

  render() {
    const { chat } = this.props;
    const { hasNewMessages, isReady, messages, slice } = this.state;
    const messagesSlice = messages.slice(slice);
    const isHidingMessages = messages.length > messagesSlice.length;
    let scrollingContainer = null;

    const scrollIntoViewIfViewingNewest = node => {
      if (!scrollingContainer) {
        scrollingContainer = node;
      }

      if (this.state.isViewingNewest && this.state.hasNewMessages) {
        scrollIntoView(scrollingContainer, false);
        this.setState({
          hasNewMessages: false
        });
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

    return isReady ? (
      <Fragment>
        {/*
            NOTE: data-testid="scrolling-container-outer" is used in testing
            the scrolling behavior when receiving new messages
        */}
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
          <Ref innerRef={scrollIntoViewIfViewingNewest}>
            <Comment.Group>
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
                const avatarKey = user.email
                  ? md5(user.email.trim().toLowerCase())
                  : user.username;

                const avatarUrl = user.email
                  ? `https://www.gravatar.com/avatar/${avatarKey}?d=robohash`
                  : `https://loremflickr.com/50/50/${avatarKey}`;

                const rteProps = {
                  defaultValue,
                  mode: 'display'
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
                    <Comment.Avatar src={avatarUrl} />
                    <Comment.Content className="cmm__content">
                      <Comment.Author as="span" tabIndex="0">
                        <Username {...user} />
                      </Comment.Author>
                      <Comment.Metadata>
                        <span tabIndex="0" aria-label={message.created_at}>
                          {Moment(message.created_at).format('LT')}
                        </span>
                      </Comment.Metadata>
                      <Comment.Actions>
                        <Button.Group>
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
                        <RichTextEditor {...rteProps} />
                      </Comment.Text>
                    </Comment.Content>
                  </Comment>
                );

                return accum;
              }, [])}
            </Comment.Group>
          </Ref>
        </div>
        {!this.state.isViewingNewest && hasNewMessages ? (
          <div className="cm__centered">
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

Chat.propTypes = {
  chat: PropTypes.object,
  getChatMessagesByChatId: PropTypes.func,
  getChatMessagesCountByChatId: PropTypes.func,
  getChatUsersByChatId: PropTypes.func,
  getUser: PropTypes.func,
  messages: PropTypes.array,
  onQuote: PropTypes.func,
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
  )(Chat)
);
