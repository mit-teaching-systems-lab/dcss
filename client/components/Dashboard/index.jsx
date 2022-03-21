import React from 'react';
import { Button, Icon } from '@components/UI';

const SideNav = () => {
  return (
    <aside>
      <section>
        <p>Your tools</p>
        <ul>
          <li>
            <a href="#recent-scenarios">Recent scenarios</a>
          </li>
          <li>
            <a href="#recent-cohorts">Recent cohorts</a>
          </li>
        </ul>
      </section>
      <section>
        <p>Knowledge Center</p>
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
    <>
      <h1>Your Teacher Moments</h1>
      <div>
        <SideNav />
        <div>
          <RecentCohorts />
          <RecentScenarios />
          <LearnByExample />
          <QuickStartGuide />
          <GetInTouch />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
