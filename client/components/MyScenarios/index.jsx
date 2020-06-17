import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Pagination, Popup, Ref, Table } from 'semantic-ui-react';
import Moment from '@utils/Moment';
import { getUserRuns } from '@actions/run';
import { getCohorts } from '@actions/cohort';
import { getScenarios } from '@actions/scenario';
import { getUser } from '@actions/user';
import Loading from '@components/Loading';
import ClickableTableCell from '@components/ClickableTableCell';
import scrollIntoView from '@components/util/scrollIntoView';
import DataTable from '@components/Cohorts/DataTable';

import './MyScenarios.css';

const ROWS_PER_PAGE = 10;

class MyScenarios extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      activePage: 1,
      source: {
        runId: null,
        participantId: null
      }
    };
    this.tableRef = null;
    this.onRunDataClick = this.onRunDataClick.bind(this);
    this.onDataTableMenuClick = this.onDataTableMenuClick.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
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
      run: { run_id }
    } = props;

    const { source } = this.state;

    this.setState(
      {
        ...this.state,
        source: {
          ...source,
          runId: run_id
        }
      },

      () => {
        scrollIntoView(this.tableRef, {
          block: 'start'
        });
      }
    );
  }

  onDataTableMenuClick(event, { name }) {
    // If the button name was "close"...
    if (name === 'close') {
      const { source } = this.state;
      this.setState({
        ...this.state,
        source: {
          ...source,
          runId: null
        }
      });
    }
  }

  render() {
    const { onDataTableMenuClick, onPageChange, onRunDataClick } = this;
    const { cohorts, runs } = this.props;
    const { isReady, activePage, source } = this.state;

    if (!isReady) {
      return <Loading />;
    }

    const runsPages = Math.ceil(runs.length / ROWS_PER_PAGE);
    const runsIndex = (activePage - 1) * ROWS_PER_PAGE;
    const runsSlice = runs.slice(runsIndex, runsIndex + ROWS_PER_PAGE);

    return (
      <Fragment>
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
              <Table.HeaderCell>Scenario Title</Table.HeaderCell>
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
                  run
                });
              };

              return (
                <Table.Row {...completeOrIncomplete} key={run_id}>
                  <Popup
                    content="View your data for this scenario run"
                    trigger={
                      <ClickableTableCell
                        className="ms__table-cell-first"
                        display={<Icon name="file alternate outline" />}
                        onClick={onViewRunDataClick}
                      />
                    }
                  />
                  <ClickableTableCell
                    href={pathname}
                    display={scenario_title}
                    className="ms__table-cell-options"
                  />
                  <Table.Cell alt={endedAtAlt} className="ms__hidden-on-mobile">
                    {startedAtDisplay}
                  </Table.Cell>
                  <Table.Cell alt={endedAtAlt} className="ms__hidden-on-mobile">
                    {endedAtDisplay}
                  </Table.Cell>
                  <ClickableTableCell
                    className="ms__hidden-on-mobile"
                    href={cohortPathname}
                    display={cohortDisplay}
                  />
                </Table.Row>
              );
            })}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="5">
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
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>

        {source && source.runId && (
          <Ref
            key={`ref-${source.runId}`}
            innerRef={node => scrollIntoView(node, { block: 'start' })}
          >
            <DataTable
              key={`datatable-${source.runId}`}
              source={source}
              leftColVisible={false}
              onClick={onDataTableMenuClick}
            />
          </Ref>
        )}
      </Fragment>
    );
  }
}

MyScenarios.propTypes = {
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
  )(MyScenarios)
);
