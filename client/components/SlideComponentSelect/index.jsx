import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { Menu, Popup } from '@components/UI';
import * as Components from '@components/Slide/Components';
import './SlideComponentSelect.css';

const ComponentsMenuOrder = [
  'Text',
  'Suggestion',
  'ResponseRecall',
  'ConditionalContent',
  'AudioPrompt',
  'MultiPathResponse',
  'ConversationPrompt',
  'MultiButtonResponse',
  'TextResponse'
];

export const ComponentItem = ({ position = 'left center', item, onClick }) => {
  const { Card, name: header, description: content } = Components[item];
  const style = { float: 'none !important' };
  const trigger = (
    <Menu.Item.Tabbable
      role="button"
      style={style}
      onClick={() => onClick(item)}
    >
      <Card />
    </Menu.Item.Tabbable>
  );
  return (
    <Popup
      inverted
      pinned
      position={position}
      header={header}
      content={content}
      trigger={trigger}
    />
  );
};

export const ComponentItems = ({ onComponentItemClick }) => {
  return ComponentsMenuOrder.map(item => (
    <ComponentItem
      key={Identity.key(item)}
      item={item}
      onClick={onComponentItemClick}
    />
  ));
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
