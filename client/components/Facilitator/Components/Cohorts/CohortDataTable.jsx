import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    Dimmer,
    Grid,
    Icon,
    Image,
    Loader,
    Modal,
    Segment,
    Table
} from 'semantic-ui-react';
import { diff } from 'deep-diff';
import Moment from 'react-moment';
import { getCohort, getCohortData } from '@client/actions/cohort';
import { getScenarios } from '@client/actions/scenario';
import ContentSlide from '@components/Scenario/ContentSlide';
import CohortDataTableMenu from './CohortDataTableMenu';
import './CohortDataTable.css';

function isAudioFile(input) {
    return /^audio\/\d.+\/AudioResponse/.test(input) && input.endsWith('.mp3');
}

function reduceResponses(key, responses) {
    const responsesReduced = responses.reduce((accum, response) => {
        const {
            [key]: property,
            value,
            transcript = '',
            is_skip,
            response_id
        } = response;
        response.content = is_skip ? '(skipped)' : transcript || value;

        if (!accum[property]) {
            accum[property] = { [response_id]: response };
        } else {
            // For now we limit to limit to most recent responses.
            if (!accum[property][response_id]) {
                accum[property][response_id] = response;
            }
        }
        return accum;
    }, {});

    return responsesReduced;
}

function makeHeader(props, prompts) {
    const { buttons, header, prompt, recallId, required } = props || {};
    const parentheticals = [];

    if (required) {
        parentheticals.push('Required');
    }

    if (recallId) {
        const reflected = prompts.find(
            ({ responseId }) => responseId === recallId
        ).prompt;
        parentheticals.push(`Reflecting on '${reflected}'`);
    }

    if (buttons) {
        parentheticals.push(
            `Choices: ${buttons.map(button => button.display).join(', ')}`
        );
    }

    if (!header) {
        return `${prompt} (${parentheticals.join(', ')})`;
    } else {
        return `${header} (${parentheticals.join(', ')})`;
    }
}

