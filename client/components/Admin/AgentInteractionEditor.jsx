import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from '@components/Notification';
import {
  Button,
  Dropdown,
  Form,
  Grid,
  Header,
  Modal,
  Text
} from '@components/UI';
import { createInteraction, setInteraction } from '@actions/interaction';
import { interactionInitialState } from '@reducers/initial-states';

class AgentInteractionEditor extends Component {
  constructor(props) {
    super(props);

    // Derive "interaction" from props, since it will
    // change state during its time in the editor
    let { interaction } = this.props;

    if (!interaction) {
      interaction = {
        ...interactionInitialState
      };
    }

    this.state = {
      error: {
        field: null,
        message: null
      },
      open: true,
      interaction
    };

    this.onCancel = this.onCancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit() {
    const { interaction } = this.state;
    const error = {
      field: null,
      message: null
    };

    if (!interaction.description) {
      error.field = 'description';
      error.message = 'A description is required.';
    }

    if (!interaction.name) {
      error.field = 'name';
      error.message = 'A name is required.';
    }

    if (!interaction.types.length) {
      error.field = 'types';
      error.message = 'At least one prompt is required.';
    }

    if (error.field) {
      this.setState({
        error
      });
    } else {
      let message = '';

      if (!interaction.id) {
        const created = await this.props.createInteraction(interaction);
        message = 'Interaction created!';
        this.setState({
          interaction: created
        });
      } else {
        await this.props.setInteraction(interaction.id, interaction);
        message = 'Interaction updated!';
      }

      if (message) {
        await notify({ message, color: 'green' });
      }
    }
  }

  onChange(e, props) {
    const { name, value } = props;
    const { interaction: previous } = this.state;
    const interaction = {
      ...previous,
      [name]: value
    };

    console.log("interaction", interaction);
    this.setState({
      interaction
    });
  }

  onCancel() {
    this.props.onCancel();
  }

  render() {
    const { error, open, interaction } = this.state;
    const { onChange, onCancel, onSubmit } = this;
    const isNewInteraction = !interaction.id;

    const interactionName =
      interaction.name && interaction.name.length > 40
        ? `${interaction.name.slice(0, 40)}...`
        : interaction.name;

    const header = isNewInteraction
      ? `Create a new interaction`
      : `Edit the ${interactionName} interaction`;

    const createOrSave = isNewInteraction ? 'Create' : 'Save';
    const cancelOrClose = isNewInteraction ? 'Cancel' : 'Close';
    const colorPickerProps = {
      name: 'color',
      value: interaction.color,
      onChange,
      position: 'absolute'
    };

    const options = this.props.interactionsTypes.map(type => {
      return {
        key: type.id,
        value: type.name,
        text: type.name
      }
    });

    return (
      <Modal.Accessible open={true}>
        <Modal
          closeIcon
          role="dialog"
          aria-modal="true"
          aria-labelledby="interaction-editor"
          size="small"
          onClose={onCancel}
          open={true}
        >
          <Header
            id="interaction-editor"
            icon="user outline"
            content={header}
          />
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
                  aria-label="Interaction name"
                  name="name"
                  autoComplete="off"
                  placeholder="..."
                  defaultValue={interaction.name || ''}
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
                  aria-label="Interaction description"
                  name="description"
                  autoComplete="description"
                  placeholder="..."
                  defaultValue={interaction.description || ''}
                  onChange={onChange}
                  {...(error.field === 'description' && { error: true })}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="types">
                  Prompts:{' '}
                  {error.field === 'types' ? (
                    <Text right error>
                      {error.message}
                    </Text>
                  ) : null}
                </label>
                <Dropdown
                  search
                  selection
                  fluid
                  multiple
                  name="types"
                  placeholder="Select one or more prompts"
                  options={options}
                  value={interaction.types}
                  onChange={onChange}
                />
              </Form.Field>
            </Form>
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

AgentInteractionEditor.propTypes = {
  createInteraction: PropTypes.func,
  onCancel: PropTypes.func,
  interaction: PropTypes.object,
  interactionsById: PropTypes.object,
  interactionsTypes: PropTypes.array,
  setInteraction: PropTypes.func
};

const mapStateToProps = state => {
  const { interaction, interactionsById, interactionsTypes } = state;
  return {
    interaction,
    interactionsById,
    interactionsTypes
  };
};

const mapDispatchToProps = dispatch => ({
  createInteraction: params => dispatch(createInteraction(params)),
  setInteraction: (id, params) => dispatch(setInteraction(id, params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgentInteractionEditor);
