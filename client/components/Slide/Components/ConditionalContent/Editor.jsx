import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import escapeRegExp from 'lodash.escaperegexp';
import { v4 as uuid } from 'uuid';
import { type } from './meta';
import { getScenarioPromptComponents } from '@actions/scenario';
import AgentSelector from '@components/Slide/Components/AgentSelector';
import EditorMenu from '@components/EditorMenu';
import SlideComponentSelect, {
  ComponentItem
} from '@components/SlideComponentSelect';
import Sortable from '@components/Sortable';
import {
  Container,
  Dropdown,
  Form,
  Grid,
  Icon,
  Input,
  Menu,
  Segment,
  Table
} from '@components/UI';
import * as Components from '@components/Slide/Components';
import Conditional, { terms } from '@utils/Conditional';
import Identity from '@utils/Identity';
import '@components/Slide/Components/MultiPathResponse/MultiPathResponse.css';
import '@components/Admin/Agents.css';
import './ConditionalContent.css';

const operationDropdownOptions = terms.map(({ key, op, def, description }) => {
  return {
    key,
    value: key,
    text: op,
    content: (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <code>{op}</code>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              {def}:<br />
              {description}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  };
});

const availableComponents = [
  'Text',
  'Suggestion',
  'ResponseRecall',
  'AudioPrompt',
  'MultiPathResponse',
  'ConversationPrompt',
  'MultiButtonResponse',
  'TextResponse'
];

class ConditionalContentEditor extends React.Component {
  constructor(props) {
    super(props);
    const { agent = null, component, recallId = '', rules = [] } = props.value;
    this.state = {
      agent,
      component,
      recallId,
      rules,
      rule: {
        key: '',
        value: ''
      }
    };
    this.timeout = null;
    this.onChange = this.onChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.moveButton = this.moveButton.bind(this);
    this.onComponentSelectClick = this.onComponentSelectClick.bind(this);
    this.onRuleAddClick = this.onRuleAddClick.bind(this);
    this.onRuleDeleteClick = this.onRuleDeleteClick.bind(this);
    this.onRuleOrderChange = this.onRuleOrderChange.bind(this);
    this.onRuleDetailChange = this.onRuleDetailChange.bind(this);
    this.onRuleSearchChange = this.onRuleSearchChange.bind(this);
  }

  async componentDidMount() {
    const prompts = await this.props.getScenarioPromptComponents(
      this.props.scenario.id
    );

    if (!this.hasUnmounted) {
      this.setState({ isReady: true, prompts });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);

    const { agent, component, recallId, rules } = this.props.value;

    const lastProps = {
      agent,
      component,
      recallId,
      rules
    };

    if (Identity.key(this.state) !== Identity.key(lastProps)) {
      this.updateState();
    }
    this.hasUnmounted = true;
  }

  delayedUpdateState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.updateState, 1000);
  }

  updateState() {
    const { agent, component, recallId, rules } = this.state;
    this.props.onChange({
      ...this.props.value,
      agent,
      component,
      recallId,
      rules,
      type
    });
  }

  onComponentSelectClick(selected) {
    const component = Components[selected].defaultValue({
      responseId: uuid()
    });

    component.id = uuid();
    component.required = false;
    component.isConditional = true;

    if (component.responseId) {
      component.header = `Slide ${this.props.slideIndex +
        1}, Conditional Content: ${selected}`;
    }

    this.setState({ component }, this.updateState);
  }

  onRuleAddClick() {
    const { rules } = this.state;
    rules.push({
      key: '',
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
    rules[index][name] = name === 'value' ? Number(value) : value;

    this.setState({ rules }, this.delayedUpdateState);
  }

  onRuleSearchChange(options, query) {
    const re = new RegExp(escapeRegExp(query));
    return options.filter((option, index) => re.test(JSON.stringify(option)));
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
    this.setState({ [name]: value }, this.updateState);
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }
    const {
      scenario,
      slideIndex,
      value: { id }
    } = this.props;
    const { agent, prompts, component, rules } = this.state;
    const {
      onChange,
      updateState,
      moveButton,
      onComponentSelectClick,
      onRuleAddClick,
      onRuleDeleteClick,
      onRuleOrderChange,
      onRuleDetailChange,
      onRuleSearchChange
    } = this;
    const baseOptions = operationDropdownOptions.slice();

    const onDeleteRuleClick = index => {
      const rules = this.state.rules.slice();
      rules.splice(index, 1);
      this.setState({
        rules
      });
    };

    baseOptions.unshift({
      id: '',
      key: '',
      value: 'Select an operator'
    });

    const agentsSource = scenario.agent
      ? [scenario.agent]
      : prompts.reduce((accum, prompt) => {
          if (prompt.agent) {
            accum.push(prompt.agent);
          }
          return accum;
        }, []);

    const agentsInUse = agentsSource.reduce((accum, agent) => {
      if (!agent) {
        return accum;
      }
      if (accum.find(a => a.id === agent.id)) {
        return accum;
      }
      return [...new Set([...accum, agent.id])];
    }, []);

    let expression = rules.reduce((accum, rule, index) => {
      const term = Conditional.getTerm(rule.key);
      const isLogical = Conditional.isLogicalOp(rule.key);
      if (isLogical && rules.length === index + 1) {
        return accum;
      }
      return term
        ? `${accum}${!isLogical ? 'X' : ''} ${term.operator} ${rule.value}`
        : accum;
    }, '');

    const ComponentEditor = component
      ? Components[component.type].Editor
      : null;

    return agentsInUse.length ? (
      <Container fluid>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <AgentSelector
                  label="Select an active AI agent:"
                  agent={agent}
                  agentsInUse={agentsInUse}
                  onChange={onChange}
                />
                <Segment>
                  <p tabIndex="0" className="cce__paragraph">
                    <Icon name="attention" />
                    Create rules that are used to determine if the content below
                    will be displayed to the participant.
                  </p>
                  <p tabIndex="0" className="cce__paragraph">
                    <Icon name="attention" />
                    <code className="cce__code">X</code> is the sum of
                    affirmative responses from the agent, and{' '}
                    <code className="cce__code">Y</code> is your comparison
                    value.
                  </p>
                </Segment>
                <Table definition striped unstackable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell className="mpr__thead-background" />
                      <Table.HeaderCell>Operation</Table.HeaderCell>
                      <Table.HeaderCell className="cce__cell-constraint">
                        Y value
                      </Table.HeaderCell>
                      {/*
                      <Table.HeaderCell className="cce__cell-constraint" />
                      */}
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
                      const { key, value } = rule;
                      const baseKey = Identity.key({ id, index });
                      const ruleKey = Identity.key({ baseKey, rule });

                      const isFirst = index === 0;
                      const isLast = index - 1 === rules.length;
                      const lastRule = rules[index - 1];

                      const options = baseOptions.filter(option => {
                        const isLogical = Conditional.isLogicalOp(option.value);
                        // Logical operators cannot appear at the first or last position
                        // Logical operators cannot appear in sequence
                        if (
                          isLogical &&
                          (isFirst ||
                            isLast ||
                            (lastRule && Conditional.isLogicalOp(lastRule.key)))
                        ) {
                          return false;
                        }
                        // Comparison expressions cannot appear in sequence
                        if (
                          !isLogical &&
                          (lastRule && !Conditional.isLogicalOp(lastRule.key))
                        ) {
                          return false;
                        }

                        return true;
                      });

                      const isLogical = key && Conditional.isLogicalOp(key);

                      const term = Conditional.getTerm(key);
                      const operatorDisplay = term ? term.operator : null;
                      const binOpEvalDisplay =
                        operatorDisplay && !isLogical ? (
                          <code>
                            X {operatorDisplay} {value}
                          </code>
                        ) : null;

                      const logicalOpEvalDisplay = isLogical ? (
                        <code>{operatorDisplay}</code>
                      ) : null;

                      const evalDisplay =
                        logicalOpEvalDisplay || binOpEvalDisplay;
                      const evaluation =
                        evalDisplay || 'Select an operator to create a rule';
                      const valueIsDisabled = isLogical;

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
                              name="key"
                              aria-label={`Select the operator for expression ${index +
                                1}`}
                              index={index}
                              value={key}
                              onChange={onRuleDetailChange}
                              search={onRuleSearchChange}
                              options={options}
                              key={`rule-key-${ruleKey}`}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            {valueIsDisabled ? null : (
                              <Input
                                fluid
                                name="value"
                                autoComplete="off"
                                type="number"
                                aria-label={`Enter the value for expression ${index +
                                  1}`}
                                index={index}
                                value={value || ''}
                                onChange={onRuleDetailChange}
                                options={options}
                                key={`rule-value-${baseKey}`}
                              />
                            )}
                          </Table.Cell>
                          {/*
                          <Table.Cell>{evaluation}</Table.Cell>
                          */}
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
                        {/*
                        <Table.Cell colSpan={4}>
                        */}
                        <Table.Cell colSpan={4}>
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
                      {/*
                      <Table.HeaderCell colSpan="3" />
                      */}
                      <Table.HeaderCell colSpan="2" />
                      <Table.HeaderCell>
                        <Menu floated="right" borderless>
                          <Menu.Item.Tabbable
                            icon
                            aria-label="Add a rule"
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
              </Form>

              {expression ? (
                <pre className="cce__code" style={{ padding: '1em' }}>
                  IF {expression} THEN:
                </pre>
              ) : null}

              <Menu borderless>
                <Dropdown item text="Select a component to display">
                  <Dropdown.Menu>
                    {availableComponents.map((item, index) => (
                      <ComponentItem
                        position="right center"
                        key={Identity.key({ item, index })}
                        item={item}
                        onClick={onComponentSelectClick}
                      />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Menu>

              <Segment>
                {component ? (
                  <ComponentEditor
                    scenario={scenario}
                    slideIndex={slideIndex}
                    value={component}
                    onChange={component => {
                      this.setState(
                        {
                          component
                        },
                        this.updateState
                      );
                    }}
                  />
                ) : (
                  "Select a component to configure as your condition's consequent output. It will be displayed here."
                )}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div data-testid="conditional-content-editor" />
      </Container>
    ) : (
      <Segment>There are currently no active agents in this scenario</Segment>
    );
  }
}

ConditionalContentEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  scenario: PropTypes.object,
  value: PropTypes.shape({
    agent: PropTypes.object,
    id: PropTypes.string,
    recallId: PropTypes.string,
    recallSharedWithRoles: PropTypes.array,
    rules: PropTypes.array,
    component: PropTypes.object,
    type: PropTypes.oneOf([type])
  })
};

const mapDispatchToProps = dispatch => ({
  getScenarioPromptComponents: id => dispatch(getScenarioPromptComponents(id))
});

export default connect(
  null,
  mapDispatchToProps
)(ConditionalContentEditor);
