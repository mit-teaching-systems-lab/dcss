import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, Container, Icon, Text } from '@components/UI';
import { notify } from '@components/Notification';
import copy from 'copy-text-to-clipboard';
import pluralize from 'pluralize';
import Moment from '@utils/Moment';
import CohortScenariosSelector from '@components/Cohorts/CohortScenariosSelector';
import Gate from '@components/Gate';
import Loading from '@components/Loading';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import Sortable from '@components/Sortable';
import { getCohort, setCohortScenarios } from '@actions/cohort';
import { getScenariosByStatus } from '@actions/scenario';
import { getRuns } from '@actions/run';
import { getUsers } from '@actions/users';

import './Cohort.css';

import Layout from '@utils/Layout';

export class CohortScenarios extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      editIsOpen: false,
      visibleCount: 4
    };
    this.onEditScenariosClick = this.onEditScenariosClick.bind(this);
    this.onSortableChange = this.onSortableChange.bind(this);
    this.onSortableScroll = this.onSortableScroll.bind(this);
  }

  async componentDidMount() {
    await this.props.getCohort(this.props.id);
    await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);
    await this.props.getRuns();

    if (this.props.authority.isFacilitator) {
      await this.props.getUsers();
    }

    this.setState({
      isReady: true
    });
  }

  async moveScenario(fromIndex, toIndex) {
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

  onSortableChange(fromIndex, toIndex) {
    this.moveScenario(fromIndex, toIndex);
  }

  onSortableScroll() {
    if (this.state.visibleCount < this.props.cohort.scenarios.length) {
      this.setState({
        visibleCount: this.props.cohort.scenarios.length
      });
    }
  }

  onEditScenariosClick() {
    this.setState({
      editIsOpen: !this.state.editIsOpen
    });
  }

  render() {
    const {
      onEditScenariosClick,
      onSortableChange /*, onSortableScroll */
    } = this;
    const { authority, cohort, onClick, runs } = this.props;
    const { isReady } = this.state;
    const { isFacilitator /*, isParticipant */ } = authority;

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

    return (
      <Container
        fluid
        className="c__scenario-container"
        aria-labelledby="header"
      >
        {scenariosInCohortHeader}

        {cohortScenarios.length ? (
          <Sortable
            className="c__scenario-list"
            disabled={Layout.isForMobile()}
            isAuthorized={isFacilitator}
            onChange={onSortableChange}
            options={{
              direction: 'vertical',
              swapThreshold: 0.5,
              animation: 150
            }}
          >
            {cohortScenarios.map((scenario, index) => {
              if (!scenario) {
                return null;
              }

              // TODO: check localstorage for more appropriate slide number to begin at
              const pathname = `/cohort/${cohort.id}/run/${scenario.id}/slide/0`;
              const url = `${location.origin}${pathname}`;

              const onAddTabClick = event => {
                onClick(event, {
                  type: 'scenario',
                  source: scenario
                });
              };

              const run =
                runs.find(run => run.scenario_id === scenario.id) || {};

              const { run_created_at = null, run_ended_at = null } = run;

              // const createdStatus = run_created_at
              //   ? { warning: true }
              //   : { negative: true };

              // const completeOrIncomplete = isParticipant
              //   ? run_ended_at
              //     ? { positive: true }
              //     : createdStatus
              //   : {};

              const createdAt = run_created_at
                ? Moment(run_created_at).fromNow()
                : '';

              const createdAtAlt = run_created_at
                ? Moment(run_created_at).calendar()
                : '';

              const endedAt = run_ended_at
                ? Moment(run_ended_at).fromNow()
                : '';

              const endedAtAlt = run_ended_at
                ? Moment(run_ended_at).calendar()
                : 'This scenario is not complete';

              const startedAtDisplay = run_created_at
                ? `${createdAt} (${createdAtAlt})`.trim()
                : 'This scenario has not been started';

              const endedAtCreatedAtAlt = run_created_at ? endedAtAlt : '';
              const endedAtDisplay = run_ended_at
                ? `${endedAt} (${endedAtAlt})`.trim()
                : endedAtCreatedAtAlt;

              // const completionStatus = !isFacilitator
              //   ? completeOrIncomplete
              //   : {};

              const scenarioCursor = isFacilitator
                ? { cursor: 'move' }
                : { cursor: 'auto' };

              const onCohortScenarioUrlCopyClick = () => {
                copy(url);
                notify({
                  message: `Copied: ${url}`
                });
              };

              const cardHeaderProps = !isFacilitator
                ? { as: 'a', href: pathname }
                : {};

              return (
                <Gate
                  requiredPermission="view_scenarios_in_cohort"
                  key={`confirm-${index}`}
                >
                  <Card
                    className="c__scenario-card"
                    key={`row-${index}`}
                    style={scenarioCursor}
                  >
                    <Card.Content>
                      <Card.Header {...cardHeaderProps}>
                        {scenario.title}
                      </Card.Header>
                      <Card.Description>
                        <Text.Truncate lines={2}>
                          {isFacilitator
                            ? scenario.description
                            : endedAtDisplay}
                        </Text.Truncate>
                      </Card.Description>
                      <Card.Meta>
                        {isFacilitator ? null : startedAtDisplay}
                        <Gate
                          requiredPermission="view_all_data"
                          isAuthorized={isFacilitator}
                        >
                          <Button
                            primary
                            size="tiny"
                            icon
                            labelPosition="left"
                            data-testid="run-cohort-as-participant"
                            onClick={() => {
                              location.href = url;
                            }}
                          >
                            <Icon name="play" />
                            Run scenario as a participant
                          </Button>
                          <Button
                            primary
                            size="tiny"
                            data-testid="copy-cohort-scenario-link"
                            onClick={onCohortScenarioUrlCopyClick}
                          >
                            <Icon name="clipboard outline" />
                            Copy scenario link to clipboard
                          </Button>
                        </Gate>
                      </Card.Meta>
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
                          View cohort reponses
                        </Button>
                      </Gate>
                    </div>
                  </Card>
                </Gate>
              );
            })}
          </Sortable>
        ) : (
          <p key="row-empty-results">
            There are no scenarios selected for this cohort.
          </p>
        )}

        {this.state.editIsOpen ? (
          <CohortScenariosSelector
            id={cohort.id}
            onClose={() => {
              this.setState({ editIsOpen: false });
            }}
          />
        ) : null}
      </Container>
    );
  }
}

CohortScenarios.propTypes = {
  authority: PropTypes.object,
  id: PropTypes.any,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    roles: PropTypes.array,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  getCohort: PropTypes.func,
  setCohortScenarios: PropTypes.func,
  onClick: PropTypes.func,
  getScenariosByStatus: PropTypes.func,
  scenarios: PropTypes.array,
  getRuns: PropTypes.func,
  runs: PropTypes.array,
  user: PropTypes.object,
  getUsers: PropTypes.func,
  usersById: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { cohort, cohorts, user, usersById } = state;
  const scenarios = state.scenarios.filter(
    ({ deleted_at, status }) => deleted_at === null && status !== 1
  );
  const runs = state.runs.filter(run => run.cohort_id === ownProps.id);
  return { cohort, cohorts, scenarios, runs, user, usersById };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  setCohortScenarios: params => dispatch(setCohortScenarios(params)),
  getScenariosByStatus: status => dispatch(getScenariosByStatus(status)),
  getRuns: () => dispatch(getRuns()),
  getUsers: () => dispatch(getUsers())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CohortScenarios);
