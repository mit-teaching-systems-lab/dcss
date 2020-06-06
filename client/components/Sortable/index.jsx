import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import RSortable from 'react-sortablejs';
import './Sortable.css';

const getDroppableStyle = (isDraggingOver, overflow) => {
  return {
    pointerEvents: isDraggingOver ? 'none' : '',
    background: isDraggingOver ? 'rgba(255, 215, 0, 0.25)' : '',
    overflow
  };
};

const getDraggableStyle = (isDragging, draggableStyle) => {
  return {
    background: isDragging ? 'rgba(255, 215, 0, 0.75)' : '',
    ...draggableStyle
  };
};

export { Draggable, getDroppableStyle, getDraggableStyle };

class Sortable extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  shouldComponentUpdate(nextProps) {
    return shallowCompare(this, nextProps);
  }
  onChange(result) {
    if (!result.destination || !this.props.onChange) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    this.props.onChange(result.source.index, result.destination.index);
  }
  render() {
    const { onChange } = this;
    const {
      children,
      hasOwnDraggables,
      isAuthorized = true,
      tag = '',
      ...rest
    } = this.props;

    if (!children || !children.length) {
      return null;
    }

    if (!isAuthorized) {
      return <Table.Body>{children}</Table.Body>;
    }

    if (tag) {
      const onSortableChange = (...args) => {
        onChange({
          source: {
            index: args[2].oldDraggableIndex
          },
          destination: {
            index: args[2].newDraggableIndex
          }
        });
      };

      const {
        className = '',
        options = {},
        tableRef = React.createRef()
      } = rest;

      return (
        <RSortable
          tag={tag}
          className={className}
          onChange={onSortableChange}
          options={options}
          ref={tableRef}
        >
          {children}
        </RSortable>
      );
    }

    return (
      <DragDropContext onDragEnd={onChange}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <div
              className="sortable__draggable-outer-container"
              ref={droppableProvided.innerRef}
              style={getDroppableStyle(
                droppableSnapshot.isDraggingOver,
                this.props.overflow
              )}
            >
              {children.map((child, index) => {
                if (hasOwnDraggables) {
                  return child;
                } else {
                  return (
                    <Draggable
                      key={`draggable-key-${index}`}
                      draggableId={`draggable-id-${index}`}
                      index={index}
                    >
                      {(draggableProvided, draggableSnapshot) => {
                        const {
                          draggableProps,
                          dragHandleProps,
                          innerRef
                        } = draggableProvided;
                        return (
                          <div
                            {...draggableProps}
                            {...dragHandleProps}
                            ref={innerRef}
                            style={getDraggableStyle(
                              draggableSnapshot.isDragging,
                              draggableProps.style
                            )}
                          >
                            {child}
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                }
              })}

              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

Sortable.propTypes = {
  isAuthorized: PropTypes.bool,
  children: PropTypes.array,
  hasOwnDraggables: PropTypes.bool,
  onChange: PropTypes.func,
  overflow: PropTypes.any,
  tag: PropTypes.string
};

export default Sortable;
