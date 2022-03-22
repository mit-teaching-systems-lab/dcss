import React from 'react';
import { Button, Icon } from '@components/UI';
import './Dashboard.css';

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

const RecentCohorts = () => {
  return (
    <section id="recent-cohorts">
      <div>
        <h2>Your most recent cohorts</h2>
        <Button
          icon
          primary
          labelPosition="left"
          name="Create a new cohort"
          size="small"
          href="/"
          as="a"
        >
          <Icon name="add" />
          Create a new cohort
        </Button>
        <Button size="small" href="/">
          View all cohorts
        </Button>
      </div>
    </section>
  );
};

const RecentScenarios = () => {
  return (
    <section id="recent-scenarios">
      <div>
        <h2>Your most recent scenarios</h2>
        <Button
          icon
          primary
          labelPosition="left"
          name="Create a new cohort"
          size="small"
          href="/"
          as="a"
        >
          <Icon name="add" />
          Create a new scenario
        </Button>
        <Button size="small" href="/scenarios">
          View all scenarios
        </Button>
      </div>
    </section>
  );
};

const LearnByExample = () => {
  return (
    <section id="learn-by-example">
      <div>
        <h2>Learn by example</h2>
        <p>
          Run or copy example scenarios created by the team to learn all the
          features of Teacher Moments.
        </p>
      </div>
    </section>
  );
};

const QuickStartGuide = () => {
  return (
    <section id="quick-start-guide">
      <div>
        <h2>Quick start guide</h2>
        <p>Onboard onto Teacher Moments using with step-by-step decks.</p>
      </div>
    </section>
  );
};

const GetInTouch = () => {
  return (
    <section id="get-in-touch">
      <div>
        <h2>Get in touch</h2>
        <p>
          Get in touch with the Teaching Systems Lab to learn more about events
          and synchronous learning.
        </p>
      </div>
    </section>
  );
};

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Your Teacher Moments</h1>
      <div className="dashboard-container">
        <SideNav />
        <div className="dashboard-main">
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
