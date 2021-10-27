import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getChatInvites } from '@actions/chat';
import { getCohortChatsOverview } from '@actions/cohort';
import { getScenariosByStatus } from '@actions/scenario';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import { Button, Card, Grid, List, Text } from '@components/UI';
import Username from '@components/User/Username';
import Avatar from '@utils/Avatar';
import Identity from '@utils/Identity';
import './Lobby.css';

class LobbyUserOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false
    };

    this.timeout = null;
    this.refresh = this.refresh.bind(this);
    this.renderChatCards = this.renderChatCards.bind(this);
    this.renderUserList = this.renderUserList.bind(this);
  }

  async refresh() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    const chats = await this.props.getCohortChatsOverview(this.props.cohort.id);
    const invites = await this.props.getChatInvites(this.props.chat.id);
    const isReady = true;
    this.setState({
      isReady,
      chats,
      invites
    });
    this.timeout = setTimeout(async () => {
      await this.refresh;
    }, 5000);
  }

  async componentDidMount() {
    await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);
    await this.refresh();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  renderUserList(users, options = {}) {
    const { onSelect } = options;
    return (
      <List divided relaxed selection data-testid="lobby-cohort-chat-users">
        {users.reduce((accum, user, index) => {
          const key = Identity.key({ user, index });
          // const avatar = new Avatar(user);
          const scenario = user.chat
            ? this.props.scenariosById[user.chat.scenario_id]
            : null;
          const persona =
            scenario && scenario.personas && user.persona_id
              ? scenario.personas.find(p => p.id === user.persona_id)
              : null;
          const explanation = persona ? (
            <Text>
              as <strong>{persona.name}</strong> in{' '}
              <strong>{scenario.title}</strong>
            </Text>
          ) : null;

          const listItemProps = {
            as: 'a',
            key,
            onClick: () => {
              if (onSelect) {
                onSelect(user);
              }
            }
          };

          accum.push(
            <List.Item {...listItemProps}>
              <List.Content>
                <List.Description>
                  {/*<Image size="mini" src={avatar.src} />{' '}*/}
                  <Username user={user} />
                  {explanation}
                </List.Description>
              </List.Content>
            </List.Item>
          );

          return accum;
        }, [])}
      </List>
    );
  }

  renderChatCards(chats) {
    return chats.reduce((accum, chat, index) => {
      const key = Identity.key({ chat, index });
      const host = this.props.usersById[chat.host_id];
      const scenario = this.props.scenariosById[chat.scenario_id];
      const ownerDisplay = scenario ? (
        <Fragment>
          <strong>
            <Username user={host} possessive />
          </strong>{' '}
          {scenario.name} room
        </Fragment>
      ) : null;
      // const avatar = new Avatar(host);
      const personasInUse = chat.users.reduce((accum, user) => {
        if (user.is_present && user.persona_id !== null) {
          accum.push(user.persona_id);
        }
        return accum;
      }, []);

      const personasNotInUse = scenario.personas.reduce((accum, persona) => {
        if (!personasInUse.includes(persona)) {
          accum.push(persona);
        }
        return accum;
      }, []);

      accum.push(
        <Card
          fluid
          className="l__overviewcard"
          data-testid="lobby-cohort-chat-card"
          key={key}
        >
          <Card.Content>
            <Card.Description>
              <strong>{ownerDisplay}</strong>
              <br />
              {this.renderUserList(chat.users, scenario)}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            {personasNotInUse.length && chat.is_open ? (
              <Button primary>Join room</Button>
            ) : (
              <Text>This room is invite only</Text>
            )}
          </Card.Content>
        </Card>
      );
      return accum;
    }, []);
  }

  render() {
    const { chats, isReady } = this.state;

    const { chat, cohort, onSelect, user } = this.props;

    if (!isReady) {
      return null;
    }

    const usersInRooms = chats.reduce((accum, chat) => {
      if (chat.users.find(u => u.id === user.id)) {
        return accum;
      }
      return accum.concat(
        chat.users.reduce((accum, user) => {
          if (user.is_present && user.persona_id) {
            user.chat = {
              ...chat
            };
            delete user.chat.users;
            accum.push(user);
          }
          return accum;
        }, [])
      );
    }, []);

    const usersNotInRooms = cohort.users.reduce((accum, cohortUser) => {
      const userInRoom =
        usersInRooms.find(user => user.id === cohortUser.id) ||
        chat.users.find(user => user.id === cohortUser.id);

      if (!userInRoom) {
        accum.push(cohortUser);
      }
      return accum;
    }, []);

    const otherRooms = chats.reduce((accum, chat) => {
      const inRoom = this.props.chat.id === chat.id;
      if (inRoom) {
        return accum;
      }
      return [...accum, chat];
    }, []);

    return (
      <Grid padded className="l__waiting not-modal">
        {usersNotInRooms.length ? (
          <Fragment>
            <Grid.Row>
              <Grid.Column>
                <p>
                  Who is <strong>not in any scenario</strong> room?
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Card
                  fluid
                  className="l__overviewcard"
                  data-testid="lobby-cohort-users-unassigned-card"
                >
                  <Card.Content>
                    {this.renderUserList(usersNotInRooms, { onSelect })}
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Fragment>
        ) : null}
        {usersInRooms.length ? (
          <Fragment>
            <Grid.Row>
              <Grid.Column>
                <p>
                  Who is in <strong>another scenario</strong> room?
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Card
                  fluid
                  className="l__overviewcard"
                  data-testid="lobby-cohort-users-assigned-card"
                >
                  <Card.Content>
                    {this.renderUserList(usersInRooms)}
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Fragment>
        ) : null}
        {otherRooms.length ? (
          <Fragment>
            <Grid.Row>
              <Grid.Column>
                <p>Other rooms for this scenario</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Card.Group className="l__overviewcards">
                  {this.renderChatCards(otherRooms)}
                </Card.Group>
              </Grid.Column>
            </Grid.Row>
          </Fragment>
        ) : null}
      </Grid>
    );
  }
}

LobbyUserOverview.propTypes = {
  chat: PropTypes.object,
  cohort: PropTypes.object,
  getChatInvites: PropTypes.func,
  getCohortChatsOverview: PropTypes.func,
  getScenariosByStatus: PropTypes.func,
  onSelect: PropTypes.func,
  scenario: PropTypes.object,
  scenariosById: PropTypes.object,
  user: PropTypes.object,
  users: PropTypes.array,
  usersById: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { user, scenariosById } = state;

  const chat = state.chat && state.chat.id ? state.chat : ownProps.chat || null;

  const cohort =
    state.cohort && state.cohort.id ? state.cohort : ownProps.cohort || null;

  const scenario =
    state.scenario && state.scenario.id
      ? state.scenario
      : ownProps.scenario || null;

  const users = cohort ? cohort.users : state.users;
  const usersById = users.reduce(
    (accum, user) => ({
      ...accum,
      [user.id]: user
    }),
    {}
  );

  return { chat, cohort, scenario, scenariosById, user, users, usersById };
};

const mapDispatchToProps = dispatch => ({
  getChatInvites: id => dispatch(getChatInvites(id)),
  getCohortChatsOverview: id => dispatch(getCohortChatsOverview(id)),
  getScenariosByStatus: params => dispatch(getScenariosByStatus(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LobbyUserOverview)
);
