import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import TimeField from 'react-simple-timefield';
import { Container, Form, Grid } from '@components/UI';
import { defaultValue } from './';
import { type } from './meta';
import DataHeader from '@components/Slide/Components/DataHeader';
import Media from '@utils/Media';

class ChatPromptEditor extends React.Component {
  constructor(props) {
    super(props);
    const {
      header = '',
      timer = 0,
      required = false,
      responseId = ''
    } = props.value;
    this.state = {
      header,
      timer,
      required,
      responseId
    };

    this.onChange = this.onChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.timeout = null;
  }

  shouldComponentUpdate(newProps) {
    const fields = Object.getOwnPropertyNames(defaultValue({}));

    for (let field of fields) {
      if (newProps.value[field] !== this.props.value[field]) {
        return true;
      }
    }

    return true;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);

    let shouldCallUpdateState = false;

    const fields = ['header', 'timer', 'required'];

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
    const { header, timer, required, responseId } = this.state;
    this.props.onChange({
      header,
      timer,
      required,
      responseId,
      type
    });
  }

  onChange(event, value) {
    const update = {
      timer: Media.timeToSec(value)
    };

    if (value) {
      update.required = true;
    }
    this.setState(update, this.delayedUpdateState);
  }

  render() {
    const { header, timer } = this.state;
    const { scenario, slideIndex } = this.props;
    const { onChange, updateState } = this;
    const promptAriaLabel = 'Set a maximum time for discussion on this slide.';

    const timerString = timer ? Media.secToTime(timer) : '';

    const [hh, mm, ss] = timerString.split(':').map(v => Number(v));

    // <div className="ui ">
    return (
      <Form>
        <Container fluid>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  (NOT YET IMPLEMENTED)
                  <label htmlFor="timer">
                    Set a maximum time for discussion on this slide.
                  </label>
                  <div className="ui input">
                    <TimeField
                      showSeconds
                      colon=":"
                      name="timer"
                      id="timer"
                      aria-label={promptAriaLabel}
                      onChange={onChange}
                      onBlur={updateState}
                      value={timerString}
                    />
                  </div>
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                {hh} {pluralize('hour', hh)} {mm} {pluralize('minute', mm)} {ss}{' '}
                {pluralize('second', ss)}{' '}
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
    timer: PropTypes.number,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type])
  })
};

export default ChatPromptEditor;
