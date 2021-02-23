import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Menu, Ref } from '@components/UI';
import Media from '@utils/Media';
import withSocket, {
  TIMER_TICK,
  TIMER_START,
  // TIMER_STOP,
  TIMER_END
} from '@hoc/withSocket';

class Timer extends Component {
  constructor(props) {
    super(props);

    this.created_at = '';

    this.state = {
      // true once the timer starts
      // changes when timer is paused/resumed
      isActive: false,
      // true once the timer starts
      // only changes once
      isStarted: false
    };

    this.slideIndex = Number(
      location.href.slice(location.href.lastIndexOf('/') + 1)
    );
    this.timerNode = null;
    this.timerStart = this.timerStart.bind(this);
    this.timerEnd = this.timerEnd.bind(this);
    this.timerTick = this.timerTick.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    this.props.socket.on(TIMER_END, this.timerEnd);
    this.props.socket.on(TIMER_TICK, this.timerTick);
  }

  componentWillUnmount() {
    this.props.socket.off(TIMER_END, this.timerEnd);
    this.props.socket.off(TIMER_TICK, this.timerTick);
  }

  timerStart() {
    if (this.state.isStarted) {
      return;
    }

    const { chat, timer } = this.props;

    const slide = {
      index: this.slideIndex
    };
    this.props.socket.emit(TIMER_START, { chat, slide, timer });
    this.setState({
      isStarted: true
    });

    if (this.props.onTimerStart) {
      this.props.onTimerStart();
    }
  }

  timerEnd({ result }) {
    const { chat } = this.props;

    const slide = {
      index: this.slideIndex
    };

    if (this.props.onTimerEnd) {
      this.props.onTimerEnd({ chat, slide, result });
    }
  }

  timerTick(data) {
    this.timerNode.innerText = Media.secToTime(data.timer);
  }

  render() {
    const { timerStart, timerEnd } = this.props;
    const { chat, timer, user } = this.props;
    const { isStarted } = this.state;

    if (!this.isScenarioRun) {
      return null;
    }

    const isUserHost = chat.host_id === user.id;
    const timerValue = timer ? Media.secToTime(timer) : '';

    const startOrClockIcon = isStarted ? (
      <Icon className="icon-primary" name="clock outline" />
    ) : (
      <Icon className="icon-primary" name="play" />
    );

    const timerDisplay = (
      <Ref innerRef={node => (this.timerNode = node)}>
        <span>{timerValue}</span>
      </Ref>
    );

    const startOrClockText = !isStarted ? 'Start timer' : timerDisplay;

    const startOrStopButton = (
      <Menu.Item
        className="icon-primary"
        onClick={() => {
          if (!isStarted) {
            this.timerStart();
          }
        }}
      >
        {startOrClockIcon} {startOrClockText}
      </Menu.Item>
    );

    return isUserHost ? (
      startOrStopButton
    ) : (
      <Menu.Item>
        <Icon className="icon-primary" name="clock outline" />
        {timerDisplay}
      </Menu.Item>
    );
  }
}

Timer.propTypes = {
  chat: PropTypes.object,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  onTimerEnd: PropTypes.func,
  onTimerStart: PropTypes.func,
  onTimertick: PropTypes.func,
  run: PropTypes.object,
  socket: PropTypes.object,
  timer: PropTypes.number,
  timerStart: PropTypes.func,
  timerEnd: PropTypes.func,
  timerTick: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { chat, run, user } = state;
  return { chat, run, user };
};
export default withSocket(
  connect(
    mapStateToProps,
    null
  )(Timer)
);
