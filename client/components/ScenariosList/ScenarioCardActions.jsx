import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Icon } from '@components/UI';
import Storage from '@utils/Storage';
import ConfirmAuth from '@client/components/ConfirmAuth';
import './ScenariosList.css';

class ScenarioCardActions extends Component {
  render() {
    const { isLoggedIn, scenario, user } = this.props;

    const isAuthorized =
      scenario.author_id === user.id || user.roles.includes('super_admin');

    const editor = Storage.get(`editor/${scenario.id}`, {
      activeTab: 'slides',
      activeSlideIndex: 1
    });
    const run = Storage.get(`run/${scenario.id}`, {
      // The title slide is slide 0
      activeRunSlideIndex: 0
    });

    const className = 'sc__card-action-labels';

    return (
      <Button.Group fluid>
        <Button
          basic
          icon
          as={Link}
          to={{
            pathname: `/run/${scenario.id}/slide/${run.activeRunSlideIndex}`
          }}
          aria-label="Run scenario"
          className="sc__button"
        >
          <Icon name="play" />
          <span className={className}>Run</span>
        </Button>
        {isLoggedIn && (
          <Fragment>
            <ConfirmAuth isAuthorized={isAuthorized}>
              <Button
                basic
                icon
                as={Link}
                to={{
                  pathname: `/editor/${scenario.id}/${editor.activeTab}/${editor.activeSlideIndex}`
                }}
                aria-label="Edit scenario"
                className="sc__button sc__hidden-on-mobile"
              >
                <Icon name="edit outline" />
                <span className={className}>Edit</span>
              </Button>
            </ConfirmAuth>
            <ConfirmAuth requiredPermission="create_scenario">
              <Button
                basic
                icon
                as={Link}
                to={{ pathname: `/editor/copy/${scenario.id}` }}
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

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioCardActions);
