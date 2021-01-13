import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Input, Modal } from '@components/UI';
import { createCohort } from '@actions/cohort';
import { getUser } from '@actions/user';
import '../ScenariosList/ScenariosList.css';

export class CohortCreateNewForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };

    this.onChange = this.onChange.bind(this);
    this.createCohort = this.createCohort.bind(this);
  }

  async createCohort() {
    const cohort = await this.props.createCohort(this.state);
    return cohort;
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value });
  }

  render() {
    const { onChange, createCohort } = this;

    let inProgress = false;

    const primary = {
      ...this.props?.buttons?.primary
    };

    const secondary = {
      ...this.props?.buttons?.secondary
    };

    const disabled = this.state.name ? false : true;

    const primaryButtonProps = {
      content: primary?.content || 'Create',
      disabled,
      primary: true,
      onClick: async () => {
        if (inProgress) {
          return;
        }
        inProgress = true;
        const cohort = await createCohort();
        if (primary?.onClick) {
          primary?.onClick(cohort);
        }
      }
    };

    const secondaryButtonProps = {
      content: secondary?.content || 'Cancel',
      onClick: () => {
        if (secondary?.onClick) {
          secondary?.onClick();
        }
      }
    };

    return (
      <Modal.Accessible open>
        <Modal
          closeIcon
          open
          aria-modal="true"
          role="dialog"
          size="fullscreen"
          centered={false}
          onClose={secondaryButtonProps.onClick}
        >
          <Header
            icon="group"
            content={this.props.header || 'Create a cohort'}
          />
          <Modal.Content>
            {this.props.stepGroup ? this.props.stepGroup : null}

            <Header as="h2">Name your cohort</Header>
            <p>
              <Icon name="star" className="primary" />
              Use a label that makes it easy for you to locate it (e.g. CS 101:
              Fall 2020). You may also change the name of your cohort any time
              after it has been created.
            </p>
            <Form onSubmit={createCohort}>
              <Input fluid focus name="name" onChange={onChange} />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button.Group fluid>
              <Button {...primaryButtonProps} />
              <Button.Or />
              <Button {...secondaryButtonProps} />
            </Button.Group>
          </Modal.Actions>
          <div data-testid="cohort-create-new-form" />
        </Modal>
      </Modal.Accessible>
    );
  }
}

CohortCreateNewForm.propTypes = {
  buttons: PropTypes.object,
  createCohort: PropTypes.func,
  getUser: PropTypes.func,
  header: PropTypes.any,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  onCancel: PropTypes.func,
  stepGroup: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = dispatch => ({
  createCohort: params => dispatch(createCohort(params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortCreateNewForm)
);
