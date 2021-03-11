import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  getChat,
  getChatByIdentifiers,
  // This is used for cohort scenario runs
  getChatUsersByChatId,
  // This is used for standalone scenario runs
  getLinkedChatUsersByChatId
} from '@actions/chat';
import { getCohort } from '@actions/cohort';
import { getScenario } from '@actions/scenario';
import { getUsers } from '@actions/users';
import Loading from '@components/Loading';
import LobbyUserOverview from '@components/Lobby/LobbyUserOverview';
import LobbyUserSelect from '@components/Lobby/LobbyUserSelect';
import LobbyUserWaiting from '@components/Lobby/LobbyUserWaiting';
import { Button, Card, Grid } from '@components/UI';
import withSocket, {
  CREATE_USER_CHANNEL,
  RUN_CHAT_LINK
} from '@hoc/withSocket';
import Storage from '@utils/Storage';
import './Lobby.css';

const isLoaded = record => {
  return record && record.created_at !== null && record.id !== null;
};

const isNotLoaded = record => {
  return record && record.created_at === null && record.id !== null;
};

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      selection: null
    };

    this.isComponentMounted = false;
    this.getChatUsers = this.getChatUsers.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.onRunChatLink = this.onRunChatLink.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  get isCohortScenarioRun() {
    return window.location.pathname.includes('/cohort/');
  }

  async componentDidMount() {
    const { user } = this.props;

    if (isNotLoaded(this.props.cohort)) {
      await this.props.getCohort(this.props.cohort.id);
    }

    if (isNotLoaded(this.props.scenario)) {
      await this.props.getScenario(this.props.scenario.id);
    }

    /* istanbul ignore if */
    if (this.props.__UNSAFE_OVERRIDE_ID__) {
      await this.props.getChat(this.props.__UNSAFE_OVERRIDE_ID__);
    } else {
      if (isNotLoaded(this.props.chat)) {
        await this.props.getChat(this.props.chat.id);
      }
    }

    if (isNotLoaded(this.props.chat)) {
      const scenario = isLoaded(this.props.scenario)
        ? this.props.scenario
        : null;

      const cohort = isLoaded(this.props.cohort) ? this.props.cohort : null;

      // If we've reached this point, it's because there
      // is no chat loaded that matches chat.id yet.
      // As a fallback, we're going to check if there is
      // a chat owned by this user, created for this
      // scenario, in this cohort.
      /* istanbul ignore else */
      if (scenario) {
        await this.props.getChatByIdentifiers(scenario, cohort);
      }
    }

    /* istanbul ignore else */
    if (isLoaded(this.props.chat)) {
      this.isComponentMounted = true;

      await this.getUsers();
      await this.getChatUsers();

      this.props.socket.emit(CREATE_USER_CHANNEL, { user });
      this.props.socket.on(RUN_CHAT_LINK, this.onRunChatLink);

      this.setState({
        isReady: true
      });
    }
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
    this.props.socket.off(RUN_CHAT_LINK, this.onRunChatLink);
  }

  async getChatUsers() {
    if (!this.isComponentMounted) {
      return;
    }
    if (this.props.cohort) {
      await this.props.getChatUsersByChatId(this.props.chat.id);
    } else {
      await this.props.getLinkedChatUsersByChatId(this.props.chat.id);
    }
  }

  async getUsers() {
    if (!this.isComponentMounted) {
      return;
    }
    await this.props.getUsers('available');
  }

  async onRunChatLink(/* data */) {
    await this.getUsers();
    await this.getChatUsers();
  }

  // TODO: Determine if this is necessary.
  // refresh() {
  //   const hasDocumentVisibility = 'visibilityState' in document;

  //   this.interval = setInterval(async () => {
  //     if (!this.isComponentMounted) {
  //       return;
  //     }
  //     /* istanbul ignore else */
  //     if (hasDocumentVisibility &&
  //         document.visibilityState === 'visible') {
  //       await this.getUsers();
  //       await this.getChatUsers();
  //     } else {
  //       await this.getUsers();
  //       await this.getChatUsers();
  //     }
  //   }, 10000);
  // }

  render() {
    const { chat, cohort, scenario, user } = this.props;
    const { isReady, selection } = this.state;

    if (!isReady) {
      return <Loading />;
    }

    const title = cohort
      ? `${scenario.title} in ${cohort.name} Lobby`
      : `${scenario.title} Lobby`;

    const lobbyUserSelectOrWaitingProps = {
      chat,
      cohort,
      scenario,
      selection
    };

    const lobbyUserOverviewProps = {
      chat,
      cohort,
      scenario,
      selection,
      onSelect: selection => {
        console.log(selection);
        this.setState({
          selection
        });
      }
    };

    const chatUser = this.props.chat.usersById[user.id];
    const disabled =
      (!cohort && !chatUser) || (chatUser && !chatUser.persona_id);
    const positive = !disabled;

    const runStorageKey = cohort
      ? `cohort/${cohort.id}/run/${scenario.id}`
      : `run/${scenario.id}`;

    const persisted = Storage.get(runStorageKey);

    const onClick = () => {
      const nextPath =
        persisted && persisted.activeRunSlideIndex
          ? window.location.pathname
          : null;

      if (this.props.onContinueClick) {
        this.props.onContinueClick(nextPath);
      }
    };

    const content =
      persisted && persisted.activeRunSlideIndex
        ? `Resume scenario on Slide #${persisted.activeRunSlideIndex}`
        : 'Continue to scenario';

    const continueButtonProps = {
      content,
      disabled,
      onClick,
      positive
    };

    return (
      <Fragment>
        {this.props.asCard ? (
          <Grid columns={1}>
            <Grid.Column className="scenario__slide-column">
              <Card centered key="lobby" className="scenario__slide-card">
                <Card.Content className="scenario__slide-card-header">
                  <Card.Header className="l__waitingroom-header" tabIndex="0">
                    {title}
                  </Card.Header>
                </Card.Content>
                <Card.Content className="scenario__slide-card-content-lobby">
                  <LobbyUserSelect
                    {...lobbyUserSelectOrWaitingProps}
                    onSelect={this.props.onRoleSelect}
                  />
                  <LobbyUserWaiting {...lobbyUserSelectOrWaitingProps} />
                  {this.isCohortScenarioRun ? (
                    <LobbyUserOverview {...lobbyUserOverviewProps} />
                  ) : null}
                </Card.Content>
                <Card.Content extra>
                  <Button.Group fluid>
                    <Button {...continueButtonProps} />
                  </Button.Group>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>
        ) : (
          <Fragment>
            <LobbyUserSelect {...lobbyUserSelectOrWaitingProps} />
            <LobbyUserWaiting {...lobbyUserSelectOrWaitingProps} />
            {this.isCohortScenarioRun ? (
              <LobbyUserOverview {...lobbyUserOverviewProps} />
            ) : null}
          </Fragment>
        )}
        <div data-testid="lobby-main" />
      </Fragment>
    );
  }
}

