import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Chat from '@components/Chat';
import { type } from './meta';

class Display extends Component {
  constructor(props) {
    super(props);

    this.created_at = '';
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }
  }

  onBlur() {
    // const { value } = this.state;
    // if (this.defaultValue !== value) {
    //   this.props.saveRunEvent(TEXT_INPUT_CHANGE, {
    //     value
    //   });
    // }
    // this.props.saveRunEvent(TEXT_INPUT_EXIT, {
    //   value
    // });
    // this.defaultValue = value;
  }

  onFocus() {
    // if (!this.created_at) {
    //   this.created_at = new Date().toISOString();
    // }
    // const { value } = this.state;
    // this.props.saveRunEvent(TEXT_INPUT_ENTER, {
    //   value
    // });
  }

  onChange(event, { name, value }) {
    // const { created_at } = this;
    // this.props.onResponseChange(event, {
    //   created_at,
    //   ended_at: new Date().toISOString(),
    //   name,
    //   type,
    //   value
    // });
    // this.setState({ value });
  }

  render() {
    const { chat, isEmbeddedInSVG, timer } = this.props;

    if (isEmbeddedInSVG || !this.isScenarioRun) {
      return null;
    }

    //
    //
    // TODO: need a way to trigger a timer
    //
    // - send an onSend?
    //
    //
    return chat ? <Chat chat={chat} /> : null;
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  chat: PropTypes.object,
  isEmbeddedInSVG: PropTypes.bool,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  timer: PropTypes.number,
  type: PropTypes.oneOf([type]).isRequired
};

const mapStateToProps = state => {
  const { chat, run } = state;
  return { chat, run };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Display);