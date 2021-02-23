import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import TimeField from 'react-simple-timefield';
import { Container, Form, Grid, Icon, Text } from '@components/UI';
import { type } from './meta';
import DataHeader from '@components/Slide/Components/DataHeader';
import Media from '@utils/Media';
import './ChatPrompt.css';

class ChatPromptEditor extends React.Component {
  constructor(props) {
    super(props);
    const {
      header = '',
      prompt = '',
      required = false,
      responseId = '',
      timer = 0
    } = props.value;
    this.state = {
      header,
      prompt,
      required: timer ? true : required,
      responseId,
      timer
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
      'header',
      'prompt',
      // 'required',
      'timer'
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
    const { header, prompt, timer, required, responseId } = this.state;
    this.props.onChange({
      header,
      prompt,
      required,
      responseId,
      timer,
      type
    });
  }

  onTimerChange(event, value) {
    const timer = Media.timeToSec(value);
    const update = {
      timer
    };

    if (timer) {
      update.required = true;
    }

    this.setState(update, this.delayedUpdateState);
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value }, this.delayedUpdateState);
  }

  enforceRequiredWhenTimerIsSet() {
    this.props.onChange({
      required: true
    });
    return null;
  }

  render() {
    const { header, prompt, timer } = this.state;
    const { onChange, onTimerChange, updateState } = this;

    const timerString = timer ? Media.secToTime(timer) : '';

    const [hh = 0, mm = 0, ss = 0] = timerString.split(':').map(v => Number(v));

    const promptAriaLabel = 'Optional prompt to display for this discussion:';
    const timerAriaLabel = 'Set a maximum time for discussion on this slide.';

    // console.log("required", required);
    // console.log("timer", timer);

    // <div className="ui ">
    return (
      <Form>
        <Container fluid>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Form.Field>
                  <label htmlFor="timer">
                    Set a maximum time for discussion on this slide.
                  </label>
                  <div className="ui input">
                    <TimeField
                      showSeconds
                      colon=":"
                      name="timer"
                      id="timer"
                      aria-label={timerAriaLabel}
                      onChange={onTimerChange}
                      onBlur={updateState}
                      value={timerString}
                    />
                  </div>
                </Form.Field>
              </Grid.Column>
              <Grid.Column className="cpe__displaytime-outer">
                <Text size="large" styl>
                  {hh} {pluralize('hour', hh)} {mm} {pluralize('minute', mm)}{' '}
                  {ss} {pluralize('second', ss)}{' '}
                </Text>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <p className="cpe__paragraph">
                  <Icon name="attention" />
                  If the timer is set, the discussion will be marked{' '}
                  <strong>Required</strong>. This ensures that participants
                  cannot move forward until completing the discussion. Hosts
                  will be able to override the timer.
                </p>
                <p className="cpe__paragraph">
                  <Icon name="attention" />
                  Set the timer to 00:00:00 for an unlimited discussion time.
                </p>
                <p className="cpe__paragraph">
                  <Icon name="attention" />
                  If no timer is set and this chat is set to{' '}
                  <strong>Required</strong>, the host <strong>must</strong>{' '}
                  close the discussion before participants can proceed.
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Form.TextArea
                  name="prompt"
                  label={promptAriaLabel}
                  aria-label={promptAriaLabel}
                  rows={1}
                  value={prompt}
                  onChange={onChange}
                  onBlur={updateState}
                />
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
    header: PropTypes.string,
    prompt: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    timer: PropTypes.number,
    type: PropTypes.oneOf([type])
  })
};

export default ChatPromptEditor;
