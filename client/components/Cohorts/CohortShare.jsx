import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Input, Modal } from '@components/UI';
import { getCohort, setCohort, createCohort } from '@actions/cohort';
import copy from 'copy-text-to-clipboard';
import { notify } from '@components/Notification';
import { getUser } from '@actions/user';
import CohortEmpty from './CohortEmpty';
import Identity from '@utils/Identity';
import '../ScenariosList/ScenariosList.css';

export class CohortCreateNewForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipients: []
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event, { name, value }) {
    //
    //
    // parse recipients
    //
    // this.setState({ [name]: value });
    //
    //
  }

  render() {
    const { cohort } = this.props;

    const url = `${location.origin}/cohort/${cohort.id}`;
    const onCohortUrlCopyClick = () => {
      copy(url);
      notify({
        message: `Copied: ${url}`
      });
    };

    const inputShowCohortUrl = (
      <Input
        fluid
        label="Cohort url"
        size="big"
        type="text"
        defaultValue={url}
      />
    );

    const buttonCopyCohortUrl = (
      <Button
        icon
        labelPosition="left"
        size="small"
        onClick={onCohortUrlCopyClick}
      >
        <Icon name="clipboard outline" className="primary" />
        Copy cohort link to clipboard
      </Button>
    );

    const primary = {
      ...this.props?.buttons?.primary
    };

    const secondary = {
      ...this.props?.buttons?.secondary
    };

    const primaryButtonProps = {
      content: primary?.content || 'Share',
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
          className="c__container-modal"
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

            <Header as="h2">Share with participants</Header>
            <p>
              <Icon name="star" className="primary" />
              Send participants this link to allow them to join your cohort and
              interact with your selected scenarios.
            </p>
            <p>{inputShowCohortUrl}</p>
            <p>{buttonCopyCohortUrl}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button.Group fluid>
              <Button {...primaryButtonProps} />
              <Button.Or />
              <Button {...secondaryButtonProps} />
            </Button.Group>
          </Modal.Actions>
        </Modal>
      </Modal.Accessible>
    );
  }
}

CohortCreateNewForm.propTypes = {
  buttons: PropTypes.object,
  cohort: PropTypes.object,
  getCohort: PropTypes.func,
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
  const { cohort, user } = state;
  return { cohort, user };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  createCohort: params => dispatch(createCohort(params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortCreateNewForm)
);
