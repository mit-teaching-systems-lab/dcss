import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Identity from '@utils/Identity';
import PropTypes from 'prop-types';
import {
  Button,
  ColorPicker,
  Container,
  Dropdown,
  Menu,
  Table
} from '@components/UI';
import {
  createPersona,
  getPersonas,
  linkPersonaToScenario,
  unlinkPersonaFromScenario
} from '@actions/persona';

import EditorMenu from '@components/EditorMenu';
import ScenarioPersonaConfirmation from '@components/ScenarioEditor/ScenarioPersonaConfirmation';
import ScenarioPersonaEditor from '@components/ScenarioEditor/ScenarioPersonaEditor';
import ScenarioPersonaSelect from '@components/ScenarioEditor/ScenarioPersonaSelect';

import './ScenarioPersonas.css';

const isPersonaInScenario = (personaOrId, scenario) => {
  let id = typeof personaOrId === 'string' ? personaOrId : personaOrId.id;
  return scenario.personas.find(persona => persona.id === id) !== undefined;
};

class ScenarioPersonas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      error: {
        field: null,
        message: null
      },
      isReady: false,
      openPersonaConfirmation: false,
      openPersonaEditor: false,
      persona: null
    };

    this.onPersonaConfirmationComplete = this.onPersonaConfirmationComplete.bind(
      this
    );
    this.onPersonaEditorClose = this.onPersonaEditorClose.bind(this);
  }

  async componentDidMount() {
    if (!this.props.personas.length) {
      await this.props.getPersonas();
    }

    this.setState({
      isReady: true
    });
  }

  onPersonaConfirmationComplete() {
    this.setState({
      openPersonaConfirmation: false,
      persona: null
    });
  }

  onPersonaEditorClose() {
    this.setState({
      openPersonaEditor: false,
      persona: null
    });
  }

  render() {
    const { createPersona, linkPersonaToScenario, scenario } = this.props;
    const {
      isReady,
      openPersonaConfirmation,
      openPersonaEditor,
      persona
    } = this.state;
    const { onPersonaConfirmationComplete, onPersonaEditorClose } = this;

    if (!isReady) {
      return null;
    }

    const rows = scenario.personas.map(persona => {
      const key = Identity.key(persona);
      const textAlignProps = {
        textAlign: 'right',
        style: {
          overflow: 'visible'
        }
      };

      return (
        <Table.Row key={key}>
          <Table.Cell className="sp__td-10 sp__td-truncated">
            {persona.name}
          </Table.Cell>
          <Table.Cell className="sp__td-250px sp__td-truncated">
            {persona.description}
          </Table.Cell>
          <Table.Cell className="sp__td-5">
            <ColorPicker.Accessible
              position="fixed"
              value={persona.color}
              disabled={true}
            />
          </Table.Cell>
          <Table.Cell className="sp__td-5" {...textAlignProps}>
            <Dropdown
              item
              text=""
              direction="left"
              icon="ellipsis horizontal"
              tabIndex={0}
              style={textAlignProps}
            >
              <Dropdown.Menu>
                <Menu.Item.Tabbable
                  key="edit"
                  role="option"
                  tabIndex={0}
                  onClick={() => {
                    this.setState({
                      openPersonaEditor: true,
                      persona
                    });
                  }}
                >
                  Edit
                </Menu.Item.Tabbable>
                {scenario.personas.length > 1 ? (
                  <Menu.Item.Tabbable
                    key="remove"
                    role="option"
                    tabIndex={0}
                    onClick={() => {
                      this.props.unlinkPersonaFromScenario(
                        persona.id,
                        scenario.id
                      );
                    }}
                  >
                    Remove
                  </Menu.Item.Tabbable>
                ) : null}
              </Dropdown.Menu>
            </Dropdown>
          </Table.Cell>
        </Table.Row>
      );
    });

    const left = [
      <Menu.Item.Tabbable key="menu-item-personas">
        Personas ({this.props.scenario.personas.length})
      </Menu.Item.Tabbable>
    ];

    const personas = this.props.personas.reduce((accum, persona) => {
      // Cannot select from personas that are not shared.
      if (!persona.is_shared) {
        return accum;
      }

      // Ignore personas that are shared and already in this scenario
      if (isPersonaInScenario(persona, scenario)) {
        return accum;
      }

      accum.push(persona);
      return accum;
    }, []);

    const personaSelectProps = {
      fluid: true,
      onSelect: persona => {
        if (persona) {
          this.setState({
            openPersonaConfirmation: true,
            persona
          });
        }
      },
      personas,
      placeholder: 'Select a persona to add',
      search: true,
      selection: true,
      value: null
    };

    const right = [
      <Menu.Menu key="menu-menu-search-personas" position="right">
        <Menu.Item
          key="menu-item-search-personas"
          name="Search shared personas"
        >
          <ScenarioPersonaSelect {...personaSelectProps} />
        </Menu.Item>
        <Menu.Item
          key="menu-item-new-persona"
          name="Create a new persona"
          className="em__search-input-box-right"
        >
          <Button
            icon="user plus"
            className="sp__button"
            content="Create a Persona"
            size="medium"
            onClick={() => {
              this.setState({
                openPersonaEditor: true,
                persona: null
              });
            }}
          />
        </Menu.Item>
      </Menu.Menu>
    ];

    const editorMenu = (
      <EditorMenu text type="scenario authors" items={{ left, right }} />
    );

    const scenarioPersonaEditorProps = {
      persona,
      onCancel() {
        onPersonaEditorClose();
      }
    };

    const scenarioPersonaConfirmationProps = {
      persona,
      async onConfirm(e, props) {
        const { name, color, description } = props.persona || {};

        const persona = await createPersona({
          name,
          color,
          description
        });
        linkPersonaToScenario(persona.id, scenario.id);
        onPersonaConfirmationComplete();
      },
      onCancel() {
        onPersonaConfirmationComplete();
      }
    };

    return (
      <Fragment>
        {editorMenu}
        <Table fixed striped unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="sp__td-15">Name</Table.HeaderCell>
              <Table.HeaderCell className="sp__td-250px">
                Description
              </Table.HeaderCell>
              <Table.HeaderCell className="sp__td-5">Color</Table.HeaderCell>
              <Table.HeaderCell className="sp__td-5">{''}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className="ut__tbody">{rows}</Table.Body>
        </Table>
        <Container>
          Personas define the roles that participants will play in a scenario.
        </Container>

        {openPersonaEditor ? (
          <ScenarioPersonaEditor {...scenarioPersonaEditorProps} />
        ) : null}

        {openPersonaConfirmation ? (
          <ScenarioPersonaConfirmation {...scenarioPersonaConfirmationProps} />
        ) : null}
      </Fragment>
    );
  }
}

ScenarioPersonas.propTypes = {
  createPersona: PropTypes.func.isRequired,
  getPersonas: PropTypes.func.isRequired,
  linkPersonaToScenario: PropTypes.func.isRequired,
  personas: PropTypes.array,
  personasById: PropTypes.object,
  scenario: PropTypes.object,
  unlinkPersonaFromScenario: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { personas, personasById, scenario } = state;
  return {
    personas,
    personasById,
    scenario
  };
};

const mapDispatchToProps = dispatch => ({
  createPersona: params => dispatch(createPersona(params)),
  getPersonas: () => dispatch(getPersonas()),
  linkPersonaToScenario: (...params) =>
    dispatch(linkPersonaToScenario(...params)),
  unlinkPersonaFromScenario: (...params) =>
    dispatch(unlinkPersonaFromScenario(...params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioPersonas);
