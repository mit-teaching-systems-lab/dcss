import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import { getChatsByCohortId, setChat } from '@actions/chat';
import { setRun } from '@actions/run';
import {
  getCohort,
  getCohortScenarios,
  setCohortScenarios
} from '@actions/cohort';
import { getRuns } from '@actions/run';
import { getUsers } from '@actions/users';
import JoinAsButton from '@components/Chat/JoinAsButton';
import CohortScenariosSelector from '@components/Cohorts/CohortScenariosSelector';
import CohortRoomSelector from '@components/Cohorts/CohortRoomSelector';
import Gate from '@components/Gate';
import Loading from '@components/Loading';
import { notify } from '@components/Notification';
import Sortable from '@components/Sortable';
import { Button, Card, Container, Icon, Text } from '@components/UI';
import Identity from '@utils/Identity';
import Layout from '@utils/Layout';
import Moment from '@utils/Moment';
import Storage from '@utils/Storage';

import './Cohort.css';

export class CohortScenarios extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      edit: {
        isOpen: false
      },
      room: {
        isOpen: false,
        scenario: null,
        lobby: null
      },
      visibleCount: 4
    };
    this.onEditScenariosClick = this.onEditScenariosClick.bind(this);
    this.onSortableChange = this.onSortableChange.bind(this);
    this.onSortableScroll = this.onSortableScroll.bind(this);
  }

  async componentDidMount() {
    await this.props.getCohort(this.props.id);
    await this.props.getCohortScenarios(this.props.id);
    await this.props.getRuns();

    if (this.props.authority.isFacilitator) {
      await this.props.getUsers();
    }

    this.setState({
      isReady: true
    });
  }

  /* istanbul ignore next */
  moveScenario(fromIndex, toIndex) {
    const { cohort } = this.props;
    const scenarios = cohort.scenarios.slice();
    const moving = scenarios[fromIndex];
    scenarios.splice(fromIndex, 1);
    scenarios.splice(toIndex, 0, moving);
    this.props.setCohortScenarios({
      ...cohort,
      scenarios
    });
  }

  /* istanbul ignore next */
  onSortableChange(fromIndex, toIndex) {
    this.moveScenario(fromIndex, toIndex);
  }

  /* istanbul ignore next */
  onSortableScroll() {
    if (this.state.visibleCount < this.props.cohort.scenarios.length) {
      this.setState({
        visibleCount: this.props.cohort.scenarios.length
      });
    }
  }

  onEditScenariosClick() {
    const edit = {
      isOpen: !this.state.edit.isOpen
    };
    this.setState({
      edit
    });
  }

  render() {
    const {
      onEditScenariosClick,
      onSortableChange /*, onSortableScroll */
    } = this;
    const { authority, chats, cohort, onClick, runs, user } = this.props;
    const { isReady } = this.state;
    const { isFacilitator } = authority;

    if (!isReady) {
      return <Loading />;
    }

    // This is the list of scenarios that are IN the
    // cohort. The order MUST be preserved.
    const cohortScenarios = cohort.scenarios.map(id =>
      this.props.scenarios.find(scenario => scenario.id === id)
    );

    const scenariosInCohortHeader = isFacilitator ? (
      <Fragment>
        <p className="c__scenario-header-num">
          <span>{cohortScenarios.length}</span>{' '}
          {pluralize('scenario', cohortScenarios.length)} selected
        </p>
        <p>
          <Button size="tiny" onClick={onEditScenariosClick}>
            Edit selected scenarios
          </Button>
        </p>
      </Fragment>
    ) : (
      <p className="c__scenario-header-num">
        <span>{cohort.name}</span> includes{' '}
        <span>{cohortScenarios.length}</span>{' '}
        {pluralize('scenario', cohortScenarios.length)}
      </p>
    );

    const onCohortScenariosSelectorClose = () => {
      this.setState({
        edit: {
          isOpen: false
        }
      });
    };

    const cohortScenariosSelectorProps = {
      id: cohort.id,
      buttons: {
        primary: {
          onClick: () => {
            notify({ type: 'success', message: 'Cohort scenarios saved' });
            onCohortScenariosSelectorClose();
          }
        }
      },
      onClose: onCohortScenariosSelectorClose
    };

    const onCohortRoomSelectorClose = () => {
      this.setState({
        room: {
          isOpen: false,
          scenario: null,
          lobby: null
        }
      });
    };

    const cohortScenarioRoomProps = {
      buttons: {
        primary: {
          onClick: () => {
            onCohortRoomSelectorClose();
          }
        }
      },
      onClose: onCohortRoomSelectorClose
    };

    return (
      <Container fluid className="c__scenario-container">
        {scenariosInCohortHeader}

        {cohortScenarios.length ? (
          <Sortable
            className="c__scenario-list"
            disabled={Layout.isForMobile() || !isFacilitator}
            isAuthorized={isFacilitator}
            onChange={onSortableChange}
            options={{
              direction: 'vertical',
              swapThreshold: 0.5,
              animation: 150
            }}
          >
            {cohortScenarios.map(scenario => {
              if (!scenario) {
                return null;
              }

              // TODO: check localstorage for more appropriate slide number to begin at
              const run =
                runs.find(run => run.scenario_id === scenario.id) || {};

              const storageKey = `cohort/${cohort.id}/run/${scenario.id}`;

              const progress = Storage.get(storageKey);
              const slideIndex = progress ? progress.activeRunSlideIndex : 0;

              const hashCohortId = Identity.toHash(cohort.id);
              const hashScenarioId = Identity.toHash(scenario.id);
              const hashChatId = run.chat_id
                ? Identity.toHash(run.chat_id)
                : null;

              let pathname = `/cohort/${hashCohortId}/run/${hashScenarioId}`;

              if (hashChatId) {
                pathname += `/chat/${hashChatId}`;
              }

              pathname += `/slide/${slideIndex}`;

              const url = `${location.origin}${pathname}`;

              const onAddTabClick = event => {
                onClick(event, {
                  type: 'scenario',
                  source: scenario
                });
              };

              const { created_at = null, ended_at = null } = run;

              const createdAt = created_at ? Moment(created_at).fromNow() : '';

              const createdAtAlt = created_at
                ? Moment(created_at).calendar()
                : '';

              const endedAt = ended_at ? Moment(ended_at).fromNow() : '';

              const endedAtAlt = ended_at
                ? Moment(ended_at).calendar()
                : 'This scenario is not complete';

              const startedAtDisplay = created_at
                ? `${createdAt} (${createdAtAlt})`.trim()
                : 'This scenario has not been started';

              const endedAtCreatedAtAlt = created_at ? endedAtAlt : null;
              const endedAtDisplay = ended_at
                ? `${endedAt} (${endedAtAlt})`.trim()
                : endedAtCreatedAtAlt;

              // const completionStatus = !isFacilitator
              //   ? completeOrIncomplete
              //   : {};

              const scenarioCursor = isFacilitator
                ? { cursor: 'move' }
                : { cursor: 'auto' };

              // const onCohortScenarioUrlCopyClick = () => {
              //   copy(url);
              //   notify({
              //     message: url,
              //     title: 'Copied',
              //     icon: 'linkify'
              //   });
              // };
              const isMultiParticipantScenario = scenario.personas.length > 1;

              const cardHeaderIconClassName = isMultiParticipantScenario
                ? 'users'
                : 'user';

              const cardHeaderAriaLabel = isMultiParticipantScenario
                ? `${scenario.title} is a group scenario`
                : `${scenario.title} is a solo scenario`;

              // const singleCardHeaderProps = {
              //   as: 'a',
              //   href: pathname
              // };

              // const multiCardHeaderProps = {
              //   onClick: () => {
              //     this.setState({
              //       room: {
              //         isOpen: true
              //       }
              //     });
              //   }
              // };

              const key = Identity.key(scenario);

              const existingChat = chats.find(
                chat =>
                  chat.scenario_id === scenario.id &&
                  chat.host_id === user.id &&
                  chat.cohort_id === cohort.id &&
                  chat.ended_at === null
              );

              // const resolvedHeaderProps = isMultiParticipantScenario
              //   ? multiCardHeaderProps
              //   : singleCardHeaderProps;

              // let cardHeaderProps = {
              //   'aria-label': cardHeaderAriaLabel,
              //   ...resolvedHeaderProps
              // };

              let finishButtonDisplay = isMultiParticipantScenario
                ? 'Go to my room to finish scenario'
                : 'Finish scenario';

              let runButtonDisplay = isMultiParticipantScenario
                ? 'Create or join a room to run scenario'
                : 'Run scenario';

              let rerunButtonDisplay = isMultiParticipantScenario
                ? 'Create or join a room to re-run scenario'
                : 'Re-run scenario';

              let startButtonDisplay = created_at
                ? finishButtonDisplay
                : runButtonDisplay;

              let runScenarioDisplay = ended_at
                ? rerunButtonDisplay
                : startButtonDisplay;

              let runStartedMaybeFinished = startedAtDisplay;

              if (created_at && !ended_at) {
                runStartedMaybeFinished = `Started ${startedAtDisplay}. ${endedAtDisplay}.`;
              }

              if (ended_at) {
                runStartedMaybeFinished = `Finished ${endedAtDisplay}.`;
              }

              return (
                <Card
                  className="c__scenario-card"
                  key={key}
                  style={scenarioCursor}
                >
                  <Card.Content>
                    <Card.Header aria-label={cardHeaderAriaLabel}>
                      <Icon
                        className="primary"
                        name={cardHeaderIconClassName}
                      />
                      {scenario.title}
                    </Card.Header>
                    <Card.Description>
                      <Text.Truncate lines={2}>
                        {scenario.description}
                      </Text.Truncate>
                    </Card.Description>
                    {!isFacilitator ? (
                      <Card.Meta>{runStartedMaybeFinished}</Card.Meta>
                    ) : null}
                    <Card.Meta>
                      <Button
                        size="tiny"
                        data-testid="run-cohort-as-participant"
                        onClick={() => {
                          if (isMultiParticipantScenario) {
                            if (created_at && !ended_at) {
                              location.href = url;
                            } else {
                              this.setState({
                                room: {
                                  isOpen: true,
                                  lobby: null,
                                  scenario
                                }
                              });
                            }
                          } else {
                            location.href = url;
                          }
                        }}
                      >
                        <Icon className="primary" name="play" />
                        {runScenarioDisplay}
                      </Button>
                      {isMultiParticipantScenario && existingChat ? (
                        <Fragment>
                          <Button
                            size="tiny"
                            data-testid="see-my-room-lobby"
                            onClick={() => {
                              this.setState({
                                room: {
                                  isOpen: true,
                                  lobby: {
                                    isOpen: true,
                                    chat: existingChat
                                  },
                                  scenario
                                }
                              });
                            }}
                          >
                            <Icon className="primary" name="group" />
                            Go to my room&apos;s lobby
                          </Button>
                          <Button
                            size="tiny"
                            data-testid="close-my-room"
                            onClick={async () => {
                              const time = new Date().toISOString();
                              await this.props.setChat(existingChat.id, {
                                deleted_at: time,
                                ended_at: time
                              });
                              if (run) {
                                await this.props.setRun(run.id, {
                                  ended_at: time
                                });
                              }
                              await this.props.getChatsByCohortId(cohort.id);
                              await this.props.getRuns();
                            }}
                          >
                            <Icon className="primary" name="close" />
                            Close my room
                          </Button>
                        </Fragment>
                      ) : null}
                      {/*isFacilitator ? (
                        <Button
                          size="tiny"
                          data-testid="copy-cohort-scenario-link"
                          onClick={onCohortScenarioUrlCopyClick}
                        >
                          <Icon className="primary" name="clipboard outline" />
                          Copy scenario link to clipboard
                        </Button>
                      ) : null*/}
                    </Card.Meta>
                    {isMultiParticipantScenario && !existingChat ? (
                      <Card.Meta className="c__join-as">
                        {scenario.personas.map(persona => {
                          return (
                            <JoinAsButton
                              key={Identity.key(persona)}
                              cohort={cohort}
                              persona={persona}
                              scenario={scenario}
                            />
                          );
                        })}
                      </Card.Meta>
                    ) : null}
                  </Card.Content>
                  <div className="c__scenario-extra">
                    <Gate
                      requiredPermission="view_all_data"
                      isAuthorized={isFacilitator}
                    >
                      <Button
                        primary
                        size="large"
                        data-testid="view-cohort-responses"
                        name={scenario.title}
                        onClick={onAddTabClick}
                      >
                        View reponses
                      </Button>
                    </Gate>
                  </div>
                </Card>
              );
            })}
          </Sortable>
        ) : (
          <p key="row-empty-results">
            There are no scenarios selected for this cohort.
          </p>
        )}

        {this.state.edit.isOpen ? (
          <CohortScenariosSelector {...cohortScenariosSelectorProps} />
        ) : null}

        {this.state.room.isOpen ? (
          <CohortRoomSelector
            {...cohortScenarioRoomProps}
            lobby={this.state.room.lobby}
            scenario={this.state.room.scenario}
          />
        ) : null}

        <div data-testid="cohort-scenarios" />
      </Container>
    );
  }
}

