import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { type } from './meta';
import AgentSelector from '@components/Slide/Components/AgentSelector';
import EditorMenu from '@components/EditorMenu';
import RichTextEditor from '@components/RichTextEditor';
import Sortable from '@components/Sortable';
import {
  Checkbox,
  Container,
  Dropdown,
  Form,
  Grid,
  Icon,
  Input,
  Menu,
  Segment,
  Table,
  Text
} from '@components/UI';
import * as Components from '../../Components';
import Conditional, { terms } from '@utils/Conditional';
import Identity from '@utils/Identity';
import '@components/Slide/Components/MultiPathResponse/MultiPathResponse.css';
import '@components/Admin/Agents.css';
import './ConditionalContent.css';

const operationDropdownOptions = terms.map(({ op, en, ex }) => {
  return {
    key: op,
    value: op,
    text: en,
    content: (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{en}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{ex}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  };
});

class ConditionalContentEditor extends React.Component {
  constructor(props) {
    super(props);
    const { agent = null, html, rules = [] } = props.value;
    this.state = {
      agent,
      html,
      rules,
      rule: {
        operator: '',
        value: ''
      }
    };
    this.timeout = null;
    this.onChange = this.onChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.moveButton = this.moveButton.bind(this);
    this.onRuleAddClick = this.onRuleAddClick.bind(this);
    this.onRuleDeleteClick = this.onRuleDeleteClick.bind(this);
    this.onRuleOrderChange = this.onRuleOrderChange.bind(this);
    this.onRuleDetailChange = this.onRuleDetailChange.bind(this);
    this.onRuleSearchChange = this.onRuleSearchChange.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);

    const { agent, html, rules } = this.props.value;

    const lastProps = {
      agent,
      html,
      rules
    };

    if (Identity.key(this.state) !== Identity.key(lastProps)) {
      this.updateState();
    }
  }

  delayedUpdateState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.updateState, 5000);
  }

  updateState() {
    const { agent, html, rules } = this.state;
    this.props.onChange({
      agent,
      html,
      rules,
      type
    });
  }

  moveButton(fromIndex, toIndex) {
    const { rules } = this.state;
    const moving = rules[fromIndex];
    rules.splice(fromIndex, 1);
    rules.splice(toIndex, 0, moving);
    this.setState({ rules }, this.updateState);
  }

  onRuleAddClick() {
    const { rules } = this.state;
    rules.push({
      operator: '',
      value: ''
    });
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ rules }, this.updateState);
  }

  onRuleDeleteClick(index) {
    const rules = this.state.rules.slice();
    rules.splice(index, 1);
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ rules }, this.updateState);
  }

  onRuleOrderChange(fromIndex, toIndex) {
    this.moveButton(fromIndex, toIndex);
  }

  onRuleDetailChange(event, { index, options, name, value }) {
    if (value === -1) {
      return;
    }
    const { rules } = this.state;
    rules[index][name] = value;

    if (!rules[index].operator.trim()) {
      const { text } =
        options.find(option => option.value === rules[index].value) || {};

      if (text) {
        rules[index].operator = `Go to ${text}`;
      }
    }

    this.setState({ rules }, this.delayedUpdateState);
  }

  onRuleSearchChange(options, query) {
    const re = new RegExp(escapeRegExp(query));
    return options.filter(
      (option, index) => re.test(option.text) || String(index + 1) === query
    );
  }

  moveButton(fromIndex, toIndex) {
    const { rules } = this.state;
    const moving = rules[fromIndex];
    rules.splice(fromIndex, 1);
    rules.splice(toIndex, 0, moving);
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ rules }, this.updateState);
  }

  onChange(event, { name, value }) {
    console.log(name, value);
    this.setState({ [name]: value }, this.updateState);
  }

  render() {
    const {
      scenario,
      value: { id }
    } = this.props;
    const { agent, html, rules } = this.state;
    const {
      onChange,
      updateState,
      delayedUpdateState,
      moveButton,
      onRuleAddClick,
      onRuleDeleteClick,
      onRuleOrderChange,
      onRuleDetailChange,
      onRuleSearchChange
    } = this;
    const options = operationDropdownOptions.slice();

    let ComponentEditor = null;

    //
    //
    // DISABLED UNTIL SLIDE COMPONENT EDITING IS REFACTORED
    //
    //
    // if (component && component.type) {
    //   ComponentEditor = Components[component.type].Editor;
    // }
    // console.log("Rendering with:");
    // console.log(component);

    const onDeleteRuleClick = index => {
      const rules = this.state.rules.slice();
      rules.splice(index, 1);
      this.setState({
        rules
      });
    };

    options.unshift({
      id: '',
      key: '',
      value: 'Select an operator'
    });

    return (
      <Form>
        <Container fluid>
          <Grid>
            <Grid.Row className="cce__gridrow">
              <Grid.Column>
                <AgentSelector
                  label="Select an AI agent:"
                  agent={agent}
                  onChange={onChange}
                  types={['AudioPrompt', 'ConversationPrompt', 'TextResponse']}
                  updateState={updateState}
                />

                <p tabIndex="0" className="cce__paragraph">
                  Need to explain here what this does, how and why
                </p>
                <Table definition striped unstackable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell className="mpr__thead-background" />
                      <Table.HeaderCell>Operator</Table.HeaderCell>
                      <Table.HeaderCell className="mpr__goto-slide-constraint">
                        Y Value
                      </Table.HeaderCell>
                      <Table.HeaderCell className="mpr__goto-slide-constraint">
                        Evaluates as...
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Sortable
                    tag="tbody"
                    onChange={onRuleOrderChange}
                    options={{
                      direction: 'vertical',
                      swapThreshold: 0.5,
                      animation: 150
                    }}
                  >
                    {rules.map((rule, index) => {
                      const { operator, value } = rule;
                      const baseKey = Identity.key({ id, index });
                      const ruleKey = Identity.key({ baseKey, rule });
                      return (
                        <Table.Row
                          className="mpr__cursor-grab"
                          key={`table-row-${baseKey}`}
                        >
                          <Table.Cell collapsing>
                            <EditorMenu
                              type="rule"
                              items={{
                                save: {
                                  onClick: () => updateState()
                                },
                                delete: {
                                  onConfirm: () => onRuleDeleteClick(index)
                                }
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Dropdown
                              closeOnChange
                              fluid
                              selection
                              name="operator"
                              aria-label={`Select the destination slide for choice ${index +
                                1}`}
                              index={index}
                              value={operator}
                              onChange={onRuleDetailChange}
                              search={onRuleSearchChange}
                              options={options}
                              key={`rule-node-${ruleKey}`}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Input
                              fluid
                              name="value"
                              autoComplete="off"
                              aria-label={`Enter the operator for choice ${index +
                                1}`}
                              index={index}
                              value={value}
                              onChange={onRuleDetailChange}
                              options={options}
                              key={`rule-operator-${baseKey}`}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            {!value || !operator ? (
                              'Invalid rule'
                            ) : (
                              <code>
                                $value {operator} {value}
                              </code>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Sortable>

                  {!rules.length ? (
                    <Table.Body>
                      <Table.Row
                        key={Identity.key({ id, ['empty']: true })}
                        negative
                      >
                        <Table.Cell colSpan={3}>
                          There are no rules defined, which means this component
                          will not display anything on the slide. You must
                          create at least one rule to display the content in
                          your slide.
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
                            aria-label="Add another slide choice"
                            onClick={onRuleAddClick}
                          >
                            <Icon.Group
                              size="large"
                              className="em__icon-group-margin"
                            >
                              <Icon name="hand pointer outline" />
                              <Icon
                                corner="top right"
                                name="add"
                                color="green"
                              />
                            </Icon.Group>
                            Add a rule
                          </Menu.Item.Tabbable>
                        </Menu>
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Footer>
                </Table>
                <RichTextEditor
                  id="html"
                  name="html"
                  defaultValue={html}
                  onChange={value => {
                    console.log('?', value);
                    onChange(
                      {},
                      {
                        name: 'html',
                        value
                      }
                    );
                  }}
                  options={{
                    autoFocus: false,
                    buttons: 'component',
                    minHeight: '150px',
                    tabDisable: true
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        {/*
        <Segment>
          {ComponentEditor ? (
            <ComponentEditor
              key={component.id}
              id={component.id}
              slideId={this.props.id}
              slideIndex={this.props.index}
              scenario={scenario}
              value={component}
              onChange={updates => {
                console.log("...........ComponentEditor...........");

                const value = {
                  ...this.state.component,
                  ...updates
                };

                console.log(value);
                onChange({}, {
                  name: 'component',
                  value
                });
              }}
            />
          ) : 'Select a component from the right'}
        </Segment>
      */}
      </Form>
    );
  }
}

ConditionalContentEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  scenario: PropTypes.object,
  value: PropTypes.shape({
    id: PropTypes.string,
    rules: PropTypes.array,
    component: PropTypes.object,
    type: PropTypes.oneOf([type])
  })
};

export default ConditionalContentEditor;
