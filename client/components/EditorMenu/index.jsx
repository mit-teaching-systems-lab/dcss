import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu, Popup } from 'semantic-ui-react';
import ConfirmableDeleteButton from './ConfirmableDeleteButton';

export default class EditorMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'edit'
        };
    }

    render() {
        const { type, items } = this.props;
        return (
            <Menu icon>
                {items.left && (
                    <React.Fragment>
                        {items.left
                            .filter(item => item)
                            .map((item, index) => (
                                <Popup
                                    key={index}
                                    content={`${item.props.name}`}
                                    trigger={item}
                                />
                            ))}
                    </React.Fragment>
                )}
                {items.save && (
                    <Popup
                        content={`Save ${type}`}
                        trigger={
                            <Menu.Item
                                aria-label={`Save ${type}`}
                                name={`save-${type}`}
                                onClick={items.save.onClick}
                            >
                                <Icon name="save" />
                            </Menu.Item>
                        }
                    />
                )}
                {items.delete && (
                    <ConfirmableDeleteButton
                        aria-label={`Delete ${type}`}
                        name={`delete-${type}`}
                        itemType={type}
                        onConfirm={items.delete.onConfirm}
                    />
                )}

                {items.editable &&
                    (this.state.mode === 'preview' ? (
                        <Popup
                            content={`Edit ${type}`}
                            trigger={
                                <Menu.Item
                                    aria-label={`Edit ${type}`}
                                    name={`edit-${type}`}
                                    onClick={(...args) => {
                                        this.setState({ mode: 'edit' }, () => {
                                            args.push(
                                                Object.assign({}, this.state)
                                            );
                                            items.editable.onToggle(...args);
                                        });
                                    }}
                                >
                                    <Icon name="edit outline" />
                                </Menu.Item>
                            }
                        />
                    ) : (
                        <Popup
                            content={`Preview ${type}`}
                            trigger={
                                <Menu.Item
                                    aria-label={`Preview ${type}`}
                                    name={`preview-${type}`}
                                    onClick={(...args) => {
                                        this.setState(
                                            { mode: 'preview' },
                                            () => {
                                                args.push(
                                                    Object.assign(
                                                        {},
                                                        this.state
                                                    )
                                                );
                                                items.editable.onToggle(
                                                    ...args
                                                );
                                            }
                                        );
                                    }}
                                >
                                    <Icon name="eye" />
                                </Menu.Item>
                            }
                        />
                    ))}
                {items.right && (
                    <React.Fragment>
                        {items.right
                            .filter(item => item)
                            .map((item, index) => (
                                <Popup
                                    key={index}
                                    content={`${item.props.name}`}
                                    trigger={item}
                                />
                            ))}
                    </React.Fragment>
                )}
            </Menu>
        );
    }
}

const VALID_PROPS = ['delete', 'editable', 'left', 'right', 'save'];
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

            if (items.editable) {
                if (
                    !Object.keys(items.editable).every(v =>
                        ['onToggle'].includes(v)
                    )
                ) {
                    return new Error(
                        'EditorMenu: Invalid item.editable property'
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
