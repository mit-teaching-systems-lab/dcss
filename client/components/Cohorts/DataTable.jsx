import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Parser } from 'json2csv';
import fastCopy from 'fast-copy';
import PropTypes from 'prop-types';
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
import DataModal from '@components/Cohorts/DataModal';
import DataTableChatTranscript from '@components/Cohorts/DataTableChatTranscript';
import DataTableMenu from '@components/Cohorts/DataTableMenu';
import Loading from '@components/Loading';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import { Icon, Message, Table, Text } from '@components/UI';
import CSV from '@utils/csv';
import { makeHeader } from '@utils/data-table';
import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import Media from '@utils/Media';
import './DataTable.css';

function reduceResponses(key, responses) {
  return responses.reduce((accum, response) => {
    const {
      [key]: identity,
      content = '',
      value,
      transcript = '',
      is_skip
    } = response;

    const transcriptOrValue =
      transcript || (value.trim() !== content.trim() ? value : '');

    response.content = content;
    response.content += (is_skip
      ? '(skipped)'
      : ` ${transcriptOrValue}`
    ).trim();

    if (response.type === 'ChatPrompt') {
      let contentOverride = '';

      if (response.content === '(skipped)') {
        contentOverride = '(messages attached)';
      } else {
        try {
          const serialized = JSON.parse(response.content);
          // contentOverride = `
          //   Result: ${serialized.result}, Time: ${serialized.time}
          // `.trim();
          contentOverride = ['complete', 'incomplete'].includes(
            serialized.result
          )
            ? `Marked as ${serialized.result}` // complete | incomplete
            : serialized.result; // timeout
        } catch (error) {
          void error;
          //
          // nothing to do here.
          //
        }
        contentOverride += ' (messages attached)';
      }

      response.content = contentOverride.trim();
    }

    if (!accum[identity]) {
      accum[identity] = {};
    }

    if (!accum[identity][response.run_id]) {
      accum[identity][response.run_id] = {};
    }

    if (response.type === 'AnnotationPrompt') {
      const content = '(annotations attached)';
      const value = null;
      const captured = JSON.parse(response.value);
      const annotations = captured.reduce((accum, capture) => {
        const annotation = {
          question: capture.annotation.question,
          answer: capture.annotation.value,
          header: capture.component.header,
          prompt: capture.component.prompt,
          response:
            capture.response.transcript ||
            capture.response.response.transcript ||
            capture.response.response.value
        };
        return accum.concat([annotation]);
      }, []);

      accum[identity][response.run_id][response.response_id] = {
        ...response,
        annotations,
        content,
        value
      };
    } else {
      accum[identity][response.run_id][response.response_id] = response;
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
      transcriptsByRunId: {}
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
    const hasChatMessages = transcripts.some(({ is_joinpart }) => !is_joinpart);
    const transcript = hasChatMessages ? transcripts : [];

    if (isScenarioDataTable) {
      /*

        prompts:    an array of prompts for a single scenario
        responses:  an array of responses from all participants
                    in this scenario.
      */

      const reduced = reduceResponses('user_id', responses);

      for (const user of this.props.cohort.users) {
        const runsForUser = reduced[user.id];
        if (runsForUser) {
          for (let responsesFromRun of Object.values(runsForUser)) {
            const row = [user.id, user.username];

            for (const prompt of prompts) {
              const response = responsesFromRun[prompt.responseId] || {
                content: '',
                response_id: null
              };
              row.push(response);
            }
            rows.push(row);
          }
        }
      }

      tables.push({ prompts, rows, transcript });
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
          const runsForScenario = reduced[scenarioId];
          if (runsForScenario) {
            const prompts = headers;

            for (let responsesFromRun of Object.values(runsForScenario)) {
              const row = [scenario.id, scenario.title];

              for (const prompt of prompts) {
                const response = responsesFromRun[prompt.responseId] || {
                  content: '',
                  response_id: null
                };
                row.push(response);
              }
              rows.push(row);
            }
          }

          tables.push({
            prompts: headers,
            rows,
            transcript
          });
        }
      }
    }

    const transcriptsByRunId = transcripts.reduce((accum, record) => {
      if (!accum[record.run_id]) {
        accum[record.run_id] = [];
      }
      accum[record.run_id].push(record);
      accum[record.run_id].sort((a, b) => a.created_at > b.created_at);
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

    for (const { prompts, rows, transcript } of tables) {
      const subject = isScenarioDataTable
        ? scenarios.find(scenario => scenario.id === scenarioId).title
        : users.find(user => user.id === participantId).username;

      const firstColumnHeader = isScenarioDataTable
        ? 'Participant id'
        : 'Scenario id';
      const secondColumnHeader = isScenarioDataTable
        ? 'Participant'
        : 'Scenario';

      const subjectAndPrompts = [
        `"${firstColumnHeader}"`,
        `"${secondColumnHeader}"`,
        ...prompts.map(prompt => `"${CSV.escape(makeHeader(prompt, prompts))}"`)
      ].join(',');

      let csv = `${subjectAndPrompts}\n`;
      let annotations = [];

      rows.forEach(row => {
        const prepared = row.map(data => {
          if (typeof data === 'number') {
            return data;
          }

          if (typeof data === 'string') {
            return `"${data}"`;
          }

          const response = data || {};
          const isAnnotationContent = (
            (response && response.type) ||
            ''
          ).startsWith('Annotation');
          const isAudioContent = Media.isAudioFile(response.value);
          let { content = '' } = response;

          if (isAnnotationContent && response.annotations.length) {
            const prompt = prompts.find(
              prompt => prompt.responseId === response.response_id
            );
            annotations.push(
              ...response.annotations.reduce((accum, annotation) => {
                accum.push({
                  run_id: response.run_id,
                  scenario_id: response.scenario_id,
                  created_at: response.created_at,
                  user_id: response.user_id,
                  annotation_header: prompt.header,
                  header: annotation.header,
                  prompt: annotation.prompt,
                  response: annotation.response,
                  question: annotation.question,
                  answer: annotation.answer
                });
                return accum;
              }, [])
            );
          }

          if (isAudioContent) {
            content += ` (${location.origin}/api/media/${response.value})`;
          }

          let difference = Moment(response.ended_at).diff(response.created_at);

          if (difference < 0) {
            difference = 0;
          }

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

      console.log('annotations?', annotations);

      if (annotations && annotations.length) {
        const fields = [
          'run_id',
          'scenario_id',
          'created_at',
          'user_id',
          'annotation_header',
          'header',
          'prompt',
          'response',
          'question',
          'answer'
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(annotations);

        files.push(['annotations.csv', csv]);
      }

      if (transcript && transcript.length) {
        const fields = [
          'id',
          'chat_id',
          'user_id',
          'textContent',
          'content',
          'created_at',
          'updated_at',
          'deleted_at',
          'is_quotable',
          'is_joinpart',
          'response_id',
          'recipient_id'
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(transcript);

        files.push(['chat-messages.csv', csv]);
      }
    }

    //
    // Make meta data files
    //
    // meta-cohort.json:
    //
    //    Contains meta information about the cohort, if the responses came from a cohort
    //    JSON parses to an object
    //

    if (cohortId && this.props.cohort) {
      const metaCohort = fastCopy(this.props.cohort);

      metaCohort.cohort_id = metaCohort.id;
      delete metaCohort.id;
      delete metaCohort.chat_id;
      delete metaCohort.chat;
      delete metaCohort.users;
      delete metaCohort.usersById;
      delete metaCohort.scenarios;
      delete metaCohort.roles;
      delete metaCohort.runs;
      // metaCohort.runs = metaCohort.runs.map(run => {
      //   const copy = fastCopy(run);
      //   delete copy.consent_acknowledged_by_user;
      //   delete copy.consent_id;
      //   delete copy.id;
      //   delete copy.updated_at;
      //   return copy;
      // });
      files.push(['meta-cohort.json', JSON.stringify(metaCohort, null, 2)]);

      // meta-participants.json:
      //
      //    Contains meta information about the participant(s) that produced the response data
      //    JSON parses to an array of objects
      //
      const metaParticipants = (this.props.cohort.users || []).map(user => {
        const copy = fastCopy(user);
        copy.participant_id = copy.id;
        delete copy.id;
        delete copy.is_owner;
        delete copy.progress;
        delete copy.roles;
        return copy;
      });

      files.push([
        'meta-participants.json',
        JSON.stringify(metaParticipants, null, 2)
      ]);

      // meta-scenarios.json:
      //
      //    Contains meta information about the scenario(s) that produced the response data
      //    JSON parses to an array objects
      //
      const metaScenarios = (isScenarioDataTable
        ? [this.props.scenariosById[scenarioId]]
        : cohort.scenarios.map(id => this.props.scenariosById[id])
      ).map(scenario => {
        const copy = fastCopy(scenario);
        copy.scenario_id = copy.id;
        delete copy.id;
        delete copy.author;
        delete copy.consent;
        delete copy.deleted_at;
        delete copy.finish;
        delete copy.lock;
        delete copy.status;
        copy.personas = (copy.personas || []).map(persona => {
          const copy = fastCopy(persona);
          delete copy.color;
          delete copy.created_at;
          delete copy.deleted_at;
          delete copy.updated_at;
          delete copy.is_read_only;
          delete copy.is_shared;
          delete copy.is_default;
          return copy;
        });
        copy.users = (copy.users || []).map(user => {
          const copy = fastCopy(user);
          delete copy.is_reviewer;
          delete copy.roles;
          return copy;
        });
        return copy;
      });

      files.push([
        'meta-scenarios.json',
        JSON.stringify(metaScenarios, null, 2)
      ]);
    }

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
      await this.triggerDownload(await this.requestDownload());
    }
  }

  render() {
    const { isScenarioDataTable, isReady, tables } = this.state;
    const { leftColVisible = true, source, usersById } = this.props;
    const { onDataTableMenuClick } = this;
    const leftColHeader = isScenarioDataTable ? 'Participant' : 'Scenario';
    const leftColHidden = !leftColVisible
      ? { className: 'dt__left-col-hidden' }
      : {};

    if (!isReady) {
      return <Loading />;
    }

    return (
      <Fragment>
        {!tables.length ? (
          <Message>
            There is no data recorded yet. Completed scenarios will appear here.
          </Message>
        ) : (
          <DataTableMenu source={source} onClick={onDataTableMenuClick} />
        )}
        {tables.map(({ prompts, rows, transcript }, index) => {
          const messages = source.runId
            ? this.state.transcriptsByRunId[source.runId]
            : transcript;

          const tableKeyBase = `data-table-${index}`;
          const colSpan = rows && rows.length && rows[0].length;

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
                  {rows.reduce((accum, cells, index) => {
                    const runId = cells.reduce((accum, cell) => {
                      if (typeof cell !== 'object') {
                        return accum;
                      }
                      if (accum === null) {
                        return cell.run_id;
                      }
                      return accum;
                    }, null);

                    const chatId = (messages || []).reduce((accum, message) => {
                      if (accum === null && message.run_id === runId) {
                        return message.chat_id;
                      }
                      return accum;
                    }, null);

                    const messagesFromRun =
                      messages && messages.length
                        ? messages.filter(message => message.chat_id === chatId)
                        : null;
                    const key = `${tableKeyBase}-row-${index}`;

                    // Start after the id and scenario name
                    const annotationsFromRun = cells
                      .slice(2)
                      .reduce((accum, cell, index) => {
                        if (cell.annotations && cell.annotations.length) {
                          const prompt = prompts[index];
                          const { annotations } = cell;
                          accum.push({ prompt, annotations });
                        }
                        return accum;
                      }, []);

                    accum.push(
                      <DataTableRow
                        key={key}
                        annotationsFromRun={annotationsFromRun}
                        messagesFromRun={messagesFromRun}
                        isScenarioDataTable={isScenarioDataTable}
                        leftColVisible={leftColVisible}
                        prompts={prompts}
                        cells={cells}
                        rows={rows}
                        rowKey={key}
                        rowIndex={index}
                        transcript={transcript}
                        usersById={usersById}
                      />
                    );
                    return accum;
                  }, [])}

                  {/*
                  <Table.Row>
                    <Table.Cell colSpan={colSpan}>
                      {messages && messages.length ? (
                        <DataTableChatTranscript
                          transcript={messages}
                          usersById={usersById}
                        />
                      ) : null}
                    </Table.Cell>
                  </Table.Row>
                  */}
                </Table.Body>
              </Table>
            </div>
          );
        })}
      </Fragment>
    );
  }
}

const DataTableRow = props => {
  const {
    cells: allCells,
    annotationsFromRun,
    messagesFromRun,
    isScenarioDataTable,
    leftColVisible,
    prompts,
    rowKey,
    usersById
  } = props;
  const computedAttributes = !leftColVisible
    ? { className: 'dt__left-col-hidden' }
    : {};

  const hasAnnotationsFromRun =
    annotationsFromRun && annotationsFromRun.length > 0;

  console.log(annotationsFromRun);

  const hasMessagesFromRun = messagesFromRun && messagesFromRun.length > 0;

  if (hasMessagesFromRun) {
    computedAttributes.rowSpan = '2';
  }

  const cells = allCells.slice(1);
  const subject = cells[0] || '';
  const rowCells = cells.slice(1);
  const promptCountBySlideId = prompts.reduce((accum, prompt) => {
    if (!accum[prompt.slide.id]) {
      accum[prompt.slide.id] = 0;
    }
    accum[prompt.slide.id] = prompt.slide.components.reduce(
      (accum, component) => {
        if (component.responseId) {
          accum += 1;
        }
        return accum;
      },
      0
    );
    return accum;
  }, {});

  return (
    <Fragment>
      <Table.Row>
        <Table.HeaderCell verticalAlign="top" {...computedAttributes}>
          <p>{subject}</p>
        </Table.HeaderCell>

        {rowCells.map((response = {}, cellIndex) => {
          const cellKey = `${rowKey}-cell-${cellIndex}`;
          const modalKey = `${rowKey}-modal-${cellIndex}`;
          const isAnnotationContent = (response.type || '').startsWith(
            'Annotation'
          );
          const isAudioContent = Media.isAudioFile(response.value);
          let { content = '' } = response;

          // microphone
          const display = isAudioContent ? (
            <Fragment>
              {content && content !== response.value ? (
                content
              ) : (
                <audio
                  controls="controls"
                  src={`/api/media/${response.value}`}
                />
              )}
              <Icon name="microphone" />
            </Fragment>
          ) : (
            content
          );

          const className = !content ? 'dt__cell-data-missing' : '';
          const difference = Moment(response.ended_at).diff(
            response.created_at
          );
          const duration = Moment.duration(difference).format(
            Moment.globalFormat
          );

          const trigger = (
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

              {display ? <p style={{ color: 'grey' }}>{duration}</p> : null}
            </Table.Cell>
          );

          const dataModalProps = {
            ...props,
            rows: [cells]
          };
          return isAnnotationContent ? (
            trigger
          ) : (
            <DataModal
              {...dataModalProps}
              index={cellIndex}
              messagesFromRun={messagesFromRun}
              isScenarioDataTable={isScenarioDataTable}
              key={modalKey}
              trigger={trigger}
            />
          );
        })}
      </Table.Row>

      {hasAnnotationsFromRun ? (
        <Table.Row>
          <Table.Cell
            colSpan={rowCells.length}
            name="cell"
            style={{
              cursor: 'pointer'
            }}
            verticalAlign="top"
          >
            {annotationsFromRun.map(({ prompt, annotations }) => {
              return (
                <Table key={Identity.key(annotations)}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan="5">
                        {prompt.header}
                      </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                      <Table.HeaderCell>Header</Table.HeaderCell>
                      <Table.HeaderCell>Prompt</Table.HeaderCell>
                      <Table.HeaderCell>Response</Table.HeaderCell>
                      <Table.HeaderCell>Question</Table.HeaderCell>
                      <Table.HeaderCell>Answer</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {annotations.map(annotation => {
                      return (
                        <Table.Row key={Identity.key(annotation)}>
                          <Table.Cell>{annotation.header}</Table.Cell>
                          <Table.Cell>{annotation.prompt}</Table.Cell>
                          <Table.Cell>{annotation.response}</Table.Cell>
                          <Table.Cell>{annotation.question}</Table.Cell>
                          <Table.Cell>{annotation.answer}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              );
            })}
          </Table.Cell>
        </Table.Row>
      ) : null}
      {hasMessagesFromRun ? (
        <Table.Row>
          {rowCells.reduce((accum, rowCell, rowCellIndex) => {
            if (rowCell.type === 'ChatPrompt') {
              const { content } = rowCell;
              const className = !content ? 'dt__cell-data-missing' : '';
              const rowCellKey = Identity.key({ rowCell, rowCellIndex });
              const slideId = prompts.reduce((accum, prompt) => {
                if (!accum) {
                  if (prompt.responseId === rowCell.response_id) {
                    accum = prompt.slide.id;
                  }
                }
                return accum;
              }, null);
              const colSpan = promptCountBySlideId[slideId];
              const messagesFromSlide = messagesFromRun.reduce(
                (accum, message) => {
                  if (message.response_id === rowCell.response_id) {
                    accum.push(message);
                  }
                  return accum;
                },
                []
              );
              accum.push(
                <Table.Cell
                  colSpan={colSpan}
                  className={className}
                  key={rowCellKey}
                  name="cell"
                  style={{
                    cursor: 'pointer'
                  }}
                  verticalAlign="top"
                >
                  <DataTableChatTranscript
                    transcript={messagesFromSlide}
                    usersById={usersById}
                  />
                </Table.Cell>
              );
            }
            return accum;
          }, [])}
        </Table.Row>
      ) : null}
    </Fragment>
  );
};

DataTableRow.propTypes = {
  annotationsFromRun: PropTypes.array,
  messagesFromRun: PropTypes.array,
  isScenarioDataTable: PropTypes.bool,
  leftColVisible: PropTypes.bool,
  cells: PropTypes.array,
  onClick: PropTypes.func,
  headers: PropTypes.array,
  prompts: PropTypes.array,
  rows: PropTypes.array,
  rowKey: PropTypes.string,
  state: PropTypes.object,
  transcript: PropTypes.array,
  usersById: PropTypes.object
};

DataTable.propTypes = {
  isScenarioDataTable: PropTypes.bool,
  leftColVisible: PropTypes.bool,
  scenarios: PropTypes.array,
  scenariosById: PropTypes.object,
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
  user: PropTypes.object,
  usersById: PropTypes.object
};

const mapStateToProps = state => {
  const { cohort, runsById, scenarios, scenariosById, user, usersById } = state;
  return { cohort, runsById, scenarios, scenariosById, user, usersById };
};

const mapDispatchToProps = dispatch => ({
  getChatTranscriptsByChatId: id => dispatch(getChatTranscriptsByChatId(id)),
  getChatTranscriptsByCohortId: id =>
    dispatch(getChatTranscriptsByCohortId(id)),
  getChatTranscriptsByRunId: id => dispatch(getChatTranscriptsByRunId(id)),
  getChatTranscriptsByScenarioId: id =>
    dispatch(getChatTranscriptsByScenarioId(id)),
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
