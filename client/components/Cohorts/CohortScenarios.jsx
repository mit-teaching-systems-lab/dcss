import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Checkbox,
  Container,
  Icon,
  Input,
  Menu,
  Pagination,
  Ref,
  Text
} from '@components/UI';
import copy from 'copy-text-to-clipboard';
import escapeRegExp from 'lodash.escaperegexp';
import { computeItemsRowsPerPage } from '@utils/Layout';
import Moment from '@utils/Moment';
import Gate from '@components/Gate';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import scrollIntoView from '@utils/scrollIntoView';
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
      activePage: 1,
      scenarios: []
    };
    // This is used as a back up copy of
    // scenarios when the list is filtered
    // by searching.
    this.scenarios = [];
    this.orderedList = React.createRef();
    this.sectionRef = React.createRef();
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onOrderChange = this.onOrderChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  async componentDidMount() {
    await this.props.getCohort(this.props.id);
    await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);
    await this.props.getRuns();

    if (this.props.authority.isFacilitator) {
      await this.props.getUsers();
    }

    // See note above, re: scenarios list backup
    const scenarios = this.props.scenarios.slice();
    this.scenarios = scenarios.slice();
    this.setState({
      isReady: true,
      scenarios
    });
  }

  scrollIntoView() {
    scrollIntoView(this.orderedList.current?.node?.firstElementChild);
  }

  onCheckboxClick(event, { checked, value }) {
    const { cohort } = this.props;
    if (checked) {
      cohort.scenarios.push(value);
      // Move to the top of the list!
      this.scrollIntoView();
    } else {
      cohort.scenarios.splice(cohort.scenarios.indexOf(value), 1);
    }

    // Force deduping
    const scenarios = [...new Set(cohort.scenarios)];

    this.props.setCohortScenarios({
      ...cohort,
      scenarios
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

  onOrderChange(fromIndex, toIndex) {
    this.moveScenario(fromIndex, toIndex);
  }

  onSearchChange(event, { value }) {
    const { scenarios } = this;

    if (value === '') {
      this.setState({
        scenarios
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    const results = scenarios.filter(scenario => {
      if (escapedRegExp.test(scenario.title)) {
        return true;
      }

      if (escapedRegExp.test(scenario.description)) {
        return true;
      }
      return false;
    });

    this.setState({
      scenarios: results
    });
  }

  onPageChange(event, { activePage }) {
    this.setState({
      activePage
    });
  }

  render() {
    const {
      onOrderChange,
      onCheckboxClick,
      onPageChange,
      onSearchChange
    } = this;
    const { authority, cohort, onClick, runs, user } = this.props;
    const { isReady, activePage, scenarios } = this.state;
    const { isFacilitator, isParticipant } = authority;

    if (!isReady) {
      return <Loading />;
    }

    // This is the list of scenarios that are IN the
    // cohort. The order MUST be preserved.
    const cohortScenarios = cohort.scenarios.map(id =>
      this.props.scenarios.find(scenario => scenario.id === id)
    );

    // This is the list of scenarios that are available,
    // but NOT in the cohort. The order is by id, descending
    const reducedScenarios = scenarios.reduce((accum, scenario) => {
      if (
        !cohort.scenarios.includes(scenario.id) &&
        scenario.status === SCENARIO_IS_PUBLIC
      ) {
        accum.push(scenario);
      }
      return accum;
    }, []);

    // Use a slice here to prevent the cohortScenarios reference
    // from being the target of the pushed "reducedScenarios"
    // in the condition following this line.
    const orderCorrectedScenarios = cohortScenarios.slice();

    if (isFacilitator || user.is_super) {
      orderCorrectedScenarios.push(...reducedScenarios);
    }

    const right = [
      <Menu.Menu key="menu-menu-search-cohort-scenarios" position="right">
        <Menu.Item.Tabbable
          key="menu-item-search-cohort-scenarios"
          name="Search cohort scenarios"
        >
          <Input
            icon="search"
            placeholder="Search..."
            onChange={onSearchChange}
          />
        </Menu.Item.Tabbable>
      </Menu.Menu>
    ];

    const scenariosLength = cohortScenarios.length;

    const scenariosInCohortHeader = isFacilitator ? (
      <p className="c__scenario-header-num">
        <span>{scenariosLength}</span>{' '}
        {scenariosLength === 1 ? 'scenario' : 'scenarios'} selected
      </p>
    ) : (
      <p className="c__scenario-header-num">
        <span>{cohort.name}</span> includes <span>{scenariosLength}</span>{' '}
        {scenariosLength === 1 ? 'scenario' : 'scenarios'}
      </p>
    );

    const editorMenu = (
      <Ref innerRef={node => (this.sectionRef = node)}>
        <EditorMenu
          type="cohort scenarios"
          items={{
            left: [scenariosInCohortHeader],
            right: user.is_super || isFacilitator ? right : []
          }}
        />
      </Ref>
    );

    const defaultRowCount = 5;
    // known total height of all ui that is not a table row
    const totalUnavailableHeight = 600;
    const itemsRowHeight = 180;
    const itemsPerRow = 1;

    const { rowsPerPage } = computeItemsRowsPerPage({
      defaultRowCount,
      totalUnavailableHeight,
      itemsPerRow,
      itemsRowHeight
    });

    const scenariosPages = Math.ceil(
      orderCorrectedScenarios.length / rowsPerPage
    );
    const scenariosIndex = (activePage - 1) * rowsPerPage;
    const scenariosSlice = orderCorrectedScenarios.slice(
      scenariosIndex,
      scenariosIndex + rowsPerPage
    );

    return (
      <Container
        fluid
        className="c__scenario-container"
        aria-labelledby="header"
      >
        {scenariosInCohortHeader}

        {scenarios.length ? (
          <Sortable
            className="c__scenario-list"
            tag="ol"
            disabled={Layout.isForMobile()}
            isAuthorized={isFacilitator}
            onChange={onOrderChange}
            tableRef={this.orderedList}
            options={{
              direction: 'vertical',
              swapThreshold: 0.5,
              animation: 150
            }}
          >
            {scenariosSlice.map((scenario, index) => {
              if (!scenario) {
                return null;
              }
              const checked = cohort.scenarios.includes(scenario.id);
              const disabled = true;
              const props = !checked ? { disabled } : {};

              // TODO: check localstorage for more appropriate slide number to begin at
              const pathname = `/cohort/${cohort.id}/run/${scenario.id}/slide/0`;
              const url = `${location.origin}${pathname}`;

              const requiredPermission = checked
                ? 'view_scenarios_in_cohort'
                : 'edit_scenarios_in_cohort';

              const onAddTabClick = event => {
                onClick(event, {
                  type: 'scenario',
                  source: scenario
                });
              };

              const run =
                runs.find(run => run.scenario_id === scenario.id) || {};

              const { run_created_at = null, run_ended_at = null } = run;

              const createdStatus = run_created_at
                ? { warning: true }
                : { negative: true };

              const completeOrIncomplete = isParticipant
                ? run_ended_at
                  ? { positive: true }
                  : createdStatus
                : {};

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

              const completionStatus = !isFacilitator
                ? completeOrIncomplete
                : {};

              const scenarioCursor = isFacilitator
                ? { cursor: 'move' }
                : { cursor: 'auto' };

              return (
                <Gate
                  key={`confirm-${index}`}
                  requiredPermission={requiredPermission}
                >
                  <Card
                    className="c__scenario-card"
                    as="li"
                    key={`row-${index}`}
                    style={scenarioCursor}
                  >
                    <Gate
                      requiredPermission="edit_own_cohorts"
                      isAuthorized={isFacilitator}
                    >
                      <div
                        className="c__table-cell-first"
                        key={`cell-checkbox-${index}`}
                      >
                        <Checkbox
                          aria-label={
                            checked ? `Remove scenario` : `Add scenario`
                          }
                          key={`checkbox-${index}`}
                          value={scenario.id}
                          checked={checked}
                          onClick={onCheckboxClick}
                        />
                      </div>
                    </Gate>
                    <Card.Content>
                      <Card.Header as="a" href={pathname}>
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
                        {checked ? (
                          <Gate
                            requiredPermission="view_all_data"
                            isAuthorized={isFacilitator}
                          >
                            <Button
                              basic
                              size="tiny"
                              color="blue"
                              icon
                              labelPosition="left"
                              data-testid="run-cohort-as-participant"
                              onClick={() => {
                                location.href = url;
                              }}
                              {...props}
                            >
                              <Icon name="play" />
                              Run scenario as a participant
                            </Button>
                            <Button
                              basic
                              size="tiny"
                              color="blue"
                              data-testid="copy-cohort-scenario-link"
                              onClick={() => copy(url)}
                              {...props}
                            >
                              <Icon name="clipboard outline" />
                              Copy scenario link to clipboard
                            </Button>
                          </Gate>
                        ) : null}
                      </Card.Meta>
                    </Card.Content>
                    <div className="c__scenario-extra">
                      {checked ? (
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
                            {...props}
                          >
                            View cohort reponses
                          </Button>
                        </Gate>
                      ) : null}
                    </div>
                  </Card>
                </Gate>
              );
            })}
          </Sortable>
        ) : (
          <p key="row-empty-results">No scenarios match your search</p>
        )}

        <Gate isAuthorized={isFacilitator}>
          <Pagination
            borderless
            name="scenarios"
            size="mini"
            activePage={activePage}
            siblingRange={1}
            boundaryRange={0}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            onPageChange={onPageChange}
            totalPages={scenariosPages}
          />
        </Gate>
      </Container>
    );
  }
}

/*
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={7}>
                <Pagination
                  borderless
                  name="scenarios"
                  size="mini"
                  activePage={activePage}
                  siblingRange={1}
                  boundaryRange={0}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  onPageChange={onPageChange}
                  totalPages={scenariosPages}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
 */

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
