import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import RSortable from 'react-sortablejs';
import './Sortable.css';

const getDroppableStyle = (isDraggingOver, overflow) => ({
    // background: isDraggingOver ? 'gold' : '',
    overflow
});

const getDraggableStyle = (isDragging, draggableStyle) => {
    return {
        // padding: isDragging ? '1em' : '',
        // margin: isDragging ? `0 0 1em 0` : '',
        // height: isDragging ? '80%' : 'auto',
        // height: isDragging ? '100px' : 'auto',
        background: isDragging ? 'gold' : '',
        ...draggableStyle
    };
};

class Sortable extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
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
        const { children, handle = null, tag = '', ...rest } = this.props;

        if (!children || !children.length) {
            return null;
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
                            {children.map((child, index) => (
                                <Draggable
                                    key={`draggable-key-${index}`}
                                    draggableId={`draggable-id-${index}`}
                                    disableInteractiveElementBlocking={false}
                                    index={index}
                                >
                                    {(draggableProvided, draggableSnapshot) => {
                                        const {
                                            draggableProps,
                                            dragHandleProps,
                                            innerRef
                                        } = draggableProvided;

                                        const implicitHandle = !handle
                                            ? dragHandleProps
                                            : {};

                                        const explicitHandle = handle
                                            ? dragHandleProps
                                            : {};

                                        return (
                                            <div
                                                ref={innerRef}
                                                {...draggableProps}
                                                {...implicitHandle}
                                                style={getDraggableStyle(
                                                    draggableSnapshot.isDragging,
                                                    draggableProps.style
                                                )}
                                            >
                                                {handle && (
                                                    <Icon
                                                        {...explicitHandle}
                                                        name={handle}
                                                    />
                                                )}

                                                {child}
                                            </div>
                                        );
                                    }}
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

Sortable.propTypes = {
    children: PropTypes.array,
    handle: PropTypes.any,
    onChange: PropTypes.func,
    overflow: PropTypes.any,
    tag: PropTypes.string
};

export default Sortable;
