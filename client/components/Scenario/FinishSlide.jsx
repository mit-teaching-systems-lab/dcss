import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Button, Card, Header, Icon, Modal } from '@components/UI';
import { SCENARIO_COMPLETE } from '@hoc/withRunEventCapturing';
import Identity from '@utils/Identity';
import './Scenario.css';

class FinishSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmBoxOpen: this.isScenarioRun ? true : false
    };
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  get isCohortScenarioRun() {
    return window.location.pathname.includes('/cohort/');
  }

  get isMultiparticipantScenarioRun() {
    return this.props.scenario.personas.length > 1;
  }

  async componentDidMount() {
    if (!this.isScenarioRun) {
      return;
    }

    window.scrollTo(0, 0);
  }

  onCancel() {
    if (!this.isScenarioRun) {
      return;
    }
    this.props.onBackClick();
  }

  onConfirm(event) {
    if (!this.isScenarioRun) {
      return;
    }
    this.setState({ isConfirmBoxOpen: false });
    this.props.onChange(event, {
      ended_at: new Date().toISOString()
    });

    this.props.saveRunEvent(SCENARIO_COMPLETE, {
      scenario: this.props.scenario
    });
  }

  render() {
    const { onCancel, onConfirm } = this;
    const { cohortId, scenario, scenarioId, slide } = this.props;
    const { isConfirmBoxOpen } = this.state;
    const components = (slide && slide.components) || [{ html: '' }];
    const className = `scenario__slide-card${
      isConfirmBoxOpen ? '-hidden' : ''
    }`;

    const scenarioCardContentClass = this.isScenarioRun
      ? 'scenario__slide-card-content'
      : 'scenario__slide-card-content-preview';

    const baseReturnToXUrl = this.isCohortScenarioRun
      ? `/cohort/${Identity.toHash(cohortId)}`
      : '';

    const rerunUrl = `/run/${scenarioId}/slide/0`;

    const returnToX = this.isCohortScenarioRun ? (
      <Button primary to={baseReturnToXUrl} as={NavLink}>
        Return to cohort
      </Button>
    ) : (
      <Button primary to="/scenarios" as={NavLink}>
        Return to scenarios
      </Button>
    );

    const rerunThisUrl = this.isCohortScenarioRun
      ? `${baseReturnToXUrl}${rerunUrl}`
      : rerunUrl;

    const rerunThisX = (
      <Button onClick={() => (location.href = rerunThisUrl)}>
        Rerun this scenario
      </Button>
    );

    const inCohortMultiparticipant = this.isMultiparticipantScenarioRun && this.isCohortScenarioRun;

    const showRerunOption = inCohortMultiparticipant
      ? false
      : true;

    const ariaLabel = `Ready to finish this scenario? If you're ready to finish, click "I'm done!"`;

    return (
      <React.Fragment>
        <Card centered className={className}>
          <Card.Content className="scenario__slide-card-header">
            <Card.Header>
              <Button.Group fluid>
                {returnToX}
                {showRerunOption ? (
                  <Fragment>
                    <Button.Or />
                    {rerunThisX}
                  </Fragment>

                ) : null}
              </Button.Group>
            </Card.Header>
          </Card.Content>
          <Card.Content tabIndex="0" className={scenarioCardContentClass}>
            {components &&
              components.map(({ html: __html }, index) => (
                <p
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html
                  }}
                />
              ))}
          </Card.Content>
        </Card>
        {isConfirmBoxOpen ? (
          <Modal.Accessible open={isConfirmBoxOpen}>
            <Modal
              role="dialog"
              size="tiny"
              aria-modal="true"
              open={isConfirmBoxOpen}
            >
              <Header aria-label={ariaLabel}>
                <Icon.Group className="em__icon-group-margin">
                  <Icon name="newspaper outline" />
                  <Icon corner="top right" name="check circle" color="orange" />
                </Icon.Group>

                <Header.Content>Ready to finish this scenario?</Header.Content>
              </Header>
              <Modal.Content>
                If you&apos;re ready to finish, click &quot;I&apos;m done!&quot;
              </Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button color="green" onClick={onConfirm}>
                    I&apos;m done!
                  </Button>
                  <Button.Or />
                  <Button color="grey" onClick={onCancel}>
                    Go back
                  </Button>
                </Button.Group>
              </Modal.Actions>
            </Modal>
          </Modal.Accessible>
        ) : null}
      </React.Fragment>
    );
  }
}

FinishSlide.propTypes = {
  cohortId: PropTypes.node,
  scenarioId: PropTypes.node,
  back: PropTypes.string,
  onBackClick: PropTypes.func,
  onChange: PropTypes.func,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object,
  slide: PropTypes.object
};

const mapStateToProps = state => {
  const { run } = state;
  return { run };
};

export default connect(mapStateToProps)(FinishSlide);
