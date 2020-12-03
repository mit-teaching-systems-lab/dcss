import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from '@components/Notification';
import {
  Button,
  ColorPicker,
  Form,
  Grid,
  Header,
  Modal,
  Text
} from '@components/UI';
import {
  createPersona,
  linkPersonaToScenario,
  setPersona,
  unlinkPersonaFromScenario
} from '@actions/persona';
import { personaInitialState } from '@reducers/initial-states';

class ScenarioPersonaEditor extends Component {
  constructor(props) {
    super(props);

    // Derive "persona" from props, since it will
    // change state during its time in the editor
    let { persona } = this.props;

    if (!persona) {
      persona = {
        ...personaInitialState
      };
    }

    this.state = {
      error: {
        field: null,
        message: null
      },
      open: true,
      persona
    };

    this.onCancel = this.onCancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit() {
    const { persona } = this.state;
    const { scenario } = this.props;
    const error = {
      field: null,
      message: null
    };

    if (!persona.name) {
      error.field = 'name';
      error.message = 'A name is required.';
    } else if (!persona.description) {
      error.field = 'description';
      error.message = 'A description is required.';
    } else if (!persona.color) {
      error.field = 'color';
      error.message = 'A color is required.';
    }

    if (error.field) {
      this.setState({
        error
      });
    } else {
      let message = '';

      if (!persona.id || persona.is_read_only) {
        const created = await this.props.createPersona(persona);
        // If we're actually making a "copy" of an existing persona,
        // then we need to unlink the original persona to avoid having
        // both appear.
        if (persona.id && persona.is_read_only) {
          await this.props.unlinkPersonaFromScenario(persona.id, scenario.id);
          await this.props.linkPersonaToScenario(created.id, scenario.id);
          message = 'Persona saved!';
        } else {
          await this.props.linkPersonaToScenario(created.id, scenario.id);
          message = 'Persona created!';
        }
        this.setState({
          persona: created
        });
      } else {
        await this.props.setPersona(persona.id, persona);
        message = 'Persona updated!';
      }

      if (message) {
        await notify({ message, color: 'green' });
      }
    }
  }

  onChange(e, props) {
    const { name, value } = props;
    const { persona: previous } = this.state;
    const persona = {
      ...previous,
      [name]: value
    };

    this.setState({
      persona
    });
  }

  onCancel() {
    this.props.onCancel();
  }

  render() {
    const { error, open, persona } = this.state;
    const { onChange, onCancel, onSubmit } = this;
    const isNewPersona = !persona.id;

    const personaName =
      persona.name && persona.name.length > 40
        ? `${persona.name.slice(0, 40)}...`
        : persona.name;

    const header = isNewPersona
      ? `Create a new persona`
      : `Edit the ${personaName} persona`;

    const createOrSave = isNewPersona ? 'Create' : 'Save';

    const cancelOrClose = isNewPersona ? 'Cancel' : 'Close';

    const colorPickerProps = {
      name: 'color',
      value: persona.color,
      onChange
    };

    return (
      <Modal.Accessible open={open}>
        <Modal
          closeIcon
          role="dialog"
          aria-modal="true"
          aria-labelledby="persona-editor"
          size="small"
          onClose={onCancel}
          open={open}
        >
          <Header id="persona-editor" icon="user outline" content={header} />
          <Modal.Content>
            <Form onSubmit={onSubmit}>
              <Form.Field required>
                <label htmlFor="name">
                  Name:{' '}
                  {error.field === 'name' ? (
                    <Text right error>
                      {error.message}
                    </Text>
                  ) : null}
                </label>
                <Form.Input
                  aria-label="Persona name"
                  name="name"
                  autoComplete="off"
                  placeholder="..."
                  defaultValue={persona.name || ''}
                  onChange={onChange}
                  {...(error.field === 'name' && { error: true })}
                />
              </Form.Field>
              <Form.Field required>
                <label htmlFor="description">
                  Description:{' '}
                  {error.field === 'description' ? (
                    <Text right error>
                      {error.message}
                    </Text>
                  ) : null}
                </label>
                <Form.TextArea
                  aria-label="Persona description"
                  name="description"
                  autoComplete="description"
                  placeholder="..."
                  defaultValue={persona.description || ''}
                  onChange={onChange}
                  {...(error.field === 'description' && { error: true })}
                />
              </Form.Field>
            </Form>

            <Form>
              <Form.Field required style={{ marginTop: '1em' }}>
                <label htmlFor="color">
                  Color:{' '}
                  {error.field === 'color' ? (
                    <Text right error>
                      {error.message}
                    </Text>
                  ) : null}
                </label>
                <ColorPicker.Accessible {...colorPickerProps} />
              </Form.Field>
            </Form>
            {/*
            <Message
              color="orange"
              content="Changes made to this persona will only be visible in this scenario."
            />
            */}
          </Modal.Content>
          <Modal.Actions>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Button.Group fluid>
                    <Button
                      primary
                      size="large"
                      type="submit"
                      onClick={onSubmit}
                    >
                      {createOrSave}
                    </Button>
                    <Button.Or />
                    <Button size="large" onClick={onCancel}>
                      {cancelOrClose}
                    </Button>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Actions>
        </Modal>
      </Modal.Accessible>
    );
  }
}

ScenarioPersonaEditor.propTypes = {
  createPersona: PropTypes.func,
  linkPersonaToScenario: PropTypes.func,
  onCancel: PropTypes.func,
  persona: PropTypes.object,
  scenario: PropTypes.object,
  setPersona: PropTypes.func,
  unlinkPersonaFromScenario: PropTypes.func
};

const mapStateToProps = state => {
  const { personasById, scenario } = state;
  return {
    personasById,
    scenario
  };
};

const mapDispatchToProps = dispatch => ({
  createPersona: params => dispatch(createPersona(params)),
  linkPersonaToScenario: (...params) =>
    dispatch(linkPersonaToScenario(...params)),
  setPersona: (id, params) => dispatch(setPersona(id, params)),
  unlinkPersonaFromScenario: (...params) =>
    dispatch(unlinkPersonaFromScenario(...params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioPersonaEditor);
