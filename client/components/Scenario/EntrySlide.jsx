import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, Message } from '@components/UI';
import './EntrySlide.css';

class EntrySlide extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
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
    if (!this.isScenarioRun) {
      this.setState({
        isReady: true
      });
      return;
    }

    window.scrollTo(0, 0);
  }
  render() {
    const { run, scenario } = this.props;
    const { title, description, consent } = scenario;
    const className = run ? 'scenario__card--run' : 'scenario__card';
    const __html = consent.prose;
    const isConsentAgreementAcknowledged =
      run && run.consent_acknowledged_by_user;
    const revokeOrRestore =
      isConsentAgreementAcknowledged &&
      (run && run.consent_granted_by_user
        ? { negative: true }
        : { positive: true });

    // TODO: Create a table that contains system settings
    // for storage of options like this.
    //
    // Set this to `true` to enable revocable consent.
    const consentIsRevocable = false;

    return (
      <Card id="entry" key="entry" centered className={className}>
        <Card.Content style={{ flexGrow: '0' }}>
          <Card.Header>{title}</Card.Header>
        </Card.Content>
        <Card.Content>
          <p className="entryslide__description-inner-container">
            {description}
          </p>

          {run && run.updated_at !== null && (
            <Message
              size="large"
              color="olive"
              header="In Progress"
              content="This scenario is currently in progress"
            />
          )}
          {consent && (
            <Message
              size="large"
              color="yellow"
              header="Consent Agreement"
              content={
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
                      <Button color="green" onClick={this.props.onNextClick}>
                        Continue this scenario
                      </Button>
                    </Button.Group>
                  )}
                </div>
              }
            />
          )}
        </Card.Content>
      </Card>
    );
  }
}

EntrySlide.propTypes = {
  onChange: PropTypes.func,
  onNextClick: PropTypes.func,
  run: PropTypes.object,
  scenario: PropTypes.object
};

const mapStateToProps = state => {
  const { run } = state;
  return { run };
};

export default connect(mapStateToProps)(EntrySlide);
