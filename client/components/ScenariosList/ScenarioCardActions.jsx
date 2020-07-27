import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Icon } from '@components/UI';
import { deleteScenario } from '@actions/scenario';
import Storage from '@utils/Storage';
import ConfirmAuth from '@client/components/ConfirmAuth';
import './ScenariosList.css';

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

    if (editor.activeSlideIndex === null) {
      editor.activeSlideIndex = 1;
      Storage.set(`editor/${scenario.id}`, editor);
    }

    const className = 'sc__card-action-labels';

    return (
      <Button.Group fluid>
        <Button
          tabIndex="0"
          aria-label="Run scenario"
          className="sc__button"
          size="tiny"
          basic
          icon
          as={Link}
          to={`/run/${scenario.id}/slide/${run.activeRunSlideIndex}`}
        >
          <Icon name="play" />
          <span className={className}>Run</span>
        </Button>
        {isLoggedIn && (
          <Fragment>
            <ConfirmAuth isAuthorized={isAuthorizedToEdit}>
              <Button
                tabIndex="0"
                size="tiny"
                basic
                icon
                as={Link}
                to={`/editor/${scenario.id}/${editor.activeTab}/${editor.activeSlideIndex}`}
                aria-label="Edit scenario"
                className="sc__button sc__hidden-on-mobile"
              >
                <Icon name="edit outline" />
                <span className={className}>Edit</span>
              </Button>
            </ConfirmAuth>
            <ConfirmAuth isAuthorized={isAuthorizedToReview}>
              <Button
                tabIndex="0"
                size="tiny"
                basic
                icon
                as={Link}
                to={`/editor/${scenario.id}/preview/${editor.activeSlideIndex}`}
                aria-label="Edit scenario"
                className="sc__button sc__hidden-on-mobile"
              >
                <Icon className="book reader icon" />
                <span className={className}>Review</span>
              </Button>
            </ConfirmAuth>
            {/*
            <ConfirmAuth isAuthorized={isAuthorizedToDelete}>
              <Button
                size="tiny"
                basic
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
            </ConfirmAuth>
            */}
            <ConfirmAuth requiredPermission="create_scenario">
              <Button
                tabIndex="0"
                size="tiny"
                basic
                icon
                as={Link}
                to={`/editor/copy/${scenario.id}`}
                aria-label="Copy scenario"
                className="sc__button sc__hidden-on-mobile"
              >
                <Icon name="copy outline" />
                <span className={className}>Copy</span>
              </Button>
            </ConfirmAuth>
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
    login: { isLoggedIn },
    user
  } = state;
  return { isLoggedIn, user };
};

const mapDispatchToProps = dispatch => ({
  deleteScenario: id => dispatch(deleteScenario(id))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ScenarioCardActions)
);
