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
import * as Color from '@utils/Color';

import './ScenarioPersonas.css';

const PersonaSelectorFormatted = ({
  name,
  description,
  color: backgroundColor
}) => {
  const color = Color.foregroundColor(backgroundColor);
  return (
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell style={{ color, backgroundColor }}>
            {name}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {description ? (
          <Table.Row>
            <Table.Cell>{description}</Table.Cell>
          </Table.Row>
        ) : null}
      </Table.Body>
    </Table>
  );
};

PersonaSelectorFormatted.propTypes = {
  color: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string
};

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
    const {
      createPersona,
      linkPersonaToScenario,
      personasById,
      scenario
    } = this.props;
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
            <ColorPicker.Accessible value={persona.color} disabled={true} />
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

    const personaOptions = this.props.personas.reduce((accum, persona) => {
      if (!persona.is_shared) {
        return accum;
      }

      if (isPersonaInScenario(persona, scenario)) {
        return accum;
      }

      return accum.concat([
        {
          key: persona.id,
          value: persona.id,
          text: persona.name,
          content: <PersonaSelectorFormatted {...persona} />
        }
      ]);
    }, []);

    personaOptions.unshift({
      key: -1,
      value: null,
      text: ''
    });

    const placeholder = 'Search and select a persona to add';
    const right = [
      <Menu.Menu key="menu-menu-search-personas" position="right">
        <Menu.Item
          key="menu-item-search-personas"
          name="Search shared personas"
          className="sp__dropdown"
        >
          <Dropdown
            fluid
            search
            selection
            placeholder={placeholder}
            options={personaOptions}
            value={null}
            onChange={(e, { value }) => {
              // If this persona is not presently in the list of personas
              // for this scenario, then ask if the user wants to add it.
              if (value && !isPersonaInScenario(value, scenario)) {
                this.setState({
                  persona: personasById[value],
                  openPersonaConfirmation: true
                });
              }
            }}
          />
        </Menu.Item>
        <Menu.Item
          key="menu-item-new-persona"
          name="Create a new persona"
          className="em__search-input-box-right"
        >
          <Button
            basic
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
