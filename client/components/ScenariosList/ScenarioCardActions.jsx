import './ScenariosList.css';

import { Button, Icon } from '@components/UI';
import React, { Component, Fragment } from 'react';

import Gate from '@client/components/Gate';
import Identity from '@utils/Identity';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Storage from '@utils/Storage';
import { connect } from 'react-redux';
import { deleteScenario } from '@actions/scenario';
import { withRouter } from 'react-router-dom';

const labelClassName = 'sc__card-action-labels';

const RunScenarioButton = ({ id, activeRunSlideIndex }) => {
  return (
    <Button
      tabIndex="0"
      aria-label="Run scenario"
      className="sc__button"
      size="tiny"
      icon
      as={Link}
      to={`/run/${Identity.toHash(id)}/slide/${activeRunSlideIndex}`}
    >
      <Icon name="play" className="primary" />
      <span className={labelClassName}>Run</span>
    </Button>
  );
};

RunScenarioButton.propTypes = {
  id: PropTypes.number,
  activeRunSlideIndex: PropTypes.number
};

const CopyScenarioButton = ({ id }) => {
  return (
    <Gate requiredPermission="create_scenario">
      <Button
        tabIndex="0"
        size="tiny"
        icon
        as={Link}
        to={`/editor/copy/${id}`}
        aria-label="Copy scenario"
        className="sc__button sc__hidden-on-mobile"
      >
        <Icon name="copy outline" className="primary" />
        <span className={labelClassName}>Copy</span>
      </Button>
    </Gate>
  );
};

CopyScenarioButton.propTypes = {
  id: PropTypes.number
};

class ScenarioCardActions extends Component {
  render() {
    const { isLoggedIn, scenario, user } = this.props;
    const scenarioUser = scenario.users.find(u => u.id === user.id);

    const isAuthorizedToEdit =
      (scenarioUser && scenarioUser.is_author) || user.is_super;

    // eslint-disable-next-line no-unused-vars
    const isAuthorizedToDelete =
      (scenarioUser && scenarioUser.is_owner) || user.is_super;

    const isAuthorizedToReview = scenarioUser && scenarioUser.is_reviewer;

    const editor = Storage.get(`editor/${scenario.id}`, {
      activeTab: 'slides',
      activeSlideIndex: 1
    });
    const run = Storage.get(`run/${scenario.id}`, {
      // The title slide is slide 0
      activeRunSlideIndex: 0
    });

    // Using == to match both undefined and null
    if (editor.activeSlideIndex == null) {
      editor.activeSlideIndex = 1;
      Storage.set(`editor/${scenario.id}`, editor);
    }

    return (
      <Button.Group fluid>
        <RunScenarioButton
          id={scenario.id}
          activeRunSlideIndex={run.activeRunSlideIndex}
          labelClassName={labelClassName}
        />
        {isLoggedIn && (
          <Fragment>
            <Gate isAuthorized={isAuthorizedToEdit}>
              <Button
                tabIndex="0"
                size="tiny"
                icon
                as={Link}
                to={`/editor/${scenario.id}/${editor.activeTab}/${editor.activeSlideIndex}`}
                aria-label="Edit scenario"
                className="sc__button sc__hidden-on-mobile"
              >
                <Icon name="edit outline" className="primary" />
                <span className={labelClassName}>Edit</span>
              </Button>
            </Gate>
            <Gate isAuthorized={isAuthorizedToReview}>
              <Button
                tabIndex="0"
                size="tiny"
                icon
                as={Link}
                to={`/editor/${scenario.id}/preview/${editor.activeSlideIndex}`}
                aria-label="Edit scenario"
                className="sc__button sc__hidden-on-mobile"
              >
                <Icon className="book reader icon primary" />
                <span className={labelClassName}>Review</span>
              </Button>
            </Gate>
            {/*
            <Gate isAuthorized={isAuthorizedToDelete}>
              <Button
                size="tiny"
                icon
                as={Link}
                to={{ pathname: `/scenarios/` }}
                aria-label="Delete scenario"
                className="sc__button sc__hidden-on-mobile"
                onClick={(event) => {
                  // event.preventDefault();
                  (async () => {
                    await this.props.deleteScenario(scenario.id);
                    this.props.history.push('/');
                    this.props.history.goBack();
                  })();
                }}
              >
                <Icon name="trash alternate outline" />
                <span className={className}>Delete</span>
              </Button>
            </Gate>
            */}
            <CopyScenarioButton id={scenario.id} />
          </Fragment>
        )}
      </Button.Group>
    );
  }
}

ScenarioCardActions.propTypes = {
  deleteScenario: PropTypes.func.isRequired,
  history: PropTypes.object,
  isLoggedIn: PropTypes.bool.isRequired,
  scenario: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const {
    session: { isLoggedIn },
    user
  } = state;
  return { isLoggedIn, user };
};

const mapDispatchToProps = dispatch => ({
  deleteScenario: id => dispatch(deleteScenario(id))
});

export { CopyScenarioButton, RunScenarioButton };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ScenarioCardActions)
);
