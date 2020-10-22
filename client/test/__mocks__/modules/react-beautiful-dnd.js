import React, { Fragment } from 'react';

function Droppable({ children }) {
  if (typeof children === 'function') {
    const droppableProvided = {
      droppableProps: {
        'data-rbd-droppable-context-id': '1',
        'data-rbd-droppable-id': 'droppable'
      },
      draggableProps: {
        style: {}
      },
      innerRef: () => {},
      placeholder: <Fragment />
    };
    const droppableSnapshot = {
      draggingFromThisWith: null,
      draggingOverWith: null,
      isDraggingOver: false,
      isUsingPlaceholder: true
    };
    return children({ droppableProvided, droppableSnapshot });
  }
  return children;
}

function Draggable({ children }) {
  if (typeof children === 'function') {
    const draggableProvided = {
      draggableProps: {
        'data-rbd-draggable-context-id': '0',
        'data-rbd-draggable-id': 'draggable-id-3',
        style: {
          transform: null,
          transition: null
        },
        onTransitionEnd: null
      },
      innerRef: () => {},
      dragHandleProps: {
        tabIndex: 0,
        role: 'button',
        'aria-describedby': 'rbd-hidden-text-0-hidden-text-0',
        'data-rbd-drag-handle-draggable-id': 'draggable-id-3',
        'data-rbd-drag-handle-context-id': '0',
        draggable: false
      }
    };
    const draggableSnapshot = {
      isDragging: false,
      isDropAnimating: false,
      isClone: false,
      dropAnimation: null,
      mode: null,
      draggingOver: null,
      combineTargetFor: null,
      combineWith: null
    };
    return children({ draggableProvided, draggableSnapshot });
  }
  return children;
}

function DragDropContext({ children }) {
  if (typeof children === 'function') {
    return children();
  }
  return children;
}

export { DragDropContext, Draggable, Droppable };
