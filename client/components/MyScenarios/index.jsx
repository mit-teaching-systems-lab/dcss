import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Icon, Pagination, Popup, Ref, Table } from 'semantic-ui-react';
import * as moment from 'moment';
import { getUserRuns } from '@client/actions/run';
import { getCohorts } from '@client/actions/cohort';
import { getScenarios } from '@client/actions/scenario';
import { getUser } from '@client/actions/user';
import CohortDataTable from '@components/Facilitator/Components/Cohorts/CohortDataTable';

import './MyScenarios.css';

const ROWS_PER_PAGE = 5;

class MyScenarios extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
        await this.props.getCohorts();
        await this.props.getUserRuns();
        await this.props.getScenarios();
        await this.props.getUser();

        const { source } = this.state;

        this.setState({
            ...this.state,
            source: {
                ...source,
                participantId: this.props.user.id
            }
        });
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
                this.tableRef.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
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
        const { runs } = this.props;
        const { activePage, source } = this.state;

        const runsPages = Math.ceil(runs.length / ROWS_PER_PAGE);
        const runsIndex = (activePage - 1) * ROWS_PER_PAGE;
        const runsSlice = runs.slice(runsIndex, runsIndex + ROWS_PER_PAGE);

        return (
            <div>
                <Table role="grid" unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan="4">
                                My Scenario Data
                            </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell collapsing></Table.HeaderCell>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell className="myscenarios__hidden-on-mobile">
                                Started
                            </Table.HeaderCell>
                            <Table.HeaderCell className="myscenarios__hidden-on-mobile">
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

                            const createdAt = moment(run_created_at).fromNow();
                            const createdAtAlt = moment(
                                run_created_at
                            ).calendar();

                            const endedAt = run_ended_at
                                ? moment(run_ended_at).fromNow()
                                : '';
                            const endedAtAlt = run_ended_at
                                ? moment(run_ended_at).calendar()
                                : 'This run is not complete';

                            const createdAtDisplay = `${createdAt} (${createdAtAlt})`;
                            const endedAtDisplay = `${endedAt} (${endedAtAlt})`;

                            const runKey = `${run_id}-${
                                cohort_id ? cohort_id : scenario_id
                            }`;

                            const pathname = cohort_id
                                ? `/cohort/${cohort_id}/run/${scenario_id}/slide/0`
                                : `/run/${scenario_id}/slide/0`;

                            return (
                                <Table.Row
                                    {...completeOrIncomplete}
                                    key={run_id}
                                >
                                    <Table.Cell collapsing>
                                        <RunMenu
                                            key={runKey}
                                            run={run}
                                            onClick={onRunDataClick}
                                        />
                                    </Table.Cell>
                                    <Table.Cell
                                        onClick={() => {
                                            location.href = pathname;
                                        }}
                                    >
                                        <Link to={pathname}>
                                            {scenario_title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell
                                        alt={endedAtAlt}
                                        className="myscenarios__hidden-on-mobile"
                                    >
                                        {createdAtDisplay}
                                    </Table.Cell>
                                    <Table.Cell
                                        alt={endedAtAlt}
                                        className="myscenarios__hidden-on-mobile"
                                    >
                                        {endedAtDisplay}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="4">
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
                        innerRef={node => (this.tableRef = node)}
                    >
                        <CohortDataTable
                            key={`datatable-${source.runId}`}
                            source={source}
                            leftColVisible={false}
                            onClick={onDataTableMenuClick}
                        />
                    </Ref>
                )}
            </div>
        );
    }
}

const RunMenu = props => {
    const { onClick, run } = props;

    const onClickToViewRunData = (event, props) => {
        onClick(event, {
            ...props,
            run
        });
    };
    return (
        <Button.Group
            hidden
            basic
            size="tiny"
            className="buttongroup__button-group--transparent"
        >
            <Popup
                content="View your data for this scenario run"
                trigger={
                    <Button
                        icon
                        content={<Icon name="file alternate outline" />}
                        name={run.scenario_title}
                        onClick={onClickToViewRunData}
                    />
                }
            />
        </Button.Group>
    );
};

RunMenu.propTypes = {
    run: PropTypes.object,
    onClick: PropTypes.func
};

MyScenarios.propTypes = {
    runs: PropTypes.array,
    cohorts: PropTypes.array,
    scenarios: PropTypes.array,
    getCohorts: PropTypes.func,
    getUserRuns: PropTypes.func,
    getScenarios: PropTypes.func,
    getUser: PropTypes.func,
    onClick: PropTypes.func,
    user: PropTypes.object
};

const mapStateToProps = state => {
    const { userCohorts: cohorts } = state.cohort;
    const { runs, scenarios, user } = state;
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
