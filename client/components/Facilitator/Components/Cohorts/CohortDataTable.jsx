import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    Dimmer,
    Header,
    Image,
    Loader,
    Modal,
    Segment,
    Table
} from 'semantic-ui-react';
import { diff } from 'deep-diff';
import { getCohort, getCohortData } from '@client/actions/cohort';
import { getScenarios } from '@client/actions/scenario';
import CohortDataTableMenu from './CohortDataTableMenu';
import './CohortDataTable.css';

function isAudioFile(input) {
    return /^audio\/\d.+\/AudioResponse/.test(input) && input.endsWith('.mp3');
}

export class CohortDataTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: {
                open: false,
                subject: '',
                prompt: '',
                response: ''
            },
            isScenarioDataTable: false,
            prompts: [],
            responses: [],
            tables: []
        };

        this.refreshInterval = null;
        this.detailOpen = this.detailOpen.bind(this);
        this.detailClose = this.detailClose.bind(this);
        this.refresh = this.refresh.bind(this);
        this.onDataTableMenuClick = this.onDataTableMenuClick.bind(this);
    }

    async componentDidMount() {
        const {
            getCohort,
            getScenarios,
            source: { cohortId, participantId, scenarioId }
        } = this.props;

        await getCohort(cohortId);
        await getScenarios();

        if (scenarioId || participantId) {
            await this.refresh();
        }
    }

    async refresh() {
        const {
            getCohortData,
            source: { cohortId, participantId, scenarioId }
        } = this.props;
        const isScenarioDataTable = scenarioId !== undefined;
        const { prompts, responses } = await getCohortData({
            cohortId,
            participantId,
            scenarioId
        });

        const tables = [];
        const rows = [];

        if (isScenarioDataTable) {
            /*

                prompts:    an array of prompts for a single scenario
                responses:  an array of responses from all participants
                            in this scenario.
             */
            const responsesReduced = responses.reduce(
                (accum, { username, response, response_id }) => {
                    if (!accum[username]) {
                        accum[username] = { [response_id]: response };
                    } else {
                        // For now we limit to limit to most recent responses.
                        if (!accum[username][response_id]) {
                            accum[username][response_id] = response;
                        }
                    }
                    return accum;
                },
                {}
            );
            for (const user of this.props.cohort.users) {
                const reduced = responsesReduced[user.username];
                if (reduced) {
                    const row = [user];
                    for (const prompt of prompts) {
                        row.push(reduced[prompt.responseId]);
                    }
                    rows.push(row);
                }
            }

            tables.push({ headers: prompts, rows });
        } else {
            /*

                prompts:    an object of scenario id keys. Each key's value
                            is an array of prompts for a single scenario
                responses:  an array of responses for all scenarios in this
                            cohort, from this participant.
             */

            const responsesReduced = responses.reduce(
                (accum, { scenario_id, response, response_id }) => {
                    if (!accum[scenario_id]) {
                        accum[scenario_id] = { [response_id]: response };
                    } else {
                        // For now we limit to limit to most recent responses.
                        if (!accum[scenario_id][response_id]) {
                            accum[scenario_id][response_id] = response;
                        }
                    }
                    return accum;
                },
                {}
            );

            const { scenarios } = this.props.cohort;
            // eslint-disable-next-line require-atomic-updates
            for (const scenarioId of scenarios) {
                if (prompts[scenarioId]) {
                    const rows = [];
                    const headers = prompts[scenarioId] || [[]];
                    const scenario = this.props.scenarios.find(
                        scenario => scenario.id === scenarioId
                    );
                    const reduced = responsesReduced[scenarioId];
                    if (reduced) {
                        rows.push([scenario, ...Object.values(reduced)]);
                    }

                    tables.push({
                        headers: headers.length && headers[0],
                        rows
                    });
                }
            }
        }

        const newState = {};

        if (
            this.state.prompts.length !== prompts.length ||
            diff(this.state.prompts, prompts)
        ) {
            newState.prompts = prompts;
        }

        if (
            this.state.responses.length !== responses.length ||
            diff(this.state.responses, responses)
        ) {
            newState.responses = responses;
        }

        if (
            this.state.tables.length !== tables.length ||
            diff(this.state.tables, tables)
        ) {
            newState.tables = tables;
        }

        if (this.state.isScenarioDataTable !== isScenarioDataTable) {
            newState.isScenarioDataTable = isScenarioDataTable;
        }

        this.setState(newState);
    }

    detailClose() {
        const {
            detail: { subject, prompt, response }
        } = this.state;

        this.setState({
            detail: {
                open: false,
                subject,
                prompt,
                response
            }
        });
    }

    detailOpen(event, { subject, prompt, response }) {
        this.setState({
            detail: {
                open: true,
                subject,
                prompt,
                response
            }
        });
    }

    onDataTableMenuClick(event, props) {
        if (props.name === 'close') {
            this.props.onClick(event, props);
        }

        if (props.name === 'refresh') {
            this.refresh();
        }
    }

    render() {
        const { detail, isScenarioDataTable, tables } = this.state;
        const { source } = this.props;
        const { detailOpen, detailClose, onDataTableMenuClick } = this;
        const leftColHeader = isScenarioDataTable ? 'Participant' : 'Scenario';
        return (
            <React.Fragment>
                <CohortDataTableMenu
                    source={source}
                    onClick={onDataTableMenuClick}
                />
                {tables.length ? (
                    <React.Fragment>
                        {tables.map(({ headers, rows }, index) => {
                            const tableKeyBase = `data-table-${index}`;
                            return (
                                <div
                                    key={`${tableKeyBase}-container`}
                                    className="cohortdatatable__scroll"
                                >
                                    <Table
                                        key={`${tableKeyBase}-table`}
                                        celled
                                        striped
                                        selectable
                                        role="grid"
                                    >
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell scope="col" />
                                                <Table.HeaderCell
                                                    scope="col"
                                                    colSpan={headers.length}
                                                >
                                                    Prompts & Responses
                                                </Table.HeaderCell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.HeaderCell scope="col">
                                                    {leftColHeader}
                                                </Table.HeaderCell>
                                                {headers.map(
                                                    ({ prompt }, index) => {
                                                        return (
                                                            <Table.HeaderCell
                                                                key={`${tableKeyBase}-prompt-${index}`}
                                                                scope="col"
                                                            >
                                                                {prompt}
                                                            </Table.HeaderCell>
                                                        );
                                                    }
                                                )}
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {rows.map((cells, index) => {
                                                const rowKeyBase = `${tableKeyBase}-row-${index}`;
                                                const first =
                                                    cells.shift() || {};
                                                return (
                                                    first && (
                                                        <Table.Row
                                                            key={rowKeyBase}
                                                        >
                                                            <Table.HeaderCell>
                                                                {first.username ||
                                                                    first.title}
                                                            </Table.HeaderCell>

                                                            {cells.map(
                                                                (
                                                                    response,
                                                                    index
                                                                ) => {
                                                                    const cellKey = `${rowKeyBase}-cell-${index}`;

                                                                    const content = response
                                                                        ? response.isSkip
                                                                            ? '(skipped)'
                                                                            : response.value
                                                                        : '';

                                                                    const isAudioContent = isAudioFile(
                                                                        content
                                                                    );

                                                                    const display = isAudioContent ? (
                                                                        <audio
                                                                            src={`/api/media/${content}`}
                                                                            controls="controls"
                                                                        />
                                                                    ) : (
                                                                        content
                                                                    );

                                                                    const className =
                                                                        content ===
                                                                        ''
                                                                            ? 'cohortdatatable__cell-data-missing'
                                                                            : '';
                                                                    const onCellClick = event =>
                                                                        detailOpen(
                                                                            event,
                                                                            {
                                                                                name:
                                                                                    'detail',
                                                                                subject:
                                                                                    first.username ||
                                                                                    first.title,
                                                                                prompt:
                                                                                    headers[
                                                                                        index
                                                                                    ]
                                                                                        .prompt,
                                                                                response: display
                                                                            }
                                                                        );
                                                                    return (
                                                                        <Table.Cell
                                                                            className={
                                                                                className
                                                                            }
                                                                            key={
                                                                                cellKey
                                                                            }
                                                                            name="cell"
                                                                            onClick={
                                                                                onCellClick
                                                                            }
                                                                            style={{
                                                                                cursor:
                                                                                    'pointer'
                                                                            }}
                                                                        >
                                                                            {
                                                                                display
                                                                            }
                                                                        </Table.Cell>
                                                                    );
                                                                }
                                                            )}
                                                        </Table.Row>
                                                    )
                                                );
                                            })}
                                        </Table.Body>
                                    </Table>
                                </div>
                            );
                        })}
                        <Modal
                            closeIcon
                            key="detail-modal"
                            onClose={detailClose}
                            open={detail.open}
                            size="tiny"
                        >
                            <Modal.Header>
                                Prompt & Response from{' '}
                                <code>{detail.subject}</code>
                            </Modal.Header>
                            <Modal.Content scrolling>
                                <Modal.Description>
                                    <Header>{detail.prompt}</Header>
                                    <p>{detail.response}</p>
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions />
                        </Modal>
                    </React.Fragment>
                ) : (
                    <Segment>
                        <Dimmer active>
                            <Loader />
                        </Dimmer>

                        <Image src="/images/wireframe/short-paragraph.png" />
                    </Segment>
                )}
            </React.Fragment>
        );
    }
}

CohortDataTable.propTypes = {
    scenarios: PropTypes.array,
    source: PropTypes.object,
    runs: PropTypes.array,
    users: PropTypes.array,
    cohort: PropTypes.shape({
        id: PropTypes.any,
        name: PropTypes.string,
        role: PropTypes.string,
        runs: PropTypes.array,
        scenarios: PropTypes.array,
        users: PropTypes.array
    }),
    onClick: PropTypes.func,
    getCohort: PropTypes.func,
    getCohortData: PropTypes.func,
    getScenarios: PropTypes.func,
    user: PropTypes.object
};

const mapStateToProps = state => {
    const { username, permissions } = state.login;
    const { currentCohort: cohort } = state.cohort;
    const { scenarios } = state;
    return { cohort, scenarios, user: { username, permissions } };
};

const mapDispatchToProps = dispatch => ({
    getCohort: id => dispatch(getCohort(id)),
    getCohortData: (...params) => dispatch(getCohortData(...params)),
    getScenarios: () => dispatch(getScenarios())
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CohortDataTable)
);
