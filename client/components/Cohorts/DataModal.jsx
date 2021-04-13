import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Header, Modal, Table } from '@components/UI';
import SplitPane from 'react-split-pane';
import Moment from '@utils/Moment';
import Media from '@utils/Media';
import Identity from '@utils/Identity';
import ContentSlide from '@components/Scenario/ContentSlide';
import DataTableChatTranscript from '@components/Cohorts/DataTableChatTranscript';
import AudioPlayer from '@components/Slide/Components/AudioPrompt/AudioPlayer';
import Transcript from '@components/Slide/Components/AudioPrompt/Transcript';
import './DataTable.css';
import './Resizer.css';

const DataModal = props => {
  const { index, isScenarioDataTable, prompts, rows, usersById } = props;
  const component = prompts[index];
  const { header, prompt, slide, responseId: response_id } = component;
  const ariaLabelledby = Identity.id();
  const ariaDescribedby = Identity.id();
  const transcript =
    props.transcript && props.transcript.length
      ? props.transcript.filter(message => message.response_id === response_id)
      : null;

  return (
    <Modal
      closeIcon
      className="dtm__view"
      size="fullscreen"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      trigger={props.trigger}
    >
      <Header className="dtm__header" id={ariaLabelledby}>
        Responses In Context
      </Header>
      <Modal.Content id={ariaDescribedby} scrolling className="dtm__scroll">
        <Modal.Description>
          <SplitPane split="vertical" minSize={500} defaultSize={500}>
            <div>
              <ContentSlide
                slide={slide}
                isContextual={true}
                isLastSlide={false}
                onClickBack={null}
                onClickNext={null}
                onResponseChange={null}
              />
            </div>
            <div className="dt__scroll">
              <Table celled striped selectable role="grid">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell
                      scope="col"
                      className="dt__scrollable-th"
                      colSpan={2}
                    >
                      {header || prompt}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {rows.map((row, rowIndex) => {
                    let { 0: left = '', [index + 1]: response = {} } = row;

                    const { created_at, ended_at, value } = response;
                    const isAudioContent = Media.isAudioFile(value);
                    const { content = '' } = response;
                    const difference = Moment(ended_at).diff(created_at);
                    const duration = Moment.duration(difference).format(
                      Moment.globalFormat
                    );

                    // {content && content !== response.value ? (
                    //   content
                    // ) : (
                    //   <audio
                    //     controls="controls"
                    //     src={`/api/media/${response.value}`}
                    //   />
                    // )}
                    // <Icon name="microphone" />

                    const display = isAudioContent ? (
                      <Fragment>
                        <AudioPlayer src={response.value} />
                        <Transcript transcript={response.content} />
                      </Fragment>
                    ) : (
                      content
                    );

                    const rowCells = isScenarioDataTable ? (
                      <Fragment>
                        <Table.HeaderCell verticalAlign="top">
                          <p>{left}</p>
                        </Table.HeaderCell>
                        <Table.Cell>
                          <p>{display}</p>

                          {display && (
                            <p
                              style={{
                                color: 'grey'
                              }}
                            >
                              {duration}
                            </p>
                          )}
                        </Table.Cell>
                      </Fragment>
                    ) : (
                      <Table.Cell colSpan={2}>
                        <p>{display}</p>

                        {display && (
                          <p
                            style={{
                              color: 'grey'
                            }}
                          >
                            {duration}
                          </p>
                        )}
                      </Table.Cell>
                    );

                    return (
                      <Table.Row key={`modal-${slide.id}-${rowIndex}`}>
                        {rowCells}
                      </Table.Row>
                    );
                  })}

                  {transcript ? (
                    <Table.Row>
                      <Table.Cell colSpan={2}>
                        <DataTableChatTranscript
                          transcript={transcript}
                          usersById={usersById}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ) : null}
                </Table.Body>
              </Table>
            </div>
          </SplitPane>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

DataModal.propTypes = {
  isScenarioDataTable: PropTypes.bool,
  leftColVisible: PropTypes.bool,
  cells: PropTypes.array,
  onClick: PropTypes.func,
  headers: PropTypes.array,
  index: PropTypes.number,
  prompts: PropTypes.array,
  rows: PropTypes.array,
  rowKey: PropTypes.string,
  state: PropTypes.object,
  transcript: PropTypes.array,
  trigger: PropTypes.node,
  usersById: PropTypes.object
};

export default DataModal;
