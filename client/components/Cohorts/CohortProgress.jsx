import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash.escaperegexp';
import pluralize from 'pluralize';
import { upperCaseFirst } from 'change-case';
import {
  Button,
  Card,
  Checkbox,
  Container,
  Dropdown,
  Grid,
  Header,
  Icon,
  Input,
  List,
  Modal,
  Table,
  Text
} from '@components/UI';
import { getCohort, getCohortScenarios } from '@actions/cohort';
import CohortParticipants from '@components/Cohorts/CohortParticipants';
import Loading from '@components/Loading';
import Username from '@components/User/Username';
import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import Payload from '@utils/Payload';
import Storage from '@utils/Storage';
import withSocket, {
  FACILITATOR_CANCELED_MATCH_REQUEST,
  FACILITATOR_CREATED_MATCH_REQUEST
} from '@hoc/withSocket';

import './Cohort.css';

export class CohortProgress extends React.Component {
  constructor(props) {
    super(props);

    this.storageKey = `cohort-progress/${this.props.id}`;
    let persisted = Storage.get(this.storageKey);

    /* istanbul ignore else */
    if (!persisted) {
      persisted = { refresh: true };
      Storage.set(this.storageKey, persisted);
    }

    const { refresh } = persisted;

    this.state = {
      isReady: false,
      assignment: {
        isOpen: false,
        participants: [],
        persona: null,
        scenario: null
      },
      cancel: {
        isOpen: false,
        participant: null,
        scenario: null,
        persona: null
      },
      manage: {
        isOpen: false
      },
      refresh,
      search: '',
      participants: []
    };

    this.interval = null;
    this.onParticipantSearchChange = this.onParticipantSearchChange.bind(this);
  }

  async fetchCohort() {
    if (this.hasUnmounted) {
      return;
    }

    await this.props.getCohort(this.props.id);

    const hasScenariosLoaded = this.props.cohort.scenarios.every(
      id => this.props.scenariosById[id]
    );

    if (!hasScenariosLoaded) {
      await this.props.getCohortScenarios(this.props.id);
    }

    /* istanbul ignore else */
    if (!this.state.isReady) {
      this.setState({
        isReady: true
      });
    }
  }

  refresh() {
    this.interval = setInterval(async () => {
      /* istanbul ignore else */
      if (!this.state.search && document.visibilityState === 'visible') {
        await this.fetchCohort();
      }
    }, 5000);
  }

  async componentDidMount() {
    await this.fetchCohort();
    /* istanbul ignore if */
    if (this.state.refresh) {
      // TODO: allow updating to paused.
      this.refresh();
    }
  }

  componentWillUnmount() {
    this.hasUnmounted = true;
    clearInterval(this.interval);
  }

