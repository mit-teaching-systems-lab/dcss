import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { type } from './meta';
import { getResponse } from '@actions/response';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';
import { Form, Header, Segment } from '@components/UI';
import PromptRequiredLabel from '../PromptRequiredLabel';
import {
  TEXT_INPUT_CHANGE,
  TEXT_INPUT_ENTER,
  TEXT_INPUT_EXIT
} from '@hoc/withRunEventCapturing';

import './TextResponse.css';

class Display extends Component {
  constructor(props) {
    super(props);

    const { persisted = { value: '' } } = this.props;

    this.state = {
      value: persisted.value
    };

    this.defaultValue = persisted.value;
    this.created_at = '';
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    let { onResponseChange, persisted = {}, responseId, run } = this.props;

    let { name = responseId, value = '' } = persisted;

    if (!value && run.id) {
      const previous = await this.props.getResponse({
        id: run.id,
        responseId
      });

      if (previous && previous.response) {
        value = previous.response.value;
      }
    }

    if (value) {
      onResponseChange({}, { name, value, isFulfilled: true });
      this.setState({ value });
    }
  }

  onBlur() {
    const { value } = this.state;

    if (this.defaultValue !== value) {
      this.props.saveRunEvent(TEXT_INPUT_CHANGE, {
        value
      });
    }

    this.props.saveRunEvent(TEXT_INPUT_EXIT, {
      value
    });

    this.defaultValue = value;
  }

  onFocus() {
    if (!this.created_at) {
      this.created_at = new Date().toISOString();
    }
    const { value } = this.state;
    this.props.saveRunEvent(TEXT_INPUT_ENTER, {
      value
    });
  }

  onChange(event, { name, value }) {
    const { created_at } = this;

    this.props.onResponseChange(event, {
      created_at,
      ended_at: new Date().toISOString(),
      name,
      type,
      value
    });

    this.setState({ value });
  }

  render() {
    const {
      isEmbeddedInSVG,
      prompt,
      placeholder,
      recallId,
      required,
      responseId,
      run
    } = this.props;

    console.log(this.props);
    const { value } = this.state;
    const { onBlur, onFocus, onChange } = this;
    const fulfilled = value ? true : false;
    const header = (
      <React.Fragment>
        {prompt} {required && <PromptRequiredLabel fulfilled={fulfilled} />}
      </React.Fragment>
    );

    return (
      <Segment>
        <Header as="h3" tabIndex="0">
          {header}
        </Header>
        {recallId && <ResponseRecall run={run} recallId={recallId} />}

        {isEmbeddedInSVG ? (
          <Form.TextArea />
        ) : (
          <Form>
            <Form.TextArea
              name={responseId}
              placeholder={placeholder}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={onChange}
              defaultValue={value}
            />
          </Form>
        )}
      </Segment>
    );
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  getResponse: PropTypes.func,
  onResponseChange: PropTypes.func,
  persisted: PropTypes.object,
  placeholder: PropTypes.string,
  prompt: PropTypes.string,
  recallId: PropTypes.string,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  type: PropTypes.oneOf([type]).isRequired
};

const mapStateToProps = state => {
  const { run } = state;
  return { run };
};

const mapDispatchToProps = dispatch => ({
  getResponse: params => dispatch(getResponse(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Display);
