import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Grid, Header, Icon, Modal } from '@components/UI';

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
    const { persona } = this.props;
    const { onCancel, onConfirm } = this;

    const header = `Add the "${persona.name}" persona to your scenario?`;

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
            <p>
              Click &quot;Yes&quot; to add this persona to your scenario, or
              &quot;No&quot; to cancel.
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
  scenario: PropTypes.object
};

const mapStateToProps = state => {
  const { scenario } = state;
  return {
    scenario
  };
};

export default connect(
  mapStateToProps,
  null
)(ScenarioPersonaConfirmation);
