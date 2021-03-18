import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import {
  createChat,
  setChat,
  getChatsByCohortId,
  getChatUsersByChatId,
  joinChat
} from '@actions/chat';
import Lobby from '@components/Lobby';
import {
  Button,
  Card,
  Confirm,
  Form,
  Grid,
  Header,
  Icon,
  Label,
  Modal,
  Text
} from '@components/UI';
import Username from '@components/User/Username';
import withSocket, {
  CHAT_CREATED,
  CHAT_ENDED,
  CREATE_COHORT_CHANNEL,
  HOST_JOIN,
  JOIN_OR_PART,
  RUN_CHAT_LINK
} from '@hoc/withSocket';
import Identity from '@utils/Identity';
import Storage from '@utils/Storage';
import './Cohort.css';

export const makeCohortScenarioChatJoinPath = (cohort, scenario, chat) => {
  const persisted = Storage.get(`cohort/${cohort.id}/run/${scenario.id}`);
  const slideIndex = persisted ? persisted.activeRunSlideIndex : 0;
  const redirectCohortPart = `/cohort/${Identity.toHash(cohort.id)}`;
  const redirectRunPart = `/run/${Identity.toHash(scenario.id)}`;
  const redirectChatPart = `/chat/${Identity.toHash(chat.id)}`;
  const redirectSlidePart = `/slide/${slideIndex}`;

  return [
    redirectCohortPart,
    redirectRunPart,
    redirectChatPart,
    redirectSlidePart
  ].join('');
};

