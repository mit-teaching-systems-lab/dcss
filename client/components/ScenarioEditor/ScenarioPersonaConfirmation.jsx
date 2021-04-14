import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Icon, Modal } from '@components/UI';
import { unlinkPersonaFromScenario } from '@actions/persona';

const DEFAULT_PERSONA_ID = 1;

class ScenarioPersonaConfirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true
    };

    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onConfirm(e) {
    const { persona } = this.props;

    this.props.onConfirm(e, {
      persona
    });

    this.setState({
      open: false
    });
  }

  onCancel() {
    this.setState({
      open: false
    });
    this.props.onCancel();
  }

  render() {
    const { open } = this.state;
    const { persona, scenario } = this.props;
    const { onCancel, onConfirm } = this;

    const hasOnlyDefaultPersona =
      scenario.personas.length === 1 &&
      scenario.personas[0].id === DEFAULT_PERSONA_ID;

    const header = `Add the "${persona.name}" persona to your scenario?`;

    const removeDefault = e => {
      this.props.unlinkPersonaFromScenario(DEFAULT_PERSONA_ID, scenario.id);
      onConfirm(e);
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
            {hasOnlyDefaultPersona ? (
              <p>
                Click{' '}
                <strong>
                  &quot;Yes, add this persona and remove the default
                  persona&quot;
                </strong>{' '}
                to add this persona to your scenario, and remove the default{' '}
                &quot;{scenario.personas[0].name}&quot; persona.
              </p>
            ) : null}
            <p>
              Click <strong>&quot;Yes&quot;</strong> to add this persona to your
              scenario, or <strong>&quot;No&quot;</strong> to cancel.
            </p>
            <p>
              You can edit or remove the persona by clicking the{' '}
              <Icon name="ellipsis horizontal" /> icon at any time.
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  {hasOnlyDefaultPersona ? (
                    <Button
                      fluid
                      primary
                      size="large"
                      type="submit"
                      onClick={removeDefault}
                      style={{ marginBottom: '1em' }}
                    >
                      Yes, add this persona and remove the default persona
                    </Button>
                  ) : null}
                  <Button.Group fluid>
                    <Button
                      primary
                      size="large"
                      type="submit"
                      onClick={onConfirm}
                    >
                      Yes
                    </Button>
                    <Button.Or />
                    <Button size="large" onClick={onCancel}>
                      No
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

ScenarioPersonaConfirmation.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  persona: PropTypes.object,
  scenario: PropTypes.object,
  unlinkPersonaFromScenario: PropTypes.func
};

const mapStateToProps = state => {
  const { scenario } = state;
  return {
    scenario
  };
};

const mapDispatchToProps = dispatch => ({
  unlinkPersonaFromScenario: (...params) =>
    dispatch(unlinkPersonaFromScenario(...params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioPersonaConfirmation);
