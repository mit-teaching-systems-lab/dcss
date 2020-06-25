import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Message, Pagination, Popup, Tab, Table } from '@components/UI';
import Moment from '@utils/Moment';
import { getUserRuns } from '@actions/run';
import { getCohorts } from '@actions/cohort';
import { getScenarios } from '@actions/scenario';
import { getUser } from '@actions/user';
import Loading from '@components/Loading';
import DataTable from '@components/Cohorts/DataTable';

import './History.css';

const ROWS_PER_PAGE = 10;

class History extends Component {
  constructor(props) {
    super(props);

    const panes = [
      {
        menuItem: 'History',
        pane: {
          key: 'main-scenarios',
          content: null
        }
      }
    ];
    this.state = {
      isReady: false,
      activeIndex: 0,
      activePage: 1,
      source: {
        runId: null,
        participantId: null
      },
      panes
    };
    this.tableRef = null;
    this.onRunDataClick = this.onRunDataClick.bind(this);
    this.onDataTableMenuClick = this.onDataTableMenuClick.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      await this.props.getCohorts();
      await this.props.getUserRuns();
      await this.props.getScenarios();

      const { source } = this.state;

      this.setState({
        ...this.state,
        isReady: true,
        source: {
          ...source,
          participantId: this.props.user.id
        }
      });
    }
  }

  onPageChange(event, { activePage }) {
    this.setState({
      ...this.state,
      activePage
    });
  }

  onRunDataClick(event, props) {
    const {
      menuItem,
      run: { run_id: runId }
    } = props;

    const { panes } = this.state;
    const activeIndex = panes.findIndex(
      ({ pane }) => pane.key === `tab-${runId}`
    );

    if (activeIndex > -1) {
      this.setState({ activeIndex });
    } else {
      panes.push({
        menuItem,
        pane: {
          key: `tab-${runId}`,
          content: null
        },
        source: {
          participantId: this.props.user.id,
          runId
        }
      });
      this.setState({ panes });
    }
  }

  onDataTableMenuClick(event, { name, key }) {
    const { panes } = this.state;

    if (name === 'close') {
      const indexOf = panes.findIndex(({ pane }) => pane.key === key);
      const activeIndex = indexOf - 1;
      panes.splice(indexOf, 1);
      this.setState({ activeIndex, panes });
    }
  }

  onTabChange(event, { activeIndex }) {
    this.setState({
      activeIndex
    });
  }

  render() {
    const {
      onDataTableMenuClick,
      onPageChange,
      onRunDataClick,
      onTabChange
    } = this;
    const { cohorts, runs } = this.props;
    const { isReady, activeIndex, activePage, panes } = this.state;

    const runsPages = Math.ceil(runs.length / ROWS_PER_PAGE);
    const runsIndex = (activePage - 1) * ROWS_PER_PAGE;
    const runsSlice = runs.slice(runsIndex, runsIndex + ROWS_PER_PAGE);

    panes[0].pane.content = !isReady ? (
      <Loading />
    ) : (
      <Fragment>
        {!runsSlice.length ? (
          <Message content="No history recorded yet!" />
        ) : (
          <Table
            fixed
            striped
            selectable
            unstackable
            role="grid"
            aria-labelledby="header"
            className="ms__table--constraints"
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ width: '40px' }}></Table.HeaderCell>
                <Table.HeaderCell>Scenario</Table.HeaderCell>
                <Table.HeaderCell className="ms__hidden-on-mobile ms__table-cell-content">
                  Started
                </Table.HeaderCell>
                <Table.HeaderCell className="ms__hidden-on-mobile ms__table-cell-content">
                  Completed
                </Table.HeaderCell>
                <Table.HeaderCell className="ms__hidden-on-mobile ms__table-cell-content">
                  Cohort
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {runsSlice.map(run => {
                const {
                  run_id,
                  run_created_at,
                  run_ended_at,
                  scenario_id,
                  scenario_title,
                  cohort_id
                } = run;
                const completeOrIncomplete = run_ended_at
                  ? { positive: true }
                  : { negative: true };

                const createdAt = Moment(run_created_at).fromNow();
                const createdAtAlt = Moment(run_created_at).calendar();

                const endedAt = run_ended_at
                  ? Moment(run_ended_at).fromNow()
                  : '';
                const endedAtAlt = run_ended_at
                  ? Moment(run_ended_at).calendar()
                  : 'This run is not complete';

                const startedAtDisplay = `${createdAt} (${createdAtAlt})`;
                const endedAtDisplay = `${endedAt} (${endedAtAlt})`;

                const pathname = cohort_id
                  ? `/cohort/${cohort_id}/run/${scenario_id}/slide/0`
                  : `/run/${scenario_id}/slide/0`;

                const cohort = cohorts.find(({ id }) => id === cohort_id);

                const cohortPathname = cohort ? `/cohort/${cohort_id}` : null;

                const cohortDisplay = cohort ? cohort.name : null;

                const onViewRunDataClick = (event, props) => {
                  onRunDataClick(event, {
                    ...props,
                    run,
                    menuItem: `${scenario_title} (${endedAtAlt})`
                  });
                };

                return (
                  <Table.Row {...completeOrIncomplete} key={run_id}>
                    <Popup
                      content="View your data for this scenario run"
                      trigger={
                        <Table.Cell.Clickable
                          className="ms__table-cell-first"
                          content={<Icon name="file alternate outline" />}
                          onClick={onViewRunDataClick}
                        />
                      }
                    />
                    <Table.Cell.Clickable
                      href={pathname}
                      content={scenario_title}
                      className="ms__table-cell-options"
                    />
                    <Table.Cell
                      alt={endedAtAlt}
                      className="ms__hidden-on-mobile"
                    >
                      {startedAtDisplay}
                    </Table.Cell>
                    <Table.Cell
                      alt={endedAtAlt}
                      className="ms__hidden-on-mobile"
                    >
                      {endedAtDisplay}
                    </Table.Cell>
                    <Table.Cell.Clickable
                      className="ms__hidden-on-mobile"
                      href={cohortPathname}
                      content={cohortDisplay}
                    />
                  </Table.Row>
                );
              })}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5">
                  {runsPages > 1 ? (
                    <Pagination
                      name="runs"
                      siblingRange={1}
                      boundaryRange={0}
                      ellipsisItem={null}
                      firstItem={null}
                      lastItem={null}
                      activePage={activePage}
                      onPageChange={onPageChange}
                      totalPages={runsPages}
                    />
                  ) : null}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        )}
      </Fragment>
    );

    panes.forEach(({ pane, source }, index) => {
      // Skip the first one...
      if (!index) {
        return;
      }
      const key = `tab-${source.runId}`;
      pane.content = (
        <DataTable
          key={`datatable-${source.runId}`}
          source={source}
          leftColVisible={false}
          onClick={() => onDataTableMenuClick({}, { name: 'close', key })}
        />
      );
    });

    return (
      <Tab
        activeIndex={activeIndex}
        onTabChange={onTabChange}
        panes={panes}
        renderActiveOnly={false}
      />
    );
  }
}

History.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  runs: PropTypes.array,
  cohorts: PropTypes.array,
  scenarios: PropTypes.array,
  getCohorts: PropTypes.func,
  getUserRuns: PropTypes.func,
  getScenarios: PropTypes.func,
  onClick: PropTypes.func,
  getUser: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { cohorts, runs, scenarios, user } = state;
  return { runs, cohorts, scenarios, user };
};

const mapDispatchToProps = dispatch => ({
  getCohorts: () => dispatch(getCohorts()),
  getUserRuns: () => dispatch(getUserRuns()),
  getScenarios: () => dispatch(getScenarios()),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(History)
);
