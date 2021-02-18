import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { joinChat, linkRunToChat } from '@actions/chat';
import { linkRunToCohort, linkUserToCohort } from '@actions/cohort';
import { getInvites } from '@actions/invite';
import { getUser } from '@actions/user';
import { getResponse, setResponses } from '@actions/response';
import { getRun, setRun } from '@actions/run';
import { getScenario } from '@actions/scenario';
import Scenario from '@components/Scenario';
import { Title } from '@components/UI';
import withRunEventCapturing, {
  PROMPT_RESPONSE_SUBMITTED,
  SCENARIO_ARRIVAL
} from '@hoc/withRunEventCapturing';
import withSocket from '@hoc/withSocket';
import QueryString from '@utils/QueryString';
import Storage from '@utils/Storage';
import Identity from '@utils/Identity';

class Run extends Component {
  constructor(props) {
    super(props);

    const {
      match: { url }
    } = this.props;

    this.state = {
      isReady: false,
      baseurl: url.replace(/\/slide\/\d.*$/g, '')
    };

    this.responses = new Map();
    this.onChange = this.onChange.bind(this);
    this.onResponseChange = this.onResponseChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.submitIfPendingResponses = this.submitIfPendingResponses.bind(this);
  }

  submitIfPendingResponses() {
    if (this.responses.size) {
      this.onSubmit();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.submitIfPendingResponses);
  }

  async componentDidMount() {
    const {
      location: { search },
      scenarioId
    } = this.props;

    if (!this.props.scenario) {
      await this.props.getScenario(scenarioId);
    }

    // When running via jest, it appears that mapStateToProps
    // doesn't get called as part of the previous async
    // operation's dispatch.
    if (!this.props.scenario) {
      return;
    }

    await this.props.getInvites();

    const run = await this.props.getRun(
      this.props.scenario.id,
      this.props.cohortId,
      this.props.chatId
    );

    if (run) {
      const { user } = this.props;

      if (this.props.cohortId) {
        const cohort = await this.props.linkRunToCohort(
          this.props.cohortId,
          run.id
        );

        if (cohort) {
          if (!cohort.users.find(({ id }) => id === user.id)) {
            // For now we'll default all unknown
            // users as "participant".
            await this.props.linkUserToCohort(cohort.id, 'participant');
          }
        }
      }

      if (this.props.chatId) {
        await this.props.linkRunToChat(this.props.chatId, run.id);
        if (this.props.chat) {
          const userInChat = this.props.chat.usersById[user.id];
          const isUserInChat = !!userInChat;
          const isUserRoleAssigned =
            isUserInChat && userInChat.persona_id != null;

          if (!isUserRoleAssigned && this.props.invite) {
            const persona = this.props.scenario.personas.find(
              persona => persona.id === this.props.invite.persona_id
            );
            await this.props.joinChat(this.props.chat.id, persona);
          }
        }
      }

      const referrer_params = Storage.get('app/referrer_params');

      if (search || referrer_params) {
        await this.props.setRun(run.id, {
          referrer_params: QueryString.parse(search || referrer_params)
        });
        Storage.delete('app/referrer_params');
      }

      this.setState({ isReady: true });

      this.props.saveRunEvent(SCENARIO_ARRIVAL, {
        scenario: this.props.scenario
      });
    }

    window.addEventListener('beforeunload', this.submitIfPendingResponses);
  }

  onResponseChange(event, data) {
    const {
      created_at,
      content = '',
      ended_at = new Date().toISOString(),
      isSkip = false,
      name,
      type,
      value
    } = data;
    const record = {
      created_at,
      content,
      ended_at,
      isSkip,
      type,
      value
    };
    const isRecordable =
      !this.responses.has(name) || (this.responses.has(name) && !isSkip);

    if (isRecordable) {
      this.responses.set(name, record);
    }
  }

  async onChange(event, data) {
    await this.props.setRun(this.props.run.id, data);
  }

  async onSubmit() {
    if (this.props.run) {
      const responses = [...this.responses];
      await this.props.setResponses(this.props.run.id, responses);

      responses.forEach(([response_id, submission]) => {
        this.props.saveRunEvent(PROMPT_RESPONSE_SUBMITTED, {
          response_id,
          submission
        });
      });

      this.responses.clear();
    }
  }

