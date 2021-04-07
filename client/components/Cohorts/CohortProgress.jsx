import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash.escaperegexp';
import pluralize from 'pluralize';
import { upperCaseFirst } from 'change-case';
import {
  Button,
  Card,
  Container,
  Grid,
  Icon,
  Input,
  Text
} from '@components/UI';
import { getCohort } from '@actions/cohort';
import CohortParticipants from '@components/Cohorts/CohortParticipants';
import Loading from '@components/Loading';
import Username from '@components/User/Username';
import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import Storage from '@utils/Storage';

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
    await this.props.getCohort(this.props.id);

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

  async componentWillUnmount() {
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
      <p className="c__scenario-header-num">
        <span>
          {completedCount}&#47;{sourceParticipants.length}
        </span>{' '}
        {pluralize('participant', sourceParticipants.length)} have completed all
        scenarios
      </p>
    );

    const searchInputAriaLabel = 'Search participants';
    const manageButtonAriaLabel = 'Manage participants';

    const searchParticipantsInCohort = (
      <Input
        aria-label={searchInputAriaLabel}
        label={searchInputAriaLabel}
        className="grid__menu-search"
        icon="search"
        size="big"
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

    return (
      <Container fluid className="c__scenario-container">
        <Grid stackable className="c__scenario-participant-header" columns={2}>
          <Grid.Column width={6}>
            {usersInCohortHeader}
            {manageParticipantsButton}
          </Grid.Column>
          <Grid.Column className="c__scenario-search-participants" width={10}>
            {searchParticipantsInCohort}
          </Grid.Column>
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

            const isComplete = completedCount === cohort.scenarios.length;

            let lastAccessedAt = null;
            let lastAccessedAgo = null;
            let lastScenarioViewed = null;
            let lastUrlVisited = null;
            let lastEventDescription = null;
            let lastEventWasCancelation = null;
            let lastSlideViewed = null;
            let statusText = isComplete ? 'Complete' : 'In progress';
            let statusIcon = isComplete ? 'check' : 'circle';
            let statusIconClassName = isComplete
              ? 'c__progress-green'
              : 'c__progress-purple';

            if (!eventsCount) {
              statusIcon = 'warning sign';
              statusText = 'Not started';
              statusIconClassName = 'c__progress-red';
            } else {
              const lastEvent = eventsValues[eventsValues.length - 1];

              lastAccessedAt = lastEvent.created_at
                ? new Date(Number(lastEvent.created_at)).toISOString()
                : null;

              lastAccessedAgo = lastAccessedAt
                ? Moment(lastAccessedAt).fromNow()
                : null;

              lastScenarioViewed = this.props.scenariosById[
                lastEvent.scenario_id
              ];

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
                }
              }
            }

            //             statusIcon = 'wait';
            // statusText = 'Not started';

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

            return (
              <Card
                className="c__participant-card"
                key={Identity.key(participant)}
              >
                <Card.Content>
                  <Card.Header>
                    <Username user={participant} />
                  </Card.Header>
                  {lastAccessedDisplay}
                </Card.Content>
                <Card.Content>
                  <Card.Description className="c__participant-completion">
                    <div className="c__participant-status">
                      <Icon className={statusIconClassName} name={statusIcon} />
                      <Text size="medium">{statusText}</Text>
                    </div>
                    {!isComplete && lastScenarioViewed ? (
                      <Fragment>
                        {!lastEventWasCancelation ? (
                          <p className="c__participant-completion__group">
                            <span className="c__participant-completion__subhed">
                              Current scenario
                            </span>
                            {lastScenarioViewed.title}
                          </p>
                        ) : null}
                        <p className="c__participant-completion__group">
                          <span className="c__participant-completion__subhed">
                            Last activity
                          </span>
                          {lastEventDescription}
                        </p>
                        {lastSlideViewed ? (
                          <p className="c__participant-completion__group">
                            <span className="c__participant-completion__subhed">
                              Current slide
                            </span>
                            {lastSlideViewed}
                          </p>
                        ) : null}
                      </Fragment>
                    ) : null}
                    <p className="c__participant-completion__scenarios-completed">
                      <span>
                        {completedCount}&#47;{cohortScenarios.length}{' '}
                      </span>
                      {pluralize('scenario', cohortScenarios.length)} completed
                    </p>
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
  id: PropTypes.any,
  onClick: PropTypes.func,
  scenariosById: PropTypes.object,
  user: PropTypes.object,
  usersById: PropTypes.object
};

const mapStateToProps = state => {
  const { cohort, cohorts, scenariosById, user, usersById } = state;
  return { cohort, cohorts, scenariosById, user, usersById };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CohortProgress);
