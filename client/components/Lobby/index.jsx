import React, { Component, Fragment, Suspense } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getChat, getChatById } from '@actions/chat';
import { getCohort } from '@actions/cohort';
import { getScenario } from '@actions/scenario';
import { getUsers } from '@actions/users';
import Loading from '@components/Loading';
import LobbyUserSelect from '@components/Lobby/LobbyUserSelect';
import LobbyUserWaiting from '@components/Lobby/LobbyUserWaiting';
import { notify } from '@components/Notification';
import { Button, Card } from '@components/UI';
import withSocket from '@hoc/withSocket';
import './Lobby.css';

const isParticipantOnly = user => {
  const { roles = [] } = user;
  return roles.length === 1 && roles[0] === 'participant';
};

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false
    };

    this.fetchUsers = this.fetchUsers.bind(this);
  }

  async fetchUsers() {
    const limit = isParticipantOnly(this.props.user) ? 'available' : 'all';

    await this.props.getUsers(limit);

    /* istanbul ignore else */
    if (!this.state.isReady) {
      this.setState({
        isReady: true
      });
    }
  }

  async componentDidMount() {
    if (this.props.cohort && !this.props.cohort.created_at) {
      await this.props.getCohort(this.props.cohort.id);
    }

    if (this.props.scenario && !this.props.scenario.created_at) {
      await this.props.getScenario(this.props.scenario.id);
    }

    /* istanbul ignore if */
    if (this.props.__UNSAFE_OVERRIDE_ID__) {
      await this.props.getChatById(this.props.__UNSAFE_OVERRIDE_ID__);
    } else {
      if (!this.props.chat || !this.props.chat.id) {
        await this.props.getChat(
          this.props.scenario.id,
          this.props?.cohort?.id
        );
      } else {
        await this.props.getChatById(this.props.chat.id);
      }
    }

    await this.fetchUsers();
  }

  refresh() {
    this.interval = setInterval(async () => {
      /* istanbul ignore else */
      if (!this.state.search.trim() && document.visibilityState === 'visible') {
        await this.fetchUsers();
      }
    }, 30000);
  }

  render() {
    const { chat, cohort, scenario } = this.props;
    const { isReady } = this.state;
    let title = '';

    if (isReady) {
      title = cohort
        ? `${scenario.title} in ${cohort.name} Waiting Room`
        : `${scenario.title} Waiting Room`;
    }

    const lobbyUserViewsProps = {
      chat,
      cohort,
      scenario
    };

    return this.props.asCard ? (
      <Card centered key="lobby" className="scenario__slide-card">
        {isReady ? (
          <Fragment>
            <Card.Content className="scenario__slide-card-header">
              <Card.Header className="l__waitingroom-header" tabIndex="0">
                {title}
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <Suspense fallback="Waiting for users to load">
                <LobbyUserSelect {...lobbyUserViewsProps} />
                <LobbyUserWaiting {...lobbyUserViewsProps} />
              </Suspense>
            </Card.Content>
            <Card.Content extra>
              <Button.Group fluid>
                <Button positive>Continue to scenario</Button>
              </Button.Group>
            </Card.Content>
            <div data-testid="lobby-main" />
          </Fragment>
        ) : (
          <Loading />
        )}
      </Card>
    ) : (
      <Fragment>
        <LobbyUserSelect {...lobbyUserViewsProps} />
        <LobbyUserWaiting {...lobbyUserViewsProps} />
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
  getChatById: PropTypes.func,
  getCohort: PropTypes.func,
  getScenario: PropTypes.func,
  getUsers: PropTypes.func,
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
  getChat: (...args) => dispatch(getChat(...args)),
  getChatById: (...args) => dispatch(getChatById(...args)),
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
