import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Container,
    Form,
    Icon,
    Input,
    List,
    Menu
} from 'semantic-ui-react';
import { type } from './meta';
import EditorMenu from '@components/EditorMenu';
import DataHeader from '@components/Slide/Components/DataHeader';
import Sortable from '@components/Sortable';
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
            responseId = ''
        } = props.value;

        this.state = {
            activeIndex: recallId ? 0 : -1,
            buttons,
            header,
            prompt,
            recallId,
            responseId
        };

        this.onButtonAddClick = this.onButtonAddClick.bind(this);
        this.onButtonDeleteClick = this.onButtonDeleteClick.bind(this);
        this.onButtonDetailChange = this.onButtonDetailChange.bind(this);
        this.onButtonOrderChange = this.onButtonOrderChange.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onRecallChange = this.onRecallChange.bind(this);

        this.preventEmptyButtonField = this.preventEmptyButtonField.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    onChange(event, { name, value }) {
        this.setState({ [name]: value }, this.updateState);
    }

    updateState() {
        const { buttons, header, prompt, recallId, responseId } = this.state;

        this.props.onChange({
            buttons,
            header,
            prompt,
            recallId,
            responseId,
            type
        });
    }

    onRecallChange({ recallId }) {
        this.setState({ recallId }, this.updateState);
    }

    onButtonAddClick() {
        const { buttons } = this.state;
        buttons.push({
            display: '',
            value: ''
        });
        this.setState({ buttons }, this.updateState);
    }

    onButtonDeleteClick(index) {
        const buttons = this.state.buttons.slice();
        buttons.splice(index, 1);
        this.setState({ buttons }, this.updateState);
    }

    onButtonOrderChange(fromIndex, toIndex) {
        this.moveButton(fromIndex, toIndex);
    }

    onButtonDetailChange(event, { index, name, value }) {
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
        const { scenarioId, slideIndex } = this.props;
        const { buttons, header, prompt, recallId } = this.state;
        const {
            onButtonAddClick,
            onButtonDeleteClick,
            onButtonDetailChange,
            onButtonOrderChange,
            onRecallChange,
            onChange,
            preventEmptyButtonField,
            updateState
        } = this;

        return (
            <Form>
                <Container fluid>
                    <ResponseRecall
                        value={{ recallId }}
                        slideIndex={slideIndex}
                        scenarioId={scenarioId}
                        onChange={onRecallChange}
                    />
                    <Form.TextArea
                        label="Prompt (displayed before buttons)"
                        name="prompt"
                        value={prompt}
                        onChange={onChange}
                    />
                    <Button icon onClick={onButtonAddClick}>
                        <Icon.Group
                            size="large"
                            className="editormenu__icon-group"
                        >
                            <Icon name="hand pointer outline" />
                            <Icon corner="top right" name="add" color="green" />
                        </Icon.Group>
                        Add A Button
                    </Button>
                    <List>
                        <Sortable onChange={onButtonOrderChange}>
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
                                                            onButtonDetailChange
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
                                                            onButtonDetailChange
                                                        }
                                                    />
                                                </Menu.Item>
                                            ],
                                            save: {
                                                onClick: () => updateState()
                                            },
                                            delete: {
                                                onConfirm: () =>
                                                    onButtonDeleteClick(index)
                                            }
                                        }}
                                    />
                                );
                            })}
                        </Sortable>
                    </List>
                    <DataHeader content={header} onChange={onChange} />
                </Container>
            </Form>
        );
    }
}

MultiButtonResponseEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    scenarioId: PropTypes.any,
    slideIndex: PropTypes.any,
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
