import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form } from 'semantic-ui-react';
import { type } from './meta';
import DataHeader from '@components/Slide/Components/DataHeader';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import './TextResponse.css';
import '@components/Slide/SlideEditor/SlideEditor.css';

class TextResponseEditor extends React.Component {
  constructor(props) {
    super(props);
    const {
      header = '',
      prompt = 'Text Prompt (displayed before input field as label)',
      placeholder = '',
      recallId = '',
      responseId = ''
    } = props.value;
    this.state = {
      header,
      prompt,
      placeholder,
      recallId,
      responseId
    };

    this.onChange = this.onChange.bind(this);
    this.onRecallChange = this.onRecallChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.delayUpdateState = this.delayUpdateState.bind(this);
    this.timeout = null;
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
    this.updateState();
  }

  delayUpdateState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.updateState, 5000);
  }

  render() {
    const { header, prompt, placeholder, recallId } = this.state;
    const { scenarioId, slideIndex } = this.props;
    const { onChange, onRecallChange, updateState } = this;
    return (
      <Form>
        <Container fluid>
          <ResponseRecall
            value={{ recallId }}
            slideIndex={slideIndex}
            scenarioId={scenarioId}
            onChange={onRecallChange}
          />
          <Form.TextArea
            label="Prompt"
            name="prompt"
            value={prompt}
            onChange={onChange}
            onBlur={updateState}
          />
          <Form.Input
            label="Placeholder"
            name="placeholder"
            value={placeholder}
            onChange={onChange}
            onBlur={updateState}
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

  updateState() {
    const { header, prompt, placeholder, recallId, responseId } = this.state;
    this.props.onChange({
      header,
      prompt,
      placeholder,
      recallId,
      responseId,
      type
    });
  }

  onRecallChange({ recallId }) {
    this.setState({ recallId }, this.updateState);
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value }, this.updateState);
  }

  toggleOptional(event, { index }) {
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }
}

TextResponseEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  slideIndex: PropTypes.any,
  scenarioId: PropTypes.any,
  value: PropTypes.shape({
    id: PropTypes.string,
    placeholder: PropTypes.string,
    header: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type])
  })
};

export default TextResponseEditor;
