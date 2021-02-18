import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import escapeRegExp from 'lodash.escaperegexp';
import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  createChatInvite,
  getLinkedChatUsersByChatId,
  joinChat
} from '@actions/chat';
import { getInvites } from '@actions/invite';

import LobbyConfirmationDialog from '@components/Lobby/LobbyConfirmationDialog';
import { notify } from '@components/Notification';
import {
  Button,
  Card,
  Dropdown,
  Grid,
  List,
  Message,
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

const resultRenderer = user => (
  <Fragment>
    {user.content}
    <Text grey className="l__hidden" size="small">
      (Select to invite)
    </Text>
  </Fragment>
);

class LobbyUserSelect extends Component {
  constructor(props) {
    super(props);

    const hasChat = !!(this.props.chat && this.props.chat.id);
    this.sessionKey = hasChat ? `lobby/${this.props.chat.id}` : '';

    const user = this.props.user;
    const { instruction, selected } = Storage.get(this.sessionKey, {
      instruction: {
        isOpen: true
      },
      selected: [{ user, persona: { id: null } }]
    });

    this.state = {
      isReady: false,
      confirmation: {
        isOpen: false
        /*
        props: {
          header: '',
          content: '',
          buttons: {
            primary: {},
            secondary: {}
          }
        }
        */
      },
      instruction,
      results: [],
      selected,
      sent: [],
      search: ''
    };

    this.onRemoveInviteeClick = this.onRemoveInviteeClick.bind(this);
    this.onResultSelect = this.onResultSelect.bind(this);
    this.onRunChatLink = this.onRunChatLink.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSelectedPersonaChange = this.onSelectedPersonaChange.bind(this);
    this.onSendInviteClick = this.onSendInviteClick.bind(this);
    this.renderInviteeList = this.renderInviteeList.bind(this);
  }

  async componentDidMount() {
    const { user } = this.props;

    if (this.props.chat && this.props.chat.id) {
      await this.props.getLinkedChatUsersByChatId(this.props.chat.id);

      this.setState({
        isReady: true
      });

      this.props.socket.emit(CREATE_USER_CHANNEL, { user });
      this.props.socket.on(RUN_CHAT_LINK, this.onRunChatLink);
    }
  }

  componentWillUnmount() {
    this.props.socket.off(RUN_CHAT_LINK, this.onRunChatLink);
  }

  async onRunChatLink(/* data */) {
    await this.props.getLinkedChatUsersByChatId(this.props.chat.id);
  }

  onRemoveInviteeClick(event, { id }) {
    const selected = this.state.selected.slice();
    const index = selected.findIndex(selection => selection.user.id === id);
    selected.splice(index, 1);
    this.setState({
      selected
    });
    Storage.merge(this.sessionKey, { selected });
  }

  onSelectedPersonaChange(event, { name: index, value: id }) {
    const selected = this.state.selected.slice();
    selected[index] = {
      ...selected[index],
      persona: {
        id
      }
    };
    this.setState({
      selected
    });
    Storage.merge(this.sessionKey, { selected });
  }

  renderInviteeList() {
    const { onRemoveInviteeClick, onSelectedPersonaChange } = this;
    const { chat, personasInUseById, scenario, user, usersById } = this.props;
    const host = chat.usersById[chat.host_id];
    const selected = this.state.selected.reduce((accum, selection) => {
      // Don't include users that are already in the chat and waiting
      const userInChat = chat.usersById[selection.user.id];

      if (!userInChat) {
        accum.push(selection);
      } else {
        if (!userInChat.persona_id || userInChat === host) {
          accum.push(selection);
        }
      }

      return accum;
    }, []);
    const defaultOptions = scenario.personas.reduce((accum, persona, index) => {
      // Don't include personas that are already accepted by users that
      // are in the chat and waiting.
      if (!personasInUseById[persona.id]) {
        accum.push({
          key: Identity.key({ persona, default: index }),
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
      }
      return accum;
    }, []);

    defaultOptions.unshift({
      key: Identity.key({ empty: true, [chat.id]: 1 }),
      value: null,
      text: ''
    });

    const rolesAssigned = selected
      .map(selection => selection.persona.id)
      .filter(Boolean);

    return selected.length ? (
      <List divided selection data-testid="lobby-user-select-invitees">
        {selected.map((selection, index) => {
          const selectedUser = usersById[selection.user.id];
          const key = Identity.key({
            [selectedUser.key]: index,
            [selectedUser.id]: index,
            selected: index
          });
          const options = defaultOptions
            .slice()
            .filter(
              ({ value }) =>
                !rolesAssigned.includes(value) || selection.persona.id === value
            );
          const isSelectedNotHost = selection.user.id !== user.id;
          const content = 'You are the host';
          const wrappedUsernameContent = <span>{selectedUser.content}</span>;
          const selectedUserDisplay = isSelectedNotHost ? (
            wrappedUsernameContent
          ) : (
            <Popup
              inverted
              basic
              size="small"
              content={content}
              trigger={wrappedUsernameContent}
            />
          );

          const guestOrHostGuestInitialAction = isSelectedNotHost
            ? 'Assign'
            : 'Choose';

          const action = selection.persona.id
            ? 'Change'
            : guestOrHostGuestInitialAction;

          const articleOrPossessivePronoun = isSelectedNotHost ? 'a' : 'your';

          const placeholder = `${action} ${articleOrPossessivePronoun} role`;

          const dropdown = (
            <Dropdown
              selection
              key={`${key}-dropdown`}
              name={index}
              id={selection.user.id}
              onChange={onSelectedPersonaChange}
              options={options}
              placeholder={placeholder}
              value={selection.persona.id}
            />
          );

          return (
            <List.Item key={key}>
              <List.Content floated="right">{dropdown}</List.Content>
              <List.Content>
                {isSelectedNotHost ? (
                  <Button
                    className="icon-primary"
                    icon="x"
                    size="tiny"
                    aria-label={`Remove ${selectedUser.title}`}
                    id={selectedUser.id}
                    onClick={onRemoveInviteeClick}
                  />
                ) : null}
                {selectedUserDisplay}
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    ) : /* istanbul ignore next */
    null;
  }

  onResultSelect(event, { result }) {
    const rolesCount = this.props.scenario.personas.length;
    const selectedCount = this.state.selected.length;
    const selection = {
      user: {
        id: result.id
      },
      persona: {
        id: null
      }
    };

    if (selectedCount >= rolesCount) {
      const pluralRole = pluralize('role', rolesCount);
      const { scenario } = this.props;
      const header = 'Too many people!';
      const content = (
        <Grid padded className="l__confirmation">
          <Grid.Row>
            <Grid.Column>
              <p>
                The scenario &quot;{scenario.title}&quot; has {rolesCount}{' '}
                available {pluralRole}.
              </p>
              <p>
                To select another person for a role, first remove someone else
                from the list of selected participants.
              </p>
            </Grid.Column>
          </Grid.Row>
          {/*
          // TODO: Figure out how to make this functional from here.
          //        The issue is not simply allowing the user to remove
          //        an invitee directly, but what to do AFTER
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  {this.renderInviteeList()}
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          */}
        </Grid>
      );

      const confirmation = {
        isOpen: false
      };

      const primaryOnClick = () => {
        const selected = [...this.state.selected, selection];

        this.setState({
          confirmation,
          selected
        });

        Storage.merge(this.sessionKey, { selected });
      };

      const secondaryOnClick = () => {
        this.setState({
          confirmation
        });
      };

      this.setState({
        confirmation: {
          isOpen: true,
          props: {
            header,
            content,
            buttons: {
              primary: {
                content: 'Remove a participant',
                onClick: primaryOnClick
              },
              secondary: {
                content: 'Discard selection',
                onClick: secondaryOnClick
              }
            }
          }
        }
      });
    } else {
      const selected = [...this.state.selected, selection];

      this.setState({
        results: [],
        selected
      });

      Storage.merge(this.sessionKey, { selected });
    }
  }

  onSendInviteClick() {
    const { scenario, usersById } = this.props;
    const { isSending, selected, sent } = this.state;
    const header = 'Send invites?';
    const participants = selected.slice(1);
    const pluralParticipant = pluralize('participant', participants.length);
    const pluralRole = pluralize('role', participants.length);
    const thisOrThese = pluralize('this', participants.length);

    const ListItem = ({ selection }) => {
      const user = usersById[selection.user.id];
      const key = Identity.key({ [user.key]: 2 });
      const persona = scenario.personas.find(
        persona => persona.id === selection.persona.id
      );
      return (
        <List.Item key={key}>
          <List.Content>
            <strong>{user.content}</strong> as <strong>{persona.name}</strong>.
          </List.Content>
        </List.Item>
      );
    };

    const content = (
      <Grid padded className="l__invite l__confirmation">
        <Grid.Row>
          <Grid.Column>Your role:</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Card.Content>
                <List divided selection>
                  {selected.slice(0, 1).map(selection => (
                    <ListItem
                      key={Identity.key(selection)}
                      selection={selection}
                    />
                  ))}
                </List>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            Your selected {pluralParticipant} and the {pluralRole} you assigned:
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Card.Content>
                <List divided selection>
                  {participants.map(selection => (
                    <ListItem
                      key={Identity.key(selection)}
                      selection={selection}
                    />
                  ))}
                </List>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            Are you ready to invite {thisOrThese} {pluralParticipant}, in{' '}
            {thisOrThese} {pluralRole}, to join you in {scenario.title}?
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );

    const primaryOnClick = async () => {
      this.setState({
        isSending: true
      });

      const sent = [];

      for (let selection of this.state.selected) {
        if (selection.user.id === this.props.user.id) {
          await this.props.joinChat(this.props.chat.id, selection.persona);
        } else {
          await this.props.createChatInvite(this.props.chat.id, selection);
        }

        sent.push(selection.user.id);

        this.setState({
          sent: [...this.state.sent, selection.user.id]
        });
      }

      // Sync invites
      await this.props.getInvites();

      this.setState({
        confirmation: {
          isOpen: false
        }
      });
    };

    const secondaryOnClick = () => {
      this.setState({
        confirmation: {
          isOpen: false
        }
      });
    };

    this.setState({
      confirmation: {
        key: Identity.key(sent),
        isOpen: true,
        props: {
          header,
          content,
          buttons: {
            primary: {
              content: 'Yes',
              disabled: isSending,
              onClick: primaryOnClick
            },
            secondary: {
              content: 'No',
              disabled: isSending,
              onClick: secondaryOnClick
            }
          }
        }
      }
    });
  }

  // TODO: consolidate all of the participant/user search
  // mechanisms into a single shareable function
  onSearchChange(event, { value: search }) {
    if (search === '') {
      this.setState({
        results: [],
        // This space is intentional.
        search: ' '
      });
      return;
    }

    const { selected } = this.state;
    const selectionIds = selected.map(selection => selection.user.id);

    const escapedre = new RegExp(escapeRegExp(search), 'gim');
    const results = this.props.users.filter(user => {
      if (selectionIds.includes(user.id)) {
        return false;
      }

      if (escapedre.test(user.searchable)) {
        return true;
      }

      return false;
    });

    this.setState({
      results,
      search
    });
  }

  render() {
    const { onResultSelect, onSearchChange, onSendInviteClick } = this;
    const { chat, scenario, users } = this.props;
    const { confirmation, isReady, search, selected } = this.state;

    if (!isReady || !scenario || !chat) {
      return null;
    }

    const selectedCount = selected.length;
    const availableCount = users.length - 1; // minus yourself.
    const rolesAssigned = selected.filter(selection => selection.persona.id)
      .length;
    const rolesCount = scenario.personas.length;
    const otherRoleCount = rolesCount - 1; // minus yourself.
    const remainingCount = rolesCount - rolesAssigned;

    const pluralAvailable = pluralize('participant', availableCount);
    const pluralRole = pluralize('role', otherRoleCount);
    const pluralSelected = pluralize('participant', selectedCount);
    const pluralRemaining = pluralize('role', remainingCount);

    let results = [];

    if (search && this.state.results.length) {
      results.push(...this.state.results);
    }

    if (!search) {
      results.push(...this.props.users);
    }

    // If the host is the only person in the list,
    // disable invite sending.
    const disabled = selectedCount !== rolesAssigned || selectedCount <= 1;

    let remainingMessage = `${remainingCount} ${pluralRemaining} unassigned.`;
    let remainingTextProps = {};

    if (remainingCount === 0) {
      remainingMessage = `all roles assigned.`;
    }

    if (selectedCount > rolesCount) {
      remainingMessage = `remove ${selectedCount - rolesCount} to continue.`;
      remainingTextProps = {
        ...remainingTextProps,
        error: true
      };
    }

    let tally = (
      <Text {...remainingTextProps}>
        {selected.length} {pluralSelected} , {remainingMessage}
      </Text>
    );

    let headerContent = (
      <Fragment>
        There are <strong>{availableCount}</strong> other {pluralAvailable}{' '}
        available to fill the other <strong>{otherRoleCount}</strong>{' '}
        {pluralRole}.
      </Fragment>
    );

    const miniSendInvitesButton = (
      <Button
        compact
        className="primary"
        size="mini"
        disabled={disabled}
        onClick={onSendInviteClick}
      >
        Send invites
      </Button>
    );

    const sendInvitesButton = (
      <Button
        className="primary"
        floated="right"
        disabled={disabled}
        onClick={onSendInviteClick}
      >
        Set roles & send invites
      </Button>
    );

    const onInstructionDismiss = () => {
      const instruction = {
        isOpen: false
      };
      this.setState({
        instruction
      });
      Storage.merge(this.sessionKey, { instruction });
    };

    return (
      <Fragment>
        <Grid padded className="l__invite not-modal">
          <Grid.Row>
            {this.state.instruction.isOpen ? (
              <Grid.Column>
                <Message
                  data-testid="lobby-user-select-instructions"
                  onDismiss={onInstructionDismiss}
                >
                  <p>
                    This scenario has <strong>{rolesCount}</strong> roles. As
                    host, you will participate in the scenario by filling one of
                    the available roles.
                  </p>
                  <ol>
                    <li>Choose your role first.</li>
                    <li>
                      Search and select participants that you want to invite,
                      and assign their roles as you go.
                    </li>
                    <li>
                      Once all of the available roles are filled, click the{' '}
                      {miniSendInvitesButton} button to invite your selected
                      participants.
                    </li>
                  </ol>
                  <p>{headerContent}</p>
                </Message>
              </Grid.Column>
            ) : (
              <Grid.Column>
                <p>
                  This scenario has <strong>{rolesCount}</strong> roles. As
                  host, you will participate in the scenario by filling one of
                  the available roles.
                </p>
                <p>{headerContent}</p>
              </Grid.Column>
            )}
          </Grid.Row>
          <Grid.Row>
            <Search
              fluid
              key="x"
              className="grid__menu-search l__search-input primary"
              onFocus={onSearchChange}
              onMouseDown={onSearchChange}
              onResultSelect={onResultSelect}
              onSearchChange={onSearchChange}
              resultRenderer={resultRenderer}
              results={results}
              value={search || ' '}
            />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Content>{this.renderInviteeList()}</Card.Content>
                <Card.Content extra>
                  {tally}
                  {sendInvitesButton}
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {confirmation.isOpen ? (
          <LobbyConfirmationDialog {...confirmation.props} />
        ) : null}
      </Fragment>
    );
  }
}

LobbyUserSelect.propTypes = {
  chat: PropTypes.object,
  cohort: PropTypes.object,
  createChatInvite: PropTypes.func,
  getLinkedChatUsersByChatId: PropTypes.func,
  getInvites: PropTypes.func,
  joinChat: PropTypes.func,
  personasInUseById: PropTypes.object,
  socket: PropTypes.object,
  scenario: PropTypes.object,
  user: PropTypes.object,
  users: PropTypes.array,
  usersById: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { user } = state;

  const chat = state.chat && state.chat.id ? state.chat : ownProps.chat || null;

  const cohort =
    state.cohort && state.cohort.id ? state.cohort : ownProps.cohort || null;

  const scenario =
    state.scenario && state.scenario.id
      ? state.scenario
      : ownProps.scenario || null;

  const usersSource = cohort ? cohort.users : state.users;
  const users = usersSource.reduce((accum, user) => {
    const key = Identity.key(user);
    const { id, email, personalname, username, roles = [] } = user;
    const { title } = Username.getDisplayables(user);
    const content = <Username user={user} />;
    const searchable = `
      ${personalname}
      ${username}
      ${username.replace(/-|_/g, ' ')}
      ${email}
      ${roles.join(' ')}
    `.replace(/(\r?\n)|\s{1,}/gm, ' ');
    const entry = {
      id,
      key,
      content,
      searchable,
      title
    };
    return accum.concat([entry]);
  }, []);

  const usersById = users.reduce(
    (accum, user) => ({
      ...accum,
      [user.id]: user
    }),
    {}
  );

  const personasInUseById = chat
    ? chat.users.reduce(
        (accum, user) => ({
          ...accum,
          [user.persona_id]: user
        }),
        {}
      )
    : {};

  return { chat, cohort, personasInUseById, scenario, user, users, usersById };
};

const mapDispatchToProps = dispatch => ({
  createChatInvite: (id, params) => dispatch(createChatInvite(id, params)),
  getLinkedChatUsersByChatId: id => dispatch(getLinkedChatUsersByChatId(id)),
  getInvites: () => dispatch(getInvites()),
  joinChat: (id, persona) => dispatch(joinChat(id, persona))
});

export default withSocket(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(LobbyUserSelect)
  )
);
