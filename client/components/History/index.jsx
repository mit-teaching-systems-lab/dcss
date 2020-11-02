import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Message, Pagination, Popup, Tab, Table } from '@components/UI';
import Moment from '@utils/Moment';
import { getRuns } from '@actions/run';
import { getCohorts } from '@actions/cohort';
import { getScenariosIncrementally } from '@actions/scenario';
import { getUser } from '@actions/user';
import Loading from '@components/Loading';
import DataTable from '@components/Cohorts/DataTable';

import './History.css';

import Layout from '@utils/Layout';
const ROWS_PER_PAGE = 10;

class History extends Component {
  constructor(props) {
    super(props);

    let activeIndex = 0;

    const panes = [
      {
        menuItem: 'History',
        pane: {
          key: 'main-history',
          content: null
        },
        scenario: null
      }
    ];

    const runId = Number(this.props.match.params.runId) || null;
    const scenarioId = Number(this.props.match.params.scenarioId) || null;

    if (scenarioId) {
      activeIndex = 1;
      const sources = runId ? [{ runId }] : [];
      panes.push({
        pane: {
          key: Identity.key(scenarioId),
          content: null
        },
        scenarioId,
        sources
      });
    }

    this.state = {
      // TODO: figure out if this is used anywhere
      activeIndex,
      activePage: 1,
      isReady: false,
      panes,
      sources: []
    };

    this.tableRef = null;
    this.onRunDataClick = this.onRunDataClick.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      await this.props.getCohorts();
      await this.props.getScenariosIncrementally();
      await this.props.getRuns();

      const { panes } = this.state;

      // Direct URL, eg.
      //
      // - /history/scenario/:scenarioId/run/:runId
      // - /history/scenario/:scenarioId
      //
      if (panes.length === 2) {
        const pane = panes[1];
        const participantId = this.props.user.id;
        const scenario = this.props.scenariosById[pane.scenarioId];

        pane.scenario = scenario;
        pane.menuItem = scenario.title;

        if (pane.sources.length) {
          pane.sources.forEach(
            source => (source.participantId = participantId)
          );
        } else {
          pane.sources = this.props.runs.reduce((accum, run) => {
            if (run.scenario_id === pane.scenarioId) {
              accum.push({
                runId: run.run_id,
                participantId
              });
            }
            return accum;
          }, []);
        }
      }

      this.setState({
        isReady: true,
        panes
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
      scenario,
      run: { run_id: runId }
    } = props;
    const { panes } = this.state;
    const index = panes.findIndex(
      pane => pane.scenario && pane.scenario.id === scenario.id
    );
    const menuItem = scenario.title;
    const source = {
      participantId: this.props.user.id,
      runId
    };

    if (index !== -1) {
      if (!panes[index].sources.find(source => source.runId === runId)) {
        panes[index].sources.push(source);
      }
    } else {
      const key = Identity.key(scenario.id);
      panes.push({
        menuItem,
        pane: {
          key,
          content: null
        },
        scenario,
        sources: [source]
      });
    }

    const activeIndex = index > -1 ? index : panes.length - 1;

    this.setState({ activeIndex, panes });
    this.props.history.push(`/history/scenario/${scenario.id}`);
  }

  onTabChange(event, { activeIndex }) {
    const scenario = activeIndex
      ? this.state.panes[activeIndex].scenario
      : null;

    const pathName = scenario ? `/history/scenario/${scenario.id}` : `/history`;

    this.setState({ activeIndex });
    this.props.history.push(pathName);
  }

  render() {
    const { onPageChange, onRunDataClick, onTabChange } = this;
    const { cohortsById, runs } = this.props;
    const { isReady, activeIndex, activePage, panes } = this.state;

    const runsPages = Math.ceil(runs.length / ROWS_PER_PAGE);
    const runsIndex = (activePage - 1) * ROWS_PER_PAGE;
    const runsSlice = runs.slice(runsIndex, runsIndex + ROWS_PER_PAGE);

    if (!isReady) {
      return <Loading />;
    }
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
            <Table.Body key={Identity.key({ runsSlice })}>
              {runsSlice.map(run => {
                const {
                  run_created_at,
                  run_ended_at,
                  scenario_id,
                  scenario_title,
                  cohort_id
                } = run;
                const scenario = this.props.scenariosById[scenario_id];
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
                    inverted
                    size="tiny"
                    content={createdAtAlt}
                    trigger={createdAt}
                  />
                );

                const endedAtWithPopup = (
                  <Popup
                    inverted
                    size="tiny"
                    content={endedAtAlt}
                    trigger={endedAt}
                  />
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
                    scenario
                  });
                };

                const cohortRunData = run_ended_at
                  ? `View your data for this scenario run, from cohort "${cohortDisplay}"`
                  : `Finish this "${scenario_title}" to view your data`;

                const nonCohortRunData = run_ended_at
                  ? `View your data for this run of scenario "${scenario_title}"`
                  : `Finish this "${scenario_title}" to view your data`;

                const popupContent = cohort ? cohortRunData : nonCohortRunData;

                const viewDataIcon = run_ended_at ? (
                  <Table.Cell.Clickable
                    className="h__table-cell-first"
                    aria-label={popupContent}
                    content={<Icon name="file alternate outline" />}
                    onClick={onViewRunDataClick}
                  />
                ) : (
                  <Table.Cell
                    className="h__table-cell-first"
                    aria-label={popupContent}
                    content={<Icon name="file alternate outline" disabled />}
                  />
                );

                const cohortDisplayCellClassName = !cohortDisplay
                  ? 'h__col-medium dt__cell-data-missing'
                  : 'h__col-medium';

                return (
                  <Table.Row {...completeOrIncomplete} key={Identity.key(run)}>
                    <Popup
                      inverted
                      size="tiny"
                      content={popupContent}
                      trigger={viewDataIcon}
                    />
                    <Table.Cell.Clickable
                      className={cohortDisplayCellClassName}
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

          this.setState({ panes });
          this.onTabChange(event, { activeIndex });
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
  cohortsById: PropTypes.object,
  getCohorts: PropTypes.func,
  getRuns: PropTypes.func,
  getScenariosIncrementally: PropTypes.func,
  getUser: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      runId: PropTypes.node,
      scenarioId: PropTypes.node
    }).isRequired
  }).isRequired,
  onClick: PropTypes.func,
  runs: PropTypes.array,
  runsById: PropTypes.object,
  scenarios: PropTypes.array,
  scenariosById: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { cohortsById, runs, runsById, scenarios, scenariosById, user } = state;
  return { cohortsById, runs, runsById, scenarios, scenariosById, user };
};

const mapDispatchToProps = dispatch => ({
  getCohorts: () => dispatch(getCohorts()),
  getRuns: () => dispatch(getRuns()),
  getScenariosIncrementally: updater =>
    dispatch(getScenariosIncrementally(updater)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(History)
);
