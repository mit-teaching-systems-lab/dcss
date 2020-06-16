import React from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import {
  Button,
  Container,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Table
} from 'semantic-ui-react';
import { type } from './meta';
import ConfirmableDeleteButton from '@components/EditorMenu/ConfirmableDeleteButton';
import EditorMenu from '@components/EditorMenu';
import DataHeader from '@components/Slide/Components/DataHeader';
import Sortable from '@components/Sortable';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import '@components/Slide/SlideEditor/SlideEditor.css';
import './MultiButtonResponse.css';

class MultiButtonResponseEditor extends React.Component {
  constructor(props) {
    super(props);
    const {
      /*
      {
          display: "Text on button",
          value: "Value button represents"
      }
      */
      buttons = [],
      header = '',
      prompt = '',
      recallId = '',
      responseId = ''
    } = props.value;

    this.state = {
      header,
      prompt,
      buttons,
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
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.timeout = null;
  }

  componentWillUnmount() {
    clearInterval(this.timeout);

    const {
      header,
      prompt,
      buttons,
      recallId,
      responseId
    } = this.props.value;

    const lastProps = {
      header,
      prompt,
      buttons,
      recallId,
      responseId
    };

    console.log(lastProps);
    if (hash(this.state) !== hash(lastProps)) {
      this.updateState();
    }
  }

  delayedUpdateState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(this.updateState, 500);
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
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ recallId }, this.updateState);
  }

  onButtonAddClick() {
    const { buttons } = this.state;
    buttons.push({
      display: '',
      value: ''
    });
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ buttons }, this.updateState);
  }

  onButtonDeleteClick(index) {
    const buttons = this.state.buttons.slice();
    buttons.splice(index, 1);
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ buttons }, this.updateState);
  }

  onButtonOrderChange(fromIndex, toIndex) {
    this.moveButton(fromIndex, toIndex);
  }

  onButtonDetailChange(event, { index, name, value }) {
    const { buttons } = this.state;
    buttons[index][name] = value;
    this.setState({ buttons }, this.delayedUpdateState);
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

    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ buttons }, this.updateState);
  }

  moveButton(fromIndex, toIndex) {
    const { buttons } = this.state;
    const moving = buttons[fromIndex];
    buttons.splice(fromIndex, 1);
    buttons.splice(toIndex, 0, moving);
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ buttons }, this.updateState);
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value }, this.delayedUpdateState);
  }

  render() {
    const { scenarioId, slideIndex } = this.props;
    const { header, prompt, buttons, recallId } = this.state;

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
            onBlur={updateState}
          />

          <Table definition striped unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="mbr__thead-background" />
                <Table.HeaderCell>
                  {buttons.length ? 'Button Display' : ''}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {buttons.length ? 'Button Value' : ''}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Sortable
              tag="tbody"
              onChange={onButtonOrderChange}
              options={{
                direction: 'vertical',
                swapThreshold: 0.5,
                animation: 150
              }}
            >
              {buttons.map(({ display, value }, index) => {
                const onBlurOrFocus = preventEmptyButtonField.bind(
                  this,
                  index
                );
                const key = `button-row-${value}-${index}`;
                return (
                  <Table.Row className="mbr__cursor-grab" key={key}>
                    <Table.Cell collapsing>
                      <EditorMenu
                        className="mbr__em-fixed-width"
                        type="button"
                        items={{
                          save: {
                            onClick: () => updateState()
                          },
                          delete: {
                            onConfirm: () => onButtonDeleteClick(index)
                          }
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        fluid
                        name="display"
                        index={index}
                        key={`button-diplay-${index}`}
                        value={display}
                        onBlur={onBlurOrFocus}
                        onFocus={onBlurOrFocus}
                        onChange={onButtonDetailChange}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        fluid
                        name="value"
                        index={index}
                        key={`button-value-${index}`}
                        value={value}
                        onFocus={onBlurOrFocus}
                        onBlur={onBlurOrFocus}
                        onChange={onButtonDetailChange}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Sortable>

            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="2">
                  <Button icon floated="right" onClick={onButtonAddClick}>
                    <Icon.Group size="large" className="em__icon-group-margin">
                      <Icon name="hand pointer outline" />
                      <Icon corner="top right" name="add" color="green" />
                    </Icon.Group>
                    Add A Button
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
          <DataHeader
            content={header}
            onChange={onChange}
            onBlur={updateState}
          />
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
    id: PropTypes.string,
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
