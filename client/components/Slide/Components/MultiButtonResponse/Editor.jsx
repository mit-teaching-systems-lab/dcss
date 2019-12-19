import React from 'react';
import PropTypes from 'prop-types';
import {
    Accordion,
    Button,
    Form,
    Icon,
    Input,
    List,
    Menu,
    Message,
    Popup
} from 'semantic-ui-react';
import { type } from './type';
import Sortable from 'react-sortablejs';
import EditorMenu from '@components/EditorMenu';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import '@components/Slide/SlideEditor/SlideEditor.css';

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
            header = '',
            prompt = '',
            recallId = '',
            required,
            responseId = ''
        } = props.value;

        this.state = {
            activeIndex: recallId ? 0 : -1,
            buttons,
            header,
            prompt,
            recallId,
            required,
            responseId
        };

        this.onAddButton = this.onAddButton.bind(this);
        this.onChangeButtonDetail = this.onChangeButtonDetail.bind(this);
        this.onChangeButtonOrder = this.onChangeButtonOrder.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDeleteButton = this.onDeleteButton.bind(this);
        this.preventEmptyButtonField = this.preventEmptyButtonField.bind(this);
        this.onRecallChange = this.onRecallChange.bind(this);
        this.toggleOptional = this.toggleOptional.bind(this);

        this.updateState = this.updateState.bind(this);
    }

    updateState() {
        const {
            buttons,
            header,
            prompt,
            recallId,
            required,
            responseId
        } = this.state;
        this.props.onChange({
            buttons,
            header,
            prompt,
            recallId,
            required,
            responseId,
            type
        });
    }

    onRecallChange({ recallId }) {
        this.setState({ recallId }, this.updateState);
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

    preventEmptyButtonField(index) {
        const { buttons } = this.state;

        // If the Value field is presently empty,
        // kindly fill it with the same value
        // provided to the Display field
        if (!buttons[index].value.trim()) {
            buttons[index].value = buttons[index].display;
        }

        // If the Display field is presently empty,
        // but the Value field is not,
        // kindly fill it with the same value
        // provided to the Value field
        if (!buttons[index].display.trim() && buttons[index].value.trim()) {
            buttons[index].display = buttons[index].value;
        }

        this.setState({ buttons }, this.updateState);
    }

    onChange(event, { name, value }) {
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

    toggleOptional(event, { index }) {
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    }

    render() {
        const { scenarioId } = this.props;
        const { activeIndex, buttons, header, prompt, recallId } = this.state;
        const {
            onAddButton,
            onChangeButtonDetail,
            onChangeButtonOrder,
            onRecallChange,
            onChange,
            onDeleteButton,
            preventEmptyButtonField,
            toggleOptional,
            updateState
        } = this;

        return (
            <Form>
                <Accordion>
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={toggleOptional}
                    >
                        <Icon name="dropdown" />
                        Optionally Embed A Previous Response
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <ResponseRecall
                            className="responserecall__margin-bottom"
                            value={{
                                components: [],
                                recallId
                            }}
                            scenarioId={scenarioId}
                            onChange={onRecallChange}
                        />
                    </Accordion.Content>
                </Accordion>
                <Form.TextArea
                    label="Prompt (displayed before buttons)"
                    name="prompt"
                    value={prompt}
                    onChange={onChange}
                />
                <Button icon onClick={onAddButton}>
                    <Icon.Group size="large" style={{ marginRight: '0.5rem' }}>
                        <Icon name="hand pointer outline" />
                        <Icon corner="top right" name="add" color="green" />
                    </Icon.Group>
                    Add A Button
                </Button>
                <List>
                    <Sortable
                        onChange={onChangeButtonOrder}
                        options={{
                            direction: 'vertical',
                            swapThreshold: 0.5,
                            animation: 150
                        }}
                    >
                        {buttons.map(({ display, value }, index) => {
                            const preventEmptyButtonFieldCurriedIndex = preventEmptyButtonField.bind(
                                this,
                                index
                            );
                            const onBlur = preventEmptyButtonFieldCurriedIndex;
                            const onFocus = preventEmptyButtonFieldCurriedIndex;
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
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
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
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
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
                <Message
                    color={header ? 'grey' : 'pink'}
                    content={
                        <Popup
                            content="Set a data header. This is only displayed in the data view and data download."
                            trigger={
                                <Form.TextArea
                                    required
                                    label="Data Header"
                                    name="header"
                                    value={header}
                                    onChange={onChange}
                                />
                            }
                        />
                    }
                />
            </Form>
        );
    }
}

MultiButtonResponseEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        buttons: PropTypes.array,
        header: PropTypes.string,
        prompt: PropTypes.string,
        recallId: PropTypes.string,
        required: PropTypes.bool,
        responseId: PropTypes.string,
        type: PropTypes.oneOf([type])
    })
};

export default MultiButtonResponseEditor;
