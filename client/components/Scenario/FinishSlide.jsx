import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button, Card, Header, Icon, Modal } from '@components/UI';
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
    return location.pathname.includes('/run/');
  }

  get isCohortScenarioRun() {
    return location.pathname.includes('/cohort/');
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
  }

  render() {
    const { onCancel, onConfirm } = this;
    const { cohortId, slide } = this.props;
    const { isConfirmBoxOpen } = this.state;
    const components = (slide && slide.components) || [{ html: '' }];
    const className = `scenario__slide-column-card${
      isConfirmBoxOpen ? '-hidden' : ''
    }`;

    const extra = (
      <Card.Content>
        {this.isCohortScenarioRun ? (
          <NavLink to={`/cohort/${cohortId}`}>Return to cohort</NavLink>
        ) : (
          <NavLink to="/scenarios/">Return to scenarios</NavLink>
        )}
      </Card.Content>
    );

    const ariaLabel = `Ready to finish this scenario? If you're ready to finish, click "I'm done!"`;

    return (
      <React.Fragment>
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
        <Card centered className={className}>
          {extra}
          <Card.Content>
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
  slide: PropTypes.object
};

export default FinishSlide;
