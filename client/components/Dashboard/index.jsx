import './Dashboard.css';

import {
  Card,
  Container,
  Divider,
  Header,
  List,
  Menu,
  Segment
} from '@components/UI';

import { HashLink } from 'react-router-hash-link';
import LearnByExample from './LearnByExample';
import React from 'react';
import RecentCohorts from './RecentCohorts';
import RecentScenarios from './RecentScenarios';
import RequestPermissionsLink from './RequestPermissionsLink';
import { isParticipantOnly } from '../../util/Roles';
import { useSelector } from 'react-redux';

const SideNav = () => {
  return (
    <Container fluid className="dashboard-sidenav">
      <Menu text vertical className="dashboard-sidenav__section">
        <Menu.Item header className="dashboard-sidenav__subtitle">
          Your tools
        </Menu.Item>
        <Menu.Item>
          <HashLink to="#recent-scenarios">Recent scenarios</HashLink>
        </Menu.Item>
        <Menu.Item>
          <HashLink to="#recent-cohorts">Recent cohorts</HashLink>
        </Menu.Item>
      </Menu>
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

const AuthoringPermissionsNote = () => {
  return (
    <Container fluid className="dashboard-cta">
      <p>
        Cohorts and scenario creation is only available to authors. Get in touch
        with the Teacher Moments team by filling out our request form to become
        an author.
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
        Learn to author and use Teacher Moments scenarios.
      </Header.Subheader>
      <List ordered className="dashboard-grid dashboard-grid--numbered">
        <List.Item>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">What Is Teacher Moments?</p>
            <p>An overview of Teacher Moments and ELK</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1671Hfy4dIOjfPRrEr_-MWh_XRB7uZ2ACPiS8v1HWng4/edit#slide=id.gf16183f65e_0_54"
            >
              Go to guide →
            </a>
          </Card>
        </List.Item>
        <List.Item>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Authoring a Scenario</p>
            <p>How to develop a basic scenario in Teacher Moments</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1GgTQMwtcYWYHzWjzQYdEtN3RiUCn8aF7NPn-6Eb7N6c/edit#slide=id.p"
            >
              Go to guide →
            </a>
          </Card>
        </List.Item>
        <List.Item>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">
              Authoring the Different Components
            </p>
            <p>How to incorporate different components on slides</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1ySgJiD-jiKY68pQhvctL9qwc1ikwtAcFcFPXWUh0OY4/edit?usp=sharing"
            >
              Go to guide →
            </a>
          </Card>
        </List.Item>
        <List.Item>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Authoring in More Detail</p>
            <p>A more detailed look at authoring scenarios for one player</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1UH8YRz1pvZE4hPkLXUmMaahbziVGsfpSXCQ3P-QgeeM/edit#slide=id.gf8c678fc5f_0_54"
            >
              Go to guide →
            </a>
          </Card>
        </List.Item>
        <List.Item>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Creating a Cohort</p>
            <p>How to manage your classroom and discussions with cohorts</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1QM32ZAxT-NtRM7aInkqB7DKRweOWyQwluqgd79m352I/edit#slide=id.gf325c6b0ac_0_108"
            >
              Go to guide →
            </a>
          </Card>
        </List.Item>
        <List.Item>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">Teaching with Simulations</p>
            <p>
              How to use responses from your cohort to facilitate discussion
            </p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1sKfDO0J6t4uxYWM-Bi1r_UJifPFOG1u_1U2hHEVsuzc/edit?usp=sharing"
            >
              Go to guide →
            </a>
          </Card>
        </List.Item>
      </List>
      <Segment padded secondary className="dashboard-cta">
        <p>
          Learn more about deeper features like branching and multiplayer
          scenarios in our resource center.
        </p>
        <a
          className="dashboard-card__link"
          href="https://drive.google.com/drive/folders/1A3MxYpjPXSPndW3wMwAUXonZh6kFKYmG?usp=sharing"
        >
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
      <Segment secondary padded className="dashboard-cta">
        <p>
          Email us at{' '}
          <a href="mailto:teachermoments@mit.edu">teachermoments@mit.edu</a> for
          any questions using Teacher Moments or to join our regular community
          events for synchronous learning.
        </p>
      </Segment>
    </Container>
  );
};

const Dashboard = () => {
  const user = useSelector(state => state.user);

  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>
      <div className="dashboard-container">
        <SideNav />
        <div className="dashboard-main">
          {isParticipantOnly(user) && <AuthoringPermissionsNote />}

          <RecentCohorts />
          {!isParticipantOnly(user) && <RecentScenarios />}
          <LearnByExample />
          <QuickStartGuide />
          <GetInTouch />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
