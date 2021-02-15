import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import escapeRegExp from 'lodash.escaperegexp';
import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getChatById, getLinkedChatUsersByChatId } from '@actions/chat';
import { getInvites } from '@actions/invite';
import { getUsers } from '@actions/users';

import LobbyConfirmationDialog from '@components/Lobby/LobbyConfirmationDialog';
import { notify } from '@components/Notification';
import {
  Button,
  Card,
  Dropdown,
  Grid,
  Header,
  Icon,
  List,
  Popup,
  Search,
  Text
} from '@components/UI';
import Username from '@components/User/Username';

import withSocket, {
  CREATE_USER_CHANNEL,
  RUN_CHAT_LINK
} from '@hoc/withSocket';
import Identity from '@utils/Identity';
import Storage from '@utils/Storage';

import './Lobby.css';

class LobbyUserWaiting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false
    };
    this.onRunChatLink = this.onRunChatLink.bind(this);
    this.renderInviteeList = this.renderInviteeList.bind(this);
  }

  async componentDidMount() {
    const {
      user
    } = this.props;

    await this.props.getLinkedChatUsersByChatId(this.props.chat.id);

    this.setState({
      isReady: true
    })

    this.props.socket.emit(CREATE_USER_CHANNEL, { user });
    this.props.socket.on(RUN_CHAT_LINK, this.onRunChatLink);
  }

  componentWillUnmount() {
    this.props.socket.off(RUN_CHAT_LINK, this.onRunChatLink);
  }

  async onRunChatLink(data) {
    await this.props.getLinkedChatUsersByChatId(this.props.chat.id);
  }

  renderInviteeList() {
    const {
      scenario,
      user,
      usersById
    } = this.props;

    const usersWaitingWithAssignedRoles = this.props.chat.users.filter(
      user => user.persona_id
    );

    return usersWaitingWithAssignedRoles.length ? (
      <List divided selection data-testid="lobby-user-waiting-invitees">
        {usersWaitingWithAssignedRoles.map((chatUser, index) => {
          const waitingUser = usersById[chatUser.id];
          const key = Identity.key({ chatUser, index, waiting: 1 });
          const isSelectedNotHost = chatUser.id !== user.id;
          const content = 'You are the host';
          const persona = scenario.personas.find(persona =>
            persona.id === chatUser.persona_id
          );

          const asPersona = persona ? (
            <Fragment>
              as {persona.name}
            </Fragment>
          ) : null;

          return (
            <List.Item key={key}>
              <List.Content>
                <Username user={waitingUser} />{' '}
                {asPersona}
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    ) : (
      <List divided selection data-testid="lobby-user-waiting-empty">
        <List.Item>
          <List.Content>
            There are no participants waiting yet.
          </List.Content>
        </List.Item>
      </List>
    );
  }

  render() {
    const {
      isReady
    } = this.state;

    if (!isReady) {
      return null;
    }

    const {
      chat,
      scenario,
      user
    } = this.props;


    const isHostCounted = !!this.props.chat.users.find(({id}) =>
      id === user.id
    );

    const usersWaitingWithAssignedRoles = this.props.chat.users.filter(
      user => user.persona_id
    );

    const totalWaiting = usersWaitingWithAssignedRoles.length;
    const pluralParticipant = pluralize('participant', totalWaiting);
    const haveHas = pluralize('has', totalWaiting);
    // const tally = (
    //   <Text>
    //     {totalWaiting} {pluralParticipant} {haveHas} accepted your invite.
    //   </Text>
    // );
    // <Card.Content extra>
    //   {tally}
    // </Card.Content>

    return (
      <Fragment>
        <Grid padded className="l__waiting not-modal">
          <Grid.Row>
            <Grid.Column>
              {totalWaiting ? (
                <p>Who is in the scenario room?</p>
              ) : (
                <p>There are no participants are in the scenario room yet.</p>
              )}
            </Grid.Column>
          </Grid.Row>
          {totalWaiting ? (
            <Grid.Row>
              <Grid.Column>
                <Card fluid>
                  <Card.Content>
                    {this.renderInviteeList()}
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          ) : null}
        </Grid>
      </Fragment>
    );
  }
}

LobbyUserWaiting.propTypes = {
  chat: PropTypes.object,
  cohort: PropTypes.object,
  scenario: PropTypes.object,
  getUsers: PropTypes.func,
  user: PropTypes.object,
  users: PropTypes.array,
  usersById: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { user } = state;

  const chat = state.chat && state.chat.id
    ? state.chat
    : (ownProps.chat || null);

  const cohort = state.cohort && state.cohort.id
    ? state.cohort
    : (ownProps.cohort || null);

  const scenario = state.scenario && state.scenario.id
    ? state.scenario
    : (ownProps.scenario || null);

  const users = cohort ? cohort.users : state.users;
  const usersById = users.reduce(
    (accum, user) => ({
      ...accum,
      [user.id]: user
    }),
    {}
  );

  return { chat, cohort, scenario, user, users, usersById };
};

const mapDispatchToProps = dispatch => ({
  getChatById: (id) => dispatch(getChatById(id)),
  getLinkedChatUsersByChatId: (id) => dispatch(getLinkedChatUsersByChatId(id)),
  getInvites: () => dispatch(getInvites()),
  getUsers: limit => dispatch(getUsers(limit)),
});

export default withSocket(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(LobbyUserWaiting)
  )
);
