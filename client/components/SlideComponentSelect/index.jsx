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
  'AudioPrompt',
  'MultiPathResponse',
  'ConversationPrompt',
  'MultiButtonResponse',
  'TextResponse'
];

const ComponentItems = ({ onComponentItemClick }) => {
  const style = { float: 'none !important' };
  return ComponentsMenuOrder.map(item => {
    const { Card, name: header, description: content } = Components[item];

    const trigger = (
      <Menu.Item.Tabbable
        style={style}
        onClick={() => onComponentItemClick(item)}
      >
        <Card />
      </Menu.Item.Tabbable>
    );
    return (
      <Popup
        inverted
        pinned
        position="left center"
        key={Identity.key(item)}
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
