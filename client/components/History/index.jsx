import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Message, Pagination, Popup, Tab, Table } from '@components/UI';
import Moment from '@utils/Moment';
import { getRuns } from '@actions/run';
import { getCohorts } from '@actions/cohort';
import { getScenarios } from '@actions/scenario';
import { getUser } from '@actions/user';
import Loading from '@components/Loading';
import DataTable from '@components/Cohorts/DataTable';

import './History.css';

import Layout from '@utils/Layout';
const ROWS_PER_PAGE = 10;

class History extends Component {
  constructor(props) {
    super(props);

    const panes = [
      {
        menuItem: 'History',
        pane: {
          key: 'main-history',
          content: null
        }
      }
    ];
    this.state = {
      isReady: false,
      activeIndex: 0,
      activePage: 1,
      sources: [],
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
      await this.props.getScenarios();
      await this.props.getRuns();

      this.setState({
        isReady: true
      });
    }
  }

  onPageChange(event, { activePage }) {
    this.setState({
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
      const index = panes.findIndex(pane => pane.menuItem === menuItem);
      const source = {
        participantId: this.props.user.id,
        runId
      };

      if (index !== -1) {
        if (!panes[index].sources.find(source => source.runId === runId)) {
          panes[index].sources.push(source);
        }
      } else {
        panes.push({
          menuItem,
          pane: {
            key: `tab-${runId}`,
            content: null
          },
          sources: [source]
        });
      }

      this.setState({ activeIndex: panes.length - 1, panes });
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
    const { onPageChange, onRunDataClick, onTabChange } = this;
    const { cohortsById, runs } = this.props;
    const { isReady, activeIndex, activePage, panes } = this.state;

    const runsPages = Math.ceil(runs.length / ROWS_PER_PAGE);
    const runsIndex = (activePage - 1) * ROWS_PER_PAGE;
    const runsSlice = runs.slice(runsIndex, runsIndex + ROWS_PER_PAGE);

    const pagination =
      runsPages > 1 ? (
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="5">
              <Pagination
                borderless
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
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      ) : null;

    panes[0].pane.content = !isReady ? (
      <Loading />
    ) : (
      <Fragment>
        {!runsSlice.length ? (
          <Message content="No history recorded yet!" />
        ) : (
          <Table
            striped
            selectable
            unstackable
            role="grid"
            aria-labelledby="header"
            className="h__table--constraints"
          >
            {Layout.isForMobile() ? pagination : null}

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ width: '40px' }}></Table.HeaderCell>
                <Table.HeaderCell className="h__col-medium">
                  Cohort name
                </Table.HeaderCell>
                <Table.HeaderCell className="h__col-medium">
                  Scenario title
                </Table.HeaderCell>
                {Layout.isNotForMobile() ? (
                  <Table.HeaderCell className="h__col-small">
                    Started
                  </Table.HeaderCell>
                ) : null}
                <Table.HeaderCell className="h__col-small">
                  Completed
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

                const createdAt = (
                  <span>{Moment(run_created_at).fromNow()}</span>
                );
                const createdAtAlt = Moment(run_created_at).calendar();

                const endedAt = run_ended_at ? (
                  <span>{Moment(run_ended_at).fromNow()}</span>
                ) : (
                  ''
                );

                const endedAtAlt = run_ended_at
                  ? Moment(run_ended_at).calendar()
                  : 'This run is not complete';

                const createdAtWithPopup = (
                  <Popup
                    size="tiny"
                    content={createdAtAlt}
                    trigger={createdAt}
                  />
                );

                const endedAtWithPopup = (
                  <Popup size="tiny" content={endedAtAlt} trigger={endedAt} />
                );

                const pathname = cohort_id
                  ? `/cohort/${cohort_id}/run/${scenario_id}/slide/0`
                  : `/run/${scenario_id}/slide/0`;

                const cohort = cohortsById[cohort_id];
                const cohortPathname = cohort ? `/cohort/${cohort_id}` : null;

                const cohortDisplay = cohort ? cohort.name : null;

                const onViewRunDataClick = (event, props) => {
                  onRunDataClick(event, {
                    ...props,
                    run,
                    menuItem: scenario_title
                  });
                };

                const cohortRunData = run_ended_at
                  ? 'View your data for this scenario run, from this cohort'
                  : 'Finish this scenario to view your data';

                const nonCohortRunData = run_ended_at
                  ? 'View your data for this scenario run'
                  : 'Finish this scenario to view your data';

                const popupContent = cohort ? cohortRunData : nonCohortRunData;

                const viewDataIcon = run_ended_at ? (
                  <Table.Cell.Clickable
                    className="h__table-cell-first"
                    content={<Icon name="file alternate outline" />}
                    onClick={onViewRunDataClick}
                  />
                ) : (
                  <Table.Cell
                    className="h__table-cell-first"
                    content={<Icon name="file alternate outline" disabled />}
                  />
                );

                return (
                  <Table.Row {...completeOrIncomplete} key={run_id}>
                    <Popup
                      size="tiny"
                      content={popupContent}
                      trigger={viewDataIcon}
                    />
                    <Table.Cell.Clickable
                      className="h__col-medium"
                      href={cohortPathname}
                      content={cohortDisplay || ' '}
                    />
                    <Table.Cell.Clickable
                      className="h__col-medium"
                      href={pathname}
                      content={scenario_title}
                    />
                    {Layout.isNotForMobile() ? (
                      <Table.Cell className="h__col-small" alt={createdAtAlt}>
                        {createdAtWithPopup}
                      </Table.Cell>
                    ) : null}

                    <Table.Cell className="h__col-small" alt={endedAtAlt}>
                      {endedAtWithPopup}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>

            {pagination}
          </Table>
        )}
      </Fragment>
    );

    panes.forEach(({ pane, sources }, index) => {
      // Skip the first one, because it contains the
      // main data table.
      if (!index) {
        return;
      }
      const onSubDataTableMenuClick = (event, { name, source }) => {
        if (name === 'close') {
          let activeIndex = this.state.activeIndex;

          panes[index].sources.splice(sources.indexOf(source), 1);

          // When there are no more sources, remove the entire pane.
          if (panes[index].sources.length === 0) {
            activeIndex = 0;
            panes.splice(index, 1);
          }

          this.setState({ activeIndex, panes });
        }
      };

      const name = 'close';

      pane.content = (
        <Fragment>
          {sources.map(source => (
            <DataTable
              key={Identity.key(source)}
              source={source}
              leftColVisible={false}
              onClick={() => onSubDataTableMenuClick({}, { name, source })}
            />
          ))}
        </Fragment>
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
  runsById: PropTypes.object,
  cohortsById: PropTypes.object,
  scenarios: PropTypes.array,
  getCohorts: PropTypes.func,
  getRuns: PropTypes.func,
  getScenarios: PropTypes.func,
  onClick: PropTypes.func,
  getUser: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { cohortsById, runs, runsById, scenarios, user } = state;
  return { cohortsById, runs, runsById, scenarios, user };
};

const mapDispatchToProps = dispatch => ({
  getCohorts: () => dispatch(getCohorts()),
  getRuns: () => dispatch(getRuns()),
  getScenarios: () => dispatch(getScenarios()),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(History)
);
