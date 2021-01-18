import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, Header, Input, Modal, Text } from '@components/UI';
import { setCohort } from '@actions/cohort';
import './Cohort.css';

export class CohortRename extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      name: this.props.cohort.name
    };

    this.onChange = this.onChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event, { value }) {
    this.setState({
      error: null,
      name: value
    });
  }

  onClose() {
    /* istanbul ignore else */
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  async onSubmit() {
    if (!this.state.name) {
      this.setState({
        error: {
          message: 'Cohort name cannot be empty.'
        }
      });
      return;
    }

    if (
      this.state.name !== this.props.cohort.name &&
      window.confirm('Are you sure you want to rename this cohort?')
    ) {
      const { name } = this.state;

      await this.props.setCohort(this.props.cohort.id, {
        name
      });
      this.onClose();
    }
  }

  render() {
    const { cohort } = this.props;
    const { error, name } = this.state;
    const { onChange, onClose, onSubmit } = this;
    const ariaLabelContent = `Rename "${cohort.name}"`;

    return (
      <Modal.Accessible open>
        <Modal
          closeIcon
          open
          aria-modal="true"
          role="dialog"
          size="small"
          onClose={onClose}
        >
          <Header icon="group" content={ariaLabelContent} />
          <Modal.Content>
            <Form onSubmit={onSubmit}>
              <Input
                fluid
                size="big"
                data-testid="cohort-rename-input"
                aria-label={ariaLabelContent}
                defaultValue={name}
                onChange={onChange}
              />
            </Form>
            {error ? <Text error>{error.message}</Text> : null}
          </Modal.Content>
          <Modal.Actions>
            <Button.Group fluid>
              <Button primary aria-label="Save" onClick={onSubmit}>
                Save
              </Button>
              <Button.Or />
              <Button aria-label="Close" onClick={onClose}>
                Close
              </Button>
            </Button.Group>
          </Modal.Actions>
          <div data-testid="cohort-rename" />
        </Modal>
      </Modal.Accessible>
    );
  }
}

CohortRename.propTypes = {
  cohort: PropTypes.object,
  onClose: PropTypes.func,
  setCohort: PropTypes.func
};

const mapStateToProps = state => {
  const { cohort, user } = state;
  return { cohort, user };
};

const mapDispatchToProps = dispatch => ({
  setCohort: (id, params) => dispatch(setCohort(id, params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CohortRename);