CohortScenarios.propTypes = {
  authority: PropTypes.object,
  id: PropTypes.any,
  chats: PropTypes.array,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    roles: PropTypes.array,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  getCohort: PropTypes.func,
  getCohortScenarios: PropTypes.func,
  setCohortScenarios: PropTypes.func,
  onClick: PropTypes.func,
  scenarios: PropTypes.array,
  getRuns: PropTypes.func,
  getRuns: PropTypes.func,
  runs: PropTypes.array,
  user: PropTypes.object,
  getUsers: PropTypes.func,
  setChat: PropTypes.func,
  usersById: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { chats, cohort, cohorts, user, usersById } = state;
  const scenarios = state.scenarios.filter(
    ({ deleted_at, status }) => deleted_at === null && status !== 1
  );
  const runs = state.runs.filter(run => run.cohort_id === ownProps.id);
  return { chats, cohort, cohorts, scenarios, runs, user, usersById };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  getCohortScenarios: id => dispatch(getCohortScenarios(id)),
  setCohortScenarios: params => dispatch(setCohortScenarios(params)),
  getRuns: () => dispatch(getRuns()),
  getUsers: () => dispatch(getUsers()),
  setChat: (id, params) => dispatch(setChat(id, params)),
  setRun: (id, params) => dispatch(setRun(id, params)),
  getChatsByCohortId: id => dispatch(getChatsByCohortId(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CohortScenarios);
