import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form } from '@components/UI';
// import { defaultValue } from './';
import { type } from './meta';
import { createInteraction, setInteraction } from '@actions/interaction';
import AgentSelector from '@components/Slide/Components/AgentSelector';
import DataHeader from '@components/Slide/Components/DataHeader';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import './TextResponse.css';
import '@components/Slide/SlideEditor/SlideEditor.css';

class TextResponseEditor extends React.Component {
  constructor(props) {
    super(props);
    const {
      agent = null,
      header = '',
      prompt = '',
      placeholder = '',
      recallId = '',
      recallShares,
      responseId = ''
    } = props.value;
    this.state = {
      agent,
      header,
      prompt,
      placeholder,
      recallId,
      recallShares,
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

    let shouldCallUpdateState = false;

    const fields = [
      'agent',
      'header',
      'placeholder',
      'prompt',
      'recallId',
      'recallShares'
    ];

    for (let field of fields) {
      if (this.props.value[field] !== this.state[field]) {
        shouldCallUpdateState = true;
        break;
      }
    }

    if (shouldCallUpdateState) {
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
      agent,
      header,
      prompt,
      placeholder,
      recallId,
      recallShares,
      responseId
    } = this.state;
    this.props.onChange({
      ...this.props.value,
      agent,
      header,
      prompt,
      placeholder,
      recallId,
      recallShares,
      responseId,
      type
    });
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value }, this.delayedUpdateState);
  }

  onRecallChange({ recallId, recallShares }) {
    this.setState({ recallId, recallShares }, this.updateState);
  }

  render() {
    const {
      agent,
      header,
      prompt,
      placeholder,
      recallId,
      recallShares
    } = this.state;
    const { scenario, slideIndex } = this.props;
    const { onChange, onRecallChange, updateState } = this;
    const promptAriaLabel = 'Optional prompt to display before the input:';
    const placeholderAriaLabel = 'Placeholder text displayed inside the input:';

    return (
      <Form>
        <Container fluid>
          <ResponseRecall
            isEmbedded={true}
            onChange={onRecallChange}
            parentResponseId={this.props.value.responseId}
            scenario={scenario}
            slideIndex={slideIndex}
            value={{ recallId, recallShares }}
          />
          <Form.TextArea
            name="prompt"
            label={promptAriaLabel}
            aria-label={promptAriaLabel}
            rows={1}
            value={prompt}
            onChange={onChange}
            onBlur={updateState}
          />
          <Form.Input
            name="placeholder"
            label={placeholderAriaLabel}
            aria-label={placeholderAriaLabel}
            value={placeholder}
            onChange={onChange}
            onBlur={updateState}
          />

          <AgentSelector
            label="Optional AI agent to receive responses:"
            agent={agent}
            type={type}
            onChange={onChange}
          />

          <DataHeader
            content={header}
            onChange={onChange}
            onBlur={updateState}
          />
        </Container>
      </Form>
    );
  }
}

TextResponseEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  slideIndex: PropTypes.any,
  scenario: PropTypes.object,
  value: PropTypes.shape({
    agent: PropTypes.object,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    header: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    recallShares: PropTypes.array,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type])
  })
};

export default TextResponseEditor;
