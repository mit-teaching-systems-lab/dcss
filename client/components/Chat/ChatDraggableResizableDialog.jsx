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
    let x = this.state.x;
    let y = this.state.y;

    const container = document.querySelector('.react-draggable');

    if (!container) {
      return;
    }

    const parent = container.offsetParent;

    const left = parent.offsetWidth + parent.offsetLeft;
    const right = left + container.offsetWidth;

    const top = parent.offsetTop;
    const bottom = top + container.offsetHeight;

    const availableX = document.body.offsetWidth;
    const availableY = document.body.offsetHeight;

    if (right > availableX && x === 0) {
      x = availableX - right;
    }

    if (bottom > availableY && y === 0) {
      y = availableY - right;
    }

    this.setState({
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
        background: 'unset',
        position: 'relative',
        width: '100%'
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

    const size = {
      width,
      height
    };

    const position = {
      x,
      y
    };

    if (isMinimized) {
      size.height = 0;
      position.x = 0;
      position.y = 0;
    }

    const adjustPositionIfMinimized = node => {
      let styles = {};

      if (node) {
        if (Layout.isNotForMobile()) {
          if (isMinimized) {
            styles = {
              // position: 'absolute',
              // width: '500px',
              // top: '-54px'
              position: 'relative',
              top: 'unset',
              width: '100%',
              zIndex: 'unset !important'
            };
          }
        } else {
          if (isMinimized) {
            styles = {
              position: 'sticky'
            };
          } else {
            styles = {
              position: 'absolute'
            };
          }
        }
      }

      for (let [key, value] of Object.entries(styles)) {
        node.style.setProperty(key, value);
      }
    };

    return (
      <Ref innerRef={adjustPositionIfMinimized}>
        {Layout.isNotForMobile() ? (
          <Rnd
            bounds="window"
            dragHandleClassName="c__drag-handle"
            resizeHandleWrapperClass="c__size-handle"
            disableDragging={isMinimized}
            minHeight={isMinimized ? 0 : BASE_HEIGHT}
            minWidth={BASE_WIDTH}
            onDragStart={onDragResizeStart}
            onDragStop={onDragStop}
            onResizeStart={onDragResizeStart}
            onDrag={onDrag}
            onResize={onResize}
            onResizeStop={onResizeStop}
            position={position}
            size={size}
            style={rndStyle}
          >
            {dialogBox}
          </Rnd>
        ) : (
          dialogBox
        )}
      </Ref>
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
    y: 0
  }
};

export default ChatDraggableResizableDialog;
