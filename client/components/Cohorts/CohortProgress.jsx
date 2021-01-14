import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import copy from 'copy-text-to-clipboard';
import escapeRegExp from 'lodash.escaperegexp';
import pluralize from 'pluralize';
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
import { notify } from '@components/Notification';
import Loading from '@components/Loading';
import Username from '@components/User/Username';
import Layout from '@utils/Layout';
import Moment from '@utils/Moment';
import Storage from '@utils/Storage';

import './Cohort.css';

export class CohortProgress extends React.Component {
  constructor(props) {
    super(props);

    this.sessionKey = `cohort-progress/${this.props.id}`;
    let persisted = Storage.get(this.sessionKey);

    /* istanbul ignore else */
    if (!persisted) {
      persisted = { refresh: true };
      Storage.set(this.sessionKey, persisted);
    }

    const { refresh } = persisted;

    this.state = {
      isReady: false,
      manageIsOpen: false,
      refresh,
      search: '',
      participants: []
    };

    this.refreshInterval = null;
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

  progressRefresh() {
    this.refreshInterval = setInterval(async () => {
      /* istanbul ignore else */
      if (!this.state.search) {
        await this.fetchCohort();
      }
    }, 10000);
  }

  async componentDidMount() {
    await this.fetchCohort();

    /* istanbul ignore if */
    if (this.state.refresh) {
      // TODO: allow updating to paused.
      this.progressRefresh();
    }
  }

  async componentWillUnmount() {
    clearInterval(this.refreshInterval);
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
  onProgressRefreshChange() {
    let refresh = !this.state.refresh;
    this.setState({ refresh }, () => {
      if (!refresh) {
        clearInterval(this.refreshInterval);
      } else {
        this.progressRefresh();
      }
      Storage.set(this.sessionKey, this.state);
    });
  }

  render() {
    const { onParticipantSearchChange } = this;
    const { authority, cohort, onClick } = this.props;
    const { isReady } = this.state;
    const { isFacilitator /*, isParticipant */ } = authority;

    if (!isReady) {
      return <Loading />;
    }

    const cohortScenarios = this.props.cohort.scenarios;
    const completedCount = cohort.users.reduce((accum, user) => {
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

    const sourceParticipants = this.state.participants.length
      ? this.state.participants
      : this.props.cohort.users;

    const usersInCohortHeader = (
      <p className="c__scenario-header-num">
        <span>
          {completedCount}/{sourceParticipants.length}
        </span>{' '}
        {pluralize('participant', sourceParticipants.length)} have completed all
        scenarios
      </p>
    );

    const searchInputAriaLabel = 'Search participants';
    const manageButtonAriaLabel = 'Manage participants';

    const searchParticipantsInCohort = (
      <Fragment>
        <Input
          aria-label={searchInputAriaLabel}
          label={searchInputAriaLabel}
          className="grid__menu-search"
          icon="search"
          size="big"
          onChange={onParticipantSearchChange}
        />

        <Button
          primary
          aria-label={manageButtonAriaLabel}
          onClick={() => {
            this.setState({
              manageIsOpen: true
            });
          }}
        >
          {manageButtonAriaLabel}
        </Button>
      </Fragment>
    );

    return (
      <Container fluid className="c__scenario-container">
        <Grid stackable columns={2} className="c__scenario-participant-header">
          <Grid.Column width={6}>{usersInCohortHeader}</Grid.Column>

          <Grid.Column width={10} className="c__scenario-search-participants">
            {searchParticipantsInCohort}
          </Grid.Column>
        </Grid>

        <div className="c__participant-list">
          {sourceParticipants.map((participant, index) => {
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
            let lastSlideViewed = null;

            let statusText = isComplete ? 'Complete' : 'In progress';

            let statusIcon = isComplete ? 'check' : 'circle';

            if (!eventsCount) {
              statusIcon = 'wait';
              statusText = 'Not started';
            } else {
              const lastEvent = eventsValues[eventsValues.length - 1];
              lastAccessedAt = new Date(
                Number(lastEvent.created_at)
              ).toISOString();
              lastAccessedAgo = Moment(lastAccessedAt).fromNow();
              lastScenarioViewed = this.props.scenariosById[
                lastEvent.scenario_id
              ];
              lastUrlVisited = lastEvent.url;
              lastSlideViewed = lastUrlVisited.slice(
                lastUrlVisited.indexOf('/slide') + 7
              );
            }

            const lastAccessedDisplay = lastAccessedAt ? (
              <Text>
                Last accessed
                <br />
                <time dateTime={lastAccessedAt}>{lastAccessedAgo}</time>
              </Text>
            ) : null;

            const onAddTabClick = (event, data) => {
              onClick(event, {
                ...data,
                type: 'participant',
                source: participant
              });
            };

            return (
              <Card className="c__participant-card" key={`row-${index}`}>
                <Card.Content>
                  <Card.Header>
                    <Username {...participant} />
                  </Card.Header>
                  {lastAccessedDisplay}
                </Card.Content>
                <Card.Content>
                  <Card.Description>
                    <div>
                      <Icon className="primary" name={statusIcon} />
                      <Text size="large">{statusText}</Text>
                    </div>
                    {!isComplete && lastScenarioViewed ? (
                      <Fragment>
                        <div>
                          <Text>{lastScenarioViewed.title}</Text>
                        </div>
                        <div>
                          <Text>Slide {lastSlideViewed}</Text>
                        </div>
                      </Fragment>
                    ) : null}
                    <div>
                      <Text size="small">
                        {completedCount}/{cohortScenarios.length}{' '}
                        {pluralize('scenario', cohortScenarios.length)}{' '}
                        completed
                      </Text>
                    </div>
                  </Card.Description>
                </Card.Content>
                <Card.Content>
                  <Button
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

        {this.state.manageIsOpen ? (
          <CohortParticipants
            id={cohort.id}
            authority={authority}
            onClose={() => {
              this.setState({
                manageIsOpen: false
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

const mapStateToProps = (state, ownProps) => {
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