  onParticipantSearchChange(event, { value }) {
    if (value === '') {
      this.setState({
        search: '',
        participants: []
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    let participants = this.props.cohort.users.filter(participant => {
      if (escapedRegExp.test(participant.username)) {
        return true;
      }

      if (escapedRegExp.test(participant.email)) {
        return true;
      }

      if (escapedRegExp.test(participant.roles.join(','))) {
        return true;
      }

      return false;
    });

    this.setState({
      search: value,
      participants
    });
  }

  /* istanbul ignore next */
  onRefreshChange() {
    let refresh = !this.state.refresh;
    this.setState({ refresh }, () => {
      if (!refresh) {
        clearInterval(this.interval);
      } else {
        this.refresh();
      }
      Storage.set(this.storageKey, this.state);
    });
  }

  render() {
    const { onParticipantSearchChange } = this;
    const { authority, cohort, onClick } = this.props;
    const { isReady } = this.state;

    if (!isReady) {
      return <Loading />;
    }

    const cohortScenarios = this.props.cohort.scenarios;

    const sourceParticipants = this.state.participants.length
      ? this.state.participants
      : this.props.cohort.users;

    const completedCount = sourceParticipants.reduce((accum, user) => {
      const {
        progress: { completed }
      } = user;

      if (cohort.scenarios.every(id => completed.includes(id))) {
        user.progress.status = 'complete';
        accum++;
      } else {
        user.progress.status = 'incomplete';
      }
      return accum;
    }, 0);

    const usersInCohortHeader = (
      <p className="c__by-the-numbers-heading">
        <strong>
          {completedCount}&#47;{sourceParticipants.length}
        </strong>{' '}
        {pluralize('participant', sourceParticipants.length)} have completed all
        scenarios
      </p>
    );

    const searchInputAriaLabel = 'Search participants';
    const manageButtonAriaLabel = 'Manage participant access';
    const cancelButtonAriaLabel = 'Cancel all participant join requests';

    const searchParticipantsInCohort = (
      <Input
        aria-label={searchInputAriaLabel}
        label={searchInputAriaLabel}
        className="grid__menu-search"
        icon="search"
        onChange={onParticipantSearchChange}
      />
    );

    const manageParticipantsButton = (
      <Button
        size="tiny"
        aria-label={manageButtonAriaLabel}
        onClick={() => {
          this.setState({
            manage: {
              isOpen: true
            }
          });
        }}
      >
        {manageButtonAriaLabel}
      </Button>
    );

    let cancelables = [];
    const cancelParticipantsPoolButton = (
      <Button
        size="tiny"
        aria-label={cancelButtonAriaLabel}
        onClick={() => {
          this.setState({
            cancel: {
              isOpen: true,
              participant: null,
              scenario: null,
              persona: null
            }
          });
        }}
      >
        {cancelButtonAriaLabel}
      </Button>
    );

    const onConfirmCancelPoolClose = () => {
      this.setState({
        cancel: {
          isOpen: false,
          participant: null,
          scenario: null,
          persona: null
        }
      });
    };

    const cancelParticipantsPoolHeader = this.state.cancel.participant
      ? `Cancel ${this.state.cancel.participant.username}'s join request?`
      : `${cancelButtonAriaLabel}?`;

    const cancelParticipantsPoolExplanation = this.state.cancel.participant ? (
      <p>
        Are you sure you want to cancel{' '}
        <strong>
          {<Username user={this.state.cancel.participant} />}&apos;s
        </strong>{' '}
        request to join <strong>{this.state.cancel.scenario.title}</strong> as{' '}
        <strong>{this.state.cancel.persona.name}</strong>?
      </p>
    ) : (
      <p>
        Are you sure you want to cancel all of these participant join requests?
      </p>
    );

    const scenarioAssignmentSelectDropdownOptions = cohort.scenarios.reduce(
      (accum, id) => {
        const scenario = this.props.scenariosById[id];
        if (scenario && scenario.personas && scenario.personas.length > 1) {
          accum.push({
            key: scenario.id,
            text: scenario.title,
            value: scenario.id
          });
        }
        return accum;
      },
      []
    );

    scenarioAssignmentSelectDropdownOptions.unshift({
      key: '',
      value: null,
      text: ''
    });

    const scenarioAssignmentSelectDropdownValue = this.state.assignment.scenario
      ? this.state.assignment.scenario.id
      : null;

    const scenarioAssignmentSelectDropdown = scenarioAssignmentSelectDropdownOptions.length ? (
      <Dropdown
        selection
        className="tiny c__assignment-dropdown"
        placeholder="Select a scenario"
        options={scenarioAssignmentSelectDropdownOptions}
        value={scenarioAssignmentSelectDropdownValue}
        onChange={(e, { value }) => {
          const assignment = this.state.assignment;
          this.setState({
            assignment: {
              ...assignment,
              persona: null,
              scenario: this.props.scenariosById[value]
            }
          });
        }}
      />
    ) : null;

    const personaAssignmentSelectDropdownOptions = this.state.assignment
      .scenario
      ? this.state.assignment.scenario.personas.reduce((accum, persona) => {
        return [
          ...accum,
          {
            key: persona.id,
            text: persona.name,
            value: persona.id
          }
        ];
      }, [])
      : [];

    if (personaAssignmentSelectDropdownOptions.length) {
      personaAssignmentSelectDropdownOptions.unshift({
        key: '',
        value: null,
        text: ''
      });
    }

    const personaAssignmentSelectDropdownValue = this.state.assignment.persona
      ? this.state.assignment.persona.id
      : null;

    const personaAssignmentSelectDropdown = personaAssignmentSelectDropdownOptions.length ? (
      <Dropdown
        selection
        className="tiny c__assignment-dropdown"
        placeholder="Select a persona"
        options={personaAssignmentSelectDropdownOptions}
        value={personaAssignmentSelectDropdownValue}
        onChange={(e, { value }) => {
          const assignment = this.state.assignment;
          const persona = assignment.scenario.personas.find(
            p => p.id === value
          );
          if (persona) {
            this.setState({
              assignment: {
                ...assignment,
                persona
              }
            });
          }
        }}
      />
    ) : null;

    const pluralizedAssignmentButton = this.state.assignment.participants.length
      ? pluralize(
        'Assign selected participant',
        this.state.assignment.participants.length
      )
      : 'Select participants below';

    const personaAssignButton = this.state.assignment.persona ? (
      <Button
        size="tiny"
        content={pluralizedAssignmentButton}
        disabled={this.state.assignment.participants.length === 0}
        onClick={() => {
          const assignment = this.state.assignment;
          this.setState({
            assignment: {
              ...assignment,
              isOpen: true
            }
          });
        }}
      />
    ) : null;

    const isInAssignmentState =
      this.state.assignment.scenario && this.state.assignment.persona;

    const onConfirmAssignmentReset = () => {
      this.setState(
        {
          assignment: {
            isOpen: false,
            participants: [],
            scenario: null,
            persona: null
          }
        },
        () => {
          this.fetchCohort();
        }
      );
    };

    const onConfirmAssignmentClose = () => {
      const assignment = this.state.assignment;
      this.setState({
        assignment: {
          ...assignment,
          isOpen: false
        }
      });
    };

    const pluralizedParticipant = isInAssignmentState
      ? pluralize('participant', this.state.assignment.participants.length)
      : null;

    const pluralizeThisOrThese = isInAssignmentState
      ? pluralize('this', this.state.assignment.participants.length)
      : null;

    const assignmentParticipantsHeader = `Assign ${pluralizeThisOrThese} ${pluralizedParticipant}?`;

    const isAwaitingMoreThanOneOtherParticipant = isInAssignmentState
      ? this.state.assignment.scenario.personas.length > 2
      : false;

    const pluralizedAwaitParticipants = `participant${
      isAwaitingMoreThanOneOtherParticipant ? 's' : ''
    }`;

    const pluralizedAMatchingParticipant = isAwaitingMoreThanOneOtherParticipant
      ? `matching ${pluralizedAwaitParticipants}`
      : `a matching ${pluralizedAwaitParticipants}`;

    const assignmentParticipantsExplanation = this.state.assignment.participants
      .length ? (
        <Fragment>
          <p>
          Are you sure you want to send the following {pluralizedParticipant} to{' '}
            <strong>{this.state.assignment.scenario.title}</strong> as{' '}
            <strong>{this.state.assignment.persona.name}</strong>?
          </p>
          <p>
          If you click <strong>Yes</strong>, {pluralizeThisOrThese} selected{' '}
            {pluralizedParticipant} will be automatically redirected to await{' '}
            {pluralizedAMatchingParticipant} to complete the scenario.
          </p>
          <List className="cp__list" relaxed="very">
            {this.state.assignment.participants.map(id => {
              const participant = this.props.cohort.usersById[id];
              return (
                <List.Item key={Identity.key(participant)}>
                  <List.Content>
                    <List.Header>
                      <Username user={participant} />
                    </List.Header>
                  </List.Content>
                </List.Item>
              );
            })}
          </List>
        </Fragment>
      ) : null;

    return (
      <Container fluid className="c__section-container">
        <Grid stackable className="c__section-container-header" columns={2}>
          <Grid.Row>
            <Grid.Column width={8}>{usersInCohortHeader}</Grid.Column>
            <Grid.Column width={8}>{searchParticipantsInCohort}</Grid.Column>
          </Grid.Row>
          <Grid.Row className="c__grid-element-unpadded">
            <Grid.Column width={16}>
              {manageParticipantsButton}
              {cancelParticipantsPoolButton}
              {scenarioAssignmentSelectDropdown}
              {personaAssignmentSelectDropdown}
              {personaAssignButton}
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div className="c__participant-list">
          {sourceParticipants.map(participant => {
            /* istanbul ignore if */
            if (!participant) {
              return null;
            }

            const { progress } = participant;

            const eventsValues = Object.values(progress.latestByScenarioId);
            const eventsCount = eventsValues.length;
            const completedCount = cohort.scenarios.reduce((accum, id) => {
              if (progress.completed.includes(id)) {
                accum++;
              }
              return accum;
            }, 0);

            const lastInProgressScenarioEvent = eventsValues.reduce(
              (accum, eventValue) => {
                if (!eventValue.is_complete) {
                  if (accum.created_at < eventValue.created_at) {
                    return {
                      ...eventValue
                    };
                  }
                }
                return accum;
              },
              { created_at: 0 }
            );

            // Participant may  currently be actively running a scenario again.
            // "isInProgress" should override "hasCompletedAllScenarios"
            const isInProgress = lastInProgressScenarioEvent.created_at !== 0;
            // Participant has completed all scenarios...
            const hasCompletedAllScenarios =
              completedCount === cohort.scenarios.length && !isInProgress;

            let lastAccessedAt = null;
            let lastAccessedAgo = null;
            let lastScenarioViewed = null;
            let lastUrlVisited = null;
            let lastEventDescription = null;
            let lastEventWasCancelation = null;
            let lastSlideViewed = null;
            let mustShowCancelRequestButton = false;
            let cancelRequestProps = {};
            let statusText = hasCompletedAllScenarios
              ? 'Complete'
              : 'In progress';
            let statusIcon = hasCompletedAllScenarios ? 'check' : 'circle';
            let statusIconClassName = hasCompletedAllScenarios
              ? 'c__progress-green'
              : 'c__progress-purple';

            let completedOrCurrentScenario = '';
            let mustShowLastActivityAndSlide = true;

            let lastEvent = null;
            let lastUserEvent = eventsValues.reduce((accum, lue) => {
              // Previously this limited what data would display in the
              // participant progress view
              // if (lue.is_run) {
              //   return accum;
              // }
              if (!accum || accum.created_at < lue.created_at) {
                return {
                  ...lue
                };
              }
              return accum;
            }, null);

            if (!eventsCount) {
              statusIcon = 'warning sign';
              statusText = 'Not started';
              statusIconClassName = 'c__progress-red';
            } else {
              lastEvent =
                eventsValues[eventsValues.length - 1] || lastUserEvent;

              lastScenarioViewed = this.props.scenariosById[
                lastEvent.scenario_id
              ];

              lastAccessedAt = lastEvent.created_at
                ? new Date(Number(lastEvent.created_at)).toISOString()
                : null;

              lastAccessedAgo = lastAccessedAt
                ? Moment(lastAccessedAt).fromNow()
                : null;

              if (
                hasCompletedAllScenarios &&
                progress.completed.includes(lastEvent.scenario_id)
              ) {
                completedOrCurrentScenario = `Last Completed scenario`;
                mustShowLastActivityAndSlide = false;
              } else {
                completedOrCurrentScenario = `Current scenario`;

                lastUrlVisited = lastEvent.url || null;
                lastSlideViewed = lastUrlVisited
                  ? lastUrlVisited.slice(lastUrlVisited.indexOf('/slide') + 7)
                  : null;

                const description = lastEvent.description || '';

                lastEventDescription = upperCaseFirst(description);
                lastEventWasCancelation = description.includes('cancel');

                if (!lastEvent.is_run) {
                  statusText = 'Waiting';
                  statusIcon = 'clock';
                  statusIconClassName = 'c__progress-orange';

                  if (lastEventWasCancelation) {
                    statusText = 'Canceled';
                    statusIcon = 'question';
                    statusIconClassName = 'c__progress-blue';
                  } else {
                    const { persona } = lastEvent;
                    const scenario = this.props.scenariosById[
                      lastEvent.scenario_id
                    ];
                    cancelRequestProps = {
                      lastAccessedAgo,
                      participant,
                      persona,
                      scenario
                    };
                    cancelables.push(cancelRequestProps);
                    mustShowCancelRequestButton = true;
                  }
                }
              }
            }

            const lastAccessedDisplay = lastAccessedAt ? (
              <p className="c__participant-completion__group">
                <span className="c__participant-completion__subhed">
                  Last accessed
                </span>
                {lastAccessedAt ? (
                  <time dateTime={lastAccessedAt}>{lastAccessedAgo}</time>
                ) : null}
              </p>
            ) : null;

            const onAddTabClick = (event, data) => {
              onClick(event, {
                ...data,
                type: 'participant',
                source: participant
              });
            };

            const isChecked =
              isInAssignmentState &&
              this.state.assignment.participants.includes(participant.id);

            return (
              <Card
                className="c__participant-card"
                key={Identity.key(participant)}
              >
                <Card.Content className="c__scenario-content">
                  <Card.Header>
                    <Username user={participant} />
                  </Card.Header>
                  <p className="c__participant-completion__scenarios-completed">
                    <span>
                      {completedCount}&#47;{cohortScenarios.length}{' '}
                    </span>
                    {pluralize('scenario', cohortScenarios.length)} completed
                  </p>
                  {lastAccessedDisplay}

                  {isInAssignmentState &&
                  participant.id !== this.props.user.id ? (
                      <Checkbox
                        className="c__assignment-checkbox"
                        label="Select for assignment"
                        checked={isChecked}
                        onChange={(e, { checked }) => {
                          const assignment = this.state.assignment;
                          const participants = assignment.participants.slice();
                          if (checked) {
                            participants.push(participant.id);
                          } else {
                            participants.splice(
                              participants.indexOf(participant.id),
                              1
                            );
                          }
                          this.setState({
                            assignment: {
                              ...assignment,
                              participants
                            }
                          });
                        }}
                      />
                    ) : null}
                </Card.Content>
                <Card.Content className="c__scenario-content">
                  <Card.Description className="c__participant-completion">
                    <div className="c__participant-status">
                      <Icon className={statusIconClassName} name={statusIcon} />
                      <Text size="medium">{statusText}</Text>{' '}
                      {mustShowCancelRequestButton && cancelables.length ? (
                        <Button
                          compact
                          size="mini"
                          content="Cancel request"
                          onClick={() => {
                            this.setState({
                              cancel: {
                                isOpen: true,
                                ...cancelRequestProps
                              }
                            });
                          }}
                        />
                      ) : null}
                    </div>
                    {!hasCompletedAllScenarios && lastScenarioViewed ? (
                      <Fragment>
                        {!lastEventWasCancelation ? (
                          <p className="c__participant-completion__group">
                            <span className="c__participant-completion__subhed">
                              {completedOrCurrentScenario}
                            </span>
                            {lastScenarioViewed.title}
                          </p>
                        ) : null}
                        {mustShowLastActivityAndSlide ? (
                          <p className="c__participant-completion__group">
                            <span className="c__participant-completion__subhed">
                              Last scenario activity
                            </span>
                            {lastEventDescription}
                          </p>
                        ) : null}
                        {mustShowLastActivityAndSlide && lastSlideViewed ? (
                          <p className="c__participant-completion__group">
                            <span className="c__participant-completion__subhed">
                              Current slide
                            </span>
                            {lastSlideViewed}
                          </p>
                        ) : null}
                      </Fragment>
                    ) : (
                      <p className="c__participant-completion__group">
                        Participant is not presently in a scenario.
                      </p>
                    )}
                    {/*
                    lastUserEvent ? (
                      <p className="c__participant-completion__group">
                        <span className="c__participant-completion__subhed">
                          Last action
                        </span>
                        {upperCaseFirst(lastUserEvent.description)}
                      </p>
                    ) : null
                    */}
                  </Card.Description>
                </Card.Content>
                <Card.Content className="c__scenario-extra">
                  <Button
                    className="c__participant-card__responses"
                    primary
                    size="large"
                    data-testid="view-participant-responses"
                    onClick={onAddTabClick}
                  >
                    View responses
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </div>

        {this.state.assignment.isOpen ? (
          <Modal.Accessible open>
            <Modal
              closeIcon
              open
              aria-modal="true"
              role="dialog"
              size="small"
              onClose={onConfirmAssignmentClose}
            >
              <Header icon="check" content={assignmentParticipantsHeader} />
              <Modal.Content>{assignmentParticipantsExplanation}</Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button
                    primary
                    aria-label="Yes"
                    onClick={() => {
                      this.state.assignment.participants.forEach(id => {
                        const persona = this.state.assignment.persona;
                        const scenario = this.state.assignment.scenario;
                        const user = this.props.cohort.usersById[id];

                        this.props.socket.emit(
                          FACILITATOR_CREATED_MATCH_REQUEST,
                          Payload.compose({
                            cohort,
                            persona,
                            scenario,
                            user
                          })
                        );
                      });

                      onConfirmAssignmentReset();
                    }}
                  >
                    Yes
                  </Button>
                  <Button.Or />
                  <Button aria-label="No" onClick={onConfirmAssignmentClose}>
                    No
                  </Button>
                </Button.Group>
              </Modal.Actions>
              <div data-testid="cohort-confirm-assignment" />
            </Modal>
          </Modal.Accessible>
        ) : null}

        {this.state.cancel.isOpen ? (
          <Modal.Accessible open>
            <Modal
              closeIcon
              open
              aria-modal="true"
              role="dialog"
              size="small"
              onClose={onConfirmCancelPoolClose}
            >
              <Header
                icon="trash alternate outline"
                content={cancelParticipantsPoolHeader}
              />
              <Modal.Content>
                {cancelParticipantsPoolExplanation}

                {!this.state.cancel.participant ? (
                  <Table celled basic="very">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Participant</Table.HeaderCell>
                        <Table.HeaderCell>Scenario</Table.HeaderCell>
                        <Table.HeaderCell>Role</Table.HeaderCell>
                        <Table.HeaderCell>Requested</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {cancelables.map(cancelable => {
                        const {
                          lastAccessedAgo,
                          participant,
                          scenario,
                          persona
                        } = cancelable;
                        return (
                          <Table.Row
                            key={Identity.key({
                              participant,
                              scenario,
                              persona
                            })}
                          >
                            <Table.Cell>
                              <Header as="h4" image>
                                <Username user={participant} />
                              </Header>
                            </Table.Cell>
                            <Table.Cell>{scenario.title}</Table.Cell>
                            <Table.Cell>{persona.name}</Table.Cell>
                            <Table.Cell>{lastAccessedAgo}</Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table>
                ) : null}
              </Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button
                    primary
                    aria-label="Yes"
                    onClick={() => {
                      if (this.state.cancel.participant) {
                        cancelables = [this.state.cancel];
                      }

                      cancelables.forEach(cancelable => {
                        const {
                          persona,
                          scenario,
                          participant: user
                        } = cancelable;
                        this.props.socket.emit(
                          FACILITATOR_CANCELED_MATCH_REQUEST,
                          Payload.compose({
                            cohort,
                            persona,
                            scenario,
                            user
                          })
                        );
                      });

                      onConfirmCancelPoolClose();
                    }}
                  >
                    Yes
                  </Button>
                  <Button.Or />
                  <Button aria-label="No" onClick={onConfirmCancelPoolClose}>
                    No
                  </Button>
                </Button.Group>
              </Modal.Actions>
              <div data-testid="cohort-confirm-cancel" />
            </Modal>
          </Modal.Accessible>
        ) : null}

        {this.state.manage.isOpen ? (
          <CohortParticipants
            id={cohort.id}
            authority={authority}
            onClose={() => {
              this.setState({
                manage: {
                  isOpen: false
                }
              });
            }}
          />
        ) : null}

        <div data-testid="cohort-progress" />
      </Container>
    );
  }
}

CohortProgress.propTypes = {
  authority: PropTypes.object,
  cohort: PropTypes.object,
  getCohort: PropTypes.func,
  getCohortScenarios: PropTypes.func,
  id: PropTypes.any,
  onClick: PropTypes.func,
  scenarios: PropTypes.array,
  scenariosById: PropTypes.object,
  socket: PropTypes.object,
  user: PropTypes.object,
  usersById: PropTypes.object
};

const mapStateToProps = state => {
  const { cohort, cohorts, scenarios, scenariosById, user, usersById } = state;
  return { cohort, cohorts, scenarios, scenariosById, user, usersById };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  getCohortScenarios: id => dispatch(getCohortScenarios(id))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortProgress)
);
