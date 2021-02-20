import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Chat from '@components/Chat';
import { Button, Dropdown, Icon, Menu } from '@components/UI';
import Identity from '@utils/Identity';
import { type } from './meta';
import './ChatPrompt.css';

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
    const { chat, isEmbeddedInSVG, timer, user } = this.props;

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

    const isUserHost = chat.host_id === user.id;
    const timerValue = '00:00';

    return (
      <Fragment>
        <Menu borderless>
          {isUserHost ? (
            <Dropdown
              item
              simple
              text="Close discussion as..."
              onChange={() => {
                alert('Not implemented');
              }}
            >
              <Dropdown.Menu>
                <Dropdown.Item>Complete</Dropdown.Item>
                <Dropdown.Item>Incomplete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : null}
          <Menu.Item>
            <div className="ui transparent icon input">
              <input
                className="prompt cp__timer"
                type="text"
                defaultValue={timerValue}
              />
              <i className="clock outline icon" />
            </div>
          </Menu.Item>
          <Menu.Menu position="right">
            {chat ? (
              <Chat key={Identity.key(window.location.href)} chat={chat} />
            ) : null}
          </Menu.Menu>
        </Menu>
      </Fragment>
    );
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
  type: PropTypes.oneOf([type]).isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { chat, run, user } = state;
  return { chat, run, user };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Display);
