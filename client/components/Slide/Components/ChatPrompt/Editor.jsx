import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import AgentSelector from '@components/Slide/Components/AgentSelector';
import TimeField from 'react-simple-timefield';
import {
  Checkbox,
  Container,
  Form,
  Grid,
  Icon,
  Segment,
  Text
} from '@components/UI';
import { type } from './meta';
import DataHeader from '@components/Slide/Components/DataHeader';
import Media from '@utils/Media';
import './ChatPrompt.css';

class ChatPromptEditor extends React.Component {
  constructor(props) {
    super(props);
    const {
      agent = null,
      auto = true,
      header = '',
      prompt = '',
      required = false,
      responseId = '',
      timeout = 0,
      welcome = '',
    } = props.value;
    this.state = {
      agent,
      auto,
      header,
      prompt,
      required: timeout ? true : required,
      responseId,
      timeout,
      welcome,
    };

    this.enforceRequiredWhenTimerIsSet = this.enforceRequiredWhenTimerIsSet.bind(
      this
    );
    this.onChange = this.onChange.bind(this);
    this.onTimerChange = this.onTimerChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.timeout = null;

    if (required !== this.state.required) {
      this.enforceRequiredWhenTimerIsSet();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);

    let shouldCallUpdateState = false;

    const fields = [
      'agent',
      'auto',
      'header',
      'prompt',
      // 'required',
      'timeout',
      'welcome',
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
    this.timeout = setTimeout(this.updateState, 5000);
  }

  updateState() {
    const {
      agent,
      auto,
      header,
      prompt,
      welcome,
      timeout,
      required,
      responseId
    } = this.state;
    this.props.onChange({
      ...this.props.value,
      agent,
      auto,
      header,
      prompt,
      required,
      responseId,
      timeout,
      type,
      welcome,
    });
  }

  onTimerChange(event, value) {
    const timeout = Media.timeToSec(value);
    const update = {
      timeout
    };

    if (timeout) {
      update.required = true;
    }

    this.setState(update, this.delayedUpdateState);
  }

  onChange(event, { name, value, checked }) {
    console.log('???????????????');
    if (name === 'auto') {
      value = checked;
    }
    this.setState({ [name]: value }, this.updateState);
  }

  enforceRequiredWhenTimerIsSet() {
    this.props.onChange({
      required: true
    });
    return null;
  }

  render() {
    const { agent, auto, header, prompt, timeout, welcome } = this.state;
    const { onChange, onTimerChange, updateState } = this;
    const timeoutString = timeout ? Media.secToTime(timeout) : '';
    const [hh = 0, mm = 0, ss = 0] = timeoutString
      .split(':')
      .map(v => Number(v));
    const promptAriaLabel = 'Optional prompt to display for this discussion:';
    const timeoutAriaLabel = 'Max duration for this discussion:';
    const welcomeAriaLabel = 'Optional welcome message to display in the chat:';
    const autoAriaLabel =
      'Automatically start the discussion timer when participants arrive?';
    const timeDisplay = [
      hh ? `${hh} ${pluralize('hour', hh)}` : '',
      mm ? `${mm} ${pluralize('minute', mm)}` : '',
      ss ? `${ss} ${pluralize('second', ss)}` : ''
    ].join(' ');

    return (
      <Form>
        <Container fluid>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Form.Field>
                  <label htmlFor="timeout">{timeoutAriaLabel}</label>
                  <div className="ui input">
                    <TimeField
                      showSeconds
                      colon=":"
                      name="timeout"
                      id="timeout"
                      onChange={onTimerChange}
                      onBlur={updateState}
                      value={timeoutString}
                    />
                  </div>
                </Form.Field>
              </Grid.Column>
              <Grid.Column className="cpe__displaytime-outer">
                <Text size="large">{timeDisplay}</Text>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="cpe__gridrow" columns={1}>
              <Grid.Column>
                <Form.Field>
                  <Checkbox
                    name="auto"
                    id="auto"
                    defaultChecked={auto}
                    label={autoAriaLabel}
                    onChange={onChange}
                    onBlur={updateState}
                  />
                </Form.Field>

                <Segment>
                  <p tabIndex="0" className="cpe__paragraph">
                    <Icon name="attention" />
                    Set the timeout to 00:00:00 for an unlimited discussion
                    time.
                  </p>
                  <p tabIndex="0" className="cpe__paragraph">
                    <Icon name="attention" />
                    If the timeout is set, the discussion will be marked{' '}
                    <strong>Required</strong>. This ensures that participants
                    cannot move forward until completing the discussion. Hosts
                    will be able to override the timeout.
                  </p>
                  <p tabIndex="0" className="cpe__paragraph">
                    <Icon name="attention" />
                    If no timeout is set and this chat is set to{' '}
                    <strong>Required</strong>, the host <strong>must</strong>{' '}
                    close the discussion before participants can proceed. If no
                    timeout is set and this chat is not{' '}
                    <strong>not Required</strong>, the discussion can be
                    optionally closed.
                  </p>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                {/*
                <Form.TextArea
                  name="prompt"
                  label={promptAriaLabel}
                  aria-label={promptAriaLabel}
                  rows={1}
                  value={prompt}
                  onChange={onChange}
                  onBlur={updateState}
                />
                */}
                <Form.TextArea
                  name="welcome"
                  label={welcomeAriaLabel}
                  aria-label={welcomeAriaLabel}
                  rows={2}
                  value={welcome}
                  onChange={onChange}
                  onBlur={updateState}
                />
                <AgentSelector agent={agent} type={type} onChange={onChange} />
              </Grid.Column>
            </Grid.Row>
          </Grid>

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

ChatPromptEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  slideIndex: PropTypes.any,
  scenario: PropTypes.object,
  value: PropTypes.shape({
    id: PropTypes.string,
    auto: PropTypes.bool,
    header: PropTypes.string,
    prompt: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    timeout: PropTypes.number,
    type: PropTypes.oneOf([type]),
    welcome: PropTypes.string,
  })
};

export default ChatPromptEditor;
