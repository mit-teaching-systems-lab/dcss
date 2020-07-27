import React, { Fragment } from 'react';
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
  Pagination,
  Popup,
  Ref,
  Table
} from '@components/UI';
import copy from 'copy-text-to-clipboard';
import escapeRegExp from 'lodash.escaperegexp';
import { computeItemsRowsPerPage } from '@utils/Layout';
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

import Layout from '@utils/Layout';

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
      activePage: 1,
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
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onOrderChange = this.onOrderChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
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
    const { authority, cohort, onClick, runs, user, usersById } = this.props;
    const { isReady, activePage, scenarios } = this.state;
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

    // Use a slice here to prevent the cohortScenarios reference
    // from being the target of the pushed "reducedScenarios"
    // in the condition following this line.
    const orderCorrectedScenarios = cohortScenarios.slice();

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
            onChange={onSearchChange}
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

    const defaultRowCount = 5;
    // known total height of all ui that is not a table row
    const totalUnavailableHeight = 600;
    const itemsRowHeight = 44;
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
      <Container fluid className="c__table-container">
        {editorMenu}
        <Table
          fixed
          striped
          selectable
          role="grid"
          aria-labelledby="header"
          className="c__table--constraints"
          unstackable
        >
          <Table.Header>
            <Table.Row>
              <ConfirmAuth
                requiredPermission="edit_scenarios_in_cohort"
                isAuthorized={isFacilitator}
              >
                <Table.HeaderCell className="c__table-cell-first">
                  <Icon.Group className="em__icon-group-margin">
                    <Icon name="newspaper outline" />
                    <Icon corner="top right" name="add" color="green" />
                  </Icon.Group>
                </Table.HeaderCell>
                <Table.HeaderCell className="c__table-cell-options">
                  Tools
                </Table.HeaderCell>
              </ConfirmAuth>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell className="c__table-cell-content">
                {isFacilitator ? 'Author' : 'Started'}
              </Table.HeaderCell>
              <Table.HeaderCell className="c__table-cell-content">
                {isFacilitator ? 'Description' : 'Completed'}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {scenarios.length ? (
            <Sortable
              tag="tbody"
              disabled={Layout.isForMobile()}
              isAuthorized={isFacilitator}
              onChange={onOrderChange}
              tableRef={this.tableBody}
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

                const onAddTabClick = (event, data) => {
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
                      style={{ cursor: 'pointer' }}
                      {...completionStatus}
                    >
                      <ConfirmAuth
                        requiredPermission="edit_own_cohorts"
                        isAuthorized={isFacilitator}
                      >
                        <Table.Cell
                          className="c__table-cell-first"
                          key={`cell-checkbox-${index}`}
                        >
                          <Checkbox
                            key={`checkbox-${index}`}
                            value={scenario.id}
                            checked={checked}
                            onClick={onCheckboxClick}
                          />
                        </Table.Cell>
                      </ConfirmAuth>
                      <ConfirmAuth
                        requiredPermission="edit_scenarios_in_cohort"
                        isAuthorized={isFacilitator}
                      >
                        <Table.Cell className="c__table-cell-options">
                          {checked ? (
                            <Button.Group
                              hidden
                              basic
                              size="small"
                              className="c__button-group--transparent"
                            >
                              {Layout.isForMobile() ? null : (
                                <Fragment>
                                  <Popup
                                    size="tiny"
                                    content="Copy cohort scenario link to clipboard"
                                    trigger={
                                      <Button
                                        icon
                                        content={
                                          <Icon name="clipboard outline" />
                                        }
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
                                    requiredPermission="view_all_data"
                                    isAuthorized={isFacilitator}
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
                                          onClick={onAddTabClick}
                                          {...props}
                                        />
                                      }
                                    />
                                  </ConfirmAuth>
                                </Fragment>
                              )}
                              <Popup
                                size="tiny"
                                content="Move scenario up"
                                trigger={
                                  <Button
                                    icon="caret up"
                                    aria-label="Move scenario up"
                                    disabled={index === 0}
                                    onClick={() => {
                                      onOrderChange(index, index - 1);
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
                                      onOrderChange(index, index + 1);
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
                      <Table.Cell className="c__table-cell-content">
                        {isFacilitator ? (
                          <Username {...usersById[scenario.author.id]} />
                        ) : (
                          startedAtDisplay
                        )}
                      </Table.Cell>
                      <Table.Cell className="c__table-cell-content">
                        {isFacilitator ? scenario.description : endedAtDisplay}
                      </Table.Cell>
                    </Table.Row>
                  </ConfirmAuth>
                );
              })}
            </Sortable>
          ) : (
            <Table.Body>
              <Table.Row key={`row-empty-results`}>
                <Table.Cell>No scenarios match your search</Table.Cell>
              </Table.Row>
            </Table.Body>
          )}

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={Layout.isForMobile() ? 3 : 5}>
                <Pagination
                  borderless
                  name="scenarios"
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
        </Table>
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