export class CohortRoomSelector extends React.Component {
  constructor(props) {
    super(props);

    const lobby = this.props.lobby || {
      isOpen: false
    };

    this.state = {
      isReady: false,
      isOpenToCohort: false,
      confirm: {
        isOpen: false,
      },
      create: {
        isOpen: false
      },
      lobby
    };
    this.createChat = this.createChat.bind(this);
    this.fetchChats = this.fetchChats.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  async fetchChats(data = {}) {
    await this.props.getChatsByCohortId(this.props.cohort.id);
    if (data.chat) {
      await this.props.getChatUsersByChatId(data.chat.id);
    }
    /* istanbul ignore else */
    if (!this.state.isReady) {
      this.setState({
        isReady: true
      });
    }
  }

  async componentDidMount() {
    await this.fetchChats();

    const { cohort } = this.props;

    this.props.socket.emit(CREATE_COHORT_CHANNEL, { cohort });
    this.props.socket.on(CHAT_CREATED, this.fetchChats);
    this.props.socket.on(CHAT_ENDED, this.fetchChats);
    this.props.socket.on(HOST_JOIN, this.fetchChats);
    this.props.socket.on(JOIN_OR_PART, this.fetchChats);
    this.props.socket.on(RUN_CHAT_LINK, this.fetchChats);
  }

  componentWillUnmount() {
    this.props.socket.off(CHAT_CREATED, this.fetchChats);
    this.props.socket.off(CHAT_ENDED, this.fetchChats);
    this.props.socket.off(HOST_JOIN, this.fetchChats);
    this.props.socket.off(JOIN_OR_PART, this.fetchChats);
    this.props.socket.off(RUN_CHAT_LINK, this.fetchChats);
  }

  async createChat(/* event */) {
    const chat = await this.props.createChat(
      this.props.scenario,
      this.props.cohort,
      this.state.isOpenToCohort
    );

    await this.fetchChats({ chat });
  }

  onCloseClick() {
    /* istanbul ignore else */
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const { onCloseClick } = this;

    const { chat, chats, cohort, scenario, user } = this.props;
    const { isReady } = this.state;

    if (!isReady) {
      return null;
    }

    const defaultOptions = scenario.personas.reduce((accum, persona) => {
      accum.push({
        persona,
        key: Identity.key(persona),
        value: persona.id,
        text: persona.name,
        content: (
          <Fragment>
            <Text>{persona.name}</Text>
            <br />
            <Text size="small">{persona.description}</Text>
          </Fragment>
        )
      });
      return accum;
    }, []);

    let isUserCurrentlyHosting = false;

    const cards = chats.reduce((accum, chat) => {
      const key = Identity.key(chat);
      const userInChat = chat.usersById[user.id];
      const host = chat.usersById[chat.host_id];
      const userIsNotHost = host.id !== user.id;
      const isUserHost = !userIsNotHost;
      let hasHostClaimedARole = false;
      const filledRoles = chat.users.reduce((accum, { id, persona_id }) => {
        if (id === chat.host_id && persona_id) {
          hasHostClaimedARole = true;
        }
        if (persona_id) {
          accum.push(persona_id);
        }
        return accum;
      }, []);

      // If this user is not the host, don't display a public room if the
      // host hasn't selected a role yet
      if (userIsNotHost && !hasHostClaimedARole) {
        return accum;
      }

      // const unfilledRoles = scenario.personas.reduce((accum, persona) => {
      //   if (!filledRoles.includes(persona.id)) {
      //     accum.push(persona);
      //   }
      //   return accum;
      // }, []);

      // Skip the first option, since it's a placeholder.
      // Remove any options that are already
      // assigned/claimed by other users
      const options = defaultOptions.filter(
        option => !filledRoles.includes(option.value)
      );

      if (!options.length) {
        return accum;
      }

      const memoChatId = chat.id;

      const miniSendInvitesButton = (
        <Button
          compact
          className="primary"
          onClick={async () => {
            await this.fetchChats({ chat });
            this.setState({
              lobby: {
                chat: {
                  ...this.props.chatsById[memoChatId]
                },
                isOpen: true
              }
            });
          }}
        >
          Send invites
        </Button>
      );

      const miniCloseChatButton = (
        <Button
          compact
          onClick={async () => {
            const time = new Date().toISOString();
            await this.props.setChat(memoChatId, {
              deleted_at: time,
              ended_at: time
            });
            await this.fetchChats({ chat });
          }}
        >
          Close room
        </Button>
      );

      const miniJoinScenarioButton = (
        <Button
          fluid
          className="primary"
          onClick={() => {
            location.href = makeCohortScenarioChatJoinPath(
              cohort,
              scenario,
              chat
            );
          }}
        >
          Join room
        </Button>
      );

      const isUserRoleAssigned = userInChat && userInChat.persona_id !== null;

      const userPersona = isUserRoleAssigned
        ? scenario.personas.find(({ id }) => id === userInChat.persona_id)
        : null;

      const userRoleDisplay =
        isUserRoleAssigned && userPersona ? (
          <Fragment>
            You are participating as <strong>{userPersona.name}</strong>. Click{' '}
            <strong>Join Room</strong> to run the scenario.
            <br />
            <br />
            The following roles are not yet assigned.
          </Fragment>
        ) : (
          'Click on one of those roles to join the scenario room:'
        );

      const whoseRoom = userIsNotHost ? (
        <Fragment>{<Username user={host} possessive />} room</Fragment>
      ) : (
        <Fragment>This is your room</Fragment>
      );

      accum.push(
        <Card key={key}>
          <Card.Content className="c__chat-card">
            {whoseRoom ? <Card.Header>{whoseRoom}</Card.Header> : null}
            <Card.Description className="c__chat-card__meta">
              <p>{userRoleDisplay}</p>
              <Label.Group>
                {options.reduce((accum, option, index) => {
                  const { content, persona } = option;
                  const key = Identity.key({ scenario, chat, index });
                  accum.push(
                    <Label
                      className="fluid"
                      as={Button}
                      key={key}
                      onClick={async () => {
                        const joined = await this.props.joinChat(chat.id, persona);
                        if (joined) {
                          location.href = makeCohortScenarioChatJoinPath(
                            cohort,
                            scenario,
                            chat
                          );
                        } else {
                          this.setState({
                            confirm: {
                              isOpen: true
                            }
                          });
                          await this.props.getChatsByCohortId(cohort.id);
                        }
                      }}
                    >
                      {content}
                    </Label>
                  );

                  return accum;
                }, [])}
              </Label.Group>
            </Card.Description>
          </Card.Content>
          {isUserRoleAssigned ? (
            <Card.Content extra>{miniJoinScenarioButton}</Card.Content>
          ) : null}
          {isUserHost ? (
            <Card.Content extra>
              <Button.Group fluid widths={2}>
                {miniSendInvitesButton}
                <Button.Or />
                {miniCloseChatButton}
              </Button.Group>
            </Card.Content>
          ) : null}
        </Card>
      );
      // {isUserHost ? (
      //   <Card.Content extra>
      //     <Button.Group>
      //       {miniCloseChatButton}
      //     </Button.Group>
      //   </Card.Content>
      // ) : null}

      if (!isUserCurrentlyHosting && isUserHost) {
        isUserCurrentlyHosting = isUserHost;
      }

      return accum;
    }, []);

    const publicOrPrivateChatButtonContent = this.state.isOpenToCohort
      ? 'Create'
      : 'Create and go to lobby';

    const primaryCreateButtonContent = this.state.create.isOpen
      ? publicOrPrivateChatButtonContent
      : '';

    const primaryLobbyButtonContent = this.state.lobby.isOpen
      ? 'Join room'
      : '';

    const primaryButtonContent = this.state.create.isOpen
      ? primaryCreateButtonContent
      : primaryLobbyButtonContent;

    let host = null;

    // If this component received an explicit "lobby" object,
    // check to make sure that the host has a role before allowing
    // then to proceed to the room.
    if (this.state.lobby.isOpen && this.state.lobby.chat) {
      const chat = this.props.chatsById[this.state.lobby.chat.id];
      host = chat.usersById[user.id];
    }

    if (user.id === chat.host_id) {
      host = chat.usersById[user.id];
    }

    // If the use is also the host, but has not selected a role,
    // then they cannot join the room yet.
    const primaryButtonDisabled =
      host && this.state.lobby.isOpen ? host.persona_id === null : false;

    const primaryButtonProps = {
      content: primaryButtonContent,
      disabled: primaryButtonDisabled,
      primary: true,
      onClick: async () => {
        if (this.state.lobby.isOpen) {
          location.href = makeCohortScenarioChatJoinPath(
            cohort,
            scenario,
            this.state.lobby.chat || this.props.chat
          );
          return;
        }

        /* istanbul ignore else */
        if (this.state.create.isOpen) {
          const lobbyIsOpen = !this.state.isOpenToCohort;
          this.setState(
            {
              isReady: false,
              create: {
                isOpen: false
              },
              lobby: {
                isOpen: lobbyIsOpen
              }
            },
            async () => {
              await this.createChat();
            }
          );
        }
      }
    };

    const { secondary = {} } = this.props?.buttons || {};

    const closeOrCancel = this.state.create.isOpen ? 'Cancel' : 'Close';

    const onCloseOrCancel = () => {
      if (this.state.create.isOpen) {
        this.setState({
          isOpenToCohort: false,
          create: {
            isOpen: false
          },
          lobby: {
            isOpen: false
          }
        });
      } else {
        onCloseClick();
        if (secondary?.onClick) {
          secondary?.onClick();
        }
      }
    };

    const secondaryButtonProps = {
      content: closeOrCancel,
      onClick: onCloseOrCancel
    };

    const onCreateToggleClick = () => {
      const { create } = this.state;
      create.isOpen = !create.isOpen;
      this.setState({
        create
      });
    };

    const onRoomAccessChange = event => {
      const { value } = event.target;
      const isOpenToCohort = value === 'yes';
      this.setState({
        isOpenToCohort
      });
    };

    const pluralRoom = pluralize('room', cards.length);
    const isAre = pluralize('is', cards.length);
    const availableDisplay = (
      <p tabIndex="0">
        There {isAre} <strong>{cards.length}</strong> open {pluralRoom}{' '}
        available.
      </p>
    );

    const createOrLobbyIsOpen =
      this.state.create.isOpen || this.state.lobby.isOpen;
    const createOrLobbyHeader = this.state.create.isOpen
      ? `Creating a room for ${scenario.title}`
      : `Invite participants to your room for ${scenario.title}`;

    const headerContent = createOrLobbyIsOpen
      ? createOrLobbyHeader
      : `Create or join a room for ${scenario.title}`;

    const onConfirmClose = () => {
      this.setState({
        confirm: {
          isOpen: false
        }
      });
    };

    return (
      <Modal.Accessible open>
        <Modal
          closeIcon
          open
          aria-modal="true"
          role="dialog"
          centered={false}
          onClose={secondaryButtonProps.onClick}
        >
          <Header icon="group" tabIndex="0" content={headerContent} />
          <Modal.Content scrolling style={{ height: 'calc(100vh - 10rem)' }}>
            {createOrLobbyIsOpen ? (
              <Fragment>
                {this.state.create.isOpen ? (
                  <Grid padded>
                    <Grid.Row>
                      <Grid.Column className="c__grid-single-col-padding">
                        <p tabIndex="0">
                          Is your room open to anyone in your cohort?
                        </p>
                        <Form>
                          <Form.Field>
                            <div className="ui checked radio checkbox">
                              <input
                                tabIndex="0"
                                type="radio"
                                name="isOpenToCohort"
                                id="no"
                                value="no"
                                checked={this.state.isOpenToCohort === false}
                                onChange={onRoomAccessChange}
                              />
                              <label htmlFor="no">
                                No, I will invite participants.
                              </label>
                            </div>
                          </Form.Field>

                          <Form.Field>
                            <div className="ui checked radio checkbox">
                              <input
                                tabIndex="0"
                                type="radio"
                                name="isOpenToCohort"
                                id="yes"
                                value="yes"
                                checked={this.state.isOpenToCohort === true}
                                onChange={onRoomAccessChange}
                              />
                              <label htmlFor="yes">
                                Yes, let anyone in my cohort join.
                              </label>
                            </div>
                          </Form.Field>
                        </Form>
                        <div data-testid="cohort-chat-creator" />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                ) : null}
                {this.state.lobby.isOpen ? (
                  <Lobby
                    chat={this.state.lobby.chat}
                    cohort={cohort}
                    scenario={scenario}
                  />
                ) : null}
              </Fragment>
            ) : (
              <Fragment>
                {!isUserCurrentlyHosting ? (
                  <Button
                    size="large"
                    tabIndex="0"
                    onClick={onCreateToggleClick}
                  >
                    <Icon.Group>
                      <Icon className="primary" name="group" />
                      <Icon corner="top right" name="plus" />
                    </Icon.Group>
                    Create a room for this scenario
                  </Button>
                ) : null}
                <Grid padded>
                  <Grid.Row>
                    <Grid.Column className="c__grid-single-col-padding">
                      <p>
                        This scenario requires multiple particpants in order to
                        complete. Runs of the scenario are completed in{' '}
                        <strong>Rooms</strong>. <strong>Rooms</strong> shown
                        here are open for you to join.
                      </p>
                      {!isUserCurrentlyHosting ? (
                        <p>
                          If there are no rooms here, and you can click{' '}
                          <strong>Create a room for this scenario</strong> to
                          host your own room. You will be able to invite other
                          participants directly, or allow all members of this
                          cohort to join freely.
                        </p>
                      ) : null}

                      {availableDisplay}
                      {/* PREVIOUSLY
                        <Card.Group className="c__chat-cards" itemsPerRow={3}>
                      */}
                      <Card.Group itemsPerRow={3}>{cards}</Card.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Fragment>
            )}
          </Modal.Content>
          <Modal.Actions className="c__action-btns__scenario-selector">
            <Button.Group fluid>
              {this.state.create.isOpen ? (
                <Fragment>
                  <Button {...primaryButtonProps} />
                  <Button.Or />
                </Fragment>
              ) : null}
              {this.state.lobby.isOpen ? (
                <Fragment>
                  <Button {...primaryButtonProps} />
                  <Button.Or />
                </Fragment>
              ) : null}
              <Button {...secondaryButtonProps} />
            </Button.Group>
          </Modal.Actions>
          <div data-testid="cohort-chat-selector" />

          {this.state.confirm.isOpen ? (
            <Modal.Accessible open>
              <Modal
                closeIcon
                open
                aria-modal="true"
                role="dialog"
                size="small"
                onClose={onConfirmClose}
              >
                <Header
                  icon="close"
                  content="Could not join room"
                />
                <Modal.Content>
                  Sorry, but that room is full. Please join another room, or create your own.
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    fluid
                    primary
                    aria-label="Ok"
                    onClick={onConfirmClose}
                  >
                    Ok
                  </Button>
                </Modal.Actions>
                <div data-testid="confirm" />
              </Modal>
            </Modal.Accessible>
          ) : null}
        </Modal>
      </Modal.Accessible>
    );
  }
}

CohortRoomSelector.propTypes = {
  buttons: PropTypes.object,
  chat: PropTypes.object,
  chats: PropTypes.array,
  chatsById: PropTypes.object,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    roles: PropTypes.array,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  createChat: PropTypes.func,
  lobby: PropTypes.object,
  setChat: PropTypes.func,
  getChatsByCohortId: PropTypes.func,
  getChatUsersByChatId: PropTypes.func,
  header: PropTypes.any,
  joinChat: PropTypes.func,
  onClose: PropTypes.func,
  scenario: PropTypes.object,
  socket: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { chat, cohort, chatsById, user } = state;
  let chats = [];

  if (state.chats && state.chats.length) {
    chats.push(
      ...state.chats.filter(({ cohort_id, ended_at, host_id, is_open }) => {
        const isKeeper = (is_open || host_id === user.id) && !ended_at;
        if (cohort && cohort.id) {
          return isKeeper && cohort.id === cohort_id;
        } else {
          return isKeeper;
        }
      })
    );
  }

  const lobby = ownProps.lobby || null;

  if (lobby && !lobby.chat) {
    lobby.chat = chats.find(
      chat =>
        chat.scenario_id === ownProps.scenario.id &&
        chat.host_id === user.id &&
        chat.cohort_id === cohort.id
    );

    if (!lobby.chat) {
      lobby.isOpen = false;
    }
  }

  return { chat, cohort, chats, chatsById, lobby, user };
};

const mapDispatchToProps = dispatch => ({
  joinChat: (...params) => dispatch(joinChat(...params)),
  createChat: (...params) => dispatch(createChat(...params)),
  setChat: (id, params) => dispatch(setChat(id, params)),
  getChatsByCohortId: id => dispatch(getChatsByCohortId(id)),
  getChatUsersByChatId: id => dispatch(getChatUsersByChatId(id))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortRoomSelector)
);
