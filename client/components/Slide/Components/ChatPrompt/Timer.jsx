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

    if (this.props.isAutostart && !this.props.isComplete) {
      const { chat, slide, timer } = this.props;

      this.props.socket.emit(TIMER_START, { chat, slide, timer });
    }
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
    const { chat, timer } = this.props;

    const slide = {
      index: this.slideIndex
    };

    this.setState({
      isActive: true
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

    this.setState({
      isActive: false
    });

    console.log('Timer: timerEnd');
    if (this.props.onTimerEnd) {
      this.props.onTimerEnd({ chat, slide, result });
    }
  }

  timerTick({ timer }) {
    console.log('?????????????');
    this.timerNodes
      .filter(Boolean)
      .forEach(node => (node.innerText = Media.secToTime(timer)));
  }

  render() {
    const { timerStart, timerEnd } = this.props;
    const { chat, slide, timer, user } = this.props;
    const { isActive } = this.state;

    if (!this.isScenarioRun) {
      return null;
    }

    const isUserHost = chat.host_id === user.id;
    const timerValue = timer ? Media.secToTime(timer) : '';

    const startOrClockIcon = isActive ? (
      <Icon className="icon-primary" name="clock outline" />
    ) : (
      <Icon className="icon-primary" name="play" />
    );

    const timerDisplay = (
      <Ref innerRef={node => this.timerNodes.push(node)}>
        <span>{timerValue}</span>
      </Ref>
    );

    const startOrClockText = isActive ? timerDisplay : 'Start discussion timer';

    const startOrStopButton = (
      <Menu.Item
        className="cpd__timer icon-primary"
        onClick={() => {
          if (!isActive) {
            this.props.socket.emit(TIMER_START, { chat, slide, timer });
          }
        }}
      >
        {startOrClockIcon} {startOrClockText}
      </Menu.Item>
    );

    return isUserHost ? (
      startOrStopButton
    ) : (
      <Menu.Item className="cpd__timer">
        <Icon className="icon-primary" name="clock outline" />
        {timerDisplay}
      </Menu.Item>
    );
  }
}

Timer.propTypes = {
  chat: PropTypes.object,
  isAutostart: PropTypes.bool,
  required: PropTypes.bool,
  responseId: PropTypes.string,
  onTimerEnd: PropTypes.func,
  onTimerStart: PropTypes.func,
  onTimertick: PropTypes.func,
  run: PropTypes.object,
  socket: PropTypes.object,
  slide: PropTypes.object,
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
