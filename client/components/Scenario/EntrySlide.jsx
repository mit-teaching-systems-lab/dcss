import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, Header, Message, Modal } from '@components/UI';
import Identity from '@utils/Identity';
import { IS_FIREFOX, IS_AUDIO_RECORDING_SUPPORTED } from '@utils/Media';
import {
  AUDIO_RECORD_PERMISSION_DENIED,
  AUDIO_RECORD_PERMISSION_GRANTED,
  SCENARIO_CONSENT_ARRIVAL,
  SCENARIO_CONSENT_ACKNOWLEDGE,
  SCENARIO_CONSENT_CONTINUE
} from '@hoc/withRunEventCapturing';
import './EntrySlide.css';

class EntrySlide extends React.Component {
  constructor(props) {
    super(props);

    const { permissions = {} } = this.props;

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
    this.onContinueClick = this.onContinueClick.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  get isCohortScenarioRun() {
    return window.location.pathname.includes('/cohort/');
  }

  get isMultiparticipant() {
    return this.props.scenario.personas.length > 1;
  }

  onClick(event, data) {
    if (!this.isScenarioRun) {
      alert('Consent cannot be granted in Preview');
      return null;
    }
    if (data.positive || data.negative) {
      const consent_acknowledged_by_user = true;
      const consent_granted_by_user = !data.negative;
      const consent = {
        consent_acknowledged_by_user,
        consent_granted_by_user
      };
      this.props.saveRunEvent(SCENARIO_CONSENT_ACKNOWLEDGE, {
        scenario: this.props.scenario,
        consent
      });
      this.props.onChange(event, consent);
    }
  }

  async componentDidMount() {
    if (this.isScenarioRun) {
      let { microphone } = this.state.permissions;

      if (IS_AUDIO_RECORDING_SUPPORTED && !IS_FIREFOX) {
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

  onContinueClick(scenario) {
    this.props.saveRunEvent(SCENARIO_CONSENT_CONTINUE, { scenario });
    this.props.onNextClick();
  }

  render() {
    const { run, scenario } = this.props;
    const { isReady, permissions, showPermissionConfirmation } = this.state;
    const { title, description, consent } = scenario;
    const cardClass = this.isScenarioRun
      ? 'scenario__slide-card'
      : 'scenario__slide-card-preview';

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
      isPermissionRequired && IS_AUDIO_RECORDING_SUPPORTED && !IS_FIREFOX
        ? () => this.setState({ showPermissionConfirmation: true })
        : () => this.onContinueClick(scenario);

    const onPermissionConfirmationClick = async (event, { name }) => {
      const { permissions } = this.state;
      let hasGranted = false;

      if (name === 'yes') {
        const constraints = {
          audio: permissions.microphone === 'prompt'
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach(track => {
          hasGranted = true;
          track.stop();
        });
      }

      const which = hasGranted
        ? AUDIO_RECORD_PERMISSION_GRANTED
        : AUDIO_RECORD_PERMISSION_DENIED;

      this.props.saveRunEvent(which, { scenario });

      this.onContinueClick(scenario);
    };

    const ariaLabelledby = Identity.id();
    const ariaDescribedby = Identity.id();
    const permissionConfirmation = showPermissionConfirmation ? (
      <Modal.Accessible open={showPermissionConfirmation}>
        <Modal
          size="small"
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          open={showPermissionConfirmation}
        >
          <Header
            icon="cog"
            content="Requesting Permission"
            id={ariaLabelledby}
          />
          <Modal.Content id={ariaDescribedby}>
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
          tabIndex="0"
          className="entryslide__consent-inner-container"
          dangerouslySetInnerHTML={{
            __html
          }}
        />
      </div>
    );

    // This is an initial arrival.
    if (this.isScenarioRun && !run.updated_at) {
      this.props.saveRunEvent(SCENARIO_CONSENT_ARRIVAL, {
        scenario
      });
    }

    //
    //
    //
    //
    // TODO: Integrate "Lobby"
    //
    //
    //
    //

    return (
      <Card id="entry" key="entry" centered className={cardClass}>
        <Card.Content className="scenario__slide-card-header">
          <Card.Header tabIndex="0">{title}</Card.Header>
        </Card.Content>
        <Card.Content>
          <p tabIndex="0" className="entryslide__description-inner-container">
            {description}
          </p>

          {run && run.updated_at !== null ? (
            <Message
              tabIndex="0"
              size="large"
              color="olive"
              header="In Progress"
              content="This scenario is currently in progress"
            />
          ) : null}
          {consent ? (
            <Message
              tabIndex="0"
              size="large"
              color="yellow"
              header="Consent Agreement"
              content={consentAgreement}
            />
          ) : null}
        </Card.Content>
        <Card.Content extra>
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
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object
};

const mapStateToProps = state => {
  const { chat, run } = state;
  return { chat, run };
};

export default connect(mapStateToProps)(EntrySlide);
