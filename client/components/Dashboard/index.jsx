import './Dashboard.css';

import { Container, Divider, Header, Menu, Segment } from '@components/UI';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BRAND_NAME } from '@utils/constants';
import { HashLink } from 'react-router-hash-link';
import LearnByExample from './LearnByExample';
import PropTypes from 'prop-types';
import QuickStartGuide from './QuickStartGuide';
import RecentCohorts from './RecentCohorts';
import RecentScenarios from './RecentScenarios';
import RequestPermissionsLink from './RequestPermissionsLink';
import { getRecentCohorts } from '@actions/cohort';
import { isParticipantOnly } from '../../util/Roles';

const SideNav = ({ showCohorts, showScenarios }) => {
  const showToolsHeading = showCohorts || showScenarios;

  return (
    <Container fluid className="dashboard-sidenav">
      {showToolsHeading && (
        <Menu text vertical className="dashboard-sidenav__section">
          <Menu.Item header className="dashboard-sidenav__subtitle">
            Your tools
          </Menu.Item>
          {showScenarios && (
            <Menu.Item>
              <HashLink to="#recent-scenarios">Recent scenarios</HashLink>
            </Menu.Item>
          )}
          {showCohorts && (
            <Menu.Item>
              <HashLink to="#recent-cohorts">Recent cohorts</HashLink>
            </Menu.Item>
          )}
        </Menu>
      )}
      <Menu text vertical className="dashboard-sidenav__section">
        <Menu.Item header className="dashboard-sidenav__subtitle">
          Knowledge Center
        </Menu.Item>
        <Menu.Item>
          <HashLink to="#learn-by-example">Learn by example</HashLink>
        </Menu.Item>
        <Menu.Item>
          <HashLink to="#quick-start-guide">Quick start guide</HashLink>
        </Menu.Item>
        <Menu.Item>
          <HashLink to="#get-in-touch">Get in touch</HashLink>
        </Menu.Item>
      </Menu>
    </Container>
  );
};

SideNav.propTypes = {
  showCohorts: PropTypes.bool,
  showScenarios: PropTypes.bool
};

const AuthoringPermissionsNote = () => {
  return (
    <Container fluid className="dashboard-cta">
      <p>
        Cohorts and scenario creation is only available to authors. Get in touch
        with the {BRAND_NAME} team by filling out our request form to become an
        author.
      </p>
      <RequestPermissionsLink>Fill out request form →</RequestPermissionsLink>
    </Container>
  );
};

const GetInTouch = () => {
  return (
    <Container fluid id="get-in-touch">
      <Header as="h2">Get in touch</Header>
      <Divider />
      <Segment padded className="dashboard-cta">
        <p>
          Email us at{' '}
          <a href="mailto:teachermoments@mit.edu">teachermoments@mit.edu</a> for
          any questions using {BRAND_NAME} or to join our regular community
          events for synchronous learning.
        </p>
      </Segment>
    </Container>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const participantOnly = isParticipantOnly(user);
  const showScenarios = !participantOnly;

  useEffect(() => {
    dispatch(getRecentCohorts());
  }, [dispatch]);

  const cohorts = useSelector(state => state.recentCohorts);

  const showCohorts = cohorts.length > 0 || !participantOnly;

  return (
    <div className="dashboard">
      <Header as="h1">Your {BRAND_NAME}</Header>
      <Divider className="top" />
      <div className="dashboard-container">
        <SideNav showScenarios={showScenarios} showCohorts={showCohorts} />
        <div className="dashboard-main">
          {participantOnly && <AuthoringPermissionsNote />}

          {showScenarios && <RecentScenarios />}
          <RecentCohorts cohorts={cohorts} />
          <LearnByExample />
          <QuickStartGuide />
          <GetInTouch />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
