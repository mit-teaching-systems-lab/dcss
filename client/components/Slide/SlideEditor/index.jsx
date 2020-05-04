import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Checkbox,
    Dropdown,
    Grid,
    Icon,
    Input,
    Menu,
    Message,
    Ref,
    Segment
} from 'semantic-ui-react';
import hash from 'object-hash';
import EditorMenu from '@components/EditorMenu';
import notify from '@components/Notification';
import Sortable from '@components/Sortable';
import SlideComponentSelect from '@components/SlideComponentSelect';
import generateResponseId from '../util/generate-response-id';
import * as Components from '../Components';
import './SlideEditor.css';

export default class SlideEditor extends Component {
    constructor(props) {
        super(props);
        const { title = 'Slide', components = [] } = props;
        const activeComponentIndex = -1;
        const mode = 'edit';
        const titleHasFocus = false;

        this.state = {
            activeComponentIndex,
            components,
            mode,
            title,
            titleHasFocus
        };

        this.activateComponent = this.activateComponent.bind(this);
        this.updateSlide = this.updateSlide.bind(this);

        this.componentRefs = [];
        this.debouncers = {};

        this.onComponentChange = this.onComponentChange.bind(this);
        this.onComponentDelete = this.onComponentDelete.bind(this);
        this.onComponentOrderChange = this.onComponentOrderChange.bind(this);

        this.onComponentSelectClick = this.onComponentSelectClick.bind(this);

        this.onTitleBlur = this.onTitleBlur.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onTitleFocus = this.onTitleFocus.bind(this);
    }

    // componentDidMount() {
    //     const {
    //         components = [],
    //         title = '',
    //     } = this.props;
    //     this.setState({
    //         components,
    //         title,
    //     });
    // }

    updateSlide() {
        if (this.props.onChange) {
            const { components, title } = this.state;

            this.props.onChange(this.props.index, {
                components,
                title
            });
        }
    }

    activateComponent(state, callback = () => {}) {
        let updatedState = state;

        if (Array.isArray(state)) {
            updatedState = {
                components: state
            };
        }
        if (typeof state === 'number') {
            updatedState = {
                activeComponentIndex: state
            };
        }

        if (updatedState.activeComponentIndex !== -1) {
            this.setState(updatedState, () => {
                const { activeComponentIndex } = this.state;

                if (this.componentRefs[activeComponentIndex]) {
                    this.componentRefs[activeComponentIndex].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }
                callback();
            });
        }
    }

    onComponentChange(index, value) {
        const { components } = this.state;
        Object.assign(components[index], value);
        this.setState({ components }, () => {
            clearTimeout(this.debouncers[index]);
            this.debouncers[index] = setTimeout(() => {
                this.updateSlide();
            }, 5000);
        });
    }

    onComponentOrderChange(fromIndex, activeComponentIndex) {
        const { components } = this.state;
        const moving = components[fromIndex];
        components.splice(fromIndex, 1);
        components.splice(activeComponentIndex, 0, moving);
        this.activateComponent({ components, activeComponentIndex }, () => {
            this.updateSlide();
        });
    }

    onComponentDelete(index) {
        const { components } = this.state;

        components.splice(index, 1);

        let activeComponentIndex;

        // The components was at the end...
        if (index > components.length) {
            activeComponentIndex = components.length - 1;
        }

        // The components was at the beginning...
        if (index === 0) {
            activeComponentIndex = 0;
        } else {
            // The components was somewhere in between...
            activeComponentIndex = index - 1;
        }
        this.activateComponent({ components, activeComponentIndex }, () => {
            this.updateSlide();
        });
    }

    onComponentSelectClick(type) {
        const {
            activeComponentIndex: currentActiveComponentIndex,
            components
        } = this.state;

        const activeComponentIndex = currentActiveComponentIndex + 1;

        const component = Components[type].defaultValue({
            responseId: generateResponseId(type)
        });

        if (activeComponentIndex === components.length) {
            components.push(component);
        } else {
            components.splice(activeComponentIndex, 0, component);
        }

        this.activateComponent({ components, activeComponentIndex }, () => {
            this.updateSlide();
        });
    }

    onTitleChange(event, { name, value }) {
        console.log(name, value);
        this.setState({ [name]: value });
    }

    onTitleFocus() {
        this.setState({ titleHasFocus: true });
    }

    onTitleBlur(event, data) {
        // Title is an uncontrolled input, so setting
        // state directly here is intentional.
        //
        this.state.title = event.target.value;
        this.updateSlide();
        this.setState({ titleHasFocus: false });
    }

