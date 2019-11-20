import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Input, List, Menu } from 'semantic-ui-react';
import { type } from './type';
import Sortable from 'react-sortablejs';
import EditorMenu from '@components/EditorMenu';

class MultiButtonResponseEditor extends React.Component {
    constructor(props) {
        super(props);
        const {
            buttons = [
                /*
                {
                    display: "Text on button",
                    value: "Value button represents"
                }
                */
            ],
            prompt = '',
            responseId = ''
        } = props.value;

        this.state = {
            buttons,
            prompt,
            responseId
        };

        this.onAddButton = this.onAddButton.bind(this);
        this.onChangeButtonDetail = this.onChangeButtonDetail.bind(this);
        this.onChangeButtonOrder = this.onChangeButtonOrder.bind(this);
        this.onChangePrompt = this.onChangePrompt.bind(this);
        this.onDeleteButton = this.onDeleteButton.bind(this);
        this.onFocusButtonDetail = this.onFocusButtonDetail.bind(this);

        this.updateState = this.updateState.bind(this);
    }

    updateState() {
        const { prompt, buttons, responseId } = this.state;
        this.props.onChange({
            type,
            prompt,
            buttons,
            responseId
        });
    }

    onAddButton() {
        const { buttons } = this.state;
        buttons.push({
            display: '',
            value: ''
        });
        this.setState({ buttons }, this.updateState);
    }

    onDeleteButton(index) {
        const buttons = this.state.buttons.slice();
        buttons.splice(index, 1);
        this.setState({ buttons }, this.updateState);
    }

    onChangeButtonOrder(...args) {
        this.moveButton(args[2].oldDraggableIndex, args[2].newDraggableIndex);
    }

    onChangeButtonDetail(event, { index, name, value }) {
        const { buttons } = this.state;
        buttons[index][name] = value;
        this.setState({ buttons }, this.updateState);
    }

    onFocusButtonDetail(index) {
        const { buttons } = this.state;

        // If the Value field is presently empty,
        // kindly fill it with the same value
        // provided to the Display field
        if (!buttons[index].value) {
            buttons[index].value = buttons[index].display;
        }

        this.setState({ buttons }, this.updateState);
    }

    onChangePrompt(event, { name, value }) {
        this.setState({ [name]: value }, this.updateState);
    }

    moveButton(fromIndex, toIndex) {
        const buttons = this.state.buttons.slice();
        const from = buttons[fromIndex];
        const to = buttons[toIndex];
        if (from && to) {
            buttons[toIndex] = from;
            buttons[fromIndex] = to;
        }
        this.setState({ buttons }, this.updateState);
    }

    render() {
        const { buttons, prompt } = this.state;
        const {
            onAddButton,
            onChangeButtonDetail,
            onChangeButtonOrder,
            onChangePrompt,
            onDeleteButton,
            onFocusButtonDetail,
            updateState
        } = this;
        return (
            <Form>
                <Form.TextArea
                    label="Text Prompt (displayed before buttons)"
                    name="prompt"
                    value={prompt}
                    onChange={onChangePrompt}
                />
                <Button icon onClick={onAddButton}>
                    <Icon.Group size="large" style={{ marginRight: '0.5rem' }}>
                        <Icon name="hand pointer outline" />
                        <Icon corner="top right" name="add" color="green" />
                    </Icon.Group>
                    Add A Button
                </Button>
                <List>
                    <Sortable onChange={onChangeButtonOrder}>
                        {buttons.map(({ display, value }, index) => {
                            const onFocusButtonDetailWithCurriedIndex = onFocusButtonDetail.bind(
                                this,
                                index
                            );
                            return (
                                <EditorMenu
                                    key={`button-editor-${index}`}
                                    type="button"
                                    items={{
                                        right: [
                                            <Menu.Item
                                                key={`button-menu-${index}`}
                                                name="Edit Button Details"
                                            >
                                                <Input
                                                    index={index}
                                                    key={`button-diplay-${index}`}
                                                    label="Button Display:"
                                                    name="display"
                                                    value={display}
                                                    onChange={
                                                        onChangeButtonDetail
                                                    }
                                                />
                                                <Input
                                                    index={index}
                                                    key={`button-value-${index}`}
                                                    label="Button Value:"
                                                    name="value"
                                                    value={value}
                                                    onFocus={
                                                        onFocusButtonDetailWithCurriedIndex
                                                    }
                                                    onChange={
                                                        onChangeButtonDetail
                                                    }
                                                />
                                            </Menu.Item>
                                        ],
                                        save: {
                                            onClick: () => updateState()
                                        },
                                        delete: {
                                            onConfirm: () =>
                                                onDeleteButton(index)
                                        }
                                    }}
                                />
                            );
                        })}
                    </Sortable>
                </List>
            </Form>
        );
    }
}

MultiButtonResponseEditor.propTypes = {
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        buttons: PropTypes.array,
        prompt: PropTypes.string,
        responseId: PropTypes.string,
        type: PropTypes.oneOf([type])
    }),
    onChange: PropTypes.func.isRequired
};

export default MultiButtonResponseEditor;
