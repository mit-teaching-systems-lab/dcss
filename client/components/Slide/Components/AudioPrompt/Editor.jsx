import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { Container, Form, Message } from '@components/UI';
import { type } from './meta';
// import AgentSelector from '@components/Slide/Components/AgentSelector';
import DataHeader from '@components/Slide/Components/DataHeader';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import './AudioPrompt.css';
import '@components/Slide/SlideEditor/SlideEditor.css';

class AudioPromptEditor extends Component {
  constructor(props) {
    super(props);
    const {
      // agent = null,
      header = '',
      prompt = '',
      recallId = '',
      responseId
    } = props.value;

    this.state = {
      // agent,
      header,
      prompt,
      recallId,
      responseId
    };
    this.onChange = this.onChange.bind(this);
    this.onRecallChange = this.onRecallChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.timeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);

    const {
      // agent,
      header, prompt, recallId, responseId } = this.props.value;

    const lastProps = {
      // agent,
      header,
      prompt,
      recallId,
      responseId
    };

    if (Identity.key(this.state) !== Identity.key(lastProps)) {
      this.updateState();
    }
  }

  delayedUpdateState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(this.updateState, 500);
  }

  updateState() {
    const {
      // agent,
      header, prompt, recallId, responseId } = this.state;

    this.props.onChange({
      // agent,
      header,
      prompt,
      recallId,
      responseId,
      type
    });
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value }, this.delayedUpdateState);
  }

  onRecallChange({ recallId }) {
    this.setState({ recallId }, this.updateState);
  }

  render() {
    const {
      // agent,
      header, prompt, recallId } = this.state;
    const { scenario, slideIndex } = this.props;
    const { onChange, onRecallChange, updateState } = this;

          // <AgentSelector
          //   label="Optional AI agent:"
          //   agent={agent}
          //   type={type}
          //   onChange={onChange}
          // />

    return (
      <Form>
        <Container fluid>
          <ResponseRecall
            isEmbedded={true}
            value={{ recallId }}
            scenario={scenario}
            slideIndex={slideIndex}
            onChange={onRecallChange}
          />

          <Form.TextArea
            label="Optional prompt to display before the audio recording controls:"
            name="prompt"
            rows={1}
            value={prompt}
            onChange={onChange}
            onBlur={updateState}
          />

          <DataHeader
            content={header}
            onChange={onChange}
            onBlur={updateState}
          />

          <Message
            icon="warning sign"
            color="orange"
            content="This component will fallback to a text input prompt when the participant's browser or device does not support audio recording."
          />
        </Container>
      </Form>
    );
  }
}

AudioPromptEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  scenario: PropTypes.object,
  slideIndex: PropTypes.any,
  value: PropTypes.shape({
    id: PropTypes.string,
    header: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type, 'AudioResponse'])
  })
};

export default AudioPromptEditor;
