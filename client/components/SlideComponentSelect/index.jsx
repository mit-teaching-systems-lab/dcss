import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import * as Components from '@components/Slide/Components';
import './SlideComponentSelect.css';

const ComponentsMenuOrder = [
  'Text',
  'Suggestion',
  'ResponseRecall',
  'TextResponse',
  'MultiButtonResponse',
  'AudioResponse'
];

const ComponentItems = ({ onComponentItemClick, mode }) => {
  const Constructor = mode === 'menu' ? Menu.Item : Dropdown.Item;
  return ComponentsMenuOrder.map((type, index) => {
    const { Card } = Components[type];

    return (
      <Constructor
        key={`slide-component-select-${type}-${index}`}
        onClick={() => onComponentItemClick(type)}
        style={{ float: 'none !important' }}
      >
        <Card />
      </Constructor>
    );
  });
};

class SlideComponentSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className = '', mode = 'default', onClick, open } = this.props;

    const props = {
      className
    };

    if (mode === 'default' && typeof open !== 'undefined') {
      props.open = open;
    }

    const icon = (
      <Fragment>
        <Icon
          aria-label="Add to slide"
          name="content"
          className="slidecomponentselect__icon-margin"
        />
        Add to slide
      </Fragment>
    );

    return mode === 'default' ? (
      <Dropdown {...props} item text={icon}>
        <Dropdown.Menu>
          <ComponentItems mode={mode} onComponentItemClick={onClick} />
        </Dropdown.Menu>
      </Dropdown>
    ) : (
      <Menu {...props} fluid vertical>
        <ComponentItems mode={mode} onComponentItemClick={onClick} />
      </Menu>
    );
  }
}

SlideComponentSelect.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool,
  mode: PropTypes.string,
  onClick: PropTypes.func
};

export default SlideComponentSelect;
