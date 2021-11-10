import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  getChat,
  getChatByIdentifiers,
  getLinkedChatUsersByChatId,
  joinChat,
  linkRunToChat
} from '@actions/chat';
import { linkRunToCohort, linkUserToCohort } from '@actions/cohort';
import { getInvites } from '@actions/invite';
import { getUser } from '@actions/user';
import { setResponses } from '@actions/response';
import { getRun, getRunByIdentifiers, setRun } from '@actions/run';
import { getScenario } from '@actions/scenario';
import Lobby from '@components/Lobby';
import Scenario from '@components/Scenario';
import { Button, Header, Modal, Title } from '@components/UI';
import withRunEventCapturing, {
  PROMPT_RESPONSE_SUBMITTED,
  SCENARIO_ARRIVAL
} from '@hoc/withRunEventCapturing';
import withSocket, { CHAT_ENDED, RUN_AGENT_START } from '@hoc/withSocket';
import Identity from '@utils/Identity';
import Payload from '@utils/Payload';
import QueryString from '@utils/QueryString';
import Storage from '@utils/Storage';

class Run extends Component {
  constructor(props) {
    super(props);

    const {
      match: { url }
    } = this.props;

    this.state = {
      isReady: false,
      baseurl: url.replace(/\/slide\/\d.*$/g, ''),
      runHasEndedConfirmation: {
        isOpen: false
      },
      lobby: {
        isOpen: false,
        isUnassigned: false
      }
    };

    this.responses = new Map();
    this.onChange = this.onChange.bind(this);
    this.onChatEnded = this.onChatEnded.bind(this);
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
    this.props.socket.off(CHAT_ENDED, this.onChatEnded);
  }

  get isCohortScenarioRun() {
    return window.location.pathname.includes('/cohort/');
  }

  get isMultiparticipant() {
    return this.props.scenario.personas.length > 1;
  }

  async componentDidMount() {
    const {
      location: { search }
    } = this.props;

    const { lobby } = this.state;

    let chatId = this.props.chatId;
    let cohortId = this.props.cohortId;
    let scenarioId = this.props.scenarioId;

    if (!this.props.scenario) {
      await this.props.getScenario(scenarioId);
    }

    // If no scenario is found, there is nothing else to do.
    if (!this.props.scenario) {
      return;
    }

    await this.props.getInvites();

    if (chatId) {
      // To ensure that no run is created with an expired chat,
      // we must always check the chat status first. If the
      // chat has ended, then we send the user to an appropriate
      // destination, which is either back to the cohort, or
      // reloading this scenario run without an existing chat.
      await this.props.getChat(chatId);

      if (this.props.chat.ended_at) {
        const run = await this.props.getRunByIdentifiers(
          scenarioId,
          cohortId,
          chatId
        );

        // If a run still exists, then we need to set its
        // ended_at and redirect the user. This can happen
        // when the host has left before the participant
        // and the participant refreshes the browser.
        if (run) {
          await this.props.setRun(run.id, {
            ended_at: new Date().toISOString()
          });
        }

        // const url = cohortId
        //   ? `/cohort/${Identity.toHash(cohortId)}`
        //   : `/run/${Identity.toHash(scenarioId)}`;
        const url = cohortId
          ? `/cohort/${Identity.toHash(cohortId)}`
          : `/scenarios`;

        location.href = url;
        return;
      }
    } else {
      // If there is no chatId, we need to check the scenario
      // and determine if this scenario requires a chat room
      // to function properly. A scenario that has greater
      // than one persona definition MUST have chat room.
      //
      // TODO: determine if the following still holds true:
      // This path MUST NOT be taken if the scenario run is
      // for a cohort. Multi-participant scenario runs that
      // originate in a cohort are limited to that cohort's
      // participant roster.

      if (this.isMultiparticipant) {
        const cohort = this.props.cohortId
          ? {
              id: this.props.cohortId
            }
          : null;
        // Use `getChat` which will look for an existing chat
        // for this user (as host), running this scenario; and
        // will create one if necessary.
        const chat = await this.props.getChatByIdentifiers(
          this.props.scenario,
          cohort
        );
        // Assigning the new chat.id to chatId ensures that
        // linkRunToChat is called.
        chatId = chat.id;
        // this.props.chat should now be populated by the chat that
        // was returned from the server, whether it is a new chat or
        // an existing chat.

        if (this.props.scenario.personas.length !== chat.users.length) {
          // This will signal that Run should show the Lobby first.
          lobby.isOpen = true;
        }
      }
    }

    const run = await this.props.getRun(scenarioId, cohortId, chatId);

    if (run) {
      const { user } = this.props;

      if (cohortId) {
        const cohort = await this.props.linkRunToCohort(cohortId, run.id);

        if (cohort) {
          if (!cohort.users.find(({ id }) => id === user.id)) {
            // For now we'll default all unknown
            // users as "participant".
            await this.props.linkUserToCohort(cohort.id, 'participant');
          }
        }
      }

      if (chatId) {
        await this.props.linkRunToChat(chatId, run.id);
        if (this.props.chat) {
          const userInChat = this.props.chat.usersById[user.id];
          const isUserInChat = !!userInChat;
          const isUserRoleAssigned =
            isUserInChat && userInChat.persona_id != null;
          if (!isUserRoleAssigned) {
            const allRolesFilled = this.props.scenario.personas.every(persona =>
              this.props.chat.users.some(user => user.persona_id === persona.id)
            );

            if (allRolesFilled) {
              // TODO: handle stale invites
            }

            if (this.props.invite) {
              const persona = this.props.scenario.personas.find(
                persona => persona.id === this.props.invite.persona_id
              );
              await this.props.joinChat(this.props.chat.id, persona);
            } else {
              lobby.isUnassigned = true;
            }
          } else {
            lobby.isUnassigned = false;
          }
        }
      }

      this.props.socket.emit(
        RUN_AGENT_START,
        Payload.compose(
          this.props,
          { run }
        )
      );

      this.setState({
        isReady: true,
        lobby
      });

      this.props.saveRunEvent(SCENARIO_ARRIVAL, {
        scenario: this.props.scenario
      });

      const referrer_params = Storage.get('app/referrer_params');

      if (search || referrer_params) {
        await this.props.setRun(run.id, {
          referrer_params: QueryString.parse(search || referrer_params)
        });
        Storage.delete('app/referrer_params');
      }
    }

    window.addEventListener('beforeunload', this.submitIfPendingResponses);

    this.props.socket.on(CHAT_ENDED, this.onChatEnded);
  }