    render() {
        const {
            activateComponent,
            updateSlide,
            onComponentChange,
            onComponentDelete,
            onComponentOrderChange,
            onComponentSelectClick,
            onTitleBlur,
            onTitleChange,
            onTitleFocus
        } = this;

        const {
            activeComponentIndex,
            components,
            titleHasFocus,
            title
        } = this.state;

        const { scenarioId } = this.props;

        if (!components) {
            return <span>Loading</span>;
        }

        const slideComponentSelectOpen =
            components.length === 0 ? { open: true } : {};

        // Let other operations override the openness
        // of the component menu.
        if (titleHasFocus) {
            slideComponentSelectOpen.open = false;
        }

        return (
            <Grid>
                <Grid.Column stretched>
                    <Grid.Row>
                        <EditorMenu
                            key="slide-editor-menu"
                            type="slide"
                            items={{
                                left: [
                                    <Menu.Item
                                        key="menu-item-number"
                                        name="Slide number"
                                        className="slideeditormenu__slide-number-width header"
                                    >
                                        {this.props.index + 1}
                                    </Menu.Item>,

                                    <Menu.Item
                                        key="menu-item-title"
                                        name="Slide title"
                                    >
                                        <Input
                                            focus
                                            name="title"
                                            placeholder="Slide title (optional)"
                                            value={title}
                                            onChange={onTitleChange}
                                            onFocus={onTitleFocus}
                                            onBlur={onTitleBlur}
                                        />
                                    </Menu.Item>
                                ],
                                save: {
                                    onClick: updateSlide
                                },
                                delete: {
                                    onConfirm: () => {
                                        this.props.onDelete(this.props.index);
                                    }
                                },
                                editable: {
                                    onToggle: (event, data, { mode }) => {
                                        this.setState({ mode });
                                    }
                                },
                                right: [
                                    <Menu.Menu
                                        key="menu-item-components"
                                        position="right"
                                        name="Add content to slide"
                                    >
                                        <SlideComponentSelect
                                            {...slideComponentSelectOpen}
                                            onClick={onComponentSelectClick}
                                        />
                                    </Menu.Menu>
                                ]
                            }}
                        />
                        <Segment className="editor__component-layout-pane">
                            {components.length === 0 && (
                                <Message
                                    floating
                                    icon={
                                        <Icon.Group
                                            size="huge"
                                            className="editormenu__icon-group"
                                        >
                                            <Icon name="bars" />
                                            <Icon
                                                corner="top right"
                                                name="add"
                                                color="green"
                                            />
                                        </Icon.Group>
                                    }
                                    header="Add content to this slide!"
                                    content="Using the 'Add to slide' menu on the right, select content components to add to your slide."
                                />
                            )}

                            <Sortable onChange={onComponentOrderChange}>
                                {components.map((value, index) => {
                                    const { type } = value;
                                    if (!Components[type]) return;

                                    const {
                                        Editor: ComponentEditor,
                                        Display: ComponentDisplay
                                    } = Components[type];

                                    const onConfirm = () =>
                                        onComponentDelete(index);

                                    const description = `${index + 1}, `;
                                    const right = [
                                        <Menu.Menu
                                            key="menu-components-order-change"
                                            name="Move component up or down"
                                            position="right"
                                        >
                                            <Menu.Item
                                                key="menu-components-order-change-up"
                                                icon="caret up"
                                                aria-label={`Move component ${description} up`}
                                                disabled={index === 0}
                                                onClick={() => {
                                                    onComponentOrderChange(
                                                        index,
                                                        index - 1
                                                    );
                                                }}
                                            />
                                            <Menu.Item
                                                key="menu-components-order-change-down"
                                                icon="caret down"
                                                aria-label={`Move component ${description} down`}
                                                disabled={
                                                    index ===
                                                    components.length - 1
                                                }
                                                onClick={() => {
                                                    onComponentOrderChange(
                                                        index,
                                                        index + 1
                                                    );
                                                }}
                                            />
                                        </Menu.Menu>
                                    ];

                                    if (value.responseId) {
                                        const requiredCheckbox = (
                                            <Menu.Item
                                                key="menu-item-prompt-required"
                                                name="Set this prompt to 'required'"
                                            >
                                                <Checkbox
                                                    name="required"
                                                    label="Required?"
                                                    checked={value.required}
                                                    onChange={(
                                                        event,
                                                        { checked }
                                                    ) =>
                                                        onComponentChange(
                                                            index,
                                                            {
                                                                ...value,
                                                                required: checked
                                                            }
                                                        )
                                                    }
                                                />
                                            </Menu.Item>
                                        );

                                        right.unshift(requiredCheckbox);
                                    }

                                    const onComponentClick = () => {
                                        if (activeComponentIndex !== index) {
                                            this.activateComponent(index);
                                        }
                                    };

                                    return this.state.mode === 'edit' ? (
                                        <Ref
                                            key={`component-ref-${index}`}
                                            innerRef={node =>
                                                (this.componentRefs[
                                                    index
                                                ] = node)
                                            }
                                        >
                                            <Segment
                                                key={`component-edit-${index}`}
                                                className={
                                                    index ===
                                                    activeComponentIndex
                                                        ? 'sortable__selected draggable'
                                                        : 'draggable'
                                                }
                                                onClick={onComponentClick}
                                            >
                                                <EditorMenu
                                                    type="component"
                                                    items={{
                                                        save: {
                                                            onClick: updateSlide
                                                        },
                                                        delete: {
                                                            onConfirm
                                                        },
                                                        right
                                                    }}
                                                />

                                                <ComponentEditor
                                                    slideIndex={
                                                        this.props.index
                                                    }
                                                    scenarioId={scenarioId}
                                                    value={value}
                                                    onChange={v =>
                                                        onComponentChange(
                                                            index,
                                                            v
                                                        )
                                                    }
                                                />
                                            </Segment>
                                        </Ref>
                                    ) : (
                                        <Fragment
                                            key={`component-fragment-${index}`}
                                        >
                                            <ComponentDisplay
                                                key={`component-preview-${index}`}
                                                {...value}
                                            />
                                        </Fragment>
                                    );
                                })}
                            </Sortable>
                        </Segment>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

SlideEditor.propTypes = {
    scenarioId: PropTypes.any,
    index: PropTypes.number,
    title: PropTypes.string,
    components: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    onDelete: PropTypes.func
};
