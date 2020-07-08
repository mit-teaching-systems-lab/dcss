import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import { Container, Form, Message } from '@components/UI';
import { type } from './meta';
import DataHeader from '@components/Slide/Components/DataHeader';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import './AudioResponse.css';
import '@components/Slide/SlideEditor/SlideEditor.css';

class AudioResponseEditor extends Component {
  constructor(props) {
    super(props);
    const { header = '', prompt = '', recallId = '', responseId } = props.value;

    this.state = {
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

    const { header, prompt, recallId, responseId } = this.props.value;

    const lastProps = {
      header,
      prompt,
      recallId,
      responseId
    };

    if (hash(this.state) !== hash(lastProps)) {
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
    const { header, prompt, recallId, responseId } = this.state;

    this.props.onChange({
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
    const { header, prompt, recallId } = this.state;
    const { scenarioId, slideIndex } = this.props;
    const { onChange, onRecallChange, updateState } = this;

    return (
      <Form>
        <Container fluid>
          <ResponseRecall
            isEmbedded={true}
            value={{ recallId }}
            scenarioId={scenarioId}
            slideIndex={slideIndex}
            onChange={onRecallChange}
          />

          <Form.TextArea
            label="Enter text content to display before the audio recording controls:"
            name="prompt"
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

AudioResponseEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  scenarioId: PropTypes.any,
  slideIndex: PropTypes.any,
  value: PropTypes.shape({
    id: PropTypes.string,
    header: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type])
  })
};

export default AudioResponseEditor;
