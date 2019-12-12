import React from 'react';
import PropTypes from 'prop-types';
import {
    Checkbox,
    Dropdown,
    Grid,
    Icon,
    Input,
    Menu,
    Message,
    Segment
} from 'semantic-ui-react';
import Sortable from 'react-sortablejs';
import EditorMenu from '@components/EditorMenu';
import generateResponseId from '../util/generate-response-id';
import * as Components from '../Components';
import './SlideEditor.css';

const ComponentsMenuOrder = [
    'Text',
    'Suggestion',
    'ResponseRecall',
    'TextResponse',
    'MultiButtonResponse',
    'AudioResponse'
];

export default class SlideEditor extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandlers = {};
        const mode = 'edit';
        const currentComponentIndex = 0;
        const titleHasFocus = false;
        const { title = 'Slide', components = [] } = props;
        this.state = {
            components,
            currentComponentIndex,
            mode,
            titleHasFocus,
            title
        };

        this.onChangeComponentOrder = this.onChangeComponentOrder.bind(this);
        this.onTitleBlur = this.onTitleBlur.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onTitleFocus = this.onTitleFocus.bind(this);
        this.onDeleteComponent = this.onDeleteComponent.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    updateState() {
        if (this.props.onChange) {
            this.props.onChange(this.state);
        }
    }

    clickHandle(type) {
        if (!this.clickHandlers[type]) {
            this.clickHandlers[type] = this.onMenuClick.bind(this, type);
        }
        return this.clickHandlers[type];
    }

    onComponentChange(index, value) {
        const components = this.state.components.slice();
        components[index] = value;
        this.setState({ components }, this.updateState);
    }

    onChangeComponentOrder(...args) {
        const {
            oldDraggableIndex: fromIndex,
            newDraggableIndex: toIndex
        } = args[2];

        this.props.updateEditorMessage('Moving component...');

        const components = this.state.components.slice();
        const from = components[fromIndex];
        const to = components[toIndex];
        if (from && to) {
            components[toIndex] = from;
            components[fromIndex] = to;
        }

        const currentComponentIndex = toIndex;

        this.setState({ components, currentComponentIndex }, this.updateState);
        this.props.updateEditorMessage('Component moved!');
    }

    onDeleteComponent(index) {
        const components = this.state.components.slice();
        components.splice(index, 1);
        this.setState({ components }, () => {
            let currentComponentIndex;

            // The components was at the end...
            if (index > components.length) {
                currentComponentIndex = components.length - 1;
            }

            // The components was at the beginning...
            if (index === 0) {
                currentComponentIndex = 0;
            } else {
                // The components was somewhere in between...
                currentComponentIndex = index - 1;
            }

            this.setState({ currentComponentIndex });
            this.props.updateEditorMessage('Component deleted');
            this.updateState();
        });
    }

    onMenuClick(type) {
        const components = [
            ...this.state.components,
            Components[type].defaultValue({
                responseId: generateResponseId(type)
            })
        ];
        const currentComponentIndex = components.length - 1;
        this.setState({ components, currentComponentIndex }, () => {
            this.props.updateEditorMessage('Component added');
            this.updateState();
        });
    }

    onTitleChange(event, { value: title }) {
        this.setState({ title }, this.updateState);
    }

    onTitleFocus() {
        this.setState({ titleHasFocus: true });
    }

    onTitleBlur() {
        this.setState({ titleHasFocus: false });
    }

    onComponentRequirementChange(event, { checked }) {
        this.setState({ required: checked }, this.updateState);
    }

    render() {
        const {
            onChangeComponentOrder,
            onTitleBlur,
            onTitleChange,
            onTitleFocus,
            state: { components, titleHasFocus, title },
            updateState
        } = this;

        const { scenarioId } = this.props;

        const showComponentDropdown =
            components.length === 0 ? { open: true } : {};

        // Let other operations override the openness
        // of the component menu.
        if (titleHasFocus) {
            showComponentDropdown.open = false;
        }
        const slideComponentDropDown = (
            <Dropdown
                {...showComponentDropdown}
                item
                text={
                    <React.Fragment>
                        <Icon
                            name="content"
                            style={{
                                marginRight: '0.5rem'
                            }}
                        />
                        Add to slide
                    </React.Fragment>
                }
            >
                <Dropdown.Menu>
                    {ComponentsMenuOrder.map(type => {
                        const { Card } = Components[type];
                        return (
                            <Dropdown.Item
                                key={type}
                                onClick={this.clickHandle(type)}
                            >
                                <Card />
                            </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
        );

        return (
            <Grid>
                <Grid.Column stretched>
                    <Grid.Row>
                        <EditorMenu
                            type="slide"
                            items={{
                                left: [
                                    <Menu.Item
                                        key="menu-item-title"
                                        name="Slide title"
                                    >
                                        <Input
                                            name="title"
                                            placeholder="Slide title"
                                            label={{ content: 'Slide title:' }}
                                            labelPosition="left"
                                            value={title}
                                            onChange={onTitleChange}
                                            onFocus={onTitleFocus}
                                            onBlur={onTitleBlur}
                                        />
                                    </Menu.Item>
                                ],
                                save: {
                                    onClick: updateState
                                },
                                delete: {
                                    onConfirm: () => {
                                        this.props.deleteSlide(
                                            this.props.index
                                        );
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
                                        {slideComponentDropDown}
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
                                            style={{ marginRight: '0.5rem' }}
                                        >
                                            <Icon name="content" />
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

                            <Sortable
                                onChange={onChangeComponentOrder}
                                options={{
                                    direction: 'vertical',
                                    swapThreshold: 0.5,
                                    animation: 150
                                }}
                            >
                                {components.map((value, index) => {
                                    const { type } = value;
                                    if (!Components[type]) return;

                                    const { Editor, Display } = Components[
                                        type
                                    ];
                                    const edit = (
                                        <Editor
                                            slideIndex={index}
                                            scenarioId={scenarioId}
                                            value={value}
                                            onChange={v =>
                                                this.onComponentChange(index, v)
                                            }
                                        />
                                    );
                                    const onDeleteComponentCurriedWithIndex = this.onDeleteComponent.bind(
                                        this,
                                        index
                                    );

                                    const right = [];

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
                                                        this.onComponentChange(
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

                                        right.push(requiredCheckbox);
                                    }

                                    const componentMenu = (
                                        <EditorMenu
                                            type="component"
                                            items={{
                                                save: {
                                                    onClick: this.updateState
                                                },
                                                delete: {
                                                    onConfirm: onDeleteComponentCurriedWithIndex
                                                },
                                                right
                                            }}
                                        />
                                    );
                                    const display = <Display {...value} />;
                                    return this.state.mode === 'edit' ? (
                                        <Segment
                                            key={index}
                                            className={
                                                index ===
                                                this.state.currentComponentIndex
                                                    ? 'editor__component-selected'
                                                    : ''
                                            }
                                            onClick={() =>
                                                this.setState({
                                                    currentComponentIndex: index
                                                })
                                            }
                                        >
                                            {componentMenu}
                                            {edit}
                                        </Segment>
                                    ) : (
                                        <React.Fragment key={index}>
                                            {display}
                                        </React.Fragment>
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
    scenarioId: PropTypes.string,
    index: PropTypes.number,
    title: PropTypes.string,
    components: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    deleteSlide: PropTypes.func,
    updateEditorMessage: PropTypes.func
};
