import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, Header, Message, Modal } from '@components/UI';
import htmlId from '@utils/html-id';
import { IS_AUDIO_RECORDING_SUPPORTED } from '@utils/Media';
import './EntrySlide.css';

class EntrySlide extends React.Component {
  constructor(props) {
    super(props);

    const { permissions } = this.props;

    this.state = {
      isReady: false,
      showPermissionConfirmation: false,
      /*
        https://w3c.github.io/permissions/#reading-current-states

        The "granted" state represents that the caller will be able to
        successfuly access the feature without having the user agent
        asking the user’s permission.

        The "denied" state represents that the caller will not be able
        to access the feature.

        The "prompt" state represents that the user agent will be asking
        the user’s permission if the caller tries to access the feature.
        The user might grant, deny or dismiss the request.


        These values start off as boolean: true or false. That value is
        used to indicate to which permissions need to be queried.
       */
      permissions
    };

    this.onClick = this.onClick.bind(this);
  }

  get isScenarioRun() {
    return location.pathname.includes('/run/');
  }

  onClick(event, data) {
    if (!this.props.run) {
      alert('Consent cannot be granted in Preview');
      return null;
    }
    if (data.positive || data.negative) {
      const consent_acknowledged_by_user = true;
      const consent_granted_by_user = !data.negative;
      this.props.onChange(event, {
        consent_acknowledged_by_user,
        consent_granted_by_user
      });
    }
  }

  async componentDidMount() {
    if (this.isScenarioRun) {
      let { microphone } = this.state.permissions;

      if (IS_AUDIO_RECORDING_SUPPORTED) {
        if (microphone) {
          const query = await navigator.permissions.query({
            name: 'microphone'
          });
          microphone = query.state;
        }
      }

      this.setState({
        isReady: true,
        permissions: {
          microphone
        }
      });
      return;
    }

    this.setState({
      isReady: true
    });

    window.scrollTo(0, 0);
  }

  onPermissionRequest() {
    this.setState({ permissionsRequestOpen: true });
  }

  render() {
    const { run, scenario } = this.props;
    const { isReady, permissions, showPermissionConfirmation } = this.state;
    const { title, description, consent } = scenario;
    const className = run ? 'scenario__slide-column-card' : 'scenario__card';
    const __html = consent.prose;
    const isConsentAgreementAcknowledged =
      run && run.consent_acknowledged_by_user;
    const revokeOrRestore =
      isConsentAgreementAcknowledged &&
      (run && run.consent_granted_by_user
        ? { negative: true }
        : { positive: true });

    if (!isReady) {
      return null;
    }

    // TODO: Create a table that contains system settings
    // for storage of options like this.
    //
    // Set this to `true` to enable revocable consent.
    const isPermissionRequired = Object.values(permissions).some(
      state => state === 'prompt'
    );
    const continueThisScenario =
      isPermissionRequired && IS_AUDIO_RECORDING_SUPPORTED
        ? () => this.setState({ showPermissionConfirmation: true })
        : this.props.onNextClick;

    const onPermissionConfirmationClick = async (event, { name }) => {
      const { permissions } = this.state;

      if (name === 'yes') {
        const constraints = {
          audio: permissions.microphone === 'prompt'
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach(track => track.stop());
      }
      this.props.onNextClick();
    };

    const ariaLabelledBy = htmlId();
    const ariaDescribedBy = htmlId();
    const permissionConfirmation = showPermissionConfirmation ? (
      <Modal.Accessible open={showPermissionConfirmation}>
        <Modal
          size="small"
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          open={showPermissionConfirmation}
        >
          <Header
            icon="cog"
            content="Requesting Permission"
            id={ariaLabelledBy}
          />
          <Modal.Content id={ariaDescribedBy}>
            This scenario needs permission to record responses using your
            device&apos;s microphone.
          </Modal.Content>
          <Modal.Actions>
            <Button.Group fluid>
              <Button
                name="yes"
                color="green"
                onClick={onPermissionConfirmationClick}
              >
                Ok
              </Button>
              <Button.Or />
              <Button
                name="no"
                color="grey"
                onClick={onPermissionConfirmationClick}
              >
                No
              </Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>
      </Modal.Accessible>
    ) : null;

    const consentIsRevocable = false;

    const isPermissionRelevant =
      showPermissionConfirmation && IS_AUDIO_RECORDING_SUPPORTED;
    const showContinuation =
      isConsentAgreementAcknowledged && !isPermissionRelevant;
    const postConsentAcknowledgement = showContinuation ? (
      <Button.Group fluid>
        {consentIsRevocable && (
          <React.Fragment>
            <Button onClick={this.onClick} {...revokeOrRestore}>
              {revokeOrRestore.negative
                ? 'Revoke my consent'
                : 'Restore my consent'}
            </Button>
            <Button.Or />
          </React.Fragment>
        )}
        <Button color="green" onClick={continueThisScenario}>
          Continue this scenario
        </Button>
      </Button.Group>
    ) : (
      permissionConfirmation
    );

    const consentAgreement = (
      <div>
        <p
          className="entryslide__consent-inner-container"
          dangerouslySetInnerHTML={{
            __html
          }}
        />

        {!isConsentAgreementAcknowledged ? (
          <Button.Group fluid>
            <Button onClick={this.onClick} positive>
              Yes, I consent
            </Button>
            <Button.Or />
            <Button onClick={this.onClick} negative>
              No, I do not consent
            </Button>
          </Button.Group>
        ) : (
          postConsentAcknowledgement
        )}
      </div>
    );

    return (
      <Card id="entry" key="entry" centered className={className}>
        <Card.Content style={{ flexGrow: '0' }}>
          <Card.Header>{title}</Card.Header>
        </Card.Content>
        <Card.Content>
          <p className="entryslide__description-inner-container">
            {description}
          </p>

          {run && run.updated_at !== null ? (
            <Message
              size="large"
              color="olive"
              header="In Progress"
              content="This scenario is currently in progress"
            />
          ) : null}
          {consent ? (
            <Message
              size="large"
              color="yellow"
              header="Consent Agreement"
              content={consentAgreement}
            />
          ) : null}
        </Card.Content>
      </Card>
    );
  }
}

EntrySlide.propTypes = {
  onChange: PropTypes.func,
  onNextClick: PropTypes.func,
  permissions: PropTypes.object,
  run: PropTypes.object,
  scenario: PropTypes.object
};

const mapStateToProps = state => {
  const { run } = state;
  return { run };
};

export default connect(mapStateToProps)(EntrySlide);
