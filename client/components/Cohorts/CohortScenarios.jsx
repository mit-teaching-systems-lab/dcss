import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Container,
  Icon,
  Input,
  Menu,
  Popup,
  Ref,
  Table
} from '@components/UI';
import copy from 'copy-text-to-clipboard';
import escapeRegExp from 'lodash.escaperegexp';
import Moment from '@utils/Moment';
import Username from '@components/User/Username';
import ConfirmAuth from '@components/ConfirmAuth';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import scrollIntoView from '@components/util/scrollIntoView';
import Sortable from '@components/Sortable';
import { getCohort, setCohort } from '@actions/cohort';
import { getScenarios } from '@actions/scenario';
import { getRuns } from '@actions/run';
import { getUsers } from '@actions/users';

import './Cohort.css';

export class CohortScenarios extends React.Component {
  constructor(props) {
    super(props);

    let {
      params: { id }
    } = this.props.match;

    if (!id && this.props.id) {
      id = this.props.id;
    }

    this.state = {
      isReady: false,
      scenarios: [],
      cohort: {
        id
      }
    };
    // This is used as a back up copy of
    // scenarios when the list is filtered
    // by searching.
    this.scenarios = [];
    this.tableBody = React.createRef();
    this.sectionRef = React.createRef();
    this.onScenarioOrderChange = this.onScenarioOrderChange.bind(this);
    this.onScenarioCheckboxClick = this.onScenarioCheckboxClick.bind(this);
    this.onScenarioSearchChange = this.onScenarioSearchChange.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  async componentDidMount() {
    const {
      cohort: { id }
    } = this.state;

    await this.props.getCohort(Number(id));
    await this.props.getScenarios();
    await this.props.getRuns();
    await this.props.getUsers();

    // See note above, re: scenarios list backup
    const scenarios = this.props.scenarios.slice();
    this.scenarios = scenarios.slice();
    this.setState({
      isReady: true,
      scenarios
    });
  }

  scrollIntoView() {
    scrollIntoView(this.tableBody.current.node.firstElementChild);
  }

  onScenarioCheckboxClick(event, { checked, value }) {
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

    this.props.setCohort({
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
    this.props.setCohort({
      ...cohort,
      scenarios
    });
  }

  onScenarioOrderChange(fromIndex, toIndex) {
    this.moveScenario(fromIndex, toIndex);
  }

  onScenarioSearchChange(event, { value }) {
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

  render() {
    const {
      onScenarioOrderChange,
      onScenarioCheckboxClick,
      onScenarioSearchChange
    } = this;
    const { authority, cohort, onClick, runs, user, usersById } = this.props;
    const { isReady, scenarios } = this.state;
    const { isFacilitator, isParticipant } = authority;

    if (!isReady) {
      return <Loading />;
    }

    // This is the list of scenarios that are IN the
    // cohort. The order MUST be preserved.
    const cohortScenarios = cohort.scenarios.map(id =>
      scenarios.find(scenario => scenario.id === id)
    );

    // This is the list of scenarios that are available,
    // but NOT in the cohort. The order is by id, descending
    const reducedScenarios = scenarios.reduce((accum, scenario) => {
      if (!cohort.scenarios.includes(scenario.id)) {
        accum.push(scenario);
      }
      return accum;
    }, []);

    const orderCorrectedScenarios = cohortScenarios;

    if (isFacilitator || user.is_super) {
      orderCorrectedScenarios.push(...reducedScenarios);
    }

    const right = [
      <Menu.Menu key="menu-menu-search-cohort-scenarios" position="right">
        <Menu.Item
          key="menu-item-search-cohort-scenarios"
          name="Search cohort scenarios"
        >
          <Input
            icon="search"
            placeholder="Search..."
            onChange={onScenarioSearchChange}
          />
        </Menu.Item>
        {/*
        <Menu.Item
          onClick={() => this.sectionRef.scrollIntoView()}
        >
            <Icon name="angle double up" />
        </Menu.Item>
        */}
      </Menu.Menu>
    ];

    const editorMenu = (
      <Ref innerRef={node => (this.sectionRef = node)}>
        <EditorMenu
          type="cohort scenarios"
          items={{
            left: [
              <Menu.Item
                key="menu-item-cohort-scenarios"
                name="Scenarios in this Cohort"
                onClick={this.scrollIntoView}
              >
                <Icon.Group className="em__icon-group-margin">
                  <Icon name="newspaper outline" />
                </Icon.Group>
                Scenarios ({cohortScenarios.length})
              </Menu.Item>
            ],
            right: user.is_super || isFacilitator ? right : []
          }}
        />
      </Ref>
    );

    return (
      <Container fluid className="cohort__table-container">
        {editorMenu}
        <Table
          fixed
          striped
          selectable
          role="grid"
          aria-labelledby="header"
          className="cohort__table--constraints"
          unstackable
        >
          <Table.Header className="cohort__table-thead-tbody-tr">
            <Table.Row>
              <ConfirmAuth
                isAuthorized={isFacilitator}
                requiredPermission="edit_scenarios_in_cohort"
              >
                <Table.HeaderCell className="cohort__table-cell-first">
                  <Icon.Group className="em__icon-group-margin">
                    <Icon name="newspaper outline" />
                    <Icon corner="top right" name="add" color="green" />
                  </Icon.Group>
                </Table.HeaderCell>
                <Table.HeaderCell className="cohort__table-cell-options">
                  Tools
                </Table.HeaderCell>
              </ConfirmAuth>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell className="cohort__table-cell-content">
                {isFacilitator ? 'Author' : 'Started'}
              </Table.HeaderCell>
              <Table.HeaderCell className="cohort__table-cell-content">
                {isFacilitator ? 'Description' : 'Completed'}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {scenarios.length ? (
            <Sortable
              isAuthorized={isFacilitator}
              tag="tbody"
              className="cohort__scrolling-tbody"
              onChange={onScenarioOrderChange}
              tableRef={this.tableBody}
              options={{
                direction: 'vertical',
                swapThreshold: 0.5,
                animation: 150
              }}
            >
              {orderCorrectedScenarios.map((scenario, index) => {
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

                const onClickAddTab = (event, data) => {
                  onClick(event, {
                    ...data,
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

                return (
                  <ConfirmAuth
                    key={`confirm-${index}`}
                    requiredPermission={requiredPermission}
                  >
                    <Table.Row
                      key={`row-${index}`}
                      className="cohort__table-thead-tbody-tr"
                      style={{ cursor: 'pointer' }}
                      {...completionStatus}
                    >
                      <ConfirmAuth
                        isAuthorized={isFacilitator}
                        requiredPermission="edit_own_cohorts"
                      >
                        <Table.Cell
                          key={`cell-checkbox-${index}`}
                          className="cohort__table-cell-first"
                        >
                          <Checkbox
                            key={`checkbox-${index}`}
                            value={scenario.id}
                            checked={checked}
                            onClick={onScenarioCheckboxClick}
                          />
                        </Table.Cell>
                      </ConfirmAuth>
                      <ConfirmAuth
                        isAuthorized={isFacilitator}
                        requiredPermission="edit_scenarios_in_cohort"
                      >
                        <Table.Cell className="cohort__table-cell-options">
                          {checked ? (
                            <Button.Group
                              hidden
                              basic
                              size="small"
                              className="cohort__button-group--transparent"
                            >
                              <Popup
                                size="tiny"
                                content="Copy cohort scenario link to clipboard"
                                trigger={
                                  <Button
                                    icon
                                    content={<Icon name="clipboard outline" />}
                                    onClick={() => copy(url)}
                                    {...props}
                                  />
                                }
                              />
                              <Popup
                                size="tiny"
                                content="Run this cohort scenario as a participant"
                                trigger={
                                  <Button
                                    icon
                                    content={<Icon name="play" />}
                                    onClick={() => {
                                      location.href = url;
                                    }}
                                    {...props}
                                  />
                                }
                              />

                              <ConfirmAuth
                                isAuthorized={isFacilitator}
                                requiredPermission="view_all_data"
                              >
                                <Popup
                                  content="View cohort reponses to prompts in this scenario"
                                  trigger={
                                    <Button
                                      icon
                                      content={
                                        <Icon name="file alternate outline" />
                                      }
                                      name={scenario.title}
                                      onClick={onClickAddTab}
                                      {...props}
                                    />
                                  }
                                />
                              </ConfirmAuth>
                              <Popup
                                size="tiny"
                                content="Move scenario up"
                                trigger={
                                  <Button
                                    icon="caret up"
                                    aria-label="Move scenario up"
                                    disabled={index === 0}
                                    onClick={() => {
                                      onScenarioOrderChange(index, index - 1);
                                    }}
                                  />
                                }
                              />
                              <Popup
                                size="tiny"
                                content="Move scenario down"
                                trigger={
                                  <Button
                                    icon="caret down"
                                    aria-label="Move scenario down"
                                    disabled={
                                      index === cohortScenarios.length - 1
                                    }
                                    onClick={() => {
                                      onScenarioOrderChange(index, index + 1);
                                    }}
                                  />
                                }
                              />
                            </Button.Group>
                          ) : null}
                        </Table.Cell>
                      </ConfirmAuth>
                      <Table.Cell.Clickable
                        href={pathname}
                        content={scenario.title}
                      />
                      <Table.Cell className="cohort__table-cell-content">
                        {isFacilitator ? (
                          <Username {...usersById[scenario.author.id]} />
                        ) : (
                          startedAtDisplay
                        )}
                      </Table.Cell>
                      <Table.Cell className="cohort__table-cell-content">
                        {isFacilitator ? scenario.description : endedAtDisplay}
                      </Table.Cell>
                    </Table.Row>
                  </ConfirmAuth>
                );
              })}
            </Sortable>
          ) : (
            <Table.Body className="cohort__scrolling-tbody">
              <Table.Row
                key={`row-empty-results`}
                className="cohort__table-thead-tbody-tr"
              >
                <Table.Cell>No scenarios match your search</Table.Cell>
              </Table.Row>
            </Table.Body>
          )}
        </Table>
      </Container>
    );
  }
}

CohortScenarios.propTypes = {
  authority: PropTypes.object,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    roles: PropTypes.array,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  getCohort: PropTypes.func,
  setCohort: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  id: PropTypes.any,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  onClick: PropTypes.func,
  getScenarios: PropTypes.func,
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
  setCohort: params => dispatch(setCohort(params)),
  getScenarios: () => dispatch(getScenarios()),
  getRuns: () => dispatch(getRuns()),
  getUsers: () => dispatch(getUsers())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortScenarios)
);
