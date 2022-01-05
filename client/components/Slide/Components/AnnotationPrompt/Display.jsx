import { type } from './meta';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AudioPlayer from '../AudioPrompt/AudioPlayer';
import Transcript from '../AudioPrompt/Transcript';
import Loading from '@components/Loading';
import {
  Button,
  Card,
  Header,
  Message,
  Pagination,
  Segment
} from '@components/UI';
import PromptRequiredLabel from '../PromptRequiredLabel';
import { getResponse } from '@actions/response';
import { ANSWER_ANNOTATION } from '@hoc/withRunEventCapturing';
import withSocket, {
  RUN_RESPONSE_CREATED,
  RUN_RESPONSE_UPDATED
} from '@hoc/withSocket';
import '../AudioPrompt/AudioPrompt.css';
import Layout from '@utils/Layout';
import Media, { IS_AUDIO_RECORDING_SUPPORTED } from '@utils/Media';
import Storage from '@utils/Storage';

import './AnnotationPrompt.css';

class Display extends Component {
  constructor(props) {
    super(props);

    const { persisted = { value: [] } } = this.props;

    this.state = {
      isReady: false,
      activePage: 0,
      responses: [],
      entries: {},
      value: persisted.value || []
    };

    this.created_at = new Date().toISOString();
    this.onClick = this.onClick.bind(this);
    this.onResponseReceived = this.onResponseReceived.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }
    let { onResponseChange, persisted = {}, responseId } = this.props;
    let { value = [] } = persisted;

    let activePage = null;
    let entries = {};

    if (!value.length) {
      const previous = await this.props.getResponse(
        this.props.run.id,
        responseId
      );

      if (previous && previous.response) {
        value = previous.response.value;
      }
    }

    const responses = [];

    for (let promptResponseId of this.props.prompts) {
      const previous = await this.props.getResponse(
        this.props.run.id,
        promptResponseId
      );
      responses.push(previous);

      if (Array.isArray(value)) {
        const entry = value.find((v, index) => {
          if (v && v.response.response_id === promptResponseId) {
            activePage = index + 1;
            return v;
          }
        });
        entries[promptResponseId] = entry || null;
      }
    }

    const missingAnnotation = responses.find((response, index) => {
      if (!entries[response.response_id]) {
        activePage = index + 1;
        return response;
      }
    });

    if (!missingAnnotation) {
      let name = responseId;
      onResponseChange({}, { name, value, isFulfilled: true });
    }

    this.props.socket.on(RUN_RESPONSE_CREATED, this.onResponseReceived);
    this.props.socket.on(RUN_RESPONSE_UPDATED, this.onResponseReceived);

