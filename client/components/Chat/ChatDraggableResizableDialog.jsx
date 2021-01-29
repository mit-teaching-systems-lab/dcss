import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
import { Ref } from '@components/UI';
import Layout from '@utils/Layout';

import './Chat.css';

const outerBaseClassNames =
  'ui modal transition visible active c__container-modal';
const outerMinClassName = `${outerBaseClassNames} c__minimized`;
const outerMaxClassName = `${outerBaseClassNames} resizable`;

const BASE_HEIGHT = 590;
const BASE_WIDTH = 430;

const BASE_X = 0;
const BASE_Y = 100;

const rndStyleUserSelectNone = {
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none'
};

const rndStyleUserSelectAuto = {
  WebkitUserSelect: 'auto',
  WebkitTouchCallout: 'auto',
  MozUserSelect: 'auto',
  msUserSelect: 'auto',
  userSelect: 'auto'
};

class ChatDraggableResizableDialog extends Component {
  constructor(props) {
    super(props);

    const {
      dimensions: { height = BASE_HEIGHT, width = BASE_WIDTH },
      position: { x, y }
    } = this.props;

    const rndStyle = {};

    this.state = {
      width,
      height,
      x,
      y,
      rndStyle
    };

    this.ref = null;
  }

  componentDidMount() {
    const width = this.state.width || BASE_WIDTH;
    const height = this.state.height || BASE_HEIGHT;
    const x = this.state.x || BASE_X;
    const y = this.state.y || BASE_Y;
    this.setState({
      height,
      width,
      x,
      y
    });
  }

  render() {
    const { children, isMinimized } = this.props;

    const { height, width, x, y } = this.state;

    if (!width || !height) {
      return null;
    }

    let outerMinMaxClassName = isMinimized
      ? outerMinClassName
      : outerMaxClassName;

    let rndStyle = {
      ...this.state.rndStyle,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'solid 1px #ddd',
      background: '#f0f0f0'
    };

    if (isMinimized) {
      rndStyle = {
        border: 'unset',
        background: 'unset'
        // display: 'none'
      };
    }

    const onDragResizeStart = () => {
      this.setState({
        rndStyle: {
          ...rndStyleUserSelectNone
        }
      });

      if (this.props.onDragResizeStart) {
        this.props.onDragResizeStart();
      }
    };

    const onDragResizeStop = data => {
      this.setState({
        rndStyle: {
          ...rndStyleUserSelectAuto
        }
      });
      if (this.props.onDragResizeStop) {
        this.props.onDragResizeStop(data);
      }
    };

    const updateState = ({ height, width, x, y }) => {
      this.setState({ height, width, x, y });
      return {
        height,
        width,
        x,
        y
      };
    };

    const onDragStop = (e, { x, y }) => {
      onDragResizeStop(
        updateState({
          ...this.state,
          x,
          y
        })
      );
    };

    const onResize = (e, direction, resizer, delta, position) => {
      const height = Math.max(parseInt(resizer.style.height), BASE_HEIGHT);
      const width = Math.max(parseInt(resizer.style.width), BASE_WIDTH);
      const update = {
        height,
        width,
        ...position
      };
      this.setState(update);
      if (this.props.onDragResize) {
        this.props.onDragResize(update);
      }
    };

    const onDrag = (e, { x, y }) => {
      const update = {
        ...this.state,
        x,
        y
      };
      if (this.props.onDragResize) {
        this.props.onDragResize(update);
      }
    };

    const onResizeStop = (e, direction, resizer, delta, position) => {
      const height = Math.max(parseInt(resizer.style.height), BASE_HEIGHT);
      const width = Math.max(parseInt(resizer.style.width), BASE_WIDTH);
      onDragResizeStop(
        updateState({
          height,
          width,
          ...position
        })
      );
    };

    const dialogBox = (
      <Ref innerRef={node => (this.ref = node)}>
        <div role="dialog" className={outerMinMaxClassName}>
          {children}
        </div>
      </Ref>
    );

    return Layout.isNotForMobile() ? (
      <Rnd
        resizeHandleWrapperClass="c__size-handle"
        dragHandleClassName="c__drag-handle"
        minHeight={BASE_HEIGHT}
        minWidth={BASE_WIDTH}
        position={{ x, y }}
        size={{ width, height }}
        style={rndStyle}
        onDragStart={onDragResizeStart}
        onDragStop={onDragStop}
        onResizeStart={onDragResizeStart}
        onDrag={onDrag}
        onResize={onResize}
        onResizeStop={onResizeStop}
      >
        {dialogBox}
      </Rnd>
    ) : (
      dialogBox
    );
  }
}

ChatDraggableResizableDialog.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  dimensions: PropTypes.object,
  isMinimized: PropTypes.bool,
  onDragResizeStart: PropTypes.func,
  onDragResize: PropTypes.func,
  onDragResizeStop: PropTypes.func,
  position: PropTypes.object
};

ChatDraggableResizableDialog.defaultProps = {
  dimensions: {
    width: BASE_WIDTH,
    height: BASE_HEIGHT
  },
  position: {
    x: 0,
    y: 100
  }
};

export default ChatDraggableResizableDialog;