  async onChatEnded({ chat }) {
    if (this.props.run.ended_at) {
      return;
    }

    // CHAT_ENDED is not emitted to the channel created by
    // CREATE_CHAT_CHANNEL, per socket-manager:
    //    "This cannot be specifically bound to a room
    //      created by CREATE_CHAT_CHANNEL, because it
    //      needs to be accessible from cohort room selector"
    //
    // Therefore, this check MUST exist to prevent
    // a global "chat ended" event from occuring.

    if (chat.id !== this.props.chat.id) {
      return;
    }

    const ender = Storage.get(`run/${this.props.run.id}/ender`, { id: null });

    // If this is not the user that initiated ending the run,
    // then allow them  to choose to continue alone.
    this.setState({
      runHasEndedConfirmation: {
        isOpen: true,
        isEnder: ender.id === this.props.user.id
      }
    });

    if (ender.id) {
      Storage.delete(`run/${this.props.run.id}/ender`);
    }
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
    const {
      activeRunSlideIndex,
      chat,
      cohortId,
      run,
      scenario,
      user
    } = this.props;
    const { isReady, baseurl, runHasEndedConfirmation, lobby } = this.state;

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

    let runViewTitle = `${this.props.scenario.title}, Slide #${activeRunSlideIndex}`;
    let runViewContents = (
      <Scenario
        baseurl={baseurl}
        cohortId={cohortId}
        scenarioId={scenario.id}
        onResponseChange={onResponseChange}
        onRunChange={onChange}
        onSubmit={onSubmit}
        setActiveSlide={() => {}}
      />
    );

    // if (!this.isCohortScenarioRun && this.isMultiparticipant && lobby.isOpen) {
    if (this.isMultiparticipant && lobby.isOpen) {
      const onRoleSelect = async selected => {
        if (selected.user.id === user.id) {
          await this.props.joinChat(this.props.chat.id, selected.persona);
          await this.props.getLinkedChatUsersByChatId(this.props.chat.id);
        }
      };

      const onContinueClick = destination => {
        this.setState({
          lobby: {
            isOpen: false,
            isUnassigned: false
          }
        });
        // If consent has been acknowledged,
        // proceed to slide/1 from here.
        if (run.consent_acknowledged_by_user) {
          const nextPath = destination ? destination : `${baseurl}/slide/1`;
          this.props.history.push(nextPath);
        }
      };

      runViewTitle = `${this.props.scenario.title} Lobby`;
      runViewContents = (
        <Lobby
          asCard={true}
          chat={chat}
          onContinueClick={onContinueClick}
          onRoleSelect={onRoleSelect}
          scenario={scenario}
        />
      );
    }

    if (runHasEndedConfirmation.isOpen) {
      const whereAmIGoing = this.isCohortScenarioRun
        ? 'your cohort'
        : 'the main scenario list';

      const cohortIdHash = Identity.toHash(this.props.cohort.id);
      const onRunEndConfirm = () => {
        this.props.setRun(this.props.run.id, {
          ended_at: new Date().toISOString()
        });

        location.href = this.isCohortScenarioRun
          ? `/cohort/${cohortIdHash}`
          : `/scenarios`;
      };

      const onRunContinueClose = () => {
        this.setState({
          runHasEndedConfirmation: {
            isOpen: false
          }
        });
      };

      const headerContent = runHasEndedConfirmation.isEnder
        ? 'You ended this scenario run'
        : 'This scenario run was ended';

      const modalContent = runHasEndedConfirmation.isEnder ? (
        <p>
          You&quot;ve ended this scenario and will now return to {whereAmIGoing}.{' '}
        </p>
      ) : (
        <Fragment>
          <p>
            This scenario run has been ended by a participant. Please click
            &apos;Exit this scenario&quot; to return to {whereAmIGoing}.{' '}
          </p>

          <p>
            Alternatively, you may continue, however you may not be able to
            complete all of the tasks and requirements of this scenario. Click
            &quot;Continue alone&quot; to stay and attempt to complete the
            scenario on your own.
          </p>
        </Fragment>
      );

      runViewContents = (
        <Modal.Accessible open>
          <Modal
            closeIcon
            open
            aria-modal="true"
            role="dialog"
            size="small"
            onClose={onRunEndConfirm}
          >
            <Header icon="trash alternate outline" content={headerContent} />
            <Modal.Content>{modalContent}</Modal.Content>
            <Modal.Actions>
              <Button.Group fluid widths={2}>
                {!runHasEndedConfirmation.isEnder ? (
                  <Fragment>
                    <Button
                      primary
                      aria-label="Exit this scenario"
                      onClick={() => {
                        onRunEndConfirm();
                      }}
                    >
                      Exit this scenario
                    </Button>
                    <Button.Or />
                    <Button
                      aria-label="Continue alone"
                      onClick={() => {
                        onRunContinueClose();
                      }}
                    >
                      Continue alone
                    </Button>
                  </Fragment>
                ) : (
                  <Button
                    primary
                    aria-label={`Return to ${whereAmIGoing}`}
                    onClick={() => {
                      onRunEndConfirm();
                    }}
                  >
                    Return to {whereAmIGoing}
                  </Button>
                )}
              </Button.Group>
            </Modal.Actions>
            <div data-testid="run-has-ended-confirmation" />
          </Modal>
        </Modal.Accessible>
      );
    }

    return (
      <Fragment>
        <Title content={runViewTitle} />
        {runViewContents}
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
  getChat: PropTypes.func,
  getChatByIdentifiers: PropTypes.func,
  getLinkedChatUsersByChatId: PropTypes.func,
  getInvites: PropTypes.func,
  getRun: PropTypes.func,
  getRunByIdentifiers: PropTypes.func,
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
  let scenarioId = Identity.fromHashOrId(
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
    chatId = (invite && invite.chat_id) || null;
  }

  const stateChat =
    (state.chat.ended_at === null &&
      state.chat.scenario_id === scenarioId &&
      state.chat) ||
    null;

  const chat = chatsById[chatId] || stateChat || null;

  if (!scenarioId) {
    scenarioId = chat.scenario_id;
  }

  // console.log("chat:", chat);
  // console.log("scenarioId:", scenarioId);
  // console.log("state.scenariosById:", state.scenariosById);

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
  getChat: id => dispatch(getChat(id)),
  getChatByIdentifiers: (...params) =>
    dispatch(getChatByIdentifiers(...params)),
  getInvites: () => dispatch(getInvites()),
  getLinkedChatUsersByChatId: id => dispatch(getLinkedChatUsersByChatId(id)),
  setResponses: (...params) => dispatch(setResponses(...params)),
  getRunByIdentifiers: (...params) => dispatch(getRunByIdentifiers(...params)),
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
