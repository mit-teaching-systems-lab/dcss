import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Dropdown,
    Grid,
    Icon,
    Input,
    Menu,
    Message,
    Ref,
    Segment
} from 'semantic-ui-react';
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

const ComponentItems = ({ onComponentItemClick }) => {
    return ComponentsMenuOrder.map((type, index) => {
        const { Card } = Components[type];
        return (
            <Dropdown.Item
                key={`slide-component-select-${type}-${index}`}
                onClick={() => onComponentItemClick(type)}
            >
                <Card />
            </Dropdown.Item>
        );
    });
};

class SlideComponentSelect extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { mode, open } = this.props;

        const props = {};

        if (typeof open !== 'undefined') {
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

        return (
            <Dropdown {...props} item text={icon}>
                <Dropdown.Menu>
                    <ComponentItems onComponentItemClick={this.props.onClick} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

SlideComponentSelect.propTypes = {
    open: PropTypes.bool,
    mode: PropTypes.string,
    onClick: PropTypes.func
};

export default SlideComponentSelect;
