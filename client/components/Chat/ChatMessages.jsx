import React, { Component } from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';
import { connect } from 'react-redux';
import withSocket, {
  JOIN_OR_PART,
  NEW_MESSAGE,
  NOTIFICATION
} from '@hoc/withSocket';
import withRunEventCapturing, {
  CHAT_JOIN,
  CHAT_PART,
  CHAT_MESSAGE
} from '@hoc/withRunEventCapturing';
import {
  getChat,
  getChatMessagesByChatId,
  getChatMessagesCountByChatId
} from '@actions/chat';
import { getUser } from '@actions/user';

import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import scrollIntoView from '@utils/scrollIntoView';
import Storage from '@utils/Storage';

// import { ResizableBox } from 'react-resizable';
import { Comment, Ref } from '@components/UI';
import Loading from '@components/Loading';
import RichTextEditor from '@components/RichTextEditor';
import Username from '@components/User/Username';

import './Chat.css';

const messageIdCache = {};

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      messages: []
    };

    this.onNewMessage = this.onNewMessage.bind(this);
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

    this.props.socket.on(NEW_MESSAGE, this.onNewMessage);
  }

  componentWillUnmount() {
    this.props.socket.off(NEW_MESSAGE, this.onNewMessage);
  }

  onNewMessage(data) {
    if (messageIdCache[data.id]) {
      return;
    }

    messageIdCache[data.id] = true;

    const { messages } = this.state;

    messages.push(data);

    this.setState({
      messages
    });
  }

  render() {
    const { chat } = this.props;
    const { isReady, messages } = this.state;

    return isReady ? (
      <div className="cm__container-inner">
        <Ref innerRef={node => scrollIntoView(node, false)}>
          <Comment.Group>
            {messages.map(message => {
              const key = Identity.key(message);
              const user = chat.usersById[message.user_id];
              const __html = message.content;

              const avatarKey = user.email
                ? md5(user.email.trim().toLowerCase())
                : user.username;

              const avatarUrl = user.email
                ? `https://www.gravatar.com/avatar/${avatarKey}?d=robohash`
                : `https://loremflickr.com/50/50/${avatarKey}`;

              // console.log(user);
              // console.log(message);
              return (
                <Comment key={key}>
                  <Comment.Avatar src={avatarUrl} />
                  <Comment.Content className="cmm__content">
                    <Comment.Author as="span" tabIndex="0">
                      <Username {...user} />
                    </Comment.Author>
                    <Comment.Metadata>
                      <span tabIndex="0">
                        {Moment(message.created_at).fromNow()}
                      </span>
                    </Comment.Metadata>
                    <Comment.Text>
                      <div tabIndex="0" dangerouslySetInnerHTML={{ __html }} />
                    </Comment.Text>
                    <Comment.Actions>
                      <Comment.Action tabIndex="0">Reply</Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              );
            })}
          </Comment.Group>
        </Ref>
      </div>
    ) : null;
  }
}

Chat.propTypes = {
  chat: PropTypes.object,
  getChatMessagesByChatId: PropTypes.func,
  getChatMessagesCountByChatId: PropTypes.func,
  getUser: PropTypes.func,
  messages: PropTypes.array,
  onReply: PropTypes.func,
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
    dispatch(getChatMessagesCountByChatId(params))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)
);
