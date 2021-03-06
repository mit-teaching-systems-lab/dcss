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
      isActive: false
    };

    this.slideIndex = Number(
      location.href.slice(location.href.lastIndexOf('/') + 1)
    );
    this.timerNodes = [];
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

    this.props.socket.on(TIMER_START, this.timerStart);
    this.props.socket.on(TIMER_END, this.timerEnd);
    this.props.socket.on(TIMER_TICK, this.timerTick);
  }

  componentWillUnmount() {
    this.props.socket.off(TIMER_START, this.timerStart);
    this.props.socket.off(TIMER_END, this.timerEnd);
    this.props.socket.off(TIMER_TICK, this.timerTick);
  }

  timerStart() {
    if (this.state.isActive) {
      return;
    }

    this.setState({
      isActive: true
    });

    if (this.props.onTimerStart) {
      this.props.onTimerStart();
    }
  }

  timerEnd(data) {
    const { result } = data;

    if (data.slide.index !== this.slideIndex) {
      return;
    }

    const { chat, user } = this.props;

    const slide = {
      index: this.slideIndex
    };

    this.setState({
      isActive: false
    });

    if (this.props.onTimerEnd) {
      this.props.onTimerEnd({ chat, slide, result, user });
    }
  }

  timerTick({ timeout }) {
    this.timerNodes
      .filter(Boolean)
      .forEach(node => (node.innerText = Media.secToTime(timeout)));
  }

  render() {
    const { auto, chat, isAllowedToStartTimer, slide, timeout } = this.props;
    const { isActive } = this.state;

    if (!this.isScenarioRun) {
      return null;
    }

    const timerValue = timeout ? Media.secToTime(timeout) : '';

    const startOrAutoIcon = auto ? (
      <Icon name="stopwatch" style={{ color: 'grey' }} />
    ) : (
      <Icon className="icon-primary" name="play" />
    );

    const startOrClockIcon = isActive ? (
      <Icon className="icon-primary" name="stopwatch" />
    ) : (
      startOrAutoIcon
    );

    const timerDisplay = (
      <Ref innerRef={node => this.timerNodes.push(node)}>
        <span>{timerValue}</span>
      </Ref>
    );

    const startTimerOrWaiting =
      !isAllowedToStartTimer && !isActive && auto
        ? 'Waiting for participants'
        : 'Start discussion timer';

    const startOrClockText = isActive ? timerDisplay : startTimerOrWaiting;

    const startOrStopButton = (
      <Menu.Item
        className="cpd__timer icon-primary"
        onClick={() => {
          if (!isActive && !auto) {
            this.props.socket.emit(TIMER_START, { chat, slide, timeout });
          }
        }}
      >
        {startOrClockIcon} {startOrClockText}
      </Menu.Item>
    );

    return isAllowedToStartTimer ? (
      startOrStopButton
    ) : (
      <Menu.Item className="cpd__timer">
        <Icon className="icon-primary" name="stopwatch" />
        {timerDisplay}
      </Menu.Item>
    );
  }
}

Timer.propTypes = {
  auto: PropTypes.bool,
  chat: PropTypes.object,
  isAllowedToStartTimer: PropTypes.bool,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  onTimerEnd: PropTypes.func,
  onTimerStart: PropTypes.func,
  onTimerTick: PropTypes.func,
  run: PropTypes.object,
  socket: PropTypes.object,
  slide: PropTypes.object,
  timeout: PropTypes.number,
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
