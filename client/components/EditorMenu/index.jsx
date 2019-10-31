import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu } from 'semantic-ui-react';
import ConfirmableDeleteButton from '@components/Editor/ConfirmableDeleteButton';

export default class EditorMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { type, items } = this.props;
        return (
            <Menu icon>
                {items.left && (
                    <React.Fragment>{items.left.map(c => c)}</React.Fragment>
                )}
                {items.save && (
                    <Menu.Item
                        name={`save-${type}`}
                        onClick={items.save.onClick}
                    >
                        <Icon name="save" />
                    </Menu.Item>
                )}
                {items.delete && (
                    <ConfirmableDeleteButton
                        name={`delete-${type}`}
                        itemType={type}
                        onConfirm={items.delete.onConfirm}
                    />
                )}
            </Menu>
        );
    }
}

const VALID_PROPS = ['delete', 'left', 'right', 'save'];
EditorMenu.propTypes = {
    items: function(props, propName) {
        const { items } = props;
        if (propName === 'items') {
            if (!Object.keys(items).every(v => VALID_PROPS.includes(v))) {
                return new Error('EditorMenu: Invalid item property');
            }

            if (items.save) {
                if (
                    !Object.keys(items.save).every(v => ['onClick'].includes(v))
                ) {
                    return new Error('EditorMenu: Invalid items.save property');
                }
            }

            if (items.delete) {
                if (
                    !Object.keys(items.delete).every(v =>
                        ['onConfirm'].includes(v)
                    )
                ) {
                    return new Error(
                        'EditorMenu: Invalid item.delete property'
                    );
                }
            }
            if (items.left && !Array.isArray(items.left)) {
                return new Error('EditorMenu: Invalid items.left property');
            }
            if (items.right && !Array.isArray(items.right)) {
                return new Error('EditorMenu: Invalid items.right property');
            }
        }

        return null;
    },
    type: PropTypes.string
};
