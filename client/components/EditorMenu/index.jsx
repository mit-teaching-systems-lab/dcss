import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu, Popup, Search } from 'semantic-ui-react';
import ConfirmableDeleteButton from './ConfirmableDeleteButton';
import _ from 'lodash';
import './EditorMenu.css';

const initialSearchState = {
    isLoading: false,
    results: [],
    selected: null,
    value: ''
};

export default class EditorMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'edit',
            search: {
                ...initialSearchState
            }
        };

        this.onEditorMenuResultSelect = this.onEditorMenuResultSelect.bind(
            this
        );
        this.onEditorMenuSearchChange = this.onEditorMenuSearchChange.bind(
            this
        );
    }

    onEditorMenuResultSelect(event, { result }) {
        const { results } = this.state.search;

        this.setState(
            {
                search: {
                    isLoading: false,
                    results,
                    selected: result,
                    value: result.name
                }
            },
            () => {
                const { onResultSelect } = this.props.items.search;
                onResultSelect(
                    event,
                    this.state.search,
                    this.setState.bind(this)
                );
            }
        );
    }

    onEditorMenuSearchChange(event, { value }) {
        const { results, selected } = this.state.search;

        const search = {
            isLoading: true,
            results,
            selected,
            value
        };

        this.setState({ search }, () => {
            const { value } = this.state.search;
            const { onSearchChange } = this.props.items.search;

            if (value.length < 1) {
                return this.setState(
                    {
                        search: {
                            ...initialSearchState
                        }
                    },
                    () => {
                        onSearchChange(
                            event,
                            this.state.search,
                            this.setState.bind(this)
                        );
                    }
                );
            }
            onSearchChange(event, this.state.search, this.setState.bind(this));
        });
    }

    render() {
        const { type, items } = this.props;
        const { mode, search } = this.state;
        const { onEditorMenuResultSelect, onEditorMenuSearchChange } = this;

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
                    (mode === 'preview' ? (
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

                {items.search && (
                    <Popup
                        content={`Search ${type}`}
                        trigger={
                            <Menu.Item
                                aria-label={`Search ${type}`}
                                name={`search-${type}`}
                                className="editormenu__search--padding"
                            >
                                <Search
                                    loading={search.isLoading}
                                    resultRenderer={items.search.renderer}
                                    onResultSelect={onEditorMenuResultSelect}
                                    onSearchChange={_.debounce(
                                        onEditorMenuSearchChange,
                                        500,
                                        {
                                            leading: true
                                        }
                                    )}
                                    results={search.results}
                                    value={search.value}
                                />
                            </Menu.Item>
                        }
                    />
                )}

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

const VALID_PROPS = ['delete', 'editable', 'left', 'right', 'save', 'search'];
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

            if (items.search) {
                if (
                    !Object.keys(items.search).every(key =>
                        [
                            'onResultSelect',
                            'onSearchChange',
                            'renderer',
                            'source'
                        ].includes(key)
                    )
                ) {
                    return new Error(
                        'EditorMenu: Invalid items.search property'
                    );
                }
            }
        }

        return null;
    },
    type: PropTypes.string
};