    this.setState({
      isReady: true,
      activePage,
      entries,
      responses,
      value
    });
  }

  componentWillUnmount() {
    this.props.socket.off(RUN_RESPONSE_CREATED, this.onResponseReceived);
    this.props.socket.off(RUN_RESPONSE_UPDATED, this.onResponseReceived);
  }

  async onResponseReceived(record) {
    const response = await this.props.getResponse(
      this.props.run.id,
      record.response_id
    );

    const entries = this.state.entries;
    const responses = this.state.responses;
    const index = responses.findIndex(
      ({ response_id }) => response_id === record.response_id
    );

    if (index !== -1) {
      responses[index] = {
        ...response
      };
    } else {
      responses.push(response);
    }

    this.setState({
      responses,
      entries: {
        ...entries,
        [record.response_id]: null
      }
    });
  }

  onClick(event, { isFulfilled, component, name, value, response }) {
    const { question, responseId, run } = this.props;
    const { created_at } = this;
    const ended_at = new Date().toISOString();
    let responses = this.state.responses.slice();
    let activePage = this.state.activePage;
    let entries = {
      ...this.state.entries
    };

    const annotation = {
      question,
      value
    };

    const context = {
      responseId,
      annotation,
      component,
      response
    };

    this.props.saveRunEvent(ANSWER_ANNOTATION, context);

    entries[name] = context;

    const annotations = Object.values(entries);

    const data = {
      created_at,
      ended_at,
      isFulfilled,
      name: responseId,
      type,
      value: annotations
    };

    Storage.set(`run/${run.id}/${responseId}`, data);

    let nextActivePage = activePage;

    const missingAnnotation = responses.find((response, index) => {
      if (!entries[response.response_id]) {
        nextActivePage = index + 1;
        return response;
      }
    });

    if (!missingAnnotation) {
      // This is necessary to "release" the hold made by required
      // response prompts.
      data.isFulfilled = false;
      data.isFulfillmentOverride = true;
      this.props.onResponseChange(event, data);
    } else {
      activePage = nextActivePage;
    }

    this.setState({
      activePage,
      entries,
      value: annotations
    });
  }

  onPageChange(event, { activePage }) {
    this.setState({
      ...this.state,
      activePage
    });
  }

  render() {
    const { onClick, onPageChange } = this;
    const { activePage, entries, isReady, responses } = this.state;
    const {
      isEmbeddedInSVG,
      question,
      required,
      run,
      scenario: { slides }
    } = this.props;

    if (!this.isScenarioRun || isEmbeddedInSVG) {
      return (
        <Message
          floating
          content="Participant responses will appear here during scenario run."
        />
      );
    }

    if (!isReady) {
      return (
        <Fragment>
          <Segment style={{ height: '300px' }}>
            <Header as="h3" tabIndex="0">
              {question}
            </Header>
            <Loading />
          </Segment>
        </Fragment>
      );
    }

    const missingAnnotation = responses.find(response => {
      if (!entries[response.response_id]) {
        return response;
      }
    });

    const activeResponseIndex = activePage - 1;
    const responseToAnnotate = responses[activeResponseIndex];

    const isFulfilled = !missingAnnotation;
    const header = (
      <Header as="h3" tabIndex="0">
        {question} {required && <PromptRequiredLabel fulfilled={isFulfilled} />}
      </Header>
    );

    const slideAndComponentAssociatedWithPrompt = slides.reduce(
      (accum, slide) => {
        const component = slide.components.find(
          ({ responseId }) => responseId === responseToAnnotate.response_id
        );
        if (component) {
          return {
            slide,
            component
          };
        }
        return accum;
      },
      undefined
    );

    const existing = entries[responseToAnnotate.response_id];

    const sharedButtonProps = {
      component: slideAndComponentAssociatedWithPrompt.component,
      response: responseToAnnotate,
      name: responseToAnnotate.response_id,
      onClick
    };

    const yesButton = {
      ...sharedButtonProps,
      icon:
        existing && existing.annotation.value === 'Yes' ? 'checkmark' : null,
      style: {
        background: 'rgb(115, 181, 128)'
      },
      value: 'Yes',
      content: 'Yes'
    };

    const noButton = {
      ...sharedButtonProps,
      icon: existing && existing.annotation.value === 'No' ? 'checkmark' : null,
      style: {
        background: 'rgb(217, 33, 32)',
        color: '#fff'
      },
      value: 'No',
      content: 'No'
    };

    const emptyButton = {
      ...sharedButtonProps,
      icon:
        existing && existing.annotation.value === 'No data'
          ? 'checkmark'
          : null,
      value: 'No data',
      content: 'No data'
    };

    const answerRecorded = responseToAnnotate && responseToAnnotate.response;
    let answerContent = answerRecorded
      ? answerRecorded.transcript ||
        answerRecorded.content ||
        answerRecorded.value
      : null;

    let answerContentDisplay = (
      <p>
        <strong>{answerContent}</strong>
      </p>
    );

    if (
      answerRecorded &&
      answerRecorded.isAudioPlayback &&
      IS_AUDIO_RECORDING_SUPPORTED
    ) {
      const src = Media.fileToMediaURL(answerRecorded.value);
      const audioProps = {
        controlsList: 'nodownload',
        controls: true,
        src
      };

      answerContentDisplay = (
        <div>
          <AudioPlayer {...audioProps} />
          <Transcript
            responseId={responseToAnnotate.response_id}
            run={run}
            transcript={answerRecorded.transcript}
          />
        </div>
      );
    }

    const urlToSlideWithThisComponent = `${window.location.pathname.slice(
      0,
      window.location.pathname.lastIndexOf('/')
    )}/${slideAndComponentAssociatedWithPrompt.slide.slide_number}`;

    const buttonGroupProps = {
      fluid: true
    };

    if (Layout.isNotForMobile()) {
      buttonGroupProps.widths = 3;
    }

    return responseToAnnotate ? (
      <Fragment>
        <Segment attached="top" className="ap__border-bottom-zero">
          {header}
          <Card fluid>
            <Card.Content>
              <Card.Header>
                {slideAndComponentAssociatedWithPrompt.component.prompt}
              </Card.Header>
              <Card.Meta>
                (From slide #
                {slideAndComponentAssociatedWithPrompt.slide.slide_number})
              </Card.Meta>
              <Card.Description>
                You answered:
                {answerContentDisplay}
                {/*answerRecorded.isEmpty ? (
                  <Button
                    fluid
                    as="a"
                    content={`Return to slide #${slideAndComponentAssociatedWithPrompt.slide.slide_number} to respond to this prompt`}
                    href={urlToSlideWithThisComponent}
                  />
                ) : null*/}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button.Group {...buttonGroupProps}>
                <Button {...yesButton} />
                <Button.Or />
                <Button {...noButton} />
                <Button.Or />
                <Button {...emptyButton} />
              </Button.Group>
            </Card.Content>
          </Card>
        </Segment>
        <Pagination
          borderless
          attached="bottom"
          className="ap__border-top-zero"
          name="agents"
          activePage={activePage}
          siblingRange={1}
          boundaryRange={0}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          onPageChange={onPageChange}
          totalPages={responses.length}
        />
      </Fragment>
    ) : null;
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  getResponse: PropTypes.func,
  chat: PropTypes.object,
  onResponseChange: PropTypes.func,
  persisted: PropTypes.object,
  prompts: PropTypes.array,
  question: PropTypes.any,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object,
  socket: PropTypes.object,
  type: PropTypes.oneOf([type])
};

const mapStateToProps = state => {
  const { chat, scenario, run, responsesById, user } = state;
  return { chat, scenario, run, responsesById, user };
};

const mapDispatchToProps = dispatch => ({
  getResponse: (...params) => dispatch(getResponse(...params))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Display)
);
