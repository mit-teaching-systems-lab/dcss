import { type } from './meta';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, List, Segment } from '@components/UI';
import PromptRequiredLabel from '../PromptRequiredLabel';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Display';
import { connect } from 'react-redux';
import { getResponse } from '@actions/response';
import { BUTTON_PRESS } from '@hoc/withRunEventCapturing';
import * as Color from '@utils/Color';
import Identity from '@utils/Identity';

class Display extends React.Component {
  constructor(props) {
    super(props);

    const { persisted = { value: '' } } = this.props;

    this.state = {
      value: persisted.value
    };

    this.created_at = new Date().toISOString();
    this.onClick = this.onClick.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    let { persisted = {}, responseId, run } = this.props;

    let { name = responseId, value = '' } = persisted;

    if (!value && run.id) {
      const previous = await this.props.getResponse(run.id, responseId);

      if (previous && previous.response) {
        value = previous.response.value;
      }
    }

    if (value) {
      this.props.onResponseChange({}, { name, value, isFulfilled: true });
      this.setState({ value });
    }
  }

  onClick(event, { name, value, content }) {
    if (!this.isScenarioRun) {
      event.stopPropagation();
      return false;
    }

    const { created_at } = this;
    const { recallId } = this.props;

    this.props.saveRunEvent(BUTTON_PRESS, {
      prompt: this.props.prompt,
      responseId: this.props.responseId,
      content,
      value
    });

    this.props.onResponseChange(event, {
      content,
      created_at,
      ended_at: new Date().toISOString(),
      name,
      recallId,
      type,
      value
    });

    this.setState({ value });
  }

  render() {
    const {
      buttons,
      prompt,
      recallId,
      recallSharedWithRoles,
      required,
      responseId,
      run
    } = this.props;
    const { value, value: previousValue } = this.state;
    const { onClick } = this;
    const fulfilled = value ? true : false;
    const header = (
      <React.Fragment>
        {prompt} {required && <PromptRequiredLabel fulfilled={fulfilled} />}
      </React.Fragment>
    );

    return buttons && buttons.length ? (
      <Segment>
        <Header as="h3" tabIndex="0">
          {header}
        </Header>
        {recallId ? (
          <ResponseRecall
            run={run}
            recallId={recallId}
            recallSharedWithRoles={recallSharedWithRoles}
          />
        ) : null}
        <List>
          {buttons.map(({ color, display, value }, index) => {
            const selectedIcon =
              previousValue === value ? { icon: 'checkmark' } : {};

            const key = Identity.key({ color, display, value, index });

            const buttonStyle = {
              background: `${color}`,
              color: `${Color.foregroundColor(color, '#000000')}`
            };

            const buttonProps = {
              content: display,
              fluid: true,
              key,
              name: responseId,
              onClick,
              style: color ? buttonStyle : null,
              value,
              ...selectedIcon
            };

            return (
              <List.Item key={`list.item-${index}`}>
                <Button {...buttonProps} />
              </List.Item>
            );
          })}
        </List>
      </Segment>
    ) : null;
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  buttons: PropTypes.array,
  getResponse: PropTypes.func,
  onResponseChange: PropTypes.func,
  persisted: PropTypes.object,
  prompt: PropTypes.string,
  recallId: PropTypes.string,
  recallSharedWithRoles: PropTypes.array,
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
  getResponse: (...params) => dispatch(getResponse(...params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Display);
