import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import { Dropdown, Icon, Menu, Popup } from '@components/UI';
import * as Components from '@components/Slide/Components';
import './SlideComponentSelect.css';

const ComponentsMenuOrder = [
  'Text',
  'Suggestion',
  'ResponseRecall',
  'AudioResponse',
  'MultiButtonResponse',
  'MultiPathResponse',
  'TextResponse'
];


const ComponentItems = ({ onComponentItemClick, mode }) => {
  const style = { float: 'none !important' };
  // const Constructor = mode === 'menu' ? Menu.Item : Dropdown.Item;
  return ComponentsMenuOrder.map((item, index) => {
    const { Card, name: header, description: content } = Components[item];

    const trigger = (
      <Menu.Item
        style={style}
        onClick={() => onComponentItemClick(item)}
      >
        <Card />
      </Menu.Item>
    );
    return (
      <Popup
        pinned
        position="left center"
        key={hash(item)}
        header={header}
        content={content}
        trigger={trigger}
      />
    );
  });
};

class SlideComponentSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className = '', onClick } = this.props;

    const props = {
      className
    };

    return (
      <Menu {...props} fluid vertical>
        <ComponentItems onComponentItemClick={onClick} />
      </Menu>
    );
  }
}

SlideComponentSelect.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default SlideComponentSelect;
