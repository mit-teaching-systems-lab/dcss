import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@components/UI';

const OPEN_TIME = 500;
const CLOSE_TIME = 1000;

export default function withTransitions(Component) {
  class ToastTransition extends React.Component {
    static propTypes = {
      id: PropTypes.number,
      onClose: PropTypes.func,
      openAnimation: PropTypes.string,
      closeAnimation: PropTypes.string,
      time: PropTypes.number
    };

    static defaultProps = {
      time: 2000
    };

    state = {
      visible: false,
      time: OPEN_TIME,
      animation: this.props.openAnimation
    };

    timeout = null;

    onClose = () => {
      this.setState(
        prevState => ({
          visible: !prevState.visible,
          animation: this.props.closeAnimation,
          time: CLOSE_TIME
        }),
        () => {
          setTimeout(() => {
            if (this.timeout) {
              clearTimeout(this.timeout);
            }

            this.props.onClose(this.props.id);
          }, CLOSE_TIME);
        }
      );
    };

    componentDidMount() {
      // schedule auto closing of toast
      if (this.props.time) {
        this.timeout = setTimeout(this.onClose, this.props.time);
      }

      // start animation as soon as toast is mounted in the dom
      this.setState({ visible: true });
    }

    render() {
      const {
        id,
        openAnimation,
        closeAnimation,
        time: timeProp,
        onClose,
        ...props
      } = this.props;
      const { time, visible, animation } = this.state;
      const styles = {
        marginBottom: '1em'
      };

      return (
        <Transition animation={animation} duration={time} visible={visible}>
          <div style={styles} role="presentation">
            <Component {...props} onClose={this.onClose} />
          </div>
        </Transition>
      );
    }
  }

  return ToastTransition;
}
