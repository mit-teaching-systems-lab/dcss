import { type } from './meta';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAgentResponses } from '@actions/agent';
import withSocket, {
  AWAITING_AGENT,
  AGENT_RESPONSE_CREATED
} from '@hoc/withSocket';
import * as Components from '@components/Slide/Components';
import Conditional, { terms } from '@utils/Conditional';
import Identity from '@utils/Identity';
import Payload from '@utils/Payload';

class Display extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      responses: []
    };

    this.onAgentResponseReceived = this.onAgentResponseReceived.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    const { agent, run, user } = this.props;

    if (!this.isScenarioRun || !(agent && agent.id)) {
      return;
    }

    const responses = await this.props.getAgentResponses(agent, run, user);

    const payload = Payload.compose(
      this.props,
      {
        agent
      }
    );

    this.props.socket.on(
      AGENT_RESPONSE_CREATED,
      this.onAgentResponseReceived
    );
    this.props.socket.emit(AWAITING_AGENT, payload);

    this.setState({
      isReady: true,
      responses
    });
  }

  onAgentResponseReceived({ response }) {
    const responses = this.state.responses.slice();
    responses.push(response);
    this.setState({
      responses
    });
  }

  render() {
    const { component, onResponseChange, run, saveRunEvent } = this.props;

    const rules = this.props.rules.slice();

    const { isReady, responses } = this.state;

    if (!isReady) {
      return null;
    }

    const ComponentDisplay = component
      ? Components[component.type].Display
      : null;

    const saveRunEventWithComponent = (name, context) => {
      saveRunEvent.call(this.props, name, {
        ...context,
        component
      });
    };

    const sumOfAffirmative = responses.reduce(
      (accum, { response }) => accum + Number(response.result),
      0
    );

    let x = {};

    while (rules.length) {
      let { key, value } = rules.shift();

      if (Conditional.isLogicalOp(key)) {
        let next = rules.shift();
        value = {
          [next.key]: next.value
        };
      }
      console.log(key, value);
      x = {
        ...x,
        [key]: value
      };
    }

    const where = {
      x
    };

    const data = {
      x: sumOfAffirmative
    };

    const mustShowConditionalContent = Conditional.evaluate(data, where);

    return component && mustShowConditionalContent ? (
      <ComponentDisplay
        {...this.props.component}
        onResponseChange={onResponseChange}
        saveRunEvent={saveRunEventWithComponent}
        run={run}
      />
    ) : null;
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  chat: PropTypes.object,
  getAgentResponses: PropTypes.func,
  isEmbeddedInSVG: PropTypes.bool,
  id: PropTypes.string,
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
  type: PropTypes.oneOf([type, 'ConditionalContent']),
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { chat, user } = state;
  return { chat, user };
};

const mapDispatchToProps = dispatch => ({
  getAgentResponses: (agent, run, user) =>
    dispatch(getAgentResponses(agent, run, user))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Display)
);
