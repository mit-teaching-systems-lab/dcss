import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, Message } from 'semantic-ui-react';
import { setRun } from '@client/actions';

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
        return (
            <Card id="entry" key="entry" centered className={className}>
                <Card.Content style={{ flexGrow: '0' }}>
                    <Card.Header>{title}</Card.Header>
                </Card.Content>
                <Card.Content>
                    <p>{description}</p>

                    {run && run.updated_at !== null && (
                        <Message
                            size="large"
                            color="olive"
                            header="In Progress"
                            content="This Teacher Moment is currently in progress"
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
                                        dangerouslySetInnerHTML={{
                                            __html
                                        }}
                                    />

                                    {!isConsentAgreementAcknowledged ? (
                                        <Button.Group fluid>
                                            <Button
                                                onClick={this.onClick}
                                                positive
                                            >
                                                Yes, I consent
                                            </Button>
                                            <Button.Or />
                                            <Button
                                                onClick={this.onClick}
                                                negative
                                            >
                                                No, I do not consent
                                            </Button>
                                        </Button.Group>
                                    ) : (
                                        <Button.Group fluid>
                                            <Button
                                                onClick={this.onClick}
                                                {...revokeOrRestore}
                                            >
                                                {revokeOrRestore.negative
                                                    ? 'Revoke my consent'
                                                    : 'Restore my consent'}
                                            </Button>
                                            <Button.Or />
                                            <Button
                                                color="green"
                                                onClick={this.props.onClickNext}
                                            >
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
    run: PropTypes.object,
    scenario: PropTypes.object,
    onChange: PropTypes.func,
    onClickNext: PropTypes.func
};

function mapStateToProps(state) {
    const { run } = state.run;
    return { run };
}

const mapDispatchToProps = {
    setRun
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntrySlide);
