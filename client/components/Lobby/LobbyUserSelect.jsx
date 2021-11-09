import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import escapeRegExp from 'lodash.escaperegexp';
import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  createChatInvite,
  // This is used for cohort scenario runs
  getChatUsersByChatId,
  // This is used for standalone scenario runs
  getLinkedChatUsersByChatId,
  joinChat
} from '@actions/chat';
import { getInvites, setInvite } from '@actions/invite';
import { makeCohortScenarioChatJoinPath } from '@components/Cohorts/CohortRoomSelector';
import LobbyConfirmationDialog from '@components/Lobby/LobbyConfirmationDialog';
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
import Identity from '@utils/Identity';
import Invites from '@utils/Invites';
import Layout from '@utils/Layout';
import Moment from '@utils/Moment';
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
    const hasCohort = !!(this.props.cohort && this.props.cohort.id);

    this.storageKey = `lobby/`;

    if (hasChat) {
      this.storageKey += `${this.props.chat.id}/`;
    }

    if (hasCohort) {
      this.storageKey += `${this.props.cohort.id}/`;
    }

    const user = this.props.user;
    const { instruction, selected } = Storage.get(this.storageKey, {
      instruction: {
        isOpen: true
      },
      selected: [{ user, persona: { id: null } }]
    });

    this.state = {
      isReady: false,
      confirmation: {
        // This is used AFTER the invites are sent, to inform the
        // user that invites were sent. isAffirmed will be set
        // to "false" when the user clicks "Yes" to send invites.
        // isOpen will remain "true". This will cause the affirmation
        // display to be shown, which prompts the user to acknowledge
        // that the invites have been sent. Once acknowledged,
        // isAffirmed is set to "true" and isOpen is set to "false".
        isAffirmed: true,
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
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSelectedPersonaChange = this.onSelectedPersonaChange.bind(this);
    this.onSendInviteClick = this.onSendInviteClick.bind(this);
    this.renderInviteeList = this.renderInviteeList.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async getChatUsers() {
    if (!this.props.chat) {
      return;
    }
    if (this.props.cohort) {
      await this.props.getChatUsersByChatId(this.props.chat.id);
    } else {
      await this.props.getLinkedChatUsersByChatId(this.props.chat.id);
    }
  }

  async componentDidMount() {
    await this.getChatUsers();

    const selected = [];

    if (this.props.chat) {
      for (let selection of this.state.selected) {
        // If this user is not available at all, don't
        // include them in the selected users lists
        if (!this.props.usersById[selection.user.id]) {
          continue;
        }

        const chatUser = this.props.chat.usersById[selection.user.id];
        if (chatUser) {
          selected.push({
            ...selection,
            persona: {
              id: chatUser.persona_id
            }
          });
        } else {
          selected.push({
            ...selection
          });
        }
      }
    }

    // console.log("selected:", selected);
    Storage.merge(this.storageKey, { selected });

    this.setState({
      isReady: true,
      selected
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { selection } = nextProps;

    if (
      selection &&
      !nextState.selected.find(s => s.user.id === selection.id)
    ) {
      this.setState({
        selected: [
          ...nextState.selected,
          {
            persona: {
              id: null
            },
            user: selection
          }
        ]
      });
    }

    return true;
  }

  onRemoveInviteeClick(event, { id }) {
    const selected = this.state.selected.slice();
    const index = selected.findIndex(selection => selection.user.id === id);
    selected.splice(index, 1);
    this.setState({
      selected
    });
    Storage.merge(this.storageKey, { selected });

    const invite = this.props.invites
      .slice()
      .reverse()
      .find(invite => invite.sender_id === id);

    if (invite) {
      this.props.setInvite(invite.id, {
        status: Invites.INVITE_STATUS_CANCEL
      });
    }
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
    Storage.merge(this.storageKey, { selected });

    if (this.props.onSelect) {
      if (selected[index].user.id === this.props.user.id) {
        this.props.onSelect(selected[index]);
      }
    }
  }

  renderInviteeList(searchWidget) {
    const { onRemoveInviteeClick, onSelectedPersonaChange } = this;
    const {
      chat,
      /* personasInUseById, */ scenario,
      user,
      usersById
    } = this.props;
    const host = chat.usersById[chat.host_id];
    const selected = this.state.selected.reduce((accum, selection) => {
      const userInChat = chat.usersById[selection.user.id];

      if (userInChat && userInChat !== host) {
        selection.assigned = scenario.personas.find(
          persona => persona.id === userInChat.persona_id
        );
      }

      accum.push(selection);
      return accum;
    }, []);
    const defaultOptions = scenario.personas.reduce((accum, persona, index) => {
      // Don't include personas that are already accepted by users that
      // are in the chat and waiting.
      // if (!personasInUseById[persona.id]) {
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
      // }
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

    let hasAutoFocused = false;

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
          const wrappedUsernameContent = (
            <span tabIndex={0}>{selectedUser.content}</span>
          );
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
          let searchInput = {};
          let autoFocus = false;

          // We only want to autofocus the FIRST unassigned participant
          if (!hasAutoFocused && !selection.assigned && !selection.persona.id) {
            hasAutoFocused = true;
            autoFocus = true;
            searchInput = {
              autoFocus
            };
          }
          const dropdown = (
            <Dropdown
              search
              selection
              fluid={Layout.isForMobile()}
              key={`${key}-dropdown`}
              name={index}
              id={selection.user.id}
              onChange={onSelectedPersonaChange}
              options={options}
              placeholder={placeholder}
              searchInput={searchInput}
              tabIndex={0}
              value={selection.persona.id}
            />
          );

          const assignedRole = selection.assigned ? (
            <div style={{ padding: '0.7em 0.25em 0 0' }}>
              {selection.assigned.name}
            </div>
          ) : null;

          const rightFloatedContents = assignedRole || dropdown;
          const listContentClassName = assignedRole
            ? 'l__contentnoremoval'
            : '';

          const dropdownContent = Layout.isNotForMobile() ? (
            <List.Content key="1" floated="right">
              {rightFloatedContents}
            </List.Content>
          ) : (
            <List.Content key="1">{rightFloatedContents}</List.Content>
          );

          const listContentStyle = Layout.isForMobile()
            ? {
              marginBottom: '0.5em'
            }
            : {};
          const nameAndButtonContent = (
            <List.Content
              key="2"
              className={listContentClassName}
              style={listContentStyle}
            >
              {isSelectedNotHost && !assignedRole ? (
                <Button
                  className="icon-primary"
                  icon="x"
                  size="tiny"
                  aria-label={`Remove ${selectedUser.title}`}
                  id={selectedUser.id}
                  onClick={onRemoveInviteeClick}
                  tabIndex={0}
                />
              ) : null}
              {selectedUserDisplay}
            </List.Content>
          );

          const contents = Layout.isForMobile()
            ? [nameAndButtonContent, dropdownContent]
            : [dropdownContent, nameAndButtonContent];

          return <List.Item key={key}>{contents}</List.Item>;
        })}
        <List.Item>{searchWidget}</List.Item>
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
        // See explanation in constructor's state declaration
        isAffirmed: true,
        isOpen: false
      };

      const primaryOnClick = () => {
        const selected = [...this.state.selected, selection];

        this.setState({
          confirmation,
          selected
        });

        Storage.merge(this.storageKey, { selected });
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

      Storage.merge(this.storageKey, { selected });
    }
  }

  onSendInviteClick() {
    const { scenario, usersById } = this.props;
    const { isSending, selected, sent } = this.state;
    const header = 'Set these roles and send invites?';
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
            {user.content} as <strong>{persona.name}</strong>.
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
      const { chat, cohort, scenario, user } = this.props;
      let invitationsSent = 0;
      let rolesSet = 0;

      for (let selection of this.state.selected) {
        rolesSet++;
        if (selection.user.id === user.id) {
          await this.props.joinChat(chat.id, selection.persona);
        } else {
          await this.props.createChatInvite(chat.id, selection);
          invitationsSent++;
        }

        sent.push(selection.user.id);

        this.setState({
          sent: [...this.state.sent, selection.user.id]
        });
      }

      // Sync invites & chat users
      await this.props.getInvites();
      await this.getChatUsers();

      const invitationsSentPlural = pluralize('invitation', invitationsSent);
      const rolesSetPlural = pluralize('role', rolesSet);

      this.setState({
        // See explanation in constructor's state declaration
        confirmation: {
          isAffirmed: false,
          isOpen: true,
          props: {
            header: 'Success',
            content: (
              <Grid padded className="l__invite l__confirmation">
                <Grid.Row>
                  <Grid.Column>
                    You sent {invitationsSent} {invitationsSentPlural}, and set{' '}
                    {rolesSet} {rolesSetPlural} (including your own).
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            ),
            buttons: {
              primary: {
                content: 'Join room',
                disabled: false,
                onClick: () => {
                  location.href = makeCohortScenarioChatJoinPath(
                    cohort,
                    scenario,
                    chat
                  );
                }
              },
              secondary: {
                content: 'Back to invites',
                disabled: false,
                onClick: () => {
                  this.setState({
                    confirmation: {
                      isAffirmed: true,
                      isOpen: false
                    }
                  });
                }
              }
            }
          }
        }
      });

      this.props.onSetRolesAndInvites({ chat });
    };

    const secondaryOnClick = () => {
      this.setState({
        // See explanation in constructor's state declaration
        confirmation: {
          isAffirmed: true,
          isOpen: false
        }
      });
    };

    this.setState({
      confirmation: {
        key: Identity.key(sent),
        // See explanation in constructor's state declaration
        isAffirmed: true,
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

    // Host searched and selected a participant, but has not assigned
    // a role to them yet.
    const hasAllRolesSelectedAndUnassigned = selectedCount === rolesCount;

    // If the host is the only person in the list,
    // disable invite sending.
    const disabled = !hasAllRolesSelectedAndUnassigned || selectedCount <= 1;

    let remainingMessage = `${remainingCount} ${pluralRemaining} unassigned.`;
    let remainingTextProps = Layout.isForMobile()
      ? {
        style: {
          display: 'block',
          marginBottom: '0.5em'
        }
      }
      : {};

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

    const tally = (
      <Text {...remainingTextProps}>
        {selected.length} {pluralSelected}, {remainingMessage}
      </Text>
    );

    const headerAdditional =
      selectedCount === 1 ? (
        <Fragment>
          You must select at least <strong>1</strong> other participant and
          assign them a role to continue.
        </Fragment>
      ) : null;

    const isAre = pluralize('is', availableCount);
    const headerContent = (
      <Fragment>
        There {isAre} <strong>{availableCount}</strong> other {pluralAvailable}{' '}
        available to fill the other <strong>{otherRoleCount}</strong>{' '}
        {pluralRole}. {headerAdditional}
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

    const sendInvitesButtonConditionalProps = Layout.isNotForMobile()
      ? {
        floated: 'right'
      }
      : {
        fluid: true
      };

    const sendInvitesButtonProps = {
      ...sendInvitesButtonConditionalProps,
      disabled,
      color: 'green',
      onClick: onSendInviteClick
    };

    const sendInvitesButton = (
      <Button {...sendInvitesButtonProps}>Set roles & send invites</Button>
    );

    const onInstructionDismiss = () => {
      const instruction = {
        isOpen: false
      };
      this.setState({
        instruction
      });
      Storage.merge(this.storageKey, { instruction });
    };

    const autoFocus = !hasAllRolesSelectedAndUnassigned && !this.isScenarioRun;

    const searchProps = {
      autoFocus,
      fluid: true,
      className: 'grid__menu-search l__search-input primary',
      noResultsMessage: 'No users found',
      onFocus: onSearchChange,
      onMouseDown: onSearchChange,
      onResultSelect: onResultSelect,
      onSearchChange: onSearchChange,
      placeholder: 'Search for participants',
      resultRenderer: resultRenderer,
      results: results,
      value: search || ' '
    };

    const searchWidget = <Search {...searchProps} />;
    const lastRenderTime = Moment(Date.now()).calendar();

    return chat.is_open ? null : (
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
                    <li>Choose your role.</li>
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
            <p>
              <strong>
                Search and select participants that you want to invite (list
                updated {lastRenderTime}):
              </strong>
            </p>
            {/*searchWidget*/}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  {this.renderInviteeList(searchWidget)}
                </Card.Content>
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

        <div data-testid="lobby-user-select" />
      </Fragment>
    );
  }
}

LobbyUserSelect.propTypes = {
  chat: PropTypes.object,
  cohort: PropTypes.object,
  createChatInvite: PropTypes.func,
  getChatUsersByChatId: PropTypes.func,
  getLinkedChatUsersByChatId: PropTypes.func,
  invites: PropTypes.array,
  getInvites: PropTypes.func,
  setInvite: PropTypes.func,
  joinChat: PropTypes.func,
  onSelect: PropTypes.func,
  onSetRolesAndInvites: PropTypes.func,
  personasInUseById: PropTypes.object,
  selection: PropTypes.object,
  scenario: PropTypes.object,
  user: PropTypes.object,
  users: PropTypes.array,
  usersById: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { invites, user } = state;

  const chat = state.chat && state.chat.id ? state.chat : ownProps.chat || null;

  const cohort =
    state.cohort && state.cohort.id ? state.cohort : ownProps.cohort || null;

  const scenario =
    state.scenario && state.scenario.id
      ? state.scenario
      : ownProps.scenario || null;

  const usersSource = cohort ? cohort.users : state.users;
  const users = usersSource.reduce((accum, user) => {
    if (user.is_agent) {
      return accum;
    }

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

  // console.log("state.chat || ownProps.chat:", chat);
  return {
    chat,
    cohort,
    invites,
    personasInUseById,
    scenario,
    user,
    users,
    usersById
  };
};

const mapDispatchToProps = dispatch => ({
  createChatInvite: (id, params) => dispatch(createChatInvite(id, params)),
  getChatUsersByChatId: id => dispatch(getChatUsersByChatId(id)),
  getLinkedChatUsersByChatId: id => dispatch(getLinkedChatUsersByChatId(id)),
  getInvites: () => dispatch(getInvites()),
  setInvite: (id, params) => dispatch(setInvite(id, params)),
  joinChat: (id, persona) => dispatch(joinChat(id, persona))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LobbyUserSelect)
);
