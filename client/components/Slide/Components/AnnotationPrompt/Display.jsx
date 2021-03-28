import { type } from './meta';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Header, Message, Pagination, Segment } from '@components/UI';
import PromptRequiredLabel from '../PromptRequiredLabel';
import Username from '@components/User/Username';
import Transcript from '../AudioPrompt/Transcript';
import { connect } from 'react-redux';
import { getChatUsersSharedResponses } from '@actions/chat';
import { getResponse } from '@actions/response';
import {
  ANSWER_ANNOTATION
} from '@hoc/withRunEventCapturing';
import '../AudioPrompt/AudioPrompt.css';
import Identity from '@utils/Identity';
import Payload from '@utils/Payload';
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
    this.onPageChange = this.onPageChange.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }
    let { onResponseChange, persisted = {}, responseId, run } = this.props;
    let { name = responseId } = persisted;
    let activePage = null;
    let entries = {};
    let value = persisted.value || [];

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

      if (value && value.length) {
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
      onResponseChange({}, { name, value, isFulfilled: true });
    }

    this.setState({
      isReady: true,
      activePage,
      entries,
      responses,
      value
    });
  }

  onClick(
    event,
    { isFulfilled, component, name, value, response }
  ) {
    const {
      question,
      responseId,
      run
    } = this.props;
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
      name,
      type,
      value: annotations
    };

    Storage.set(`run/${run.id}/${responseId}`, data);

    const nextActivePage = activePage;

    const missingAnnotation = responses.find((response, index) => {
      if (!entries[response.response_id]) {
        nextActivePage = index + 1;
        return response;
      }
    });

    if (!missingAnnotation) {
      // This is necessary to "release" the hold made by required
      // response prompts.
      data.isFulfilled = true;
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
    const { activePage, entries, isReady, responses, value } = this.state;
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
      return null;
    }

    const missingAnnotation = responses.find((response) => {
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

    const slideAndComponentAssociatedWithPrompt = slides.reduce((accum, slide) => {
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
    }, undefined);

    const existing = entries[responseToAnnotate.response_id];

    const sharedButtonProps = {
      component: slideAndComponentAssociatedWithPrompt.component,
      response: responseToAnnotate,
      name: responseToAnnotate.response_id,
      onClick
    };

    const yesButton = {
      ...sharedButtonProps,
      icon: existing && existing.annotation.value === 'Yes' ? 'checkmark' : null,
      style: {
        background: 'rgb(115, 181, 128)'
      },
      value: 'Yes',
      content: 'Yes',
    };

    const noButton = {
      ...sharedButtonProps,
      icon: existing && existing.annotation.value === 'No' ? 'checkmark' : null,
      style: {
        background: 'rgb(217, 33, 32)',
        color: '#fff'
      },
      value: 'No',
      content: 'No',
    };

    return responseToAnnotate ? (
      <Fragment>
        <Segment
          attached="top"
          className="ap__border-bottom-zero"
        >
          {header}
          <Card fluid>
            <Card.Content>
              <Card.Header>{slideAndComponentAssociatedWithPrompt.component.prompt}</Card.Header>
              <Card.Meta>(From slide #{slideAndComponentAssociatedWithPrompt.slide.slide_number})</Card.Meta>
              <Card.Description>
                You answered:

                <p>
                  <strong>
                    {responseToAnnotate.response.transcript ||
                      responseToAnnotate.response.content ||
                      responseToAnnotate.response.value}
                  </strong>
                </p>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button.Group fluid widths={2}>
                <Button {...yesButton} />
                <Button.Or />
                <Button {...noButton} />
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
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object,
  type: PropTypes.oneOf([type])
};

const mapStateToProps = state => {
  const { chat, scenario, run, responsesById, user } = state;
  return { chat, scenario, run, responsesById, user };
};

const mapDispatchToProps = dispatch => ({
  getResponse: (...params) => dispatch(getResponse(...params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Display);
