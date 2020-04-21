import React, { Component, Fragment } from 'react';
import {
    Container,
    Grid,
    Icon,
    Input,
    Menu,
    Message,
    Segment
} from 'semantic-ui-react';
import {
    sortableContainer,
    sortableElement,
    sortableHandle
} from 'react-sortable-hoc';
import hash from 'object-hash';
import './Sortable.css';

const SortableElement = sortableElement(({ handle = null, value }) => {
    const SortableHandle = sortableHandle(() => handle);

    return (
        <div className="sortable__outer-container">
            <div className="sortable__inner-column-left">
                {handle && <SortableHandle />}
            </div>
            <div className="sortable__inner-column-right">
                {value}
            </div>
        </div>
    );
});

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
});


class Sortable extends Component {
  constructor(props) {
    super(props);
    this.onSortEnd = this.onSortEnd.bind(this);
  }
  shouldComponentUpdate() {
    return true;
  }
  onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex && this.props.onChange) {
      this.props.onChange(oldIndex, newIndex);
    }
  }
  render() {
    console.log('Sortable.render()', this.props.children);

    const {
        onSortEnd
    } = this;

    const {
        children
    } = this.props;

    const props = {
        lockAxis: 'y',
        transitionDuration: 150,
        // pressDelay: 200,
        useDragHandle: true
    };

    if (!children || !children.length) {
        return null;
    }

    const handle = (
        <Icon name="arrows alternate vertical" />
    );

    return (
        <SortableContainer
            onSortEnd={onSortEnd}
            {...props}
        >
            {children.map((child, index) => (
                <SortableElement
                    key={`sortable-element-${index}`}
                    index={index}
                    handle={handle}
                    value={child}
                />
            ))}
        </SortableContainer>
    );
  }
}

export default Sortable;
