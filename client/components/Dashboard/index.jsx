import './Dashboard.css';

import {
  Container,
  Divider,
  Header,
  List,
  Menu,
  Segment
} from '@components/UI';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BRAND_NAME } from '@utils/constants';
import { HashLink } from 'react-router-hash-link';
import LearnByExample from './LearnByExample';
import PropTypes from 'prop-types';
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

const QuickStartGuide = () => {
  return (
    <Container fluid id="quick-start-guide">
      <Header as="h2">Quick start guide</Header>
      <Header.Subheader className="dashboard-subheader">
        Learn to author and use {BRAND_NAME} scenarios.
      </Header.Subheader>
      <List ordered className="dashboard-list">
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1671Hfy4dIOjfPRrEr_-MWh_XRB7uZ2ACPiS8v1HWng4/edit#slide=id.gf16183f65e_0_54"
          >
            What Is {BRAND_NAME}?
          </a>
          <p>An overview of {BRAND_NAME} and ELK</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1GgTQMwtcYWYHzWjzQYdEtN3RiUCn8aF7NPn-6Eb7N6c/edit#slide=id.p"
          >
            Authoring a Scenario
          </a>
          <p>How to develop a basic scenario in {BRAND_NAME}</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1ySgJiD-jiKY68pQhvctL9qwc1ikwtAcFcFPXWUh0OY4/edit?usp=sharing"
          >
            Authoring the Different Components
          </a>
          <p>How to incorporate different components on slides</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1UH8YRz1pvZE4hPkLXUmMaahbziVGsfpSXCQ3P-QgeeM/edit#slide=id.gf8c678fc5f_0_54"
          >
            Authoring in More Detail
          </a>
          <p>A more detailed look at authoring scenarios for one player</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1QM32ZAxT-NtRM7aInkqB7DKRweOWyQwluqgd79m352I/edit#slide=id.gf325c6b0ac_0_108"
          >
            Creating a Cohort
          </a>
          <p>How to manage your classroom and discussions with cohorts</p>
        </List.Item>
        <List.Item>
          <a
            className="dashboard-list__title"
            href="https://docs.google.com/presentation/d/1sKfDO0J6t4uxYWM-Bi1r_UJifPFOG1u_1U2hHEVsuzc/edit?usp=sharing"
          >
            Teaching with Simulations
          </a>
          <p>How to use responses from your cohort to facilitate discussion</p>
        </List.Item>
      </List>
      <Segment padded className="dashboard-cta">
        <p>
          Learn more about deeper features like branching and multiplayer
          scenarios in our resource center.
        </p>
        <a href="https://drive.google.com/drive/folders/1A3MxYpjPXSPndW3wMwAUXonZh6kFKYmG?usp=sharing">
          Go to resource center →
        </a>
      </Segment>
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
      <h1>Your Dashboard</h1>
      <div className="dashboard-container">
        <SideNav showScenarios={showScenarios} showCohorts={showCohorts} />
        <div className="dashboard-main">
          {participantOnly && <AuthoringPermissionsNote />}

          <RecentCohorts cohorts={cohorts} />
          {showScenarios && <RecentScenarios />}
          <LearnByExample />
          <QuickStartGuide />
          <GetInTouch />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
