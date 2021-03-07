import { type } from './meta';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getResponse } from '@actions/response';
import withSocket, {
  AWAITING_AGENT,
  AGENT_RESPONSE_RECEIVED
} from '@hoc/withSocket';
import * as Components from '@components/Slide/Components';
import Conditional, { terms } from '@utils/Conditional';
import Identity from '@utils/Identity';

class Display extends Component {
  constructor(props) {
    super(props);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    // if (!this.isScenarioRun) {
    //   this.setState({
    //     isReady: true
    //   });
    //   return;
    // }

  }

  render() {
    const {
      component,
      onResponseChange,
      run,
      saveRunEvent
    } = this.props;

    const ComponentDisplay = component
      ? Components[component.type].Display
      : null;


    const saveRunEventWithComponent = (name, context) => {
      saveRunEvent.call(this.props, name, {
        ...context,
        component
      });
    };


    return (
      <ComponentDisplay
        {...this.props.component}
        onResponseChange={onResponseChange}
        saveRunEvent={saveRunEventWithComponent}
        run={run}
      />
    );
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  getResponse: PropTypes.func,
  isRecording: PropTypes.bool,
  onResponseChange: PropTypes.func,
  persisted: PropTypes.object,
  placeholder: PropTypes.string,
  prompt: PropTypes.string,
  recallId: PropTypes.string,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  type: PropTypes.oneOf([type, 'AudioResponse'])
};

const mapStateToProps = state => {
  const { run } = state;
  return { run };
};

const mapDispatchToProps = dispatch => ({
  getResponse: params => dispatch(getResponse(params))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Display)
);
