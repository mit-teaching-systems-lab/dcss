import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  getLinkedChatUsersByChatId,
  joinChat,
  linkRunToChat
} from '@actions/chat';
import { linkRunToCohort, linkUserToCohort } from '@actions/cohort';
import { getUser } from '@actions/user';
import { getRun, getRunByIdentifiers, setRun } from '@actions/run';
import { getScenario } from '@actions/scenario';
import Scenario from '@components/Scenario';
import { Button, Header, Icon, Modal, Title } from '@components/UI';
import withSocket, {
  CHAT_USER_AWAITING_MATCH,
  CHAT_USER_CANCELED_MATCH_REQUEST,
  CHAT_USER_MATCHED
} from '@hoc/withSocket';
import Identity from '@utils/Identity';
import Payload from '@utils/Payload';
import QueryString from '@utils/QueryString';
import Storage from '@utils/Storage';

export const makeCohortScenarioChatJoinPath = (cohort, scenario, chat) => {
  const redirectCohortPart = `/cohort/${Identity.toHash(cohort.id)}`;
  const redirectRunPart = `/run/${Identity.toHash(scenario.id)}`;
  const redirectChatPart = `/chat/${Identity.toHash(chat.id)}`;
  const redirectSlidePart = `/slide/0`;

  return [
    redirectCohortPart,
    redirectRunPart,
    redirectChatPart,
    redirectSlidePart
  ].join('');
};

class JoinAs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false
    };
    this.onChatUserMatched = this.onChatUserMatched.bind(this);
  }

  componentWillUnmount() {
    this.props.socket.off(CHAT_USER_MATCHED, this.onChatUserMatched);
  }

  get isCohortScenarioRun() {
    return window.location.pathname.includes('/cohort/');
  }

  async componentDidMount() {
    if (this.props.persona.id && !this.props.persona.created_at) {
      // This way we can get the scenario AND the persona
      await this.props.getScenario(this.props.scenario.id);
    }

    const { cohort, persona, scenario, user } = this.props;

    this.props.socket.on(CHAT_USER_MATCHED, this.onChatUserMatched);
    this.props.socket.emit(CHAT_USER_AWAITING_MATCH, {
      cohort,
      persona,
      scenario,
      user
    });

    this.setState({
      isReady: true
    });
  }

  async onChatUserMatched(chat) {
    console.log('onChatUserMatched', chat);
    const redirect = makeCohortScenarioChatJoinPath(
      this.props.cohort,
      this.props.scenario,
      chat
    );

    console.log(redirect);

    const run = await this.props.getRun(
      this.props.scenario.id,
      this.props.cohort.id,
      chat.id
    );

    await this.props.linkRunToCohort(this.props.cohort.id, run.id);

    await this.props.linkRunToChat(chat.id, run.id);

    this.props.history.push(redirect);
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }
    const { persona } = this.props;

    const onClose = () => {
      const { cohort, persona, scenario, user } = this.props;
      this.props.socket.emit(CHAT_USER_CANCELED_MATCH_REQUEST, {
        cohort,
        persona,
        scenario,
        user
      });
      this.props.history.push(`/cohort/${Identity.toHash(cohort.id)}`);
    };

    const titleAndContent = `Please wait while we find an open ${persona.name} role for you`;

    return (
      <Modal.Accessible open={true}>
        <Modal
          closeIcon
          role="dialog"
          aria-modal="true"
          aria-labelledby="join-as-header"
          size="small"
          onClose={onClose}
          open={true}
        >
          <Header
            icon="discussions"
            id="join-as-header"
            tabIndex="0"
            content={titleAndContent}
          />
          <Modal.Content style={{ textAlign: 'center' }}>
            <Icon.Group size="huge">
              <Icon loading size="big" name="circle notch" />
              <Icon name="find" />
            </Icon.Group>
          </Modal.Content>
          <Modal.Actions style={{ borderTop: '0px' }}>
            <Button.Group fluid>
              <Button onClick={onClose}>
                Cancel my request to join this scenario
              </Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>
      </Modal.Accessible>
    );
  }
}

JoinAs.propTypes = {
  cohort: PropTypes.object,
  cohortId: PropTypes.node,
  getChatByIdentifiers: PropTypes.func,
  getLinkedChatUsersByChatId: PropTypes.func,
  getScenario: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
  joinChat: PropTypes.func,
  linkRunToChat: PropTypes.func,
  linkRunToCohort: PropTypes.func,
  linkUserToCohort: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortId: PropTypes.node,
      personaId: PropTypes.node,
      scenarioId: PropTypes.node
    }).isRequired,
    url: PropTypes.string
  }),
  persona: PropTypes.object,
  scenario: PropTypes.object,
  scenarioId: PropTypes.node,
  setRun: PropTypes.func,
  socket: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps.match || { params: {} };
  const { user } = state;
  const cohortId = Identity.fromHashOrId(ownProps.cohortId || params.cohortId);
  const personaId = Identity.fromHashOrId(
    ownProps.personaId || params.personaId
  );
  const scenarioId = Identity.fromHashOrId(
    ownProps.scenarioId || params.scenarioId
  );

  const scenario =
    state.scenario && state.scenario.id === scenarioId
      ? state.scenario
      : {
          id: scenarioId
        };

  const personaFromScenario =
    scenario && scenario.personas && scenario.personas.length
      ? state.scenario.personas.find(({ id }) => id === personaId)
      : null;

  let persona =
    state.persona && state.persona.id === personaId
      ? state.persona
      : personaFromScenario || {
          id: personaId
        };

  return {
    cohort: {
      id: cohortId
    },
    scenario: {
      id: scenarioId
    },
    persona,
    user
  };
};

const mapDispatchToProps = dispatch => ({
  getChat: id => dispatch(getChat(id)),
  getChatByIdentifiers: (...params) =>
    dispatch(getChatByIdentifiers(...params)),
  getLinkedChatUsersByChatId: id => dispatch(getLinkedChatUsersByChatId(id)),
  getRun: (...params) => dispatch(getRun(...params)),
  setRun: (...params) => dispatch(setRun(...params)),
  joinChat: (...params) => dispatch(joinChat(...params)),
  linkRunToChat: (...params) => dispatch(linkRunToChat(...params)),
  linkRunToCohort: (...params) => dispatch(linkRunToCohort(...params)),
  getScenario: params => dispatch(getScenario(params)),
  getUser: params => dispatch(getUser(params))
});

export default withSocket(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(JoinAs)
  )
);