  render() {
    const { onChange, onResponseChange, onSubmit } = this;
    const { activeRunSlideIndex, cohortId, scenario } = this.props;
    const { isReady, baseurl } = this.state;

    if (!isReady || !this.props.run) {
      return null;
    }

    // Prevent participants from attempting to jump into a run without
    // first acknowledging the consent form!
    if (
      !this.props.run.consent_acknowledged_by_user &&
      activeRunSlideIndex !== 0
    ) {
      location.href = `${baseurl}/slide/0`;
    }

    const pageTitle = `${this.props.scenario.title}, Slide #${activeRunSlideIndex}`;

    return (
      <Fragment>
        <Title content={pageTitle} />
        {this.props.user.is_super ? (
          <div style={{ zIndex: 9001, position: 'absolute' }}>
            Run: {this.props.run.id}
            <br />
            Scenario: {this.props.scenario.id}
            <br />
            Cohort: {this.props.cohort.id || 'n/a'}
            <br />
            Chat: {(this.props.chat && this.props.chat.id) || 'n/a'}
            <br />
          </div>
        ) : null}
        <Scenario
          baseurl={baseurl}
          cohortId={cohortId}
          scenarioId={scenario.id}
          onResponseChange={onResponseChange}
          onRunChange={onChange}
          onSubmit={onSubmit}
          setActiveSlide={() => {}}
        />
      </Fragment>
    );
  }
}

Run.propTypes = {
  activeRunSlideIndex: PropTypes.number,
  chat: PropTypes.object,
  chatId: PropTypes.node,
  cohort: PropTypes.object,
  cohortId: PropTypes.node,
  getInvites: PropTypes.func,
  getResponse: PropTypes.func,
  getRun: PropTypes.func,
  getScenario: PropTypes.func,
  getUser: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
  invite: PropTypes.object,
  joinChat: PropTypes.func,
  linkRunToChat: PropTypes.func,
  linkRunToCohort: PropTypes.func,
  linkUserToCohort: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortId: PropTypes.node,
      scenarioId: PropTypes.node
    }).isRequired,
    url: PropTypes.string
  }),
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object,
  scenarioId: PropTypes.node,
  setResponses: PropTypes.func,
  setRun: PropTypes.func,
  socket: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps.match || { params: {} };
  const { chatsById, cohort, invites, responses, run, user } = state;
  const cohortId = Identity.fromHashOrId(ownProps.cohortId || params.cohortId);
  const scenarioId = Identity.fromHashOrId(
    ownProps.scenarioId || params.scenarioId
  );

  let chatId = null;
  let invite = null;

  if (ownProps.chatId || params.chatId) {
    chatId = Identity.fromHashOrId(ownProps.chatId || params.chatId);
  } else {
    const code = ownProps.code || params.code;
    invite = invites.length
      ? invites.find(invite => invite.code === code)
      : null;
    chatId = invite && invite.chat_id;
  }

  const chat = chatsById[chatId] || null;
  const scenario = state.scenariosById[scenarioId];
  return {
    activeRunSlideIndex: Number(
      ownProps.activeRunSlideIndex || params.activeRunSlideIndex
    ),
    chat,
    chatId,
    cohort,
    cohortId,
    scenarioId,
    scenario,
    invite,
    invites,
    responses,
    run,
    user
  };
};

const mapDispatchToProps = dispatch => ({
  getInvites: () => dispatch(getInvites()),
  getResponse: params => dispatch(getResponse(params)),
  setResponses: (...params) => dispatch(setResponses(...params)),
  getRun: (...params) => dispatch(getRun(...params)),
  setRun: (...params) => dispatch(setRun(...params)),
  joinChat: (...params) => dispatch(joinChat(...params)),
  linkRunToChat: (...params) => dispatch(linkRunToChat(...params)),
  linkRunToCohort: (...params) => dispatch(linkRunToCohort(...params)),
  linkUserToCohort: (...params) => dispatch(linkUserToCohort(...params)),
  getScenario: params => dispatch(getScenario(params)),
  getUser: params => dispatch(getUser(params))
});

export default withSocket(
  withRunEventCapturing(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(Run)
    )
  )
);
