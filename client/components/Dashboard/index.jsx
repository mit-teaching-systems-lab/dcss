import './Dashboard.css';

import { Card, Container } from '@components/UI';

import LearnByExample from './LearnByExample';
import React from 'react';
import RecentCohorts from './RecentCohorts';
import RecentScenarios from './RecentScenarios';
import RequestPermissionsLink from './RequestPermissionsLink';
import { isParticipantOnly } from '../../util/Roles';
import { useSelector } from 'react-redux';

const SideNav = () => {
  return (
    <aside className="dashboard-sidenav">
      <section className="dashboard-sidenav__section">
        <p className="dashboard-sidenav__subtitle">Your tools</p>
        <ul>
          <li>
            <a href="#recent-scenarios">Recent scenarios</a>
          </li>
          <li>
            <a href="#recent-cohorts">Recent cohorts</a>
          </li>
        </ul>
      </section>
      <section className="dashboard-sidenav__section">
        <p className="dashboard-sidenav__subtitle">Knowledge Center</p>
        <ul>
          <li>
            <a href="#learn-by-example">Learn by example</a>
          </li>
          <li>
            <a href="#quick-start-guide">Quick start guide</a>
          </li>
          <li>
            <a href="#get-in-touch">Get in touch</a>
          </li>
        </ul>
      </section>
    </aside>
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
    <section id="quick-start-guide">
      <div className="dashboard-subheader">
        <h2>Quick start guide</h2>
        <p>Onboard onto Teacher Moments using with step-by-step decks.</p>
      </div>
      <ol className="dashboard-grid dashboard-grid--numbered">
        <li>
          <Card className="dashboard-card">
            <p className="dashboard-card__title">
              What Are Digital Clinical Simulations?
            </p>
            <p>An overview of Teacher Moments and ELK</p>
            <a
              className="dashboard-card__link"
              href="https://docs.google.com/presentation/d/1671Hfy4dIOjfPRrEr_-MWh_XRB7uZ2ACPiS8v1HWng4/edit#slide=id.gf16183f65e_0_54"
            >
              Go to guide →
            </a>
          </Card>
        </li>
        <li>
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
        </li>
        <li>
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
        </li>
        <li>
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
        </li>
        <li>
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
        </li>
        <li>
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
        </li>
      </ol>
      <div className="dashboard-cta">
        <p>
          Learn more about deeper features like branching and multiplayer
          scenarios in our resource center.
        </p>
        <a className="dashboard-card__link" href="#">
          Go to resource center →
        </a>
      </div>
    </section>
  );
};

const GetInTouch = () => {
  return (
    <section id="get-in-touch">
      <div className="dashboard-subheader">
        <h2>Get in touch</h2>
      </div>
      <div className="dashboard-cta">
        <p>
          Email us at{' '}
          <a href="mailto:teachermoments@mit.edu">teachermoments@mit.edu</a> for
          any questions using Teacher Moments or to join our regular community
          events for synchronous learning.
        </p>
      </div>
    </section>
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
          <RecentScenarios />
          <LearnByExample />
          <QuickStartGuide />
          <GetInTouch />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