Lobby.propTypes = {
  __UNSAFE_OVERRIDE_ID__: PropTypes.number,
  asCard: PropTypes.bool,
  cohort: PropTypes.object,
  chat: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  getChat: PropTypes.func,
  getChatByIdentifiers: PropTypes.func,
  getChatUsersByChatId: PropTypes.func,
  getCohort: PropTypes.func,
  getLinkedChatUsersByChatId: PropTypes.func,
  getScenario: PropTypes.func,
  getUsers: PropTypes.func,
  onContinueClick: PropTypes.func,
  onRoleSelect: PropTypes.func,
  socket: PropTypes.object,
  scenario: PropTypes.object,
  user: PropTypes.object,
  users: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  const { user, users } = state;

  const chat = state.chat && state.chat.id ? state.chat : ownProps.chat || null;

  const cohort =
    state.cohort && state.cohort.id ? state.cohort : ownProps.cohort || null;

  const scenario =
    state.scenario && state.scenario.id
      ? state.scenario
      : ownProps.scenario || null;

  return { chat, cohort, scenario, user, users };
};

const mapDispatchToProps = dispatch => ({
  getChat: id => dispatch(getChat(id)),
  getChatByIdentifiers: (...args) => dispatch(getChatByIdentifiers(...args)),
  getChatUsersByChatId: id => dispatch(getChatUsersByChatId(id)),
  getLinkedChatUsersByChatId: id => dispatch(getLinkedChatUsersByChatId(id)),
  getCohort: id => dispatch(getCohort(id)),
  getScenario: id => dispatch(getScenario(id)),
  getUsers: limit => dispatch(getUsers(limit))
});

export default withSocket(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Lobby)
  )
);
