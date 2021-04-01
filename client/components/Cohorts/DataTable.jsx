import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { Icon, Message, Table } from '@components/UI';
import { diff } from 'deep-diff';
import {
  getChatTranscriptsByChatId,
  getChatTranscriptsByCohortId,
  getChatTranscriptsByRunId,
  getChatTranscriptsByScenarioId
} from '@actions/chat';
import { getCohort, getCohortData } from '@actions/cohort';
import { getRunData } from '@actions/run';
import { getScenariosByStatus } from '@actions/scenario';
import { getUsers } from '@actions/users';
import Loading from '@components/Loading';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import Username from '@components/User/Username';
import CSV from '@utils/csv';
import { makeHeader } from '@utils/data-table';
import Moment from '@utils/Moment';
import Media from '@utils/Media';
import DataModal from './DataModal';
import DataTableMenu from './DataTableMenu';
import './DataTable.css';

function reduceResponses(key, responses) {
  return responses.reduce((accum, response) => {
    const {
      [key]: property,
      content = '',
      value,
      transcript = '',
      is_skip,
      response_id
    } = response;

    console.log(response);

    response.content = content;
    response.content += (is_skip
      ? '(skipped)'
      : ` ${transcript || (content === '' ? value : '')}`
    ).trim();

    if (response.type === 'ChatPrompt') {
      if (response.content === '(skipped)') {
        response.content = '(messages attached)';
      } else {
        response.content += '(messages attached)';
      }
    }

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
}

export class DataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isScenarioDataTable: false,
      isReady: false,
      prompts: [],
      responses: [],
      tables: [],
      transcriptsByRunId: {},
    };

    this.refresh = this.refresh.bind(this);
    this.requestDownload = this.requestDownload.bind(this);
    this.triggerDownload = this.triggerDownload.bind(this);
    this.onDataTableMenuClick = this.onDataTableMenuClick.bind(this);
  }

  async componentDidMount() {
    const {
      source: { cohortId, participantId, runId, scenarioId }
    } = this.props;

    if (cohortId) {
      await this.props.getCohort(cohortId);
    }

    await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);
    await this.props.getUsers();

    if (participantId || runId || scenarioId) {
      await this.refresh();
      this.setState({
        isReady: true
      });
    }
  }

  async refresh() {
    const {
      source: { cohortId, participantId, runId, scenarioId }
    } = this.props;
    const isScenarioDataTable = scenarioId !== undefined;
    const { prompts, responses } = cohortId
      ? await this.props.getCohortData(cohortId, participantId, scenarioId)
      : await this.props.getRunData(runId);

    const transcripts = cohortId
      ? await this.props.getChatTranscriptsByCohortId(cohortId)
      : await this.props.getChatTranscriptsByRunId(runId);

    const scenarios = cohortId
      ? this.props.cohort.scenarios
      : [...new Set(this.props.scenarios.map(scenario => scenario.id))];

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

    const transcriptsByRunId = transcripts.reduce((accum, record) => {
      if (!accum[record.run_id]) {
        accum[record.run_id] = [];
      }
      accum[record.run_id].push(record);
      accum[record.run_id].sort((a, b) =>
        a.created_at > b.created_at
      );
      return accum;
    }, {});

    const newState = {
      transcriptsByRunId
    };

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

  async requestDownload() {
    const {
      cohort,
      scenarios,
      source: { cohortId, participantId, runId, scenarioId },
      user
    } = this.props;
    const { isScenarioDataTable, tables } = this.state;
    const users = cohortId ? cohort.users : [user];

    const files = [];
    const prefix = cohortId ? `cohort-${cohortId}` : `run-${runId}`;

    for (const { prompts, rows } of tables) {

      const subject = isScenarioDataTable
        ? scenarios.find(scenario => scenario.id === scenarioId).title
        : users.find(user => user.id === participantId).username;

      const leftColumnHeader = isScenarioDataTable ? 'Participant' : 'Scenario';

      const subjectAndPrompts = [
        `"${leftColumnHeader}"`,
        ...prompts.map(prompt => `"${CSV.escape(makeHeader(prompt, prompts))}"`)
      ].join(',');

      let csv = `${subjectAndPrompts}\n`;

      rows.forEach(row => {
        const prepared = row.map(data => {
          if (typeof data === 'string') {
            return `"${data}"`;
          }

          const response = data || {};
          const isAudioContent = Media.isAudioFile(response.value);
          let { content = '' } = response;

          if (isAudioContent) {
            content += ` (${location.origin}/api/media/${response.value})`;
          }

          const difference = Moment(response.ended_at).diff(
            response.created_at
          );
          const duration = Moment.duration(difference).format(
            Moment.globalFormat
          );

          content += ` (${duration})`;

          const formatted = CSV.escape(content);

          return `"${formatted}"`;
        });
        csv += `${prepared.join(',')}\n`;
      });

      files.push([`${Identity.key({ prefix, subject })}.csv`, csv]);
    }

    console.log(files);

    return files;
  }

  async triggerDownload(files) {
    if (Object.entries(files).length === 1) {
      const [file, csv] = files[0];
      CSV.download(file, csv);
    } else {
      CSV.downloadZipAsync(files);
    }
  }

  async onDataTableMenuClick(event, props) {

    if (props.name === 'close') {
      this.props.onClick(event, props);
    }

    if (props.name === 'refresh') {
      this.refresh();
    }

    if (props.name === 'download') {
      await this.triggerDownload(
        await this.requestDownload()
      );
    }
  }

  render() {
    const { isScenarioDataTable, isReady, tables } = this.state;
    const { leftColVisible = true, source } = this.props;
    const { onDataTableMenuClick } = this;
    const leftColHeader = isScenarioDataTable ? 'Participant' : 'Scenario';
    const leftColHidden = !leftColVisible
      ? { className: 'dt__left-col-hidden' }
      : {};

    if (!isReady) {
      return <Loading />;
    }


    const transcript = this.state.transcriptsByRunId[source.runId] || [];

    return (
      <Fragment>
        {!tables.length ? (
          <Message>
            There is no data recorded yet. Completed scenarios will appear here.
          </Message>
        ) : (
          <DataTableMenu source={source} onClick={onDataTableMenuClick} />
        )}
        {tables.map(({ prompts, rows }, index) => {
          const tableKeyBase = `data-table-${index}`;
          return (
            <div className="dt__scroll" key={`${tableKeyBase}-container`}>
              <Table
                striped
                selectable
                unstackable
                role="grid"
                key={`${tableKeyBase}-table`}
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell scope="col" {...leftColHidden}>
                      {leftColHeader}
                    </Table.HeaderCell>
                    {prompts.map(({ header, prompt }, index) => (
                      <Table.HeaderCell
                        scope="col"
                        key={`${tableKeyBase}-prompt-${index}`}
                      >
                        {header || prompt}
                      </Table.HeaderCell>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {rows.map((cells, index) => {
                    const key = `${tableKeyBase}-row-${index}`;
                    return (
                      <DataTableRow
                        isScenarioDataTable={isScenarioDataTable}
                        leftColVisible={leftColVisible}
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

              {transcript.map(message => {

                const author = this.props.usersById[message.user_id];
                return (
                  <p>
                    <Username user={author} />:{' '}
                    {message.textContent}
                  </p>
                );
              })}
            </div>
          );
        })}
      </Fragment>
    );
  }
}

const DataTableRow = props => {
  const { cells, isScenarioDataTable, leftColVisible, rowKey } = props;
  const leftColHidden = !leftColVisible
    ? { className: 'dt__left-col-hidden' }
    : {};
  const subject = cells[0] || '';

  return (
    <Table.Row>
      <Table.HeaderCell verticalAlign="top" {...leftColHidden}>
        <p>{subject}</p>
      </Table.HeaderCell>

      {cells.slice(1).map((response = {}, cellIndex) => {
        const cellKey = `${rowKey}-cell-${cellIndex}`;
        const modalKey = `${rowKey}-modal-${cellIndex}`;
        const isAudioContent = Media.isAudioFile(response.value);
        const { content = '' } = response;

        // microphone
        const display = isAudioContent ? (
          <Fragment>
            {content && content !== response.value ? (
              content
            ) : (
              <audio src={`/api/media/${response.value}`} controls="controls" />
            )}
            <Icon name="microphone" />
          </Fragment>
        ) : (
          content
        );

        const className = !content ? 'dt__cell-data-missing' : '';

        const difference = Moment(response.ended_at).diff(response.created_at);
        const duration = Moment.duration(difference).format(
          Moment.globalFormat
        );

        return (
          <DataModal
            {...props}
            index={cellIndex}
            isScenarioDataTable={isScenarioDataTable}
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

                {display && <p style={{ color: 'grey' }}>{duration}</p>}
              </Table.Cell>
            }
          ></DataModal>
        );
      })}
    </Table.Row>
  );
};

DataTableRow.propTypes = {
  isScenarioDataTable: PropTypes.bool,
  leftColVisible: PropTypes.bool,
  cells: PropTypes.array,
  onClick: PropTypes.func,
  headers: PropTypes.array,
  prompts: PropTypes.array,
  rows: PropTypes.array,
  rowKey: PropTypes.string,
  state: PropTypes.object
};

DataTable.propTypes = {
  isScenarioDataTable: PropTypes.bool,
  leftColVisible: PropTypes.bool,
  scenarios: PropTypes.array,
  source: PropTypes.object,
  runs: PropTypes.array,
  runsById: PropTypes.object,
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
  getChatTranscriptsByChatId: PropTypes.func,
  getChatTranscriptsByCohortId: PropTypes.func,
  getChatTranscriptsByRunId: PropTypes.func,
  getChatTranscriptsByScenarioId: PropTypes.func,
  getCohort: PropTypes.func,
  getCohortData: PropTypes.func,
  getRunData: PropTypes.func,
  getScenariosByStatus: PropTypes.func,
  getUsers: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { cohort, runsById, scenarios, user, usersById } = state;
  return { cohort, runsById, scenarios, user, usersById };
};

const mapDispatchToProps = dispatch => ({
  getChatTranscriptsByChatId: id => dispatch(getChatTranscriptsByChatId(id)),
  getChatTranscriptsByCohortId: id => dispatch(getChatTranscriptsByCohortId(id)),
  getChatTranscriptsByRunId: id => dispatch(getChatTranscriptsByRunId(id)),
  getChatTranscriptsByScenarioId: id => dispatch(getChatTranscriptsByScenarioId(id)),
  getCohort: id => dispatch(getCohort(id)),
  getCohortData: (...params) => dispatch(getCohortData(...params)),
  getRunData: (...params) => dispatch(getRunData(...params)),
  getScenariosByStatus: status => dispatch(getScenariosByStatus(status)),
  getUsers: () => dispatch(getUsers())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DataTable)
);