function escapeCSV(input) {
    return input.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/gm, '""');
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
            initialRequestMade: false,
            prompts: [],
            responses: [],
            tables: []
        };

        this.refreshInterval = null;
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
            this.setState({
                initialRequestMade: true
            });
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

            const reduced = reduceResponses('username', responses);
            for (const user of this.props.cohort.users) {
                const scenarioResponses = reduced[user.username];
                if (scenarioResponses) {
                    const row = [user.username];
                    for (const prompt of prompts) {
                        row.push(scenarioResponses[prompt.responseId]);
                    }
                    rows.push(row);
                }
            }

            tables.push({ prompts, rows });
        } else {
            /*

                prompts:    an object of scenario id keys. Each key's value
                            is an array of prompts for a single scenario
                responses:  an array of responses for all scenarios in this
                            cohort, from this participant.
             */
            const reduced = reduceResponses('scenario_id', responses);
            const { scenarios } = this.props.cohort;
            // eslint-disable-next-line require-atomic-updates
            for (const scenarioId of scenarios) {
                if (prompts[scenarioId]) {
                    const rows = [];
                    const headers = prompts[scenarioId].flat() || [];
                    const scenario = this.props.scenarios.find(
                        scenario => scenario.id === scenarioId
                    );
                    const participantResponses = reduced[scenarioId];
                    if (participantResponses) {
                        const prompts = headers;
                        const row = [scenario.title];
                        for (const prompt of prompts) {
                            row.push(participantResponses[prompt.responseId]);
                        }
                        rows.push(row);
                    }

                    tables.push({
                        prompts: headers,
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

    download() {
        const {
            cohort: { users },
            scenarios,
            source: { cohortId, participantId, scenarioId }
        } = this.props;

        const { isScenarioDataTable, tables } = this.state;

        tables.forEach(({ prompts, rows }) => {
            const subject = isScenarioDataTable
                ? scenarios.find(scenario => scenario.id === scenarioId).title
                : users.find(user => user.id === participantId).username;

            const leftColumnHeader = isScenarioDataTable
                ? 'Participant'
                : 'Scenario';

            const subjectAndPrompts = [
                `"${leftColumnHeader}"`,
                ...prompts.map(
                    prompt => `"${escapeCSV(makeHeader(prompt, prompts))}"`
                )
            ].join(',');

            let csv = `${subjectAndPrompts}\n`;

            rows.forEach(row => {
                const prepared = row.map(data => {
                    if (typeof data === 'string') {
                        return `"${data}"`;
                    }

                    const response = data || {};
                    const isAudioContent = isAudioFile(response.value);
                    let { content = '' } = response;

                    if (isAudioContent) {
                        content += ` (${location.origin}/api/media/${response.value})`;
                    }
                    const formatted = escapeCSV(content);

                    return `"${formatted}"`;
                });
                csv += `${prepared.join(',')}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.setAttribute(
                'download',
                `cohort-${cohortId}-${subject}.csv`
            );
            anchor.click();

            URL.revokeObjectURL(url);
        });
    }

    onDataTableMenuClick(event, props) {
        if (props.name === 'close') {
            this.props.onClick(event, props);
        }

        if (props.name === 'refresh') {
            this.refresh();
        }

        if (props.name === 'download') {
            this.download();
        }
    }

    render() {
        const { isScenarioDataTable, initialRequestMade, tables } = this.state;
        const { source } = this.props;
        const { onDataTableMenuClick } = this;
        const leftColHeader = isScenarioDataTable ? 'Participant' : 'Scenario';
        return tables.length ? (
            <React.Fragment>
                <CohortDataTableMenu
                    source={source}
                    onClick={onDataTableMenuClick}
                />
                {tables.map(({ prompts, rows }, index) => {
                    const tableKeyBase = `data-table-${index}`;
                    return (
                        <div
                            key={`${tableKeyBase}-container`}
                            className="cohortdatatable__scroll"
                        >
                            <Table
                                key={`${tableKeyBase}-table`}
                                celled
                                fixed
                                striped
                                selectable
                                role="grid"
                            >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell scope="col">
                                            {leftColHeader}
                                        </Table.HeaderCell>
                                        {prompts.map(
                                            ({ header, prompt }, index) => (
                                                <Table.HeaderCell
                                                    key={`${tableKeyBase}-prompt-${index}`}
                                                    scope="col"
                                                >
                                                    {header ||
                                                        `Prompt: "${prompt}"`}
                                                </Table.HeaderCell>
                                            )
                                        )}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {rows.map((cells, index) => {
                                        const key = `${tableKeyBase}-row-${index}`;
                                        return (
                                            <CohortDataTableRow
                                                isScenarioDataTable={
                                                    isScenarioDataTable
                                                }
                                                prompts={prompts}
                                                cells={cells}
                                                rows={rows}
                                                rowKey={key}
                                                rowIndex={index}
                                                key={key}
                                            />
                                        );
                                    })}
                                </Table.Body>
                            </Table>
                        </div>
                    );
                })}
            </React.Fragment>
        ) : (
            <Segment>
                {initialRequestMade ? (
                    <React.Fragment>
                        There is currently no data to display here.
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Dimmer active>
                            <Loader />
                        </Dimmer>
                        <Image src="/images/wireframe/short-paragraph.png" />
                    </React.Fragment>
                )}
            </Segment>
        );
    }
}

const CohortDataTableRow = props => {
    const { cells, rowKey } = props;
    const subject = cells[0] || '';
    return (
        <Table.Row>
            <Table.HeaderCell verticalAlign="top">{subject}</Table.HeaderCell>

            {cells.slice(1).map((response = {}, cellIndex) => {
                const cellKey = `${rowKey}-cell-${cellIndex}`;
                const modalKey = `${rowKey}-modal-${cellIndex}`;
                const isAudioContent = isAudioFile(response.value);
                const { content = '' } = response;

                // microphone
                const display = isAudioContent ? (
                    <React.Fragment>
                        {content ? (
                            content
                        ) : (
                            <audio
                                src={`/api/media/${response.value}`}
                                controls="controls"
                            />
                        )}
                        <Icon name="microphone" />
                    </React.Fragment>
                ) : (
                    content
                );

                const className = !content
                    ? 'cohortdatatable__cell-data-missing'
                    : '';

                return (
                    <CohortDataModal
                        {...props}
                        index={cellIndex}
                        key={modalKey}
                        trigger={
                            <Table.Cell
                                className={className}
                                key={cellKey}
                                name="cell"
                                style={{
                                    cursor: 'pointer'
                                }}
                                verticalAlign="top"
                            >
                                <p>{display}</p>

                                {display && (
                                    <Moment
                                        duration={response.created_at}
                                        date={response.ended_at}
                                        style={{
                                            color: 'grey'
                                        }}
                                    />
                                )}
                            </Table.Cell>
                        }
                    ></CohortDataModal>
                );
            })}
        </Table.Row>
    );
};

const CohortDataModal = props => {
    const { index, prompts, rows } = props;
    const component = prompts[index];
    const { header, prompt, slide } = component;

    return (
        <Modal
            trigger={props.trigger}
            size="fullscreen"
            className="cohortdatatablemodal__view"
            closeIcon
        >
            <Modal.Header>Responses In Context</Modal.Header>

            <Modal.Content className="cohortdatatablemodal__scroll">
                <Grid columns={2} className="cohortdatatablemodal__grid-nowrap">
                    <Grid.Column className="cohortdatatable__scroll gridcolumn__first-child--sticky">
                        <ContentSlide
                            slide={slide}
                            isLastSlide={false}
                            onClickBack={() => {}}
                            onClickNext={() => {}}
                            onResponseChange={() => {}}
                        />
                    </Grid.Column>
                    <Grid.Column className="cohortdatatable__scroll">
                        <Table celled striped selectable role="grid">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell scope="col" colSpan={2}>
                                        {header || `Prompt: "${prompt}"`}
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {rows.map((row, rowIndex) => {
                                    let {
                                        0: left = '',
                                        [index + 1]: response = {}
                                    } = row;
                                    const isAudioContent = isAudioFile(
                                        response.value
                                    );
                                    const { content = '' } = response;
                                    const display = isAudioContent ? (
                                        <React.Fragment>
                                            {content ? (
                                                content
                                            ) : (
                                                <audio
                                                    src={`/api/media/${response.value}`}
                                                    controls="controls"
                                                />
                                            )}
                                            <Icon name="microphone" />
                                        </React.Fragment>
                                    ) : (
                                        content
                                    );

                                    return (
                                        <Table.Row
                                            key={`modal-${slide.id}-${rowIndex}`}
                                        >
                                            <Table.HeaderCell verticalAlign="top">
                                                {left}
                                            </Table.HeaderCell>
                                            <Table.Cell>
                                                <p>{display}</p>

                                                {display && (
                                                    <Moment
                                                        duration={
                                                            response.created_at
                                                        }
                                                        date={response.ended_at}
                                                        style={{
                                                            color: 'grey'
                                                        }}
                                                    />
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
            </Modal.Content>
        </Modal>
    );
};

CohortDataModal.propTypes = {
    isScenarioDataTable: PropTypes.bool,
    cells: PropTypes.array,
    onClick: PropTypes.func,
    headers: PropTypes.array,
    index: PropTypes.number,
    prompts: PropTypes.array,
    rows: PropTypes.array,
    rowKey: PropTypes.string,
    state: PropTypes.object,
    trigger: PropTypes.node
};

CohortDataTableRow.propTypes = {
    isScenarioDataTable: PropTypes.bool,
    cells: PropTypes.array,
    onClick: PropTypes.func,
    headers: PropTypes.array,
    prompts: PropTypes.array,
    rows: PropTypes.array,
    rowKey: PropTypes.string,
    state: PropTypes.object
};

CohortDataTable.propTypes = {
    isScenarioDataTable: PropTypes.bool,
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
