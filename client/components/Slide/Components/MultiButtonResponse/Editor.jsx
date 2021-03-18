import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  ColorPicker,
  Form,
  Icon,
  Input,
  Menu,
  Table
} from '@components/UI';
import { type } from './meta';
import AgentSelector from '@components/Slide/Components/AgentSelector';
import EditorMenu from '@components/EditorMenu';
import DataHeader from '@components/Slide/Components/DataHeader';
import Sortable from '@components/Sortable';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import Identity from '@utils/Identity';
import '@components/Slide/SlideEditor/SlideEditor.css';
import './MultiButtonResponse.css';

class MultiButtonResponseEditor extends React.Component {
  constructor(props) {
    super(props);
    const {
      /*
      {
          color: "#HHHHHH" | "colorname"
          display: "Text on button",
          value: "Value button represents"
      }
      */
      agent,
      buttons = [],
      header = '',
      prompt = '',
      recallId = '',
      recallSharedWithRoles,
      responseId
    } = props.value;

    this.state = {
      agent,
      buttons,
      header,
      prompt,
      recallId,
      recallSharedWithRoles,
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
    clearTimeout(this.timeout);

    const {
      agent,
      header,
      prompt,
      buttons,
      recallId,
      recallSharedWithRoles,
      responseId
    } = this.props.value;
    const lastProps = {
      agent,
      header,
      prompt,
      buttons,
      recallId,
      recallSharedWithRoles,
      responseId
    };

    if (Identity.key(this.state) !== Identity.key(lastProps)) {
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
    const {
      agent,
      buttons,
      header,
      prompt,
      recallId,
      recallSharedWithRoles,
      responseId
    } = this.state;

    this.props.onChange({
      ...this.props.value,
      agent,
      buttons,
      header,
      prompt,
      recallId,
      recallSharedWithRoles,
      responseId,
      type
    });
  }

  onRecallChange({ recallId, recallSharedWithRoles }) {
    this.setState({ recallId, recallSharedWithRoles }, this.updateState);
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
    const { scenario, slideIndex } = this.props;
    const {
      agent,
      header,
      id,
      prompt,
      buttons,
      recallId,
      recallSharedWithRoles
    } = this.state;

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
            isEmbedded={true}
            onChange={onRecallChange}
            parentResponseId={this.props.value.responseId}
            scenario={scenario}
            slideIndex={slideIndex}
            value={{ recallId, recallSharedWithRoles }}
          />
          <Form.TextArea
            label="Optional prompt to display before buttons:"
            name="prompt"
            rows={1}
            value={prompt}
            onChange={onChange}
            onBlur={updateState}
          />

          <Table definition striped unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="mbr__thead-background" />
                <Table.HeaderCell>Button display</Table.HeaderCell>
                <Table.HeaderCell>Button value</Table.HeaderCell>
                <Table.HeaderCell collapsing>Button color</Table.HeaderCell>
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
              {buttons.map(({ color, display, value }, index) => {
                const key = Identity.key({ color, id, index });
                const onBlurOrFocus = preventEmptyButtonField.bind(this, index);
                const colorPickerProps = {
                  direction: 'right',
                  index,
                  name: 'color',
                  value: color,
                  onChange: onButtonDetailChange,
                  position: 'fixed'
                };

                return (
                  <Table.Row className="mbr__cursor-grab" key={`row-${key}`}>
                    <Table.Cell collapsing>
                      <EditorMenu
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
                        aria-label={`Enter the display for button ${index + 1}`}
                        index={index}
                        key={`button-diplay-${key}`}
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
                        aria-label={`Enter the value of button ${index + 1}`}
                        index={index}
                        key={`button-value-${key}`}
                        value={value}
                        onFocus={onBlurOrFocus}
                        onBlur={onBlurOrFocus}
                        onChange={onButtonDetailChange}
                      />
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <ColorPicker.Accessible
                        index={index}
                        key={`color-${key}`}
                        {...colorPickerProps}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Sortable>

            {!buttons.length ? (
              <Table.Body>
                <Table.Row key={Identity.key({ id, ['empty']: true })} negative>
                  <Table.Cell colSpan={3}>
                    This prompt is empty! Please create at least one button,
                    otherwise this prompt will not appear in the slide.
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ) : null}

            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="3">
                  <Menu floated="right" borderless>
                    <Menu.Item.Tabbable
                      icon
                      aria-label="Add a button"
                      floated="right"
                      onClick={onButtonAddClick}
                    >
                      <Icon.Group
                        size="large"
                        className="em__icon-group-margin"
                      >
                        <Icon name="hand pointer outline" />
                        <Icon corner="top right" name="add" color="green" />
                      </Icon.Group>
                      Add a button
                    </Menu.Item.Tabbable>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>

          <AgentSelector
            label="Optional AI agent to receive button selection:"
            agent={agent}
            type={type}
            onChange={onChange}
          />

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
  scenario: PropTypes.object,
  slideIndex: PropTypes.any,
  value: PropTypes.shape({
    agent: PropTypes.object,
    id: PropTypes.string,
    buttons: PropTypes.array,
    header: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    recallSharedWithRoles: PropTypes.array,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type])
  })
};

export default MultiButtonResponseEditor;
